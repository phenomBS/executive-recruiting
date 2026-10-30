import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ShieldCheck, 
  Calculator, 
  Video, 
  FileText, 
  Users, 
  FileCheck2, 
  Paperclip, 
  MessageSquare, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { DealRoomWidget, DealRoomWidgetType, DealRoomStage } from '../../data/dealRoomsData';
import { cn } from '../../lib/utils';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStage: DealRoomStage;
  onAddWidget: (widget: DealRoomWidget) => void;
}

export function AddWidgetModal({
  isOpen,
  onClose,
  targetStage,
  onAddWidget
}: AddWidgetModalProps) {
  const [selectedType, setSelectedType] = useState<DealRoomWidgetType>('equity_calculator');
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [isRequiredMilestone, setIsRequiredMilestone] = useState(false);

  if (!isOpen) return null;

  const widgetCatalog = [
    {
      type: 'equity_calculator' as DealRoomWidgetType,
      icon: Calculator,
      title: 'Executive Financial & Equity Upside Modeler',
      defaultDesc: 'Interactive compensation calculator with valuation scenarios, 4-year vesting projection, and tax modeling.',
      category: 'Financial Exploration',
      badge: 'Interactive'
    },
    {
      type: 'nda_agreement' as DealRoomWidgetType,
      icon: ShieldCheck,
      title: 'Mutual Executive Non-Disclosure Agreement (NDA)',
      defaultDesc: 'Bilateral confidentiality gate with digital execution, terms review, and compliance verification.',
      category: 'Legal Milestone',
      badge: 'Required Gate'
    },
    {
      type: 'ceo_welcome_video' as DealRoomWidgetType,
      icon: Video,
      title: 'CEO Welcome Video & Personal Greeting',
      defaultDesc: 'High-definition video briefing from the Chief Executive Officer addressing the executive directly.',
      category: 'Executive Narrative',
      badge: 'Branded Asset'
    },
    {
      type: 'opportunity_strategic' as DealRoomWidgetType,
      icon: FileText,
      title: 'Strategic Context & Executive Charter',
      defaultDesc: 'High-level 3-year strategic growth pillars, board mandates, P&L authority, and reporting hierarchy.',
      category: 'Opportunity Diligence',
      badge: 'Strategic'
    },
    {
      type: 'deal_team' as DealRoomWidgetType,
      icon: Users,
      title: 'Executive Sponsors & Deal Team Grid',
      defaultDesc: 'Direct contact lines and profiles for tagged CEO, Hiring Manager, Board Members, and EA.',
      category: 'Governance & People',
      badge: 'Collaborative'
    },
    {
      type: 'document_attachments' as DealRoomWidgetType,
      icon: Paperclip,
      title: 'Confidential Document Vault',
      defaultDesc: 'Repository for board decks, term sheet appendices, benefits booklets, and org charts.',
      category: 'Asset Repository',
      badge: 'Downloadable'
    },
    {
      type: 'executive_qna' as DealRoomWidgetType,
      icon: MessageSquare,
      title: 'Confidential Inquiry Back-Channel (Q&A)',
      defaultDesc: 'Private encrypted messaging channel between candidate and search committee sponsors.',
      category: 'Communication',
      badge: 'Encrypted'
    }
  ];

  const currentSelection = widgetCatalog.find(w => w.type === selectedType)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newWidget: DealRoomWidget = {
      id: `w-${Date.now()}`,
      type: selectedType,
      title: customTitle.trim() || currentSelection.title,
      description: customDesc.trim() || currentSelection.defaultDesc,
      stageId: targetStage.id,
      order: targetStage.widgets.length + 1,
      isRequiredMilestone,
      isCompleted: false
    };

    onAddWidget(newWidget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Drop Widget into {targetStage.name}
              </h3>
              <p className="text-xs text-slate-500">
                Select an interactive component to add to this candidate stage.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <label className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
            Select Structured Milestone Widget
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {widgetCatalog.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedType === item.type;

              return (
                <div
                  key={item.type}
                  onClick={() => {
                    setSelectedType(item.type);
                    setCustomTitle(item.title);
                    setCustomDesc(item.defaultDesc);
                  }}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                    isSelected 
                      ? "bg-purple-50/60 border-purple-400 ring-2 ring-purple-500/20 shadow-xs" 
                      : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      isSelected ? "bg-(--color-secondary-200) text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-2">
                    {item.defaultDesc}
                  </p>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-100 space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Widget Display Title
              </label>
              <input 
                type="text" 
                placeholder={currentSelection.title}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Contextual Description / Instructions for Candidate
              </label>
              <textarea 
                rows={2}
                placeholder={currentSelection.defaultDesc}
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input 
                  type="checkbox"
                  checked={isRequiredMilestone}
                  onChange={(e) => setIsRequiredMilestone(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>Designate as Required Stage Milestone before candidate can advance</span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-bold shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Drop Widget into Stage</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
