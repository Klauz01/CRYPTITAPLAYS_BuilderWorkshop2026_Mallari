import { useMemo, useState } from 'react'
import { useCurrentAccount, useCurrentNetwork } from '@mysten/dapp-kit-react'
import type { CreatePortfolioInput, CreatePortfolioState } from '../types'
import { getTransactionExplorerUrl, truncateMiddle, type SuiNetwork } from '../config'

interface CreateFormProps {
  packageId: string
  network: SuiNetwork
  state: CreatePortfolioState
  onSubmit: (input: CreatePortfolioInput) => Promise<void>
}

const initialValues: CreatePortfolioInput = {
  name: '',
  course: '',
  school: '',
  about: '',
  linkedin: '',
  github: '',
  skills: '',
}

export function CreateForm({ packageId, network, state, onSubmit }: CreateFormProps) {
  const account = useCurrentAccount()
  const currentNetwork = useCurrentNetwork()
  const [values, setValues] = useState<CreatePortfolioInput>(initialValues)

  const helperText = useMemo(() => {
    if (!account) {
      return 'Connect a wallet to enable the create transaction.'
    }

    if (!packageId) {
      return 'Set VITE_PACKAGE_ID before using the create form.'
    }

    if (currentNetwork !== network) {
      return `Switch the connected wallet to ${network} before submitting.`
    }

    return 'Submit the form to call portfolio::create_portfolio from your wallet.'
  }, [account, currentNetwork, network, packageId])

  const disabled = !account || !packageId || state.isSubmitting || currentNetwork !== network

  return (
    <section className="panel">
      <p className="eyebrow">Interact</p>
      <h2>Create your portfolio object</h2>
      <p>{helperText}</p>
      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(values)
        }}
      >
        <label>
          Name
          <input
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            placeholder="Ada Builder"
          />
        </label>
        <label>
          Course
          <input
            value={values.course}
            onChange={(event) => setValues((current) => ({ ...current, course: event.target.value }))}
            placeholder="Web3 Foundations"
          />
        </label>
        <label>
          School
          <input
            value={values.school}
            onChange={(event) => setValues((current) => ({ ...current, school: event.target.value }))}
            placeholder="Cryptita Plays Academy"
          />
        </label>
        <label className="full-width">
          About
          <textarea
            rows={4}
            value={values.about}
            onChange={(event) => setValues((current) => ({ ...current, about: event.target.value }))}
            placeholder="Share what you are building and what you want to learn next."
          />
        </label>
        <label>
          LinkedIn URL
          <input
            value={values.linkedin}
            onChange={(event) => setValues((current) => ({ ...current, linkedin: event.target.value }))}
            placeholder="https://www.linkedin.com/in/your-name"
          />
        </label>
        <label>
          GitHub URL
          <input
            value={values.github}
            onChange={(event) => setValues((current) => ({ ...current, github: event.target.value }))}
            placeholder="https://github.com/your-name"
          />
        </label>
        <label className="full-width">
          Skills
          <input
            value={values.skills}
            onChange={(event) => setValues((current) => ({ ...current, skills: event.target.value }))}
            placeholder="Move, Sui, React"
          />
        </label>
        <button type="submit" className="primary-button full-width" disabled={disabled}>
          {state.isSubmitting ? 'Submitting...' : 'Create portfolio on the configured network'}
        </button>
      </form>
      {state.outcome === 'success' && state.digest ? (
        <div className="status-panel success">
          <p>Transaction submitted successfully.</p>
          <a href={getTransactionExplorerUrl(network, state.digest)} target="_blank" rel="noopener noreferrer">
            View digest {truncateMiddle(state.digest)}
          </a>
          <p>{state.objectId ? `Created object: ${state.objectId}` : 'Add the new object ID to your env after confirming it in the explorer.'}</p>
        </div>
      ) : null}
      {state.error ? (
        <div className={`status-panel ${state.outcome === 'rejected' ? 'warning' : 'error'}`}>
          <p>{state.outcome === 'rejected' ? 'Wallet request cancelled.' : 'Transaction failed.'}</p>
          <p>{state.error}</p>
        </div>
      ) : null}
    </section>
  )
}
