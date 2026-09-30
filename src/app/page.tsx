'use client';

import { useState, useCallback } from 'react';
import DropZone from '@/components/DropZone';
import PipelineProgress from '@/components/PipelineProgress';
import ResultsView from '@/components/ResultsView';
import type { PipelineStep, PipelineResult } from '@/lib/pipeline';

export default function HomePage() {
  const [step, setStep] = useState<PipelineStep>('idle');
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setResult(null);
    setError(null);
    setFilename(file.name);
    setStep('ingesta');

    try {
      const { runPipeline } = await import('@/lib/pipeline');
      const buffer = await file.arrayBuffer();
      const res = await runPipeline(buffer, file.name, setStep);
      setResult(res);
    } catch (err) {
      setStep('error');
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const reset = () => {
    setStep('idle');
    setResult(null);
    setError(null);
    setFilename(null);
  };

  const busy = step !== 'idle' && step !== 'done' && step !== 'error';

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
    }}>
      {/* Header */}
      <header style={{ width: '100%', maxWidth: '720px', marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>𓅓</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Toth</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Análisis de documentos en el navegador — sin servidores, sin claves de API
        </p>
      </header>

      <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Upload */}
        {step === 'idle' && (
          <DropZone onFile={handleFile} disabled={busy} />
        )}

        {/* Processing */}
        {busy && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Procesando <strong style={{ color: 'var(--text)' }}>{filename}</strong>…
            </p>
            <PipelineProgress current={step} />
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div style={{
            background: 'color-mix(in srgb, var(--error) 10%, var(--surface))',
            border: '1px solid var(--error)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
          }}>
            <p style={{ fontWeight: 600, color: 'var(--error)', marginBottom: '0.5rem' }}>Error al procesar</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{error}</p>
            <button
              onClick={reset}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                background: 'var(--surface-2)',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Results */}
        {step === 'done' && result && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ✓ <strong style={{ color: 'var(--success)' }}>Análisis completo</strong>
                {' — '}{filename}
              </p>
              <button
                onClick={reset}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  background: 'var(--surface-2)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  border: '1px solid var(--border)',
                }}
              >
                Nuevo documento
              </button>
            </div>
            <ResultsView result={result} />
          </>
        )}
      </div>

      <footer style={{ marginTop: 'auto', paddingTop: '3rem', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
        Todo el procesamiento ocurre en tu navegador.
      </footer>
    </main>
  );
}
