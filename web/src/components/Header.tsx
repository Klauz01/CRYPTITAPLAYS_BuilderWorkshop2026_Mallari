import { WalletBar } from './WalletBar'

export function Header() {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Cryptita Plays</p>
        <h2>Smart Contract to Website: Build &amp; Deploy</h2>
      </div>
      <WalletBar />
    </header>
  )
}
