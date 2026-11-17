import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { ArrowRight, Bot, Check, ChevronDown, Linkedin, PenLine, Plus, Search, Sparkles, X } from 'lucide-react';
import type { Candidate, Project, ProjectParameters, ProjectRoleLevel } from '../types';
import { isProjectLive, projectStatusLabel } from '../lib/projectStatus';
import { initialProjectPipeline } from './tabs/ProjectCandidatesTab';

interface CreateProjectChoiceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAgent: () => void;
  onManual: () => void;
}

export function CreateProjectChoice({ isOpen, onOpenChange, onAgent, onManual }: CreateProjectChoiceProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-overlay)" style={{ background: 'var(--bg-overlay-blanket)' }} />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-(--z-modal) w-full max-w-3xl bg-(--bg-default) rounded-2xl border border-(--border-light) shadow-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="phx-tag">New executive project</span>
              <Dialog.Title className="m-0! mt-2! text-xl! font-bold text-(--text-strong)">Create executive search project</Dialog.Title>
              <Dialog.Description className="m-0! mt-1! text-sm text-(--text-default)">
                Start with the Phenom Sourcing Agent, or fill in the project yourself.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              type="button"
              onClick={onAgent}
              className="text-left rounded-2xl border border-(--border-light) bg-(--bg-default) p-5 hover:border-(--color-secondary-100) hover:bg-(--bg-neutral-soft) focus-visible:outline-2"
            >
              <Bot className="w-6 h-6 text-(--color-secondary-200)" aria-hidden="true" />
              <span className="block mt-3 text-base font-bold text-(--text-strong)">Phenom Sourcing Agent</span>
              <span className="block mt-1 text-sm text-(--text-default)">
                Describe the role in chat. The agent returns candidate segments, and you add the people you select to a project or create one.
              </span>
            </button>
            <button
              type="button"
              onClick={onManual}
              className="text-left rounded-2xl border border-(--border-light) bg-(--bg-default) p-5 hover:border-(--color-secondary-100) hover:bg-(--bg-neutral-soft) focus-visible:outline-2"
            >
              <PenLine className="w-6 h-6 text-(--color-secondary-200)" aria-hidden="true" />
              <span className="block mt-3 text-base font-bold text-(--text-strong)">Create manually</span>
              <span className="block mt-1 text-sm text-(--text-default)">
                Enter the project details, role, compensation, scope, and location yourself.
              </span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  location: string;
  line: string;
  tags: string[];
  linkedin: boolean;
  about: string;
  emi: number;
};

type Segment = {
  id: string;
  title: string;
  description: string;
  count: number;
  leads: Lead[];
  reasoning: string;
};

type ChatItem =
  | { kind: 'search'; id: string; query: string; segments: Segment[] }
  | { kind: 'note'; id: string; text: string };

const SUGGESTIONS = [
  'Chief Operations Officer in Chicago',
  'Chief Financial Officer in Philadelphia',
  'VP of Engineering in the Bay Area',
  'Chief Information Security Officer',
];

