import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { rpcUrl } from '../config';

export const suiClient = new SuiJsonRpcClient({
  url: rpcUrl,
  network: 'mainnet',
});
