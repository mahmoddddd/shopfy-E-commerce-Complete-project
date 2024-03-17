const express = require('express');
const router = express.Router();
const { createBlog, deleteBlog, updateBlog, getBlog, getBlogs } = require('../controller/blogCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.post("/create", authMiddleware, isAdmin, createBlog);
router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteBlog);
router.get("/get-all", authMiddleware, isAdmin, getBlogs); // Corrected from getBlog
router.get("/get/:id", authMiddleware, isAdmin, getBlog); // Corrected from getBlogs




module.exports = router