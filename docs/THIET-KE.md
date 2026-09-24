# Việt phục Remix – Tài liệu thiết kế

Tài liệu này trả lời bốn yêu cầu của đề thi và mô tả cách bản demo đáp ứng từng chức năng.

## 1. Nhóm trang phục và bối cảnh văn hóa

Bản demo tập trung vào **5 kiểu áo truyền thống của người Việt (Kinh)**, trải đủ ba miền và nhiều giai đoạn lịch sử:

| Trang phục | Vùng gắn bó | Giai đoạn | Mức trang trọng |
| --- | --- | --- | --- |
| Áo dài | Cả nước | Định hình từ thập niên 1930 | Lễ phục |
| Áo ngũ thân | Cả nước | Từ cải cách y phục năm 1744, phổ biến thời Nguyễn | Lễ phục |
| Áo tứ thân | Bắc Bộ (Kinh Bắc) | Phổ biến đến đầu thế kỷ XX | Lịch sự |
| Áo bà ba | Nam Bộ | Cuối thế kỷ XIX | Đời thường |
| Áo Nhật Bình | Trung Bộ (Huế, cung đình) | Triều Nguyễn 1802–1945 | Lễ phục |

Đi kèm là 6 kiểu phần dưới, 6 chất liệu, 6 hoa văn, 19 phụ kiện theo 5 vị trí (đầu, cổ, tay, eo, chân), 8 sự kiện, 3 vùng miền và 4 kiểu thời tiết.

**Lý do chọn phạm vi này:** đây là những trang phục học sinh, sinh viên gặp nhiều nhất (kỷ yếu, Tết, lễ hội, chụp ảnh cổ phục) và có đủ tư liệu để trình bày chính xác. Trang phục của các dân tộc thiểu số chưa được đưa vào có chủ đích: việc thể hiện chúng cần sự tham gia của chính cộng đồng đó (xem mục 4).

## 2. Nhu cầu người dùng

Người dùng chính là học sinh THPT và sinh viên 16–24 tuổi.

| Chân dung | Tình huống | Nhu cầu | Chức năng đáp ứng |
| --- | --- | --- | --- |
| Lan, 17 tuổi, lớp trưởng | Chọn áo cho buổi chụp kỷ yếu của cả lớp | Đồng bộ nhưng vẫn trẻ trung, biết màu nào lên ảnh đẹp | Gợi ý theo sự kiện, bảng màu phong cách, kiểm tra hài hòa màu, so sánh 3 phương án |
| Minh, 20 tuổi, sinh viên | Lần đầu mặc áo ngũ thân đi chúc Tết | Sợ mặc sai, không biết phối khăn, giày | Thông tin cấu trúc, phụ kiện gắn nhãn "chuẩn", cảnh báo độ trang trọng |
| Vy, 19 tuổi, CLB văn nghệ | Dựng tiết mục Quan họ | Cần trang phục đúng vùng miền | Lọc theo vùng miền, cảnh báo pha trộn vùng miền, bộ mẫu "Liền chị Quan họ" |
| Khoa, 22 tuổi, thích streetwear | Muốn mặc áo dài đi dạo phố | Biến tấu nhưng không bị chê "phá" áo dài | Phong cách Streetwear remix, nhãn mức biến tấu, cảnh báo khi vượt giới hạn |
| Hà, 18 tuổi | Muốn đăng ảnh lên mạng xã hội | Có ảnh đẹp, có thông tin để viết chú thích | Xuất ảnh PNG 4:5, lookbook, link/mã chia sẻ |

Nhu cầu chung rút ra:

1. **Biết mặc gì cho dịp nào** mà không phải tự tra cứu nhiều nguồn.
2. **Được sáng tạo** theo gu cá nhân.
3. **Tránh sai sót văn hóa** và biết vì sao nó sai.
4. **Hiểu câu chuyện** phía sau trang phục để kể lại khi chia sẻ.
5. **Lưu, so sánh, chia sẻ** kết quả với bạn bè.

## 3. Trải nghiệm phối đồ

