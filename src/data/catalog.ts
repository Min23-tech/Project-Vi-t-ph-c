import type {
  Accessory,
  Bottom,
  BottomId,
  EventId,
  EventInfo,
  Fabric,
  FabricId,
  Pattern,
  PatternId,
  Region,
  RegionId,
  Slot,
  Style,
  StyleId,
  Weather,
  WeatherId,
} from '../types';

const byId = <T extends { id: string }>(list: T[]) =>
  Object.fromEntries(list.map((item) => [item.id, item])) as Record<string, T>;

export const BOTTOMS: Bottom[] = [
  { id: 'quan-lua', name: 'Quần lụa ống rộng', remix: 0, formalityShift: 0, skirt: false, short: false, note: 'Cách phối truyền thống của áo dài, áo ngũ thân, áo bà ba.' },
  { id: 'vay-dup', name: 'Váy đụp / váy sồi', remix: 0, formalityShift: 0, skirt: true, short: false, note: 'Váy quấn dài của phụ nữ Bắc Bộ, đi cùng áo tứ thân.' },
  { id: 'chan-vay-dai', name: 'Chân váy dài xòe', remix: 1, formalityShift: 0, skirt: true, short: false, note: 'Biến tấu phổ biến cho áo dài cách tân; gần với xiêm khi mặc cùng áo Nhật Bình.' },
  { id: 'quan-ong-suong', name: 'Quần ống suông', remix: 1, formalityShift: 0, skirt: false, short: false, note: 'Quần âu ống suông, gọn gàng, hợp đi học, đi làm.' },
  { id: 'quan-jeans', name: 'Quần jeans', remix: 2, formalityShift: -1, skirt: false, short: false, note: 'Cách phối dạo phố của Gen Z; giảm độ trang trọng.' },
  { id: 'chan-vay-ngan', name: 'Chân váy ngắn', remix: 3, formalityShift: -2, skirt: true, short: true, note: 'Làm mất cấu trúc tà áo; chỉ dùng để thấy cảnh báo.' },
];

export const FABRICS: Fabric[] = [
  { id: 'lua-to-tam', name: 'Lụa tơ tằm', note: 'Mềm, mát, bóng nhẹ; dễ ố khi dính nước.', breathable: true, warm: false, rainSensitive: true, sheen: 0.5 },
  { id: 'lua-pha', name: 'Lụa pha / vải tổng hợp', note: 'Ít nhăn, nhanh khô, giá mềm, hợp đi học và trời mưa.', breathable: false, warm: false, rainSensitive: false, sheen: 0.35 },
  { id: 'voan', name: 'Voan (chiffon)', note: 'Nhẹ, bay, thường làm lớp ngoài; mỏng nên cần lót.', breathable: true, warm: false, rainSensitive: false, sheen: 0.15 },
  { id: 'gam', name: 'Gấm', note: 'Dày, dệt hoa chìm, sang trọng; hợp Tết và lễ cưới.', breathable: false, warm: true, rainSensitive: true, sheen: 0.6 },
  { id: 'nhung', name: 'Nhung', note: 'Ấm, mặt vải mịn, sang; hợp mùa lạnh miền Bắc.', breathable: false, warm: true, rainSensitive: true, sheen: 0.25 },
  { id: 'dui', name: 'Đũi', note: 'Sợi thô tự nhiên, thoáng khí, mang vẻ mộc mạc.', breathable: true, warm: false, rainSensitive: false, sheen: 0 },
];

export const PATTERNS: Pattern[] = [
  { id: 'tron', name: 'Trơn', meaning: 'Tối giản, làm nổi bật phom dáng và phụ kiện.' },
  { id: 'hoa-nhi', name: 'Hoa nhí', meaning: 'Nhẹ nhàng, trẻ trung; hợp áo bà ba và phong cách pastel.' },
  { id: 'hoa-sen', name: 'Hoa sen', meaning: 'Loài hoa gắn với sự thanh khiết trong văn hóa Việt.' },
  { id: 'van-may', name: 'Vân mây', meaning: 'Hoa văn mây cuộn, thường thấy trên áo gấm và kiến trúc cung đình.' },
  { id: 'chu-tho', name: 'Chữ Thọ', meaning: 'Chữ Thọ cách điệu, cầu mong sống lâu; phổ biến trên gấm ngày Tết.' },
  { id: 'rong', name: 'Rồng', meaning: 'Biểu tượng của vua dưới triều Nguyễn; dùng trong thời trang hiện đại cần cân nhắc.' },
];

