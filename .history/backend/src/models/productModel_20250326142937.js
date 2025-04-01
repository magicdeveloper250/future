const DbConnection = require("../db/DbConnection");

const createProductWithCategoryUpdate = (connection, productData) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
            if (err) {
                return reject(err);
            }

            const {
                userId,
                productName,
                categoryId,
                type_model,
                vehicleCompatible,
                size,
                images,
                description,
                price,
                warrantyPeriod,
                conditions,
                status
            } = productData;

            const insertProductSql = `
                INSERT INTO product(
                    userId,
                    productName,
                    categoryId,
                    type_model,
                    vehicleCompatible,
                    size,
                    images,
                    description,
                    price,
                    warrantyPeriod,
                    conditions,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(
                insertProductSql,
                [
                    userId,
                    productName,
                    categoryId,
                    type_model,
                    vehicleCompatible,
                    size,
                    images,
                    description,
                    price,
                    warrantyPeriod,
                    conditions,
                    status
                ],
                (err, productResult) => {
                    if (err) {
                        return connection.rollback(() => reject(err));
                    }

                    const updateCategorySql = `
                        UPDATE categories 
                        SET categoryCount = categoryCount + 1 
                        WHERE categoryId = ?
                    `;

                    connection.query(
                        updateCategorySql,
                        [categoryId],
                        (err, categoryResult) => {
                            if (err) {
                                return connection.rollback(() => reject(err));
                            }
                            connection.commit(err => {
                                if (err) {
                                    return connection.rollback(() => reject(err));
                                }

                                resolve({
                                    productId: productResult.insertId,
                                    categoryUpdate: categoryResult.affectedRows
                                });
                            });
                        }
                    );
                }
            );
        });
    });
};

const CreateProduct =async (userid,productName,category,model,vehicle,size,images,description,price,warranty
    ,conditions,status,callback) => {
        try {
            const result = await createProductWithCategoryUpdate(DbConnection, {
                userId: userid,
                productName: productName,
                categoryId: category,
                type_model: model,
                vehicleCompatible: vehicle,
                size: size,
                images: images,
                description: description,
                price: price,
                warrantyPeriod: warranty,
                conditions: conditions,
                status: status
            });
    
           return callback(null, result)
    
        } catch (error) {
            return callback(error, null)
        }
};

const ViewProduct = (callback) => {
    const sql = "SELECT * FROM product";
    DbConnection.query(sql, (err,results) => {
        if(err) return callback(err,null);
        return callback(null,results);
    });
};

const ViewProdById = (productId,callback) => {
    const sql = "SELECT * FROM product WHERE productId=?";
    DbConnection.query(sql,[productId], (err,results) => {
        if(err) return callback(err,null);
        return callback(null,results[0]);
        
    });
    
};

const UpdateProduct = async(productName,category,model,vehicle,size,images,description,price,warranty
    ,conditions,status,lastUpdate,productId,callback) => {

        const sql = "UPDATE product SET productName = ?,categoryId = ?,type_model = ?,vehicleCompatible = ?,size = ?,images = ?,description = ?,price = ?,"+
        "warrantyPeriod = ?,conditions = ?,status = ?,updatedDate = ? WHERE productId = ?";

    DbConnection.query(sql, [productName,category,model,vehicle,size,images,description,price,warranty
        ,conditions,status,lastUpdate,productId] , (err,results) => {
            if(err) return callback(err,null);
            return callback(null,results);
        });
};

const DeleteProduct = async(id,categoryId, callback) => {
   return new Promise((resolve, reject) => {
    DbConnection.beginTransaction((err) => {
        if(err) return callback(err,null);
        const sql = "DELETE FROM product WHERE productId = ?";
        DbConnection.query(sql,[id],(err,productResult) => {
         if(err) return callback(err,null);
            });
    
        const updateCategorySql = `
                            UPDATE categories 
                            SET categoryCount = categoryCount - 1 
                            WHERE categoryId = ?
                        `;
    
        DbConnection.query(
            updateCategorySql,
            [categoryId],
            (err, categoryResult) => {
                if (err) {
                    return DbConnection.rollback(() => reject(err));
                }
                DbConnection.commit(err => {
                    if (err) {
                        return DbConnection.rollback(() => reject(err));
                    }
                    return callback(null,{
                        productId: id,
                        categoryUpdate: categoryResult.affectedRows
                    });
                });
            }
        );
    
       });
   });
};

const AddMessage = async(productId,email,phone,location,message,callback) => {
    return new Promise((resolve, reject) => {
        DbConnection.beginTransaction((err) => {
            if(err) return callback(err,null);
            const sql= "INSERT INTO messages(productId,Email,Telephone,Location,Message) VALUES(?,?,?,?,?)";
            DbConnection.query(sql,[productId,email,phone,location,message],(err,results) => {
                if(err) return callback(err,null);
                return callback(null,results);
            });
            const updateProductSql = `
                                UPDATE product 
                                SET requests = requests + 1 
                                WHERE productId = ?
                            `;
            DbConnection.query(
                updateProductSql,
                [productId],
                (err, productResult) => {
                    if (err) {
                        return DbConnection.rollback(() => reject(err));
                    }
                    DbConnection.commit(err => {
                        if (err) {
                            return DbConnection.rollback(() => reject(err));
                        }
                        return callback(null,{
                            result: productResult.affectedRows
                        });
                    });
                }
            );
       });
    });    
    
}

const ViewMessages = (callback) => {
    const sql = "SELECT * FROM messages";
    DbConnection.query(sql, (err,results) => {
        if(err) return callback(err,null);
        return callback(null,results);
    })
}

const DeleteMessages = async(messageId,callback) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM messages WHERE messageId = ?";
        DbConnection.query(sql,[messageId],(err,results) => {
        if(err) return callback(err,null);
        return callback(null,results);
        });
    });
}

const ViewMessageById = (messageId,callback) => {
    const sql = "SELECT * FROM messages WHERE messageId=?";
    DbConnection.query(sql,[messageId], (err,results) => {
        if(err) return callback(err,null);
        
        if (results[0]) {
            UpdateMessageStatus(messageId, (updateErr) => {
                if (updateErr) {
                    console.error('Error updating message status:', updateErr);
                    // Still return the message even if status update fails
                    // return callback(null, results[0]);
                }
                return callback(null, results[0]);
            });
        } else {
            return callback(null, null); // No message found
        }
        
    });
    
};

const UpdateMessageStatus = async(messageId, callback) => {
        const updateSql = "UPDATE messages SET status = 'inactive' WHERE messageId = ?";

    DbConnection.query(updateSql, [messageId], (err, result) => {
        if (err) return callback(err);

        if (result.affectedRows === 0) {
            return callback(new Error('No message found with the given ID'));
        }
        
        return callback(null);
    });
};

const AddCategories = (name,description, image, callback) => {
   const sql = "INSERT INTO categories(categoryName, description, categoryImage) VALUES(?,?,?)";
   DbConnection.query(sql,[name, description, image],(err,results) => {
    if(err) return callback(err,null);
     return callback(null,results);
   });
}

const getBestSeller = (callback) => {
   const sql = `SELECT *
                FROM product
                ORDER BY requests DESC
                LIMIT 5;`;
   DbConnection.query(sql,(err,results) => {
    if(err) return callback(err,null);
     return callback(null,results);
   });
}


const getTodayDeals = (callback) => {
    const sql = `SELECT p.*, COUNT(m.productId) as request_count
                    FROM product p
                    JOIN messages m ON p.productId = m.productId
                    WHERE DATE(m.time) = CURRENT_DATE 
                    GROUP BY p.productId
                    ORDER BY request_count DESC
                    LIMIT 5;`;
    DbConnection.query(sql,(err,results) => {
     if(err) return callback(err,null);
      return callback(null,results);
    });
 }

const SelectCategory = (callback) => {
    const sql = "SELECT * FROM categories";
    DbConnection.query(sql, (err,results) => {
        if(err) return callback(err,null);
        return callback(null,results);
    })
}

const SelectCategoryById = (categoryId,callback) => {
    const sql = "SELECT * FROM categories WHERE categoryId = ?";
    DbConnection.query(sql,[categoryId], (err,results) => {
        if(err) return callback(err,null);
        return callback(null,results[0]);
    })
}

const SelectProductsByCategoryId = (categoryId,callback) => {
    const sql = "SELECT * FROM product WHERE categoryId = ?";
    DbConnection.query(sql,[categoryId], (err,results) => {
        if(err) return callback(err,null);
        return callback(null,results);
    })
}
const RemoveCategory = (categoryId,callback) => {
    const sql = "DELETE FROM categories WHERE categoryId = ?";
    DbConnection.query(sql,[categoryId],(err,results) => {
     if(err) return callback(err,null);
     return callback(null,results);
    });
}

const UpdateCategory = (name,description, image,categoryId, callback) => {
    const sql = "UPDATE categories SET categoryName= ?, description=?, categoryImage=? WHERE categoryId = ? ";
    DbConnection.query(sql,[name,description, image, categoryId],(err,results) => {
     if(err) return callback(err,null);
      return callback(null,results);
    });
}
const updateMessageStatus=(messageId, callback)=>{
    const sql = "UPDATE messages SET status='read' WHERE messageId = ? ";
    DbConnection.query(sql,[messageId],(err,results) => {
     if(err) return callback(err,null);
      return callback(null,results);
    });

}
module.exports={CreateProduct,ViewProduct,ViewProdById,UpdateProduct,
    DeleteProduct,AddMessage,ViewMessages,DeleteMessages,ViewMessageById
,UpdateCategory,RemoveCategory,SelectCategory,AddCategories,SelectCategoryById, updateMessageStatus, getBestSeller, getTodayDeals, SelectProductsByCategoryId };