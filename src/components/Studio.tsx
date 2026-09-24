import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  ACCESSORIES,
  ACCESSORY_BY_ID,
  BOTTOMS,
  BOTTOM_BY_ID,
  colorName,
  EVENTS,
  EVENT_BY_ID,
  FABRICS,
  PATTERNS,
  PATTERN_BY_ID,
  REGIONS,
  REGION_BY_ID,
  SKIN_TONES,
  SLOTS,
  STYLES,
  STYLE_BY_ID,
  TRADITIONAL_COLORS,
  WEATHERS,
  WEATHER_BY_ID,
  FABRIC_BY_ID,
} from '../data/catalog';
import { GARMENTS, GARMENT_BY_ID } from '../data/garments';
import { downloadBlob, readPhoto, renderCard, slugify } from '../lib/exportImage';
import { evaluateHarmony, SCHEME_LABEL } from '../lib/harmony';
import { autoName } from '../lib/naming';
import { buildSuggestedLook, effectiveStyle, suggestGarments } from '../lib/recommend';
import { checkLook, formalityOf, FORMALITY_LABEL, overallScore, remixOf, REMIX_LABEL, selectedAccessories } from '../lib/rules';
import type { BottomId, Colors, GarmentId, Look, LookContext, Slot } from '../types';
import { Mockup } from './Mockup';
import { Chip, ConfidenceBadge, Field, Meter, Panel, SeverityPill } from './ui';

interface Props {
  look: Look;
  setLook: (look: Look) => void;
  ctx: LookContext;
  setCtx: (ctx: LookContext) => void;
  photo: string | null;
  setPhoto: (photo: string | null) => void;
  onSave: (name: string, note: string) => void;
  onCompare: (name: string) => void;
  onShare: (name: string, note: string) => void;
  onLearn: (garment: GarmentId) => void;
  toast: (message: string) => void;
  shareBox?: ReactNode;
}

const COLOR_ROWS: { key: keyof Colors; label: string; hint: string }[] = [
  { key: 'primary', label: 'Thân áo', hint: 'Màu chủ đạo' },
  { key: 'secondary', label: 'Viền, lót, yếm, lá cổ', hint: 'Màu phụ' },
  { key: 'accent', label: 'Hoa văn, khuy, thắt lưng', hint: 'Điểm nhấn' },
  { key: 'bottom', label: 'Quần / váy', hint: 'Phần dưới' },
];

const DENIM = '#3E5F8A';

