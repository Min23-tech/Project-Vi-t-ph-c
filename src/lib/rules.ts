import {
  ACCESSORY_BY_ID,
  BOTTOM_BY_ID,
  EVENT_BY_ID,
  FABRIC_BY_ID,
  REGION_BY_ID,
  STYLE_BY_ID,
} from '../data/catalog';
import { GARMENT_BY_ID } from '../data/garments';
import type { Accessory, Look, LookContext, Severity, Warning } from '../types';
import { evaluateHarmony, isBlackish, isBridalRed, isWhiteish } from './harmony';

const SEVERITY_ORDER: Record<Severity, number> = { 'nghiem-trong': 0, 'luu-y': 1, 'goi-y': 2 };

export function selectedAccessories(look: Look): Accessory[] {
  return Object.values(look.accessories)
    .filter((id): id is string => !!id && id in ACCESSORY_BY_ID)
    .map((id) => ACCESSORY_BY_ID[id]);
}

/** Độ trang trọng của bộ phối (0–3). */
export function formalityOf(look: Look): number {
  const garment = GARMENT_BY_ID[look.garment];
  let value: number = garment.formality;
  value += BOTTOM_BY_ID[look.bottom].formalityShift;
  value += STYLE_BY_ID[look.style].formalityShift;
  for (const acc of selectedAccessories(look)) value += Math.min(0, acc.formalityShift);
  // Phụ kiện trang trọng chỉ bù lại tối đa 1 bậc.
  const bonus = selectedAccessories(look).some((a) => a.formalityShift > 0) ? 1 : 0;
  value = Math.min(garment.formality, value + bonus);
  return Math.max(0, Math.min(3, value));
}

/** Mức biến tấu (0–3): lấy mức cao nhất giữa phần dưới, phong cách và phụ kiện hiện đại. */
export function remixOf(look: Look): number {
  const modernCount = selectedAccessories(look).filter((a) => a.modern).length;
  const accRemix = modernCount >= 2 ? 2 : modernCount;
  return Math.max(BOTTOM_BY_ID[look.bottom].remix, STYLE_BY_ID[look.style].remix, accRemix);
}

export const REMIX_LABEL = ['Truyền thống', 'Cách tân nhẹ', 'Remix', 'Remix mạnh'];
export const FORMALITY_LABEL = ['Rất thoải mái', 'Đời thường', 'Lịch sự', 'Trang trọng'];

