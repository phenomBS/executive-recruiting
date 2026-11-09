import React, { useState } from 'react';
import { ArrowRight, Bot, Check, CheckCheck, RefreshCw } from 'lucide-react';
import { mockCandidates } from '../../data/mockData';
import {
  ProfileUpdate,
  applyProfileUpdate,
  getAutoUpdate,
  initialProfileUpdates,
  isProfileUpdateApplied,
  setAutoUpdate,
} from '../../data/profileUpdatesData';
import { cn } from '../../lib/utils';

interface ProfileUpdatesWidgetProps {
  onSelectCandidate: (candidateId: string) => void;
  onNotify: (message: string) => void;
}

export function ProfileUpdatesWidget({ onSelectCandidate, onNotify }: ProfileUpdatesWidgetProps) {
  const [updates] = useState<ProfileUpdate[]>(initialProfileUpdates);
  const [appliedIds, setAppliedIds] = useState<string[]>(() => updates.filter(u => isProfileUpdateApplied(u.id)).map(u => u.id));
  const [auto, setAuto] = useState<boolean>(() => {
    if (!getAutoUpdate()) return false;
    // Anything still waiting when the widget opens is written straight away
    updates.forEach(applyProfileUpdate);
    return true;
  });

  // Auto-update applies anything still pending on mount
  const effectiveApplied = auto ? updates.map(u => u.id) : appliedIds;
  const pending = updates.filter(u => !effectiveApplied.includes(u.id));

  const nameOf = (u: ProfileUpdate) => {
    const c = mockCandidates.find(x => x.id === u.candidateId);
    return c ? `${c.firstName} ${c.lastName}` : 'Candidate';
  };

  const updateOne = (u: ProfileUpdate) => {
    applyProfileUpdate(u);
    setAppliedIds(prev => (prev.includes(u.id) ? prev : [...prev, u.id]));
    onNotify(`Updated ${nameOf(u)}'s profile with ${u.changes.length} change${u.changes.length === 1 ? '' : 's'}.`);
  };

  const updateAll = () => {
    pending.forEach(applyProfileUpdate);
    setAppliedIds(updates.map(u => u.id));
    onNotify(`Updated ${pending.length} profile${pending.length === 1 ? '' : 's'}.`);
  };

  const toggleAuto = (on: boolean) => {
    setAutoUpdate(on);
    setAuto(on);
    if (on) {
      const n = pending.length;
      updates.forEach(applyProfileUpdate);
      setAppliedIds(updates.map(u => u.id));
      onNotify(
        n > 0
          ? `Auto-update is on. Applied ${n} pending update${n === 1 ? '' : 's'}; new ones will apply without review.`
          : 'Auto-update is on. New profile updates will apply without review.'
      );
    } else {
      onNotify('Auto-update is off. New profile updates will wait for your review.');
    }
  };

  return (
    <section aria-labelledby="profile-updates-title" className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-(--color-secondary-200) to-(--color-secondary-100) text-white flex items-center justify-center shadow-xs shrink-0">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 id="profile-updates-title" className="text-base font-bold text-(--text-strong)">
              Agent Profile Updates for Review
            </h3>
            <p className="text-sm text-(--text-default)">
              The agent found newer information for profiles already in your CRM. Review each change before it is written.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2.5 cursor-pointer mb-0" data-tooltip="Turn on to write every agent update to the profile as soon as it is found, without waiting for your review">
            <button
              type="button"
              role="switch"
              aria-checked={auto}
              onClick={() => toggleAuto(!auto)}
              className={cn(
                'relative w-10 h-6 rounded-full transition-colors shrink-0 cursor-pointer',
                auto ? 'bg-(--color-secondary-200)' : 'bg-(--color-neutrals-100)'
              )}
            >
              <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform', auto && 'translate-x-4')} />
              <span className="sr-only">Always update profiles without review</span>
            </button>
            <span className="text-sm font-semibold text-(--text-strong)">Always update without review</span>
          </label>
          <button type="button" className="phx-btn" data-variant="primary" data-size="sm" onClick={updateAll} disabled={pending.length === 0}>
            <CheckCheck className="w-4 h-4" aria-hidden="true" /> Update all{pending.length > 0 ? ` (${pending.length})` : ''}
          </button>
        </div>
      </div>

      {auto && (
        <div className="px-6 py-3 bg-(--bg-brand-secondary-subtle) border-b border-(--border-light) text-sm text-(--text-default) flex items-center gap-2">
          <Bot className="w-4 h-4 text-(--color-secondary-200)" aria-hidden="true" />
          Auto-update is on. The agent writes new changes to profiles without review, and lists them below as updated.
        </div>
      )}

      <ul className="divide-y divide-slate-100">
        {updates.map(u => {
          const candidate = mockCandidates.find(c => c.id === u.candidateId);
          const done = effectiveApplied.includes(u.id);
          return (
            <li key={u.id} className={cn('p-5', done && 'bg-slate-50/50')}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {candidate?.avatarUrl ? (
                    <img src={candidate.avatarUrl} alt="" className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 shrink-0" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-(--bg-neutral-soft) shrink-0" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onSelectCandidate(u.candidateId)}
                      className="text-base font-bold text-(--text-strong) hover:text-(--color-secondary-200) cursor-pointer text-left"
                    >
                      {nameOf(u)}
                    </button>
                    <div className="text-sm text-(--text-default)">
                      {candidate?.role} at {candidate?.company}
                    </div>
                    <p className="text-base text-(--text-strong) mt-2">{u.statement}</p>
                  </div>
                </div>

                {done ? (
                  <span className="phx-tag shrink-0" style={{ background: 'var(--feedback-success-bg-light)', color: 'var(--feedback-success-text-strong)', borderColor: 'var(--feedback-success-bg-default)' }}>
                    <Check className="w-4 h-4" aria-hidden="true" /> Updated
                  </span>
                ) : (
                  <button type="button" className="phx-btn shrink-0" data-variant="secondary" data-size="sm" onClick={() => updateOne(u)}>
                    <RefreshCw className="w-4 h-4" aria-hidden="true" /> Update profile
                  </button>
                )}
              </div>

              <div className="mt-4 ml-14 rounded-xl border border-(--border-light) overflow-hidden">
                <div className="grid grid-cols-[170px_minmax(0,1fr)_24px_minmax(0,1fr)] gap-3 px-4 py-2 bg-(--bg-neutral-soft) text-sm font-semibold text-(--text-default)">
                  <span>Field</span>
                  <span>Before</span>
                  <span aria-hidden="true" />
                  <span>After</span>
                </div>
                {u.changes.map(ch => (
                  <div key={ch.field} className="grid grid-cols-[170px_minmax(0,1fr)_24px_minmax(0,1fr)] gap-3 px-4 py-2.5 border-t border-(--border-faint) items-center text-sm">
                    <span className="font-semibold text-(--text-strong)">{ch.label}</span>
                    <span className="text-(--text-default) line-through decoration-(--text-subtle)">{ch.before}</span>
                    <ArrowRight className="w-4 h-4 text-(--text-subtle)" aria-hidden="true" />
                    <span className="font-semibold text-(--feedback-success-text-strong)">{ch.after}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 ml-14 text-sm text-(--text-default)">
                Source: {u.source} · Found {u.detectedOn}
              </p>
            </li>
          );
        })}
      </ul>

      {pending.length === 0 && !auto && (
        <div className="px-6 py-4 border-t border-slate-100 text-sm text-(--text-default) flex items-center gap-2">
          <Check className="w-4 h-4 text-(--feedback-success-text-strong)" aria-hidden="true" /> All caught up. New agent updates will appear here for review.
        </div>
      )}
    </section>
  );
}
