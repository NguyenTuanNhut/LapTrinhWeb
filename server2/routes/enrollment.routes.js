// routes/enrollment.routes.js
const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/authMiddleware');
const { checkValidId } = require('../middleware/validationMiddleware'); 

// @desc    Lấy TẤT CẢ các đăng ký (Public - để đếm học viên per khóa)
// @route   GET /enrollments/all
// @access  Public
router.get('/all', async (req, res) => {
    try {
        const enrollments = await Enrollment.find({});
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy danh sách đăng ký.' });
    }
});

// @desc    Lấy các khóa học mà user hiện tại đã đăng ký
// @route   GET /enrollments/user/me
// @access  Private
// CÒN PHẢI ĐẶT TRƯỚC route GET / để tránh :id bắt "me"
router.get('/user/me', protect, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user._id }).populate('courseId');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy danh sách đăng ký.' });
    }
});

// @desc    Lấy tất cả các khóa học mà người dùng hiện tại đã đăng ký
// @route   GET /enrollments 
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // userId được lấy từ req.user._id do middleware 'protect' thiết lập
        const enrollments = await Enrollment.find({ userId: req.user._id }).populate('courseId');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy danh sách đăng ký.' });
    }
});

// @desc    Đăng ký một khóa học mới
// @route   POST /enrollments
// @access  Private
router.post('/', protect, async (req, res, next) => {
    console.log('[POST /enrollments] Request body:', req.body);
    console.log('[POST /enrollments] req.user:', req.user ? req.user._id : 'NO_USER');
    
    const { courseId } = req.body;
    const mongoose = require('mongoose');
    
    console.log('[POST /enrollments] courseId:', courseId, 'type:', typeof courseId);
    
    // Kiểm tra courseId không được rỗng
    if (!courseId) {
        console.log('[POST /enrollments] Missing courseId');
        return res.status(400).json({ message: 'Course ID là bắt buộc.' });
    }

    try {
        // Chuyển đổi courseId sang ObjectId nếu là string
        const isValidId = mongoose.Types.ObjectId.isValid(courseId);
        console.log('[POST /enrollments] isValidId:', isValidId);
        
        if (!isValidId) {
            console.log('[POST /enrollments] Invalid courseId format');
            return res.status(400).json({ message: 'Course ID không hợp lệ.' });
        }

        // Kiểm tra xem đã đăng ký chưa
        console.log('[POST /enrollments] Checking existing enrollment...');
        const exists = await Enrollment.findOne({ 
            userId: req.user._id, 
            courseId 
        });
        if (exists) {
            console.log('[POST /enrollments] Already enrolled, returning existing enrollment');
            return res.status(200).json(exists); // Trả về enrollment hiện tại thay vì error
        }

        console.log('[POST /enrollments] Creating enrollment...');
        const enrollment = new Enrollment({
            userId: req.user._id,
            courseId,
            enrolledAt: new Date(),
        });
        const createdEnrollment = await enrollment.save();
        console.log('[POST /enrollments] Success:', createdEnrollment._id);
        res.status(201).json(createdEnrollment);
    } catch (error) {
        console.error('[POST /enrollments] Error:', error.message);
        console.error('[POST /enrollments] Stack:', error.stack);
        res.status(400).json({ message: 'Đăng ký khóa học thất bại.', error: error.message });
    }
});

module.exports = router;