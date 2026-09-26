# Khu "Tại sao nên chọn FileCustom?"

Khu này gồm 6 thẻ, đặt ở trang chủ sau khu giới thiệu tính năng (`.fp-show`) và trước footer. Có đủ tiếng Việt và tiếng Anh.

| # | Tiêu đề | Căn cứ để ghi |
|---|---|---|
| 1 | File không rời khỏi máy bạn | Các công cụ chạy trong trình duyệt; footer hiện tại cũng đã ghi như vậy |
| 2 | Kết nối mã hóa TLS 1.3 | Worker chạy trên Cloudflare, TLS 1.3 được bật mặc định |
| 3 | AI chỉ chạy khi bạn đồng ý | `/api/ai` chỉ nhận phần chữ và không lưu nội dung, chỉ lưu bộ đếm lượt dùng theo IP để giới hạn |
| 4 | Tôn trọng quyền riêng tư | Nguyên tắc tối thiểu hóa dữ liệu (GDPR, Luật Bảo vệ dữ liệu cá nhân VN). Chỉ ghi "theo nguyên tắc", không ghi "đạt chứng nhận" |
| 5 | Dùng trên mọi thiết bị | Web chạy trên trình duyệt, giao diện responsive |
| 6 | Hạ tầng Cloudflare toàn cầu | CDN và chống DDoS có sẵn của Cloudflare |

Những gì **cố ý không ghi**:
- "Miễn phí" và "không cần tài khoản": sau này có thể có đăng nhập và gói trả phí.
- "Chứng nhận ISO 27001": chưa có giấy chứng nhận.
- "256 bit": cipher thực tế phụ thuộc vào thiết bị của người dùng.

Các thẻ hiện dần lần lượt khi cuộn tới. Phần này do `fx.js` xử lý, dùng chung file với hiệu ứng header.

## Tích hợp (sau khi đã tích hợp `../header-fx`)

1. Chép `src/views/whySection.js` vào `src/views/`. Kiểm tra 3 dòng `import` ở đầu file có khớp đường dẫn và tên export thật không (`esc`, `t`, `infoPath`).
2. Chép các khóa trong `src/i18n/strings.js` vào object của `src/i18n/vi.js` và `src/i18n/en.js`.
3. Chép `public/why.css` vào `public/`, rồi thêm `<link rel="stylesheet" href="/why.css">` vào `renderHead()`. Hoặc dán nội dung file vào cuối `public/site.css`.
4. Mở `src/views/homePage.js`:
   - thêm `import { renderWhy } from "./whySection.js";`
   - trong `renderHome()`, ngay sau thẻ `</section>` đóng khu `.fp-show` (trước `<script type="application/json" id="fc-config">`), chèn `${renderWhy(lang)}`.
5. Chạy `npx wrangler dev`, kiểm tra trang chủ cả `/` và `/en`, ở chế độ sáng và tối, rồi `npx wrangler deploy`.

## Nên làm cùng lúc trên Cloudflare Dashboard (SSL/TLS)

- Edge Certificates → **Always Use HTTPS**: bật
- Edge Certificates → **Minimum TLS Version**: TLS 1.2
- Edge Certificates → **TLS 1.3**: bật (mặc định đã bật)
- Edge Certificates → **HSTS**: bật, `max-age` 6 tháng, có `includeSubDomains`

Bật HSTS thì trình duyệt sẽ ghi nhớ và luôn dùng HTTPS. Chỉ bật khi mọi subdomain đều đã chạy HTTPS.
