import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Download, FileSpreadsheet, FileText, X } from 'lucide-react';
import type { ClientLogo } from '../../lib/calibrationBriefPdf';
import { LogoField, LogoState, getSavedCompanyLogo, setSavedCompanyLogo } from '../roles/DownloadBriefModal';

export type ExportFormat = 'csv' | 'pdf';

export interface TargetCompaniesExportChoices {
  format: ExportFormat;
  name: string;
  clientLogo: ClientLogo | null;
  companyLogo: ClientLogo | null;
}

interface ExportTargetCompaniesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  companyCount: number;
  onExport: (choices: TargetCompaniesExportChoices) => void;
}

const FORMATS: { id: ExportFormat; label: string; detail: string; Icon: typeof FileText }[] = [
  { id: 'csv', label: 'CSV', detail: 'One row per company, ready for a spreadsheet.', Icon: FileSpreadsheet },
  { id: 'pdf', label: 'PDF', detail: 'One page per company with its org chart.', Icon: FileText },
];

export function ExportTargetCompaniesModal({ isOpen, onOpenChange, defaultName, companyCount, onExport }: ExportTargetCompaniesModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [name, setName] = useState(defaultName);
  const [clientLogo, setClientLogo] = useState<LogoState>(null);
  const [companyLogo, setCompanyLogo] = useState<LogoState>(getSavedCompanyLogo());

  useEffect(() => {
    if (isOpen) setName(defaultName);
  }, [isOpen, defaultName]);

  const updateCompanyLogo = (next: LogoState) => {
    setSavedCompanyLogo(next);
    setCompanyLogo(next);
  };

  const canExport = companyCount > 0 && (format === 'csv' || name.trim().length > 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canExport) return;
    onExport({
      format,
      name: name.trim(),
      clientLogo: format === 'pdf' ? clientLogo?.logo ?? null : null,
      companyLogo: format === 'pdf' ? companyLogo?.logo ?? null : null,
    });
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
                <Dialog.Title className="text-xl font-bold text-(--text-strong)">Export Target Companies</Dialog.Title>
                <Dialog.Description className="text-sm text-(--text-default) mt-1">
                  Exporting {companyCount} {companyCount === 1 ? 'company' : 'companies'} from this project.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="tertiary" data-size="sm" aria-label="Close">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-6 py-5 space-y-5">
              <fieldset>
                <legend className="phx-label">Format</legend>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Export format">
                  {FORMATS.map(({ id, label, detail, Icon }) => {
                    const selected = format === id;
                    return (
                      <label
                        key={id}
                        className="flex items-start gap-3 rounded-xl border p-3 cursor-pointer focus-within:outline-2 focus-within:outline-offset-2"
                        style={{
                          borderColor: selected ? 'var(--text-brand-secondary-default)' : 'var(--border-light)',
                          background: selected ? 'var(--bg-brand-secondary-subtle)' : 'var(--bg-default)',
                        }}
                      >
                        <input
                          type="radio"
                          name="target-export-format"
                          value={id}
                          checked={selected}
                          onChange={() => setFormat(id)}
                          className="mt-1"
                        />
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 text-base font-bold text-(--text-strong)">
                            <Icon className="w-4 h-4" aria-hidden="true" /> {label}
                          </span>
                          <span className="block text-sm text-(--text-default)">{detail}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {format === 'pdf' && (
                <>
                  <div>
                    <label className="phx-label" htmlFor="target-export-name">Document name</label>
                    <input
                      id="target-export-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      maxLength={120}
                      autoComplete="off"
                      className="w-full"
                    />
                    <p className="text-sm text-(--text-default) mt-1.5">Printed at the top of every page and used for the file name.</p>
                  </div>

                  <LogoField
                    id="target-export-client-logo"
                    label="Client logo"
                    help="Appears at the top right of every page."
                    value={clientLogo}
                    onChange={setClientLogo}
                  />

                  <LogoField
                    id="target-export-company-logo"
                    label="Your company logo"
                    help="Appears at the top left of every page. Saved for your next export."
                    value={companyLogo}
                    onChange={updateCompanyLogo}
                  />
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-(--border-light) bg-(--bg-neutral-soft)">
              <Dialog.Close asChild>
                <button type="button" className="phx-btn" data-variant="secondary" data-size="sm">Cancel</button>
              </Dialog.Close>
              <button type="submit" className="phx-btn" data-variant="primary" data-size="sm" disabled={!canExport}>
                <Download className="w-4 h-4" aria-hidden="true" /> Download {format.toUpperCase()}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
