const slugify = require('slugify')

const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');



// creat product 
const createProduct = asyncHandler(async (req, res) => {
    try {

        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }

        const product = new Product(req.body)

        const exsistingProduc = await Product.findOne({ slug: product.slug })


        if (exsistingProduc) {
            throw new Error('product is already exsist')

        } else {
            const savedProduct = await product.save();
            res.status(201).json(savedProduct);

        }

    } catch (error) {
        throw new Error(error);
    }
});







const getAproduct = asyncHandler(async (req, res) => {
    const { id } = req.params;


    if (req.body.title) {
        req.body.slug = slugify(req.body.title)
    }

    try {
        const foundProduct = await Product.findById(id)
        if (!foundProduct) {
            res.status(404).json('No product Found')
        }
        res.json(foundProduct)
    } catch (error) {
        throw new Error(error)
    }

})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        if (product) {
            const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
            await updateProduct.save()
            res.json(updateProduct)

        }
        res.status(404).json('Product Not found')
    } catch (error) {
        throw new Error(error)
    }

})

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)

    try {
        if (product) {
            const deletedProduct = await Product.findByIdAndDelete(id)
            res.json('product deleted succesfully')

        }
        res.status(404).json('Product Not found')
    } catch (error) {
        throw new Error(error)
    }

})


const getAllProducts = asyncHandler(async (req, res) => {
    const allProductSearchIn = req.query;
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        // Execute the Query
        const query = Product.find(JSON.parse(queryStr)); // Corrected typo here

        // Sorting 
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort('')
        }


        // Execute the Query and Send Response
        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createProduct,
    getAproduct,
    getAllProducts,
    updateProduct,
    deleteProduct

}