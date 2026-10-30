import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  Users, 
  Building2, 
  CheckCircle2, 
  Crown, 
  Layers, 
  Video, 
  FileText, 
  Search, 
  Plus,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { 
  DealRoom, 
  DealRoomTemplate, 
  dealRoomTemplates, 
  DealRoomStakeholder, 
  StakeholderType,
  FinancialOfferModel,
  DealRoomStage
} from '../../data/dealRoomsData';
import { mockCandidates } from '../../data/mockData';
import { cn } from '../../lib/utils';

interface CreateDealRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDealRoom: (dealRoom: DealRoom) => void;
}

export function CreateDealRoomModal({
  isOpen,
  onClose,
  onCreateDealRoom
}: CreateDealRoomModalProps) {
  // Step in wizard: 1 = Candidate Identification, 2 = Template Selection, 3 = Tag Stakeholders & Mandate
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Candidate Search & Selection
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(mockCandidates[0]);
  const [isCustomCandidate, setIsCustomCandidate] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [customCompany, setCustomCompany] = useState('');

  // Template Selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(dealRoomTemplates[0].id);

  // Mandate details
  const [targetRole, setTargetRole] = useState('Chief Technology Officer');
  const [department, setDepartment] = useState('Engineering & AI Platforms');
  const [roomTitle, setRoomTitle] = useState('');

  // Selected Stakeholders to tag
  const [taggedStakeholders, setTaggedStakeholders] = useState<DealRoomStakeholder[]>([
    {
      id: 'stk-init-1',
      name: 'Dr. Julian Sterling',
      roleTitle: 'Founder & Chief Executive Officer',
      stakeholderType: 'Company CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
      email: 'julian.sterling@phenom.com',
      isPrimaryContact: false
    },
    {
      id: 'stk-init-2',
      name: 'Elena Rostova',
      roleTitle: 'VP of Engineering & Search Sponsor',
      stakeholderType: 'Hiring Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80',
      email: 'elena.rostova@phenom.com',
      isPrimaryContact: true
    },
    {
      id: 'stk-init-3',
      name: 'Claire Beauchamp',
      roleTitle: 'Executive Assistant to the CEO',
      stakeholderType: 'Executive Assistant',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80',
      email: 'claire.beauchamp@phenom.com',
      isPrimaryContact: false
    },
    {
      id: 'stk-init-4',
      name: 'Marcus Vance',
      roleTitle: 'Lead Independent Board Director',
      stakeholderType: 'Board Member',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
      email: 'marcus.vance@sequoia-allies.com',
      isPrimaryContact: false
    }
  ]);

  if (!isOpen) return null;

  const filteredCandidates = mockCandidates.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.company.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const selectedTemplate = dealRoomTemplates.find(t => t.id === selectedTemplateId) || dealRoomTemplates[0];

  const candidateDisplayName = isCustomCandidate 
    ? (customName || 'Executive Candidate') 
    : `${selectedCandidate.firstName} ${selectedCandidate.lastName}`;

  const candidateDisplayEmail = isCustomCandidate 
    ? (customEmail || 'candidate@example.com') 
    : selectedCandidate.email;

  const candidateDisplayCompany = isCustomCandidate 
    ? (customCompany || 'Independent') 
    : selectedCandidate.company;

  const candidateDisplayRole = isCustomCandidate 
    ? (customRole || 'Executive') 
    : selectedCandidate.role;

  const candidateDisplayAvatar = isCustomCandidate 
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80' 
    : (selectedCandidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80');

  const handleFinishCreate = () => {
    // Generate stages based on selected template
    const stages: DealRoomStage[] = selectedTemplate.stageNames.map((stgName, idx) => {
      const stageId = `stg-${Date.now()}-${idx + 1}`;
      return {
        id: stageId,
        name: `Stage ${idx + 1}: ${stgName}`,
        order: idx + 1,
        status: idx === 0 ? 'current' : 'locked',
        description: `Dedicated milestone workspace for ${stgName}.`,
        widgets: idx === 0 ? [
          {
            id: `w-${Date.now()}-1`,
            type: 'ceo_welcome_video',
            title: 'Personal Welcome from CEO & Strategic Mandate',
            description: 'Exclusive video briefing from Dr. Julian Sterling.',
            stageId: stageId,
            order: 1,
            isRequiredMilestone: false,
            isCompleted: true
          },
          {
            id: `w-${Date.now()}-2`,
            type: 'nda_agreement',
            title: 'Mutual Executive Non-Disclosure Agreement (NDA)',
            description: 'Bilateral confidentiality gate for sensitive roadmaps.',
            stageId: stageId,
            order: 2,
            isRequiredMilestone: true,
            isCompleted: false
          }
        ] : idx === 1 ? [
          {
            id: `w-${Date.now()}-3`,
            type: 'opportunity_strategic',
            title: 'The Executive Mandate & Strategic Context',
            description: '3-Year organizational scale, board mandate, and architecture trajectory.',
            stageId: stageId,
            order: 1,
            isRequiredMilestone: false,
            isCompleted: false
          },
          {
            id: `w-${Date.now()}-4`,
            type: 'deal_team',
            title: 'Executive Sponsors & Deal Team',
            description: 'Direct access lines to CEO, Hiring Manager, Board Members, and EA.',
            stageId: stageId,
            order: 2,
            isRequiredMilestone: false,
            isCompleted: false
          }
        ] : idx === 3 ? [
          {
            id: `w-${Date.now()}-5`,
            type: 'equity_calculator',
            title: 'Executive Total Compensation & Equity Scenario Modeler',
            description: 'Simulate base, target bonus, and 4-year equity realization.',
            stageId: stageId,
            order: 1,
            isRequiredMilestone: true,
            isCompleted: false
          }
        ] : [
          {
            id: `w-${Date.now()}-6`,
            type: 'document_attachments',
            title: 'Confidential Executive Document Vault',
            description: 'Strategic briefs, compensation deck, and board memos.',
            stageId: stageId,
            order: 1,
            isRequiredMilestone: false,
            isCompleted: false
          }
        ]
      };
    });

    const initialFinancialModel: FinancialOfferModel = {
      baseSalary: 450000,
      targetBonusPercent: 50,
      equityGrantValue: 1400000,
      sharesCount: 52000,
      currentStrikePrice: 24.50,
      currentSharePrice: 26.92,
      currentCompanyValuationBillion: 12.0,
      bullCaseValuationMultiplier: 3.5,
      vestingYears: 4,
      vestingSchedule: '4-Year Monthly (25% 1-Yr Cliff)',
      signingBonus: 100000,
      relocationAllowance: 50000
    };

    const newDealRoom: DealRoom = {
      id: `dr-${Date.now()}`,
      title: roomTitle.trim() || `${candidateDisplayName} · ${targetRole} Executive Opportunity Room`,
      candidateId: isCustomCandidate ? `c-custom-${Date.now()}` : selectedCandidate.id,
      candidateName: candidateDisplayName,
      candidateEmail: candidateDisplayEmail,
      candidateCurrentRole: candidateDisplayRole,
      candidateCurrentCompany: candidateDisplayCompany,
      candidateAvatarUrl: candidateDisplayAvatar,
      candidateLocation: isCustomCandidate ? 'San Francisco, CA' : (selectedCandidate.location || 'San Francisco, CA'),
      targetRole,
      department,
      status: 'Draft',
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      createdAt: 'Today',
      lastActive: 'Just now',
      leadRecruiter: 'Brian Stepan',
      currentStageId: stages[0].id,
      stages,
      stakeholders: taggedStakeholders,
      attachments: [
        {
          id: `att-init-1`,
          fileName: 'Phenom_2027_Executive_Strategic_Brief.pdf',
          fileSize: '3.4 MB',
          category: 'Strategic Brief',
          uploadedAt: 'Today',
          isConfidential: true,
          downloadCount: 0
        },
        {
          id: `att-init-2`,
          fileName: 'Mutual_Executive_NDA_Standard_Bilateral.pdf',
          fileSize: '420 KB',
          category: 'Legal & NDA',
          uploadedAt: 'Today',
          isConfidential: true,
          downloadCount: 0
        }
      ],
      financialModel: initialFinancialModel,
      deliveryConfig: {
        channels: ['secure_email_link', 'executive_sms_direct'],
        accessCodeRequired: true,
        viewsCount: 0,
        totalTimeMinutes: 0
      }
    };

    onCreateDealRoom(newDealRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-(--color-secondary-200) text-white">
                New Executive Opportunity Room
              </span>
              <span className="text-xs text-slate-500 font-medium">Step {step} of 3</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {step === 1 && "Identify Individual Executive Candidate"}
              {step === 2 && "Select Branded Experience Template"}
              {step === 3 && "Tag In Key Leadership Sponsors & Mandate"}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
          {/* STEP 1: IDENTIFY EXECUTIVE CANDIDATE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-xs">
                  Each opportunity room is hyper-personalized to an individual executive candidate. Select an existing candidate from your pipeline or enter custom details.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCustomCandidate(!isCustomCandidate)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer shrink-0 ml-2"
                >
                  {isCustomCandidate ? '← Pick from pipeline' : '+ Enter new candidate'}
                </button>
              </div>

              {!isCustomCandidate ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search executive candidates by name, company, or title..."
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto p-1">
                    {filteredCandidates.slice(0, 8).map((cand) => {
                      const isSelected = selectedCandidate?.id === cand.id;
                      return (
                        <div
                          key={cand.id}
                          onClick={() => setSelectedCandidate(cand)}
                          className={cn(
                            "p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left",
                            isSelected 
                              ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs" 
                              : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                          )}
                        >
                          <img 
                            src={cand.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80'} 
                            alt={cand.firstName}
                            className="w-10 h-10 rounded-xl object-cover shrink-0" 
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-900 block truncate text-xs">
                              {cand.firstName} {cand.lastName}
                            </span>
                            <span className="text-[11px] text-slate-600 block truncate">
                              {cand.role}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium block truncate">
                              {cand.company} · {cand.location?.split(',')[0]}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. David Sterling"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="david.sterling@acme.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Current Executive Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. EVP of Platform Infrastructure"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Current Company</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Snowflake"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Selected Candidate Summary Banner */}
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-(--color-secondary-200) text-white flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      Target Executive: {candidateDisplayName}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {candidateDisplayRole} at {candidateDisplayCompany}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-100 px-2 py-0.5 rounded">
                  Identified
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: TEMPLATE SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                Select from enterprise templates pre-loaded with CEO Welcome Videos, strategic company overviews, and structured milestone stages. You won't have to start from scratch.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dealRoomTemplates.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                        isSelected 
                          ? "bg-purple-50/70 border-purple-400 ring-2 ring-purple-500/20 shadow-xs" 
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                            {tpl.category}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {tpl.name}
                        </h4>
                        <p className="text-xs text-purple-900/80 font-medium mb-2">
                          "{tpl.tagline}"
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-600">
                        <span>{tpl.stageNames.length} Stages Pre-Configured</span>
                        <span className="font-semibold text-purple-700">{tpl.widgetCount} Pre-loaded Widgets</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Template Pre-loaded Preview Callout */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Pre-Loaded Assets in "{selectedTemplate.name}":
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>HD Welcome Video from CEO Julian Sterling</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Mutual Bilateral Executive NDA Gate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Strategic 3-Year Opportunity Mandate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Executive Equity & Total Comp Modeler</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TAG STAKEHOLDERS & MANDATE */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                Configure the target executive mandate and tag in key leadership sponsors (CEO, Hiring Manager, Board Members, EA). You can also tag more sponsors at any time later.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Role Title *</label>
                  <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Department</label>
                  <input 
                    type="text" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Opportunity Room Branded Display Title</label>
                <input 
                  type="text" 
                  placeholder={`${candidateDisplayName} · ${targetRole} Executive Opportunity Room`}
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              {/* Tagged Stakeholders List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
                    Tagged Leadership Sponsors ({taggedStakeholders.length})
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Additional sponsors can be tagged at any point
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {taggedStakeholders.map((stk) => (
                    <div 
                      key={stk.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={stk.avatarUrl} alt={stk.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate text-xs">
                            {stk.name}
                          </span>
                          <span className="text-[10px] text-purple-700 font-semibold block truncate">
                            {stk.stakeholderType}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        Tagged
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer text-xs"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer text-xs"
            >
              Cancel
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as 2 | 3)}
                className="px-5 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishCreate}
                className="px-5 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Create Branded Opportunity Room</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
