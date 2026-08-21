export type SuiNetwork = 'mainnet' | 'testnet' | 'devnet';

const rawObjectId =
  (import.meta.env.VITE_PORTFOLIO_OBJECT_ID ?? '').trim();

const rawNetwork =
  (import.meta.env.VITE_SUI_NETWORK ?? 'testnet')
    .trim()
    .toLowerCase();

function normalizeNetwork(value: string): SuiNetwork {
  if (value === 'mainnet') return 'mainnet';
  if (value === 'devnet') return 'devnet';
  return 'testnet';
}

export const network = normalizeNetwork(rawNetwork);

export const networkLabel =
  network === 'mainnet'
    ? 'Sui Mainnet'
    : network === 'testnet'
      ? 'Sui Testnet'
      : 'Sui Devnet';

export const objectId = rawObjectId;

const graphqlUrls: Record<SuiNetwork, string> = {
  mainnet: 'https://graphql.mainnet.sui.io/graphql',
  testnet: 'https://graphql.testnet.sui.io/graphql',
  devnet: 'https://graphql.devnet.sui.io/graphql',
};

export const graphqlUrl = graphqlUrls[network];

export function suiscanObjectUrl(id: string): string {
  return `https://suiscan.xyz/${network}/object/${id}/fields`;
}