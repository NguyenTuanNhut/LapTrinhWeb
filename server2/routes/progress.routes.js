// routes/progress.routes.js
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/authMiddleware');
const { checkValidId } = require('../middleware/validationMiddleware');

// @desc    Lấy tiến độ theo query params (userId, courseId)
// @route   GET /progress?userId=&courseId=
// @access  Public (hoặc Private tùy ý)
router.get('/', async (req, res) => {
    try {
        const { userId, courseId } = req.query;
        console.log('[GET /progress] userId:', userId, 'courseId:', courseId);
        
        const query = {};
        if (userId) query.userId = userId;
        if (courseId) query.courseId = courseId;
        
        const progress = await Progress.find(query);
        console.log('[GET /progress] Found:', progress.length);
        res.json(progress);
    } catch (error) {
        console.error('[GET /progress] Error:', error.message);
        res.status(500).json({ message: 'Lỗi Server khi lấy tiến độ.' });
    }
});

// @desc    Lấy tiến độ của người dùng hiện tại theo Course ID
// @route   GET /progress/course/:courseId
// @access  Private
router.get('/course/:courseId', protect, checkValidId, async (req, res) => {
    try {
        const progress = await Progress.find({ 
            userId: req.user._id, 
            courseId: req.params.courseId 
        }).populate('lessonId');
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy tiến độ.' });
    }
});

// @desc    Đánh dấu một Lesson là hoàn thành
// @route   POST /progress
// @access  Public (hoặc Private)
router.post('/', async (req, res) => {
    const { userId, courseId, lessonId, completedAt, sectionId } = req.body;
    try {
        console.log('[POST /progress] userId:', userId, 'courseId:', courseId, 'lessonId:', lessonId || sectionId);

        const payload = {
            userId,
            courseId,
            lessonId: lessonId || sectionId, // backward-compatible
            completedAt: completedAt || new Date(),
        };

        if (!payload.userId || !payload.courseId || !payload.lessonId) {
            return res.status(400).json({ message: 'Thiếu userId / courseId / lessonId' });
        }

        const saved = await new Progress(payload).save();
        console.log('[POST /progress] Saved:', saved._id);
        res.status(201).json(saved);
    } catch (error) {
        console.error('[POST /progress] Error:', error.message);
        res.status(400).json({ message: 'Cập nhật tiến độ thất bại.', error: error.message });
    }
});

module.exports = router;