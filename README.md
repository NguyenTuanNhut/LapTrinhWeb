Collecting workspace information# README - Hướng Dẫn Chi Tiết Dự Án Education Portal

## 📋 Mục Lục
1. Giới Thiệu Dự Án
2. Cấu Trúc Thư Mục
3. Yêu Cầu Hệ Thống
4. Cài Đặt và Chạy
5. Kiến Trúc Ứng Dụng
6. Hướng Dẫn Sử Dụng
7. API Documentation
8. Troubleshooting

---

## 🎓 Giới Thiệu Dự Án

**Education Portal** là một nền tảng học trực tuyến toàn diện cho phép:
- 👨‍🎓 Học viên: Đăng ký khóa học, xem video bài học, làm bài kiểm tra, đánh giá khóa học
- 👨‍💼 Quản trị viên: Quản lý khóa học, bài học, bài quiz, học viên và xem báo cáo
- 🔐 Xác thực: Đăng nhập/đăng ký an toàn với JWT token

---

## 📁 Cấu Trúc Thư Mục

```
DU_AN_WEB_PORTAL/
├── edu/                           # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── pages/                # Các trang chính
│   │   │   ├── Login.tsx          # Trang đăng nhập
│   │   │   ├── register.tsx       # Trang đăng ký
│   │   │   ├── dashboard.tsx      # Trang chủ
│   │   │   ├── profile.tsx        # Hồ sơ cá nhân
│   │   │   ├── admin.tsx          # Trang quản trị
│   │   │   ├── course.tsx         # Chi tiết khóa học
│   │   │   ├── allCourse.tsx      # Danh sách khóa học
│   │   │   ├── quizList.tsx       # Danh sách bài quiz
│   │   │   ├── quizDetail.tsx     # Chi tiết bài quiz
│   │   │   └── quizResults.tsx    # Kết quả bài quiz
│   │   ├── components/            # Component tái sử dụng
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── Rating.tsx
│   │   ├── context/               # Context API
│   │   │   └── AuthContext.tsx    # Quản lý xác thực
│   │   ├── api/                   # API Client
│   │   │   └── client.ts          # HTTP requests (GET, POST, PUT, DELETE)
│   │   ├── types/                 # TypeScript types
│   │   │   └── user.ts
│   │   ├── router/                # React Router
│   │   │   └── router.tsx
│   │   ├── data/                  # Dữ liệu tĩnh
│   │   │   └── courseData.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
└── server2/                        # Backend (Node.js + Express + MongoDB)
    ├── models/                    # MongoDB Models
    │   ├── User.js
    │   ├── Course.js
    │   ├── Lesson.js
    │   ├── Quiz.js
    │   ├── QuizResult.js
    │   ├── Enrollment.js
    │   ├── Progress.js
    │   └── Rating.js
    ├── routes/                    # API Routes
    │   ├── user.routes.js
    │   ├── course.routes.js
    │   ├── lesson.routes.js
    │   ├── quiz.routes.js
    │   ├── quizResults.routes.js
    │   ├── enrollment.routes.js
    │   ├── progress.routes.js
    │   └── rating.routes.js
    ├── middleware/                # Middleware
    │   ├── authMiddleware.js      # JWT verification
    │   └── validationMiddleware.js
    ├── data/                      # Dữ liệu
    │   ├── sampleData.js          # Dữ liệu mẫu
    │   └── seeder.js              # Script nhập dữ liệu
    ├── server.js                  # Entry point
    ├── package.json
    ├── .env
    └── db.json
```

---

## 🛠️ Yêu Cầu Hệ Thống

| Công Nghệ | Phiên Bản |
|-----------|----------|
| Node.js | ≥ 14.0 |
| npm | ≥ 6.0 |
| MongoDB | ≥ 4.0 |
| React | 18+ |
| TypeScript | 5+ |

---

## ⚙️ Cài Đặt và Chạy

### 1️⃣ Cài Đặt Backend (server2)

```bash
# Vào thư mục server2
cd server2

# Cài đặt dependencies
npm install

# Tạo file .env
# Thêm các biến sau:
# MONGO_URI=mongodb://localhost:27017/education_portal
# PORT=5000
# JWT_SECRET=your_secret_key

# Chạy seeder để nhập dữ liệu mẫu (nếu cần)
npm run seed

# Khởi động server
npm start
# Server chạy trên: http://localhost:5000
```

### 2️⃣ Cài Đặt Frontend (edu)

