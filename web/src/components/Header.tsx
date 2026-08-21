export default function Header() {
  return (
    <header className="site-header">
      <a
        className="site-header__link"
        href="https://www.facebook.com/cryptitaplays"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cryptita Plays on Facebook"
      >
        <img
          className="site-header__logo"
          src="/assets/cryptita-long.svg"
          alt="Cryptita Plays"
        />
      </a>
    </header>
  );
}
