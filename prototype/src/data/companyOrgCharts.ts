import { getCompanyOrgChart, MappedCompany, OrgNodeData } from './projectMarketMapData';

/** One box in a company's leadership org chart. */
export interface OrgChartNode {
  name: string;
  title: string;
  level: string;
  /** A candidate already mapped in this search */
  mapped?: boolean;
  children?: OrgChartNode[];
}

const NVIDIA_CHART: OrgChartNode = {
  name: 'Jensen Huang',
  title: 'Chief Executive Officer',
  level: 'C-Suite',
  children: [
    {
      name: 'Colette Kress',
      title: 'Chief Financial Officer',
      level: 'C-Suite',
      children: [
        { name: 'Michael Johnson', title: 'SVP, Finance', level: 'SVP' },
        { name: 'Sarah Chen', title: 'SVP, Corporate Controller', level: 'SVP' },
      ],
    },
    {
      name: 'Debora Shoquist',
      title: 'EVP, Operations',
      level: 'EVP',
      children: [{ name: 'David Clark', title: 'VP, Supply Chain', level: 'VP' }],
    },
    { name: 'Timothy Teter', title: 'EVP, General Counsel', level: 'EVP' },
  ],
};

/** Companies that have hand-built charts in the market map data. */
const MARKET_MAP_CHART_COMPANIES = ['stripe', 'datadog', 'snowflake', 'servicenow', 'scale ai', 'alphabet', 'google'];

const FIRST = ['Avery', 'Jordan', 'Priya', 'Marcus', 'Elena', 'Daniel', 'Mei', 'Rafael', 'Hannah', 'Omar', 'Sofia', 'Victor', 'Nadia', 'Theo', 'Imani', 'Lucas'];
const LAST = ['Whitfield', 'Okafor', 'Lindqvist', 'Ramirez', 'Nakamura', 'Brennan', 'Haddad', 'Castellanos', 'Moreau', 'Patel', 'Sorensen', 'Adeyemi', 'Kowalski', 'Tran', 'Delgado', 'Fairbanks'];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A believable leadership team for a company we have no hand-built chart for, stable per company name. */
function generatedChart(companyName: string): OrgChartNode {
  const seed = hash(companyName.toLowerCase());
  let n = 0;
  const person = () => {
    const first = (seed + n * 5) % FIRST.length;
    const last = ((seed >>> 4) + n * 7) % LAST.length;
    n += 1;
    return `${FIRST[first]} ${LAST[last]}`;
  };
  return {
    name: person(),
    title: 'Chief Executive Officer',
    level: 'C-Suite',
    children: [
      {
        name: person(),
        title: 'Chief Financial Officer',
        level: 'C-Suite',
        children: [
          { name: person(), title: 'SVP, Finance', level: 'SVP' },
          { name: person(), title: 'VP, Investor Relations', level: 'VP' },
        ],
      },
      {
        name: person(),
        title: 'Chief Operating Officer',
        level: 'C-Suite',
        children: [{ name: person(), title: 'VP, Business Operations', level: 'VP' }],
      },
      {
        name: person(),
        title: 'Chief Technology Officer',
        level: 'C-Suite',
        children: [
          { name: person(), title: 'SVP, Engineering', level: 'SVP' },
          { name: person(), title: 'VP, Platform', level: 'VP' },
        ],
      },
      { name: person(), title: 'General Counsel', level: 'EVP' },
    ],
  };
}

/** Convert a market map org node into the shared chart shape. */
export const fromMarketMap = (n: OrgNodeData): OrgChartNode => ({
  name: n.name,
  title: n.title,
  level: n.level,
  mapped: n.isMappedCandidate || undefined,
  children: n.children?.length ? n.children.map(fromMarketMap) : undefined,
});

const cache = new Map<string, OrgChartNode>();

/** The leadership org chart for a company. Shared by the company profile and the project exports. */
export function getCompanyOrgChartTree(companyName: string): OrgChartNode {
  const key = companyName.trim().toLowerCase();
  const hit = cache.get(key);
  if (hit) return hit;

  let tree: OrgChartNode;
  if (key === 'nvidia') {
    tree = NVIDIA_CHART;
  } else if (MARKET_MAP_CHART_COMPANIES.some(c => key.includes(c))) {
    const stub = { id: key.replace(/\W+/g, '-'), name: companyName, executives: [] } as unknown as MappedCompany;
    tree = fromMarketMap(getCompanyOrgChart(stub));
  } else {
    tree = generatedChart(companyName);
  }
  cache.set(key, tree);
  return tree;
}
