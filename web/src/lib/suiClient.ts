import { SuiGraphQLClient } from '@mysten/sui/graphql';

import { graphqlUrl, network } from '../config';

export const suiClient = new SuiGraphQLClient({
  url: graphqlUrl,
  network,
});