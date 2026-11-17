# Clubspace — prototype wireframe

Prototype Next.js + TypeScript, dùng hoàn toàn dữ liệu mẫu trong trình duyệt. Không có Supabase, LiveKit, đăng nhập hay lưu dữ liệu sau khi tải lại trang.

## Chạy thử

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Mở `http://127.0.0.1:3000`.

## Luồng có thể thử

1. Chọn CLB ở thanh dọc bên trái, chuyển giữa các text channel và gửi tin nhắn mẫu.
2. Chọn voice channel, tham gia/rời phòng và bật/tắt mic mô phỏng.
3. Mở **Cuộc họp**, bắt đầu/kết thúc buổi họp chính thức và xem người tham gia/biên bản mẫu.
4. Mở **Tuyển thành viên**, điền form và nộp hồ sơ. Qua **Hồ sơ ứng tuyển** để xét duyệt, lên lịch phỏng vấn và chọn kết quả.
5. Mở **Phỏng vấn** để vào/rời phòng riêng mô phỏng. Mở **Hồ sơ cá nhân** để xem hành trình thành viên.
6. Mở **Bài đăng** để tạo/chỉnh sửa bài, lưu nháp, đăng, ẩn hoặc đăng lại.
7. Mở **Hoạt động** để tạo lịch, mở/đóng đăng ký, thử đăng ký, điểm danh và kết thúc hoạt động.

## Chỉnh sửa

- `app/page.tsx`: dữ liệu mẫu, trạng thái và các màn hình.
- `app/globals.css`: bố cục, màu sắc, responsive.
- `app/management.tsx` và `app/management.css`: dữ liệu mẫu và giao diện quản lý bài đăng, hoạt động.
- `app/layout.tsx`: metadata và layout gốc.

Các nút và trạng thái chỉ mô phỏng giao diện. Tải lại trang sẽ đặt lại dữ liệu mẫu.