const COO_CHICAGO: Lead[] = [
  { id: 'lead-janet', firstName: 'Janet', lastName: 'Paveso', role: 'Associate Director, Bioanalysis Operations', company: 'Astelas Pharma US', location: 'Chicago, Illinois, United States', line: 'Associate Director - Bioanalysis Operations at Astelas Pharma US | Chicago, Illinois, United States', tags: ['Passive', 'CRM'], linkedin: true, emi: 72, about: 'Runs bioanalysis operations for a pharma site in Chicago and has a direct contact on file.' },
  { id: 'lead-ryan', firstName: 'Ryan', lastName: 'Harta', role: 'Director, Talent Acquisition Operations', company: 'US Foods', location: 'Chicago, Illinois, United States', line: 'Director - Talent Acquisition Operations & Service Delivery at US Foods | Chicago, Illinois, United States', tags: ['Passive', 'CRM'], linkedin: true, emi: 74, about: 'Operations director covering talent acquisition service delivery across a national footprint based in Chicago.' },
  { id: 'lead-edina', firstName: 'Edina', lastName: "O'gradney Dangelo", role: 'Director, Global Cloud and Data Center Operations', company: 'Mondelez International Inc.', location: 'Lake Zurich, Illinois, United States', line: 'Director - Global Cloud and Data Center Operations at Mondelez International Inc. | Lake Zurich, Illinois, United States', tags: ['Passive', 'CRM'], linkedin: true, emi: 80, about: 'Global infrastructure operations leader in the Chicago suburbs, with cloud and data-center scope.' },
  { id: 'lead-anthony', firstName: 'Anthony', lastName: 'Leniski', role: 'Chief Operations Officer', company: 'Mcyad group', location: 'Chicago, Illinois, United States', line: 'Chief Operations Officer at Mcyad group | Chicago, Illinois, United States', tags: ['Passive', 'Cloud'], linkedin: true, emi: 86, about: 'Sitting COO in Chicago. Owns operating cadence, delivery, and the leadership team.' },
  { id: 'lead-rafael', firstName: 'Rafael', lastName: 'Hernandez', role: 'Chief Operations Officer', company: 'Vibes AI', location: 'Chicago, Illinois, United States', line: 'Chief Operations Officer at Vibes AI | Chicago, Illinois, United States', tags: ['Passive', 'Cloud'], linkedin: true, emi: 88, about: 'COO of an AI company in Chicago, with a software operating model.' },
  { id: 'lead-brett', firstName: 'Brett', lastName: 'Holland', role: 'Chief Operations Officer', company: 'Impact Cubed', location: 'Chicago, Illinois, United States', line: 'Chief Operations Officer at Impact Cubed | Chicago, Illinois, United States', tags: ['Passive', 'Cloud'], linkedin: true, emi: 84, about: 'COO who has scaled a Chicago operating team through a growth stage.' },
  { id: 'lead-valencia', firstName: 'Valencia', lastName: 'Roner', role: 'Chief Operations Officer', company: 'Strategic Energy Operations Solutions', location: 'Chicago, Illinois, United States', line: 'Chief Operations Officer at Strategic Energy Operations Solutions | Chicago, Illinois, United States', tags: ['Passive', 'Cloud'], linkedin: true, emi: 83, about: 'COO for an energy-operations business headquartered in Chicago.' },
];

function projectCode(id: string) {
  const n = Number(id.replace(/\D/g, '')) || 1;
  return `Pr-${10220 + (n > 100000 ? n % 100000 : n)}`;
}

function interpret(query: string) {
  const q = query.trim();
  const inMatch = q.match(/\bin\s+(.+)$/i);
  const location = inMatch ? inMatch[1].replace(/[.,]$/, '').trim() : '';
  const title = (inMatch ? q.slice(0, inMatch.index).trim() : q).replace(/,\s*remote$/i, '').trim() || q;
  const lower = q.toLowerCase();
  const roleLevel: ProjectRoleLevel =
    /\b(chief|cfo|ceo|coo|ciso|cio|cpo|chro)\b/.test(lower) ? 'C-Suite'
      : /\b(svp|senior vice president)\b/.test(lower) ? 'Senior Vice President'
        : /\b(vp|vice president)\b/.test(lower) ? 'Vice President'
          : 'Senior Director';
  const domain =
    /financ|cfo|controller/.test(lower) ? 'Corporate Finance'
      : /operation|\bcoo\b/.test(lower) ? 'Operations'
        : /engineer|infrastructure/.test(lower) ? 'Infrastructure & Cloud Computing'
          : /security|ciso/.test(lower) ? 'Platform Security & Identity'
            : /product/.test(lower) ? 'Enterprise B2B SaaS'
              : /people|hr|chro/.test(lower) ? 'Corporate Governance & Capital Markets'
                : 'Enterprise B2B SaaS';
  return { title, location, roleLevel, domain, query: q, lower };
}

function isCooChicago(query: string) {
  const s = query.toLowerCase();
  return (s.includes('chief operations') || /\bcoo\b/.test(s)) && s.includes('chicago');
}

function generatedLeads(title: string, location: string): Lead[] {
  const place = location || 'United States';
  const names: [string, string, string][] = [
    ['Elena', 'Voss', 'Northline'],
    ['Marcus', 'Ellison', 'Harbor & Co'],
    ['Priya', 'Shah', 'Latticework'],
    ['Owen', 'Park', 'Fieldnote'],
    ['Amira', 'Hassan', 'Kinetic'],
    ['Helen', 'Cho', 'Brightpath'],
  ];
  return names.map(([first, last, company], i) => ({
    id: `lead-gen-${first.toLowerCase()}-${i}`,
    firstName: first,
    lastName: last,
    role: title,
    company,
    location: place,
    line: `${title} at ${company} | ${place}`,
    tags: i % 2 === 0 ? ['Passive', 'CRM'] : ['Passive', 'Cloud'],
    linkedin: true,
    emi: 78 + i,
    about: `${title} at ${company}. Surfaced because the profile matches this search${location ? ` around ${location}` : ''}.`,
  }));
}

