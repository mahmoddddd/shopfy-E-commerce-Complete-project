const slugify = require('slugify')

const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// creat product 
const createProduct = asyncHandler(async (req, res) => {
    try {

        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        // const product = new Product({
        //     price: req.body.price,
        //     description: req.body.description,
        //     slug: req.body.slug,
        //     title: req.body.title,
        //     quantity: req.body.quantity,

        // });
        const product = new Product(req.body)
        const exsistingProduc = await Product.findOne({ slug: product.slug })
        if (!exsistingProduc) {
            const savedProduct = await product.save();
            res.status(201).json(savedProduct);
        }
        throw new Error('product is already exsist')

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
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];

        excludeFields.forEach(el => delete queryObj[el]); // Corrected forEach syntax

        console.log(queryObj, req.query);

        const allProducts = await Product.find(allProductSearchIn);

        if (allProducts.length === 0) {
            return res.status(404).json('No products found');
        }

        res.json(allProducts);
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