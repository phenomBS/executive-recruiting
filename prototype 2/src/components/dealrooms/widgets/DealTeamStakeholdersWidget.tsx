import React from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Plus, 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  Calendar,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { DealRoomStakeholder, StakeholderType } from '../../../data/dealRoomsData';
import { cn } from '../../../lib/utils';

interface DealTeamStakeholdersWidgetProps {
  stakeholders: DealRoomStakeholder[];
  onOpenAddStakeholderModal?: () => void;
  onRemoveStakeholder?: (stakeholderId: string) => void;
  isRecruiterPreview?: boolean;
}

export function DealTeamStakeholdersWidget({
  stakeholders,
  onOpenAddStakeholderModal,
  onRemoveStakeholder,
  isRecruiterPreview = false
}: DealTeamStakeholdersWidgetProps) {
  const getBadgeColor = (type: StakeholderType) => {
    switch (type) {
      case 'Company CEO':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Hiring Manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Board Member':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Executive Assistant':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Lead Recruiter':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'General Counsel':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Executive Sponsors & Deal Team
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800">
                {stakeholders.length} Tagged Stakeholders
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct access lines to the CEO, Hiring Manager, Board representatives, and Executive Coordinators.
            </p>
          </div>
        </div>

        {/* Tag Stakeholder Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenAddStakeholderModal && (
            <button
              type="button"
              onClick={onOpenAddStakeholderModal}
              className="px-3.5 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tag Stakeholder</span>
            </button>
          )}
        </div>
      </div>

      {/* Stakeholder Cards Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stakeholders.map((s) => (
            <div 
              key={s.id} 
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between group relative"
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img 
                    src={s.avatarUrl} 
                    alt={s.name} 
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200"
                  />
                  {s.stakeholderType === 'Company CEO' && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                      <Crown className="w-3 h-3 fill-amber-950" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {s.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {s.roleTitle}
                  </p>
                  
                  <span className={cn(
                    "inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold border",
                    getBadgeColor(s.stakeholderType)
                  )}>
                    {s.stakeholderType}
                  </span>
                </div>

                {/* Remove Stakeholder button (recruiter management) */}
                {onRemoveStakeholder && !isRecruiterPreview && (
                  <button
                    type="button"
                    onClick={() => onRemoveStakeholder(s.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity cursor-pointer"
                    title="Remove tagged stakeholder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Bottom Communication Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                <a 
                  href={`mailto:${s.email}`} 
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium truncate"
                  title={s.email}
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{s.email}</span>
                </a>

                {s.phone && (
                  <a 
                    href={`tel:${s.phone}`} 
                    className="p-1 rounded text-slate-500 hover:text-slate-800 shrink-0"
                    title={s.phone}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Informational Footer */}
        <div className="mt-5 p-3 rounded-xl bg-slate-100/70 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tagged sponsors are granted confidential observer and messaging privileges in this room.</span>
          </div>
          <span className="text-[11px] text-slate-400">All discussions cryptographically logged</span>
        </div>
      </div>
    </div>
  );
}
