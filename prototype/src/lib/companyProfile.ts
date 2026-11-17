import type { CompanyProfile } from '../types';

export const COMPANY_INDUSTRIES = [
  'Enterprise software',
  'Fintech and payments',
  'Cybersecurity',
  'Cloud infrastructure',
  'Data and analytics',
  'Semiconductors',
  'Digital health',
  'E-commerce and marketplaces',
  'Industrial and manufacturing',
  'Consumer',
];

export const COMPANY_OWNERSHIP = [
  'Public',
  'Pre-IPO',
  'Venture-backed',
  'Private equity-backed',
  'Founder-led',
  'Family or private',
  'Subsidiary of a larger company',
];

export const REVENUE_BANDS = [
  'Under $20M',
  '$20M–$100M',
  '$100M–$500M',
  '$500M–$1B',
  '$1B–$10B',
  '$10B+',
];

export const HEADCOUNT_BANDS = [
  'Under 200',
  '200–1,000',
  '1,000–5,000',
  '5,000–20,000',
  '20,000+',
];

export const COMPANY_HEADQUARTERS = [
  'United States',
  'San Francisco Bay Area',
  'New York',
  'Seattle',
  'Boston',
  'Austin',
  'Washington DC',
  'Chicago',
  'London',
  'Remote-first',
];

export const GROWTH_POSTURES = [
  'High growth',
  'Profitable and scaling',
  'Preparing for a public offering',
  'Private equity value creation',
  'Turnaround or transformation',
  'Mature and steady',
];

export const EMPTY_COMPANY_PROFILE: CompanyProfile = {
  industries: [],
  ownership: [],
  revenueBand: '',
  headcountBand: '',
  headquarters: [],
  businessModel: '',
  growthPosture: '',
  characteristics: '',
  exclusions: '',
};

/** Tags that describe the companies to source from, not the job being filled. */
export function companyMatchTags(profile?: CompanyProfile | null): string[] {
  if (!profile) return [];
  return [
    ...profile.industries,
    ...profile.ownership,
    profile.revenueBand,
    profile.headcountBand,
    ...profile.headquarters,
    profile.businessModel,
    profile.growthPosture,
  ].map(tag => tag.trim()).filter(Boolean);
}
