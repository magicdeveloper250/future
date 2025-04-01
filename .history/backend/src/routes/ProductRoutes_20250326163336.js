const express = require("express");
const router = express.Router();
const ProdController = require("../controllers/ProductController");
const verifyJWT = require("../middlewares/verifyJWT");

router.post("/create-product", verifyJWT, ProdController.InsertProduct);
router.post("/update-product/:productId", verifyJWT, ProdController.EditProduct);
router.delete("/delete-product/:productId", verifyJWT, ProdController.RemoveProduct);
router.post("/create-category", verifyJWT, ProdController.CreateCategories);
router.put("/update-category/:categoryId", verifyJWT, ProdController.EditCategories);
router.delete("/delete-category/:categoryId", verifyJWT, ProdController.RemoveCategories);
 
router.get("/viewAll-product", ProdController.ViewAllProduct);
router.get("/best-selling", ProdController.bestSellingProduct);
router.get("/today-deals", ProdController.todayDeals);
router.get("/view-product/:productId", ProdController.ViewProductById);
router.post("/contact-us", ProdController.Message);
router.get("/view-messages", ProdController.ViewAllMessages);
router.put("/messages/:messageId/read", ProdController.updateMessageStatus);
router.get("/view-message/:messageId", ProdController.ShowMessageById);
router.delete("/messages/:messageId", ProdController.RemoveMessages);
router.get("/viewAll-categories", ProdController.ShowCategories);
router.get("/view-category/:categoryId", ProdController.ShowCategoriesById);
router.get("/view-category/:categoryId/products", ProdController.ShowProductsByCategoryId);
router.get("/search/", ProdController.ShowProductsByCategoryId);
module.exports = router;