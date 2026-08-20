import { useCurrentAccount, useCurrentNetwork, useDAppKit } from '@mysten/dapp-kit-react'
import { ConnectButton } from '@mysten/dapp-kit-react/ui'
import { suiNetwork, truncateMiddle } from '../config'

export function WalletBar() {
  const account = useCurrentAccount()
  const currentNetwork = useCurrentNetwork()
  const dAppKit = useDAppKit()

  return (
    <div className="wallet-bar">
      {account ? (
        <>
          <div className="wallet-details">
            <span className="wallet-pill">Connected</span>
            <span className="wallet-address">{truncateMiddle(account.address)}</span>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              void dAppKit.disconnectWallet()
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <ConnectButton />
      )}
      {account && currentNetwork !== suiNetwork ? (
        <p className="network-warning">Switch your wallet to the configured network before submitting a portfolio.</p>
      ) : null}
    </div>
  )
}
