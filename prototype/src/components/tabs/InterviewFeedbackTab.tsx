import React, { useState } from 'react';
import { Candidate, InterviewFeedback } from '../../types';
import { useInterviewFeedback } from '../../context/InterviewFeedbackContext';
import { InterviewFeedbackModal } from '../InterviewFeedbackModal';
import { 
  Star, 
  Plus, 
  MessageSquare, 
  UserCheck, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle2, 
  Quote, 
  Filter, 
  Sparkles,
  TrendingUp,
  Tag,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface InterviewFeedbackTabProps {
  candidate: Candidate;
  onOpenSubmitModal?: () => void;
}

export function InterviewFeedbackTab({ candidate, onOpenSubmitModal }: InterviewFeedbackTabProps) {
  const { getFeedbackForCandidate, deleteFeedback } = useInterviewFeedback();
  const feedbackList = getFeedbackForCandidate(candidate.id);

  const [selectedGiverFilter, setSelectedGiverFilter] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Compute aggregate stats
  const totalCount = feedbackList.length;
  const avgRating = totalCount > 0 
    ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / totalCount).toFixed(1)
    : '0';

  const strongHireCount = feedbackList.filter(f => f.recommendation === 'strong_hire').length;
  const hireCount = feedbackList.filter(f => f.recommendation === 'hire').length;
  const neutralCount = feedbackList.filter(f => f.recommendation === 'neutral').length;
  const doNotHireCount = feedbackList.filter(f => f.recommendation === 'do_not_hire').length;

  // Aggregate quick tags
  const tagCounts: { [tag: string]: number } = {};
  feedbackList.forEach(f => {
    f.quickTags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Unique feedback givers for filtering
  const distinctGivers = Array.from(
    new Map(feedbackList.map(item => [item.giver.id, item.giver])).values()
  );

  const displayedFeedbacks = selectedGiverFilter === 'all'
    ? feedbackList
    : feedbackList.filter(f => f.giver.id === selectedGiverFilter);

  const getRecommendationBadge = (rec: InterviewFeedback['recommendation']) => {
    switch (rec) {
      case 'strong_hire':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Strong Yes • Recommend to Hire
          </span>
        );
      case 'hire':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
            Yes • Recommend to Advance
          </span>
        );
      case 'neutral':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Neutral • Calibration Needed
          </span>
        );
      case 'do_not_hire':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Do Not Hire
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
      
      {/* Submit Modal */}
      <InterviewFeedbackModal
        isOpen={isSubmitModalOpen}
        onOpenChange={setIsSubmitModalOpen}
        candidate={candidate}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
              Evaluations & Interview Feedback
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-medium text-slate-300">
              {totalCount} Completed Evaluation{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Interview Feedback for {candidate.firstName} {candidate.lastName}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consolidated interview evaluations captured directly from each specific feedback giver with 1-10 star ratings, quick tags, and competency benchmarks.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="self-start md:self-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-blue-500/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Submit Interview Feedback
        </button>
      </div>

      {/* Aggregate Consensus Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: 10-Star Rating Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              10-Star Scale
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{avgRating}</span>
            <span className="text-sm font-semibold text-slate-400">/ 10</span>
          </div>
          
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => {
              const isFilled = s <= Math.round(Number(avgRating));
              return (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    isFilled ? 'text-amber-500 fill-amber-400' : 'text-slate-200 fill-slate-100'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            Across {totalCount} evaluator{totalCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Card 2: Consensus Recommendation */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hiring Consensus</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-base font-bold text-slate-900">
              {strongHireCount + hireCount > 0 ? (
                <span className="text-emerald-700">
                  {Math.round(((strongHireCount + hireCount) / totalCount) * 100)}% Recommend
                </span>
              ) : 'Pending Review'}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-emerald-700 font-semibold">{strongHireCount} Strong Yes</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-700 font-medium">{hireCount} Yes</span>
              {neutralCount > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-600 font-medium">{neutralCount} Neutral</span>
                </>
              )}
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3 flex">
            <div style={{ width: `${(strongHireCount / totalCount) * 100}%` }} className="bg-emerald-500 h-full" />
            <div style={{ width: `${(hireCount / totalCount) * 100}%` }} className="bg-blue-500 h-full" />
            <div style={{ width: `${(neutralCount / totalCount) * 100}%` }} className="bg-amber-400 h-full" />
            <div style={{ width: `${(doNotHireCount / totalCount) * 100}%` }} className="bg-rose-500 h-full" />
          </div>
        </div>

        {/* Card 3: Feedback Givers Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feedback Givers</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex -space-x-2 overflow-hidden py-1">
            {distinctGivers.map((giver, idx) => (
              <img
                key={giver.id || idx}
                src={giver.avatarUrl}
                alt={giver.name}
                title={`${giver.name} (${giver.title})`}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm"
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Specific evaluations from search lead, CTO, CPO, and Board.
          </p>
        </div>

        {/* Card 4: Top Quick Tags */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Quick Tags</span>
            <Tag className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {topTags.slice(0, 3).map(([tag, count]) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
              >
                {tag} ({count})
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">High consensus signal tags</span>
        </div>

      </div>

      {/* Filter by Feedback Giver Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filter by Feedback Giver:
          </span>
          <button
            onClick={() => setSelectedGiverFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedGiverFilter === 'all'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Givers ({feedbackList.length})
          </button>
          {distinctGivers.map(giver => (
            <button
              key={giver.id}
              onClick={() => setSelectedGiverFilter(giver.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedGiverFilter === giver.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <img src={giver.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
              {giver.name.replace('Dr. ', '')}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {displayedFeedbacks.length} feedback record{displayedFeedbacks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* List of Feedback Specific to Each Feedback Giver */}
      <div className="space-y-6">
        {displayedFeedbacks.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-all"
          >
            
            {/* Card Header: Specific Feedback Giver Information */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={item.giver.avatarUrl}
                  alt={item.giver.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{item.giver.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                      {item.giver.department}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    {item.giver.title}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" /> {item.stage}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating & Recommendation Callout */}
              <div className="flex flex-col md:items-end gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  {getRecommendationBadge(item.recommendation)}
                </div>
                
                {/* 10-Star Rating Visual */}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= item.rating
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-900 ml-1">
                    {item.rating} <span className="text-[10px] text-slate-400 font-normal">/ 10</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tags specific to this interviewer */}
            {item.quickTags && item.quickTags.length > 0 && (
              <div className="px-6 py-3.5 border-b border-slate-100 bg-white flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Quick Tags:
                </span>
                {item.quickTags.map((tag, idx) => {
                  const isNegative = tag.startsWith('-') || tag.startsWith('~');
                  return (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
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

            {/* Main Content Area */}
            <div className="p-6 space-y-6">
              
              {/* Interviewer Summary Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  Interviewer Evaluation Summary
                </h4>
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed font-normal">
                  {item.summaryNotes}
                </div>
              </div>

              {/* Transcript or Quote Highlight */}
              {item.transcriptHighlights && item.transcriptHighlights.length > 0 && (
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-indigo-600" />
                    Key Candidate Quotes & Signals Captured During Interview
                  </div>
                  <div className="space-y-1.5">
                    {item.transcriptHighlights.map((quote, qIdx) => (
                      <p key={qIdx} className="text-xs italic text-indigo-950 font-medium leading-relaxed">
                        {quote}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Competencies 1-10 Breakdown */}
              {item.competencyRatings && item.competencyRatings.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Competency Scores (1 to 10 Scale)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.competencyRatings.map((comp, cIdx) => (
                      <div key={cIdx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                          <span>{comp.competency}</span>
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {comp.score} / 10
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                          <div
                            style={{ width: `${(comp.score / 10) * 100}%` }}
                            className={`h-full rounded-full ${
                              comp.score >= 9 ? 'bg-emerald-500' : comp.score >= 8 ? 'bg-blue-600' : 'bg-amber-500'
                            }`}
                          />
                        </div>
                        {comp.notes && (
                          <p className="text-[11px] text-slate-500 leading-normal italic">
                            "{comp.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strengths */}
                {item.strengths && item.strengths.length > 0 && (
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4">
                    <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Observed Strengths
                    </h5>
                    <ul className="space-y-2">
                      {item.strengths.map((s, sIdx) => (
                        <li key={sIdx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risks or Concerns */}
                {item.risksOrConcerns && item.risksOrConcerns.length > 0 && (
                  <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-4">
                    <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Risks / Calibration Items
                    </h5>
                    <ul className="space-y-2">
                      {item.risksOrConcerns.map((r, rIdx) => (
                        <li key={rIdx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
