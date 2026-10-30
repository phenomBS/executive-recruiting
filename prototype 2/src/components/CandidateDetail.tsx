import React, { useState } from 'react';
import { Candidate } from '../types';
import { CandidateHeader } from './CandidateHeader';
import { CandidateTabs } from './CandidateTabs';
import { Briefcase, ChevronDown, MoreVertical, MapPin, FileText, AlertTriangle, Star, Plus, CheckCircle2 } from 'lucide-react';
import { useRestricted } from '../context/RestrictedContext';
import { useInterviewFeedback } from '../context/InterviewFeedbackContext';
import { InterviewFeedbackModal } from './InterviewFeedbackModal';
import { useRouter } from '../context/RouterContext';
import { mockCandidates } from '../data/mockData';

interface CandidateDetailProps {
  candidate: Candidate;
}

export function CandidateDetail({ candidate }: CandidateDetailProps) {
  const router = useRouter();
  const { restrictedCompanies } = useRestricted();
  const restrictedInfo = restrictedCompanies.find(rc => rc.name === candidate.company);

  const { getFeedbackForCandidate } = useInterviewFeedback();
  const feedbackList = getFeedbackForCandidate(candidate.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalFeedbackCount = feedbackList.length;
  const avgRating = totalFeedbackCount > 0
    ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / totalFeedbackCount).toFixed(1)
    : '0';

  const currentIndex = mockCandidates.findIndex(c => c.id === candidate.id);
  const prevCandidate = currentIndex > 0 ? mockCandidates[currentIndex - 1] : null;
  const nextCandidate = currentIndex >= 0 && currentIndex < mockCandidates.length - 1 ? mockCandidates[currentIndex + 1] : null;

  return (
    <div className="flex flex-col w-full h-full">
      <InterviewFeedbackModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        candidate={candidate}
      />

      {restrictedInfo && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider">Restricted: Do Not Contact</h4>
            <p className="text-sm text-red-600 mt-0.5">This candidate's company ({candidate.company}) is on the restricted list. Reason: <span className="font-medium">{restrictedInfo.reason}</span></p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-slate-500 mb-4 font-medium">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.setCandidateId(null)}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Candidates
          </button>
          <span>›</span>
          <span className="text-slate-700">{candidate.firstName} {candidate.lastName}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            disabled={!prevCandidate}
            onClick={() => prevCandidate && router.setCandidateId(prevCandidate.id)}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>‹</span> Previous Candidate
          </button>
          <span className="text-slate-300">|</span>
          <button 
            disabled={!nextCandidate}
            onClick={() => nextCandidate && router.setCandidateId(nextCandidate.id)}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next Candidate <span className="font-bold">›</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6 w-full">
        {/* Left Column - Main Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <CandidateHeader candidate={candidate} />
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[600px]">
             <CandidateTabs candidate={candidate} />
          </div>
        </div>

        {/* Right Column - Context Panel */}
        <div className="w-[320px] flex-shrink-0 flex flex-col gap-4">
          {/* CRM & Candidate Profile Intelligence Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">CRM & Outreach Status</span>
              {candidate.isSubscribed !== false ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Subscribed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Unsubscribed
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Assessment Score</span>
                <span className="text-base font-bold text-purple-700 mt-0.5">
                  {candidate.assessmentScore ?? candidate.behavioralScore ?? 85}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">EMI Score</span>
                <span className="text-base font-bold text-blue-700 mt-0.5">
                  {candidate.emiScore}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Role:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={candidate.role}>{candidate.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Company:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">{candidate.company}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Contact:</span>
                <span className="font-semibold text-slate-800">{candidate.lastContactDate || 'Never'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Outreach State:</span>
                <span className="font-medium text-emerald-700">Prime Agent Active</span>
              </div>
            </div>
          </div>

          {/* Interview Feedback & Evaluations Intelligence Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                Interview Feedback
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                Add
              </button>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Average Rating</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-slate-900">{avgRating}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ 10</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Consensus</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Recommend
                </span>
              </div>
            </div>

            {/* List of Givers & Individual Scores */}
            <div className="border-t border-slate-100 pt-2 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Evaluations ({totalFeedbackCount} Givers)
              </span>
              <div className="space-y-1.5">
                {feedbackList.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={item.giver.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                      <span className="font-medium text-slate-800 truncate max-w-[130px]" title={item.giver.name}>
                        {item.giver.name.replace('Dr. ', '')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      <span className="font-bold text-slate-900 text-[11px]">{item.rating}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Briefcase className="w-4 h-4" />
                Jobs (25)
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            <div className="p-4 border-b border-slate-200">
              <div className="text-blue-600 text-sm font-medium flex items-center gap-1 cursor-pointer">
                All Jobs (25) <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            
            <div className="flex flex-col">
              {/* Job Card 1 */}
              <div className="p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-slate-900 leading-tight">Field Application Engineer (M/W/D) - P-103553</h4>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                    <MoreVertical className="w-4 h-4" />
                  </div>
                </div>
                <div className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded mb-2">Open</div>
                <div className="text-xs text-slate-500 space-y-1 mb-3">
                  <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Engineering</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Zürich, Zurich, Switzerland</div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <FileText className="w-3.5 h-3.5" /> Notes | <span className="text-blue-600 cursor-pointer">Add Note</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <FileText className="w-3.5 h-3.5" /> Documents | <span className="text-blue-600 cursor-pointer">Upload Documents</span>
                </div>
                
                <select className="w-full border border-slate-300 rounded-md text-sm p-2 mb-2 text-slate-700 bg-white">
                  <option>Lead (New Lead)</option>
                </select>
                <div className="text-[10px] text-slate-400">Last status changes: Sep 9, 2026, 11:49 AM EDT</div>
              </div>

              {/* Job Card 2 */}
              <div className="p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-slate-900 leading-tight">SR MANUFACTURING ENGINEER - P-103551</h4>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xs text-slate-500 space-y-1 mb-2">
                  <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Engineering</div>
                </div>
                <div className="text-xs text-slate-700 font-medium">Lead (New Lead) <span className="text-slate-400 font-normal">| Today</span></div>
              </div>
            </div>
            
            <button className="w-full py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Show 20 More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
