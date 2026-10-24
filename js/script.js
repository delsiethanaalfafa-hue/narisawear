/* NARISA WEAR — katalog, galeri, keranjang (CRUD), form pemesanan */

const WHATSAPP_NUMBER = "6287745105747";
const PRODUCT_PRICE = 50000;
const MAX_QTY = 20;
const CART_KEY = "narisa-cart";
const PRODUCT_NAME = "Everyday Loose Pants";

// ---------- Elemen utama ----------
const colorLabel = document.getElementById("color-label");
const colorButtons = document.querySelectorAll(".color-dot");
const productImage = document.getElementById("product-image");
const sizeSelect = document.getElementById("size");
const orderButton = document.getElementById("order-button");
const addCartButton = document.getElementById("add-cart");
const productNotice = document.querySelector(".product-info .notice");

let selectedColor = "Coklat Mahogany";

const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");

// ---------- Pilih warna: label, tanda aktif, foto produk ----------
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedColor = button.dataset.color;
    if (colorLabel) colorLabel.textContent = selectedColor;

    colorButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    if (productImage && button.dataset.image) {
      productImage.src = button.dataset.image;
      productImage.alt = "Loose pants NARISA WEAR warna " + selectedColor;
    }
    if (productNotice) productNotice.textContent = "";
  });
});

// ---------- Pesan langsung (satu produk) ----------
function showProductNotice(text) {
  if (productNotice) productNotice.textContent = text;
}

if (orderButton) {
  orderButton.addEventListener("click", () => {
    const selectedSize = sizeSelect.value;
    if (!selectedSize) {
      showProductNotice("Pilih ukuran dulu ya, lalu klik tombol pesan.");
      sizeSelect.focus();
      return;
    }
    showProductNotice("");
    const message =
      "Halo NARISA WEAR! Saya ingin memesan:\n\n" +
      "Produk: " + PRODUCT_NAME + "\n" +
      "Warna: " + selectedColor + "\n" +
      "Ukuran: " + selectedSize + "\n" +
      "Harga: " + rupiah(PRODUCT_PRICE) + "\n\n" +
      "Apakah stoknya masih tersedia?";
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message), "_blank", "noopener");
  });
}

// ---------- Keranjang (CRUD: create, read, update, delete) ----------
// Data disimpan di localStorage. Semua akses dibungkus try/catch
// supaya halaman tetap jalan walau penyimpanan diblokir browser.
function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    /* penyimpanan tidak tersedia: keranjang tetap berfungsi selama halaman terbuka */
  }
}

let cart = loadCart();

const cartList = document.getElementById("cart-list");
const cartEmpty = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

// CREATE: tambah item (warna + ukuran). Kalau sudah ada, jumlahnya ditambah.
function addToCart(color, size) {
  const found = cart.find((item) => item.color === color && item.size === size);
  if (found) {
    found.qty = Math.min(found.qty + 1, MAX_QTY);
  } else {
    cart.push({ color, size, qty: 1 });
  }
  saveCart(cart);
  renderCart();
}

// UPDATE: ubah jumlah item
function changeQty(index, delta) {
  const item = cart[index];
  if (!item) return;
  item.qty = Math.min(Math.max(item.qty + delta, 1), MAX_QTY);
  saveCart(cart);
  renderCart();
}

// DELETE: hapus satu item
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// DELETE: kosongkan semua
function clearCart() {
  cart = [];
  saveCart(cart);
  renderCart();
}

// READ: tampilkan isi keranjang
function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = totalQty;

  if (!cartList) return;
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-info";
    info.innerHTML =
      "<strong></strong><span></span>";
    info.querySelector("strong").textContent = PRODUCT_NAME;
    info.querySelector("span").textContent =
      "Warna " + item.color + " · Ukuran " + item.size + " · " + rupiah(PRODUCT_PRICE * item.qty);

    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Kurangi jumlah");
    minus.disabled = item.qty <= 1;
    minus.addEventListener("click", () => changeQty(index, -1));

    const qty = document.createElement("span");
    qty.className = "cart-qty";
    qty.textContent = item.qty;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Tambah jumlah");
    plus.disabled = item.qty >= MAX_QTY;
    plus.addEventListener("click", () => changeQty(index, 1));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-remove";
    remove.textContent = "Hapus";
    remove.addEventListener("click", () => removeFromCart(index));

    controls.append(minus, qty, plus, remove);
    li.append(info, controls);
    cartList.appendChild(li);
  });

  const total = cart.reduce((sum, item) => sum + PRODUCT_PRICE * item.qty, 0);
  if (cartTotal) cartTotal.textContent = rupiah(total);
  if (cartEmpty) cartEmpty.hidden = cart.length > 0;
  if (cartFooter) cartFooter.hidden = cart.length === 0;
}

function cartMessage() {
  const lines = cart.map((item, i) =>
    (i + 1) + ". " + PRODUCT_NAME + " — Warna: " + item.color +
    ", Ukuran: " + item.size + ", Jumlah: " + item.qty +
    " (" + rupiah(PRODUCT_PRICE * item.qty) + ")"
  );
  const total = cart.reduce((sum, item) => sum + PRODUCT_PRICE * item.qty, 0);
  return "Halo NARISA WEAR! Saya ingin memesan:\n\n" + lines.join("\n") +
    "\n\nTotal: " + rupiah(total) + "\n\nApakah stoknya masih tersedia?";
}

