const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Đảm bảo đường dẫn này đúng tới file model User của bạn
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Lấy danh sách user (dùng cho trang admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().lean();
    // Đảm bảo không trả password
    const sanitized = users.map(u => ({
      id: u._id,
      username: u.username,
      email: u.email,
      role: u.role,
      fullName: u.fullName,
      studentCode: u.studentCode,
      phone: u.phone,
      createdAt: u.createdAt,
    }));
    res.json(sanitized);
  } catch (error) {
    console.error('Lỗi lấy danh sách user:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách user', error: error.message });
  }
});

// Đăng ký (Register)
router.post('/register', async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password;
    
    // Validate cơ bản
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Thiếu username / email / password' });
    }

    // Kiểm tra user đã tồn tại (email hoặc username)
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'Email hoặc tên đăng nhập đã được sử dụng' });
    }

    // Tạo user mới (password sẽ được hash trong model nếu bạn đã cài hook pre-save, nếu chưa thì cần hash ở đây)
    // Giả sử model User của bạn đã xử lý hash password
    user = new User({ username, email, password });
    await user.save();

    // Tạo token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey123', { expiresIn: '1h' });

    // Trả về đúng format Frontend mong đợi
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Bắt lỗi trùng lặp key từ Mongo
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'Email hoặc tên đăng nhập đã tồn tại' });
    }
    // Bắt lỗi validation của Mongoose
    if (error?.name === 'ValidationError') {
      const details = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', details });
    }
    console.error('Lỗi server khi đăng ký:', { message: error.message, stack: error.stack });
    res.status(500).json({ message: 'Lỗi server khi đăng ký', error: error.message });
  }
});

// Tạo user (admin tạo học viên)
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role = 'user', fullName, studentCode, phone } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Thiếu username / email / password' });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ message: 'Email hoặc tên đăng nhập đã được sử dụng' });
    }

    const user = new User({ username, email, password, role, fullName, studentCode, phone });
    await user.save();

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      studentCode: user.studentCode,
      phone: user.phone,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'Email hoặc tên đăng nhập đã tồn tại' });
    }
    if (error?.name === 'ValidationError') {
      const details = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', details });
    }
    console.error('Lỗi tạo user:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo user', error: error.message });
  }
});

// Cập nhật user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, fullName, studentCode, phone } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (fullName !== undefined) user.fullName = fullName;
    if (studentCode !== undefined) user.studentCode = studentCode;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      studentCode: user.studentCode,
      phone: user.phone,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'Email hoặc tên đăng nhập đã tồn tại' });
    }
    if (error?.name === 'ValidationError') {
      const details = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', details });
    }
    console.error('Lỗi cập nhật user:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật user', error: error.message });
  }
});

// Xóa user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User không tồn tại' });
    res.json({ success: true });
  } catch (error) {
    console.error('Lỗi xóa user:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa user', error: error.message });
  }
});

// Đăng nhập (Login)
router.post('/login', async (req, res) => {
  try {
    // Cho phép đăng nhập bằng email hoặc username
    const { email, password } = req.body; // FE đang gửi "email" nhưng field này có thể là username
    const identifier = email?.trim();

    // Thiếu dữ liệu đầu vào
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/Tên đăng nhập và mật khẩu là bắt buộc' });
    }

    // 1. Tìm user theo email hoặc username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (!user.password) {
      console.error('User missing password field', { userId: user._id, email: user.email, username: user.username });
      return res.status(400).json({ message: 'Tài khoản không hợp lệ, vui lòng đăng ký lại' });
    }

    // 2. Kiểm tra mật khẩu (ưu tiên bcrypt). Nếu dữ liệu cũ đang lưu plaintext thì fallback.
    try {
      const isMatch = await bcrypt.compare(password, String(user.password));
      if (!isMatch) {
        // Fallback: nếu DB đang lưu plain text (tài khoản cũ chưa được hash)
        if (String(user.password) === password) {
          // Cho đăng nhập một lần và cố hash lại để lần sau an toàn
          try {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
          } catch (rehashErr) {
            console.error('Rehash password error (will still allow login):', rehashErr);
          }
        } else {
          return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
      }
    } catch (err) {
      console.error('bcrypt.compare error:', err);
      return res.status(500).json({ message: 'Lỗi xác thực mật khẩu' });
    }

    // 3. Tạo token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET || 'secretkey123', // Secret Key (nên để trong .env)
      { expiresIn: '1d' }
    );

    // 4. Trả về kết quả
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Lỗi login:", { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;