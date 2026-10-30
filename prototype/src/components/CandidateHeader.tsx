import React from 'react';
import { Candidate } from '../types';
import { Star, Briefcase, Mail, UserPlus, MoreVertical, Handshake } from 'lucide-react';
import * as Avatar from '@radix-ui/react-avatar';

export function CandidateHeader({ candidate }: { candidate: Candidate }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-start justify-between shadow-sm">
      <div className="flex gap-6 items-start">
        <Avatar.Root className="w-24 h-24 rounded-full overflow-hidden border border-slate-100 flex-shrink-0 bg-(--bg-brand-secondary-subtle) flex items-center justify-center">
          <Avatar.Image
            src={candidate.avatarUrl}
            className="w-full h-full object-cover"
          />
          <Avatar.Fallback className="text-2xl font-semibold text-(--text-brand-secondary-dark)">
            {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
          </Avatar.Fallback>
        </Avatar.Root>

        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{candidate.firstName} {candidate.lastName}</h1>
            <Star className="w-4 h-4 text-blue-600 stroke-[2] fill-blue-50" />
            {candidate.hasOpportunityRoom && (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/90 shadow-2xs"
                title={`Active in ${candidate.opportunityRoomTitle || 'Opportunity Room'} (${candidate.opportunityRoomStatus || 'Active'})`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                <Handshake className="w-3.5 h-3.5 text-purple-600" />
                <span>Opportunity Room</span>
                <span className="text-[10px] font-semibold text-purple-500">· {candidate.opportunityRoomStatus || 'In Review'}</span>
              </span>
            )}
            {candidate.isSubscribed !== false ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Subscribed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Unsubscribed
              </span>
            )}
          </div>
          
          <div className="text-[13px] text-slate-700 flex items-center gap-1.5 font-medium mt-1">
            <span className="text-slate-500">Role:</span> {candidate.role}
          </div>
          <div className="text-[13px] text-slate-700 flex items-center gap-1.5 font-medium">
            <span className="text-slate-500">Company:</span> {candidate.company}
          </div>
          {candidate.lastContactDate && (
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Last Contact:</span> 
              <span className="font-semibold text-slate-700">{candidate.lastContactDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 pt-1">
        <div className="flex items-center gap-5 pr-2 mb-1">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="22" cy="22" r="19" stroke="currentColor" strokeWidth="3.5" fill="transparent" className="text-slate-100" />
                <circle cx="22" cy="22" r="19" stroke="currentColor" strokeWidth="3.5" fill="transparent" strokeDasharray={2 * Math.PI * 19} strokeDashoffset={(2 * Math.PI * 19) - (candidate.emiScore / 100) * (2 * Math.PI * 19)} className="text-blue-600" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-blue-700">{candidate.emiScore}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">EMI Score</span>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="22" cy="22" r="19" stroke="currentColor" strokeWidth="3.5" fill="transparent" className="text-slate-100" />
                <circle cx="22" cy="22" r="19" stroke="currentColor" strokeWidth="3.5" fill="transparent" strokeDasharray={2 * Math.PI * 19} strokeDashoffset={(2 * Math.PI * 19) - ((candidate.assessmentScore ?? candidate.behavioralScore) / 100) * (2 * Math.PI * 19)} className="text-purple-600" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-purple-700">{candidate.assessmentScore ?? candidate.behavioralScore}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Assessment</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Star className="w-4 h-4 text-blue-600 stroke-[2]" />
            Follow
          </button>
          <button className="w-10 h-10 border border-slate-300 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <Briefcase className="w-4 h-4 stroke-[2]" />
          </button>
          <button className="w-10 h-10 border border-slate-300 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <Mail className="w-4 h-4 stroke-[2]" />
          </button>
          <button className="w-10 h-10 border border-slate-300 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <UserPlus className="w-4 h-4 stroke-[2]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-full transition-colors ml-1">
            <MoreVertical className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
