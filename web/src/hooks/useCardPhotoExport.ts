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

      const capture = async (
        usePhotoFallback: boolean,
      ): Promise<string> => {
        setForcePhotoFallback(usePhotoFallback);

        await waitForPaint();
        await waitForImages(node);
        await document.fonts.ready;

        return toPng(node, {
          pixelRatio: 2,
          cacheBust: true,
          skipAutoScale: false,
        });
      };

      let dataUrl: string;

      try {
        dataUrl = await capture(false);
      } catch (firstError) {
        console.warn(
          'Export with remote photo failed. Using fallback.',
          firstError,
        );

        dataUrl = await capture(true);
      }

      const filename =
        `cryptita-builder-${sanitizeFilename(builderName)}.png`;

      const link = document.createElement('a');

      link.download = filename;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (exportError) {
      console.error(
        'Could not generate BuilderCard image:',
        exportError,
      );
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