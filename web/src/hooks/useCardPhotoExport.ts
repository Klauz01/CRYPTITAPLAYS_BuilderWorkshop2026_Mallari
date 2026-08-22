import { useCallback, useRef, useState } from 'react';
import {
  EXPORT_BACKGROUND,
  EXPORT_ERROR_BACKGROUND,
  EXPORT_HEIGHT,
  EXPORT_WIDTH,
} from '../lib/cardPhotoExport';

const EXPORT_ERROR_TITLE = 'Export failed';
const EXPORT_ERROR_BODY =
  "We couldn't export your Cryptita Plays Builder Card. Please try again.";

/** Supersample capture, then downscale for sharper social output. */
const CAPTURE_PIXEL_RATIO = 2;

function sanitizeFilename(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'builder';
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll('img'));

  await Promise.all(
    images.map((image) => {
      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const finish = () => resolve();

        image.addEventListener('load', finish, { once: true });
        image.addEventListener('error', finish, { once: true });
      });
    }),
  );
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load export image.'));
    image.src = dataUrl;
  });
}

function downscaleToSocialSize(dataUrl: string): Promise<string> {
  return loadImage(dataUrl).then((image) => {
    const canvas = document.createElement('canvas');

    canvas.width = EXPORT_WIDTH;
    canvas.height = EXPORT_HEIGHT;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas is unavailable.');
    }

    context.fillStyle = EXPORT_BACKGROUND;
    context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

    return canvas.toDataURL('image/png');
  });
}

function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');

  link.download = filename;
  link.href = dataUrl;

  document.body.appendChild(link);
  link.click();
  link.remove();
}

function createExportErrorPng(): string {
  const canvas = document.createElement('canvas');

  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;

  const context = canvas.getContext('2d');

  if (!context) {
    return '';
  }

  context.fillStyle = EXPORT_ERROR_BACKGROUND;
  context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.fillStyle = '#f4f4f4';
  context.font = '700 48px Inter, ui-sans-serif, system-ui, sans-serif';
  context.fillText(EXPORT_ERROR_TITLE, EXPORT_WIDTH / 2, EXPORT_HEIGHT / 2 - 32);

  context.fillStyle = 'rgba(255, 255, 255, 0.62)';
  context.font = '500 26px Inter, ui-sans-serif, system-ui, sans-serif';
  context.fillText(EXPORT_ERROR_BODY, EXPORT_WIDTH / 2, EXPORT_HEIGHT / 2 + 28);

  return canvas.toDataURL('image/png');
}

type CaptureStyleSnapshot = {
  position: string;
  left: string;
  top: string;
  zIndex: string;
  visibility: string;
  pointerEvents: string;
};

function snapshotCaptureStyles(node: HTMLElement): CaptureStyleSnapshot {
  return {
    position: node.style.position,
    left: node.style.left,
    top: node.style.top,
    zIndex: node.style.zIndex,
    visibility: node.style.visibility,
    pointerEvents: node.style.pointerEvents,
  };
}

function applyCaptureStyles(node: HTMLElement): void {
  node.style.position = 'fixed';
  node.style.left = '0';
  node.style.top = '0';
  node.style.zIndex = '2147483647';
  node.style.visibility = 'visible';
  node.style.pointerEvents = 'none';
}

function restoreCaptureStyles(node: HTMLElement, snapshot: CaptureStyleSnapshot): void {
  node.style.position = snapshot.position;
  node.style.left = snapshot.left;
  node.style.top = snapshot.top;
  node.style.zIndex = snapshot.zIndex;
  node.style.visibility = snapshot.visibility;
  node.style.pointerEvents = snapshot.pointerEvents;
}

async function captureExportNode(node: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image');
  const styleSnapshot = snapshotCaptureStyles(node);

  applyCaptureStyles(node);

  try {
    await waitForPaint();
    await waitForImages(node);
    await document.fonts.ready;

    const supersampled = await toPng(node, {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      pixelRatio: CAPTURE_PIXEL_RATIO,
      cacheBust: true,
      backgroundColor: EXPORT_BACKGROUND,
    });

    return await downscaleToSocialSize(supersampled);
  } finally {
    restoreCaptureStyles(node, styleSnapshot);
  }
}

export function useCardPhotoExport(builderName: string, canExport: boolean) {
  const captureRef = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportPhoto = useCallback(async () => {
    const node = captureRef.current;

    if (!node || !canExport || isGenerating) return;

    setIsGenerating(true);
    setExportError(null);

    const filename = `cryptita-builder-${sanitizeFilename(builderName)}.png`;

    try {
      const dataUrl = await captureExportNode(node);

      if (!dataUrl) {
        throw new Error('Export produced an empty image.');
      }

      downloadDataUrl(dataUrl, filename);
    } catch (exportError) {
      console.error('Could not generate BuilderCard image:', exportError);

      const errorDataUrl = createExportErrorPng();

      if (errorDataUrl) {
        downloadDataUrl(errorDataUrl, filename);
      }

      setExportError(EXPORT_ERROR_BODY);
    } finally {
      setIsGenerating(false);
    }
  }, [builderName, canExport, isGenerating]);

  const clearExportError = useCallback(() => {
    setExportError(null);
  }, []);

  return {
    captureRef,
    exportPhoto,
    isGenerating,
    exportError,
    clearExportError,
  };
}
