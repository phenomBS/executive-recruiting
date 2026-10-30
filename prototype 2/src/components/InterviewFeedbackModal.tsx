import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Star, Sparkles, UserCheck, Plus, Check } from 'lucide-react';
import { Candidate, FeedbackGiver, InterviewFeedback } from '../types';
import { useInterviewFeedback } from '../context/InterviewFeedbackContext';

interface InterviewFeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
}

const PRESET_GIVERS: FeedbackGiver[] = [
  {
    id: 'g-1',
    name: 'Dr. Sarah Jenkins',
    title: 'VP of Executive Talent & Search Committee Lead',
    department: 'Executive Search & Governance',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    email: 'sjenkins@execsearch.example.com'
  },
  {
    id: 'g-2',
    name: 'Marcus Vance',
    title: 'Chief Technology Officer',
    department: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    email: 'mvance@techcorp.example.com'
  },
  {
    id: 'g-3',
    name: 'Elena Rostova',
    title: 'Chief People & Culture Officer',
    department: 'Human Resources & Executive Talent',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    email: 'erostova@peoplesolutions.example.com'
  },
  {
    id: 'g-4',
    name: 'David Chen',
    title: 'Independent Board Director & Audit Committee Chair',
    department: 'Board of Directors',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    email: 'dchen@boardgovernance.example.com'
  }
];

const POPULAR_QUICK_TAGS = [
  '+ Strategic Thinker',
  '+ High P&L Scale Experience',
  '+ Executive Presence',
  '+ Deep Technical Mastery',
  '+ Cultural Catalyst',
  '+ Decisive Leadership',
  '+ Talent Magnet',
  '+ Articulate Communicator',
  '+ Visionary Product Mind',
  '+ Cross-Functional Driver',
  '~ High Comp Expectation',
  '~ Requires Relocation Support',
  '~ 6-Month Notice Period'
];

