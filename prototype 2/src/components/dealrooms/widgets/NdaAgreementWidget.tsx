import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  Download, 
  Calendar, 
  Clock, 
  PenTool, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface NdaAgreementWidgetProps {
  isSigned?: boolean;
  signedDate?: string;
  candidateName: string;
  onSignNda?: () => void;
  isRecruiterPreview?: boolean;
}

export function NdaAgreementWidget({
  isSigned = false,
  signedDate,
  candidateName,
  onSignNda,
  isRecruiterPreview = false
}: NdaAgreementWidgetProps) {
  const [signed, setSigned] = useState(isSigned);
  const [signatureText, setSignatureText] = useState(candidateName);
  const [showFullAgreement, setShowFullAgreement] = useState(false);
  const [hasAgreedTerms, setHasAgreedTerms] = useState(false);

  const handleExecuteSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureText.trim()) return;
    setSigned(true);
    if (onSignNda) onSignNda();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
            signed ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-purple-50 text-purple-600 border border-purple-200"
          )}>
            {signed ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Mutual Executive Non-Disclosure Agreement (NDA)
              </h3>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
                signed ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"
              )}>
                {signed ? 'Executed & Active' : 'Signature Required'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bilateral confidentiality agreement protecting strategic organizational roadmaps and executive deliberations.
            </p>
          </div>
        </div>

        {signed && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Signed on {signedDate || 'Oct 02, 2026'}</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 space-y-5">
        
        {signed ? (
          /* Signed Confirmation State */
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-900 block uppercase tracking-wider">
                  Bilateral Legal Execution Complete
                </span>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  This opportunity room and all attached proprietary architecture diagrams, compensation models, and board briefings are protected under the executed agreement.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowFullAgreement(!showFullAgreement)}
                className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100/50 transition-colors shrink-0 cursor-pointer"
              >
                {showFullAgreement ? 'Hide Full Terms' : 'View Executed Agreement'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-200/60 text-xs">
              <div>
                <span className="text-emerald-700/80 block font-medium text-[11px]">Signatory</span>
                <strong className="text-emerald-950 font-bold">{candidateName}</strong>
              </div>
              <div>
                <span className="text-emerald-700/80 block font-medium text-[11px]">Enterprise Counterpart</span>
                <strong className="text-emerald-950 font-bold">Office of General Counsel</strong>
              </div>
              <div>
                <span className="text-emerald-700/80 block font-medium text-[11px]">Security Verification</span>
                <span className="text-emerald-900 font-mono text-[11px]">SHA-256: 8a4f9...e21c</span>
              </div>
            </div>
          </div>
        ) : (
          /* Signature Form State */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 block">Core Confidentiality Stipulations:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Non-disclosure of confidential business plans, financial models, and strategic org hierarchy.</li>
                <li>Strict reciprocity protecting candidate’s current employment discussions and personal data.</li>
                <li>Term: 24 months from date of bilateral digital execution.</li>
              </ul>
              <button
                type="button"
                onClick={() => setShowFullAgreement(!showFullAgreement)}
                className="text-xs font-bold text-(--color-secondary-200) hover:underline pt-1 inline-block"
              >
                {showFullAgreement ? 'Hide Full Legal Text' : 'Read Full Standard Executive NDA Text →'}
              </button>
            </div>

            {/* Signature Input Form */}
            <form onSubmit={handleExecuteSign} className="p-5 rounded-2xl bg-purple-50/40 border border-purple-200/70 space-y-4">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Digital Signature Authorization
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Authorized Signer Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-(--color-secondary-200)"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Signature Timestamp
                  </label>
                  <input
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' (Auto-stamped)'}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-100 text-slate-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={hasAgreedTerms}
                  onChange={(e) => setHasAgreedTerms(e.target.checked)}
                  className="rounded border-slate-300 text-(--color-secondary-200) focus:ring-(--color-secondary-200) cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-700 cursor-pointer">
                  I confirm my legal authority to execute this mutual non-disclosure agreement on behalf of myself.
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!hasAgreedTerms || !signatureText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute & Sign NDA</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Collapsible Full Agreement Text */}
        {showFullAgreement && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-3 max-h-60 overflow-y-auto">
            <h5 className="font-bold font-sans text-slate-900 text-sm">MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT</h5>
            <p>
              This Mutual Executive Non-Disclosure Agreement is entered into by and between the In-House Enterprise Recruiting Organization and {candidateName} ("Executive").
            </p>
            <p>
              1. Definition of Confidential Information: Includes without limitation technical roadmaps, GPU cluster allocations, revenue targets, executive compensation structures, organizational charts, and candidate mobility discussions.
            </p>
            <p>
              2. Standard of Care: Both parties agree to exercise the same degree of care as used for their own proprietary trade secrets, and not less than a reasonable standard of diligence.
            </p>
            <p>
              3. Governing Law: State of Delaware. Digital execution pursuant to the Electronic Signatures in Global and National Commerce Act (E-SIGN).
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
