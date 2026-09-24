import { BOTTOM_BY_ID, EVENT_BY_ID, FABRIC_BY_ID } from '../data/catalog';
import { GARMENT_BY_ID } from '../data/garments';
import { evaluateHarmony } from '../lib/harmony';
import { checkLook, formalityOf, FORMALITY_LABEL, overallScore, remixOf, REMIX_LABEL, selectedAccessories } from '../lib/rules';
import type { SavedLook } from '../types';
import { Mockup } from './Mockup';

interface Props {
  items: SavedLook[];
  onOpen: (item: SavedLook) => void;
  onRemove: (id: string) => void;
  onGoStudio: () => void;
}

export function Compare({ items, onOpen, onRemove, onGoStudio }: Props) {
  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Chưa có phương án nào để so sánh</h2>
        <p>Trong phòng phối đồ, bấm "Thêm vào so sánh" cho tối đa 3 phương án, hoặc thêm từ lookbook.</p>
        <button type="button" className="btn btn-primary" onClick={onGoStudio}>
          Về phòng phối đồ
        </button>
      </div>
    );
  }
  const rows = items.map((item) => {
    const warnings = checkLook(item.look, item.context);
    return {
      item,
      score: overallScore(item.look, item.context),
      harmony: evaluateHarmony(item.look.colors),
      formality: formalityOf(item.look),
      remix: remixOf(item.look),
      severe: warnings.filter((w) => w.severity === 'nghiem-trong').length,
      caution: warnings.filter((w) => w.severity === 'luu-y').length,
      hint: warnings.filter((w) => w.severity === 'goi-y').length,
      top: warnings[0],
    };
  });
  const best = Math.max(...rows.map((r) => r.score));

  return (
    <div className="compare">
      <p className="page-intro">
        So sánh tối đa 3 phương án. Mỗi phương án được đánh giá theo bối cảnh đã chọn khi thêm vào.
        {items.length < 3 && ' Bạn có thể thêm phương án khác từ phòng phối đồ.'}
      </p>
      <div className="compare-grid" style={{ ['--cols' as string]: String(items.length) }}>
        {rows.map((r) => {
          const g = GARMENT_BY_ID[r.item.look.garment];
          const ev = r.item.context.event ? EVENT_BY_ID[r.item.context.event] : null;
          return (
            <article key={r.item.id} className={`compare-col${r.score === best && rows.length > 1 ? ' is-best' : ''}`}>
              {r.score === best && rows.length > 1 && <span className="best-badge">Phù hợp nhất</span>}
              <Mockup look={r.item.look} title={r.item.name} className="compare-svg" />
              <h3>{r.item.name}</h3>
              <p className="meta">{ev ? ev.name : 'Không chọn dịp'}</p>
              <dl className="compare-stats">
                <div>
                  <dt>Điểm phù hợp</dt>
                  <dd className="num big">{r.score}</dd>
                </div>
                <div>
                  <dt>Hài hòa màu</dt>
                  <dd className="num">{r.harmony.score} · {r.harmony.label}</dd>
                </div>
                <div>
                  <dt>Trang trọng</dt>
                  <dd>{FORMALITY_LABEL[r.formality]}</dd>
                </div>
                <div>
                  <dt>Biến tấu</dt>
                  <dd>{REMIX_LABEL[r.remix]}</dd>
                </div>
                <div>
                  <dt>Cảnh báo</dt>
                  <dd>
                    <span className={`pill ${r.severe ? 'pill-nghiem-trong' : 'pill-zero'}`}>{r.severe} cần sửa</span>{' '}
                    <span className={`pill ${r.caution ? 'pill-luu-y' : 'pill-zero'}`}>{r.caution} lưu ý</span>{' '}
                    <span className={`pill ${r.hint ? 'pill-goi-y' : 'pill-zero'}`}>{r.hint} gợi ý</span>
                  </dd>
                </div>
                <div>
                  <dt>Thành phần</dt>
                  <dd>
                    {g.name}, {BOTTOM_BY_ID[r.item.look.bottom].name.toLowerCase()}, {FABRIC_BY_ID[r.item.look.fabric].name.toLowerCase()}
                    {selectedAccessories(r.item.look).length > 0 && `, ${selectedAccessories(r.item.look).map((a) => a.name.toLowerCase()).join(', ')}`}
                  </dd>
                </div>
              </dl>
              {r.top && <p className="compare-top">Điểm cần chú ý nhất: {r.top.title}</p>}
              <div className="chip-row">
                <button type="button" className="btn btn-small" onClick={() => onOpen(r.item)}>
                  Mở để chỉnh
                </button>
                <button type="button" className="btn btn-ghost btn-small" onClick={() => onRemove(r.item.id)}>
                  Bỏ khỏi so sánh
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