function buildSegments(query: string): Segment[] {
  const parsed = interpret(query);
  if (isCooChicago(query)) {
    const saas = COO_CHICAGO.filter(lead => /chief operations/i.test(lead.role) || /cloud|saas|ai/i.test(lead.company + lead.line));
    return [
      {
        id: 'asked',
        title: 'What you asked for: Chief Operations Officer in Chicago',
        description: 'Senior executive overseeing operations at Phenom based in Chicago. Responsible for driving operational strategy and execution for a global HRTech SaaS company.',
        count: 200,
        leads: COO_CHICAGO,
        reasoning: 'This is the direct read of the search: a chief operations officer based in Chicago, with the operating scope of a global HRTech SaaS company.',
      },
      {
        id: 'adjacent',
        title: 'Operations Executives with SaaS/HRTech Experience in Chicago',
        description: "Senior operations leaders from SaaS or HRTech firms in Chicago. Ideal for leveraging sector experience in Phenom's global growth context.",
        count: 200,
        leads: saas.length > 0 ? saas : COO_CHICAGO.slice(3),
        reasoning: 'The agent widened the Chicago operations search into SaaS and HRTech operators whose company context transfers to this mandate.',
      },
    ];
  }
  const place = parsed.location || 'the broader market';
  const leads = generatedLeads(parsed.title, parsed.location);
  return [
    {
      id: 'asked',
      title: `What you asked for: ${parsed.query}`,
      description: `${parsed.title}${parsed.location ? ` based in ${parsed.location}` : ''}. The agent matched executives whose current scope lines up with this search.`,
      count: 200,
      leads,
      reasoning: `Closest executives for “${parsed.query}”. ${parsed.domain} is the functional read, at ${parsed.roleLevel}.`,
    },
    {
      id: 'adjacent',
      title: `Adjacent ${parsed.domain} leaders (${place})`,
      description: `Senior leaders from related companies. Used when the exact title is thin and transferable operating experience matters.`,
      count: 200,
      leads: leads.slice(2).concat(leads.slice(0, 2)),
      reasoning: `Adjacent ${parsed.domain.toLowerCase()} leadership${parsed.location ? ` around ${parsed.location}` : ''}, kept inside executive search.`,
    },
  ];
}

function toCandidate(lead: Lead, roleLevel: string, domain: string): Candidate {
  return {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    role: lead.role,
    company: lead.company,
    email: `${lead.firstName}.${lead.lastName}`.toLowerCase().replace(/[^a-z.]/g, '') + '@example.com',
    phone: '+1 312-555-0148',
    location: lead.location,
    trafficSource: 'Phenom Sourcing Agent',
    linkedinUrl: lead.linkedin ? `https://www.linkedin.com/in/${lead.firstName}${lead.lastName}`.toLowerCase().replace(/[^a-z/.:]/g, '') : '',
    emiScore: lead.emi,
    behavioralScore: 80,
    assessmentScore: 78,
    executiveData: {
      executiveLevel: roleLevel,
      function: domain,
      currentCompanyTenure: '4 years',
      currentRoleTenure: '3 years',
      careerVelocity: 'High',
      industryExperience: domain,
      companySizeExperience: '1,000-5,000',
      publicCompanyExperience: 'Yes',
      peBackedExperience: 'No',
      geographicExperience: lead.location,
      globalExperience: 'United States',
      boardExperience: 'N/A',
      education: 'Not reported',
      certifications: 'N/A',
      areasOfExpertise: domain,
      currentCompensation: 'Not reported',
      currentEquityType: 'N/A',
      currentEquityShares: 'N/A',
      mobilityIndicator: 'High',
      careerTrajectory: lead.role,
      executiveArchetype: 'Operator',
      likelyNextRole: lead.role,
      candidatePandL: 'Not reported',
      relocationWillingness: 'Open',
      noticePeriod: '60 days',
      nonCompete: 'Not reported',
      gardenLeave: 'No',
    },
  };
}

