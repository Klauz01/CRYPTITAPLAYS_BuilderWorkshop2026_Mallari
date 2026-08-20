import { useQuery } from '@tanstack/react-query'
import { useDAppKit } from '@mysten/dapp-kit-react'
import type { SuiNetwork } from '../config'
import type { PortfolioFields, PortfolioQueryState } from '../types'

function normalizeField(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function mapPortfolioFields(rawFields: Record<string, unknown>): PortfolioFields {
  return {
    name: normalizeField(rawFields.name),
    course: normalizeField(rawFields.course),
    school: normalizeField(rawFields.school),
    about: normalizeField(rawFields.about),
    linkedin: normalizeField(rawFields.linkedin_url),
    github: normalizeField(rawFields.github_url),
    skills: normalizeField(rawFields.skills)
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean),
  }
}

export function usePortfolio(objectId: string, network: SuiNetwork): PortfolioQueryState {
  const dAppKit = useDAppKit()
  const query = useQuery({
    queryKey: ['portfolio', network, objectId],
    enabled: objectId.length > 0,
    queryFn: async () => {
      const client = dAppKit.getClient(network)
      const { object } = await client.core.getObject({
        objectId,
        include: {
          json: true,
          previousTransaction: true,
        },
      })

      if (!object?.json || typeof object.json !== 'object' || Array.isArray(object.json)) {
        throw new Error('This object does not expose readable portfolio fields.')
      }

      return mapPortfolioFields(object.json as Record<string, unknown>)
    },
  })

  if (!objectId) {
    return {
      data: null,
      loading: false,
      error: null,
    }
  }

  return {
    data: query.data ?? null,
    loading: query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
  }
}
