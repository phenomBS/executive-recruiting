import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, MessageCircle, X, Zap } from 'lucide-react';

interface CreateProjectChoiceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onManual: () => void;
  onAgent: () => void;
}

export function CreateProjectChoice({ isOpen, onOpenChange, onManual, onAgent }: CreateProjectChoiceProps) {
  const [path, setPath] = useState<'manual' | 'agent' | null>(null);

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => { if (!open) setPath(null); onOpenChange(open); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-overlay)" style={{ background: 'var(--bg-overlay-blanket)' }} />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-(--z-modal) w-full max-w-4xl bg-(--bg-default) rounded-2xl border border-(--border-light) shadow-2xl p-0 overflow-hidden">
          <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="m-0! text-lg! font-bold text-(--text-strong)">Create executive search project</Dialog.Title>
              <Dialog.Description className="m-0! mt-1! text-sm text-(--text-subtle)">
                Start the project yourself, or use the Phenom Sourcing Agent.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
            <PathCard
              selected={path === 'manual'}
              onSelect={() => setPath('manual')}
              icon={<span className="w-9 h-9 rounded-xl bg-(--bg-neutral-soft) flex items-center justify-center"><Calendar className="w-5 h-5 text-(--text-default)" aria-hidden="true" /></span>}
              title="Create manually"
              description="Enter the project details, role, and scope yourself."
              availability="You set every field"
              steps={[
                'Enter project details, role, and location',
                'Set compensation, scope, and target markets',
                'Open the project and build the slate',
              ]}
            />
            <PathCard
              selected={path === 'agent'}
              onSelect={() => setPath('agent')}
              instant
              icon={<span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--color-secondary-200)', color: 'var(--text-inverse)' }}><MessageCircle className="w-4 h-4" aria-hidden="true" /></span>}
              title="Phenom Sourcing Agent"
              description="Describe the role and review matching candidates in a guided search."
              availability="Starts instantly – no scheduling required"
              steps={[
                'Describe the role in the search',
                'Review candidate segments and shortlist people',
                'Add them to a project or create a new one',
              ]}
            />
          </div>
          <div className="px-6 py-4 border-t border-(--border-light) flex justify-end gap-2 bg-(--bg-default)">
            <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" onClick={() => onOpenChange(false)}>Cancel</button>
            <button
              type="button"
              className="phx-btn"
              data-variant="primary"
              data-size="sm"
              disabled={path === null}
              onClick={() => (path === 'agent' ? onAgent() : onManual())}
            >
              Continue
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PathCard({ selected, onSelect, icon, title, description, availability, instant, steps }: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  availability: string;
  instant?: boolean;
  steps: string[];
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="text-left rounded-2xl border p-5 flex flex-col gap-4 bg-(--bg-default)"
      style={{
        borderColor: selected ? 'var(--color-secondary-200)' : 'var(--border-light)',
        background: selected ? 'var(--color-secondary-40)' : 'var(--bg-default)',
      }}
    >
      <span className="flex items-start gap-3">
        <span className="shrink-0">{icon}</span>
        <span>
          <span className="block text-base font-bold text-(--text-strong)">{title}</span>
          <span className="block mt-1 text-sm text-(--text-default)">{description}</span>
        </span>
      </span>
      <span className="border-t border-(--border-light) pt-3">
        <span className="block text-xs font-semibold text-(--text-subtle)">Availability</span>
        <span className={`mt-1 flex items-center gap-1.5 text-sm ${instant ? 'text-(--color-secondary-300)' : 'text-(--text-default)'}`}>
          {instant ? <Zap className="w-3.5 h-3.5" aria-hidden="true" /> : <Calendar className="w-3.5 h-3.5 text-(--text-subtle)" aria-hidden="true" />}
          {availability}
        </span>
      </span>
      <span className="border-t border-(--border-light) pt-3">
        <span className="block text-xs font-semibold text-(--text-subtle)">What to expect</span>
        <ol className="mt-2 flex flex-col gap-2">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-2 text-sm text-(--text-default)">
              <span className="w-5 h-5 rounded-full bg-(--bg-neutral-soft) text-xs font-semibold text-(--text-strong) flex items-center justify-center shrink-0">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </span>
    </button>
  );
}
