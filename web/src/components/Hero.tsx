import { useState } from 'react'
import type { PortfolioFields } from '../types'

interface HeroProps {
  portfolio: PortfolioFields | null
  loading: boolean
  error: string | null
}

function placeholderName(portfolio: PortfolioFields | null) {
  return portfolio?.name || 'Your name will appear here after the object loads.'
}

export function Hero({ portfolio, loading, error }: HeroProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const name = placeholderName(portfolio)

  return (
    <section className="panel hero-section">
      <div className="hero-media">
        {imageFailed ? (
          <div className="avatar-fallback" aria-hidden="true">
            {portfolio?.name?.slice(0, 1).toUpperCase() || 'CP'}
          </div>
        ) : (
          <img
            className="profile-image"
            src="/profile.png"
            alt={portfolio?.name || 'Workshop participant profile'}
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      <div className="hero-copy">
        <p className="eyebrow">On-chain identity</p>
        <h1>{name}</h1>
        <p className="hero-subtitle">
          {portfolio?.course || 'Course'}{portfolio?.course && portfolio?.school ? ' · ' : ''}
          {portfolio?.school || 'School'}
        </p>
        <p className="hero-status">
          {loading
            ? 'Loading portfolio details from the configured Sui network...'
            : error
              ? error
              : 'The profile below is sourced from a Sui object you own.'}
        </p>
        <div className="hero-links">
          {portfolio?.linkedin ? (
            <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          ) : (
            <span className="muted-link">LinkedIn pending</span>
          )}
          {portfolio?.github ? (
            <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          ) : (
            <span className="muted-link">GitHub pending</span>
          )}
        </div>
      </div>
    </section>
  )
}
