import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Download, X } from 'lucide-react';
import { LogoField, LogoState, getSavedCompanyLogo, setSavedCompanyLogo } from '../roles/DownloadBriefModal';

export interface MarketMapExportChoices {
  name: string;
  clientLogoPreview: string | null;
  companyLogoPreview: string | null;
}

interface ExportMarketMapModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  companyCount: number;
  candidateCount: number;
  onDownload: (choices: MarketMapExportChoices) => void;
}

export function ExportMarketMapModal({
  isOpen,
  onOpenChange,
  defaultName,
  companyCount,
  candidateCount,
  onDownload,
}: ExportMarketMapModalProps) {
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

  const canDownload = name.trim().length > 0 && (companyCount > 0 || candidateCount > 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canDownload) return;
    onDownload({
      name: name.trim(),
      clientLogoPreview: clientLogo?.preview ?? null,
      companyLogoPreview: companyLogo?.preview ?? null,
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
                <Dialog.Title className="m-0! text-xl! font-bold text-(--text-strong)">Export market map</Dialog.Title>
                <Dialog.Description className="text-sm text-(--text-default) m-0! mt-1!">
                  {companyCount} {companyCount === 1 ? 'company' : 'companies'} and {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'} will be in the PDF.
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
                <label className="phx-label" htmlFor="market-map-export-name">Document name</label>
                <input
                  id="market-map-export-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={120}
                  autoComplete="off"
                  className="w-full"
                />
                <p className="text-sm text-(--text-default) mt-1.5">Printed as the title of the presentation and used for the file name.</p>
              </div>

              <LogoField
                id="market-map-client-logo"
                label="Client logo"
                help="Appears at the top right of the presentation."
                value={clientLogo}
                onChange={setClientLogo}
              />

              <LogoField
                id="market-map-company-logo"
                label="Your company logo"
                help="Appears at the top left of the presentation. Saved for your next export."
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
