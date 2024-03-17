const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')


const createBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongoDbId()
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (error) {
        throw new Error(error);
    }
})
const updateBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const updateData = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(updatedBlog);
    } catch (error) {
        throw new Error(error);
    }
});


const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongoDbId()
        const deletedBolg = await Blog.findByIdAndDelete(id)
        if (!deletedBolg) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(deletedBolg)
    } catch (error) {
        throw new Error(error);
    }
})

const getBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        // Handle the error and send a meaningful response
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

const getBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id); // You need to pass the id to the validation function
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json(blog);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
});





module.exports = {
    createBlog,
    updateBlog
    , deleteBlog,
    getBlog, getBlogs
}     