function openWhatsApp(message) {
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message), "_blank", "noopener");
}

if (addCartButton) {
  addCartButton.addEventListener("click", () => {
    const size = sizeSelect.value;
    if (!size) {
      showProductNotice("Pilih ukuran dulu sebelum menambah ke keranjang.");
      sizeSelect.focus();
      return;
    }
    showProductNotice("");
    addToCart(selectedColor, size);
  });
}

const cartCheckout = document.getElementById("cart-checkout");
if (cartCheckout) {
  cartCheckout.addEventListener("click", () => {
    if (cart.length === 0) return;
    openWhatsApp(cartMessage());
  });
}

const cartClear = document.getElementById("cart-clear");
if (cartClear) {
  cartClear.addEventListener("click", () => {
    if (window.confirm("Kosongkan semua isi keranjang?")) clearCart();
  });
}

renderCart();

// ---------- Form pemesanan dengan validasi ----------
const orderForm = document.getElementById("order-form");

const RULES = {
  nama: {
    el: "f-nama", err: "e-nama",
    check: (v) => v.trim().length >= 3 || "Nama minimal 3 karakter.",
  },
  wa: {
    el: "f-wa", err: "e-wa",
    check: (v) => {
      const digits = v.replace(/[\s-]/g, "");
      if (!digits) return "Nomor WhatsApp wajib diisi.";
      if (!/^(08|62)\d+$/.test(digits)) return "Harus diawali 08 atau 62, hanya angka.";
      if (digits.length < 10 || digits.length > 14) return "Panjang nomor 10 sampai 14 digit.";
      return true;
    },
  },
  kota: {
    el: "f-kota", err: "e-kota",
    check: (v) => v.trim().length >= 2 || "Kota wajib diisi.",
  },
  warna: {
    el: "f-warna", err: "e-warna",
    check: (v) => v !== "" || "Pilih salah satu warna.",
  },
  ukuran: {
    el: "f-ukuran", err: "e-ukuran",
    check: (v) => v !== "" || "Pilih salah satu ukuran.",
  },
  jumlah: {
    el: "f-jumlah", err: "e-jumlah",
    check: (v) => {
      const n = Number(v);
      if (!Number.isInteger(n)) return "Jumlah harus berupa angka bulat.";
      return (n >= 1 && n <= MAX_QTY) || "Jumlah harus antara 1 sampai " + MAX_QTY + ".";
    },
  },
};

// Validasi satu kolom; tampilkan atau hapus pesan error di bawahnya
function validateField(key) {
  const rule = RULES[key];
  const input = document.getElementById(rule.el);
  const errEl = document.getElementById(rule.err);
  const result = rule.check(input.value);
  const ok = result === true;
  errEl.textContent = ok ? "" : result;
  input.classList.toggle("is-invalid", !ok);
  input.setAttribute("aria-invalid", ok ? "false" : "true");
  return ok;
}

if (orderForm) {
  // Validasi langsung saat kolom ditinggalkan, supaya pesannya tidak menumpuk
  Object.keys(RULES).forEach((key) => {
    const input = document.getElementById(RULES[key].el);
    input.addEventListener("blur", () => validateField(key));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) validateField(key);
    });
  });

  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    status.textContent = "";

    let firstBad = null;
    Object.keys(RULES).forEach((key) => {
      if (!validateField(key) && !firstBad) firstBad = document.getElementById(RULES[key].el);
    });
    if (firstBad) {
      firstBad.focus();
      status.textContent = "Periksa kembali data yang belum lengkap.";
      return;
    }

    const v = (key) => document.getElementById(RULES[key].el).value.trim();
    const jumlah = Number(v("jumlah"));
    const message =
      "Halo NARISA WEAR! Saya ingin memesan:\n\n" +
      "Nama: " + v("nama") + "\n" +
      "No. WhatsApp: " + v("wa") + "\n" +
      "Kota: " + v("kota") + "\n\n" +
      "Produk: " + PRODUCT_NAME + "\n" +
      "Warna: " + v("warna") + "\n" +
      "Ukuran: " + v("ukuran") + "\n" +
      "Jumlah: " + jumlah + "\n" +
      "Total: " + rupiah(PRODUCT_PRICE * jumlah) + "\n\n" +
      "Apakah stoknya masih tersedia?";

    status.textContent = "Pesananmu sudah dibuka di WhatsApp.";
    openWhatsApp(message);
  });
}

// ---------- Slider: galeri warna & cara memesan (satu per satu) ----------
document.querySelectorAll("[data-slider]").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prevBtn = slider.querySelector(".slider-prev");
  const nextBtn = slider.querySelector(".slider-next");
  const dotsWrap = slider.querySelector(".slider-dots");
  const countEl = slider.querySelector(".slider-count");
  let index = 0;

  const dots = slides.map((_, n) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", "Tampilkan " + (n + 1));
    dot.addEventListener("click", () => go(n));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function go(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === index));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === index));
    if (countEl) countEl.textContent = (index + 1) + " / " + slides.length;
  }

  prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn.addEventListener("click", () => go(index + 1));

  // Geser dengan jari di HP
  let startX = null;
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  slider.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  go(0);
});

// ---------- Tombol "Pilih warna ini" di galeri ----------
document.querySelectorAll(".pick-color").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.closest(".slide").dataset.color;
    const dot = document.querySelector('.color-dot[data-color="' + name + '"]');
    if (dot) dot.click();
    document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
  });
});