```bash
# Vào thư mục edu
cd edu

# Cài đặt dependencies
npm install

# Tạo file .env.local (nếu cần)
# VITE_API_URL=http://localhost:5000

# Chạy server development
npm run dev
# Frontend chạy trên: http://localhost:5173
```

### 3️⃣ Cấu Hình MongoDB

```bash
# Nếu dùng MongoDB local
mongod

# Hoặc dùng MongoDB Atlas (cloud)
# Cập nhật MONGO_URI trong .env
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/education_portal
```

---

## 🏗️ Kiến Trúc Ứng Dụng

### Frontend Architecture

```
┌─────────────────────────────────────┐
│      React Components (TSX)         │
│  - Pages (Login, Dashboard, etc)    │
│  - Components (Navbar, Footer)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      AuthContext (State Mgmt)       │
│  - User profile                     │
│  - JWT token                        │
│  - Login/Logout/Register            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      API Client (client.ts)         │
│  - apiGet(), apiPost(),             │
│  - apiPut(), apiDelete()            │
└──────────────┬──────────────────────┘
               │
       http://localhost:5000
               │
┌──────────────▼──────────────────────┐
│      Backend API (Express.js)       │
└─────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────┐
│    Express Server (server.js)       │
│  - Port: 5000                       │
│  - CORS enabled                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Routes                      │
│  /api/users, /api/courses,          │
│  /api/lessons, /api/quizzes, etc    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Middleware                     │
│  - protect (JWT verify)             │
│  - admin (role check)               │
│  - checkValidId (MongoDB ID valid)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      MongoDB Models                 │
│  - User, Course, Lesson, Quiz,      │
│  - Enrollment, Progress, Rating     │
└──────────────┬──────────────────────┘
               │
       mongodb://localhost:27017
               │
┌──────────────▼──────────────────────┐
│      MongoDB Database               │
│  - education_portal                 │
└─────────────────────────────────────┘
```

---

## 📖 Hướng Dẫn Sử Dụng

### 👤 Đối với Học Viên

#### 1. Đăng Ký / Đăng Nhập
```
1. Truy cập: http://localhost:5173/register
2. Điền: email, username, password
3. Nhấn "Đăng ký"
4. Đăng nhập bằng credentials vừa tạo
```

#### 2. Xem Khóa Học
```
1. Click "Khóa học của tôi" trong navbar
2. Xem danh sách khóa học có sẵn
3. Click vào khóa học để xem chi tiết
```

#### 3. Xem Bài Học
```
1. Trong trang khóa học, click vào bài học
2. Video YouTube sẽ phát
3. Đánh dấu hoàn thành bài học
4. Xem tiến độ học tập
```

#### 4. Làm Bài Quiz
```
1. Click "Bài kiểm tra" trong navbar
2. Chọn bài quiz từ danh sách
3. Trả lời các câu hỏi trắc nghiệm
4. Xem kết quả sau khi nộp
5. Click "Xem điểm của tôi" để xem lịch sử
```

#### 5. Đánh Giá Khóa Học
```
1. Trong trang khóa học, scroll xuống "Đánh giá khóa học"
2. Click "Đánh giá khóa học"
3. Chọn số sao và viết nhận xét
4. Nhấn "Gửi đánh giá"
```

#### 6. Cập Nhật Hồ Sơ
```
1. Click "Thông tin" trong UserMenu (góc trên phải)
2. Edit thông tin cá nhân
3. Cập nhật ảnh đại diện
4. Đổi mật khẩu
5. Nhấn "Lưu"
```

### 👨‍💼 Đối với Quản Trị Viên

#### 1. Truy Cập Trang Admin
```
1. Đăng nhập với tài khoản admin
   - Username: admin
   - Password: admin123
2. Click "Quản trị" trong navbar
```

#### 2. Quản Lý Khóa Học
```
Tab "Quản lý khóa học":
- Thêm khóa học mới
- Sửa thông tin khóa học
- Xóa khóa học
- Xem số học viên và bài học
```

#### 3. Quản Lý Bài Học
```
Trong mục "Danh sách bài học":
- Chọn khóa học
- Thêm bài học mới
  * Nhập tiêu đề
  * Nhập URL video YouTube (embed)
  * Nhập thứ tự
- Chỉnh sửa bài học
- Xóa bài học
```

#### 4. Quản Lý Học Viên
```
Tab "Học viên":
- Xem danh sách học viên
- Thêm học viên mới
- Xem số khóa học đã đăng ký
- Xem điểm trung bình
```

