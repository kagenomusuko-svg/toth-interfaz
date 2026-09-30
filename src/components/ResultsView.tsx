'use client';

import { useState } from 'react';
import type { PipelineResult } from '@/lib/pipeline';

type Tab = 'reporte' | 'slides' | 'mapa';

interface Props {
  result: PipelineResult;
}

export default function ResultsView({ result }: Props) {
  const [tab, setTab] = useState<Tab>('reporte');

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {(['reporte', 'slides', 'mapa'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: tab === t ? 'var(--surface-2)' : 'transparent',
              color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: tab === t ? 600 : 400,
              fontSize: '0.9rem',
              transition: 'all 0.15s',
            }}
          >
            {t === 'reporte' ? '📑 Reporte' : t === 'slides' ? '🖼 Diapositivas' : '🧠 Mapa Mental'}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
        {tab === 'reporte' && <ReporteView result={result} />}
        {tab === 'slides' && <SlidesView result={result} />}
        {tab === 'mapa' && <MapaView result={result} />}
      </div>
    </div>
  );
}

function ReporteView({ result }: Props) {
  const { readingReport } = result;
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        {readingReport.title}
      </h2>
      {readingReport.sections.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No se encontraron secciones en el documento.</p>
      )}
      {readingReport.sections.map((s, i) => (
        <div key={i} style={{ marginBottom: '1.25rem' }}>
          <h3 style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            marginBottom: '0.4rem',
          }}>
            {s.heading}
          </h3>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>{s.body}</p>
        </div>
      ))}
    </div>
  );
}

function SlidesView({ result }: Props) {
  const { slides } = result;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {slides.slides.map((slide, i) => (
        <div
          key={i}
          style={{
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: slide.bullets.length ? '0.75rem' : 0 }}>
            <span style={{
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: '50%',
              width: '1.75rem',
              height: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {slide.index + 1}
            </span>
            <strong style={{ fontSize: '1rem' }}>{slide.title}</strong>
          </div>
          {slide.bullets.length > 0 && (
            <ul style={{ paddingLeft: '2.75rem', color: 'var(--text)', lineHeight: 1.7 }}>
              {slide.bullets.map((b, j) => (
                <li key={j} style={{ marginBottom: '0.25rem' }}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function MapaView({ result }: Props) {
  const { mindMap } = result;

  function renderNode(node: typeof mindMap.root, depth: number): React.ReactNode {
    return (
      <div key={node.id} style={{ marginLeft: depth * 20 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          padding: '0.4rem 0',
        }}>
          <span style={{
            color: depth === 0 ? 'var(--accent)' : depth === 1 ? 'var(--success)' : 'var(--text-muted)',
            fontWeight: depth <= 1 ? 600 : 400,
            fontSize: depth === 0 ? '1rem' : depth === 1 ? '0.9rem' : '0.85rem',
            flexShrink: 0,
          }}>
            {depth === 0 ? '◆' : depth === 1 ? '▸' : '·'}
          </span>
          <span style={{
            color: depth === 0 ? 'var(--text)' : depth === 1 ? 'var(--text)' : 'var(--text-muted)',
            fontWeight: depth === 0 ? 700 : depth === 1 ? 500 : 400,
            fontSize: depth === 0 ? '1rem' : '0.9rem',
          }}>
            {node.label}
          </span>
        </div>
        {node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'monospace', lineHeight: 1.8 }}>
      {renderNode(mindMap.root, 0)}
    </div>
  );
}
