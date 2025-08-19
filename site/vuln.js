// ❌ 將敏感資料放在 localStorage（示範）
localStorage.setItem("jwt", "header.payload.signature");

// ❌ 以 JS 設定 Cookie（無 Secure/HttpOnly；HttpOnly 也不能用 JS 設）
document.cookie = "session=abc123; path=/";

const qs = new URLSearchParams(location.search);

// ❌ DOM XSS：直接把使用者輸入塞進 innerHTML
const name = qs.get("name") || "Guest";
document.getElementById("hello").innerHTML = `Hello, ${name}`;

// ❌ DOM XSS：Hash 片段也直接注入
if (location.hash) {
  document.getElementById("hash").innerHTML = "Hash says: " + location.hash.slice(1);
}

// ❌ Open Redirect：未驗證就導頁
function go() {
  const next = qs.get("next");
  if (next) location.href = next; // e.g., ?next=https://evil.example
}
window.go = go;

// ❌ HTTP 明文請求 + 串連使用者輸入
const x = qs.get("x") || "demo";
fetch("http://httpbin.org/get?x=" + x)
  .then(r => r.text())
  .then(t => (document.getElementById("slot").textContent = t))
  .catch(console.log);

// ❌ 動態執行：eval
const code = qs.get("code");
if (code) {
  eval(code); // 危險！任意 JS 執行
}

// ❌ 直接寫入整段 HTML
function renderUserHtml() {
  const html = qs.get("html") || "<b>no user html</b>";
  document.write(html);                         // 危險
  document.getElementById("slot").innerHTML = html; // 危險
}
window.renderUserHtml = renderUserHtml;

// ❌ window.open 未加 rel=noopener（reverse tabnabbing 風險）
const ext = qs.get("ext");
if (ext) {
  window.open(ext, "_blank"); // e.g., ?ext=https://example.com
}
