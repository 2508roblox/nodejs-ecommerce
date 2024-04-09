const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth.middleware');

// Kết nối tới MongoDB

// Định nghĩa schema cho category
const categorySchema = new mongoose.Schema({
    name: String,
    image: String
});

// Define category schema


// Create model from the schema
const Category = mongoose.model('Category', categorySchema);

router.get('/', async(req, res) => {
    try {
        // Retrieve all categories from MongoDB
        const categories = await Category.find({});
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/',authMiddleware,  async(req, res) => {
    const { name, image } = req.body;

    try {
        // Create a new category
        const newCategory = new Category({
            name: name,
            image: image
        });

        // Save the category to MongoDB
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id',authMiddleware, async(req, res) => {
    const categoryId = req.params.id;
    console.log('check ===', categoryId)

    try {
        // Delete category from MongoDB based on ID
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (deletedCategory) {
            res.json(deletedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', authMiddleware, async(req, res) => {
    const categoryId = req.params.id;
    const { name, image } = req.body;

    try {
        // Find category in MongoDB and update with new information
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId, { name: name, image: image }, { new: true }
        );
        if (updatedCategory) {
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;