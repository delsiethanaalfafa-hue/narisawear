# NARISA WEAR — Katalog Loose Pants

Website katalog sederhana untuk brand **NARISA WEAR**. Pelanggan bisa melihat produk,
memilih warna dan ukuran, lalu memesan lewat WhatsApp dengan pesan yang sudah terisi otomatis.

🔗 **Demo online:** https://delsiethanaalfafa-hue.github.io/narisawear/  <!-- ganti setelah GitHub Pages aktif -->

## Screenshot

| Desktop | HP |
|---|---|
| ![Tampilan desktop](docs/screenshot-desktop.png) | ![Tampilan HP](docs/screenshot-mobile.png) |

## Fitur

**Katalog & tampilan**
- Halaman beranda dengan identitas dan gaya visual NARISA WEAR (ivory, cokelat, hitam)
- Galeri 9 warna berbentuk slider: satu foto per layar, bisa digeser dengan panah, titik, atau swipe
- Tombol **Pilih warna ini** di galeri langsung memilih warna produk
- Kartu produk dengan foto, harga, dan deskripsi singkat; foto berganti sesuai warna yang dipilih
- Responsif untuk HP, tablet, dan desktop

**Pemesanan**
- Pilih warna dan ukuran (S / M / L / XL); ukuran wajib dipilih sebelum memesan
- **Keranjang belanja (CRUD):** tambah item (create), lihat isi keranjang (read), ubah jumlah (update), hapus item atau kosongkan semua (delete). Data disimpan di localStorage browser.
- **Form pemesanan dengan validasi:** nama minimal 3 karakter, nomor WhatsApp diawali 08 atau 62 (10–14 digit), kota, warna, ukuran, dan jumlah 1–20. Pesan error muncul di bawah tiap kolom.
- Pesan WhatsApp terisi otomatis sesuai pesanan, lalu terbuka di aplikasi WhatsApp
- Tombol **Lihat Toko NarisaWear** menuju TikTok Shop
- Langkah "Cara Memesan" dalam 4 langkah yang bisa digeser

**Navigasi & footer**
- Menu atas: Home, Collection, About Us, Keranjang (dengan jumlah item)
- Footer berisi tautan cepat, kontak WhatsApp, dan media sosial

## Teknologi

HTML5, CSS3 (Grid & Flexbox), dan JavaScript (tanpa framework). Font dari Google Fonts
(Playfair Display dan DM Sans).

## Struktur Folder

```
.
├── index.html        # halaman utama
├── css/
│   └── style.css     # seluruh gaya tampilan
├── js/
│   └── script.js     # pilih warna, validasi, link WhatsApp
├── images/           # foto produk dan logo
├── docs/             # screenshot untuk README
├── .gitignore
└── README.md
```

## Cara Menjalankan

1. Clone repo ini:
   ```bash
   git clone https://github.com/USERNAME/NAMA-REPO.git
   ```
2. Buka foldernya di VS Code.
3. Klik kanan `index.html` lalu pilih **Open with Live Server**
   (atau buka `index.html` langsung di browser).

Tidak perlu instalasi tambahan.

## Cara Kerja Keranjang

Keranjang disimpan di `localStorage` dengan kunci `narisa-cart`. Data hanya tersimpan di browser tempat pengguna membuka website, dan akan hilang jika data browser dihapus. Semua akses dibungkus `try/catch`, sehingga halaman tetap berjalan meski penyimpanan diblokir.

## Mengubah Data Produk

- Harga: ubah `PRODUCT_PRICE` di `js/script.js` dan teks harga di `index.html`.
- Nomor WhatsApp: ubah `WHATSAPP_NUMBER` di `js/script.js`.
- Foto warna: taruh di folder `images/` dan sesuaikan atribut `data-image` pada tombol warna di `index.html`.

## Catatan

Ini versi pertama berupa katalog statis tanpa server. Ketersediaan stok dikonfirmasi manual
oleh penjual lewat WhatsApp. Pengembangan berikutnya: dashboard admin, database pesanan,
dan sinkronisasi stok.

## Pembuat

[Delsie Thana Alfafa] — [60225069] — UTS Pemrograman Website
