import { siFacebook, siInstagram, siLinkedin, siX } from '../lib/brandIcons';
import BrandIcon from './BrandIcon';

function CameraIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

type SocialActionsProps = {
  onCameraClick?: () => void;
  isGenerating?: boolean;
};

export default function SocialActions({ onCameraClick, isGenerating = false }: SocialActionsProps) {
  return (
    <div className="social-actions">
      <button
        type="button"
        className={`social-actions__link social-actions__camera${isGenerating ? ' is-generating' : ''}`}
        aria-label={isGenerating ? 'Generating builder card photo' : 'Download builder card photo'}
        aria-busy={isGenerating}
        disabled={isGenerating || !onCameraClick}
        onClick={onCameraClick}
      >
        <CameraIcon />
        <span className="social-actions__label">Camera</span>
      </button>
      <a
        className="social-actions__link"
        href="https://www.facebook.com/cryptitaplays"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cryptita Plays on Facebook"
      >
        <BrandIcon icon={siFacebook} size={18} decorative />
        <span className="social-actions__label">Facebook</span>
      </a>
      <a
        className="social-actions__link"
        href="https://x.com/cryptitaplays"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cryptita Plays on X"
      >
        <BrandIcon icon={siX} size={18} decorative />
        <span className="social-actions__label">X</span>
      </a>
      <a
        className="social-actions__link"
        href="https://www.linkedin.com/company/cryptitaplays/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cryptita Plays on LinkedIn"
      >
        <BrandIcon icon={siLinkedin} size={18} decorative />
        <span className="social-actions__label">LinkedIn</span>
      </a>
      <a
        className="social-actions__link"
        href="https://www.instagram.com/cryptitaplays/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cryptita Plays on Instagram"
      >
        <BrandIcon icon={siInstagram} size={18} decorative />
        <span className="social-actions__label">Instagram</span>
      </a>
    </div>
  );
}
