import type { Garment, GarmentId, Source } from '../types';

const NGAN_NAM_AO_MU: Source = {
  title: 'Trần Quang Đức – Ngàn năm áo mũ',
  detail: 'Nhã Nam & NXB Thế Giới, 2013. Khảo cứu lịch sử trang phục Việt Nam giai đoạn 1009–1945.',
};
const TRANG_PHUC_VN: Source = {
  title: 'Đoàn Thị Tình – Trang phục Việt Nam',
  detail: 'NXB Mỹ thuật. Tư liệu và hình vẽ về cấu trúc các kiểu áo truyền thống.',
};
const PHU_BIEN: Source = {
  title: 'Lê Quý Đôn – Phủ biên tạp lục (1776)',
  detail: 'Ghi chép lệnh cải cách y phục của chúa Nguyễn Phúc Khoát ở Đàng Trong năm 1744.',
};
const BT_PHU_NU: Source = {
  title: 'Bảo tàng Phụ nữ Việt Nam (Hà Nội)',
  detail: 'Chuyên đề và hiện vật về áo dài, áo tứ thân, trang phục phụ nữ các vùng miền.',
};
const BT_CO_VAT_HUE: Source = {
  title: 'Bảo tàng Cổ vật Cung đình Huế',
  detail: 'Hiện vật và tư liệu về y phục hoàng tộc triều Nguyễn.',
};
const UNESCO_QUAN_HO: Source = {
  title: 'UNESCO – Dân ca Quan họ Bắc Ninh (2009)',
  detail: 'Di sản văn hóa phi vật thể đại diện của nhân loại; trang phục liền anh liền chị là một phần của không gian diễn xướng.',
};
const UNESCO_DCTT: Source = {
  title: 'UNESCO – Nghệ thuật Đờn ca tài tử Nam Bộ (2013)',
  detail: 'Di sản văn hóa phi vật thể đại diện của nhân loại; áo bà ba, áo dài thường xuất hiện trong không gian biểu diễn.',
};

