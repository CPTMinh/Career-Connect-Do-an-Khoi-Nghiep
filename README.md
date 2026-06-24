# Career Connect — Git Structure & System Design

## 1. Repo Structure

Dùng **monorepo** với 2 folder chính trong 1 repo:

```text
career-connect/
├── frontend/          # ReactJS app
├── backend/           # NestJS app
├── .gitignore
└── README.md
```

---

## 2. Git Flow

### Branch chính

| Branch | Mục đích |
|---|---|
| `main` | Production-ready code. Chỉ merge từ `develop` khi release. |
| `develop` | Nhánh tích hợp chính. Mọi feature merge vào đây trước. |
| `feature/name` | Các nhánh tính năng riêng biệt của từng thành viên. |

### Branch làm việc

Tạo từ `develop`, đặt tên theo format:

```text
feature/<tên-tính-năng>
fix/<tên-lỗi>
docs/<tên-tài-liệu>
```

**Ví dụ:**

```text
feature/mentor-profile
feature/booking-engine
feature/email-notification
fix/double-booking-bug
docs/api-swagger
```

### Quy trình làm việc hàng ngày

```bash
1. Checkout từ develop
   git checkout develop && git pull origin develop
   git checkout -b feature/ten-tinh-nang

2. Code xong → commit
   git add .
   git commit -m "feat: mô tả ngắn"

3. Push lên remote
   git push origin feature/ten-tinh-nang

4. Tạo Pull Request → develop
   - Assign 1 người review (thường là CTO hoặc người liên quan)
   - Không tự merge PR của mình

5. Sau khi được approve → Merge & delete branch
```

---

## 3. Commit Convention

Dùng **Conventional Commits**:

```text
feat:     Thêm tính năng mới
fix:      Sửa bug
docs:     Thay đổi tài liệu
style:    Format code (không ảnh hưởng logic)
refactor: Tái cấu trúc code
chore:    Config, setup, dependency
```

**Ví dụ commit thực tế:**

```text
feat: add mentor profile CRUD API
fix: prevent double booking with row lock
docs: update swagger for booking endpoint
chore: add SendGrid config to .env.example
```

---

## 4. Folder Structure Chi Tiết

### Frontend (`/frontend`)

```text
frontend/
├── public/
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Button, Input, Modal, ...
│   │   └── layout/      # Header, Footer, Sidebar
│   ├── pages/           # Route-level pages
│   │   ├── Home/
│   │   ├── MentorList/
│   │   ├── MentorProfile/
│   │   ├── Booking/
│   │   └── Dashboard/
│   ├── services/        # Axios API calls
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── routes/          # React Router config
│   └── App.jsx
├── .env.example
├── tailwind.config.js
└── package.json
```

### Backend (`/backend`)

```text
backend/
├── src/
│   ├── modules/
│   │   ├── auth/        # Login, register, JWT
│   │   ├── users/       # User entity & CRUD
│   │   ├── mentors/     # Mentor profile, filter, search
│   │   ├── slots/       # Time slot management
│   │   ├── bookings/    # Booking engine, concurrency control
│   │   ├── reviews/     # Rating & review
│   │   └── mail/        # SendGrid email service
│   ├── common/
│   │   ├── guards/      # JWT AuthGuard
│   │   ├── decorators/  # Custom decorators
│   │   └── filters/     # Exception filters
│   ├── config/          # App config, DB config
│   └── main.ts
├── .env.example
└── package.json
```

---

## 5. API Contract (tóm tắt endpoints)

FE và BE thống nhất contract này trước khi code — FE dùng mock data theo đây.

```text
Auth
  POST   /auth/register
  POST   /auth/login

Mentors
  GET    /mentors              # Danh sách + filter (industry, service, company)
  GET    /mentors/:id          # Profile chi tiết
  POST   /mentors              # Tạo mentor profile (auth required)

Slots
  GET    /slots?mentorId=      # Lấy slot rảnh của mentor
  POST   /slots                # Mentor tạo slot
  DELETE /slots/:id            # Mentor xóa slot

Bookings
  POST   /bookings             # Mentee đặt lịch (lock slot ngay)
  GET    /bookings/me          # Lịch sử booking của user
  PATCH  /bookings/:id/cancel  # Hủy lịch

Reviews
  POST   /reviews              # Mentee gửi review sau buổi
  GET    /reviews?mentorId=    # Lấy review của mentor
```

---

## 6. Quy Tắc Bổ Sung

- **Không commit lên `main` hoặc `develop` trực tiếp** — luôn qua PR.
- **Không commit file `.env`** — chỉ commit `.env.example`.
- **Mỗi PR phải có mô tả** ngắn: làm gì, test thế nào.
- **Resolve conflict** trước khi request review.
- Swagger (`/api/docs`) phải được cập nhật cùng lúc với API mới.