export const ACCESSORIES: Accessory[] = [
  { id: 'non-la', name: 'Nón lá', slot: 'head', region: [], modern: false, formalityShift: 0, note: 'Phổ biến cả nước; nón bài thơ Huế có lồng tranh, thơ giữa hai lớp lá.' },
  { id: 'non-quai-thao', name: 'Nón quai thao', slot: 'head', region: ['bac'], modern: false, formalityShift: 0, note: 'Nón thúng rộng vành, quai tua tơ; đội dịp hội ở Bắc Bộ, gắn với Quan họ.' },
  { id: 'khan-van', name: 'Khăn vấn / khăn vành', slot: 'head', region: [], modern: false, formalityShift: 1, note: 'Khăn quấn quanh đầu của nữ, đi cùng áo dài, áo ngũ thân, áo Nhật Bình.' },
  { id: 'khan-dong', name: 'Khăn đóng', slot: 'head', region: [], modern: false, formalityShift: 1, note: 'Khăn may sẵn của nam giới, đi cùng áo dài nam, áo ngũ thân.' },
  { id: 'khan-mo-qua', name: 'Khăn mỏ quạ', slot: 'head', region: ['bac'], modern: false, formalityShift: 0, note: 'Khăn đen chít nhọn ở trán của phụ nữ Bắc Bộ, đi cùng áo tứ thân.' },
  { id: 'tram-cai', name: 'Trâm cài tóc', slot: 'head', region: [], modern: false, formalityShift: 0, note: 'Trâm gỗ, bạc hoặc ngọc cài búi tóc.' },
  { id: 'mu-bucket', name: 'Mũ bucket', slot: 'head', region: [], modern: true, formalityShift: -1, note: 'Phụ kiện đường phố hiện đại.' },
  { id: 'khan-ran', name: 'Khăn rằn', slot: 'neck', region: ['nam'], modern: false, formalityShift: 0, note: 'Khăn ca rô đen trắng của Nam Bộ, chịu ảnh hưởng khăn krama của người Khmer.' },
  { id: 'vong-bac', name: 'Vòng cổ bạc', slot: 'neck', region: [], modern: false, formalityShift: 0, note: 'Trang sức bạc truyền thống, nhiều dân tộc cùng sử dụng.' },
  { id: 'chuoi-ngoc', name: 'Chuỗi ngọc trai', slot: 'neck', region: [], modern: false, formalityShift: 1, note: 'Tăng vẻ trang trọng cho áo dài trong tiệc cưới, lễ tốt nghiệp.' },
  { id: 'quat-giay', name: 'Quạt giấy', slot: 'hand', region: [], modern: false, formalityShift: 0, note: 'Quạt xếp tre giấy, ví dụ quạt làng Chàng Sơn (Hà Nội).' },
  { id: 'tui-coi', name: 'Túi cói', slot: 'hand', region: [], modern: false, formalityShift: 0, note: 'Túi đan cói thủ công, ví dụ cói Kim Sơn (Ninh Bình).' },
  { id: 'tui-mini', name: 'Túi mini hiện đại', slot: 'hand', region: [], modern: true, formalityShift: 0, note: 'Túi da nhỏ, dễ phối với áo dài cách tân.' },
  { id: 'that-lung-lua', name: 'Thắt lưng lụa (bao)', slot: 'waist', region: ['bac'], modern: false, formalityShift: 0, note: 'Dải lụa thắt eo buông tà, đi cùng áo tứ thân.' },
  { id: 'dai-lung-hien-dai', name: 'Đai lưng bản to', slot: 'waist', region: [], modern: true, formalityShift: -1, note: 'Đai da hoặc vải hiện đại, nhấn eo cho áo dài cách tân.' },
  { id: 'guoc-moc', name: 'Guốc mộc', slot: 'feet', region: [], modern: false, formalityShift: 0, note: 'Guốc gỗ truyền thống; dễ trơn khi trời mưa.' },
  { id: 'hai-theu', name: 'Hài thêu', slot: 'feet', region: [], modern: false, formalityShift: 1, note: 'Giày vải thêu hoa văn, dùng trong lễ phục.' },
  { id: 'giay-bup-be', name: 'Giày búp bê', slot: 'feet', region: [], modern: true, formalityShift: 0, note: 'Giày bệt hiện đại, nhẹ nhàng, dễ đi.' },
  { id: 'sneaker', name: 'Sneaker trắng', slot: 'feet', region: [], modern: true, formalityShift: -1, note: 'Lựa chọn năng động của Gen Z khi chụp ảnh, dạo phố.' },
];