export const GARMENTS: Garment[] = [
  {
    id: 'ao-dai',
    name: 'Áo dài',
    tagline: 'Hai tà thướt tha, biểu tượng quen thuộc nhất của Việt phục hiện đại.',
    region: ['bac', 'trung', 'nam'],
    era: 'Định hình từ thập niên 1930, phát triển đến nay',
    traditionalBodies: ['nu', 'nam'],
    formality: 3,
    origin: [
      {
        text: 'Phát triển từ áo ngũ thân. Thập niên 1930, họa sĩ Nguyễn Cát Tường (Le Mur) và sau đó họa sĩ Lê Phổ cách tân thành dáng áo ôm sát thân, hai tà dài.',
        confidence: 'su-lieu',
      },
      {
        text: 'Khoảng thập niên 1960, kiểu tay raglan xuất hiện ở Sài Gòn giúp áo ôm vai mềm hơn, trở thành dáng áo dài phổ biến ngày nay.',
        confidence: 'pho-bien',
      },
    ],
    structure: [
      'Hai tà trước – sau dài quá gối, xẻ tà cao từ eo xuống.',
      'Cổ đứng (cổ cao) truyền thống; các kiểu cổ thuyền, cổ tròn là biến thể về sau.',
      'Cài khuy (nút bấm) từ cổ sang vai phải, dọc theo sườn phải.',
      'Luôn mặc cùng quần dài, truyền thống là quần lụa ống rộng.',
    ],
    meaning: [
      {
        text: 'Được xem như quốc phục, xuất hiện trong ngày lễ, cưới hỏi, ngoại giao và làm đồng phục nữ sinh.',
        confidence: 'su-lieu',
      },
      {
        text: 'Dáng áo kín đáo mà mềm mại, thường được nhắc tới như hình ảnh của vẻ đẹp dịu dàng Việt Nam.',
        confidence: 'pho-bien',
      },
    ],
    occasions: ['Tết', 'Cưới hỏi', 'Tốt nghiệp, kỷ yếu', 'Đồng phục học sinh', 'Lễ hội', 'Sự kiện trang trọng'],
    confusedWith: [
      {
        name: 'Sườn xám (Trung Quốc)',
        difference:
          'Sườn xám là váy liền, xẻ tà thấp ở đùi và không mặc kèm quần. Áo dài xẻ tà cao tới eo và luôn đi cùng quần dài.',
      },
    ],
    respectNotes: [
      'Không phối với quần hoặc váy ngắn: tà xẻ tới eo nên phần quần dài là một phần cấu trúc của áo.',
      'Áo dài trắng gắn với nữ sinh; khi chụp ảnh gợi cảm, tránh dùng hình ảnh đồng phục học đường.',
    ],
    traditionalBottoms: ['quan-lua'],
    traditionalAccessories: ['non-la', 'khan-van', 'khan-dong', 'guoc-moc', 'hai-theu', 'quat-giay'],
    sources: [NGAN_NAM_AO_MU, TRANG_PHUC_VN, BT_PHU_NU],
  },
  {
    id: 'ao-ngu-than',
    name: 'Áo ngũ thân',
    tagline: 'Áo năm thân cổ đứng, tiền thân của áo dài, đang được Gen Z hồi sinh.',
    region: ['bac', 'trung', 'nam'],
    era: 'Từ thế kỷ XVIII (Đàng Trong), phổ biến cả nước thời Nguyễn',
    traditionalBodies: ['nu', 'nam'],
    formality: 3,
    origin: [
      {
        text: 'Năm 1744, chúa Nguyễn Phúc Khoát ban lệnh cải cách y phục ở Đàng Trong, quy định kiểu áo cổ đứng, cài khuy. Lê Quý Đôn ghi lại sự kiện này trong "Phủ biên tạp lục".',
        confidence: 'su-lieu',
      },
      {
        text: 'Dưới triều Nguyễn (thế kỷ XIX), kiểu áo này được phổ biến ra cả nước và trở thành trang phục thông dụng.',
        confidence: 'su-lieu',
      },
    ],
    structure: [
      'Năm thân vải: hai thân trước, hai thân sau nối ở sống lưng, và một vạt con nằm dưới vạt trước.',
      'Cổ đứng, vạt trước cài chéo sang phải bằng khuy (cúc) từ cổ xuống nách và sườn phải.',
      'Dáng suông rộng hơn áo dài hiện đại, tà dài qua gối.',
      'Vải xưa khổ hẹp nên tay áo thường được nối ở khoảng khuỷu tay.',
      'Mặc cùng quần ống rộng; đi kèm khăn vấn (nữ) hoặc khăn đóng, khăn xếp (nam).',
    ],
    meaning: [
      {
        text: 'Bốn thân chính tượng trưng cho tứ thân phụ mẫu (cha mẹ mình và cha mẹ vợ/chồng), vạt con tượng trưng cho người mặc.',
        confidence: 'pho-bien',
      },
      {
        text: 'Năm khuy áo tượng trưng cho ngũ thường: Nhân, Nghĩa, Lễ, Trí, Tín.',
        confidence: 'pho-bien',
      },
    ],
    occasions: ['Tết', 'Lễ gia tiên', 'Cưới hỏi (trang phục cô dâu, chú rể)', 'Lễ hội', 'Chụp ảnh áo xưa'],
    confusedWith: [
      {
        name: 'Hán phục (Trung Quốc)',
        difference:
          'Nhiều kiểu Hán phục dùng cổ giao lĩnh (cổ chéo chữ Y) hoặc mặc với váy xếp. Áo ngũ thân Việt có cổ đứng, cài khuy sang phải và mặc với quần.',
      },
      {
        name: 'Áo dài hiện đại',
        difference: 'Áo dài hiện đại may ôm sát, xẻ tà cao; áo ngũ thân suông rộng, có vạt con bên trong.',
      },
    ],
    respectNotes: [
      'Giữ cổ đứng và hướng cài vạt sang phải; đảo chiều cài hoặc đổi thành cổ chéo sẽ dễ gây nhầm với trang phục nước khác.',
      'Các ý nghĩa biểu tượng (tứ thân phụ mẫu, ngũ thường) là cách giải thích dân gian, nên trình bày đúng như vậy khi giới thiệu.',
    ],
    traditionalBottoms: ['quan-lua'],
    traditionalAccessories: ['khan-van', 'khan-dong', 'hai-theu', 'guoc-moc', 'quat-giay', 'tram-cai'],
    sources: [PHU_BIEN, NGAN_NAM_AO_MU, TRANG_PHUC_VN],
  },
  {
    id: 'ao-tu-than',
    name: 'Áo tứ thân',
    tagline: 'Áo bốn thân của người phụ nữ Bắc Bộ, gắn với làn điệu Quan họ Kinh Bắc.',
    region: ['bac'],
    era: 'Phổ biến ở Bắc Bộ nhiều thế kỷ, đến đầu thế kỷ XX',
    traditionalBodies: ['nu'],
    formality: 2,
    origin: [
      {
        text: 'Là trang phục thường ngày và lễ hội của phụ nữ đồng bằng Bắc Bộ trước khi áo dài hiện đại phổ biến.',
        confidence: 'su-lieu',
      },
      {
        text: 'Ngày nay gắn chặt với hình ảnh liền chị Quan họ Bắc Ninh, di sản được UNESCO ghi danh năm 2009.',
        confidence: 'su-lieu',
      },
    ],
    structure: [
      'Bốn thân: hai thân sau khâu nối ở sống lưng, hai thân trước để rời, có thể buộc thắt vạt ở eo.',
      'Bên trong mặc yếm; phía dưới là váy (váy đụp, váy sồi), không cài khuy như áo ngũ thân.',
      'Thắt lưng lụa (thắt lưng bao) màu hoa lý, hoa đào buông tà trước bụng.',
      'Dịp hội có thể mặc "áo mớ ba, mớ bảy" (nhiều lớp áo màu lồng nhau).',
      'Đi kèm nón quai thao và khăn mỏ quạ.',
    ],
    meaning: [
      {
        text: 'Bốn thân áo thường được giải thích là tượng trưng cho tứ thân phụ mẫu.',
        confidence: 'pho-bien',
      },
      {
        text: 'Áo nâu, áo đen dùng khi lao động; áo nhiều màu dành cho ngày hội, thể hiện nếp sống của làng quê Bắc Bộ.',
        confidence: 'su-lieu',
      },
    ],
    occasions: ['Lễ hội làng', 'Biểu diễn Quan họ, dân ca', 'Tết', 'Chụp ảnh áo xưa'],
    confusedWith: [
      {
        name: 'Áo ngũ thân',
        difference: 'Áo tứ thân không có vạt con, không cài khuy; hai vạt trước để mở hoặc buộc lại.',
      },
    ],
    respectNotes: [
      'Yếm là lớp áo trong, không phải trang phục mặc riêng khi đi lễ chùa, đình.',
      'Khi mặc với quần thay cho váy, hãy ghi rõ là biến tấu hiện đại.',
    ],
    traditionalBottoms: ['vay-dup'],
    traditionalAccessories: ['non-quai-thao', 'khan-mo-qua', 'that-lung-lua', 'guoc-moc', 'non-la'],
    sources: [UNESCO_QUAN_HO, BT_PHU_NU, TRANG_PHUC_VN],
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo bà ba',
    tagline: 'Áo ngắn xẻ tà giản dị của miền sông nước Nam Bộ.',
    region: ['nam'],
    era: 'Cuối thế kỷ XIX – đầu thế kỷ XX',
    traditionalBodies: ['nu', 'nam'],
    formality: 1,
    origin: [
      {
        text: 'Phổ biến ở Nam Bộ từ cuối thế kỷ XIX, được cả phụ nữ và nam giới mặc hằng ngày.',
        confidence: 'su-lieu',
      },
      {
        text: 'Tên gọi "bà ba" có nhiều giả thuyết, ví dụ liên hệ với cộng đồng người Baba ở Penang (Malaysia); chưa có kết luận thống nhất.',
        confidence: 'tranh-luan',
      },
    ],
    structure: [
      'Thân áo ngắn ngang hông, xẻ tà hai bên.',
      'Không cổ hoặc cổ tròn, hàng khuy cài giữa ngực.',
      'Tay dài, thường có túi phía trước.',
      'Mặc với quần dài ống rộng, truyền thống là quần đen (lãnh Mỹ A).',
    ],
    meaning: [
      {
        text: 'Gọn gàng, thoáng mát, hợp với lao động trên đồng ruộng và sông nước.',
        confidence: 'su-lieu',
      },
      {
        text: 'Gợi hình ảnh người Nam Bộ chân chất, gắn với khăn rằn và nón lá.',
        confidence: 'pho-bien',
      },
    ],
    occasions: ['Đời thường', 'Lễ hội Nam Bộ', 'Đờn ca tài tử', 'Chụp ảnh miền Tây', 'Văn nghệ'],
    confusedWith: [
      {
        name: 'Áo cánh (Bắc Bộ)',
        difference: 'Áo cánh miền Bắc cũng ngắn nhưng thường có cổ, dáng hẹp hơn; áo bà ba đặc trưng bởi tà xẻ và hàng khuy giữa.',
      },
    ],
    respectNotes: [
      'Áo bà ba là trang phục đời thường; khi dự lễ trang trọng nên cân nhắc áo dài hoặc áo ngũ thân.',
    ],
    traditionalBottoms: ['quan-lua'],
    traditionalAccessories: ['non-la', 'khan-ran', 'guoc-moc', 'tui-coi'],
    sources: [UNESCO_DCTT, BT_PHU_NU, TRANG_PHUC_VN],
  },
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình',
    tagline: 'Áo cung đình triều Nguyễn với lá cổ vuông bản lớn thêu hoa văn.',
    region: ['trung'],
    era: 'Triều Nguyễn (1802–1945)',
    traditionalBodies: ['nu'],
    formality: 3,
    origin: [
      {
        text: 'Trang phục của phụ nữ hoàng tộc và cung đình triều Nguyễn tại Huế, dùng làm thường phục hoặc lễ phục tùy cấp bậc.',
        confidence: 'su-lieu',
      },
      {
        text: 'Những năm gần đây được giới trẻ phục dựng, xuất hiện nhiều ở Festival Huế và các buổi chụp ảnh cổ phục.',
        confidence: 'su-lieu',
      },
    ],
    structure: [
      'Áo dài tay rộng, mặc bên ngoài áo dài.',
      'Lá cổ "nhật bình" vuông, bản lớn, phủ vai và buông xuống ngực, thêu hoa văn.',
      'Bên dưới là quần hoặc váy (xiêm) dài.',
      'Màu sắc và hoa văn phân biệt cấp bậc người mặc.',
    ],
    meaning: [
      {
        text: 'Thể hiện tôn ti trong cung đình: màu áo, hoa văn (phượng, hoa, mây) cho biết địa vị.',
        confidence: 'su-lieu',
      },
      {
        text: 'Hoa văn rồng và màu vàng được dành cho vua; áo của nữ giới hoàng tộc thường dùng phượng và hoa lá.',
        confidence: 'su-lieu',
      },
    ],
    occasions: ['Festival, lễ hội Huế', 'Chụp ảnh cổ phục', 'Biểu diễn, tái hiện nghi lễ', 'Sự kiện văn hóa'],
    confusedWith: [
      {
        name: 'Hán phục có cổ vân kiên',
        difference:
          'Lá cổ nhật bình là mảng vuông ôm vai rồi buông thẳng xuống ngực trên nền áo dài tay rộng của triều Nguyễn, khác với kiểu vân kiên hình mây của Trung Quốc.',
      },
    ],
    respectNotes: [
      'Đây là trang phục cung đình: hạn chế phối kiểu đường phố hoặc gợi cảm.',
      'Tránh hoa văn rồng trên áo nữ nếu muốn giữ đúng quy chế triều Nguyễn.',
    ],
    traditionalBottoms: ['quan-lua', 'chan-vay-dai'],
    traditionalAccessories: ['khan-van', 'hai-theu', 'tram-cai', 'quat-giay'],
    sources: [BT_CO_VAT_HUE, NGAN_NAM_AO_MU],
  },
];

export const GARMENT_BY_ID = Object.fromEntries(GARMENTS.map((g) => [g.id, g])) as Record<GarmentId, Garment>;
