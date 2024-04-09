const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Kết nối tới MongoDB

// Định nghĩa schema cho cart
const cartSchema = new mongoose.Schema({

    quantity: Number,
    product_id: String,
    user_id: String
});

// Tạo model từ schema
const Cart = mongoose.model('Cart', cartSchema);

// Lấy danh sách các mặt hàng trong giỏ hàng
router.get('/', async(req, res) => {
    try {
        const items = await Cart.find({});
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Thêm một mặt hàng vào giỏ hàng
router.post('/', async(req, res) => {
    const { quantity, product_id, user_id } = req.body;

    try {
        const newItem = new Cart({
            product_id,
            user_id,
            quantity: quantity
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Xóa một mặt hàng khỏi giỏ hàng
router.delete('/:id', async(req, res) => {
    const itemId = req.params.id;

    try {
        const deletedItem = await Cart.findByIdAndDelete(itemId);
        if (deletedItem) {
            res.json(deletedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Cập nhật thông tin một mặt hàng trong giỏ hàng
router.put('/:id', async(req, res) => {
    const itemId = req.params.id;
    const { name, price, quantity } = req.body;

    try {
        const updatedItem = await Cart.findByIdAndUpdate(
            itemId, { name: name, price: price, quantity: quantity }, { new: true }
        );
        if (updatedItem) {
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;