export const SLOTS: { id: Slot; name: string }[] = [
  { id: 'head', name: 'Đầu' },
  { id: 'neck', name: 'Cổ' },
  { id: 'hand', name: 'Tay' },
  { id: 'waist', name: 'Eo' },
  { id: 'feet', name: 'Chân' },
];

export const STYLES: Style[] = [
  {
    id: 'truyen-thong',
    name: 'Truyền thống',
    description: 'Giữ nguyên cấu trúc và cách phối như tư liệu xưa.',
    remix: 0,
    formalityShift: 0,
    palette: ['#A61B29', '#E3A00F', '#F7F3E8', '#1C1C1E'],
    tips: ['Chọn phần dưới và phụ kiện đúng với loại áo.', 'Ưu tiên màu nhuộm tự nhiên: đỏ điều, nâu, chàm, vàng nghệ.'],
  },
  {
    id: 'toi-gian',
    name: 'Tối giản',
    description: 'Ít chi tiết, màu trung tính, phụ kiện tiết chế.',
    remix: 1,
    formalityShift: 0,
    palette: ['#E8D8B8', '#F7F3E8', '#7B4A2E', '#F7F3E8'],
    tips: ['Tối đa một điểm nhấn màu.', 'Vải trơn, bỏ bớt phụ kiện đầu.'],
  },
  {
    id: 'street',
    name: 'Streetwear remix',
    description: 'Phối Việt phục cùng món đồ đường phố cho buổi dạo phố, chụp ảnh.',
    remix: 3,
    formalityShift: -1,
    palette: ['#2B2F5B', '#F7F3E8', '#E3A00F', '#2E5E9E'],
    tips: ['Giữ nguyên phom áo, chỉ biến tấu ở phần dưới và phụ kiện.', 'Hợp dạo phố, không hợp nghi lễ.'],
  },
  {
    id: 'vintage',
    name: 'Retro Sài Gòn',
    description: 'Cảm hứng áo dài thập niên 1960: cổ thuyền, màu trầm, túi cầm tay.',
    remix: 1,
    formalityShift: 0,
    palette: ['#3AAFA9', '#F7F3E8', '#7B4A2E', '#F7F3E8'],
    tips: ['Kết hợp túi nhỏ, giày búp bê.', 'Màu xanh ngọc, nâu, kem gợi không khí xưa.'],
  },
  {
    id: 'pastel',
    name: 'Pastel ngọt ngào',
    description: 'Màu nhạt, hoa nhí, nhẹ nhàng cho kỷ yếu và chụp ảnh.',
    remix: 1,
    formalityShift: 0,
    palette: ['#F4A7B9', '#F7F3E8', '#BFE6D6', '#F7F3E8'],
    tips: ['Giữ độ sáng tương đồng giữa các màu.', 'Hoa nhí hoặc trơn đều hợp.'],
  },
];

