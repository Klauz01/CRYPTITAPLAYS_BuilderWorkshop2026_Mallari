import type { SuiNetwork } from './config'

export interface PortfolioFields {
  name: string
  course: string
  school: string
  about: string
  linkedin: string
  github: string
  skills: string[]
}

export interface CreatePortfolioInput {
  name: string
  course: string
  school: string
  about: string
  linkedin: string
  github: string
  skills: string
}

export interface PortfolioQueryState {
  data: PortfolioFields | null
  loading: boolean
  error: string | null
}

export interface CreatePortfolioState {
  digest: string | null
  objectId: string | null
  isSubmitting: boolean
  error: string | null
  outcome: 'idle' | 'success' | 'rejected' | 'failed'
}

export interface ProofProps {
  objectId: string
  digest: string | null
  network: SuiNetwork
  loadError?: string | null
}
