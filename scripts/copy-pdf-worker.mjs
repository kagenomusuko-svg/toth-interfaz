import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const publicDir = resolve(root, 'public');

const candidates = [
  resolve(root, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
  resolve(root, 'node_modules/pdfjs-dist/build/pdf.worker.mjs'),
  resolve(root, 'node_modules/pdfjs-dist/build/pdf.worker.min.js'),
];

mkdirSync(publicDir, { recursive: true });

const src = candidates.find(existsSync);
if (src) {
  copyFileSync(src, resolve(publicDir, 'pdf.worker.min.mjs'));
  console.log('✓ PDF worker copiado a public/');
} else {
  console.warn('⚠ pdf.worker no encontrado — extracción de PDF deshabilitada');
}