export function Studio({ look, setLook, ctx, setCtx, photo, setPhoto, onSave, onCompare, onShare, onLearn, toast, shareBox }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveNote, setSaveNote] = useState('');
  const [photoError, setPhotoError] = useState<string | null>(null);

  const garment = GARMENT_BY_ID[look.garment];
  const warnings = useMemo(() => checkLook(look, ctx), [look, ctx]);
  const harmony = useMemo(() => evaluateHarmony(look.colors), [look.colors]);
  const score = useMemo(() => overallScore(look, ctx), [look, ctx]);
  const suggestions = useMemo(() => suggestGarments(ctx, look.avatar).slice(0, 3), [ctx, look.avatar]);
  const name = autoName(look, ctx);
  const event = ctx.event ? EVENT_BY_ID[ctx.event] : null;
  const weather = ctx.weather ? WEATHER_BY_ID[ctx.weather] : null;
  const region = ctx.region ? REGION_BY_ID[ctx.region] : null;
  const style = STYLE_BY_ID[look.style];
  const styleForEvent = effectiveStyle(look.style, ctx);

  const patch = (p: Partial<Look>) => setLook({ ...look, ...p });
  const setColor = (key: keyof Colors, hex: string) => patch({ colors: { ...look.colors, [key]: hex.toUpperCase() } });
  const setAccessory = (slot: Slot, id: string | null) => patch({ accessories: { ...look.accessories, [slot]: id } });

  const chooseGarment = (id: GarmentId) => {
    const prev = GARMENT_BY_ID[look.garment];
    const next = GARMENT_BY_ID[id];
    const keepBottom = !prev.traditionalBottoms.includes(look.bottom);
    const bottom = keepBottom ? look.bottom : next.traditionalBottoms[0];
    // Váy đụp truyền thống thường nhuộm đen hoặc nâu sẫm.
    const colors = bottom === 'vay-dup' && bottom !== look.bottom ? { ...look.colors, bottom: '#1C1C1E' } : look.colors;
    patch({ garment: id, bottom, colors });
  };
  const chooseBottom = (id: BottomId) => {
    const colors =
      id === 'quan-jeans' ? { ...look.colors, bottom: DENIM } : id === 'vay-dup' ? { ...look.colors, bottom: '#1C1C1E' } : look.colors;
    patch({ bottom: id, colors });
  };
  const applyPalette = (p: [string, string, string, string]) =>
    patch({ colors: { primary: p[0], secondary: p[1], accent: p[2], bottom: look.garment === 'ao-tu-than' ? '#1C1C1E' : p[3] } });

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setPhoto(await readPhoto(file));
      setPhotoError(null);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Không đọc được ảnh.');
    }
  };

  const exportPng = async () => {
    if (!svgRef.current) return;
    try {
      const blob = await renderCard(svgRef.current, {
        name,
        score,
        colors: look.colors,
        lines: [
          `${garment.name} · ${BOTTOM_BY_ID[look.bottom].name} · ${FABRIC_BY_ID[look.fabric].name}`,
          `Phong cách: ${style.name}${event ? ` · Dịp: ${event.name}` : ''}`,
          selectedAccessories(look).length ? `Phụ kiện: ${selectedAccessories(look).map((a) => a.name).join(', ')}` : 'Không phụ kiện',
          garment.tagline,
        ],
      });
      downloadBlob(blob, `${slugify(name)}.png`);
      toast('Đã tạo ảnh PNG. Nếu trình duyệt chặn tải xuống, hãy mở ứng dụng trong tab riêng.');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Không tạo được ảnh.');
    }
  };

  const startSave = () => {
    setSaveName(name);
    setSaveNote('');
    setSaving(true);
  };

  return (
    <div className="studio">
      <div className="controls">
        <Panel title="Bối cảnh" step="1">
          <Field label="Sự kiện" hint={event ? event.tips.join(' ') : 'Chọn dịp để nhận gợi ý và kiểm tra độ trang trọng.'}>
            {EVENTS.map((e) => (
              <Chip key={e.id} active={ctx.event === e.id} onClick={() => setCtx({ ...ctx, event: ctx.event === e.id ? null : e.id })}>
                {e.name}
              </Chip>
            ))}
          </Field>
          <Field label="Vùng miền" hint={region?.highlight}>
            {REGIONS.map((r) => (
              <Chip key={r.id} active={ctx.region === r.id} onClick={() => setCtx({ ...ctx, region: ctx.region === r.id ? null : r.id })}>
                {r.name}
              </Chip>
            ))}
          </Field>
          <Field label="Thời tiết" hint={weather ? `${weather.tips.join(' ')} Vải hợp: ${weather.fabrics.map((f) => FABRIC_BY_ID[f].name.toLowerCase()).join(', ')}.` : undefined}>
            {WEATHERS.map((w) => (
              <Chip key={w.id} active={ctx.weather === w.id} onClick={() => setCtx({ ...ctx, weather: ctx.weather === w.id ? null : w.id })}>
                {w.name}
              </Chip>
            ))}
          </Field>
        </Panel>

        <Panel title="Gợi ý cho bối cảnh này" step="2">
          <ol className="suggest-list">
            {suggestions.map((s) => {
              const g = GARMENT_BY_ID[s.garment];
              return (
                <li key={s.garment} className="suggest">
                  <div>
                    <strong>{g.name}</strong>
                    <p>{s.reasons.length ? s.reasons.join(' · ') : g.tagline}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => {
                      setLook(buildSuggestedLook(s.garment, ctx, look.style, look.avatar));
                      toast(`Đã áp dụng bộ phối gợi ý: ${g.name}.`);
                    }}
                  >
                    Áp dụng
                  </button>
                </li>
              );
            })}
          </ol>
          {styleForEvent !== look.style && (
            <p className="field-hint">
              Phong cách "{style.name}" vượt mức biến tấu thường thấy của dịp này, nên bộ gợi ý sẽ dùng "{STYLE_BY_ID[styleForEvent].name}".
            </p>
          )}
        </Panel>

        <Panel title="Trang phục" step="3">
          <Field label="Loại áo">
            {GARMENTS.map((g) => (
              <Chip key={g.id} active={look.garment === g.id} onClick={() => chooseGarment(g.id)} title={g.tagline}>
                {g.name}
              </Chip>
            ))}
          </Field>
          <Field label="Phần dưới" hint={BOTTOM_BY_ID[look.bottom].note}>
            {BOTTOMS.map((b) => (
              <Chip key={b.id} active={look.bottom === b.id} onClick={() => chooseBottom(b.id)}>
                {b.name}
                {garment.traditionalBottoms.includes(b.id) && <span className="tag">chuẩn</span>}
              </Chip>
            ))}
          </Field>
          <Field label="Chất liệu" hint={FABRIC_BY_ID[look.fabric].note}>
            {FABRICS.map((f) => (
              <Chip key={f.id} active={look.fabric === f.id} onClick={() => patch({ fabric: f.id })}>
                {f.name}
                {weather?.fabrics.includes(f.id) && <span className="tag">hợp thời tiết</span>}
              </Chip>
            ))}
          </Field>
          <Field label="Hoa văn" hint={PATTERN_BY_ID[look.pattern].meaning}>
            {PATTERNS.map((p) => (
              <Chip key={p.id} active={look.pattern === p.id} onClick={() => patch({ pattern: p.id })}>
                {p.name}
              </Chip>
            ))}
          </Field>
        </Panel>

        <Panel title="Màu sắc" step="4">
          <div className="palette-actions">
            {event && (
              <button type="button" className="btn btn-ghost btn-small" onClick={() => applyPalette(event.palette)}>
                Bảng màu dịp {event.name}
              </button>
            )}
            <button type="button" className="btn btn-ghost btn-small" onClick={() => applyPalette(style.palette)}>
              Bảng màu {style.name}
            </button>
          </div>
          {COLOR_ROWS.map((row) => (
            <div className="color-row" key={row.key}>
              <div className="color-row-head">
                <span className="field-label">{row.label}</span>
                <label className="color-current">
                  <input
                    id={`mau-${row.key}`}
                    type="color"
                    value={look.colors[row.key].toLowerCase()}
                    onChange={(e) => setColor(row.key, e.target.value)}
                    aria-label={`Chọn màu tùy ý cho ${row.label.toLowerCase()}`}
                  />
                  <span>{colorName(look.colors[row.key]) ?? look.colors[row.key]}</span>
                </label>
              </div>
              <div className="swatches">
                {TRADITIONAL_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className={`swatch${look.colors[row.key].toLowerCase() === c.hex.toLowerCase() ? ' is-active' : ''}`}
                    style={{ background: c.hex }}
                    title={c.name}
                    aria-label={`${row.label}: ${c.name}`}
                    aria-pressed={look.colors[row.key].toLowerCase() === c.hex.toLowerCase()}
                    onClick={() => setColor(row.key, c.hex)}
                  />
                ))}
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Phong cách và phụ kiện" step="5">
          <Field label="Phong cách" hint={`${style.description} ${style.tips.join(' ')}`}>
            {STYLES.map((s) => (
              <Chip key={s.id} active={look.style === s.id} onClick={() => patch({ style: s.id })}>
                {s.name}
              </Chip>
            ))}
          </Field>
          {SLOTS.map((slot) => {
            const current = look.accessories[slot.id];
            return (
              <Field key={slot.id} label={slot.name} hint={current ? ACCESSORY_BY_ID[current]?.note : undefined}>
                <Chip active={!current} onClick={() => setAccessory(slot.id, null)}>
                  Không
                </Chip>
                {ACCESSORIES.filter((a) => a.slot === slot.id).map((a) => (
                  <Chip key={a.id} active={current === a.id} onClick={() => setAccessory(slot.id, a.id)}>
                    {a.name}
                    {garment.traditionalAccessories.includes(a.id) && <span className="tag">chuẩn</span>}
                    {a.modern && <span className="tag tag-modern">hiện đại</span>}
                  </Chip>
                ))}
              </Field>
            );
          })}
        </Panel>

        <Panel title="Nhân vật thử đồ" step="6">
          <Field label="Dáng người">
            <Chip active={look.avatar.body === 'nu'} onClick={() => patch({ avatar: { ...look.avatar, body: 'nu' } })}>
              Nữ
            </Chip>
            <Chip active={look.avatar.body === 'nam'} onClick={() => patch({ avatar: { ...look.avatar, body: 'nam', hair: look.avatar.hair === 'dai' ? 'ngan' : look.avatar.hair } })}>
              Nam
            </Chip>
          </Field>
          <Field label="Màu da">
            {SKIN_TONES.map((tone, i) => (
              <Chip key={tone} active={look.avatar.skin === i} onClick={() => patch({ avatar: { ...look.avatar, skin: i } })} swatch={tone}>
                Tông {i + 1}
              </Chip>
            ))}
          </Field>
          <Field label="Kiểu tóc">
            {(
              [
                ['dai', 'Tóc dài'],
                ['bui', 'Búi tóc'],
                ['ngan', 'Tóc ngắn'],
              ] as const
            ).map(([id, label]) => (
              <Chip key={id} active={look.avatar.hair === id} onClick={() => patch({ avatar: { ...look.avatar, hair: id } })}>
                {label}
              </Chip>
            ))}
          </Field>
          <div className="field">
            <div className="field-label">Ảnh chân dung của bạn</div>
            <div className="chip-row">
              <label className="btn btn-ghost btn-small file-btn">
                <input id="anh-chan-dung" type="file" accept="image/*" onChange={onPhoto} />
                {photo ? 'Đổi ảnh' : 'Tải ảnh lên'}
              </label>
              {photo && (
                <button type="button" className="btn btn-ghost btn-small" onClick={() => setPhoto(null)}>
                  Bỏ ảnh
                </button>
              )}
            </div>
            <p className="field-hint">
              Ảnh được cắt vuông và xử lý ngay trên máy bạn, không tải lên máy chủ và không nằm trong link chia sẻ.
            </p>
            {photoError && <p className="field-error">{photoError}</p>}
          </div>
        </Panel>
      </div>

      <div className="stage">
        <div className="stage-frame">
          <Mockup ref={svgRef} look={look} photo={photo} title={name} className="stage-svg" />
          <span className="stage-caption">{REMIX_LABEL[remixOf(look)]}</span>
        </div>
        <h2 className="stage-title">{name}</h2>
        <p className="stage-sub">
          {BOTTOM_BY_ID[look.bottom].name} · {FABRIC_BY_ID[look.fabric].name} · hoa văn {PATTERN_BY_ID[look.pattern].name.toLowerCase()}
        </p>
        <div className="stage-actions">
          <button type="button" className="btn btn-primary" onClick={startSave}>
            Lưu vào lookbook
          </button>
          <button type="button" className="btn" onClick={() => onCompare(name)}>
            Thêm vào so sánh
          </button>
          <button type="button" className="btn" onClick={exportPng}>
            Tải ảnh PNG
          </button>
          <button type="button" className="btn" onClick={() => onShare(name, '')}>
            Chia sẻ
          </button>
        </div>
        {saving && (
          <form
            className="save-form"
            onSubmit={(e) => {
              e.preventDefault();
              onSave(saveName.trim() || name, saveNote.trim());
              setSaving(false);
            }}
          >
            <label htmlFor="ten-bo-phoi">Tên bộ phối</label>
            <input id="ten-bo-phoi" value={saveName} maxLength={80} onChange={(e) => setSaveName(e.target.value)} />
            <label htmlFor="ghi-chu-bo-phoi">Ghi chú (ví dụ: biến tấu gì, mặc dịp nào)</label>
            <textarea id="ghi-chu-bo-phoi" value={saveNote} maxLength={280} rows={2} onChange={(e) => setSaveNote(e.target.value)} />
            <div className="chip-row">
              <button type="submit" className="btn btn-primary btn-small">
                Lưu
              </button>
              <button type="button" className="btn btn-ghost btn-small" onClick={() => setSaving(false)}>
                Hủy
              </button>
            </div>
          </form>
        )}
        {shareBox}
      </div>

      <aside className="results">
        <section className="card">
          <h2 className="card-title">Thẻ đánh giá</h2>
          <Meter value={score} label="Điểm phù hợp" />
          <Meter value={harmony.score} label={`Hài hòa màu · ${SCHEME_LABEL[harmony.scheme]}`} />
          <div className="swatch-strip" aria-label="Bảng màu đang dùng">
            {COLOR_ROWS.map((r) => (
              <span key={r.key} style={{ background: look.colors[r.key] }} title={`${r.hint}: ${colorName(look.colors[r.key]) ?? look.colors[r.key]}`} />
            ))}
          </div>
          <ul className="notes">
            {harmony.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <dl className="stats">
            <div>
              <dt>Độ trang trọng</dt>
              <dd>{FORMALITY_LABEL[formalityOf(look)]}</dd>
            </div>
            <div>
              <dt>Mức biến tấu</dt>
              <dd>{REMIX_LABEL[remixOf(look)]}</dd>
            </div>
            {event && (
              <div>
                <dt>Dịp cần</dt>
                <dd>{FORMALITY_LABEL[event.formality]}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="card">
          <h2 className="card-title">
            Kiểm tra văn hóa <span className="count num">{warnings.length}</span>
          </h2>
          {warnings.length === 0 ? (
            <p className="ok-line">Không thấy chi tiết nào làm sai lệch đặc trưng của trang phục.</p>
          ) : (
            <ul className="warnings">
              {warnings.map((w) => (
                <li key={w.id} className={`warning warning-${w.severity}`}>
                  <div className="warning-head">
                    <SeverityPill severity={w.severity} />
                    <strong>{w.title}</strong>
                  </div>
                  <p>{w.why}</p>
                  {w.fix && <p className="fix">Cách sửa: {w.fix}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="card-title">Về {garment.name.toLowerCase()}</h2>
          <p className="lede">{garment.tagline}</p>
          <p className="meta">
            {garment.era} · {garment.region.map((r) => REGION_BY_ID[r].name).join(', ')}
          </p>
          <ul className="facts">
            {[garment.origin[0], ...garment.meaning].map((f) => (
              <li key={f.text}>
                <ConfidenceBadge value={f.confidence} /> {f.text}
              </li>
            ))}
          </ul>
          {selectedAccessories(look).length > 0 && (
            <>
              <h3 className="mini-title">Phụ kiện đang dùng</h3>
              <ul className="facts">
                {selectedAccessories(look).map((a) => (
                  <li key={a.id}>
                    <strong>{a.name}:</strong> {a.note}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="button" className="btn btn-ghost btn-small" onClick={() => onLearn(look.garment)}>
            Đọc đầy đủ và xem nguồn
          </button>
        </section>
      </aside>
    </div>
  );
}
