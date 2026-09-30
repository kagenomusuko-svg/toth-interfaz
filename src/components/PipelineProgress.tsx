'use client';

import type { PipelineStep } from '@/lib/pipeline';

const STEPS: { key: PipelineStep; label: string; desc: string }[] = [
  { key: 'ingesta', label: 'Ingesta', desc: 'Extrae y fragmenta el texto' },
  { key: 'extraccion', label: 'Extracción', desc: 'Identifica elementos clave' },
  { key: 'abstractivo', label: 'Síntesis', desc: 'Estructura el contenido' },
  { key: 'productos', label: 'Productos', desc: 'Genera reporte, slides y mapa' },
];

const ORDER: PipelineStep[] = ['ingesta', 'extraccion', 'abstractivo', 'productos', 'done'];

interface Props {
  current: PipelineStep;
}

export default function PipelineProgress({ current }: Props) {
  const currentIdx = ORDER.indexOf(current);

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      {STEPS.map((step, i) => {
        const stepIdx = i; // maps to ORDER index
        const done = currentIdx > stepIdx;
        const active = currentIdx === stepIdx;

        return (
          <div
            key={step.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius)',
              background: done ? 'color-mix(in srgb, var(--success) 12%, var(--surface))'
                : active ? 'color-mix(in srgb, var(--accent) 12%, var(--surface))'
                : 'var(--surface)',
              border: `1px solid ${done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--border)'}`,
              color: done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1rem' }}>
              {done ? '✓' : active ? '⟳' : '○'}
            </span>
            <span style={{ fontWeight: active || done ? 600 : 400 }}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
