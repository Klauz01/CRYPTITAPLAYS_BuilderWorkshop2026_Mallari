import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

const rawObjectId = (import.meta.env.VITE_PORTFOLIO_OBJECT_ID ?? '').trim();
const rawNetwork = (import.meta.env.VITE_SUI_NETWORK ?? 'mainnet').trim();

function normalizeNetworkLabel(value: string): string {
  const lower = value.toLowerCase();
  if (lower === 'mainnet' || lower === 'sui mainnet') {
    return 'Sui Mainnet';
  }
  return value || 'Sui Mainnet';
}

export const objectId = rawObjectId;
export const networkLabel = normalizeNetworkLabel(rawNetwork);
export const rpcUrl = getJsonRpcFullnodeUrl('mainnet');

export function suiscanObjectUrl(id: string): string {
  return `https://suiscan.xyz/mainnet/object/${id}/fields`;
}
