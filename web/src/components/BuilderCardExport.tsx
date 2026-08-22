import { forwardRef } from 'react';
import { PROFILE_PHOTO_PATH } from '../lib/profilePhoto';
import type { UsePortfolioResult } from '../types';
import { CardBackFace, CardFrontFace } from './ProfileCardFaces';
import '../styles/profile-card.css';
import '../styles/card-photo-export.css';

type BuilderCardExportProps = {
  portfolio: UsePortfolioResult;
};

const BuilderCardExport = forwardRef<HTMLDivElement, BuilderCardExportProps>(
  function BuilderCardExport({ portfolio }, ref) {
    const { status } = portfolio;
    const showPhoto = status !== 'error';

    return (
      <div
        ref={ref}
        className="builder-card-export"
        aria-hidden="true"
        data-export-root
      >
        <div className="builder-card-export__studio">
          <div className="material-noise" aria-hidden="true" />
          <div className="material-light" aria-hidden="true" />

          <div className="builder-card-export__cards">
            <div className="builder-card-export__card-wrap builder-card-export__card-wrap--front">
              <div className="builder-card-export__card-shell">
                <CardFrontFace
                  portfolio={portfolio}
                  photoSrc={PROFILE_PHOTO_PATH}
                  showPhoto={showPhoto}
                  photoCrossOrigin
                />
              </div>
            </div>

            <div className="builder-card-export__card-wrap builder-card-export__card-wrap--back">
              <div className="builder-card-export__card-shell">
                <CardBackFace portfolio={portfolio} backFaceTabIndex={-1} backFaceAriaHidden />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default BuilderCardExport;
