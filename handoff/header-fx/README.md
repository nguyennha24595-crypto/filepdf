# Hiệu ứng header cho filecustom.com

Có hai hiệu ứng, áp dụng cho worker `filepdf`:

1. **Logo bay:** logo lớn (khoảng 2,5 lần logo header) nằm giữa hero, phía trên dòng "Chúng tôi giúp việc xử lý tài liệu…". Khi cuộn xuống, logo lướt lên góc trái và thu nhỏ dần, cuối cùng khớp đúng chỗ logo header. Cuộn lên thì logo bay ngược lại. Chuyển động có easing và quán tính nhẹ. Hiệu ứng tự tắt quán tính nếu máy bật chế độ giảm chuyển động (reduced motion).
2. **Nút lên đầu trang:** nút tròn màu tím ở góc dưới phải, có vòng hiển thị tiến độ cuộn. Nút hiện khi đã cuộn xuống quá khoảng nửa màn hình. Bấm vào thì trang cuộn mượt lên đầu, và khi về tới đầu trang thì nút tự ẩn. Nút có ở mọi trang.

Xem thử: mở `demo.html` bằng trình duyệt. Đây là bản mô phỏng header và hero, dùng logo giả.

## Tích hợp vào mã nguồn worker `filepdf` (4 bước)

1. Chép `public/engine/fx.js` sang `public/engine/fx.js` của project.
2. Chép `public/fx.css` sang `public/fx.css`, hoặc dán nội dung của nó vào cuối `public/site.css`.
3. Mở `src/views/layout.js`:
   - Trong `renderHead()`, ngay sau `<link rel="stylesheet" href="/site.css">`, thêm dòng dưới đây (bỏ qua nếu ở bước 2 đã dán vào site.css):
     ```html
     <link rel="stylesheet" href="/fx.css">
     ```
   - Trong `renderHomeHeader()`, ngay sau `<script src="/engine/nav.js"><\/script>`, thêm:
     ```html
     <script src="/engine/fx.js" defer><\/script>
     ```
4. Mở `src/views/homePage.js`, trong `renderHome()`, thêm khung logo lớn làm phần tử đầu tiên của `.fp-hero-text`, ngay trước `<h1>`:
   ```js
   <div class="fp-hero-logo" aria-hidden="true"><img src="/brand/logo.webp" alt="" width="418" height="128" fetchpriority="high"></div>
   ```

Sau đó chạy `npx wrangler dev`, mở trang chủ và cuộn thử, rồi `npx wrangler deploy`.

## Tuỳ chỉnh

- **Kích thước logo lớn:** biến `--fx-logo-h` trong `fx.css`. Máy tính đang là 140px, điện thoại 84px.
- **Quãng cuộn để logo bay hết:** tính trong hàm `measure()` của `fx.js`, bằng khoảng cách từ hero lên header cộng 60% chiều cao logo lớn.
- **Độ "mềm" của chuyển động:** hệ số `0.2` trong hàm `tick()`. Số nhỏ hơn thì trôi chậm và mềm hơn.
- **Màu nút lên đầu trang:** biến `--fx-accent`.
- **Độ nét:** `logo.webp` hiện chỉ rộng 418px, trong khi logo lớn hiển thị khoảng 450px, nên trên màn hình retina sẽ hơi mờ. Nên xuất thêm một bản logo rộng khoảng 1000px (hoặc SVG) và dùng bản đó cho khung `.fp-hero-logo`.

## Ghi chú kỹ thuật

- Khung `.fp-hero-logo` giữ chỗ cố định ngay từ khi server render trang, nên trang không bị nhảy bố cục (CLS). Nếu không có JS, logo lớn vẫn hiện tĩnh.
- Hiệu ứng hoạt động đúng dù header dính (`sticky`) hay không dính. Cả hai trường hợp đã được kiểm tra bằng Playwright.
- Khi menu thả xuống hoặc menu mobile đang mở, logo bay tự nằm dưới menu để không che menu (dùng `:has()`).
