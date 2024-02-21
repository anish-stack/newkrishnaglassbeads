const express = require('express');
const authenticateUser = require('../middleware/authmiddleware');
const { register, login, forgetPassword, logout } = require('../controllers/Usercontroller');
const { addProduct,updateProductById,sortProductsByCategory,sortProductsByPrice,deleteProductById,getAllProductsWithPagination, getProductById } = require('../controllers/ProductController');
const { newPayment, checkStatus } = require('../controllers/PaymentController');
const { createOrder } = require('../controllers/Ordercontroller');
const router = express.Router();

// Register a new user
router.post('/register',register);

// Login
router.post('/login', login);

// Forget Password
router.post('/forget-password',forgetPassword);

// Logout
router.post('/logout', authenticateUser,logout);

// =========================================================
router.post('/add-product', addProduct);

// Update a product by ID
router.put('/update-product/:id', updateProductById);

// Sort products by category
router.get('/sort-products-by-category/:category', sortProductsByCategory);

// Sort products by price
router.get('/sort-products-by-price/sortBy', sortProductsByPrice);

// Delete a product by ID
router.delete('/delete-product/:id', deleteProductById);

// Get a single product by ID
router.get('/get-product/:id', getProductById);

// Get all products with pagination
router.get('/get-all-products', getAllProductsWithPagination);
router.post('/create-order', authenticateUser,createOrder);



router.post('/payment-create',authenticateUser,newPayment)
router.post('/status/:merchantTransactionId',checkStatus)

module.exports = router;
