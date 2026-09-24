import { useEffect } from 'react';
import { ACCESSORIES, BOTTOM_BY_ID, REGION_BY_ID, SLOTS } from '../data/catalog';
import { GARMENTS } from '../data/garments';
import { DEFAULT_AVATAR, buildSuggestedLook } from '../lib/recommend';
import type { Confidence, GarmentId } from '../types';
import { Mockup } from './Mockup';
import { CONFIDENCE_HINT, CONFIDENCE_LABEL, ConfidenceBadge } from './ui';

interface Props {
  focus: GarmentId | null;
  onTry: (garment: GarmentId) => void;
}

export function Learn({ focus, onTry }: Props) {
  useEffect(() => {
    if (!focus) return;
    document.getElementById(`hieu-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [focus]);

  return (
    <div className="learn">
      <p className="page-intro">
        Năm nhóm trang phục truyền thống của người Việt. Mỗi thông tin đều gắn nhãn độ tin cậy để bạn phân biệt điều đã có tư liệu với cách hiểu dân gian.
      </p>
      <div className="legend">
        {(Object.keys(CONFIDENCE_LABEL) as Confidence[]).map((c) => (
          <div key={c}>
            <ConfidenceBadge value={c} /> <span>{CONFIDENCE_HINT[c]}</span>
          </div>
        ))}
      </div>
      <nav className="learn-nav" aria-label="Các loại trang phục">
        {GARMENTS.map((g) => (
          <a key={g.id} href={`#hieu-${g.id}`} onClick={(e) => {
            e.preventDefault();
            document.getElementById(`hieu-${g.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}>
            {g.name}
          </a>
        ))}
      </nav>

      {GARMENTS.map((g) => {
        const sample = buildSuggestedLook(g.id, { event: null, region: g.region.length === 1 ? g.region[0] : null, weather: null }, 'truyen-thong', {
          ...DEFAULT_AVATAR,
          hair: 'bui',
        });
        return (
          <article key={g.id} id={`hieu-${g.id}`} className={`garment-article${focus === g.id ? ' is-focus' : ''}`}>
            <div className="garment-figure">
              <Mockup look={sample} title={`${g.name} theo cách phối truyền thống`} />
              <button type="button" className="btn btn-small" onClick={() => onTry(g.id)}>
                Thử phối {g.name.toLowerCase()}
              </button>
            </div>
            <div className="garment-text">
              <h2>{g.name}</h2>
              <p className="lede">{g.tagline}</p>
              <p className="meta">
                {g.era} · {g.region.map((r) => REGION_BY_ID[r].name).join(', ')} · Phần dưới truyền thống:{' '}
                {g.traditionalBottoms.map((b) => BOTTOM_BY_ID[b].name.toLowerCase()).join(', ')}
              </p>

              <h3>Nguồn gốc</h3>
              <ul className="facts">
                {g.origin.map((f) => (
                  <li key={f.text}>
                    <ConfidenceBadge value={f.confidence} /> {f.text}
                  </li>
                ))}
              </ul>

              <h3>Cấu trúc nhận diện</h3>
              <ul className="plain-list">
                {g.structure.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <h3>Ý nghĩa</h3>
              <ul className="facts">
                {g.meaning.map((f) => (
                  <li key={f.text}>
                    <ConfidenceBadge value={f.confidence} /> {f.text}
                  </li>
                ))}
              </ul>

              <h3>Dịp mặc</h3>
              <p>{g.occasions.join(' · ')}</p>

              <h3>Dễ nhầm với</h3>
              <ul className="plain-list">
                {g.confusedWith.map((c) => (
                  <li key={c.name}>
                    <strong>{c.name}.</strong> {c.difference}
                  </li>
                ))}
              </ul>

              <h3>Khi phối, hãy giữ</h3>
              <ul className="plain-list">
                {g.respectNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>

              <h3>Nguồn tham khảo</h3>
              <ul className="sources">
                {g.sources.map((s) => (
                  <li key={s.title}>
                    <strong>{s.title}</strong>. {s.detail}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}

      <section className="glossary">
        <h2>Phụ kiện</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Phụ kiện</th>
                <th scope="col">Vị trí</th>
                <th scope="col">Vùng gắn bó</th>
                <th scope="col">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {ACCESSORIES.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.name}
                    {a.modern && <span className="tag tag-modern">hiện đại</span>}
                  </td>
                  <td>{SLOTS.find((s) => s.id === a.slot)?.name}</td>
                  <td>{a.region.length ? a.region.map((r) => REGION_BY_ID[r].name).join(', ') : a.modern ? '–' : 'Cả nước'}</td>
                  <td>{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
