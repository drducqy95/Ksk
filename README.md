# KSK PRO - Tra Cứu ICD-10 & Xếp Loại Sức Khỏe PWA

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-0284c7?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

Ứng dụng web tiến bộ (**Progressive Web App - PWA**) chuyên sâu phục vụ tra cứu mã bệnh quốc tế **ICD-10** và tự động hóa quy trình **đánh giá, phân loại sức khỏe** căn cứ theo các Thông tư, Nghị định pháp quy mới nhất của Bộ Quốc phòng và Bộ Y tế.

---

## 🎯 Các Đối Tượng Khám Hỗ Trợ

1. **Tuyển sinh Quân sự**: Xét tuyển vào các Học viện, Nhà trường Sĩ quan Quân đội (Học viện Kỹ thuật Quân sự, Học viện Quân y, Trường Sĩ quan Lục quân 1, 2, Học viện Hải quân, Học viện Phòng không - Không quân...).
2. **Khám sức khỏe định kỳ Quân nhân**: Phân loại sức khỏe hàng năm cho sĩ quan, quân nhân chuyên nghiệp, hạ sĩ quan, binh sĩ để duy trì khả năng sẵn sàng chiến đấu.
3. **Khám sức khỏe xin việc làm / Tuyển dụng lao động**: Cấp giấy khám sức khỏe tuyển dụng vào các doanh nghiệp, cơ quan, tổ chức.
4. **Khám sức khỏe định kỳ Người lao động**: Theo dõi sức khỏe người lao động tại doanh nghiệp, đánh giá bệnh nghề nghiệp và bố trí vị trí làm việc an toàn.
5. **Khám tuyển sinh Đại học, Cao đẳng, Dân sự**: Khám đầu khóa cho học sinh, sinh viên các cơ sở giáo dục nghề nghiệp và đại học.

---

## 📜 Căn Cứ Pháp Lý & Quy Chuẩn Áp Dụng

- **Thông tư số 105/2023/TT-BQP** (có hiệu lực từ ngày 01/01/2024, thay thế TTLT 16/2016/TTLT-BYT-BQP):
  - Quy định tiêu chuẩn sức khỏe, khám sức khỏe cho các đối tượng thuộc phạm vi quản lý của Bộ Quốc phòng.
  - Thang điểm 1 - 6 cho 8 chỉ tiêu chuyên khoa: Thể lực, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Nội khoa & Tuần hoàn, Ngoại khoa, Da liễu, Tâm thần kinh.
  - Nguyên tắc xếp loại sức khỏe chung từ Loại 1 đến Loại 6 theo chỉ tiêu có điểm số cao nhất.
  - Quy định riêng về tiêu chuẩn thể lực, thị lực và tật khúc xạ (cận thị < 3.0D đối với khối trường Kỹ thuật quân sự).

- **Thông tư số 32/2023/TT-BYT** (có hiệu lực từ ngày 01/01/2024, thay thế TT 14/2013/TT-BYT):
  - Quy định chi tiết một số điều của Luật Khám bệnh, chữa bệnh về tiêu chuẩn và quy trình khám sức khỏe.
  - Thang xếp loại 5 bậc của Bộ Y tế: Loại I (Rất khỏe), Loại II (Khỏe), Loại III (Trung bình), Loại IV (Yếu), Loại V (Rất yếu).
  - Quy định danh mục khám lâm sàng và các chỉ định cận lâm sàng bắt buộc (X-quang tim phổi, công thức máu, đường máu, men gan, nước tiểu 10 thông số...).

---

## 🚀 Tính Năng Chính Của Ứng Dụng

- 🔍 **Tra cứu ICD-10 Thông minh**:
  - Tra cứu tức thì theo mã ICD-10 (A00 - Z99), tên tiếng Việt (hỗ trợ gõ không dấu) hoặc tên tiếng Anh.
  - Lọc theo chuyên khoa và theo điều kiện tuyển sinh quân sự (Đủ ĐK / Có điều kiện / Không đạt).
  - Đối chiếu trực tiếp điều khoản phân loại TT 105 (Điểm 1 - 6) và TT 32 (Loại I - V).
  - Nút thêm nhanh bệnh lý vào hồ sơ đánh giá sức khỏe.

- 🧮 **Công cụ Đánh giá & Xếp loại Sức khỏe Toàn diện**:
  - Tự động tính chỉ số khối cơ thể (BMI) và phân loại theo thể trạng người Việt Nam.
  - Kiểm tra thể lực tự động theo chuẩn Nam/Nữ và đối tượng ưu tiên (KV1, hải đảo, dân tộc thiểu số).
  - Đánh giá thị lực, tật khúc xạ (cận thị, loạn thị), huyết áp, nhịp tim, số răng sâu, mất răng, thính lực.
  - Tự động tổng hợp kết luận theo cả 2 hệ quy chuẩn (TT 105 và TT 32).
  - Cảnh báo các yếu tố vi phạm tiêu chuẩn hoặc không đủ điều kiện dự tuyển.

- 🏫 **Tra cứu Tiêu chuẩn Tuyển sinh các Trường Quân đội**:
  - Bảng tổng hợp điều kiện thể lực và thị lực của các học viện, trường quân sự lớn.
  - Phân loại rõ nhóm trường chỉ huy (không nhận cận thị) và nhóm trường kỹ thuật (cho phép cận thị ≤ 3.0D).

- 📄 **Xuất Phiếu Kết Luận & In Ấn**:
  - Hỗ trợ in ấn mẫu phiếu kết quả khám (Print layout chuyên nghiệp chuẩn y tế).
  - Sao chép tóm tắt kết quả vào clipboard chỉ với 1 cú click.

- 📱 **Progressive Web App (PWA) & Offline Mode**:
  - Khả năng cài đặt trực tiếp lên màn hình chính điện thoại (Android, iOS) và máy tính (Windows, macOS, Linux).
  - Hoạt động ngoại tuyến 100% (Offline-ready) không cần kết nối Internet nhờ Workbox Service Worker.

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu môi trường
- Node.js ≥ 18.x
- npm ≥ 9.x

### Cài đặt dependencies
```bash
cd Ksk
npm install
```

### Chạy môi trường phát triển (Dev)
```bash
npm run dev
```

### Build cho môi trường Production (PWA)
```bash
npm run build
```
Kết quả build được tạo tại thư mục `dist/`, sẵn sàng triển khai trên GitHub Pages, Vercel, Netlify, Cloudflare Pages hoặc máy chủ Nginx.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa (Workbox)