function parametersFor(query: string): ProjectParameters {
  const parsed = interpret(query);
  const salary = parsed.roleLevel === 'C-Suite' ? 420000 : parsed.roleLevel === 'Senior Vice President' ? 360000 : 280000;
  return {
    primaryTitle: parsed.title,
    equivalentTitles: [],
    roleLevel: parsed.roleLevel,
    functionalDomain: parsed.domain,
    domainKeywords: [parsed.title, parsed.location, parsed.domain].filter(Boolean),
    targetBaseSalary: salary,
    maxBaseBudget: Math.round(salary * 1.15),
    variableOTE: '40% bonus',
    equityGrantValue: 'To be calibrated',
    maxTotalCompensationCeiling: Math.round(salary * 1.8),
    targetCompanyStage: 'Growth to public',
    requiredPandLScope: 'Executive scope matching the search',
    teamHeadcountScale: 'Leadership team',
    workModel: /remote/i.test(query) ? 'Remote' : 'Hybrid',
    hybridDaysPerWeek: /remote/i.test(query) ? undefined : 3,
    targetMetropolitanMarkets: parsed.location ? [parsed.location] : ['Remote (US / Global)'],
    relocationWillingness: true,
    targetStartDate: '2027-03-01',
    maxNoticePeriodTolerance: parsed.roleLevel === 'C-Suite' ? '90 days' : '60 days',
    confidentialityProtocol: 'Named Enterprise Search',
  };
}

function pipelineFrom(leads: Lead[], query: string) {
  const parsed = interpret(query);
  return leads.map(lead => ({
    ...toCandidate(lead, parsed.roleLevel, parsed.domain),
    projectStatus: 'Identified',
    dateAdded: '2026-11-16',
  }));
}

function newProject(query: string, segment: Segment, leads: Lead[]): Project {
  const parsed = interpret(query);
  return {
    id: `p-${Date.now()}`,
    title: parsed.title || 'Executive Search',
    company: 'In-House Executive Search',
    type: 'Executive Search',
    stage: 'Calibration',
    status: 'Active',
    createdAt: 'Nov 16, 2026',
    leadRecruiter: 'Brian Stepan',
    candidatesCount: leads.length,
    description: `Created from the Phenom Sourcing Agent search “${parsed.query}”. ${segment.description}`,
    parameters: parametersFor(query),
    seedPipeline: pipelineFrom(leads, query),
  };
}

function addLeadsToProject(project: Project, leads: Lead[], query: string): Project {
  const incoming = pipelineFrom(leads, query);
  const base = project.seedPipeline?.length ? project.seedPipeline : initialProjectPipeline;
  const ids = new Set(incoming.map(c => c.id));
  const seedPipeline = [...incoming, ...base.filter(c => !ids.has(c.id))];
  return { ...project, seedPipeline, candidatesCount: seedPipeline.length };
}

interface AgentProjectSearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onSave: (project: Project) => void;
  projects: Project[];
}

