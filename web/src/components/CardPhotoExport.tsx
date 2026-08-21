import type { ReactNode } from 'react';
import { useCardPhotoExport } from '../hooks/useCardPhotoExport';
import type { UsePortfolioResult } from '../types';
import BuilderCardExport from './BuilderCardExport';

type CardPhotoExportRenderProps = {
  onCameraClick: () => void;
  isGenerating: boolean;
};

type CardPhotoExportProps = {
  portfolio: UsePortfolioResult;
  children: (props: CardPhotoExportRenderProps) => ReactNode;
};

export default function CardPhotoExport({ portfolio, children }: CardPhotoExportProps) {
  const builderName = portfolio.data?.fields.builder_name ?? 'builder';
  const { captureRef, exportPhoto, isGenerating, forcePhotoFallback } =
    useCardPhotoExport(builderName);

  return (
    <>
      <BuilderCardExport
        ref={captureRef}
        portfolio={portfolio}
        forcePhotoFallback={forcePhotoFallback}
      />
      {children({
        onCameraClick: () => {
          void exportPhoto();
        },
        isGenerating,
      })}
    </>
  );
}
