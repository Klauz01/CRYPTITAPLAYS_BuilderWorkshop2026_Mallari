import { siFacebook, siLinkedin } from '../lib/brandIcons';
import BrandIcon from './BrandIcon';

function CameraIcon() {
  return (
    <svg
      width={20}
      height={20}
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

export default function SocialActions() {
  return (
    <div className="social-actions">
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
      <button
        type="button"
        className="social-actions__camera"
        aria-label="Camera (coming soon)"
      >
        <CameraIcon />
      </button>
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
    </div>
  );
}