```
Bối cảnh ──► Gợi ý ──► Trang phục ──► Màu sắc ──► Phong cách & phụ kiện ──► Nhân vật
(sự kiện,    (3 loại   (áo, phần     (4 mảng     (5 phong cách,             (dáng, da,
 vùng miền,   áo hợp    dưới, chất    màu, bảng   5 vị trí phụ kiện)         tóc, ảnh)
 thời tiết)   nhất)     liệu, hoa     màu truyền
                        văn)          thống)
                               │
                               ▼
        Hình minh họa cập nhật tức thì + Thẻ đánh giá + Kiểm tra văn hóa + Thông tin trang phục
                               │
                               ▼
              Lưu lookbook · So sánh · Xuất PNG · Chia sẻ link / mã
```

- **Màn hình phối đồ** chia ba cột: điều khiển theo 6 bước (trái), hình minh họa luôn trong tầm mắt (giữa), thẻ kết quả (phải). Trên điện thoại, hình minh họa nằm đầu trang.
- **Không có màn hình trống:** lần đầu mở, ứng dụng hiện sẵn bộ "Tết phố cổ" và 4 bộ mẫu trong lookbook.
- **Phản hồi tức thì:** mọi thay đổi cập nhật hình, điểm phù hợp, điểm hài hòa màu và danh sách cảnh báo ngay lập tức.
- **Gợi ý một chạm:** nút "Áp dụng" dựng sẵn cả bộ (phần dưới, chất liệu theo thời tiết, hoa văn theo dịp, bảng màu, phụ kiện đúng vùng miền). Nếu phong cách người dùng chọn vượt mức biến tấu của dịp, gợi ý tự hạ xuống mức phù hợp và nói rõ lý do.
- **Nhãn "chuẩn" và "hiện đại"** trên từng lựa chọn giúp người dùng biết mình đang theo truyền thống hay đang biến tấu.

### Các chức năng bắt buộc

| Yêu cầu | Thực hiện |
| --- | --- |
| Chọn loại trang phục hoặc sự kiện | Bước 1 (8 sự kiện) và bước 3 (5 loại áo) |
| Chọn màu sắc, phụ kiện, phong cách | Bước 4 (17 màu truyền thống + bộ chọn màu tự do), bước 5 (5 phong cách, 19 phụ kiện) |
| Xem kết quả dạng hình ảnh, thẻ gợi ý, mockup | Hình minh họa SVG vẽ theo từng lựa chọn, thẻ đánh giá, thẻ gợi ý |
| Đọc thông tin nguồn gốc, ý nghĩa | Thẻ "Về trang phục" trong phòng phối đồ và trang Tìm hiểu đầy đủ, có nguồn |

### Các chức năng bổ sung (đã làm đủ 6/6)

| Gợi ý của đề | Thực hiện |
| --- | --- |
| Tải ảnh hoặc chọn nhân vật đại diện | Chọn dáng nam/nữ, 4 tông da, 3 kiểu tóc; tải ảnh chân dung (cắt vuông, xử lý tại máy) |
| Gợi ý theo thời tiết và sự kiện | Xếp hạng loại áo theo sự kiện, vùng miền; chọn chất liệu theo thời tiết; cảnh báo vải nóng, vải dễ ố khi mưa, guốc trơn |
| Kiểm tra hài hòa màu | Chấm điểm 0–100 theo vòng tròn màu, nhận diện kiểu phối (đơn sắc, tương đồng, bổ túc, bộ ba), giải thích và gợi ý chỉnh |
| So sánh phương án | Trang So sánh tối đa 3 phương án, đánh dấu phương án phù hợp nhất |
| Tạo và chia sẻ lookbook | Lưu, đặt tên, ghi chú; chia sẻ bằng link hoặc mã; xuất ảnh PNG 1080×1350 |
| Cảnh báo sai lệch văn hóa | Bộ quy tắc 3 mức, xem mục 4 |

## 4. Bảo đảm thông tin văn hóa được thể hiện phù hợp

### 4.1. Nội dung có nguồn và có nhãn độ tin cậy

Mỗi thông tin về nguồn gốc, ý nghĩa được gắn một trong ba nhãn:

- **Có tư liệu:** ghi nhận trong sử liệu, hiện vật bảo tàng, công trình nghiên cứu. Ví dụ: lệnh cải cách y phục năm 1744 của chúa Nguyễn Phúc Khoát (Lê Quý Đôn, *Phủ biên tạp lục*).
- **Cách hiểu phổ biến:** giải thích dân gian chưa thấy ghi chép chính thức. Ví dụ: năm khuy áo ngũ thân tượng trưng ngũ thường.
- **Còn tranh luận:** nhiều giả thuyết. Ví dụ: nguồn gốc tên gọi "áo bà ba".

