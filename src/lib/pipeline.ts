import { extractPdfText, normalizeDocument } from '@toth/ingesta';
import { extractElements, MODEL_REPORTE_LECTURA } from '@toth/extraccion';
import { synthesize, DeterministicBackend } from '@toth/abstractivo';
import { formatReadingReport, formatSlides, formatMindMap } from '@toth/productos';
import { compose } from '@toth/compositor';
import type { ReadingReport, SlidesDeck, MindMap } from '@toth/productos';
import type { AbstractiveRequest } from '@toth/abstractivo';

export type PipelineStep =
  | 'idle'
  | 'ingesta'
  | 'extraccion'
  | 'abstractivo'
  | 'productos'
  | 'done'
  | 'error';

export interface PipelineResult {
  filename: string;
  readingReport: ReadingReport;
  slides: SlidesDeck;
  mindMap: MindMap;
}

export async function runPipeline(
  arrayBuffer: ArrayBuffer,
  filename: string,
  onStep: (step: PipelineStep) => void
): Promise<PipelineResult> {
  const corpusId = `corpus:${filename.replace(/[^a-z0-9]/gi, '-')}:${Date.now()}`;
  const docId = `doc:${filename.replace(/[^a-z0-9]/gi, '-')}`;

  // Ingesta
  onStep('ingesta');
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const pdfResult = await extractPdfText(arrayBuffer, {
    workerSrc: `${basePath}/pdf.worker.min.mjs`,
  });

  const { sourceDocument } = await normalizeDocument({
    id: docId,
    corpusId,
    filename,
    text: pdfResult.text,
    mediaType: 'application/pdf',
    pageCount: pdfResult.pageCount,
  });

  // Extraccion
  onStep('extraccion');
  const model = MODEL_REPORTE_LECTURA;
  const extraction = extractElements({
    corpusId,
    model,
    fragments: sourceDocument.fragments,
  });

  // Abstractivo
  onStep('abstractivo');
  const now = new Date().toISOString();
  const request: AbstractiveRequest = {
    id: `req:${corpusId}`,
    corpusId,
    extractionResultId: extraction.id,
    productKind: 'reporte-lectura',
    discriminationModelId: model.id,
    languageBackendId: 'toth:deterministic:v1',
    parameters: {},
    createdAt: now,
    provenance: {
      kind: 'toth-abstractivo',
      actorId: 'toth-interfaz',
      recordedAt: now,
    },
  };

  const output = await synthesize({
    request,
    extraction,
    backend: new DeterministicBackend(),
    outputOrder: model.elements.map((e) => e.id),
  });

  // Productos
  onStep('productos');
  const title = filename.replace(/\.pdf$/i, '');

  const readingReport = formatReadingReport({ corpusId, title, output });
  const slides = formatSlides({ corpusId, title, output });
  const mindMap = formatMindMap({ corpusId, rootLabel: title, output });

  compose({
    corpusId,
    title,
    products: [
      { kind: 'reporte-lectura', productId: readingReport.id },
      { kind: 'diapositivas', productId: slides.id },
      { kind: 'mapa-mental', productId: mindMap.id },
    ],
  });

  onStep('done');
  return { filename, readingReport, slides, mindMap };
}
