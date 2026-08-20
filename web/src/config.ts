const rawNetwork = (import.meta.env.VITE_SUI_NETWORK ?? 'mainnet').trim().toLowerCase()

export type SuiNetwork = 'mainnet' | 'testnet' | 'devnet'

function resolveNetwork(network: string): SuiNetwork {
  if (network === 'testnet' || network === 'devnet') {
    return network
  }

  return 'mainnet'
}

export const suiNetwork = resolveNetwork(rawNetwork)
export const packageId = (import.meta.env.VITE_PACKAGE_ID ?? '').trim()
export const portfolioObjectId = (import.meta.env.VITE_PORTFOLIO_OBJECT_ID ?? '').trim()

export const hasPackageId = packageId.length > 0
export const hasPortfolioObjectId = portfolioObjectId.length > 0

export function getObjectExplorerUrl(network: SuiNetwork, objectId: string) {
  return `https://suiscan.xyz/${network}/object/${objectId}/fields`
}

export function getTransactionExplorerUrl(network: SuiNetwork, digest: string) {
  return `https://suiscan.xyz/${network}/tx/${digest}`
}

export function truncateMiddle(value: string, visible = 6) {
  if (value.length <= visible * 2 + 3) {
    return value
  }

  return `${value.slice(0, visible)}...${value.slice(-visible)}`
}
