import React, { useState, useMemo } from 'react';
import { Candidate } from '../../types';
import * as Accordion from '@radix-ui/react-accordion';
import * as Switch from '@radix-ui/react-switch';
import { 
  ChevronDown, 
  Sparkles, 
  Newspaper, 
  Database, 
  ExternalLink, 
  Bot, 
  Mail, 
  Check, 
  Share, 
  Star, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  ThumbsUp, 
  AlertCircle, 
  Tag, 
  ArrowRight,
  Building2,
  User,
  Filter,
  Globe,
  Building
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AgentConfigurationModal } from '../AgentConfigurationModal';
import { useInterviewFeedback } from '../../context/InterviewFeedbackContext';
import { InterviewFeedbackModal } from '../InterviewFeedbackModal';

export interface CandidatePublication {
  id: string;
  type: 'executive' | 'company'; // 'executive' = directly names executive; 'company' = represents publications about the company
  source: string;
  title: string;
  date: string;
  summary: string;
  tag: string;
  url: string;
}

const getCandidatePublications = (candidate: Candidate): CandidatePublication[] => {
  const comp = candidate.company || 'Enterprise Corporation';
  const name = `${candidate.firstName} ${candidate.lastName}`;
  const isApple = comp.toLowerCase().includes('apple');

  if (isApple) {
    return [
      {
        id: 'n1',
        type: 'executive',
        source: 'Associated Press / NBC News',
        title: "Apple's new CEO, John Ternus, takes over from Tim Cook after 15 years",
        date: 'Sep 1, 2026',
        summary: "Historic leadership succession reporting covering John Ternus's elevation to Chief Executive Officer and strategic executive charter.",
        tag: 'Executive Succession',
        url: '#'
      },
      {
        id: 'n2',
        type: 'company',
        source: 'Reuters Business & Technology',
        title: "Apple unveils next-gen M5 Silicon and expands enterprise AI datacenter infrastructure",
        date: 'Sep 6, 2026',
        summary: "Comprehensive reporting on Apple's multi-billion silicon capital expenditure and dedicated enterprise AI cluster buildout.",
        tag: 'Enterprise AI & Cloud',
        url: '#'
      },
      {
        id: 'n3',
        type: 'executive',
        source: 'TechCrunch',
        title: 'Who is John Ternus, the new Apple CEO? Inside the hardware chief’s elevation',
        date: 'Sep 1, 2026',
        summary: "Deep investigative profile examining Ternus's engineering background, design collaboration, and executive philosophy.",
        tag: 'Executive Profile',
        url: '#'
      },
      {
        id: 'n4',
        type: 'company',
        source: 'Bloomberg Markets',
        title: "Apple reports record Q3 Services revenue amid global enterprise hardware expansion",
        date: 'Sep 14, 2026',
        summary: "Financial publication on Apple's corporate earnings, $24.2B services revenue, and expanding Fortune 500 corporate adoption.",
        tag: 'Corporate Earnings & Growth',
        url: '#'
      },
      {
        id: 'n5',
        type: 'executive',
        source: 'AppleInsider',
        title: 'John Ternus teases variable aperture in iPhone 18 Pro before event',
        date: 'Sep 9, 2026',
        summary: "Executive keynote remarks previewing optical sensor hardware architecture and next-generation device engineering.",
        tag: 'Keynote & Strategy',
        url: '#'
      },
      {
        id: 'n6',
        type: 'company',
        source: 'The Wall Street Journal',
        title: "Apple and strategic foundry partners accelerate 2nm clean-energy semiconductor supply chain",
        date: 'Sep 22, 2026',
        summary: "Institutional corporate analysis of Apple's long-term supplier agreements, wafer capacity reservations, and sustainability milestones.",
        tag: 'Supply Chain & Manufacturing',
        url: '#'
      },
      {
        id: 'n7',
        type: 'company',
        source: 'Financial Times',
        title: "Enterprise adoption of Apple Intelligence accelerates across Global 2000 corporate fleets",
        date: 'Sep 26, 2026',
        summary: "Enterprise market study indicating 38% increase in Apple hardware and privacy-first compute deployments by global CIOs.",
        tag: 'Enterprise Market Adoption',
        url: '#'
      }
    ];
  }

  return [
    {
      id: 'n1',
      type: 'executive',
      source: 'Financial Times Executive Forum',
      title: `${name} champions organizational resilience and next-generation leadership at ${comp}`,
      date: 'Sep 14, 2026',
      summary: `Leadership interview spotlighting ${name}'s executive operational philosophy, team retention strategies, and cross-functional scaling initiatives.`,
      tag: 'Executive Leadership',
      url: '#'
    },
    {
      id: 'n2',
      type: 'company',
      source: 'Bloomberg Enterprise Tech',
      title: `${comp} scales enterprise cloud architecture with record Q3 recurring revenue growth`,
      date: 'Sep 18, 2026',
      summary: `Corporate earnings and business performance analysis covering ${comp}'s expanding market share and institutional customer expansion.`,
      tag: 'Corporate Earnings & Scale',
      url: '#'
    },
    {
      id: 'n3',
      type: 'company',
      source: 'Reuters Corporate Intelligence',
      title: `${comp} announces multi-region infrastructure expansion and strategic enterprise partnerships`,
      date: 'Sep 8, 2026',
      summary: `Enterprise reporting on ${comp}'s capital allocation toward global security certifications, datacenter capacity, and strategic partnerships.`,
      tag: 'Strategic Partnerships',
      url: '#'
    },
    {
      id: 'n4',
      type: 'executive',
      source: 'Forbes Executive Suite',
      title: `Inside ${name}’s strategy for accelerating executive alignment across ${comp}`,
      date: 'Sep 4, 2026',
      summary: `Industry profile detailing executive decision frameworks, talent calibration, and organizational impact under ${name}'s leadership.`,
      tag: 'Executive Profile',
      url: '#'
    },
    {
      id: 'n5',
      type: 'company',
      source: 'The Wall Street Journal',
      title: `${comp} initiates corporate transformation to capitalize on autonomous AI productivity`,
      date: 'Aug 28, 2026',
      summary: `Company-level analysis exploring organizational shifts, operating efficiency programs, and technology stack modernization at ${comp}.`,
      tag: 'Enterprise Transformation',
      url: '#'
    }
  ];
};

