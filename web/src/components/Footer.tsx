export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__socials">
        <a
          className="site-footer__social"
          href="https://www.facebook.com/cryptitaplays"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a
          className="site-footer__social"
          href="https://www.linkedin.com/company/cryptitaplays/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
      <div className="site-footer__proof">
        <h2 className="site-footer__proof-title">Proof of Learning &amp; Building</h2>
        <p className="site-footer__proof-copy">
          This page displays information stored immutably on Sui Mainnet by the workshop
          participant. Cryptita Plays provides the learning environment and tooling; on-chain
          content is supplied by the builder at creation time via CLI. By participating, you
          consent to your submitted profile fields and photo URL being publicly readable on-chain
          and rendered on this site.
        </p>
      </div>
    </footer>
  );
}
