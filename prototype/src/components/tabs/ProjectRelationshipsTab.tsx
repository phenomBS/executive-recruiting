import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Clock, 
  Phone, 
  Video, 
  Coffee, 
  Mail, 
  Linkedin, 
  Bot, 
  Calendar, 
  MessageSquare, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  Filter, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  CandidateRelationshipRecord, 
  RecruiterContactEvent, 
  initialProjectRelationships 
} from '../../data/projectRelationshipsData';
import { cn } from '../../lib/utils';

interface ProjectRelationshipsTabProps {
  projectTitle?: string;
}

export function ProjectRelationshipsTab({ projectTitle }: ProjectRelationshipsTabProps) {
  const [candidates, setCandidates] = useState<CandidateRelationshipRecord[]>(initialProjectRelationships);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Log contact modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [recruiterName, setRecruiterName] = useState('Brian Stepan');
  const [channel, setChannel] = useState<'Phone Call' | 'Video Meeting' | 'Executive Coffee' | 'Email' | 'LinkedIn InMail' | 'Aura AI Outreach' | 'Slate Calibration'>('Phone Call');
  const [whyContacted, setWhyContacted] = useState('');
  const [summaryNotes, setSummaryNotes] = useState('');
  const [sentiment, setSentiment] = useState<'Highly Receptive' | 'Warm & Engaged' | 'Evaluating Timing' | 'Passive / Monitoring' | 'Compensation Sensitive'>('Warm & Engaged');
  const [nextAction, setNextAction] = useState('');

  // Selected candidate
  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  // Filtered candidate list for sidebar
  const filteredCandidates = candidates.filter(c => {
    if (statusFilter !== 'all' && c.relationshipStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchCompany = c.company.toLowerCase().includes(q);
      const matchRole = c.currentRole.toLowerCase().includes(q);
      return matchName || matchCompany || matchRole;
    }
    return true;
  });

  // Handle logging a new recruiter contact
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whyContacted.trim() || !summaryNotes.trim()) return;

    const newEvent: RecruiterContactEvent = {
      id: `evt-${Date.now()}`,
      recruiterName,
      recruiterTitle: recruiterName === 'Brian Stepan' 
        ? 'Lead In-House Executive Recruiter' 
        : recruiterName === 'Sarah Jenkins' 
          ? 'Senior Executive Talent Partner' 
          : 'Executive Talent Specialist',
      recruiterAvatar: recruiterName === 'Brian Stepan' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80' 
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
      contactDate: 'Just now',
      channel,
      whyContacted,
      summaryNotes,
      candidateSentiment: sentiment,
      nextAction: nextAction || 'Continue ongoing executive calibration',
      nextActionDate: 'Within 7 days'
    };

    setCandidates(prev => prev.map(cand => {
      if (cand.id === selectedCandidate.id) {
        return {
          ...cand,
          totalTouchpoints: cand.totalTouchpoints + 1,
          lastContactDate: 'Just now',
          timeline: [newEvent, ...cand.timeline]
        };
      }
      return cand;
    }));

    // Reset form
    setWhyContacted('');
    setSummaryNotes('');
    setNextAction('');
    setIsLogModalOpen(false);
  };

  const getChannelIcon = (ch: RecruiterContactEvent['channel']) => {
    switch (ch) {
      case 'Phone Call': return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'Video Meeting': return <Video className="w-4 h-4 text-blue-600" />;
      case 'Executive Coffee': return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'Email': return <Mail className="w-4 h-4 text-purple-600" />;
      case 'LinkedIn InMail': return <Linkedin className="w-4 h-4 text-sky-600" />;
      case 'Aura AI Outreach': return <Bot className="w-4 h-4 text-(--color-secondary-200)" />;
      default: return <MessageSquare className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSentimentBadge = (s: RecruiterContactEvent['candidateSentiment']) => {
    switch (s) {
      case 'Highly Receptive':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">Highly Receptive</span>;
      case 'Warm & Engaged':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">Warm & Engaged</span>;
      case 'Evaluating Timing':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">Evaluating Timing</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">{s}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px] min-h-[600px] w-full">
      
      {/* Tab Top Bar */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-slate-900">
              Candidate Relationships & Recruiter Outreach Timeline
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-(--color-secondary-200)/10 text-(--color-secondary-200) border border-(--color-secondary-200)/20">
              In-House Practice
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track which recruiter contacted each executive candidate, when, and the strategic rationale for the interaction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Recruiter Contact</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: CANDIDATE NAMES SIDEBAR */}
        {/* ============================================================== */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/40 shrink-0 h-full">
          
          {/* Sidebar Search & Filter */}
          <div className="p-3.5 border-b border-slate-200 space-y-2 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200) bg-slate-50"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-0.5">
              <span>{filteredCandidates.length} Candidates Attached</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active Dialogue">Active Dialogue</option>
                <option value="Warm Nurture">Warm Nurture</option>
                <option value="Calibrating Slate">Calibrating Slate</option>
              </select>
            </div>
          </div>

          {/* Candidate List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredCandidates.map((candidate) => {
              const isSelected = candidate.id === selectedCandidate?.id;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => setSelectedCandidateId(candidate.id)}
                  className={cn(
                    "w-full p-4 text-left transition-all flex items-start gap-3 cursor-pointer relative",
                    isSelected 
                      ? "bg-white shadow-2xs border-l-4 border-l-(--color-secondary-200)" 
                      : "hover:bg-slate-100/70 text-slate-600"
                  )}
                >
                  <img
                    src={candidate.avatarUrl}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={cn(
                        "text-xs font-bold truncate",
                        isSelected ? "text-(--color-secondary-200)" : "text-slate-900"
                      )}>
                        {candidate.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {candidate.totalTouchpoints} logs
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                      {candidate.currentRole}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                      <span className="font-semibold text-slate-700 truncate">{candidate.company}</span>
                      <span>·</span>
                      <span className="truncate">Last: {candidate.lastContactDate}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredCandidates.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No candidates found matching your search.
              </div>
            )}
          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: RECRUITER CONTACT TIMELINE */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden h-full">
          {selectedCandidate ? (
            <>
              {/* Selected Candidate Header Dossier */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedCandidate.avatarUrl}
                      alt={selectedCandidate.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl font-bold text-slate-900">
                          {selectedCandidate.name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-(--color-secondary-200)/10 text-(--color-secondary-200) border border-(--color-secondary-200)/20">
                          {selectedCandidate.relationshipStatus}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {selectedCandidate.currentRole} at <strong className="text-slate-900">{selectedCandidate.company}</strong>
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {selectedCandidate.location}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          Relationship Owner: <strong className="text-slate-800 ml-1">{selectedCandidate.leadRecruiterOwner}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Touchpoints
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {selectedCandidate.totalTouchpoints}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLogModalOpen(true)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:border-(--color-secondary-200) bg-white text-xs font-bold text-slate-700 hover:text-(--color-secondary-200) transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Note</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200/80 leading-relaxed">
                  <strong>Relationship Summary:</strong> {selectedCandidate.executiveSummary}
                </p>
              </div>

              {/* Recruiter Outreach Timeline Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-(--color-secondary-200)" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Recruiter Outreach & Contact History ({selectedCandidate.timeline.length} Events)
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Earliest Contact: {selectedCandidate.firstContactDate}
                  </span>
                </div>

                {/* Timeline Stream */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {selectedCandidate.timeline.map((event) => (
                    <div key={event.id} className="relative group">
                      {/* Timeline Node Icon Indicator */}
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-(--color-secondary-200) flex items-center justify-center shrink-0 shadow-xs ring-4 ring-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-(--color-secondary-200)" />
                      </div>

                      {/* Event Card */}
                      <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3.5 transition-all shadow-2xs">
                        
                        {/* Event Header: WHICH RECRUITER CONTACTED & WHEN */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={event.recruiterAvatar}
                              alt={event.recruiterName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900">
                                  {event.recruiterName}
                                </span>
                                <span className="text-[11px] text-slate-400">·</span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {event.recruiterTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  {getChannelIcon(event.channel)}
                                  {event.channel}
                                </span>
                                <span>·</span>
                                <span>{event.contactDate}</span>
                              </div>
                            </div>
                          </div>

                          <div className="self-start sm:self-auto">
                            {getSentimentBadge(event.candidateSentiment)}
                          </div>
                        </div>

                        {/* WHY THE RECRUITER CONTACTED THIS CANDIDATE (Highlighted Banner) */}
                        <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/70 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-purple-900 uppercase tracking-wider text-[10px] mb-1">
                            <AlertCircle className="w-3.5 h-3.5 text-purple-700" />
                            Why Contacted:
                          </div>
                          <p className="font-semibold text-purple-950 leading-relaxed">
                            {event.whyContacted}
                          </p>
                        </div>

                        {/* Summary Notes & Conversation Insights */}
                        <div className="text-xs text-slate-700 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Touchpoint Notes & Key Findings
                          </span>
                          <p className="leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80 text-slate-800">
                            {event.summaryNotes}
                          </p>
                        </div>

                        {/* Next Actions */}
                        {event.nextAction && (
                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800">Next Step:</span>
                              <span>{event.nextAction}</span>
                            </div>
                            {event.nextActionDate && (
                              <span className="text-[11px] font-semibold text-(--color-secondary-200) bg-(--color-secondary-200)/5 px-2.5 py-0.5 rounded-full border border-(--color-secondary-200)/10">
                                Target: {event.nextActionDate}
                              </span>
                            )}
                          </div>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
              <Users className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Select a candidate from the sidebar to inspect their recruiter contact timeline.</p>
            </div>
          )}
        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL: LOG RECRUITER CONTACT TOUCHPOINT */}
      {/* ============================================================== */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsLogModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Log Recruiter Contact with {selectedCandidate.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record touchpoint channel, strategic reason, and conversation outcome.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Contacting Recruiter
                  </label>
                  <select
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                  >
                    <option value="Brian Stepan">Brian Stepan (Lead Recruiter)</option>
                    <option value="Sarah Jenkins">Sarah Jenkins (Senior Partner)</option>
                    <option value="Michael Chang">Michael Chang (Search Director)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Channel / Method
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="Video Meeting">Video Meeting</option>
                    <option value="Executive Coffee">Executive Coffee</option>
                    <option value="Email">Email</option>
                    <option value="LinkedIn InMail">LinkedIn InMail</option>
                    <option value="Aura AI Outreach">Aura AI Outreach</option>
                    <option value="Slate Calibration">Slate Calibration</option>
                  </select>
                </div>
              </div>

              {/* WHY CONTACTED (Required key field) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Why Contacted (Strategic Rationale) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Followed up on SEC Form 4 vesting cliff to calibrate relocation willingness"
                  value={whyContacted}
                  onChange={(e) => setWhyContacted(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                />
              </div>

              {/* MEETING / TOUCHPOINT NOTES */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Touchpoint Notes & Key Findings <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Record executive sentiment, comp expectations, scope alignment, and questions..."
                  value={summaryNotes}
                  onChange={(e) => setSummaryNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Candidate Sentiment
                  </label>
                  <select
                    value={sentiment}
                    onChange={(e) => setSentiment(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                  >
                    <option value="Highly Receptive">Highly Receptive</option>
                    <option value="Warm & Engaged">Warm & Engaged</option>
                    <option value="Evaluating Timing">Evaluating Timing</option>
                    <option value="Passive / Monitoring">Passive / Monitoring</option>
                    <option value="Compensation Sensitive">Compensation Sensitive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Next Action
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule slate review"
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-(--color-secondary-200) text-white text-xs font-bold hover:bg-(--bg-brand-secondary-hover) shadow-sm"
                >
                  Save to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
