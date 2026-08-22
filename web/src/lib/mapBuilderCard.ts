import type { BuilderCardFields, BuilderCardView } from '../types';

function toString(value: unknown): string {
  if (value == null) return '';
  return String(value);
}

function parseSkills(raw: string): string[] {
  return raw
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function normalizeOwner(owner: unknown): string {
  if (owner == null) return '';
  if (typeof owner === 'string') return owner;
  if (typeof owner === 'object') {
    const record = owner as Record<string, unknown>;
    if (typeof record.AddressOwner === 'string') {
      return record.AddressOwner;
    }
    if (typeof record.ObjectOwner === 'string') {
      return record.ObjectOwner;
    }
    if (typeof record.Shared === 'object' && record.Shared !== null) {
      return 'Shared';
    }
    if (record.Immutable === true) {
      return 'Immutable';
    }
  }
  try {
    return JSON.stringify(owner);
  } catch {
    return '';
  }
}

export function mapBuilderCard(
  fields: Record<string, unknown>,
  objectId: string,
  owner: unknown,
  networkLabel: string,
): BuilderCardView {
  const builderFields: BuilderCardFields = {
    builder_name: toString(fields.builder_name),
    builder_no: toString(fields.builder_no),
    profession: toString(fields.profession),
    program: toString(fields.program),
    country: toString(fields.country),
    specialization: toString(fields.specialization),
    building_since: toString(fields.building_since),
    focus: toString(fields.focus),
    community: toString(fields.community),
    skills: toString(fields.skills),
    issued: toString(fields.issued),
    about: toString(fields.about),
    website_url: toString(fields.website_url),
    photo_url: toString(fields.photo_url),
  };

  return {
    fields: builderFields,
    skills: parseSkills(builderFields.skills),
    objectId,
    owner: normalizeOwner(owner),
    networkLabel,
  };
}
