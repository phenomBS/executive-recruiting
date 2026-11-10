import React, { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Download, ImagePlus, X } from 'lucide-react';
import type { ClientLogo } from '../../lib/calibrationBriefPdf';
import { readClientLogo } from '../../lib/clientLogo';

export interface BriefExportChoices {
  name: string;
  clientLogo: ClientLogo | null;
  companyLogo: ClientLogo | null;
}

export type LogoState = { preview: string; logo: ClientLogo } | null;

/** The recruiter's own logo is kept for the session so it is ready for the next brief. */
let savedCompanyLogo: LogoState = null;
export const getSavedCompanyLogo = (): LogoState => savedCompanyLogo;
export const setSavedCompanyLogo = (next: LogoState) => {
  savedCompanyLogo = next;
};

interface DownloadBriefModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  onDownload: (choices: BriefExportChoices) => void;
}

export function LogoField({
  id,
  label,
  help,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  value: LogoState;
  onChange: (next: LogoState) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      onChange(await readClientLogo(file));
      setError(null);
    } catch {
      setError('That file could not be read as an image. Try a PNG, JPG or SVG.');
    }
  };

  return (
    <div>
      <span className="phx-label" id={`${id}-label`}>
        {label} <span className="font-normal text-(--text-default)">(optional)</span>
      </span>
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="sr-only"
        aria-labelledby={`${id}-label`}
        onChange={onFile}
      />
      <div className="flex items-center gap-3 rounded-xl border border-(--border-light) p-3 min-h-16">
        {value ? (
          <>
            <div className="bg-white rounded-lg border border-(--border-faint) px-2 py-1.5 shrink-0">
              <img src={value.preview} alt={`${label} preview`} className="h-9 max-w-32 object-contain" />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button type="button" className="phx-btn" data-variant="secondary" data-size="sm" onClick={() => input.current?.click()}>
                Replace
              </button>
              <button
                type="button"
                className="phx-btn"
                data-variant="tertiary"
                data-size="sm"
                onClick={() => onChange(null)}
                aria-label={`Remove ${label.toLowerCase()}`}
              >
                <X className="w-4 h-4" aria-hidden="true" /> Remove
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-(--text-default) flex-1">{help}</p>
            <button type="button" className="phx-btn shrink-0" data-variant="secondary" data-size="sm" onClick={() => input.current?.click()}>
              <ImagePlus className="w-4 h-4" aria-hidden="true" /> Upload
            </button>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm mt-1.5" style={{ color: 'var(--feedback-error-text-strong)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function DownloadBriefModal({ isOpen, onOpenChange, defaultName, onDownload }: DownloadBriefModalProps) {
  const [name, setName] = useState(defaultName);
  const [clientLogo, setClientLogo] = useState<LogoState>(null);
  const [companyLogo, setCompanyLogo] = useState<LogoState>(savedCompanyLogo);

  // Start each export from the standard name
  useEffect(() => {
    if (isOpen) setName(defaultName);
  }, [isOpen, defaultName]);

  const updateCompanyLogo = (next: LogoState) => {
    setSavedCompanyLogo(next);
    setCompanyLogo(next);
  };

  const canDownload = name.trim().length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canDownload) return;
    onDownload({ name: name.trim(), clientLogo: clientLogo?.logo ?? null, companyLogo: companyLogo?.logo ?? null });
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
                <Dialog.Title className="text-xl font-bold text-(--text-strong)">Download Calibration Brief</Dialog.Title>
                <Dialog.Description className="text-sm text-(--text-default) mt-1">
                  Name the brief and add logos if you want them on the page. Both logos are optional.
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
                <label className="phx-label" htmlFor="brief-name">Brief name</label>
                <input
                  id="brief-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={120}
                  autoComplete="off"
                  className="w-full"
                />
                <p className="text-sm text-(--text-default) mt-1.5">Printed as the title of the brief and used for the file name.</p>
              </div>

              <LogoField
                id="brief-client-logo"
                label="Client logo"
                help="Appears at the top right of the brief."
                value={clientLogo}
                onChange={setClientLogo}
              />

              <LogoField
                id="brief-company-logo"
                label="Your company logo"
                help="Appears at the top left in place of the default mark. Saved for your next brief."
                value={companyLogo}
                onChange={updateCompanyLogo}
              />
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-(--border-light) bg-(--bg-neutral-soft)">
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">Cancel</button>
              </Dialog.Close>
              <button type="submit" className="phx-btn" data-variant="primary" data-size="sm" disabled={!canDownload}>
                <Download className="w-4 h-4" aria-hidden="true" /> Download PDF
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