#### 5. Quản Lý Bài Quiz
```
Trong Admin:
- Xem danh sách bài quiz
- Xem kết quả bài quiz của học viên
- Chỉnh sửa kết quả bài quiz
```

#### 6. Xem Báo Cáo
```
Tab "Báo cáo":
- Tổng lượt xem (đăng ký)
- Tổng học viên
- Tỉ lệ hoàn thành trung bình
- Báo cáo chi tiết theo khóa học
  * Số lượt xem
  * Số học viên
  * Tỉ lệ hoàn thành
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/users/register`
Đăng ký người dùng mới
```typescript
// Request
{
  "username": "string",
  "email": "string",
  "password": "string"
}

// Response (201)
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user"
  },
  "token": "JWT_TOKEN"
}
```

#### POST `/api/users/login`
Đăng nhập
```typescript
// Request
{
  "email": "string",        // hoặc username
  "password": "string"
}

// Response (200)
{
  "user": { ... },
  "token": "JWT_TOKEN"
}
```

### Course Endpoints

#### GET `/api/courses`
Lấy danh sách tất cả khóa học
```typescript
// Response (200)
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "price": "string",
    "featured": boolean,
    "thumbnail": "string"
  }
]
```

#### GET `/api/courses/:id`
Lấy chi tiết một khóa học
```typescript
// Response (200)
{
  "_id": "string",
  "title": "string",
  "description": "string",
  // ... các trường khác
}
```

#### POST `/api/courses` (Admin)
Tạo khóa học mới
```typescript
// Request (headers: Authorization)
{
  "title": "string",
  "description": "string",
  "category": "string",
  "level": "string",
  "price": "string",
  "featured": boolean,
  "thumbnail": "string"
}

// Response (201)
{ _id, title, ... }
```

#### PUT `/api/courses/:id` (Admin)
Cập nhật khóa học
```typescript
// Request (headers: Authorization)
{
  "title": "string",
  "description": "string",
  // ... các trường cần cập nhật
}

// Response (200)
{ _id, title, ... }
```

#### DELETE `/api/courses/:id` (Admin)
Xóa khóa học
```typescript
// Response (200)
{ message: "Khóa học đã bị xóa" }
```

### Lesson Endpoints

#### GET `/api/lessons`
Lấy danh sách tất cả bài học
```typescript
// Response (200)
[
  {
    "_id": "string",
    "courseId": "string",
    "title": "string",
    "order": number,
    "videoUrl": "string"
  }
]
```

#### POST `/api/lessons` (Admin)
Tạo bài học mới
```typescript
// Request (headers: Authorization)
{
  "courseId": "string",
  "title": "string",
  "order": number,
  "videoUrl": "string"
}

// Response (201)
{ _id, courseId, title, ... }
```

### Enrollment Endpoints

#### GET `/api/enrollments/all`
Lấy tất cả đăng ký (public)
```typescript
// Response (200)
[
  {
    "_id": "string",
    "userId": "string",
    "courseId": "string",
    "enrolledAt": "2024-01-01"
  }
]
```

#### POST `/api/enrollments`
Đăng ký khóa học
```typescript
// Request (headers: Authorization)
{
  "courseId": "string"
}

// Response (201)
{ _id, userId, courseId, enrolledAt }
```

### Quiz Endpoints

#### GET `/api/quizzes`
Lấy danh sách tất cả bài quiz
```typescript
// Response (200)
[
  {
    "_id": "string",
    "title": "string",
    "courseId": "string",
    "questions": [
      {
        "id": number,
        "question": "string",
        "options": ["string"],
        "correctIndex": number
      }
    ]
  }
]
```

#### POST `/api/quizResults`
Nộp kết quả bài quiz
```typescript
// Request (headers: Authorization)
{
  "quizId": "string",
  "answers": [number],  // chỉ số câu trả lời
  "score": number,
  "correct": number,
  "total": number
}

// Response (201)
{ _id, userId, quizId, score, correct, total, submittedAt }
```

### Progress Endpoints

#### POST `/api/progress`
Đánh dấu bài học hoàn thành
```typescript
// Request (headers: Authorization)
{
  "courseId": "string",
  "lessonId": "string"
}

// Response (201)
{ _id, userId, courseId, lessonId, completedAt }
```

#### GET `/api/progress/course/:courseId`
Lấy tiến độ theo khóa học
```typescript
// Response (200)
[
  {
    "_id": "string",
    "userId": "string",
    "courseId": "string",
    "lessonId": "string",
    "completedAt": "2024-01-01"
  }
]
```