export function checkLook(look: Look, ctx: LookContext): Warning[] {
  const out: Warning[] = [];
  const garment = GARMENT_BY_ID[look.garment];
  const bottom = BOTTOM_BY_ID[look.bottom];
  const style = STYLE_BY_ID[look.style];
  const fabric = FABRIC_BY_ID[look.fabric];
  const accs = selectedAccessories(look);
  const event = ctx.event ? EVENT_BY_ID[ctx.event] : null;
  const has = (id: string) => accs.some((a) => a.id === id);

  // 1. Cấu trúc trang phục
  if (bottom.short) {
    const severe = look.garment !== 'ao-ba-ba';
    out.push({
      id: 'phan-duoi-ngan',
      severity: severe ? 'nghiem-trong' : 'luu-y',
      title: `${garment.name} phối với ${bottom.name.toLowerCase()}`,
      why: severe
        ? `${garment.name} có tà dài và xẻ cao, phần quần hoặc váy dài là một phần cấu trúc của trang phục. Phối với váy ngắn làm mất đặc trưng và dễ bị xem là thiếu tôn trọng.`
        : 'Áo bà ba truyền thống luôn đi cùng quần dài. Phối ngắn khiến bộ đồ không còn nhận ra là Việt phục.',
      fix: `Chọn ${garment.traditionalBottoms.map((b) => BOTTOM_BY_ID[b].name.toLowerCase()).join(' hoặc ')}.`,
    });
  }
  if (look.garment === 'ao-tu-than' && !bottom.skirt) {
    out.push({
      id: 'tu-than-mac-quan',
      severity: 'goi-y',
      title: 'Áo tứ thân mặc với quần',
      why: 'Theo truyền thống, áo tứ thân mặc cùng yếm và váy đụp hoặc váy sồi. Mặc với quần là biến tấu hiện đại.',
      fix: 'Nếu muốn đúng nguyên bản, chọn "Váy đụp / váy sồi". Nếu giữ biến tấu, hãy ghi chú rõ khi đăng ảnh.',
    });
  }
  if (look.garment !== 'ao-tu-than' && look.bottom === 'vay-dup') {
    out.push({
      id: 'vay-dup-lech',
      severity: 'goi-y',
      title: `Váy đụp đi cùng ${garment.name.toLowerCase()}`,
      why: 'Váy đụp là phần dưới của trang phục áo tứ thân Bắc Bộ. Kết hợp với loại áo khác là pha trộn không có trong tư liệu.',
      fix: `Chọn ${garment.traditionalBottoms.map((b) => BOTTOM_BY_ID[b].name.toLowerCase()).join(' hoặc ')}.`,
    });
  }
  if (look.garment === 'ao-dai' && look.bottom === 'quan-jeans') {
    const formal = event && event.formality >= 2;
    out.push({
      id: 'ao-dai-jeans',
      severity: formal ? 'luu-y' : 'goi-y',
      title: 'Áo dài phối quần jeans',
      why: formal
        ? `Cách phối này phổ biến khi dạo phố nhưng chưa phù hợp với dịp "${event!.name}".`
        : 'Cách phối năng động được nhiều bạn trẻ ưa chuộng, hợp dạo phố và chụp ảnh.',
      fix: formal ? 'Đổi sang quần lụa ống rộng.' : undefined,
    });
  }

  // 2. Trang phục cung đình và biểu tượng
  if (look.garment === 'ao-nhat-binh' && (style.id === 'street' || accs.some((a) => a.modern) || bottom.remix >= 2)) {
    out.push({
      id: 'nhat-binh-duong-pho',
      severity: 'luu-y',
      title: 'Trang phục cung đình phối kiểu đường phố',
      why: 'Áo Nhật Bình là y phục của phụ nữ hoàng tộc triều Nguyễn, mang ý nghĩa tôn ti. Phối với đồ đường phố dễ làm giảm giá trị biểu tượng của nó.',
      fix: 'Giữ phần dưới dài, dùng hài thêu, khăn vấn hoặc trâm cài; chọn áo dài cách tân nếu muốn phong cách đường phố.',
    });
  }
  if (look.pattern === 'rong') {
    out.push({
      id: 'hoa-van-rong',
      severity: look.garment === 'ao-nhat-binh' ? 'luu-y' : 'goi-y',
      title: 'Hoa văn rồng',
      why:
        look.garment === 'ao-nhat-binh'
          ? 'Dưới triều Nguyễn, rồng là biểu tượng dành cho vua; áo Nhật Bình của nữ giới dùng phượng, hoa lá, mây.'
          : 'Rồng là biểu tượng quyền lực của vua trong lịch sử. Dùng trong thời trang hiện đại được chấp nhận nhưng nên hiểu rõ ý nghĩa.',
      fix: look.garment === 'ao-nhat-binh' ? 'Đổi sang hoa văn vân mây, hoa sen hoặc chữ Thọ.' : undefined,
    });
  }
  if (!garment.traditionalBodies.includes(look.avatar.body)) {
    out.push({
      id: 'gioi-tinh-truyen-thong',
      severity: 'goi-y',
      title: `${garment.name} theo truyền thống là trang phục nữ`,
      why: 'Không có quy định cấm, nhưng khi giới thiệu hình ảnh nên nói rõ đây là cách mặc sáng tạo, không phải tư liệu lịch sử.',
    });
  }
  if (look.garment !== 'ao-ngu-than' && look.garment !== 'ao-dai' && has('khan-dong')) {
    out.push({
      id: 'khan-dong-lech',
      severity: 'goi-y',
      title: `Khăn đóng đi cùng ${garment.name.toLowerCase()}`,
      why: 'Khăn đóng thường đi cùng áo dài nam, áo ngũ thân trong dịp lễ.',
    });
  }
  if (look.garment === 'ao-tu-than' && has('khan-van')) {
    out.push({
      id: 'tu-than-khan-van',
      severity: 'goi-y',
      title: 'Áo tứ thân đi cùng khăn vấn',
      why: 'Phụ nữ Bắc Bộ xưa có vấn tóc bằng khăn, nhưng hình ảnh áo tứ thân quen thuộc hơn với khăn mỏ quạ và nón quai thao.',
    });
  }

  // 3. Pha trộn vùng miền
  const foreign = accs.filter((a) => a.region.length > 0 && !a.region.some((r) => garment.region.includes(r)));
  for (const acc of foreign) {
    out.push({
      id: `vung-mien-${acc.id}`,
      severity: 'goi-y',
      title: `Pha trộn vùng miền: ${acc.name} + ${garment.name}`,
      why: `${acc.name} gắn với ${acc.region.map((r) => REGION_BY_ID[r].name).join(', ')}, còn ${garment.name.toLowerCase()} gắn với ${garment.region
        .map((r) => REGION_BY_ID[r].name)
        .join(', ')}. Đây là phối remix, hãy ghi chú khi chia sẻ để người xem không hiểu nhầm.`,
    });
  }

  // 4. Sự kiện
  if (event) {
    const f = formalityOf(look);
    if (f < event.formality) {
      const reasons: string[] = [];
      if (garment.formality < event.formality) reasons.push(`${garment.name.toLowerCase()} là trang phục ${FORMALITY_LABEL[garment.formality].toLowerCase()}`);
      if (bottom.formalityShift < 0) reasons.push(bottom.name.toLowerCase());
      if (style.formalityShift < 0) reasons.push(`phong cách ${style.name}`);
      for (const a of accs) if (a.formalityShift < 0) reasons.push(a.name.toLowerCase());
      out.push({
        id: 'do-trang-trong',
        severity: event.formality - f >= 2 ? 'nghiem-trong' : 'luu-y',
        title: `Chưa đủ trang trọng cho "${event.name}"`,
        why: `Dịp này cần mức "${FORMALITY_LABEL[event.formality]}", bộ phối đang ở mức "${FORMALITY_LABEL[f]}"${reasons.length ? ` do ${reasons.join(', ')}` : ''}.`,
        fix: 'Thay các món trên bằng lựa chọn truyền thống, hoặc chọn trang phục được gợi ý cho dịp này.',
      });
    }
    const remix = remixOf(look);
    if (remix > event.maxRemix && f >= event.formality) {
      out.push({
        id: 'muc-bien-tau',
        severity: 'goi-y',
        title: 'Mức biến tấu khá cao so với dịp này',
        why: `Bộ phối ở mức "${REMIX_LABEL[remix]}", trong khi "${event.name}" thường chuộng "${REMIX_LABEL[event.maxRemix]}".`,
      });
    }
    if (!event.garments.includes(look.garment)) {
      out.push({
        id: 'trang-phuc-su-kien',
        severity: 'goi-y',
        title: `${garment.name} ít gặp trong dịp "${event.name}"`,
        why: `Trang phục thường thấy: ${event.garments.map((g) => GARMENT_BY_ID[g].name).join(', ')}.`,
      });
    }
    if (event.id === 'tet' && (isWhiteish(look.colors.primary) || isBlackish(look.colors.primary))) {
      out.push({
        id: 'tet-mau-tang',
        severity: 'luu-y',
        title: 'Màu chủ đạo trắng hoặc đen ngày Tết',
        why: 'Trong quan niệm truyền thống, trắng và đen gắn với tang lễ. Nhiều gia đình kiêng mặc toàn trắng, toàn đen khi đi chúc Tết.',
        fix: 'Chọn đỏ, vàng, hồng đào; hoặc giữ màu hiện tại và thêm điểm nhấn đỏ, vàng.',
      });
    }
    if (event.id === 'dam-cuoi') {
      if (isBridalRed(look.colors.primary)) {
        out.push({
          id: 'cuoi-trung-co-dau',
          severity: 'luu-y',
          title: 'Dễ trùng màu áo cô dâu',
          why: 'Cô dâu thường mặc áo dài đỏ trong lễ ăn hỏi, lễ cưới. Khách mời nên tránh để không "lấn" nhân vật chính.',
          fix: 'Chọn hồng đào, xanh ngọc, vàng mơ hoặc màu pastel.',
        });
      }
      if (isWhiteish(look.colors.primary) && isWhiteish(look.colors.bottom)) {
        out.push({
          id: 'cuoi-toan-trang',
          severity: 'luu-y',
          title: 'Toàn trắng khi dự cưới',
          why: 'Trắng toàn thân gắn với tang phục trong quan niệm truyền thống, và cũng dễ trùng váy cưới hiện đại của cô dâu.',
          fix: 'Đổi màu áo hoặc thêm màu nhấn ở viền, hoa văn.',
        });
      }
      if (isBlackish(look.colors.primary)) {
        out.push({
          id: 'cuoi-den',
          severity: 'goi-y',
          title: 'Áo đen khi dự cưới',
          why: 'Nhiều gia đình lớn tuổi kiêng khách mặc đen trong ngày vui.',
        });
      }
    }
    if (event.id === 'di-hoc' && !isWhiteish(look.colors.primary)) {
      out.push({
        id: 'hoc-sinh-ao-trang',
        severity: 'goi-y',
        title: 'Đồng phục áo dài thường là màu trắng',
        why: 'Nhiều trường quy định áo dài trắng cho nữ sinh. Hãy kiểm tra nội quy trường bạn.',
      });
    }
    if (event.id === 'di-chua' && (look.pattern === 'rong' || style.id === 'street')) {
      out.push({
        id: 'chua-tiet-che',
        severity: 'luu-y',
        title: 'Nên tiết chế khi đi lễ chùa, đình',
        why: 'Không gian tâm linh chuộng trang phục kín đáo, màu nhã, ít chi tiết nổi bật.',
        fix: 'Chọn phong cách truyền thống hoặc tối giản, vải trơn.',
      });
    }
  }

  // 5. Thời tiết
  if (ctx.weather === 'nang-nong' && fabric.warm) {
    out.push({
      id: 'nong-vai-day',
      severity: 'luu-y',
      title: `${fabric.name} khá nóng khi trời nắng`,
      why: 'Vải dày, ít thoáng khí dễ gây bí và đổ mồ hôi.',
      fix: 'Chọn lụa tơ tằm, đũi hoặc voan.',
    });
  }
  if (ctx.weather === 'lanh' && !fabric.warm) {
    out.push({
      id: 'lanh-vai-mong',
      severity: 'goi-y',
      title: `${fabric.name} hơi mỏng cho trời lạnh`,
      why: 'Mùa lạnh miền Bắc có thể xuống dưới 15°C.',
      fix: 'Chọn nhung hoặc gấm, hoặc mặc thêm áo giữ nhiệt mỏng bên trong.',
    });
  }
  if (ctx.weather === 'mua') {
    if (fabric.rainSensitive) {
      out.push({
        id: 'mua-vai',
        severity: 'luu-y',
        title: `${fabric.name} dễ hỏng khi gặp mưa`,
        why: 'Nước mưa có thể làm ố, loang màu hoặc co vải.',
        fix: 'Chọn lụa pha hoặc đũi, nhanh khô và ít ố.',
      });
    }
    if (has('guoc-moc')) {
      out.push({
        id: 'mua-guoc',
        severity: 'luu-y',
        title: 'Guốc mộc trơn khi trời mưa',
        why: 'Đế gỗ dễ trượt trên nền ướt.',
        fix: 'Chọn giày búp bê hoặc sneaker đế cao su.',
      });
    }
  }

  // 6. Màu sắc
  const harmony = evaluateHarmony(look.colors);
  if (harmony.score < 60) {
    out.push({
      id: 'mau-sac',
      severity: harmony.score < 40 ? 'luu-y' : 'goi-y',
      title: `Màu sắc: ${harmony.label.toLowerCase()} (${harmony.score}/100)`,
      why: harmony.notes[0],
    });
  }

  return out.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

/** Điểm phù hợp tổng thể (0–100) để so sánh các phương án. */
export function overallScore(look: Look, ctx: LookContext): number {
  const harmony = evaluateHarmony(look.colors).score;
  const penalties = checkLook(look, ctx).reduce(
    (sum, w) => sum + (w.severity === 'nghiem-trong' ? 30 : w.severity === 'luu-y' ? 12 : 3),
    0,
  );
  return Math.max(0, Math.min(100, Math.round(harmony * 0.4 + 60 - penalties)));
}
