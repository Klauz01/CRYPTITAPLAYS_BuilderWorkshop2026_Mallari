import { useEffect, useState } from 'react';
import { networkLabel, objectId } from '../config';
import { mapBuilderCard } from '../lib/mapBuilderCard';
import { suiClient } from '../lib/suiClient';
import type { BuilderCardView, PortfolioStatus, UsePortfolioResult } from '../types';

const BUILDER_CARD_TYPE_SUFFIX = '::builder_card::BuilderCard';

export function usePortfolio(): UsePortfolioResult {
  const [status, setStatus] = useState<PortfolioStatus>(() =>
    objectId ? 'loading' : 'empty',
  );
  const [data, setData] = useState<BuilderCardView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!objectId) {
      setStatus('empty');
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadPortfolio() {
      setStatus('loading');
      setData(null);
      setError(null);

      try {
        const response = await suiClient.getObject({
          id: objectId,
          options: { showContent: true, showOwner: true },
        });

        if (cancelled) return;

        const objectData = response.data;
        if (!objectData) {
          throw new Error('Object not found.');
        }

        const content = objectData.content;
        if (!content || content.dataType !== 'moveObject') {
          throw new Error('Object content is not a Move object.');
        }

        if (!content.type.endsWith(BUILDER_CARD_TYPE_SUFFIX)) {
          throw new Error(`Unexpected object type: ${content.type}`);
        }

        const fields = content.fields as Record<string, unknown>;
        const view = mapBuilderCard(
          fields,
          objectData.objectId,
          objectData.owner,
          networkLabel,
        );

        setData(view);
        setStatus('success');
      } catch (fetchError) {
        if (cancelled) return;
        console.error('Failed to load BuilderCard:', fetchError);
        setStatus('error');
        setError('Could not load on-chain data.');
      }
    }

    void loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, []);

  return { status, data, error };
}