export function AgentProjectSearch({ isOpen, onOpenChange, onBack, onSave, projects }: AgentProjectSearchProps) {
  const [draft, setDraft] = useState('');
  const [items, setItems] = useState<ChatItem[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [panel, setPanel] = useState<'reasoning' | 'criteria' | 'candidates'>('candidates');
  const [selected, setSelected] = useState<string[]>([]);
  const [moreInfo, setMoreInfo] = useState(false);
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [addMenu, setAddMenu] = useState(false);
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [projectQuery, setProjectQuery] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setDraft('');
      setItems([]);
      setActiveKey('');
      setSelected([]);
      setAddMenu(false);
      setAddProjectOpen(false);
      setProjectQuery('');
      setPanel('candidates');
    }
  }, [isOpen]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [items]);

  const searches = items.filter((item): item is Extract<ChatItem, { kind: 'search' }> => item.kind === 'search');
  const active = useMemo(() => {
    for (const search of searches) {
      const segment = search.segments.find(s => `${search.id}:${s.id}` === activeKey);
      if (segment) return { search, segment };
    }
    const last = searches[searches.length - 1];
    return last ? { search: last, segment: last.segments[0] } : null;
  }, [searches, activeKey]);

  const selectedLeads = useMemo(() => {
    const map = new Map<string, Lead>();
    searches.forEach(search => search.segments.forEach(segment => segment.leads.forEach(lead => map.set(lead.id, lead))));
    return selected.map(id => map.get(id)).filter((lead): lead is Lead => Boolean(lead));
  }, [searches, selected]);

  const ask = (text: string) => {
    const query = text.trim();
    if (!query) return;
    const id = `turn-${Date.now()}`;
    const segments = buildSegments(query);
    setItems(prev => [...prev, { kind: 'search', id, query, segments }]);
    setActiveKey(`${id}:${segments[0].id}`);
    setPanel('candidates');
    setDraft('');
    setSelected([]);
  };

  const note = (text: string) => setItems(prev => [...prev, { kind: 'note', id: `note-${Date.now()}`, text }]);

  const toggle = (id: string) => setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const openAddProject = () => {
    setAddMenu(false);
    if (selectedLeads.length === 0) {
      note('Select at least one candidate with the plus button, then add them to a project.');
      return;
    }
    setProjectQuery('');
    setAddProjectOpen(true);
  };

  const createNew = () => {
    if (!active) return;
    onSave(newProject(active.search.query, active.segment, selectedLeads));
    onOpenChange(false);
  };

  const assignTo = (project: Project) => {
    if (!active || selectedLeads.length === 0) return;
    onSave(addLeadsToProject(project, selectedLeads, active.search.query));
    onOpenChange(false);
  };

  const filteredProjects = projects.filter(project => {
    const q = projectQuery.trim().toLowerCase();
    if (!q) return true;
    return project.title.toLowerCase().includes(q) || projectCode(project.id).toLowerCase().includes(q);
  });
  const mine = filteredProjects.filter(project => project.leadRecruiter === 'Brian Stepan' && isProjectLive(project.status));

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-overlay)" style={{ background: 'var(--bg-overlay-blanket)' }} />
        <Dialog.Content className="fixed inset-3 md:inset-5 z-(--z-modal) bg-(--bg-surface-base) rounded-2xl border border-(--border-light) shadow-2xl flex flex-col overflow-hidden relative">
          <div className="px-4 py-3 border-b border-(--border-light) bg-(--bg-default) flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" onClick={onBack}>Back</button>
              <Dialog.Title className="m-0! text-base! leading-6! font-bold text-(--text-strong) truncate">Phenom Sourcing Agent</Dialog.Title>
              <Dialog.Description className="sr-only">Chat with the sourcing agent, review candidates, and add them to a project.</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {searches.length === 0 ? (
            <EmptySearch draft={draft} setDraft={setDraft} onAsk={ask} />
          ) : (
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
              <div className="lg:w-[400px] shrink-0 border-b lg:border-b-0 lg:border-r border-(--border-light) bg-(--bg-default) flex flex-col min-h-0">
                <div ref={threadRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {items.map(item => item.kind === 'note' ? (
                    <p key={item.id} className="m-0! text-sm text-(--text-default) flex items-start gap-2">
                      <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-(--color-secondary-200)" aria-hidden="true" />
                      {item.text}
                    </p>
                  ) : (
                    <div key={item.id} className="flex flex-col gap-3">
                      <div className="flex justify-end">
                        <div className="max-w-[90%] rounded-2xl px-3 py-2 text-sm text-(--text-strong) flex items-center gap-2" style={{ background: 'var(--bg-neutral-soft)' }}>
                          <span>{item.query}</span>
                          <span className="w-7 h-7 rounded-full bg-(--bg-brand-secondary-subtle) text-(--text-brand-secondary-default) text-xs font-semibold flex items-center justify-center shrink-0" aria-hidden="true">BS</span>
                        </div>
                      </div>
                      <p className="m-0! text-sm text-(--text-default) flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-(--color-secondary-200)" aria-hidden="true" />
                        Got it — {isCooChicago(item.query) ? 'Chief Operations Officer in Chicago' : item.query.charAt(0).toUpperCase() + item.query.slice(1)}.
                      </p>
                      {item.segments.map(segment => {
                        const on = active?.segment.id === segment.id && active.search.id === item.id;
                        return (
                          <button
                            key={segment.id}
                            type="button"
                            onClick={() => { setActiveKey(`${item.id}:${segment.id}`); setPanel('candidates'); }}
                            aria-pressed={on}
                            className="text-left rounded-2xl border p-4 bg-(--bg-default)"
                            style={{
                              borderColor: on ? 'var(--color-secondary-200)' : 'var(--border-light)',
                              background: on ? 'var(--bg-brand-secondary-subtle)' : 'var(--bg-default)',
                            }}
                          >
                            <div className="text-2xl font-bold text-(--color-secondary-200)">{segment.count}</div>
                            <div className="text-xs text-(--text-subtle)">Candidates found</div>
                            <div className="mt-2 text-sm font-bold text-(--color-secondary-300)">{segment.title}</div>
                            <p className="m-0! mt-1! text-sm text-(--text-default)">{segment.description}</p>
                            {on && (
                              <p className="m-0! mt-2! text-xs text-(--color-secondary-200) flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                Viewing details on the right panel
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                  {searches.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <p className="m-0! text-sm text-(--text-default) flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-(--color-secondary-200)" aria-hidden="true" />
                        <span>
                          Recommended next steps:
                          <span className="block mt-1">1. Shortlist candidates you like and then add to list, job, project or create reachout.</span>
                          <span className="block">2. Type to adjust criteria for the segment in view.</span>
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => {
                          if (!active) return;
                          setSelected(prev => Array.from(new Set([...prev, ...active.segment.leads.map(l => l.id)])));
                          note(`Added the candidates in “${active.segment.title}” to your list.`);
                        }}>
                          Add Candidates to List
                        </button>
                        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={openAddProject}>
                          Add Candidates to Project
                        </button>
                        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => note('Add these candidates to a project first. A job opening can be attached from that project.')}>
                          Add Candidates to Job
                        </button>
                        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => note(selectedLeads.length === 0 ? 'Select candidates, then reachout drafts a note for each of them.' : `Reachout drafted for ${selectedLeads.map(l => l.firstName).join(', ')}: a short introduction to the ${active ? interpret(active.search.query).title : 'role'}.`)}>
                          Reachout
                        </button>
                        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={createNew}>
                          <Plus className="w-4 h-4" aria-hidden="true" /> Create new project
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <form className="p-3 border-t border-(--border-light)" onSubmit={e => { e.preventDefault(); ask(draft); }}>
                  <label className="sr-only" htmlFor="agent-followup">Message the sourcing agent</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-(--border-light) px-3 py-2">
                    <Search className="w-4 h-4 text-(--text-subtle) shrink-0" aria-hidden="true" />
                    <input id="agent-followup" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Find perfect fit candidates..." className="flex-1 border-0! shadow-none! bg-transparent" />
                    <button type="submit" className="phx-btn" data-variant="primary" data-size="sm" aria-label="Send" disabled={!draft.trim()}>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex-1 min-w-0 overflow-y-auto p-5 bg-(--bg-default)">
                {active && (
                  <ResultsPanel
                    query={active.search.query}
                    segment={active.segment}
                    panel={panel}
                    setPanel={setPanel}
                    selected={selected}
                    toggle={toggle}
                    moreInfo={moreInfo}
                    setMoreInfo={setMoreInfo}
                    openInfo={openInfo}
                    setOpenInfo={setOpenInfo}
                    addMenu={addMenu}
                    setAddMenu={setAddMenu}
                    onAddProject={openAddProject}
                    onAddList={() => {
                      setAddMenu(false);
                      setSelected(prev => Array.from(new Set([...prev, ...active.segment.leads.map(l => l.id)])));
                      note(`Added the candidates in “${active.segment.title}” to your list.`);
                    }}
                    onAddJob={() => { setAddMenu(false); note('Add these candidates to a project first. A job opening can be attached from that project.'); }}
                    onNewSearch={() => { setItems([]); setDraft(''); }}
                    onAddAll={() => setSelected(prev => Array.from(new Set([...prev, ...active.segment.leads.map(l => l.id)])))}
                  />
                )}
              </div>
            </div>
          )}

          {addProjectOpen && active && (
            <div className="absolute inset-0 z-20 flex items-start justify-center p-6 overflow-y-auto" style={{ background: 'var(--bg-overlay-blanket)' }}>
              <div className="w-full max-w-lg bg-(--bg-default) rounded-2xl border border-(--border-light) shadow-2xl" role="dialog" aria-labelledby="add-to-project-title">
                <div className="px-5 py-4 border-b border-(--border-light) flex items-center justify-between">
                  <h2 id="add-to-project-title" className="m-0! text-lg! font-bold text-(--text-strong)">Add to Project</h2>
                  <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close add to project" onClick={() => setAddProjectOpen(false)}>
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <p className="m-0! text-sm text-(--text-default)">{selectedLeads.length} candidate{selectedLeads.length === 1 ? '' : 's'} selected</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLeads.map(lead => (
                      <span key={lead.id} className="phx-tag">
                        {lead.firstName} {lead.lastName}
                        <button type="button" className="ml-1" aria-label={`Remove ${lead.firstName} ${lead.lastName}`} onClick={() => toggle(lead.id)}>
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div>
                    <label className="phx-label" htmlFor="project-search">Search by project name or project ID</label>
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-(--text-subtle)" aria-hidden="true" />
                      <input id="project-search" value={projectQuery} onChange={e => setProjectQuery(e.target.value)} placeholder="Search" />
                    </div>
                  </div>
                  <ProjectGroup label="My projects" projects={mine} onPick={assignTo} />
                  <ProjectGroup label="All projects" projects={filteredProjects} onPick={assignTo} />
                  {filteredProjects.length === 0 && (
                    <p className="m-0! text-sm text-(--text-default)">No project matches that search.</p>
                  )}
                  <button type="button" className="phx-btn self-start" data-variant="primary" data-size="sm" onClick={createNew}>
                    <Plus className="w-4 h-4" aria-hidden="true" /> Create new project
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ProjectGroup({ label, projects, onPick }: { label: string; projects: Project[]; onPick: (project: Project) => void }) {
  if (projects.length === 0) return null;
  return (
    <div>
      <p className="m-0! text-xs font-semibold tracking-wide text-(--text-subtle) uppercase">{label}</p>
      <ul className="mt-1">
        {projects.map(project => (
          <li key={`${label}-${project.id}`}>
            <button type="button" onClick={() => onPick(project)} className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-(--bg-neutral-soft) text-left">
              <span className="text-sm text-(--text-strong)">{project.title} - {projectCode(project.id)}</span>
              <span className="text-sm text-(--text-subtle) shrink-0">{projectStatusLabel(project.status).toLowerCase()}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptySearch({ draft, setDraft, onAsk }: { draft: string; setDraft: (v: string) => void; onAsk: (q: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-10 bg-(--bg-default)">
      <h2 className="m-0! text-xl! font-bold text-(--text-strong) text-center">Amazing talent is just a search away</h2>
      <form className="mt-6 w-full max-w-xl rounded-2xl border border-(--border-light) p-3" onSubmit={e => { e.preventDefault(); onAsk(draft); }}>
        <label className="sr-only" htmlFor="agent-search">Find candidates</label>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-(--text-subtle) shrink-0" aria-hidden="true" />
          <input id="agent-search" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Find perfect fit candidates..." className="flex-1 border-0! shadow-none! bg-transparent" />
          <button type="submit" className="phx-btn" data-variant="primary" data-size="sm" aria-label="Search" disabled={!draft.trim()}>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
      <p className="m-0! mt-6! text-sm text-(--text-subtle)">Try searching</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-xl">
        {SUGGESTIONS.map(item => (
          <button key={item} type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => onAsk(item)}>
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="max-w-[240px] truncate">{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultsPanel(props: {
  query: string;
  segment: Segment;
  panel: 'reasoning' | 'criteria' | 'candidates';
  setPanel: (p: 'reasoning' | 'criteria' | 'candidates') => void;
  selected: string[];
  toggle: (id: string) => void;
  moreInfo: boolean;
  setMoreInfo: (v: boolean) => void;
  openInfo: string | null;
  setOpenInfo: (id: string | null) => void;
  addMenu: boolean;
  setAddMenu: (v: boolean) => void;
  onAddProject: () => void;
  onAddList: () => void;
  onAddJob: () => void;
  onNewSearch: () => void;
  onAddAll: () => void;
}) {
  const parsed = interpret(props.query);
  const { segment } = props;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0! text-xs text-(--text-subtle)">Progression / Candidates</p>
          <h2 className="m-0! mt-1! text-lg! leading-6! font-bold text-(--text-strong)">{segment.title}</h2>
          <p className="m-0! mt-1! text-sm text-(--text-default) max-w-2xl">{segment.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-2xl font-bold text-(--color-secondary-200)">{segment.count}</div>
            <div className="text-xs text-(--text-subtle)">Candidates found</div>
          </div>
          <div className="relative">
            <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" aria-expanded={props.addMenu} aria-haspopup="menu" onClick={() => props.setAddMenu(!props.addMenu)}>
              Add to <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </button>
            {props.addMenu && (
              <div role="menu" className="absolute right-0 top-11 z-10 w-44 rounded-xl border border-(--border-light) bg-(--bg-default) shadow-md py-1">
                <button type="button" role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-(--bg-neutral-soft)" onClick={props.onAddProject}>Project</button>
                <button type="button" role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-(--bg-neutral-soft)" onClick={props.onAddList}>List</button>
                <button type="button" role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-(--bg-neutral-soft)" onClick={props.onAddJob}>Job</button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="phx-btn"
            data-variant="primary"
            data-size="sm"
            onClick={props.onNewSearch}
          >
            New Search
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="Search detail">
        {([
          ['reasoning', 'Reasoning'],
          ['criteria', 'Filter criteria'],
          ['candidates', 'Candidates'],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={props.panel === id} onClick={() => props.setPanel(id)}>{label}</button>
        ))}
      </div>

      {props.panel === 'reasoning' && <p className="m-0! text-sm text-(--text-default)">{segment.reasoning}</p>}
      {props.panel === 'criteria' && (
        <div className="flex flex-wrap gap-2">
          <span className="phx-tag">Title: {parsed.title}</span>
          <span className="phx-tag">Level: {parsed.roleLevel}</span>
          <span className="phx-tag">Domain: {parsed.domain}</span>
          {parsed.location && <span className="phx-tag">Location: {parsed.location}</span>}
        </div>
      )}
      {props.panel === 'candidates' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="m-0! text-sm text-(--text-default)">Showing 1–{segment.leads.length} of {segment.count} matching leads</p>
              <p className="m-0! text-sm font-semibold text-(--text-strong)">Total shortlisted: {props.selected.length}</p>
            </div>
            <button
              type="button"
              className="phx-btn"
              data-variant="primary"
              data-size="sm"
              onClick={props.onAddAll}
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Add all to shortlist
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Switch.Root
              checked={props.moreInfo}
              onCheckedChange={props.setMoreInfo}
              className="w-10 h-6 rounded-full relative shrink-0"
              style={{ background: props.moreInfo ? 'var(--bg-brand-secondary-default)' : 'var(--color-neutrals-100)' }}
              aria-label="Display more info by default"
            >
              <Switch.Thumb className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-xs ${props.moreInfo ? 'translate-x-5' : 'translate-x-1'}`} />
            </Switch.Root>
            <span className="text-sm text-(--text-default)">Display more info by default</span>
          </div>
          <ul className="flex flex-col">
            {segment.leads.map(lead => {
              const on = props.selected.includes(lead.id);
              const show = props.moreInfo || props.openInfo === lead.id;
              return (
                <li
                  key={lead.id}
                  className="py-3 border-b border-(--border-light)"
                  style={on ? { background: 'var(--feedback-success-bg-light)', boxShadow: 'inset 0 0 0 1px var(--feedback-success-icon-default)' } : undefined}
                >
                  <div className="flex items-start justify-between gap-3 px-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-(--bg-neutral-soft) text-(--text-strong) text-xs font-bold flex items-center justify-center shrink-0" aria-hidden="true">
                        {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-(--text-strong)">{lead.firstName} {lead.lastName}</span>
                          {lead.linkedin && <Linkedin className="w-3.5 h-3.5 text-(--text-subtle)" aria-label="LinkedIn on file" />}
                          {lead.tags.map(tag => <span key={tag} className="phx-tag">{tag}</span>)}
                          {on && <span className="phx-tag">Shortlisted</span>}
                        </div>
                        <p className="m-0! text-sm text-(--text-default)">{lead.line}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-expanded={show} onClick={() => props.setOpenInfo(props.openInfo === lead.id ? null : lead.id)}>
                        {show ? 'Hide info' : 'More info'} <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      {on ? (
                        <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => props.toggle(lead.id)}>
                          <Check className="w-4 h-4" aria-hidden="true" /> Deselect
                        </button>
                      ) : (
                        <button
                          type="button"
                          aria-label={`Select ${lead.firstName} ${lead.lastName}`}
                          onClick={() => props.toggle(lead.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--bg-brand-primary-default)', color: 'var(--text-inverse)' }}
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                  {show && <p className="m-0! mt-2! px-2 text-sm text-(--text-default)">{lead.about}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