Nguồn tham khảo được liệt kê cho từng trang phục: *Ngàn năm áo mũ* (Trần Quang Đức), *Trang phục Việt Nam* (Đoàn Thị Tình), *Phủ biên tạp lục* (Lê Quý Đôn), Bảo tàng Phụ nữ Việt Nam, Bảo tàng Cổ vật Cung đình Huế, hồ sơ UNESCO về Quan họ (2009) và Đờn ca tài tử (2013).

Mỗi trang phục có mục **"Dễ nhầm với"** (áo dài và sườn xám, áo ngũ thân và Hán phục...) và **"Khi phối, hãy giữ"** nêu những đặc điểm nhận diện không nên thay đổi.

### 4.2. Cảnh báo giải thích, không cấm đoán

Bộ quy tắc (`src/lib/rules.ts`) chia 3 mức, mỗi cảnh báo luôn có **lý do** và **cách sửa**:

| Mức | Ví dụ |
| --- | --- |
| Cần sửa | Áo dài, áo ngũ thân, áo tứ thân, áo Nhật Bình phối với váy ngắn; bộ phối thấp hơn độ trang trọng của dịp từ 2 bậc |
| Lưu ý | Áo Nhật Bình phối đồ đường phố; rồng trên áo Nhật Bình; áo trắng/đen ngày Tết; trùng màu đỏ của cô dâu; jeans trong dịp trang trọng; vải không hợp thời tiết |
| Gợi ý | Pha trộn phụ kiện khác vùng miền; áo tứ thân mặc với quần; trang phục truyền thống của nữ do nam mặc |

Ứng dụng không chặn lựa chọn nào: người dùng được tự do sáng tạo, còn ứng dụng giúp họ biết mình đang làm gì.

### 4.3. Gọi đúng tên mức biến tấu

Mỗi bộ phối được tự động gắn nhãn **Truyền thống / Cách tân nhẹ / Remix / Remix mạnh** trên hình minh họa, trong thẻ đánh giá và trang so sánh, để hình ảnh chia sẻ không bị hiểu nhầm là tư liệu lịch sử.

### 4.4. Quy trình duyệt và góp ý

1. Soạn nội dung từ tư liệu, ghi nguồn cho từng mục.
2. Gắn nhãn độ tin cậy.
3. Mời người có chuyên môn (giảng viên văn hóa học, cán bộ bảo tàng, nghệ nhân) đọc duyệt trước khi phát hành.
4. Người dùng góp ý qua biểu mẫu trong trang "Nguyên tắc văn hóa"; biểu mẫu mở sẵn một issue trên GitHub của dự án để việc sửa đổi được theo dõi công khai.

### 4.5. Kiểm thử tự động

Bộ kiểm thử (`src/lib/logic.test.ts`) bảo đảm:

- Mọi gợi ý hàng đầu, với mọi tổ hợp sự kiện × vùng miền × thời tiết × phong cách × dáng người (1.800 tổ hợp), **không sinh ra cảnh báo mức "Cần sửa" hay "Lưu ý"**: ứng dụng không tự gợi ý điều sai.
- Các bộ mẫu không có cảnh báo và có màu hài hòa.
- Bảng màu của mọi phong cách, sự kiện đạt từ 80 điểm hài hòa.
- Dữ liệu tham chiếu hợp lệ; link chia sẻ hỏng hoặc bị sửa đổi được làm sạch an toàn.

### 4.6. Quyền riêng tư

Ảnh chân dung được cắt và thu nhỏ ngay trên trình duyệt, không gửi đi đâu và không nằm trong link chia sẻ. Lookbook lưu trong bộ nhớ trình duyệt của người dùng.

## 5. Hướng phát triển

- Mời chuyên gia duyệt nội dung và công bố danh sách người duyệt.
- Bổ sung trang phục các dân tộc thiểu số cùng cộng đồng và nhà nghiên cứu.
- Lấy dữ liệu thời tiết thực theo địa phương và ngày sự kiện.
- Thêm góc nhìn nghiêng, sau cho hình minh họa; thư viện hoa văn phong phú hơn.
