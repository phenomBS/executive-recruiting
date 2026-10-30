import React, { useState } from 'react';
import { 
  FileCheck2, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink,
  Gift,
  Plane,
  HeartPulse,
  Scale
} from 'lucide-react';
import { FinancialOfferModel } from '../../../data/dealRoomsData';
import { cn } from '../../../lib/utils';

interface ExecutiveOfferPackageWidgetProps {
  candidateName: string;
  targetRole: string;
  financialModel: FinancialOfferModel;
  offerStatus?: 'Draft' | 'Delivered' | 'In Review' | 'Accepted';
  onAcceptOffer?: () => void;
  isRecruiterPreview?: boolean;
}

export function ExecutiveOfferPackageWidget({
  candidateName,
  targetRole,
  financialModel,
  offerStatus: initialStatus = 'Delivered',
  onAcceptOffer,
  isRecruiterPreview = false
}: ExecutiveOfferPackageWidgetProps) {
  const [status, setStatus] = useState(initialStatus);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleExecuteAcceptance = () => {
    setStatus('Accepted');
    setShowAcceptedModal(true);
    if (onAcceptOffer) onAcceptOffer();
  };

  const executivePerks = [
    {
      icon: HeartPulse,
      title: 'Tier-1 Executive Health & Wellness',
      desc: '100% premium coverage for executive & dependents including private medical concierge.'
    },
    {
      icon: Plane,
      title: 'Global Travel & Commute Stipend',
      desc: '$50,000 annual relocation & first-class domestic transit allowance.'
    },
    {
      icon: Scale,
      title: 'Executive Legal Fee Coverage',
      desc: 'Reimbursement up to $15,000 for personal counsel review of equity agreements.'
    },
    {
      icon: Gift,
      title: 'Sign-On Liquidity Allocation',
      desc: `${formatCurrency(financialModel.signingBonus)} cash bonus disbursed on first monthly payroll cycle.`
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border",
            status === 'Accepted' 
              ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
              : "bg-blue-50 text-blue-600 border-blue-200"
          )}>
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Formal Executive Offer Package & Term Sheet
              </h3>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
                status === 'Accepted' ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
              )}>
                {status === 'Accepted' ? 'Offer Accepted' : 'Formal Term Sheet Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized by Board Compensation Committee for <strong className="text-slate-800">{candidateName}</strong> ({targetRole}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Valid through Nov 15, 2026</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Core Financial Summary Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
              Annual Base Salary
            </span>
            <div className="text-2xl font-black mt-1">
              {formatCurrency(financialModel.baseSalary)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Semi-monthly payroll</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
              Target Annual Bonus
            </span>
            <div className="text-2xl font-black mt-1">
              {financialModel.targetBonusPercent}% ({formatCurrency(financialModel.baseSalary * (financialModel.targetBonusPercent / 100))})
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Performance linked</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
              Initial Equity Grant
            </span>
            <div className="text-2xl font-black mt-1 text-emerald-400">
              {formatCurrency(financialModel.equityGrantValue)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{financialModel.sharesCount.toLocaleString()} Common Equivalent Shares</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
              Sign-On Bonus
            </span>
            <div className="text-2xl font-black mt-1 text-amber-300">
              {formatCurrency(financialModel.signingBonus)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Day 1 Cash disbursement</span>
          </div>
        </div>

        {/* Executive Perks & Benefits Grid */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Executive Executive Tier Benefits & Protections
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {executivePerks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{perk.title}</h5>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action / Acceptance Bar */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs text-slate-700">
              <span className="font-bold text-slate-900 block">Legally Binding Executive Term Sheet</span>
              <span>All terms vetted by General Counsel and CEO. Includes standard double-trigger acceleration clause.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed Term Sheet PDF</span>
            </button>

            {status !== 'Accepted' ? (
              <button
                type="button"
                onClick={handleExecuteAcceptance}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Sign Offer</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Signed & Accepted</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
