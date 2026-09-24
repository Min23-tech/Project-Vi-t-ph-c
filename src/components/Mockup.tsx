import { forwardRef, useId, type ReactNode } from 'react';
import { FABRIC_BY_ID, SKIN_TONES } from '../data/catalog';
import type { Look } from '../types';

const HAIR = '#1F1714';
const INK = '#1C1C1E';
const IVORY = '#F7F3E8';
const STRAW = '#E3C98A';
const STRAW_DARK = '#B8964F';

interface Props {
  look: Look;
  photo?: string | null;
  title?: string;
  className?: string;
}

/** Hình minh họa nhân vật mặc bộ phối (vẽ bằng SVG, có thể xuất PNG). */
export const Mockup = forwardRef<SVGSVGElement, Props>(function Mockup({ look, photo, title, className }, ref) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string) => `${name}-${uid}`;
  const { colors, avatar } = look;
  const skin = SKIN_TONES[avatar.skin] ?? SKIN_TONES[0];
  const cx = 160;
  const nam = avatar.body === 'nam';
  const sw = nam ? 52 : 44; // nửa bề ngang vai
  const ww = nam ? 40 : 32; // nửa bề ngang eo
  const hw = nam ? 44 : 42; // nửa bề ngang hông
  const fabric = FABRIC_BY_ID[look.fabric];
  const patternFill = look.pattern === 'tron' ? null : `url(#${id('pat')})`;
  const handL = { x: cx - sw - 18, y: 310 };
  const handR = { x: cx + sw + 18, y: 310 };

  // ---------- Phần dưới ----------
  const bottomNode = (() => {
    const c = colors.bottom;
    const legs = (spread: number, inner: number) =>
      `M${cx - hw} 248 L${cx - hw - spread} 516 L${cx - inner} 516 L${cx - 2} 296 L${cx + 2} 296 L${cx + inner} 516 L${cx + hw + spread} 516 L${cx + hw} 248 Z`;
    switch (look.bottom) {
      case 'quan-lua':
        return <path d={legs(12, 4)} fill={c} />;
      case 'quan-ong-suong':
        return <path d={legs(2, 6)} fill={c} />;
      case 'quan-jeans':
        return (
          <g>
            <path d={legs(-4, 8)} fill={c} />
            <path d={`M${cx - hw + 10} 300 L${cx - hw + 6} 512 M${cx + hw - 10} 300 L${cx + hw - 6} 512`} stroke="#ffffff" strokeOpacity={0.35} strokeWidth={1.2} strokeDasharray="3 3" fill="none" />
          </g>
        );
      case 'vay-dup':
        return (
          <g>
            <path d={`M${cx - hw} 248 L${cx - hw - 12} 520 L${cx + hw + 12} 520 L${cx + hw} 248 Z`} fill={c} />
            <path d={`M${cx - hw - 9} 460 L${cx + hw + 9} 460 L${cx + hw + 11} 490 L${cx - hw - 11} 490 Z`} fill="#000" fillOpacity={0.2} />
            <path d={`M${cx - 8} 250 L${cx - 12} 520`} stroke="#000" strokeOpacity={0.25} strokeWidth={1.5} />
          </g>
        );
      case 'chan-vay-dai':
        return (
          <g>
            <path d={`M${cx - hw} 248 Q${cx - hw - 30} 420 ${cx - hw - 34} 520 L${cx + hw + 34} 520 Q${cx + hw + 30} 420 ${cx + hw} 248 Z`} fill={c} />
            <path d={`M${cx - 18} 260 Q${cx - 26} 400 ${cx - 30} 518 M${cx + 18} 260 Q${cx + 26} 400 ${cx + 30} 518`} stroke="#000" strokeOpacity={0.12} strokeWidth={2} fill="none" />
          </g>
        );
      case 'chan-vay-ngan':
        return (
          <g>
            <path d={`M${cx - 20} 320 L${cx - 22} 516 L${cx - 8} 516 L${cx - 6} 320 Z M${cx + 20} 320 L${cx + 22} 516 L${cx + 8} 516 L${cx + 6} 320 Z`} fill={skin} />
            <path d={`M${cx - hw} 248 L${cx - hw - 14} 336 L${cx + hw + 14} 336 L${cx + hw} 248 Z`} fill={c} />
          </g>
        );
    }
  })();

  // ---------- Giày dép ----------
  const feetNode = (() => {
    const feet = look.accessories.feet;
    const pair = (render: (x: number) => ReactNode) => (
      <g>
        {render(cx - 24)}
        {render(cx + 24)}
      </g>
    );
    switch (feet) {
      case 'guoc-moc':
        return pair((x) => (
          <g key={x}>
            <ellipse cx={x} cy={522} rx={13} ry={5} fill={skin} />
            <rect x={x - 15} y={525} width={30} height={8} rx={3} fill="#9C6B3E" />
            <path d={`M${x - 10} 522 Q${x} 514 ${x + 10} 522`} stroke={colors.accent} strokeWidth={4} fill="none" />
          </g>
        ));
      case 'hai-theu':
        return pair((x) => (
          <g key={x}>
            <path d={`M${x - 14} 530 Q${x - 14} 516 ${x} 516 Q${x + 12} 516 ${x + 17} 526 L${x + 19} 522 L${x + 16} 531 Z`} fill={colors.secondary} stroke={colors.accent} strokeWidth={1.5} />
            <circle cx={x} cy={523} r={2} fill={colors.accent} />
          </g>
        ));
      case 'giay-bup-be':
        return pair((x) => (
          <g key={x}>
            <path d={`M${x - 14} 530 Q${x - 14} 516 ${x} 517 Q${x + 15} 517 ${x + 15} 530 Z`} fill="#3A2E2A" />
            <path d={`M${x - 6} 520 L${x + 6} 520`} stroke="#fff" strokeOpacity={0.3} strokeWidth={1.5} />
          </g>
        ));
      case 'sneaker':
        return pair((x) => (
          <g key={x}>
            <path d={`M${x - 15} 531 L${x - 14} 516 Q${x} 512 ${x + 8} 518 Q${x + 17} 521 ${x + 17} 531 Z`} fill="#FAFAFA" stroke="#C8C8CC" strokeWidth={1} />
            <rect x={x - 16} y={528} width={34} height={4} rx={2} fill="#D9D9DE" />
            <path d={`M${x - 6} 519 L${x + 2} 519 M${x - 6} 523 L${x + 4} 523`} stroke="#9A9AA2" strokeWidth={1} />
          </g>
        ));
      default:
        return pair((x) => <ellipse key={x} cx={x} cy={524} rx={13} ry={6} fill={skin} />);
    }
  })();

  // ---------- Thân áo ----------
  const neckline = `M${cx - sw} 136 Q${cx - sw / 2} 122 ${cx - 11} 118 L${cx + 11} 118 Q${cx + sw / 2} 122 ${cx + sw} 136`;
  const garment = (() => {
    switch (look.garment) {
      case 'ao-dai': {
        const hem = nam ? 420 : 470;
        const back = `M${cx - ww - 4} 238 L${cx - ww - 24} ${hem + 6} L${cx + ww + 24} ${hem + 6} L${cx + ww + 4} 238 Z`;
        const body = `${neckline} L${cx + ww + (nam ? 6 : 0)} 232 L${cx + ww + 2} 240 L${cx + ww + 16} ${hem} L${cx - ww - 16} ${hem} L${cx - ww - 2} 240 L${cx - ww - (nam ? 6 : 0)} 232 Z`;
        return {
          back,
          body,
          sleeve: 16,
          details: (
            <g>
              <path d={`M${cx - ww - 16} ${hem - 2} L${cx + ww + 16} ${hem - 2}`} stroke={colors.secondary} strokeWidth={3} />
              <path d={`M${cx + 10} 122 Q${cx + sw / 2} 128 ${cx + sw - 10} 148 L${cx + ww + 2} 236`} stroke={colors.secondary} strokeWidth={1.4} fill="none" strokeOpacity={0.9} />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={cx + 16 + i * 9} cy={126 + i * 7} r={1.6} fill={colors.secondary} />
              ))}
            </g>
          ),
          collar: 'dung' as const,
        };
      }
      case 'ao-ngu-than': {
        const hem = 440;
        const body = `${neckline} L${cx + ww + 18} ${hem} L${cx - ww - 18} ${hem} Z`;
        const btn: [number, number][] = [
          [cx + 6, 114],
          [cx + 20, 128],
          [cx + sw - 12, 146],
          [cx + sw - 16, 176],
          [cx + sw - 20, 206],
        ];
        return {
          back: null,
          body,
          sleeve: 24,
          details: (
            <g>
              <path d={`M${cx + 4} 120 Q${cx + 20} 130 ${cx + sw - 10} 146 L${cx + ww + 12} 330`} stroke={INK} strokeOpacity={0.35} strokeWidth={1.4} fill="none" />
              <path d={`M${cx - ww - 13} 350 L${cx - ww - 18} ${hem} M${cx + ww + 13} 350 L${cx + ww + 18} ${hem}`} stroke={INK} strokeOpacity={0.3} strokeWidth={1.4} />
              <path d={`M${cx - ww - 18} ${hem - 2} L${cx + ww + 18} ${hem - 2}`} stroke={colors.secondary} strokeWidth={3} />
              {btn.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={2.6} fill={colors.accent} stroke={INK} strokeOpacity={0.4} strokeWidth={0.6} />
              ))}
            </g>
          ),
          collar: 'dung' as const,
        };
      }
      case 'ao-tu-than': {
        const hem = 420;
        const body = `M${cx - sw} 136 Q${cx - sw / 2} 124 ${cx - 16} 120 L${cx + 16} 120 Q${cx + sw / 2} 124 ${cx + sw} 136 L${cx + ww + 20} ${hem} L${cx - ww - 20} ${hem} Z`;
        return {
          back: null,
          body,
          sleeve: 18,
          details: (
            <g>
              <path d={`M${cx - 15} 124 L${cx + 15} 124 L${cx + 24} 200 L${cx} 248 L${cx - 24} 200 Z`} fill={colors.secondary} />
              <path d={`M${cx - 16} 121 Q${cx - 30} 190 ${cx - 6} 254 M${cx + 16} 121 Q${cx + 30} 190 ${cx + 6} 254`} stroke={colors.accent} strokeWidth={3} fill="none" />
              <path d={`M${cx - 6} 254 Q${cx - 14} 300 ${cx - 20} 330 M${cx + 6} 254 Q${cx + 14} 300 ${cx + 22} 334`} stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} fill="none" />
              <circle cx={cx} cy={254} r={6} fill={colors.primary} stroke={colors.accent} strokeWidth={2} />
            </g>
          ),
          collar: 'khong' as const,
        };
      }
      case 'ao-ba-ba': {
        const hem = 286;
        const body = `M${cx - sw} 136 Q${cx - sw / 2} 126 ${cx - 13} 122 Q${cx} 132 ${cx + 13} 122 Q${cx + sw / 2} 126 ${cx + sw} 136 L${cx + hw + 4} ${hem - 22} L${cx + hw + 2} ${hem} L${cx - hw - 2} ${hem} L${cx - hw - 4} ${hem - 22} Z`;
        return {
          back: null,
          body,
          sleeve: 16,
          details: (
            <g>
              <path d={`M${cx} 130 L${cx} ${hem}`} stroke={INK} strokeOpacity={0.3} strokeWidth={1.2} />
              {[150, 180, 210, 240, 268].map((y) => (
                <circle key={y} cx={cx} cy={y} r={2.4} fill={colors.accent} />
              ))}
              <path d={`M${cx - hw - 4} ${hem - 22} L${cx - hw + 6} ${hem - 22} M${cx + hw + 4} ${hem - 22} L${cx + hw - 6} ${hem - 22}`} stroke={INK} strokeOpacity={0.3} strokeWidth={1.2} />
              <path d={`M${cx - hw - 2} ${hem - 1} L${cx + hw + 2} ${hem - 1}`} stroke={colors.secondary} strokeWidth={2.5} />
            </g>
          ),
          collar: 'khong' as const,
        };
      }
      case 'ao-nhat-binh': {
        const hem = 460;
        const body = `${neckline} L${cx + ww + 30} ${hem} L${cx - ww - 30} ${hem} Z`;
        const band = (x: number) => (
          <g key={x}>
            <rect x={x} y={124} width={30} height={100} fill={colors.secondary} />
            <rect x={x + 0.5} y={124.5} width={29} height={99} fill="none" stroke={INK} strokeOpacity={0.3} />
            <rect x={x + 3} y={127} width={24} height={94} fill="none" stroke={colors.accent} strokeWidth={1.5} />
            <rect x={x + 5} y={196} width={20} height={22} fill="none" stroke={colors.accent} strokeWidth={1.2} />
            {[146, 170].map((y) => (
              <circle key={y} cx={x + 15} cy={y} r={4} fill="none" stroke={colors.accent} strokeWidth={1.2} />
            ))}
          </g>
        );
        return {
          back: null,
          body,
          sleeve: 46,
          details: (
            <g>
              <path d={`M${cx - sw + 2} 136 Q${cx - sw / 2} 116 ${cx} 116 Q${cx + sw / 2} 116 ${cx + sw - 2} 136 L${cx + sw - 10} 148 Q${cx} 126 ${cx - sw + 10} 148 Z`} fill={colors.secondary} stroke={INK} strokeOpacity={0.3} strokeWidth={1} />
              {band(cx - 31)}
              {band(cx + 1)}
              <path d={`M${cx - ww - 30} ${hem - 2} L${cx + ww + 30} ${hem - 2}`} stroke={colors.secondary} strokeWidth={5} />
            </g>
          ),
          collar: 'dung' as const,
        };
      }
    }
  })();

  const sleeve = (side: -1 | 1) => {
    const w = garment.sleeve;
    const sx = cx + side * sw;
    const wx = cx + side * (sw + 18);
    return `M${sx + side * 2} 134 Q${sx + side * 12} 180 ${wx + (side * w) / 2} 298 L${wx - (side * w) / 2} 300 Q${sx - side * 6} 200 ${sx - side * 16} 164 Z`;
  };
  const sleeves = `${sleeve(-1)} ${sleeve(1)}`;

  // ---------- Đầu, tóc ----------
  const backHair =
    photo || avatar.hair !== 'dai' ? null : (
      <path d={`M${cx - 30} 70 Q${cx - 36} 180 ${cx - 26} 236 L${cx + 26} 236 Q${cx + 36} 180 ${cx + 30} 70 Z`} fill={HAIR} />
    );
  const face = photo ? (
    <g>
      <clipPath id={id('face')}>
        <circle cx={cx} cy={76} r={30} />
      </clipPath>
      <image href={photo} x={cx - 30} y={46} width={60} height={60} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id('face')})`} />
      <circle cx={cx} cy={76} r={30} fill="none" stroke={IVORY} strokeWidth={2} />
    </g>
  ) : (
    <g>
      <ellipse cx={cx} cy={78} rx={25} ry={29} fill={skin} />
      <ellipse cx={cx - 9} cy={80} rx={2.4} ry={3} fill={INK} />
      <ellipse cx={cx + 9} cy={80} rx={2.4} ry={3} fill={INK} />
      <path d={`M${cx - 6} 93 Q${cx} 98 ${cx + 6} 93`} stroke="#8A3B2E" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <ellipse cx={cx - 15} cy={89} rx={4.5} ry={2.5} fill="#E88A7A" opacity={0.35} />
      <ellipse cx={cx + 15} cy={89} rx={4.5} ry={2.5} fill="#E88A7A" opacity={0.35} />
      {avatar.hair === 'ngan' ? (
        <path d={`M${cx - 26} 76 Q${cx - 28} 44 ${cx} 44 Q${cx + 28} 44 ${cx + 26} 76 Q${cx + 20} 58 ${cx} 60 Q${cx - 18} 58 ${cx - 26} 76 Z`} fill={HAIR} />
      ) : (
        <path d={`M${cx - 27} 84 Q${cx - 30} 44 ${cx} 45 Q${cx + 30} 44 ${cx + 27} 84 Q${cx + 22} 62 ${cx + 4} 58 Q${cx - 20} 60 ${cx - 27} 84 Z`} fill={HAIR} />
      )}
      {avatar.hair === 'bui' && <circle cx={cx} cy={44} r={13} fill={HAIR} />}
    </g>
  );

  const headwear = (() => {
    switch (look.accessories.head) {
      case 'non-la':
        return (
          <g>
            <path d={`M${cx - 66} 64 L${cx} 12 L${cx + 66} 64 Q${cx} 74 ${cx - 66} 64 Z`} fill={STRAW} stroke={STRAW_DARK} strokeWidth={1.2} />
            {[-44, -22, 0, 22, 44].map((dx) => (
              <path key={dx} d={`M${cx} 14 L${cx + dx} 68`} stroke={STRAW_DARK} strokeOpacity={0.5} strokeWidth={0.8} />
            ))}
            <path d={`M${cx - 50} 52 Q${cx} 60 ${cx + 50} 52 M${cx - 30} 36 Q${cx} 42 ${cx + 30} 36`} stroke={STRAW_DARK} strokeOpacity={0.5} strokeWidth={0.8} fill="none" />
            <path d={`M${cx - 22} 70 Q${cx} 124 ${cx + 22} 70`} stroke={colors.accent} strokeWidth={1.6} fill="none" />
          </g>
        );
      case 'non-quai-thao':
        return (
          <g>
            <path d={`M${cx - 22} 70 L${cx - 28} 150 M${cx + 22} 70 L${cx + 28} 150`} stroke={INK} strokeWidth={2} />
            <path d={`M${cx - 32} 150 l4 14 M${cx - 28} 150 l0 16 M${cx - 24} 150 l-4 14 M${cx + 32} 150 l-4 14 M${cx + 28} 150 l0 16 M${cx + 24} 150 l4 14`} stroke={INK} strokeWidth={1.2} />
            <ellipse cx={cx} cy={58} rx={74} ry={15} fill="#2B2420" />
            <ellipse cx={cx} cy={56} rx={70} ry={12} fill="#3A302A" />
            <path d={`M${cx - 30} 56 L${cx - 28} 42 L${cx + 28} 42 L${cx + 30} 56 Z`} fill="#2B2420" />
            <ellipse cx={cx} cy={42} rx={28} ry={5} fill={STRAW} />
          </g>
        );
      case 'khan-van':
        return (
          <g>
            <path d={`M${cx - 30} 66 Q${cx - 34} 44 ${cx} 40 Q${cx + 34} 44 ${cx + 30} 66 Q${cx} 56 ${cx - 30} 66 Z`} fill={colors.secondary} stroke={INK} strokeOpacity={0.25} strokeWidth={1} />
            <path d={`M${cx - 30} 58 Q${cx} 46 ${cx + 30} 58 M${cx - 32} 51 Q${cx} 40 ${cx + 32} 51`} stroke={INK} strokeOpacity={0.2} strokeWidth={1.2} fill="none" />
          </g>
        );
      case 'khan-dong':
        return (
          <g>
            <path d={`M${cx - 30} 66 L${cx - 30} 44 Q${cx} 36 ${cx + 30} 44 L${cx + 30} 66 Q${cx} 58 ${cx - 30} 66 Z`} fill={INK} />
            {[-20, -10, 0, 10, 20].map((dx) => (
              <path key={dx} d={`M${cx + dx - 4} 44 L${cx + dx + 4} 62`} stroke="#fff" strokeOpacity={0.18} strokeWidth={1.2} />
            ))}
          </g>
        );
      case 'khan-mo-qua':
        return (
          <path d={`M${cx - 29} 86 Q${cx - 34} 42 ${cx} 38 Q${cx + 34} 42 ${cx + 29} 86 L${cx + 24} 66 Q${cx + 12} 58 ${cx} 64 Q${cx - 12} 58 ${cx - 24} 66 Z`} fill={INK} />
        );
      case 'tram-cai':
        return (
          <g>
            <path d={`M${cx + 12} 56 L${cx + 36} 38`} stroke="#C9A24B" strokeWidth={2.5} strokeLinecap="round" />
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={cx + 36 + 4 * Math.cos((a * Math.PI) / 180)} cy={38 + 4 * Math.sin((a * Math.PI) / 180)} r={3} fill={colors.accent} />
            ))}
            <circle cx={cx + 36} cy={38} r={2} fill="#F6D58E" />
          </g>
        );
      case 'mu-bucket':
        return (
          <g>
            <ellipse cx={cx} cy={62} rx={44} ry={9} fill={colors.accent} />
            <path d={`M${cx - 30} 62 L${cx - 24} 36 Q${cx} 30 ${cx + 24} 36 L${cx + 30} 62 Z`} fill={colors.accent} />
            <path d={`M${cx - 29} 56 Q${cx} 60 ${cx + 29} 56`} stroke="#000" strokeOpacity={0.2} strokeWidth={2} fill="none" />
          </g>
        );
      default:
        return null;
    }
  })();

  const neckItem = (() => {
    switch (look.accessories.neck) {
      case 'khan-ran':
        return (
          <g>
            <path d={`M${cx - 28} 118 Q${cx} 140 ${cx + 28} 118 L${cx + 30} 130 Q${cx} 154 ${cx - 30} 130 Z`} fill={`url(#${id('check')})`} stroke={INK} strokeWidth={0.8} />
            <path d={`M${cx + 16} 136 L${cx + 30} 204 L${cx + 44} 200 L${cx + 26} 132 Z`} fill={`url(#${id('check')})`} stroke={INK} strokeWidth={0.8} />
          </g>
        );
      case 'vong-bac':
        return <path d={`M${cx - 24} 124 Q${cx} 150 ${cx + 24} 124`} stroke="#C9CCD3" strokeWidth={4} fill="none" strokeLinecap="round" />;
      case 'chuoi-ngoc':
        return (
          <g>
            {Array.from({ length: 13 }, (_, i) => {
              const t = i / 12;
              const x = cx - 24 + 48 * t;
              const y = 124 + 26 * 4 * t * (1 - t) * 0.9;
              return <circle key={i} cx={x} cy={y} r={2.6} fill="#FBF7EE" stroke="#CFC6B4" strokeWidth={0.6} />;
            })}
          </g>
        );
      default:
        return null;
    }
  })();

  const waistItem = (() => {
    const y = look.garment === 'ao-tu-than' ? 244 : 234;
    const half = look.garment === 'ao-dai' ? ww + 2 : look.garment === 'ao-ba-ba' ? hw - 6 : ww + 12;
    switch (look.accessories.waist) {
      case 'that-lung-lua':
        return (
          <g>
            <rect x={cx - half} y={y} width={half * 2} height={12} fill={colors.accent} />
            <path d={`M${cx - 6} ${y + 10} Q${cx - 14} ${y + 60} ${cx - 10} ${y + 110} L${cx - 1} ${y + 110} Q${cx - 2} ${y + 60} ${cx + 2} ${y + 10} Z`} fill={colors.accent} />
            <path d={`M${cx + 2} ${y + 10} Q${cx + 12} ${y + 50} ${cx + 12} ${y + 96} L${cx + 20} ${y + 96} Q${cx + 16} ${y + 50} ${cx + 8} ${y + 10} Z`} fill={colors.accent} opacity={0.85} />
          </g>
        );
      case 'dai-lung-hien-dai':
        return (
          <g>
            <rect x={cx - half} y={y} width={half * 2} height={10} fill="#2A211C" />
            <rect x={cx - 7} y={y - 1} width={14} height={12} rx={2} fill="none" stroke="#C9A24B" strokeWidth={2} />
          </g>
        );
      default:
        return null;
    }
  })();

  const handItem = (() => {
    const { x, y } = handR;
    switch (look.accessories.hand) {
      case 'quat-giay': {
        const r = 38;
        const ribs = Array.from({ length: 9 }, (_, i) => (-160 + i * 17.5) * (Math.PI / 180));
        const arc = `M${x} ${y} L${x + r * Math.cos(ribs[0])} ${y + r * Math.sin(ribs[0])} A${r} ${r} 0 0 1 ${x + r * Math.cos(ribs[8])} ${y + r * Math.sin(ribs[8])} Z`;
        return (
          <g>
            <path d={arc} fill={IVORY} stroke={colors.accent} strokeWidth={1.5} />
            {ribs.map((a, i) => (
              <path key={i} d={`M${x} ${y} L${x + r * Math.cos(a)} ${y + r * Math.sin(a)}`} stroke={colors.accent} strokeOpacity={0.6} strokeWidth={0.8} />
            ))}
            <path d={`M${x + 0.6 * r * Math.cos(ribs[1])} ${y + 0.6 * r * Math.sin(ribs[1])} A${0.6 * r} ${0.6 * r} 0 0 1 ${x + 0.6 * r * Math.cos(ribs[7])} ${y + 0.6 * r * Math.sin(ribs[7])}`} stroke={colors.primary} strokeWidth={3} fill="none" />
          </g>
        );
      }
      case 'tui-coi':
        return (
          <g>
            <path d={`M${x - 10} ${y + 2} Q${x} ${y - 16} ${x + 10} ${y + 2}`} stroke={STRAW_DARK} strokeWidth={3} fill="none" />
            <path d={`M${x - 20} ${y + 2} L${x + 20} ${y + 2} L${x + 16} ${y + 38} L${x - 16} ${y + 38} Z`} fill={STRAW} stroke={STRAW_DARK} strokeWidth={1.2} />
            {[10, 18, 26, 34].map((dy) => (
              <path key={dy} d={`M${x - 19} ${y + dy} L${x + 19} ${y + dy}`} stroke={STRAW_DARK} strokeOpacity={0.5} strokeWidth={0.8} />
            ))}
            <rect x={x - 20} y={y + 2} width={40} height={6} fill={colors.accent} />
          </g>
        );
      case 'tui-mini':
        return (
          <g>
            <path d={`M${x - 8} ${y + 4} Q${x} ${y - 10} ${x + 8} ${y + 4}`} stroke="#C9A24B" strokeWidth={2} fill="none" />
            <rect x={x - 16} y={y + 4} width={32} height={22} rx={5} fill={colors.accent} />
            <path d={`M${x - 16} ${y + 12} Q${x} ${y + 20} ${x + 16} ${y + 12}`} stroke="#000" strokeOpacity={0.2} strokeWidth={1.2} fill="none" />
          </g>
        );
      default:
        return null;
    }
  })();

  const sheen = fabric.sheen;
  const patternTile = (() => {
    const a = colors.accent;
    switch (look.pattern) {
      case 'hoa-nhi':
        return (
          <pattern id={id('pat')} width={18} height={18} patternUnits="userSpaceOnUse">
            {[0, 72, 144, 216, 288].map((d) => (
              <circle key={d} cx={9 + 2.4 * Math.cos((d * Math.PI) / 180)} cy={9 + 2.4 * Math.sin((d * Math.PI) / 180)} r={1.6} fill={a} />
            ))}
            <circle cx={9} cy={9} r={1} fill={IVORY} />
          </pattern>
        );
      case 'hoa-sen':
        return (
          <pattern id={id('pat')} width={44} height={44} patternUnits="userSpaceOnUse">
            <path d="M22 30 Q14 22 22 10 Q30 22 22 30 Z M22 30 Q10 28 8 18 Q18 18 22 30 Z M22 30 Q34 28 36 18 Q26 18 22 30 Z" fill={a} fillOpacity={0.85} />
            <path d="M14 34 Q22 38 30 34" stroke={a} strokeWidth={1.2} fill="none" />
          </pattern>
        );
      case 'van-may':
        return (
          <pattern id={id('pat')} width={40} height={30} patternUnits="userSpaceOnUse">
            <path d="M6 20 Q6 12 13 12 Q14 6 21 7 Q27 5 29 12 Q35 12 34 19 Q33 23 28 22 M13 16 Q15 13 18 15" stroke={a} strokeWidth={1.4} fill="none" strokeLinecap="round" />
          </pattern>
        );
      case 'chu-tho':
        return (
          <pattern id={id('pat')} width={34} height={34} patternUnits="userSpaceOnUse">
            <circle cx={17} cy={17} r={9} fill="none" stroke={a} strokeWidth={1.6} />
            <path d="M10 13 L24 13 M10 21 L24 21 M17 8 L17 26 M13 13 L13 21 M21 13 L21 21" stroke={a} strokeWidth={1.3} />
          </pattern>
        );
      case 'rong':
        return (
          <pattern id={id('pat')} width={70} height={56} patternUnits="userSpaceOnUse">
            <path d="M6 40 Q16 22 28 34 Q40 46 50 28 Q56 18 64 22" stroke={a} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M60 18 L66 14 L64 22 Z" fill={a} />
            {[14, 24, 34, 44].map((x) => (
              <path key={x} d={`M${x} ${x < 30 ? 30 : 36} l3 -5 l3 5`} stroke={a} strokeWidth={1} fill="none" />
            ))}
          </pattern>
        );
      default:
        return null;
    }
  })();

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 560"
      className={className}
      role="img"
      aria-label={title ?? 'Hình minh họa bộ phối'}
    >
      <defs>
        {patternTile}
        <linearGradient id={id('sheen')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.38" stopColor="#fff" stopOpacity={sheen * 0.35} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.8" stopColor="#000" stopOpacity={0.08} />
          <stop offset="1" stopColor="#000" stopOpacity={0.14} />
        </linearGradient>
        <pattern id={id('check')} width={8} height={8} patternUnits="userSpaceOnUse">
          <rect width={8} height={8} fill={IVORY} />
          <rect width={4} height={4} fill={INK} />
          <rect x={4} y={4} width={4} height={4} fill={INK} />
        </pattern>
        {look.fabric === 'dui' && (
          <pattern id={id('slub')} width={12} height={6} patternUnits="userSpaceOnUse">
            <path d="M0 3 L7 3" stroke="#000" strokeOpacity={0.07} strokeWidth={1} />
          </pattern>
        )}
      </defs>
      {title && <title>{title}</title>}

      <ellipse cx={cx} cy={534} rx={90} ry={10} fill="#000" opacity={0.1} />
      {backHair}
      {garment.back && <path d={garment.back} fill={colors.primary} />}
      {garment.back && <path d={garment.back} fill="#000" opacity={0.14} />}
      {bottomNode}
      {feetNode}
      <rect x={cx - 9} y={100} width={18} height={24} fill={skin} />
      <circle cx={handL.x} cy={handL.y} r={8} fill={skin} />
      <circle cx={handR.x} cy={handR.y} r={8} fill={skin} />

      <g>
        <path d={garment.body} fill={colors.primary} />
        <path d={sleeves} fill={colors.primary} />
        {patternFill && <path d={garment.body} fill={patternFill} opacity={0.75} />}
        {patternFill && <path d={sleeves} fill={patternFill} opacity={0.75} />}
        {look.fabric === 'dui' && <path d={`${garment.body} ${sleeves}`} fill={`url(#${id('slub')})`} />}
        {look.fabric === 'voan' && <path d={`${garment.body} ${sleeves}`} fill="#fff" opacity={0.12} />}
        <path d={`${garment.body} ${sleeves}`} fill={`url(#${id('sheen')})`} />
        <path d={sleeves} fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={1} />
        {look.garment === 'ao-ngu-than' && (
          <path d={`M${cx - sw - 12} 214 L${cx - sw + 2} 212 M${cx + sw + 12} 214 L${cx + sw - 2} 212`} stroke="#000" strokeOpacity={0.18} strokeWidth={1.2} />
        )}
        {garment.details}
        <path d={`M${handL.x - 8} 298 L${handL.x + 8} 300 M${handR.x - 8} 300 L${handR.x + 8} 298`} stroke={colors.secondary} strokeWidth={2.5} />
      </g>
      {garment.collar === 'dung' && (
        <rect x={cx - 11} y={104} width={22} height={18} rx={3} fill={look.garment === 'ao-nhat-binh' ? colors.primary : colors.secondary} stroke="#000" strokeOpacity={0.15} />
      )}
      {waistItem}
      {neckItem}
      {face}
      {headwear}
      {handItem}
    </svg>
  );
});
