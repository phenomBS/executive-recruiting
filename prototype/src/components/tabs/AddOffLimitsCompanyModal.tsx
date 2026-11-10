import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ShieldAlert, X } from 'lucide-react';
import { listMasterCompanyNames } from '../../data/projectTargetCompanies';

interface AddOffLimitsCompanyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Names already off-limits, so they are not added twice */
  existingNames: string[];
  onAdd: (name: string, reason: string) => void;
}

const REASON_EXAMPLES = ['Active client, off-limits for 12 months', 'Non-solicit agreement', 'Non-compete with client', 'Board relationship covenant'];

export function AddOffLimitsCompanyModal({ isOpen, onOpenChange, existingNames, onAdd }: AddOffLimitsCompanyModalProps) {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const suggestions = useMemo(() => listMasterCompanyNames(), []);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setReason('');
    }
  }, [isOpen]);

  const trimmed = name.trim();
  const duplicate = existingNames.some(n => n.trim().toLowerCase() === trimmed.toLowerCase());
  const canAdd = trimmed.length > 0 && reason.trim().length > 0 && !duplicate;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    onAdd(trimmed, reason.trim());
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-(--border-light) w-full max-w-xl max-h-[92vh] overflow-y-auto flex flex-col z-50 animate-scaleIn">
          <form onSubmit={submit} className="flex flex-col">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-(--border-light)">
              <div>
                <Dialog.Title className="text-xl font-bold text-(--text-strong)">Add Off-Limits Company</Dialog.Title>
                <Dialog.Description className="text-sm text-(--text-default) mt-1">
                  Pick a company or type a name, and record why it is off-limits.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="phx-label" htmlFor="offlimits-name">Company</label>
                <input
                  id="offlimits-name"
                  type="text"
                  list="offlimits-company-options"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Start typing a company name"
                  autoComplete="off"
                  className="w-full"
                  aria-invalid={duplicate}
                  aria-describedby={duplicate ? 'offlimits-name-error' : undefined}
                />
                <datalist id="offlimits-company-options">
                  {suggestions.map(n => (
                    <option key={n} value={n} />
                  ))}
                </datalist>
                {duplicate && (
                  <p id="offlimits-name-error" role="alert" className="text-sm mt-1.5" style={{ color: 'var(--feedback-error-text-strong)' }}>
                    {trimmed} is already off-limits.
                  </p>
                )}
              </div>

              <div>
                <label className="phx-label" htmlFor="offlimits-reason">Reason</label>
                <input
                  id="offlimits-reason"
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="For example: Active client, off-limits for 12 months"
                  autoComplete="off"
                  maxLength={160}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {REASON_EXAMPLES.map(r => (
                    <button key={r} type="button" className="phx-tag" onClick={() => setReason(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="phx-feedback" data-tone="warning">
                <span className="inline-flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  This joins the firm-wide off-limits list, so it applies to every search. The company disappears from target companies, pipelines and search books.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-(--border-light) bg-(--bg-neutral-soft)">
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">Cancel</button>
              </Dialog.Close>
              <button type="submit" className="phx-btn" data-variant="primary" data-size="sm" disabled={!canAdd}>
                Add to off-limits
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
