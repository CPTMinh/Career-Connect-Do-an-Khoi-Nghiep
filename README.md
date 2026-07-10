# Career Connect

Nền tảng kết nối Mentor - Mentee tập trung vào Review CV & Mock Interview.
Đồ án môn Khởi Nghiệp — Khoa CNTT, Trường ĐH Khoa Học Tự Nhiên, ĐHQG-HCM.

## Tech Stack

Xem chi tiết đầy đủ và lý do lựa chọn tại [`TECHSTACK.md`](./TECHSTACK.md).

| Tầng | Công nghệ |
|---|---|
| Frontend | React + TypeScript + Vite + TailwindCSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Email | Nodemailer / SendGrid |
| Deploy | Railway/Render (BE + DB) + Vercel (FE) |

## Cấu trúc thư mục

```
career-connect/
├── backend/                 # Express + TS API
│   ├── prisma/
│   │   ├── schema.prisma    # Định nghĩa DB schema
│   │   └── seed.ts          # Script tạo data mẫu
│   └── src/
│       ├── routes/          # Định nghĩa endpoint
│       ├── controllers/     # Nhận request, gọi service, trả response
│       ├── services/        # Business logic
│       ├── repositories/    # Truy vấn Prisma thuần
│       ├── middlewares/     # Error handler, auth (sau)
│       └── utils/
└── frontend/                 # React + Vite app
    └── src/
        ├── pages/            # Các trang chính
        ├── components/       # Component tái sử dụng
        ├── api/               # Gọi API qua axios
        └── types/             # Type dùng chung, khớp với Prisma schema
```

Kiến trúc backend theo mô hình phân lớp:
**Route → Controller → Service → Repository → Prisma/DB**

## Yêu cầu môi trường

- Node.js >= 18
- PostgreSQL >= 14 (hoặc dùng free tier của Railway/Supabase/Render)
- npm >= 9

## Hướng dẫn cài đặt & chạy thử

### 1. Clone repo

```bash
git clone <repo-url>
cd career-connect
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
cp .env.example .env
# Mở .env và điền DATABASE_URL trỏ tới Postgres của bạn

npx prisma generate       # Sinh Prisma Client
npx prisma migrate dev    # Tạo bảng trong DB theo schema.prisma
npm run seed               # Tạo data mẫu (1 mentor, 1 mentee, vài slot)

npm run dev                 # Chạy server tại http://localhost:4000
```

Kiểm tra: mở `http://localhost:4000/health` phải trả về `{"status":"ok"}`.

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Mặc định VITE_API_URL trỏ tới http://localhost:4000/api, để nguyên nếu chạy local

npm run dev                 # Chạy tại http://localhost:5173
```

### 4. Tài khoản demo (sau khi chạy `npm run seed`)

| Vai trò | Email | Password |
|---|---|---|
| Mentor | mentor.demo@careerconnect.dev | password123 |
| Mentee | mentee.demo@careerconnect.dev | password123 |

> Lưu ý: MVP hiện tại **chưa có màn hình đăng nhập/JWT** — các API test dùng
> trực tiếp `userId` lấy từ Prisma Studio (`npx prisma studio`) hoặc từ log
> khi seed. Auth sẽ được bổ sung ở giai đoạn tiếp theo.

## Trạng thái phát triển (cập nhật liên tục — dùng cho PA5)

### ✅ Đã hoàn thành
- Cấu trúc repo, layered architecture backend
- Prisma schema đầy đủ 5 entity (User, MentorProfile, Slot, Booking, Review)
- API tìm kiếm & xem chi tiết Mentor
- API tạo slot, xem slot rảnh
- API đặt lịch với cơ chế chống double-booking (optimistic locking)
- Frontend: trang danh sách Mentor, trang chi tiết + đặt lịch

### 🚧 Đang phát triển
- Đăng ký / đăng nhập (JWT)
- Gửi email xác nhận booking + reminder tự động
- Dashboard cho Mentor & Mentee
- Tích hợp Google Meet link tự động

### 📋 Dự kiến hoàn thiện trước PA6
- Hệ thống Review & Rating sau buổi tư vấn
- Trang Admin duyệt Mentor
- Polish UI/UX theo thiết kế cuối
- Viết test cho các API quan trọng (booking concurrency)

### ⚠️ Vấn đề kỹ thuật còn tồn tại
- Chưa có xử lý timezone khi hiển thị slot (đang mặc định giờ VN)
- Chưa có rate-limiting cho API public

## Nguồn tham khảo / công cụ sử dụng

- Boilerplate cấu trúc được soạn thủ công bởi CTO nhóm dựa trên kiến trúc
  layered phổ biến (Router-Controller-Service-Repository).
- Thư viện sử dụng: Express, Prisma, React, TailwindCSS, Axios (đều là mã
  nguồn mở, xem `package.json` để biết danh sách đầy đủ + license).
