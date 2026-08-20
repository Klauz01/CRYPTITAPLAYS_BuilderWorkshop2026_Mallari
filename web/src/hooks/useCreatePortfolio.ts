import { useMemo, useState } from 'react'
import { useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react'
import { Transaction } from '@mysten/sui/transactions'
import type { SuiNetwork } from '../config'
import type { CreatePortfolioInput, CreatePortfolioState } from '../types'

interface ObjectChangeLike {
  objectId?: string
  idOperation?: string
}

function isWalletRejection(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()
  return (
    message.includes('reject') ||
    message.includes('denied') ||
    message.includes('cancel') ||
    message.includes('user closed')
  )
}

function getCreatedPortfolioId(changes: unknown) {
  if (!Array.isArray(changes)) {
    return null
  }

  const createdObject = changes.find((change) => {
    if (!change || typeof change !== 'object') {
      return false
    }

    const typedChange = change as ObjectChangeLike
    return typedChange.idOperation === 'Created'
  }) as ObjectChangeLike | undefined

  return createdObject?.objectId ?? null
}

export function useCreatePortfolio(packageId: string, network: SuiNetwork) {
  const account = useCurrentAccount()
  const dAppKit = useDAppKit()
  const [state, setState] = useState<CreatePortfolioState>({
    digest: null,
    objectId: null,
    isSubmitting: false,
    error: null,
    outcome: 'idle',
  })

  const canSubmit = useMemo(() => Boolean(account?.address && packageId), [account?.address, packageId])

  async function createPortfolio(input: CreatePortfolioInput) {
    if (!account?.address) {
      setState({
        digest: null,
        objectId: null,
        isSubmitting: false,
        error: 'Connect a Sui wallet before creating your portfolio.',
        outcome: 'failed',
      })
      return
    }

    if (!packageId) {
      setState({
        digest: null,
        objectId: null,
        isSubmitting: false,
        error: 'Set VITE_PACKAGE_ID before submitting the create transaction.',
        outcome: 'failed',
      })
      return
    }

    setState((current) => ({
      ...current,
      isSubmitting: true,
      error: null,
      outcome: 'idle',
    }))

    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${packageId}::portfolio::create_portfolio`,
        arguments: [
          tx.pure.string(input.name),
          tx.pure.string(input.course),
          tx.pure.string(input.school),
          tx.pure.string(input.about),
          tx.pure.string(input.linkedin),
          tx.pure.string(input.github),
          tx.pure.string(input.skills),
        ],
      })

      const result = await dAppKit.signAndExecuteTransaction({
        transaction: tx,
        network,
      })

      if (result.FailedTransaction) {
        throw new Error(result.FailedTransaction.status.error?.message ?? 'Transaction execution failed.')
      }

      const digest = result.Transaction.digest
      const effects = result.Transaction.effects as { changedObjects?: unknown } | null
      const objectId = getCreatedPortfolioId(effects?.changedObjects)

      setState({
        digest,
        objectId,
        isSubmitting: false,
        error: null,
        outcome: 'success',
      })
    } catch (error) {
      setState({
        digest: null,
        objectId: null,
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : 'The transaction did not complete. Please try again.',
        outcome: isWalletRejection(error) ? 'rejected' : 'failed',
      })
    }
  }

  return {
    canSubmit,
    state,
    createPortfolio,
  }
}
