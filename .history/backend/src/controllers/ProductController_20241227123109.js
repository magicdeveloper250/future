                   
const ProductModel = require("../models/productModel");
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const InsertProduct =async  (req,res) => {
    try {
        const authHeaders = req.headers['authorization'] || req.headers['authorization'] ;
        const token = authHeaders && authHeaders.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided, unauthorized' });
        }
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });
        const userId = decoded.userId;
        const { productId } = req.params;
        const {
            productName,
            category,
            model,
            vehicle,
            size,
            description,
            price,
            warranty,
            conditions,
            status,
            images
        } = req.body;
            const uploadDir = path.join(__dirname, '../uploads/products');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const processedImages = await Promise.all(req.files.images.map(async (file) => {
                const fileExtension = path.extname(file.name);
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
                const filePath = path.join(uploadDir, fileName);

                await new Promise((resolve, reject) => {
                    fs.writeFile(filePath, file.data, (err) => {
                        if (err) reject(err);
                        resolve();
                    });
                });
                const imageUrl = `/uploads/products/${fileName}`;
                return imageUrl;
            }));

        let imagesString = processedImages.join(',');
        

        await new Promise((resolve, reject) => {
            ProductModel.CreateProduct(
                userId,
                productName,
                category,
                model,
                vehicle,
                size,
                imagesString,
                description,
                price,
                warranty,
                conditions,
                status,
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        return res.status(200).json({
            responseCode: 200,
            message: "Product created successfully",
        });

    } catch (error) {
        console.log(error)
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '../uploads/products', file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        return res.status(500).json({
            message: "Error creating product",
            error: error.message
        });
    }
};

const ViewAllProduct = (req,res) => {
    ProductModel.ViewProduct((err,results) => {
        if(err) res.status(500).json(err.message);
        return res.status(200).json(results);
    });
};

const ViewProductById = (req,res) => {
    const{productId} = req.params;
    ProductModel.ViewProdById(productId, (err,results) => {
        console.log('product results',results);
        if(err) res.status(500).json(err.message);
        return res.status(200).json({
            responseCode:200,
            response:results
        });
    })
};

const EditProduct = async (req, res) => {
    try {
        const authHeaders = req.headers['authorization'] || req.headers['authorization'] ;
        const token = authHeaders && authHeaders.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided, unauthorized' });
        }

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });

        const userId = decoded.userId;
        const { productId } = req.params;
        const {
            productName,
            category,
            model,
            vehicle,
            size,
            description,
            price,
            warranty,
            conditions,
            status
        } = req.body;

        const existingProduct = await new Promise((resolve, reject) => {
            ProductModel.ViewProdById(productId, (err, product) => {
                if (err) reject(err);
                resolve(product);
            });
        });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let images = existingProduct.images; 
        
        if (req.files?.images && req.files.images?.length > 0) {
            const uploadDir = path.join(__dirname, '../uploads/products');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const oldImages = existingProduct.images.split(',');
            oldImages.forEach(oldImage => {
                const oldPath = path.join(__dirname, '..', oldImage);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            });

            const processedImages = await Promise.all(req.files.images.map(async (file) => {
                const fileExtension = path.extname(file.name);
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
                const filePath = path.join(uploadDir, fileName);

                await new Promise((resolve, reject) => {
                    fs.writeFile(filePath, file.data, (err) => {
                        if (err) reject(err);
                        resolve();
                    });
                });

                return fileName;
            }));

            images = processedImages.join(',');
        }

        const lastUpdated = new Date().toISOString().slice(0, 19).replace("T", " ");
        await new Promise((resolve, reject) => {
            ProductModel.UpdateProduct(
                productName,
                category,
                model,
                vehicle,
                size,
                images,
                description,
                price,
                warranty,
                conditions,
                status,
                lastUpdated,
                productId,
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        return res.status(200).json({
            responseCode: 200,
            message: "Product updated successfully",
            response: {
                productId,
                productName,
                category,
                model,
                vehicle,
                size,
                images,
                description,
                price,
                warranty,
                conditions,
                status,
                lastUpdated
            }
        });

    } catch (error) {
        console.log(error)
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '../uploads/products', file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        return res.status(500).json({
            message: "Error updating product",
            error: error.message
        });
    }
};


const RemoveProduct = async(req,res) => {
    const {productId} = req.params;
    const existingProduct = await new Promise((resolve, reject) => {
        ProductModel.ViewProdById(productId, (err, product) => {
            if (err) reject(err);
            resolve(product);
        });
    });

    if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const oldImages = existingProduct.images.split(',');
    if (oldImages.length>0 && oldImages[0]!==""){
        oldImages.forEach(oldImage => {
            const oldPath = path.join(__dirname, '..', oldImage);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        });
    }
   
   await new Promise((resolve, reject) => {
    ProductModel.DeleteProduct(productId,existingProduct.categoryId,(err,results) => {
        if(err) return reject(err);
        resolve(results);
        
      });
   });
   return res.status(200).json({
          responseCode:201,
          message:"product deleted successfully",
        });
};

const Message = async(req,res) => {
    const io = req.app.get('io');
    const{productId,email,phone,location,message} = req.body;
    await new Promise((resolve, reject) => {
        ProductModel.AddMessage(productId,email,phone,location,message,(err,results) => {
            if (err) reject(err);
            resolve(results);

            io.emit('newMessage', {
                productId,
                email,
                phone,
                location,
                message,
                timestamp: new Date(),
                messageId: results.insertId  
            });
            
        });
    })

    return res.status(200).json({
        responseCode: 200,
        message: "Message sent successfully",
    }); 
    
}



const ViewAllMessages = (req,res) => {
    ProductModel.ViewMessages((err,results) => {
        if(err) res.status(500).json(err.message);
        return res.status(200).json(results);
    });
};
const bestSellingProduct = (req,res) => {
    ProductModel.getBestSeller((err,results) => {
        if(err) res.status(500).json(err.message);
        return res.status(200).json(results);
    });
};

const todayDeals = (req,res) => {
    ProductModel.getTodayDeals((err,results) => {
        if(err) res.status(500).json(err.message);
        return res.status(200).json(results);
    });
};

const ShowMessageById = (req,res) => {
    const{messageId} = req.params;
    ProductModel.ViewMessageById(messageId, (err,results) => {
        console.log('product results',results);
        if(err) res.status(500).json(err.message);
        return res.status(200).json({
            responseCode:200,
            response:results
        });
    })
};

const RemoveMessages = async(req,res) => {
    const {messageId} = req.params;
    await new Promise((resolve, reject) => {
        ProductModel.DeleteMessages(messageId,(err,results) => {
            if(err) reject(err.message);
            resolve(results);
           
          });
    });
    return res.status(200).json({
        responseCode:201,
        message:"Message deleted successfully",
      });
};


const CreateCategories = async(req, res) => {
    const { categoryName, categoryDescription } = req.body;
    const categoryImage = req.files.categoryImage;
    
    if (!categoryImage) {
        return res.status(400).json({ message: "Category image is required." });
    }

    if (!categoryName) {
        return res.status(400).json({ message: "Category name is required." });
    }

    const uploadDir = path.join(__dirname, '../uploads/categories');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    await new Promise((resolve, reject)=>{
        const fileExtension = path.extname(categoryImage.name);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFile(filePath, categoryImage.data, (err) => {
        if (err) {
            return res.status(500).json({
                message: "Error saving image file",
                error: err.message
            });
        }
        const imageUrl = `/uploads/categories/${fileName}`;
        ProductModel.AddCategories(
            categoryName,
            categoryDescription,
            imageUrl,
            (err, results) => {

                if (err) {
                    fs.unlink(filePath, () => {});
                     reject({
                        message: "Error saving category to database" +err,
                        error: err.message
                    })
                }
                resolve(results)
            }
        );
    });
    })
    return res.status(201).json({
        responseCode: 201,
        message: "Category added successfully",
        
    });
};


const ShowCategories = (req,res) => {
    ProductModel.SelectCategory((err,results) => {
        if(err) res.status(500).json(err.message);
        return res.status(200).json(results);
    });
};

const ShowCategoriesById = (req,res) => {
    const {categoryId} = req.params;
    ProductModel.SelectCategoryById(categoryId,(err,results) => {
      if(err) return res.status(500).json(err.message);
      return res.status(200).json({
        responseCode:201,
        response:results
      });
    });
};
const RemoveCategories = (req,res) => {
    const {categoryId} = req.params;
    ProductModel.RemoveCategory(categoryId,(err,results) => {
      if(err) return res.status(500).json(err.message);
      return res.status(200).json({
        responseCode:201,
        message:"category deleted successfully",
      });
    });
};

 

const EditCategories = (req, res) => {
    const categoryId = req.params.categoryId;
    const { categoryName, categoryDescription } = req.body;
    const categoryImage = req.files ? req.files.categoryImage : null;

    ProductModel.SelectCategoryById(categoryId, (err, category) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving category",
                error: err.message
            });
        }

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        let imageUrl = category.categoryImage;  
        const processUpdate = () => {
            ProductModel.UpdateCategory(
                categoryName || category.categoryName,
                categoryDescription || category.description,
                imageUrl,
                categoryId,
                (err, results) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            message: "Error updating category",
                            error: err.message
                        });
                    }

                    return res.status(200).json({
                        responseCode: 200,
                        message: "Category updated successfully",
                        response: {
                            ...results,
                            imageUrl
                        }
                    });
                }
            );
        };

        if (categoryImage) {
            const uploadDir = path.join(__dirname, '../uploads/categories');
            const fileExtension = path.extname(categoryImage.name);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            if (category.categoryImage) {
                const oldFilePath = path.join(__dirname, '..', category.categoryImage);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            fs.writeFile(filePath, categoryImage.data, (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error saving new image file",
                        error: err.message
                    });
                }

                imageUrl = `/uploads/categories/${fileName}`;
                processUpdate();
            });
        } else {
            processUpdate();
        }
    });
};



const DeleteCategory = (req, res) => {
    const categoryId = req.params.id;

    ProductModel.SelectCategoryById(categoryId, (err, category) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving category",
                error: err.message
            });
        }

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        ProductModel.RemoveCategory(categoryId, (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Error deleting category",
                    error: err.message
                });
            }

            if (category.imageUrl) {
                const filePath = path.join(__dirname, '..', category.imageUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            return res.status(200).json({
                responseCode: 200,
                message: "Category deleted successfully",
                response: results
            });
        });
    });
};

const updateMessageStatus=(req, res)=>{
    const messageId = req.params.messageId;
    ProductModel.updateMessageStatus(messageId, (err, message) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving category",
                error: err.message
            });
        }
        return res.status(200).json({
            responseCode: 200,
            message: "message read successfully",
            
        });
         

         
    });

}

 

module.exports= {InsertProduct,ViewAllProduct,ViewProductById,EditProduct,RemoveProduct,
    Message,RemoveMessages,ShowMessageById,ViewAllMessages,EditCategories
,RemoveCategories,ShowCategories,CreateCategories,ShowCategoriesById, DeleteCategory, updateMessageStatus, bestSellingProduct, todayDeals};