/** Raw on-chain string fields from content.fields */
export type BuilderCardFields = {
  builder_name: string;
  builder_no: string;
  profession: string;
  program: string;
  country: string;
  specialization: string;
  building_since: string;
  focus: string;
  community: string;
  skills: string;
  issued: string;
  about: string;
  photo_url: string;
};

/** View model for ProfileCard */
export type BuilderCardView = {
  fields: BuilderCardFields;
  skills: string[];
  objectId: string;
  owner: string;
  networkLabel: string;
};

export type PortfolioStatus = 'idle' | 'loading' | 'empty' | 'success' | 'error';

export type UsePortfolioResult = {
  status: PortfolioStatus;
  data: BuilderCardView | null;
  error: string | null;
};
