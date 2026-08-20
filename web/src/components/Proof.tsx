import { getObjectExplorerUrl, getTransactionExplorerUrl, truncateMiddle } from '../config'
import type { ProofProps } from '../types'

export function Proof({ objectId, digest, network, loadError }: ProofProps) {
  return (
    <section className="panel proof-panel">
      <p className="eyebrow">Proof</p>
      <h2>Verify what happened on chain</h2>
      <p>
        This app is configured for <strong>{network}</strong>. Use the links below to inspect the object
        fields and latest transaction in Suiscan.
      </p>
      <div className="proof-grid">
        <article className="proof-card">
          <h3>Portfolio object</h3>
          {objectId ? (
            <>
              <p>{truncateMiddle(objectId)}</p>
              <a href={getObjectExplorerUrl(network, objectId)} target="_blank" rel="noopener noreferrer">
                Open object fields
              </a>
            </>
          ) : (
            <p>{loadError || 'Set VITE_PORTFOLIO_OBJECT_ID or create a portfolio from the form to see proof links.'}</p>
          )}
        </article>
        <article className="proof-card">
          <h3>Latest digest</h3>
          {digest ? (
            <>
              <p>{truncateMiddle(digest)}</p>
              <a href={getTransactionExplorerUrl(network, digest)} target="_blank" rel="noopener noreferrer">
                Open transaction
              </a>
            </>
          ) : (
            <p>Submit the create form to capture a transaction digest here.</p>
          )}
        </article>
      </div>
    </section>
  )
}
