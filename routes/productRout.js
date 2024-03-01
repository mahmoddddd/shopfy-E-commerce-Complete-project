const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createProduct, getAproduct, getAllProducts, updateProduct, deleteProduct } = require('../controller/productCtrl');


router.post('/create', authMiddleware, isAdmin, createProduct); // Only accessible to admin users
router.put('/:id', authMiddleware, isAdmin, updateProduct); // Only accessible to admin users
router.delete('/:id', authMiddleware, isAdmin, deleteProduct); // Only accessible to admin users
router.get('/getAll', authMiddleware, getAllProducts); // Accessible to all authenticated users
router.get('/:id', authMiddleware, getAproduct); // Accessible to all authenticated users

module.exports = router;
