# Việt phục Remix

Ứng dụng web giúp học sinh, sinh viên **khám phá và phối trang phục truyền thống Việt Nam** (áo dài, áo ngũ thân, áo tứ thân, áo bà ba, áo Nhật Bình) theo sự kiện, vùng miền, thời tiết và phong cách cá nhân, đồng thời **cảnh báo những cách phối dễ làm sai lệch đặc trưng văn hóa**.

Tài liệu thiết kế (nhóm trang phục, nhu cầu người dùng, trải nghiệm phối đồ, cách bảo đảm thông tin văn hóa): [docs/THIET-KE.md](docs/THIET-KE.md).

## Chức năng

- **Phối đồ theo 6 bước:** bối cảnh (8 sự kiện, 3 vùng miền, 4 kiểu thời tiết) → gợi ý → trang phục (áo, phần dưới, chất liệu, hoa văn) → màu sắc (17 màu truyền thống + màu tự do) → phong cách và 19 phụ kiện → nhân vật.
- **Hình minh họa SVG** cập nhật tức thì theo từng lựa chọn; có thể dùng ảnh chân dung của bạn.
- **Thẻ đánh giá:** điểm phù hợp, điểm hài hòa màu, độ trang trọng, mức biến tấu.
- **Kiểm tra văn hóa** 3 mức (Cần sửa / Lưu ý / Gợi ý), mỗi cảnh báo có lý do và cách sửa.
- **Gợi ý theo sự kiện, vùng miền, thời tiết** với nút áp dụng cả bộ.
- **So sánh** tối đa 3 phương án.
- **Lookbook:** lưu, đặt tên, ghi chú; chia sẻ bằng link hoặc mã; xuất ảnh PNG 1080×1350.
- **Tìm hiểu:** nguồn gốc, cấu trúc, ý nghĩa, dịp mặc, điểm dễ nhầm, nguồn tham khảo; mỗi thông tin gắn nhãn độ tin cậy.
- **Nguyên tắc văn hóa:** các nguyên tắc, danh sách quy tắc kiểm tra và biểu mẫu góp ý (mở issue GitHub).

## Chạy thử

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run dev          # chạy tại http://localhost:5173
npm test             # chạy bộ kiểm thử
npm run build        # đóng gói vào thư mục dist/
npm run build:single # đóng gói thành một file HTML duy nhất (dist-single/index.html)
```

Thư mục `dist/` là trang tĩnh, có thể đưa lên GitHub Pages, Netlify, Vercel hoặc bất kỳ máy chủ tĩnh nào (đường dẫn tương đối nên chạy được ở thư mục con).

## Cấu trúc mã

```
src/
  data/garments.ts      Dữ liệu 5 trang phục: nguồn gốc, cấu trúc, ý nghĩa, nguồn tham khảo
  data/catalog.ts       Phần dưới, chất liệu, hoa văn, phụ kiện, phong cách, sự kiện, vùng miền, thời tiết, màu
  data/presets.ts       7 bộ phối mẫu
  lib/harmony.ts        Chấm điểm hài hòa màu
  lib/rules.ts          Quy tắc cảnh báo văn hóa, độ trang trọng, mức biến tấu
  lib/recommend.ts      Gợi ý trang phục và dựng bộ phối theo bối cảnh
  lib/share.ts          Mã hóa/giải mã và làm sạch dữ liệu chia sẻ
  lib/exportImage.ts    Xuất ảnh PNG, xử lý ảnh chân dung
  components/           Giao diện (Mockup SVG, phòng phối đồ, so sánh, lookbook, tìm hiểu, nguyên tắc)
```

## Góp ý nội dung

Nếu bạn thấy thông tin văn hóa chưa chính xác, hãy dùng biểu mẫu trong mục **Nguyên tắc văn hóa** của ứng dụng hoặc mở issue trên kho mã này, kèm nguồn tham khảo.
