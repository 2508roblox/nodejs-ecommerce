const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Kết nối tới MongoDB

// Định nghĩa schema cho order
const orderSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    address: String,
    email: String,
    phone_num: String,
    total_amount: String,
    status: {
        type: String,
        default: "đang chờ xác nhận"
    }
});

// Tạo model từ schema
const Order = mongoose.model('Order', orderSchema);

// Lấy danh sách các đơn hàng
router.get('/', async(req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Thêm một đơn hàng mới
router.post('/', async(req, res) => {
    const { firstname, lastname, address, email, phone_num, total_amount } = req.body;

    try {
        const newOrder = new Order({
            firstname: firstname,
            lastname: lastname,
            address: address,
            email: email,
            phone_num: phone_num,
            total_amount: total_amount
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Xóa một đơn hàng
router.delete('/:id', async(req, res) => {
    const orderId = req.params.id;

    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (deletedOrder) {
            res.json(deletedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Cập nhật thông tin một đơn hàng
router.put('/:id', async(req, res) => {
    const orderId = req.params.id;
    const { firstname, lastname, address, email, phone_num, total_amount, status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, {
                firstname: firstname,
                lastname: lastname,
                address: address,
                email: email,
                phone_num: phone_num,
                total_amount: total_amount,
                status: status
            }, { new: true }
        );
        if (updatedOrder) {
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;