import { useCallback, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { suiscanObjectUrl } from '../config';
import type { UsePortfolioResult } from '../types';
import '../styles/profile-card.css';

type ProfileCardProps = {
  portfolio: UsePortfolioResult;
};

function truncateValue(value: string): string {
  if (!value) return '—';
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function displayOrPlaceholder(value: string | undefined, placeholder: string): string {
  return value?.trim() ? value : placeholder;
}

export default function ProfileCard({ portfolio }: ProfileCardProps) {
  const { status, data, error } = portfolio;
  const [isFlipped, setIsFlipped] = useState(false);
  const [photoBroken, setPhotoBroken] = useState(false);
  const [copiedField, setCopiedField] = useState<'objectId' | 'owner' | null>(null);

  const fields = data?.fields;
  const builderName = fields?.builder_name ?? '';
  const builderNo = fields?.builder_no ?? '';
  const photoUrl = fields?.photo_url ?? '';
  const showPhoto = Boolean(photoUrl) && !photoBroken && status === 'success';
  const objectId = data?.objectId ?? '';
  const owner = data?.owner ?? '';
  const network = data?.networkLabel ?? '—';
  const issued = fields?.issued ?? '—';

  const placeholderName =
    status === 'loading'
      ? 'Loading on-chain profile…'
      : 'Your builder name will appear here after the object loads.';
  const placeholderField = status === 'loading' ? '…' : '—';
  const credentialUnavailable =
    status === 'empty' ? 'Not configured' : status === 'error' ? 'Unavailable' : '—';

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

        <div className="card-side card-front">
          <div className="material-noise" />
          <div className="material-light" />

          <div className="cryptita-deboss" aria-hidden="true">
            <div className="deboss-shadow" />
            <div className="deboss-highlight" />
            <div className="deboss-face" />
          </div>

          <div className="card-top">
            <div className="brand">
              <h2>CRYPTITA PLAYS</h2>
              <p>BUILDER WORKSHOP 2026</p>
            </div>
            <div className="builder-number">
              <span className="builder-number-label">BUILDER NO.</span>
              <div className="builder-number-value">
                <strong>{displayOrPlaceholder(builderNo, placeholderField)}</strong>
              </div>
            </div>
          </div>

          <div className="card-main">
            <div className="profile-photo-wrap">
              {showPhoto ? (
                <img
                  src={photoUrl}
                  alt={builderName || 'Builder profile photo'}
                  className="profile-photo"
                  onError={() => setPhotoBroken(true)}
                />
              ) : (
                <div className="profile-photo profile-photo--placeholder" aria-hidden="true" />
              )}
            </div>

            <div className="profile-details">
              {status === 'error' && (
                <p className="card-status card-status--error" role="alert">
                  {error}
                </p>
              )}

              <div className="identity-header">
                <span className="field-label">BUILDER</span>
                <h1>{displayOrPlaceholder(builderName, placeholderName)}</h1>
              </div>

              <div className="info-grid">
                <div className="info-field">
                  <span className="field-label">PROFESSION</span>
                  <span className="field-value">
                    {displayOrPlaceholder(fields?.profession, placeholderField)}
                  </span>
                </div>
                <div className="info-field">
                  <span className="field-label">PROGRAM</span>
                  <span className="field-value">
                    {displayOrPlaceholder(fields?.program, placeholderField)}
                  </span>
                </div>
                <div className="info-field">
                  <span className="field-label">COUNTRY</span>
                  <span className="field-value">
                    {displayOrPlaceholder(fields?.country, placeholderField)}
                  </span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-field">
                  <span className="field-label">SPECIALIZATION</span>
                  <span className="field-value">
                    {displayOrPlaceholder(fields?.specialization, placeholderField)}
                  </span>
                </div>
                <div className="info-field">
                  <span className="field-label">BUILDING SINCE</span>
                  <span className="field-value">
                    {displayOrPlaceholder(fields?.building_since, placeholderField)}
                  </span>
                </div>
                <div className="info-field">
                  <span className="field-label">FOCUS</span>
                  <span className="field-value">
                    {displayOrPlaceholder(fields?.focus, placeholderField)}
                  </span>
                </div>
              </div>

              <div className="wide-field">
                <span className="field-label">COMMUNITY</span>
                <span className="field-value">
                  {displayOrPlaceholder(fields?.community, placeholderField)}
                </span>
              </div>

              <div className="wide-field skills-field">
                <span className="field-label">SKILLS</span>
                <div className="skills">
                  {status === 'success' && data?.skills.length ? (
                    data.skills.map((skill) => <span key={skill}>{skill}</span>)
                  ) : (
                    <span className="skills__placeholder">{placeholderField}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card-bottom">
            <div className="credential-field">
              <span className="field-label">ISSUED</span>
              <span className="credential-value">
                {status === 'success' ? issued : credentialUnavailable}
              </span>
            </div>
            <div className="divider" />
            <div className="credential-field">
              <span className="field-label">NETWORK</span>
              <span className="credential-value">
                {status === 'success' ? network : credentialUnavailable}
              </span>
            </div>
            <div className="divider" />
            <div className="credential-field">
              <span className="field-label">OBJECT ID</span>
              <div className="value-row">
                {status === 'success' && objectId ? (
                  <a
                    className="value-row__link"
                    href={suiscanObjectUrl(objectId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {truncateValue(objectId)}
                  </a>
                ) : (
                  <span>{credentialUnavailable}</span>
                )}
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Copy object ID"
                  disabled={!objectId}
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleCopy('objectId', objectId);
                  }}
                >
                  {copiedField === 'objectId' ? '✓' : '⧉'}
                </button>
              </div>
            </div>
            <div className="divider" />
            <div className="credential-field">
              <span className="field-label">OWNER</span>
              <div className="value-row">
                <span>{status === 'success' && owner ? truncateValue(owner) : credentialUnavailable}</span>
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Copy owner address"
                  disabled={!owner}
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleCopy('owner', owner);
                  }}
                >
                  {copiedField === 'owner' ? '✓' : '⧉'}
                </button>
              </div>
            </div>
            <div className="divider" />
            <a
              className="sui-link-box"
              href="https://www.sui.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Sui"
            >
              <img src="/assets/sui-logo.svg" alt="Sui" className="sui-logo" />
            </a>
          </div>
        </div>

        <div className="card-side card-back" aria-hidden={!isFlipped}>
          <div className="material-noise" />
          <div className="material-light" />

          <div className="back-logo" aria-hidden="true">
            <div className="back-logo-shadow" />
            <div className="back-logo-highlight" />
            <div className="back-logo-face" />
          </div>

          <div className="back-content">
            <div className="back-brand">
              <h2>CRYPTITA PLAYS</h2>
              <p>BUILDER WORKSHOP 2026</p>
            </div>

            <div className="back-divider" />

            <div className="back-built-on">
              <span>Built on</span>
              <a
                href="https://www.sui.io/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Sui"
                tabIndex={backFaceTabIndex}
              >
                <img src="/assets/sui-logo.svg" alt="Sui" />
                <span>Sui</span>
              </a>
            </div>

            <div className="back-divider" />

            <div className="back-community">
              <div className="community-title">Community Partners:</div>
              <div className="community-logos">
                <a
                  className="community-partner"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DEVCON Philippines"
                  tabIndex={backFaceTabIndex}
                >
                  <img src="/assets/devcon-laguna.svg" alt="DEVCON Philippines" />
                </a>
                <div className="community-logo-divider" />
                <a
                  className="community-partner"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AWS UPHSL"
                  tabIndex={backFaceTabIndex}
                >
                  <img src="/assets/aws-uphsl.svg" alt="AWS UPHSL" />
                </a>
                <div className="community-logo-divider" />
                <a
                  className="community-partner"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="grantix"
                  tabIndex={backFaceTabIndex}
                >
                  <img src="/assets/grantix.svg" alt="grantix" />
                </a>
                <div className="community-logo-divider" />
                <a
                  className="community-partner"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kamiyon Studio"
                  tabIndex={backFaceTabIndex}
                >
                  <img src="/assets/kamiyon.svg" alt="Kamiyon Studio" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