export const EVENTS: EventInfo[] = [
  {
    id: 'tet',
    name: 'Tết Nguyên đán',
    formality: 2,
    maxRemix: 1,
    garments: ['ao-dai', 'ao-ngu-than', 'ao-tu-than'],
    palette: ['#A61B29', '#E3A00F', '#E3A00F', '#F7F3E8'],
    tips: ['Đỏ, vàng, hồng đào tượng trưng may mắn.', 'Chọn gấm hoặc hoa văn chữ Thọ khi đi chúc Tết ông bà.'],
  },
  {
    id: 'tot-nghiep',
    name: 'Lễ tốt nghiệp / kỷ yếu',
    formality: 2,
    maxRemix: 2,
    garments: ['ao-dai', 'ao-ngu-than'],
    palette: ['#F7F3E8', '#2E5E9E', '#E3A00F', '#F7F3E8'],
    tips: ['Áo dài trắng hoặc đồng màu theo lớp giúp ảnh tập thể đẹp.', 'Kỷ yếu có thể biến tấu với sneaker, nhưng lễ trao bằng nên trang trọng.'],
  },
  {
    id: 'dam-cuoi',
    name: 'Dự đám cưới (khách mời)',
    formality: 3,
    maxRemix: 1,
    garments: ['ao-dai', 'ao-ngu-than'],
    palette: ['#F4A7B9', '#F7F3E8', '#E3A00F', '#F7F3E8'],
    tips: ['Tránh trùng tông đỏ – vàng rực của cô dâu.', 'Tránh toàn trắng hoặc toàn đen.'],
  },
  {
    id: 'le-hoi',
    name: 'Lễ hội truyền thống',
    formality: 1,
    maxRemix: 1,
    garments: ['ao-tu-than', 'ao-ngu-than', 'ao-ba-ba', 'ao-nhat-binh', 'ao-dai'],
    palette: ['#A61B29', '#7FB77E', '#E3A00F', '#1C1C1E'],
    tips: ['Chọn trang phục của vùng tổ chức lễ hội để hòa vào không khí.', 'Đi giày bệt vì lễ hội thường đông và phải đi bộ nhiều.'],
  },
  {
    id: 'di-chua',
    name: 'Đi lễ chùa, đình',
    formality: 1,
    maxRemix: 1,
    garments: ['ao-dai', 'ao-ngu-than', 'ao-ba-ba'],
    palette: ['#E8D8B8', '#F7F3E8', '#7B4A2E', '#F7F3E8'],
    tips: ['Trang phục kín đáo, màu nhã.', 'Chọn giày dễ tháo khi vào chính điện.'],
  },
  {
    id: 'dao-pho',
    name: 'Dạo phố, chụp ảnh',
    formality: 0,
    maxRemix: 3,
    garments: ['ao-dai', 'ao-ba-ba', 'ao-ngu-than', 'ao-tu-than', 'ao-nhat-binh'],
    palette: ['#2B2F5B', '#F7F3E8', '#E3A00F', '#2E5E9E'],
    tips: ['Thoải mái biến tấu phần dưới và phụ kiện.', 'Giữ nguyên phom áo để vẫn nhận ra Việt phục.'],
  },
  {
    id: 'van-nghe',
    name: 'Văn nghệ, ngày hội trường',
    formality: 1,
    maxRemix: 2,
    garments: ['ao-tu-than', 'ao-ba-ba', 'ao-dai', 'ao-nhat-binh'],
    palette: ['#E75480', '#F7F3E8', '#F6D58E', '#1C1C1E'],
    tips: ['Màu tươi, tương phản cao để nổi trên sân khấu.', 'Chọn trang phục đúng vùng miền của tiết mục (Quan họ: tứ thân; Đờn ca tài tử: bà ba).'],
  },
  {
    id: 'di-hoc',
    name: 'Đi học (đồng phục áo dài)',
    formality: 2,
    maxRemix: 1,
    garments: ['ao-dai'],
    palette: ['#F7F3E8', '#F7F3E8', '#2E5E9E', '#F7F3E8'],
    tips: ['Nhiều trường quy định áo dài trắng, hãy kiểm tra nội quy.', 'Vải lụa pha ít nhăn, dễ giặt.'],
  },
];

