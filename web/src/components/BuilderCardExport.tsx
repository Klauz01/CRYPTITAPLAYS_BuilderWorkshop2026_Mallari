import { forwardRef } from 'react';
import type { UsePortfolioResult } from '../types';
import { CardBackFace, CardFrontFace } from './ProfileCardFaces';
import '../styles/profile-card.css';
import '../styles/card-photo-export.css';

type BuilderCardExportProps = {
  portfolio: UsePortfolioResult;
  forcePhotoFallback?: boolean;
};

const BuilderCardExport = forwardRef<HTMLDivElement, BuilderCardExportProps>(
  function BuilderCardExport({ portfolio, forcePhotoFallback = false }, ref) {
    const { status, data } = portfolio;
    const photoUrl = data?.fields.photo_url ?? '';
    const showPhoto = Boolean(photoUrl) && status === 'success' && !forcePhotoFallback;

    return (
      <div
        ref={ref}
        className="builder-card-export"
        aria-hidden="true"
        data-export-root
      >
        <div className="builder-card-export__studio">
          <header className="builder-card-export__header">
            <h2>CRYPTITA PLAYS</h2>
            <p>BUILDER WORKSHOP 2026</p>
          </header>

          <div className="builder-card-export__cards">
            <div className="builder-card-export__back-wrap">
              <div className="builder-card-export__card-shell">
                <CardBackFace portfolio={portfolio} backFaceTabIndex={-1} backFaceAriaHidden />
              </div>
            </div>

            <div className="builder-card-export__front-wrap">
              <div className="builder-card-export__card-shell">
                <CardFrontFace
                  portfolio={portfolio}
                  showPhoto={showPhoto}
                  forcePhotoFallback={forcePhotoFallback}
                  photoCrossOrigin
                />
              </div>
            </div>
          </div>

          <footer className="builder-card-export__footer">PROOF OF LEARNING &amp; BUILDING</footer>
        </div>
      </div>
    );
  },
);

export default BuilderCardExport;
