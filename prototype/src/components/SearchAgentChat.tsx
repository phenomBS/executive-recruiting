import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Paperclip, Send, X } from 'lucide-react';
import { draftFromMandate, type SearchAgentDraft } from '../lib/searchAgentDraft';

interface SearchAgentChatProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDraft: (draft: SearchAgentDraft) => void;
}

export function SearchAgentChat({ isOpen, onOpenChange, onDraft }: SearchAgentChatProps) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [reading, setReading] = useState(false);

  const reset = () => {
    setText('');
    setFiles([]);
    setReading(false);
  };

  const submit = async () => {
    const mandate = text.trim();
    if (!mandate || reading) return;
    setReading(true);
    const notes = (await Promise.all(files.map(async file => {
      if (file.type.startsWith('text') || /\.(txt|md|csv|json)$/i.test(file.name)) {
        return `${file.name}:\n${await file.text()}`;
      }
      return `Document: ${file.name}`;
    }))).join('\n\n');
    const draft = draftFromMandate(mandate, notes);
    reset();
    onDraft(draft);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => { if (!open) reset(); onOpenChange(open); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-overlay)" style={{ background: 'var(--bg-overlay-blanket)' }} />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-(--z-modal) w-full max-w-2xl bg-(--bg-default) rounded-2xl border border-(--border-light) shadow-2xl p-0 overflow-hidden flex flex-col">
          <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-(--border-light)">
            <div>
              <span className="phx-tag">Phenom Search Agent</span>
              <Dialog.Title className="m-0! mt-2! text-lg! font-bold text-(--text-strong)">
                Enter the search mandate, and any notes or documents about the search.
              </Dialog.Title>
              <Dialog.Description className="m-0! mt-1! text-sm text-(--text-default)">
                Include the role, location, and anything the search should weigh. Press Enter to build the project.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <p className="m-0! text-sm text-(--text-default) rounded-2xl px-4 py-3" style={{ background: 'var(--bg-neutral-soft)' }}>
              {reading
                ? 'Reading the mandate and preparing the project…'
                : 'Share the mandate in the box below. I will fill the project fields, the market map, and the rest of the project from what you provide.'}
            </p>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map(file => (
                  <span key={file.name} className="phx-tag">
                    {file.name}
                    <button type="button" className="ml-1" aria-label={`Remove ${file.name}`} onClick={() => setFiles(prev => prev.filter(item => item !== file))}>
                      <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <form
              onSubmit={event => {
                event.preventDefault();
                void submit();
              }}
            >
              <label className="phx-label" htmlFor="search-mandate">Search mandate</label>
              <textarea
                id="search-mandate"
                value={text}
                rows={5}
                placeholder="Chief Financial Officer in Philadelphia. Public-company finance leader, hybrid, confidential."
                onChange={event => setText(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void submit();
                  }
                }}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => document.getElementById('mandate-files')?.click()}>
                  <Paperclip className="w-4 h-4" aria-hidden="true" />
                  Attach notes or documents
                </button>
                <input
                  id="mandate-files"
                  type="file"
                  multiple
                  className="sr-only"
                  aria-label="Attach notes or documents"
                  onChange={event => {
                    const next = Array.from(event.target.files ?? []);
                    setFiles(prev => [...prev, ...next]);
                    event.target.value = '';
                  }}
                />
                <button type="submit" className="phx-btn" data-variant="primary" data-size="sm" disabled={!text.trim() || reading}>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {reading ? 'Preparing' : 'Build project'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
