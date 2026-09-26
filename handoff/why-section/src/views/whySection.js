// Khu "Tại sao nên chọn FileCustom?" trên trang chủ (đặt sau khu .fp-show).
// Chỉ ghi những điều đang đúng với sản phẩm — không ghi chứng nhận (ISO…) khi chưa có giấy,
// không ghi "miễn phí / không cần tài khoản" vì sau này có thể có đăng nhập và gói trả phí.
import { esc } from "../utils/html.js";
import { t } from "../i18n/index.js";
import { infoPath } from "./infoPages.js";

const S = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
const ICONS = {
  // laptop + khiên: xử lý tại máy
  local: S + '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9"/><path d="M2 20h20"/><path d="M12 8.5 9.5 9.5v1.6c0 1.6 1.1 2.8 2.5 3.4 1.4-.6 2.5-1.8 2.5-3.4V9.5Z"/></svg>',
  // ổ khóa: TLS
  lock: S + '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>',
  // tia sáng: AI
  ai: S + '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>',
  // cán cân: quyền riêng tư theo luật
  law: S + '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
  // thiết bị: không cần cài
  devices: S + '<rect width="14" height="10" x="2" y="4" rx="2"/><path d="M6 18h6"/><path d="M9 14v4"/><rect width="6" height="10" x="16" y="10" rx="1.5"/></svg>',
  // quả địa cầu: hạ tầng toàn cầu
  globe: S + '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>'
};
const ITEMS = [
  ["local", "why_local"],
  ["lock", "why_tls"],
  ["ai", "why_ai"],
  ["law", "why_law"],
  ["devices", "why_devices"],
  ["globe", "why_cdn"]
];

export function renderWhy(lang) {
  const cards = ITEMS.map(([ic, k]) => `<li class="fp-why-item" data-fx-reveal>
<span class="fp-why-ico">${ICONS[ic]}</span>
<h3>${esc(t(lang, k + "_h"))}</h3>
<p>${esc(t(lang, k + "_p"))}</p>
</li>`).join("\n");
  return `<section class="fp-why" aria-labelledby="fp-why-h">
<div class="fp-why-head" data-fx-reveal><h2 id="fp-why-h">${esc(t(lang, "why_h"))}</h2><p>${esc(t(lang, "why_sub"))}</p></div>
<ul class="fp-why-grid">
${cards}
</ul>
<p class="fp-why-more" data-fx-reveal><a href="${esc(infoPath("privacy", lang))}">${esc(t(lang, "why_more"))}</a></p>
</section>`;
}