export function InterviewFeedbackModal({ isOpen, onOpenChange, candidate }: InterviewFeedbackModalProps) {
  const { addFeedback } = useInterviewFeedback();

  const [selectedGiverType, setSelectedGiverType] = useState<string>(PRESET_GIVERS[0].id);
  const [customGiverName, setCustomGiverName] = useState('');
  const [customGiverTitle, setCustomGiverTitle] = useState('');
  const [stage, setStage] = useState('Executive Competency & Strategy Round');
  const [overallRating, setOverallRating] = useState<number>(9);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<InterviewFeedback['recommendation']>('strong_hire');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '+ Strategic Thinker',
    '+ Executive Presence',
    '+ High P&L Scale Experience'
  ]);
  const [customTagInput, setCustomTagInput] = useState('');
  
  // Competency Ratings
  const [competencyScores, setCompetencyScores] = useState({
    strategicVision: 9,
    executivePresence: 9,
    peopleLeadership: 9,
    operationalResilience: 8,
    innovationMindset: 9
  });

  const [strengthsText, setStrengthsText] = useState('Clear articulation of enterprise scale operations and cross-functional leadership.');
  const [risksText, setRisksText] = useState('Compensation expectations benchmarked at upper quartile.');
  const [summaryNotes, setSummaryNotes] = useState('Candidate demonstrated exceptional leadership depth and direct strategic alignment.');
  const [quoteHighlight, setQuoteHighlight] = useState('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      setSelectedTags([...selectedTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let giver: FeedbackGiver;
    if (selectedGiverType === 'custom') {
      giver = {
        id: `g-custom-${Date.now()}`,
        name: customGiverName.trim() || 'Interviewer',
        title: customGiverTitle.trim() || 'Executive Interviewer',
        department: 'Search Committee',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&q=80',
        email: 'interviewer@phenom.example.com'
      };
    } else {
      giver = PRESET_GIVERS.find(g => g.id === selectedGiverType) || PRESET_GIVERS[0];
    }

    const todayStr = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date());

    const newFeedback: Omit<InterviewFeedback, 'id'> = {
      candidateId: candidate.id,
      giver,
      stage,
      date: todayStr,
      rating: overallRating,
      recommendation,
      quickTags: selectedTags,
      competencyRatings: [
        { competency: 'Strategic Vision & P&L Scale', score: competencyScores.strategicVision },
        { competency: 'Executive Presence & Communication', score: competencyScores.executivePresence },
        { competency: 'People Leadership & Cultural Impact', score: competencyScores.peopleLeadership },
        { competency: 'Operational Resilience & Agility', score: competencyScores.operationalResilience },
        { competency: 'Innovation & Disruption Mindset', score: competencyScores.innovationMindset }
      ],
      strengths: strengthsText.split('\n').filter(s => s.trim().length > 0),
      risksOrConcerns: risksText.split('\n').filter(s => s.trim().length > 0),
      summaryNotes: summaryNotes.trim(),
      transcriptHighlights: quoteHighlight.trim() ? [quoteHighlight.trim()] : []
    };

    addFeedback(newFeedback);
    onOpenChange(false);
  };

  const activeRating = hoverRating !== null ? hoverRating : overallRating;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col z-50 animate-scaleIn">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                  Interview Evaluation
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  {candidate.firstName} {candidate.lastName} ({candidate.company})
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Submit Interview Feedback</h2>
              <p className="text-xs text-slate-500">Record structured feedback and 1-10 star assessment specific to the feedback giver.</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Feedback Giver Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Feedback Giver (Interviewer) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_GIVERS.map(giver => (
                  <div
                    key={giver.id}
                    onClick={() => setSelectedGiverType(giver.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedGiverType === giver.id
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <img src={giver.avatarUrl} alt={giver.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{giver.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{giver.title}</div>
                    </div>
                    {selectedGiverType === giver.id && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* Or custom giver option */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedGiverType(selectedGiverType === 'custom' ? PRESET_GIVERS[0].id : 'custom')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2 flex items-center gap-1"
                >
                  {selectedGiverType === 'custom' ? 'Use standard committee member' : '+ Specify another interviewer name / title'}
                </button>
                {selectedGiverType === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Interviewer Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rachel Miller"
                        value={customGiverName}
                        onChange={e => setCustomGiverName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                        required={selectedGiverType === 'custom'}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Interviewer Title & Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Managing Director, Growth Equity"
                        value={customGiverTitle}
                        onChange={e => setCustomGiverTitle(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interview Stage & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Interview Stage / Round
                </label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium"
                >
                  <option>Round 1: Executive Competency & Vision</option>
                  <option>Round 2: Technical Architecture & Systems Deep Dive</option>
                  <option>Round 3: Leadership Philosophy & Culture Alignment</option>
                  <option>Round 4: Board Governance & Fiduciary Alignment</option>
                  <option>Partner Slate Final Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Overall Recommendation
                </label>
                <select
                  value={recommendation}
                  onChange={e => setRecommendation(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium"
                >
                  <option value="strong_hire">Strong Yes (Recommend to Hire)</option>
                  <option value="hire">Yes (Hire / Advance)</option>
                  <option value="neutral">Neutral (More Information Needed)</option>
                  <option value="do_not_hire">Do Not Hire</option>
                </select>
              </div>
            </div>

            {/* 10-Star Rating Experience */}
            <div className="bg-amber-50/40 border border-amber-200/70 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Overall Interview Rating (1 to 10 Stars) *
                </label>
                <span className="text-sm font-black text-amber-900 px-2 py-0.5 bg-amber-100/80 rounded-md">
                  {activeRating} / 10 {activeRating >= 9 ? '• Exceptional' : activeRating >= 8 ? '• Strong' : activeRating >= 6 ? '• Moderate' : '• Below Bar'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Rate the overall interview performance on the standard 10-star executive scale.</p>
              
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(starVal => (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setOverallRating(starVal)}
                    className="p-1 rounded-md hover:scale-110 transition-transform focus:outline-none"
                    title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        starVal <= activeRating
                          ? 'text-amber-500 fill-amber-400 stroke-amber-600'
                          : 'text-slate-300 fill-transparent stroke-slate-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick-Tag Features */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quick Tags (Select applicable highlights & signals)
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {selectedTags.length} selected
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2.5">
                Click to toggle executive quick-tags to rapidly summarize signals.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {POPULAR_QUICK_TAGS.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  const isNegative = tag.startsWith('-') || tag.startsWith('~');
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${
                        isSelected
                          ? isNegative
                            ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                            : 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                      {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Add custom tag */}
              <div className="flex gap-2 mt-2.5">
                <input
                  type="text"
                  placeholder="+ Add custom tag (e.g. + Deep AI Ecosystem)"
                  value={customTagInput}
                  onChange={e => setCustomTagInput(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Competency Ratings (1-10) */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Competency Scores (1 to 10 Scale)
              </h4>
              <div className="space-y-3">
                {[
                  { key: 'strategicVision', label: 'Strategic Vision & P&L Scale' },
                  { key: 'executivePresence', label: 'Executive Presence & Communication' },
                  { key: 'peopleLeadership', label: 'People Leadership & Cultural Impact' },
                  { key: 'operationalResilience', label: 'Operational Resilience & Agility' },
                  { key: 'innovationMindset', label: 'Innovation & Disruption Mindset' }
                ].map(({ key, label }) => {
                  const score = (competencyScores as any)[key];
                  return (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-700 font-medium min-w-[220px]">{label}</span>
                      <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={score}
                          onChange={e => setCompetencyScores({ ...competencyScores, [key]: Number(e.target.value) })}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-800 w-6 text-right">{score}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Qualitative Notes */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Interviewer Summary Notes *
                </label>
                <textarea
                  rows={3}
                  value={summaryNotes}
                  onChange={e => setSummaryNotes(e.target.value)}
                  placeholder="Summarize your evaluation, observations, and key takeaways..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                    Key Strengths (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={strengthsText}
                    onChange={e => setStrengthsText(e.target.value)}
                    placeholder="e.g. Demonstrated high mastery of multi-billion P&L scale..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-1.5">
                    Risks or Watchouts (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={risksText}
                    onChange={e => setRisksText(e.target.value)}
                    placeholder="e.g. Requires compensation alignment for equity cliff..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-600 focus:border-amber-600 outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Verbatim Candidate Quote or Highlight (Optional)
                </label>
                <input
                  type="text"
                  value={quoteHighlight}
                  onChange={e => setQuoteHighlight(e.target.value)}
                  placeholder='e.g. "When leading 30,000 engineers, clarity of interface is paramount."'
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Submit Feedback
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
