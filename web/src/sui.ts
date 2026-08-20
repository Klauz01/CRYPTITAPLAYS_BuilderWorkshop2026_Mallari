import { createDAppKit } from '@mysten/dapp-kit-react'
import { SuiGrpcClient } from '@mysten/sui/grpc'

const supportedNetworks = ['devnet', 'testnet', 'mainnet']
const networkUrls: Record<string, string> = {
  devnet: 'https://fullnode.devnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  mainnet: 'https://fullnode.mainnet.sui.io:443',
}

export const dAppKit = createDAppKit({
  networks: supportedNetworks,
  defaultNetwork: 'mainnet',
  createClient: (network) =>
    new SuiGrpcClient({
      network,
      baseUrl: networkUrls[network],
    }),
})

declare module '@mysten/dapp-kit-react' {
  interface Register {
    dAppKit: typeof dAppKit
  }
}
