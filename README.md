# ⚡ Indra Gunawan (@naraichi) - Cyberpunk Profile

Repository ini berisi source code website profil statis bertema **Cyberpunk Hacker Dark** (dominan hitam, biru neon `#00f0ff`, dan hijau matriks `#00ff66`) untuk **Indra Gunawan (@naraichi)**, mahasiswa **Tadris Matematika (MTK) / FTIK IAIN Kerinci**.

---

## 🚀 Fitur Unggulan

1. **Header Banner Cyberpunk**
   - Capsule-render SVG banner bergradien neon cyan & dark void.
   - Typing SVG dinamis (`readme-typing-svg`) bertema terminal zsh.
2. **About Me Terminal HUD**
   - Simulasi terminal interaktif dengan command prompt `$ whoami`, `cat profile.json`, dan `./status.sh`.
   - CLI Emulator interaktif di browser: pengunjung dapat mengetik perintah (`help`, `whoami`, `skills`, `projects`, `contact`, `matrix`, `date`, `clear`).
3. **Tech Stack & Badges**
   - Shields.io badge gelap neon & integrasi Skillicons.dev.
   - Kategori: AI Agent & OMP, Core Languages, Web Frameworks, Database & DevOps.
4. **GitHub Telemetry & Stats**
   - `github-readme-stats` lengkap dengan top languages dan streak stats.
   - **Live Theme Switcher**: Tombol pengubah tema instan di halaman (`tokyonight`, `radical`, `dracula`, `cyberpunk`).
5. **Flagship Projects Showcase**
   - Cyberpunk pin cards untuk **E-Office**, **E-Shopping**, dan **AI Agent Lab**.
   - Tabel perbandingan arsitektur teknis sistem.
6. **Contribution Snake Animation (platane/snk)**
   - Display animasi ular memakan commit GitHub.
   - Fallback dynamic canvas jika branch output belum digenerate.
   - GitHub Actions workflow otomatis di `.github/workflows/snake.yml`.
7. **Contact & Social Frequencies**
   - Badge sosial media gelap: GitHub, LinkedIn, Email, Telegram, Instagram.
   - Form transmisi pesan instan terintegrasi email dispatch.
8. **Footer & Cyber Quotes**
   - Wave banner (`capsule-render`), kutipan logika matematika Bertrand Russell, dan status telemetry.
9. **Interactive System Canvas & Synthesizer**
   - Efek hujan digital Matrix (dapat di-toggle ON/OFF).
   - Audio feedback synthesizer (Web Audio API murni tanpa file eksternal, dapat di-mute/unmute).

---

## 📂 Struktur File

```text
├── index.html                   # Halaman web statis utama
├── assets/
│   ├── css/
│   │   └── style.css            # Styling tema cyberpunk, neon glow, scanline & layout responsif
│   └── js/
│       └── main.js              # Script matriks, terminal CLI, theme switcher, canvas snake
├── .github/
│   └── workflows/
│       └── snake.yml            # Workflow GitHub Actions untuk generate Platane Snake
└── README.md                    # Dokumentasi & panduan deployment
```

---

## 🛠️ Cara Deploy ke GitHub Pages

Karena repository ini bernama `iain.github.io` (atau dapat di-host di user page/project page):

1. **Push semua file ke branch `main`**:
   ```bash
   git add .
   git commit -m "feat: initial cyberpunk profile page"
   git push origin main
   ```
2. **Aktifkan GitHub Pages**:
   - Buka tab **Settings** di repository GitHub Anda.
   - Pilih menu **Pages** di sebelah kiri.
   - Pada bagian **Build and deployment > Source**, pilih **Deploy from a branch**.
   - Pilih Branch: `main` / Folder: `/(root)`, lalu klik **Save**.
   - Website akan otomatis aktif dalam beberapa saat.

---

## 🐍 Cara Mengaktifkan GitHub Actions Snake

Workflow telah disiapkan di `.github/workflows/snake.yml`. Untuk menjalankannya:

1. Buka tab **Settings > Actions > General** di repo GitHub Anda.
2. Scroll ke bagian **Workflow permissions**, pilih **Read and write permissions**, lalu klik **Save**.
3. Buka tab **Actions** di GitHub, pilih workflow **Generate Snake Animation**, lalu klik **Run workflow**.
4. Workflow akan otomatis berjalan setiap 12 jam dan menyimpan SVG animasi ular ke branch `output`.
