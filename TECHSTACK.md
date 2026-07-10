# Tech Stack — Career Connect

Tài liệu này mô tả công nghệ sử dụng và lý do lựa chọn, phục vụ cho phần kỹ
thuật của Business Plan (PA2, PA5, PA6) và làm căn cứ triển khai thực tế.

## Nguyên tắc chọn stack

1. **Cả nhóm không tốn thời gian học ngôn ngữ/công cụ mới** — ưu tiên công
   nghệ phổ biến, tài liệu nhiều, dễ tìm câu trả lời khi bị bug.
2. **FE và BE tách biệt hoàn toàn qua REST API** — 2 người có thể code song
   song từ ngày đầu, không block nhau.
3. **Free tier đủ dùng cho MVP** — không phát sinh chi phí hạ tầng trong giai
   đoạn đồ án.
4. **Đơn giản hơn là tốt hơn** — MVP không cần microservices, không cần
   GraphQL, không cần message queue. CRUD + 1 state machine đơn giản là đủ.

## Bảng Tech Stack

| Tầng | Công nghệ | Lý do chọn |
|---|---|---|
| Ngôn ngữ | **TypeScript** (FE + BE) | Kiểu dữ liệu tường minh giúp 4 người chia việc không đoán sai field name; bắt lỗi lúc code thay vì runtime; vẫn là JS nên không phải học ngôn ngữ mới. |
| Frontend | **React + Vite + TailwindCSS** | React phổ biến nhất, dễ tìm tài liệu/component mẫu. Vite build/dev nhanh hơn CRA. Tailwind giúp code UI nhanh không cần thiết kế design system riêng. |
| Backend | **Node.js + Express** | JavaScript xuyên suốt FE/BE — không cần học 2 ngôn ngữ. Express đơn giản, đủ dùng cho REST API quy mô MVP (không cần NestJS với DI/decorator phức tạp). |
| Database | **PostgreSQL** | Dữ liệu có quan hệ rõ ràng (User–Mentor–Slot–Booking–Review). Hỗ trợ transaction & row-level locking tốt — quan trọng để chống double-booking. |
| ORM | **Prisma** | Sinh TypeScript type tự động từ schema, giảm lỗi sai tên cột. Migration tự động, có Prisma Studio để xem data trực quan khi debug. |
| Email | **Nodemailer** (hoặc SendGrid free tier) | Setup nhanh (<1 ngày), đủ cho gửi email xác nhận/nhắc lịch. |
| Meeting link | **Google Meet** (link thủ công ở MVP, Calendar API ở phase sau) | Miễn phí, quen thuộc với người dùng Việt Nam. |
| Deploy | **Railway/Render** (Backend + DB) + **Vercel** (Frontend) | Free tier, CI/CD tích hợp sẵn với GitHub, gần như zero DevOps. |
| Quản lý mã nguồn | **Git + GitHub**, Git-flow (`main`/`develop`/`feature/*`) | Chuẩn phổ biến, dễ phân quyền, PR review trước khi merge. |

## Kiến trúc Backend: Layered Architecture

```
Request
  → Router        (định nghĩa endpoint, method)
  → Controller     (nhận req, validate cơ bản, gọi Service, trả res)
  → Service        (business logic — nơi xử lý các quy tắc nghiệp vụ)
  → Repository     (truy vấn Prisma thuần, không có logic)
  → Prisma / PostgreSQL
```

**Vì sao tách lớp thế này?**
- Mỗi lớp có 1 trách nhiệm rõ ràng → dễ code review, dễ viết test riêng từng
  lớp, tránh 1 file "god function" làm mọi thứ.
- Khi cần đổi DB hoặc ORM sau này, chỉ cần sửa Repository, không đụng vào
  Controller/Service.
- Phù hợp để 4 thành viên (đặc biệt là CTO + người phụ) chia module theo
  feature mà không giẫm chân nhau: 1 người làm `mentor.*`, 1 người làm
  `booking.*`.

## Xử lý vấn đề kỹ thuật quan trọng nhất: Chống Double-Booking

Đây là bài toán kỹ thuật cốt lõi của MVP Feature 2 (Booking Engine), giải
quyết trực tiếp Pain Point 3 đã nêu trong PA0.

**Vấn đề:** 2 Mentee có thể cùng lúc bấm "Đặt lịch" cho cùng 1 slot rảnh
trong khoảng thời gian rất ngắn (vài mili-giây), dẫn đến 1 slot bị đặt trùng
2 lần nếu không xử lý concurrency đúng cách.

**Giải pháp: Optimistic Locking bằng cột `version`**

1. Mỗi `Slot` có 1 cột `version` (mặc định = 0).
2. Khi Mentee đặt lịch, hệ thống đọc `version` hiện tại của slot.
3. Khi ghi vào DB, câu lệnh update kèm điều kiện
   `WHERE id = ? AND version = ? AND status = 'AVAILABLE'`, đồng thời tăng
   `version += 1`.
4. Nếu có request khác đã "thắng" trước đó (version đã đổi), câu update sẽ
   trả về **0 dòng bị ảnh hưởng** → hệ thống biết ngay slot vừa bị người khác
   đặt và báo lỗi rõ ràng cho Mentee, thay vì tạo ra 2 booking trùng nhau.

Cách này **không cần khoá DB ở mức row phức tạp** (không cần
`SELECT ... FOR UPDATE`), vẫn đảm bảo tính toàn vẹn dữ liệu, và dễ hiểu/dễ
maintain với một team sinh viên — đúng tinh thần "MVP không cần thuật toán
cao siêu, nhưng vẫn xử lý đúng bài toán nghiệp vụ quan trọng nhất".

## Quy ước code (để cả nhóm thống nhất)

- Đặt tên file: `camelCase.ts` cho function/util, `PascalCase.tsx` cho React
  component.
- Mỗi entity chính (Mentor, Slot, Booking, Review) có đủ bộ 4 file:
  `*.repository.ts` → `*.service.ts` → `*.controller.ts` → `*.routes.ts`.
- Không gọi thẳng Prisma trong Controller — luôn đi qua Service.
- Biến môi trường luôn qua file `.env` (không commit), tham khảo
  `.env.example` để biết cần khai báo gì.
- Trước khi merge vào `develop`: phải có ít nhất 1 người review code (PR).

## Việc cần khai báo khi nộp bài (theo yêu cầu PA6)

Khi nộp PA5/PA6, nhóm cần khai báo rõ trong README hoặc phụ lục:
- Danh sách thư viện/framework sử dụng (đã liệt kê ở bảng trên + `package.json`).
- Nếu dùng AI hỗ trợ sinh code/tài liệu (ChatGPT, Claude, Copilot...), ghi rõ
  phần nào được AI hỗ trợ và phần nào tự viết, theo đúng quy định chống vi
  phạm Mức 1 trong Team Contract.
