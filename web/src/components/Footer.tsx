import { forwardRef } from 'react';

const PROOF_COPY =
  'This page displays information stored immutably on Sui Mainnet by the workshop participant. Cryptita Plays provides the learning environment and tooling; on-chain content is supplied by the builder at creation time via CLI. By participating, you consent to your submitted profile fields and photo URL being publicly readable on-chain and rendered on this site.';

const Footer = forwardRef<HTMLElement>(function Footer(_props, ref) {
  return (
    <footer ref={ref} className="site-footer">
      <div className="site-footer__disclaimer">
        <h2 className="site-footer__kicker">Proof of Learning &amp; Building</h2>
        <p className="site-footer__copy">{PROOF_COPY}</p>
      </div>
    </footer>
  );
});

export default Footer;
