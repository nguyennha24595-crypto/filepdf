# Sổ ý tưởng

Ghi lại ý tưởng để làm dần. Mỗi lần chỉ làm **một** việc, xong mới làm việc tiếp theo.
Khi mở phiên Claude mới, chỉ cần nói: "đọc file Y-TUONG.md trong repo filepdf rồi làm mục …".

## Bộ lọc trước khi làm một ý tưởng

1. Người Việt có hay phải **trả tiền** (hoặc ra tiệm) để làm việc này không?
2. Có chạy được **ngay trên trình duyệt** không? (không tốn máy chủ, file không rời máy người dùng)
3. Có **khớp với web đang có** (filecustom.com, shurlvn) không? Dùng chung tên miền, giao diện, SEO.

## Công cụ nên làm (xếp theo thứ tự ưu tiên)

| # | Ý tưởng | Gắn vào | Độ khó | Ghi chú |
|---|---|---|---|---|
| 1 | Tạo mã QR chuyển khoản (VietQR) có sẵn số tiền, nội dung | shurlvn | Dễ | Làm trước, một phiên là xong |
| 2 | Màn hình thu ngân: hiện QR và **đọc to khi tiền về** | shurlvn | Trung bình | Cần một dịch vụ trung gian báo tiền về (Casso / SePay / PayOS, chưa chọn), webhook về Cloudflare Worker, Durable Objects, giọng đọc tiếng Việt của trình duyệt. KHÔNG đăng nhập internet banking hộ người dùng |
| 3 | Đọc hóa đơn điện tử (XML) → bảng Excel tổng hợp | filecustom | Trung bình | Giá trị nhất cho kế toán. Cần 2–3 file XML mẫu đã xóa thông tin thật |
| 4 | Làm ảnh thẻ 3×4, 4×6: cắt chuẩn, đổi nền trắng/xanh, xếp khổ A4 / 10×15 để in | filecustom | Dễ–trung bình | Tận dụng công cụ xóa nền + cắt ảnh có sẵn |
| 5 | Chuyển giọng nói thành văn bản tiếng Việt (ghi âm họp → biên bản) | filecustom | Khó | Mô hình nặng, máy yếu chạy chậm |
| 6 | Cắt, nén video, tách âm thanh trên trình duyệt | filecustom | Trung bình | File lớn xử lý chậm |

Mở rộng cho mục 2 sau khi chạy ổn: khớp đơn hàng theo mã trong nội dung chuyển khoản, lịch sử + xuất Excel, gom nhiều ngân hàng, chống màn hình chuyển khoản giả.

## Kéo người dùng đầu tiên (tốn rất ít token)

- [ ] Kiểm tra biến `SITE_ORIGIN` đã đặt trên Cloudflare chưa (chưa đặt thì site tự gửi `noindex`, Google không lập chỉ mục)
- [ ] Khai báo filecustom.com trên Google Search Console, gửi `sitemap.xml`
- [ ] Chia sẻ vào nhóm văn phòng / kế toán / hành chính, kèm một lợi ích cụ thể (sửa chữ PDF không tải file lên máy chủ, mẫu công văn đúng NĐ 30…)
- [ ] Mỗi tuần xem thống kê Cloudflare: trang nào có người vào thì đầu tư tiếp trang đó

## Để dành (chưa làm)

- **Game 3D kiểu "bãi cỏ + con bò"** (three.js, host miễn phí trên Cloudflare). Nếu làm thì chia mốc:
  1. nhân vật chạy nhảy trong một bản đồ đẹp, chơi một mình;
  2. một chiêu thức + một loại quái;
  3. chỉ khi thấy vui mới tính online.
  Game online có thành, chiêu thức, cổng game là việc tính bằng năm, chưa kể thiết kế, âm thanh, cốt truyện, marketing.
- Mini game / hiệu ứng 3D nhỏ gắn vào filecustom (trang 404, trang chủ) để giữ chân người xem.

## Đã xem và bỏ qua

- **OmniRoute** (proxy nén token / chuyển mô hình): không hợp khi dùng gói Claude Pro/Max vì có rủi ro điều khoản tài khoản, không tăng hạn mức, có thể làm hỏng prompt cache, và gửi code tới bên thứ ba.

## Mẹo tiết kiệm hạn mức Claude

- Mỗi việc lớn một phiên mới; phiên dài thì `/compact`
- Việc đơn giản thì chuyển sang mô hình nhẹ hơn (`/model`) hoặc giảm effort
- Giữ `CLAUDE.md` gọn; dặn chỉ in phần log cần thiết
