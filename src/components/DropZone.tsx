'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFile, disabled }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') onFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: dragging ? 'color-mix(in srgb, var(--accent) 8%, var(--surface))' : 'var(--surface)',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📄</div>
      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
        Arrastra un PDF aquí
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        o haz clic para seleccionar
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