export const REGIONS: Region[] = [
  { id: 'bac', name: 'Bắc Bộ', highlight: 'Áo tứ thân, nón quai thao, khăn mỏ quạ; Tết lạnh hợp gấm, nhung.' },
  { id: 'trung', name: 'Trung Bộ (Huế)', highlight: 'Áo Nhật Bình cung đình, áo dài tím Huế, nón bài thơ.' },
  { id: 'nam', name: 'Nam Bộ', highlight: 'Áo bà ba, khăn rằn, nón lá; khí hậu nóng hợp lụa, đũi.' },
];

export const WEATHERS: Weather[] = [
  { id: 'nang-nong', name: 'Nắng nóng (trên 30°C)', fabrics: ['lua-to-tam', 'dui', 'voan'], tips: ['Chọn vải thoáng, màu sáng.', 'Nón lá vừa che nắng vừa hợp Việt phục.'] },
  { id: 'mat-me', name: 'Mát mẻ (20–28°C)', fabrics: ['lua-to-tam', 'lua-pha', 'voan', 'gam'], tips: ['Hầu hết các loại vải đều phù hợp.'] },
  { id: 'lanh', name: 'Lạnh (dưới 18°C)', fabrics: ['nhung', 'gam'], tips: ['Nhung, gấm giữ ấm.', 'Có thể mặc áo giữ nhiệt mỏng bên trong hoặc khoác áo dạ bên ngoài khi di chuyển.'] },
  { id: 'mua', name: 'Mưa', fabrics: ['lua-pha', 'voan', 'dui'], tips: ['Tránh lụa tơ tằm vì dễ ố nước.', 'Thay guốc gỗ bằng giày đế chống trơn.'] },
];

/** Bảng màu gợi cảm hứng từ màu nhuộm và chất liệu truyền thống. */
export const TRADITIONAL_COLORS: { name: string; hex: string }[] = [
  { name: 'Đỏ điều', hex: '#A61B29' },
  { name: 'Đỏ son', hex: '#C0392B' },
  { name: 'Hồng đào', hex: '#F4A7B9' },
  { name: 'Hồng cánh sen', hex: '#E75480' },
  { name: 'Vàng nghệ', hex: '#E3A00F' },
  { name: 'Vàng mơ', hex: '#F6D58E' },
  { name: 'Xanh hoa lý', hex: '#7FB77E' },
  { name: 'Xanh ngọc', hex: '#3AAFA9' },
  { name: 'Xanh bạc hà', hex: '#BFE6D6' },
  { name: 'Xanh lam', hex: '#2E5E9E' },
  { name: 'Chàm', hex: '#2B2F5B' },
  { name: 'Tím Huế', hex: '#5B2C6F' },
  { name: 'Tím pastel', hex: '#CDB4DB' },
  { name: 'Nâu củ nâu', hex: '#7B4A2E' },
  { name: 'Be lụa', hex: '#E8D8B8' },
  { name: 'Trắng ngà', hex: '#F7F3E8' },
  { name: 'Đen lãnh', hex: '#1C1C1E' },
];

export const SKIN_TONES = ['#F3D3B8', '#E2B48F', '#C68E63', '#8D5A3B'];

export const BOTTOM_BY_ID = byId(BOTTOMS) as Record<BottomId, Bottom>;
export const FABRIC_BY_ID = byId(FABRICS) as Record<FabricId, Fabric>;
export const PATTERN_BY_ID = byId(PATTERNS) as Record<PatternId, Pattern>;
export const ACCESSORY_BY_ID = byId(ACCESSORIES) as Record<string, Accessory>;
export const STYLE_BY_ID = byId(STYLES) as Record<StyleId, Style>;
export const EVENT_BY_ID = byId(EVENTS) as Record<EventId, EventInfo>;
export const REGION_BY_ID = byId(REGIONS) as Record<RegionId, Region>;
export const WEATHER_BY_ID = byId(WEATHERS) as Record<WeatherId, Weather>;

export function colorName(hex: string): string | null {
  const found = TRADITIONAL_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
  return found ? found.name : null;
}