### Rating Endpoints

#### POST `/api/ratings`
Thêm đánh giá khóa học
```typescript
// Request (headers: Authorization)
{
  "courseId": "string",
  "rating": number,      // 1-5
  "comment": "string"
}

// Response (201)
{ _id, userId, courseId, rating, comment, createdAt }
```

#### GET `/api/ratings/course/:courseId`
Lấy đánh giá của khóa học
```typescript
// Response (200)
[
  {
    "_id": "string",
    "userId": { username, email, avatar },
    "rating": number,
    "comment": "string",
    "createdAt": "2024-01-01"
  }
]
```

---

## 🔑 Authentication

### JWT Token Flow

```
1. User đăng nhập → POST /api/users/login
2. Server trả về token
3. Client lưu token vào localStorage (key: "naukri:auth_data")
4. Mỗi request sau gửi kèm header:
   Authorization: Bearer <token>
5. Server verify token trong middleware protect()
6. Nếu token hết hạn → redirect /login
```

### Protected Routes

```typescript
// Frontend (router.tsx)
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>

// Backend (middleware)
router.post('/quiz-results', protect, async (req, res) => {
  // req.user chứa userId từ token
  const userId = req.user._id;
  // ...
});

// Admin-only routes
router.post('/courses', protect, admin, async (req, res) => {
  // Chỉ admin mới truy cập được
});
```

---

## 📝 Các Tính Năng Chính

### ✅ Tính Năng Hoàn Thành
- [x] Đăng ký / Đăng nhập
- [x] Xem danh sách khóa học
- [x] Xem chi tiết khóa học
- [x] Xem video bài học
- [x] Đánh dấu hoàn thành bài học
- [x] Làm bài quiz
- [x] Xem kết quả bài quiz
- [x] Đánh giá khóa học
- [x] Cập nhật hồ sơ cá nhân
- [x] Quản lý khóa học (Admin)
- [x] Quản lý bài học (Admin)
- [x] Quản lý học viên (Admin)
- [x] Xem báo cáo (Admin)





##  Troubleshooting

### ❌ Vấn Đề: "Failed to connect to MongoDB"

**Giải pháp:**
```bash
# Kiểm tra MongoDB đang chạy
mongod

# Hoặc kiểm tra MONGO_URI trong .env
MONGO_URI=mongodb://localhost:27017/education_portal
```

### ❌ Vấn Đề: "CORS error"

**Giải pháp:**
```javascript
// server.js đã enable CORS
app.use(cors());
```
Nếu vẫn có lỗi, kiểm tra:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### ❌ Vấn Đề: "401 Unauthorized"

**Giải pháp:**
1. Kiểm tra token trong localStorage
2. Đảm bảo header `Authorization: Bearer <token>`
3. Kiểm tra token chưa hết hạn

```typescript
// Trong api/client.ts
function getAuthHeader() {
  const raw = localStorage.getItem('naukri:auth_data');
  if (raw) {
    const authData = JSON.parse(raw);
    return { 'Authorization': `Bearer ${authData.token}` };
  }
  return {};
}
```

### ❌ Vấn Đề: "Cannot POST /api/users/login"

**Giải pháp:**
```bash
# Kiểm tra tất cả routes đã được load
# Trong server.js xem có console log:
# ✅ All routes loaded successfully

# Nếu không, kiểm tra file route có tồn tại
ls server2/routes/
```

### ❌ Vấn Đề: Port 5000 đã được sử dụng

**Giải pháp:**
```bash
# Tìm process sử dụng port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Hoặc dùng port khác trong .env
PORT=5001
```

### ❌ Vấn Đề: Video YouTube không phát

**Giải pháp:**
```
- Kiểm tra URL có dạng: https://www.youtube.com/embed/VIDEO_ID
- Không phải: https://www.youtube.com/watch?v=VIDEO_ID
- Chuyển đổi: watch?v=ID → embed/ID
```

---

## 📚 Tài Liệu Thêm

- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/)

---

## 👥 Thông Tin Tài Khoản Test

### User Account
```
Username: nguyenhoangminhnhat
Email: nhat@example.com
Password: 12345678
```

### Admin Account
```
Username: admin
Email: admin@naukri.edu
Password: admin123
```

---

##  Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console error (F12)
2. Kiểm tra server logs
3. Xem lại phần Troubleshooting
4. Liên hệ developer

---
