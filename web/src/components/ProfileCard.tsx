import { useCallback, useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { UsePortfolioResult } from '../types';
import { CardBackFace, CardFrontFace } from './ProfileCardFaces';
import '../styles/profile-card.css';

type ProfileCardProps = {
  portfolio: UsePortfolioResult;
};

export default function ProfileCard({ portfolio }: ProfileCardProps) {
  const { status, data } = portfolio;
  const [isFlipped, setIsFlipped] = useState(false);
  const [photoBroken, setPhotoBroken] = useState(false);
  const [copiedField, setCopiedField] = useState<'objectId' | 'owner' | null>(null);

  const photoUrl = data?.fields.photo_url ?? '';
  const showPhoto = Boolean(photoUrl) && !photoBroken && status === 'success';

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) {
      return;
    }
    setIsFlipped((current) => !current);
  };

  const handleFlipKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsFlipped((current) => !current);
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--mx', `${x}%`);
    event.currentTarget.style.setProperty('--my', `${y}%`);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--mx', '50%');
    event.currentTarget.style.setProperty('--my', '50%');
  };

  const handleCopy = useCallback(async (field: 'objectId' | 'owner', value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 900);
    } catch (copyError) {
      console.error('Clipboard unavailable:', copyError);
    }
  }, []);

  const backFaceTabIndex = isFlipped ? 0 : -1;

  return (
    <div className="card-scale__inner">
      <div
        className={`profile-card${isFlipped ? ' is-flipped' : ''}`}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="group"
        aria-label="Builder profile card"
      >
        <button
          type="button"
          className="flip-btn"
          onClick={(event) => {
            event.stopPropagation();
            setIsFlipped((current) => !current);
          }}
          onKeyDown={handleFlipKeyDown}
          aria-pressed={isFlipped}
          aria-label={isFlipped ? 'Show front of card' : 'Show back of card'}
        >
          <span className="flip-icon" aria-hidden="true">
            ↻
          </span>
          Flip
        </button>

        <CardFrontFace
          portfolio={portfolio}
          showPhoto={showPhoto}
          onPhotoError={() => setPhotoBroken(true)}
          copiedField={copiedField}
          onCopy={handleCopy}
        />

        <CardBackFace
          portfolio={portfolio}
          backFaceTabIndex={backFaceTabIndex}
          backFaceAriaHidden={!isFlipped}
        />
      </div>
    </div>
  );
}
