import { useCallback, useRef, useState } from 'react';

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

export function useCardPhotoExport(builderName: string) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [forcePhotoFallback, setForcePhotoFallback] = useState(false);

  const exportPhoto = useCallback(async () => {
    const node = captureRef.current;
    if (!node || isGenerating) return;

    setIsGenerating(true);

    try {
      const { toPng } = await import('html-to-image');

      const capture = async (usePhotoFallback: boolean): Promise<string> => {
        setForcePhotoFallback(usePhotoFallback);
        await waitForPaint();

        return toPng(node, {
          pixelRatio: 2,
          cacheBust: true,
        });
      };

      let dataUrl: string;
      try {
        dataUrl = await capture(false);
      } catch (firstError) {
        console.warn('Card photo export failed, retrying with photo fallback:', firstError);
        dataUrl = await capture(true);
      }

      const filename = `cryptita-builder-${sanitizeFilename(builderName)}.png`;
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (exportError) {
      console.error('Card photo export failed:', exportError);
    } finally {
      setForcePhotoFallback(false);
      setIsGenerating(false);
    }
  }, [builderName, isGenerating]);

  return {
    captureRef,
    exportPhoto,
    isGenerating,
    forcePhotoFallback,
  };
}
