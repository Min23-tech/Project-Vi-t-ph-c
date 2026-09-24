import type { ReactNode } from 'react';
import type { Confidence, Severity } from '../types';

export function Chip({
  active,
  onClick,
  children,
  title,
  swatch,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  title?: string;
  swatch?: string;
}) {
  return (
    <button type="button" className={`chip${active ? ' is-active' : ''}`} aria-pressed={active} onClick={onClick} title={title}>
      {swatch && <span className="chip-swatch" style={{ background: swatch }} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="chip-row">{children}</div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function Panel({ title, step, children, aside }: { title: string; step?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="panel">
      <header className="panel-head">
        {step && <span className="panel-step">{step}</span>}
        <h2>{title}</h2>
        {aside}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  'nghiem-trong': 'Cần sửa',
  'luu-y': 'Lưu ý',
  'goi-y': 'Gợi ý',
};

export function SeverityPill({ severity }: { severity: Severity }) {
  return <span className={`pill pill-${severity}`}>{SEVERITY_LABEL[severity]}</span>;
}

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  'su-lieu': 'Có tư liệu',
  'pho-bien': 'Cách hiểu phổ biến',
  'tranh-luan': 'Còn tranh luận',
};

export const CONFIDENCE_HINT: Record<Confidence, string> = {
  'su-lieu': 'Được ghi nhận trong sử liệu, hiện vật bảo tàng hoặc công trình nghiên cứu.',
  'pho-bien': 'Cách giải thích lưu truyền rộng rãi trong dân gian, chưa thấy ghi chép chính thức.',
  'tranh-luan': 'Các nhà nghiên cứu còn nhiều giả thuyết khác nhau.',
};

export function ConfidenceBadge({ value }: { value: Confidence }) {
  return (
    <span className={`conf conf-${value}`} title={CONFIDENCE_HINT[value]}>
      {CONFIDENCE_LABEL[value]}
    </span>
  );
}

export function Meter({ value, label }: { value: number; label: string }) {
  const tone = value >= 80 ? 'good' : value >= 60 ? 'ok' : value >= 40 ? 'warn' : 'bad';
  return (
    <div className={`meter meter-${tone}`}>
      <div className="meter-top">
        <span>{label}</span>
        <strong className="num">{value}</strong>
      </div>
      <div className="meter-track" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
        <div className="meter-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
