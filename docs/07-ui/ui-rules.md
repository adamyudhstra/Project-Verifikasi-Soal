# UI / UX Rules

Prinsip-prinsip ini harus dipatuhi oleh pengembang UI (React/Inertia.js) untuk menghindari duplikasi upaya atas fitur yang dibatalkan, serta menjaga konsistensi dengan aturan bisnis.

## 1. Aturan Presisi Visual & Legacy Deletion
- **Dilarang Menampilkan Fitur Terhapus**: Sesuai dengan hasil rapat, seluruh layar, formulir, dan menu navigasi yang berhubungan dengan "Penetapan Nilai PLO" tidak boleh sekadar di-*hidden* (CSS `display: none`), melainkan **tidak dirender sama sekali** di DOM tree.
- **Penghapusan Kursor Tooltip**: Elemen tooltip/kursor informasi tambahan pada area *Chart/Grafik* di Dashboard (yang sebelumnya diprotes karena redundan atau tidak jelas peruntukannya) WAJIB dihapus dari komponen grafik (*BR-10*).

## 2. Dynamic Context 
- **Periode Statis untuk Koordinator**: Saat Koordinator berada pada layar *Upload Soal*, opsi "Periode" (UTS/UAS) **tidak boleh** berupa dropdown *Select* manual jika sistem sudah mendeteksi bahwa periode saat ini adalah UTS. Layar harus secara otomatis mengunci pilihan tersebut dan menjadikannya berlabel *Read-only* untuk mencegah kesalahan manusia.

## 3. Responsive & Aksesibilitas
- Layar minimal harus dapat beradaptasi pada resolusi Tablet (karena dosen berpotensi memeriksa soal via iPad/Tablet).
- Indikator status (Approved, Revision, Rejected) harus bergantung ganda pada warna dan teks (tidak boleh murni mengandalkan warna hijau/merah/kuning, karena kendala buta warna). Gunakan juga icon pelengkap (Centang, Tanda Seru, Silang).