interface SummaryTabProps {
  candidate: Candidate;
  onNavigateToEvaluations?: () => void;
}

export function SummaryTab({ candidate, onNavigateToEvaluations }: SummaryTabProps) {
  const [outreachEnabled, setOutreachEnabled] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [newsFilter, setNewsFilter] = useState<'all' | 'executive' | 'company'>('all');
  
  const allPublications = useMemo(() => getCandidatePublications(candidate), [candidate]);
  const filteredPublications = useMemo(() => {
    if (newsFilter === 'all') return allPublications;
    return allPublications.filter(p => p.type === newsFilter);
  }, [allPublications, newsFilter]);

  const executiveCount = allPublications.filter(p => p.type === 'executive').length;
  const companyCount = allPublications.filter(p => p.type === 'company').length;
  
  const { getFeedbackForCandidate } = useInterviewFeedback();
  const feedbackList = getFeedbackForCandidate(candidate.id);

  const totalFeedbackCount = feedbackList.length;
  const avgRating = totalFeedbackCount > 0
    ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / totalFeedbackCount).toFixed(1)
    : '0';

  const emiScore = candidate.emiScore;
  const behavioralScore = candidate.behavioralScore;

  const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col">
      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-[13px] text-slate-900 font-medium">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      <AgentConfigurationModal 
        isOpen={isAgentModalOpen} 
        onOpenChange={setIsAgentModalOpen} 
        candidate={candidate} 
      />

      <InterviewFeedbackModal
        isOpen={isFeedbackModalOpen}
        onOpenChange={setIsFeedbackModalOpen}
        candidate={candidate}
      />

      <Accordion.Root type="multiple" defaultValue={['summary', 'details', 'feedback', 'behavioral', 'emi', 'news']} className="flex flex-col gap-6">
        
        {/* Profile Summary */}
        <Accordion.Item value="summary" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 text-left group">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-900">Profile Summary</span>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 pt-0 overflow-hidden text-sm data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
             <div className="text-slate-700 leading-relaxed space-y-4">
                <p>
                  {candidate.firstName} {candidate.lastName} is a highly accomplished executive currently serving as the {candidate.role} at {candidate.company}. Recognized for driving transformative product strategies and scaling global engineering operations, they have a proven track record of navigating complex market shifts. 
                </p>
                <p>
                  Previous experience indicates a strong foundation in both technical innovation and corporate leadership. Key expertise includes managing P&L scale expansions, orchestrating cross-functional alignments, and leading significant organizational restructurings.
                </p>
             </div>
             
             <div className="flex gap-3 mt-6">
               <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-full text-sm text-slate-700 hover:bg-slate-50">
                 <Sparkles className="w-4 h-4 text-blue-600" /> Opt-in Status
               </button>
               <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-full text-sm text-slate-700 hover:bg-slate-50">
                 <Sparkles className="w-4 h-4 text-blue-600" /> Latest Communication
               </button>
               <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-full text-sm text-slate-700 hover:bg-slate-50">
                 <Sparkles className="w-4 h-4 text-blue-600" /> Screening Questions
               </button>
             </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* Executive Details */}
        <Accordion.Item value="details" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 text-left group">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-slate-900">About {candidate.firstName} {candidate.lastName}</span>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 pt-0 overflow-hidden text-sm data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="flex flex-col gap-8">
              
              {/* Group 0: CRM & Assessment Intelligence */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">CRM & Assessment Intelligence</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
                  <DetailItem label="Current Role & Co." value={`${candidate.role} • ${candidate.company}`} />
                  <DetailItem label="Assessment Score" value={String(candidate.assessmentScore ?? candidate.behavioralScore ?? 85)} />
                  <DetailItem label="Subscription Status" value={candidate.isSubscribed !== false ? 'Subscribed (Active)' : 'Unsubscribed'} />
                  <DetailItem label="Last Contact Date" value={candidate.lastContactDate || 'Never'} />
                </div>
              </div>

              {/* Group 1: Role & Experience */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Role & Experience</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
                  <DetailItem label="Executive Level" value={candidate.executiveData.executiveLevel} />
                  <DetailItem label="Function" value={candidate.executiveData.function} />
                  <DetailItem label="Current Co. Tenure" value={candidate.executiveData.currentCompanyTenure} />
                  <DetailItem label="Current Role Tenure" value={candidate.executiveData.currentRoleTenure} />
                  <DetailItem label="Career Velocity" value={candidate.executiveData.careerVelocity} />
                  <DetailItem label="Industry Exp." value={candidate.executiveData.industryExperience} />
                  <DetailItem label="Co. Size Exp." value={candidate.executiveData.companySizeExperience} />
                  <DetailItem label="Public Co. Exp." value={candidate.executiveData.publicCompanyExperience} />
                  <DetailItem label="PE-Backed Exp." value={candidate.executiveData.peBackedExperience} />
                  <DetailItem label="Geographic Exp." value={candidate.executiveData.geographicExperience} />
                  <DetailItem label="Global Exp." value={candidate.executiveData.globalExperience} />
                  <DetailItem label="Board Exp." value={candidate.executiveData.boardExperience} />
                </div>
              </div>

              {/* Group 2: Background & Credentials */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Background & Credentials</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
                  <DetailItem label="Education" value={candidate.executiveData.education} />
                  <DetailItem label="Certifications" value={candidate.executiveData.certifications} />
                  <div className="col-span-2"><DetailItem label="Areas of Expertise" value={candidate.executiveData.areasOfExpertise} /></div>
                  <DetailItem label="Executive Archetype" value={candidate.executiveData.executiveArchetype} />
                </div>
              </div>

              {/* Group 3: Mobility & Structural */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Mobility & Structural</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
                  <DetailItem label="Current Comp." value={candidate.executiveData.currentCompensation} />
                  <DetailItem label="Equity Type" value={candidate.executiveData.currentEquityType} />
                  <DetailItem label="Equity Shares" value={candidate.executiveData.currentEquityShares} />
                  <DetailItem label="Candidate P&L" value={candidate.executiveData.candidatePandL} />
                  <DetailItem label="Mobility Indicator" value={candidate.executiveData.mobilityIndicator} />
                  <DetailItem label="Career Trajectory" value={candidate.executiveData.careerTrajectory} />
                  <DetailItem label="Relocation Willingness" value={candidate.executiveData.relocationWillingness} />
                  <DetailItem label="Notice Period" value={candidate.executiveData.noticePeriod} />
                  <DetailItem label="Non-Compete" value={candidate.executiveData.nonCompete} />
                  <DetailItem label="Garden Leave" value={candidate.executiveData.gardenLeave} />
                </div>
              </div>
              
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* Interview Feedback Row */}
        <Accordion.Item value="feedback" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 text-left group">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0 bg-amber-50 rounded-2xl border border-amber-200">
                  <Star className="w-7 h-7 text-amber-500 fill-amber-400 stroke-amber-600" />
                  <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-amber-600 text-white px-1.5 py-0.2 rounded-full shadow-xs">
                    {avgRating}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 block text-base">
                      Interview Feedback & Evaluations
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {totalFeedbackCount} Giver{totalFeedbackCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium mt-0.5">
                    <span>Average 10-Star Rating: <strong className="text-slate-800">{avgRating} / 10</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Consensus Recommend to Hire</span>
                  </div>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 pt-0 overflow-hidden text-sm data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="pt-2">
              
              {/* Actions & Overview Banner */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Multi-Stakeholder Feedback Consensus
                  </h5>
                  <p className="text-xs text-slate-600">
                    Structured qualitative assessments, 10-star scores, and signals attributed to individual committee members.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Submit Feedback
                  </button>
                  {onNavigateToEvaluations && (
                    <button
                      type="button"
                      onClick={onNavigateToEvaluations}
                      className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      View All Evaluations
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Specific Feedback Giver Cards */}
              <div className="space-y-4">
                {feedbackList.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.giver.avatarUrl}
                          alt={item.giver.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{item.giver.name}</h4>
                            <span className="text-[10px] text-slate-500 font-medium">({item.giver.department})</span>
                          </div>
                          <div className="text-[11px] text-slate-600">{item.giver.title}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* 10-Star Rating */}
                        <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-200 px-2.5 py-1 rounded-lg">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= item.rating
                                    ? 'text-amber-500 fill-amber-400'
                                    : 'text-slate-200 fill-transparent'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-amber-950 ml-0.5">
                            {item.rating}/10
                          </span>
                        </div>

                        {/* Recommendation badge */}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.recommendation === 'strong_hire' ? 'Strong Yes' : item.recommendation === 'hire' ? 'Yes' : 'Neutral'}
                        </span>
                      </div>
                    </div>

                    {/* Interview Stage & Date */}
                    <div className="py-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="font-medium text-slate-700">{item.stage}</span>
                      <span>{item.date}</span>
                    </div>

                    {/* Quick Tags specific to this giver */}
                    {item.quickTags && item.quickTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 pb-2.5">
                        {item.quickTags.map((tag, tIdx) => {
                          const isNegative = tag.startsWith('-') || tag.startsWith('~');
                          return (
                            <span
                              key={tIdx}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                isNegative
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Summary Notes Quote */}
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100 italic">
                      "{item.summaryNotes}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer link to switch to Evaluations tab */}
              {onNavigateToEvaluations && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={onNavigateToEvaluations}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    View detailed competency breakdowns & candidate quotes in Evaluations tab &rarr;
                  </button>
                </div>
              )}

            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* Behavioral Score Row */}
        <Accordion.Item value="behavioral" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 text-left group">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4.5" fill="transparent" className="text-slate-100" />
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4.5" fill="transparent" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={(2 * Math.PI * 24) - (behavioralScore / 100) * (2 * Math.PI * 24)} className="text-emerald-500" strokeLinecap="round" />
                  </svg>
                  <span className="text-lg font-bold text-emerald-600">{behavioralScore}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block text-base">Behavioral Assessment</span>
                  <span className="text-[13px] text-slate-500 font-medium mt-0.5 block">High Growth Alignment</span>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 pt-0 overflow-hidden text-sm data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="pt-2 ml-[72px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider"><Sparkles className="w-4 h-4 text-emerald-600" /> AI Summary</div>
                <div className="flex items-center gap-4 text-xs font-medium text-blue-600">
                  <a href="#" className="flex items-center gap-1 hover:underline">View Assessment</a>
                  <a href="#" className="flex items-center gap-1 hover:underline"><Share className="w-3.5 h-3.5" /> Share</a>
                </div>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-slate-700 leading-relaxed">
                Candidate exhibits highly decisive leadership traits with exceptional cross-functional influence. The score indicates strong adaptability, making them highly suitable for navigating organizational transitions and aligning with high-growth environments.
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* EMI Score Row */}
        <Accordion.Item value="emi" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 text-left group">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4.5" fill="transparent" className="text-slate-100" />
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4.5" fill="transparent" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={(2 * Math.PI * 24) - (emiScore / 100) * (2 * Math.PI * 24)} className="text-blue-600" strokeLinecap="round" />
                  </svg>
                  <span className="text-lg font-bold text-blue-600">{emiScore}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block text-base">EMI (Executive Mobility Indicator)</span>
                  <span className="text-[13px] text-slate-500 font-medium mt-0.5 block">High Receptivity Signal</span>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 pt-0 overflow-hidden text-sm data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="pt-2 ml-[72px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider"><Sparkles className="w-4 h-4 text-blue-600" /> AI Summary</div>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-slate-700 leading-relaxed mb-6">
                This EMI score signals high receptivity. The candidate is approaching a major equity vesting cliff and shows strong motivation alignment for scale expansion, matching your requisition perfectly.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Push */}
                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                   <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">Why they will move <span className="text-slate-500 font-medium text-xs">(Push)</span></h5>
                   <ul className="space-y-3">
                     <li className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                       <span className="text-[13px] text-slate-700 leading-relaxed">4-year equity cliff approaches in 60 days.</span>
                     </li>
                     <li className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                       <span className="text-[13px] text-slate-700 leading-relaxed">Current company stock dropped 15% in Q3.</span>
                     </li>
                   </ul>
                 </div>
                 {/* Pull */}
                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                   <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">Why they want this role <span className="text-slate-500 font-medium text-xs">(Pull)</span></h5>
                   <ul className="space-y-3">
                     <li className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                       <span className="text-[13px] text-slate-700 leading-relaxed">Title step-up from VP to C-Level role.</span>
                     </li>
                     <li className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                       <span className="text-[13px] text-slate-700 leading-relaxed">Mentioned wanting a mid-cap leadership role in 2024 (CRM Notes).</span>
                     </li>
                   </ul>
                 </div>
                 {/* Friction */}
                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                   <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">Known Friction <span className="text-slate-500 font-medium text-xs">(Structural)</span></h5>
                   <ul className="space-y-3">
                     <li className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                       <span className="text-[13px] text-slate-700 leading-relaxed">Compensation gap: Candidate base expectations ($400K) vs. Budget.</span>
                     </li>
                     <li className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                       <span className="text-[13px] text-slate-700 leading-relaxed">Requires relocation or significant hybrid travel to Chicago.</span>
                     </li>
                   </ul>
                 </div>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* In The News */}
        <Accordion.Item value="news" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 text-left group">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-900">In The News</span>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 pt-0 overflow-hidden text-sm data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            
            <div className="flex items-center justify-between mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col">
                <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <Bot className="w-4.5 h-4.5 text-blue-600" />
                  Agent Nurturing
                </h4>
                <p className="text-slate-500 text-xs mt-1 max-w-lg">
                  Automatically generate and schedule a personalized email campaign based on the latest news sentiment.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">Enable Agent Nurturing</span>
                  <Switch.Root 
                    checked={outreachEnabled}
                    onCheckedChange={setOutreachEnabled}
                    className={cn(
                      "w-[42px] h-[24px] rounded-full relative outline-none cursor-pointer transition-colors flex items-center px-[2px]",
                      outreachEnabled ? "bg-blue-600" : "bg-slate-300"
                    )}
                  >
                    <Switch.Thumb 
                      className={cn(
                        "block w-[20px] h-[20px] bg-white rounded-full transition-transform shadow-sm",
                        outreachEnabled ? "translate-x-[18px]" : "translate-x-0"
                      )}
                    />
                  </Switch.Root>
                </div>
                <button 
                  onClick={() => setIsAgentModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm underline underline-offset-2 transition-colors ml-2"
                >
                  configure agent
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Last 30 days</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">High Velocity</span>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  Coverage focuses on {candidate.firstName} {candidate.lastName}'s executive charter at {candidate.company}, alongside major corporate announcements including next-gen infrastructure investments, strategic partnerships, and quarterly growth execution.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Last 60 days</h3>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Corporate Scale</span>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  Market analysis highlights {candidate.company}'s expanding enterprise AI deployments and margin resilience. Reporting links leadership effectiveness to the company's broader positioning against macroeconomic headwinds.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Last 90 days</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">PTM Signal</span>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  Institutional publications synthesize {candidate.company}'s capital allocation strategy and governance shifts. Themes of continuity, enterprise expansion, and strategic talent retention dominate industry reporting.
                </p>
              </div>
            </div>

            {/* Filter Pills for All / Executive Publications / Company Publications */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setNewsFilter('all')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                    newsFilter === 'all'
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  )}
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>All Intelligence ({allPublications.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewsFilter('executive')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                    newsFilter === 'executive'
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Executive Mentions ({executiveCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewsFilter('company')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                    newsFilter === 'company'
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  )}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Company Publications: {candidate.company} ({companyCount})</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-medium px-2">
                Showing {filteredPublications.length} verified publications
              </span>
            </div>

            {/* List of Publications */}
            <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col divide-y divide-slate-100 bg-white">
              {filteredPublications.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-start justify-between gap-3"
                >
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Publication Type Indicator Badge */}
                      {item.type === 'executive' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <User className="w-3 h-3" />
                          Executive Mention
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Building2 className="w-3 h-3" />
                          Company Publication · {candidate.company}
                        </span>
                      )}

                      <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                        {item.source}
                      </span>

                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {item.tag}
                      </span>
                    </div>

                    <h4 className="text-slate-900 font-bold text-sm group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-slate-500 text-xs leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-start pt-1 text-slate-400 group-hover:text-slate-700">
                    <span className="text-[12px] font-medium text-slate-500">{item.date}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>

      </Accordion.Root>
    </div>
  );
}
