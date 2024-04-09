// routes/category.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth.middleware');

// Mock data for categories


// Kết nối tới MongoDB

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: String,
    },
    image: {
        type: String,
    },
    category_id: {
        type: String,
    }
});

// Tạo mô hình từ schema
const Product = mongoose.model('Product', productSchema);

//get all

// Get all products
router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
});
router.get('/:id', async(req, res) => {
    try {
        const productId = req.params.id;
        const products = await Product.findById(productId);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
});

// Create a new product
router.post('/', authMiddleware, async(req, res) => {
    try {
        const { name, price, image, category_id } = req.body;
        console.log({ name, price, image, category_id })
        const product = new Product({ name, price, image, category_id });
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Update a product
router.put('/:id',authMiddleware,  async(req, res) => {
    try {
        const { name, price, image, category_id } = req.body;
        const productId = req.params.id;

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name,
            price,
            image,
            category_id
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
});

// Delete a product
router.delete('/:id',authMiddleware,  async(req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

module.exports = router;