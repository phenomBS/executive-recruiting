import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  Send, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Clock, 
  User, 
  Users, 
  Building2, 
  MapPin, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  AlertCircle,
  FolderPlus,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Monitor,
  Briefcase,
  ExternalLink,
  ChevronDown,
  Sliders
} from 'lucide-react';
import { 
  DealRoom, 
  DealRoomStage, 
  DealRoomWidget, 
  DealRoomStakeholder, 
  DealRoomAttachment,
  FinancialOfferModel,
  DealRoomDeliveryChannel,
  DEFAULT_DEAL_ROOM_DESIGN
} from '../../data/dealRoomsData';
import { NdaAgreementWidget } from './widgets/NdaAgreementWidget';
import { FinancialEquityCalculatorWidget } from './widgets/FinancialEquityCalculatorWidget';
import { CeoWelcomeVideoWidget } from './widgets/CeoWelcomeVideoWidget';
import { OpportunityStrategicWidget } from './widgets/OpportunityStrategicWidget';
import { DealTeamStakeholdersWidget } from './widgets/DealTeamStakeholdersWidget';
import { ExecutiveOfferPackageWidget } from './widgets/ExecutiveOfferPackageWidget';
import { DocumentAttachmentsWidget } from './widgets/DocumentAttachmentsWidget';
import { ExecutiveQnAWidget } from './widgets/ExecutiveQnAWidget';
import { AddStakeholderModal } from './AddStakeholderModal';
import { GoLiveDispatchModal } from './GoLiveDispatchModal';
import { AddWidgetModal } from './AddWidgetModal';
import { CandidateFlowTracker } from './CandidateFlowTracker';
import { DockRoomEditor } from './DockRoomEditor';
import { cn } from '../../lib/utils';

interface DealRoomDetailViewProps {
  dealRoom: DealRoom;
  onBack: () => void;
  onUpdateDealRoom: (updatedRoom: DealRoom) => void;
}

export function DealRoomDetailView({
  dealRoom: initialDealRoom,
  onBack,
  onUpdateDealRoom
}: DealRoomDetailViewProps) {
  const [room, setRoom] = useState<DealRoom>(initialDealRoom);
  
  // Dock.us product design & content editor state
  const [isDockEditorOpen, setIsDockEditorOpen] = useState<boolean>(false);

  // Preview mode toggle: Recruiter Edit/Management Mode vs Candidate Branded Preview
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  
  // Active Stage
  const [activeStageId, setActiveStageId] = useState<string>(
    initialDealRoom.stages[0]?.id || ''
  );

  // Modals state
  const [isAddStakeholderOpen, setIsAddStakeholderOpen] = useState(false);
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeStage = room.stages.find(s => s.id === activeStageId) || room.stages[0];

  const updateAndSync = (updated: DealRoom) => {
    setRoom(updated);
    onUpdateDealRoom(updated);
  };

  // If Dock.us product editor is active, render full visual editor
  if (isDockEditorOpen) {
    return (
      <DockRoomEditor 
        dealRoom={room}
        onSave={(updated) => updateAndSync(updated)}
        onClose={() => setIsDockEditorOpen(false)}
      />
    );
  }

  // Tag In Stakeholder
  const handleAddStakeholder = (newStakeholder: DealRoomStakeholder) => {
    const updated: DealRoom = {
      ...room,
      stakeholders: [...room.stakeholders, newStakeholder]
    };
    updateAndSync(updated);
    showToast(`Tagged ${newStakeholder.name} (${newStakeholder.stakeholderType}) into opportunity room!`);
  };

  // Remove Stakeholder
  const handleRemoveStakeholder = (stakeholderId: string) => {
    const updated: DealRoom = {
      ...room,
      stakeholders: room.stakeholders.filter(s => s.id !== stakeholderId)
    };
    updateAndSync(updated);
    showToast('Removed tagged stakeholder from opportunity room.');
  };

  // Add Document Attachment
  const handleAddAttachment = (doc: DealRoomAttachment) => {
    const updated: DealRoom = {
      ...room,
      attachments: [doc, ...room.attachments]
    };
    updateAndSync(updated);
    showToast(`Attached ${doc.fileName} to document vault.`);
  };

  // Remove Attachment
  const handleRemoveAttachment = (docId: string) => {
    const updated: DealRoom = {
      ...room,
      attachments: room.attachments.filter(a => a.id !== docId)
    };
    updateAndSync(updated);
    showToast('Document removed.');
  };

  // Update Financial Model
  const handleUpdateFinancialModel = (newModel: FinancialOfferModel) => {
    const updated: DealRoom = {
      ...room,
      financialModel: newModel
    };
    updateAndSync(updated);
  };

  // Drop Additional Widget into current stage
  const handleAddWidget = (widget: DealRoomWidget) => {
    const updatedStages = room.stages.map(stage => {
      if (stage.id === activeStage.id) {
        return {
          ...stage,
          widgets: [...stage.widgets, widget]
        };
      }
      return stage;
    });

    const updated: DealRoom = {
      ...room,
      stages: updatedStages
    };
    updateAndSync(updated);
    showToast(`Dropped ${widget.title} into ${activeStage.name}!`);
  };

  // Remove widget from stage
  const handleRemoveWidget = (stageId: string, widgetId: string) => {
    const updatedStages = room.stages.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          widgets: stage.widgets.filter(w => w.id !== widgetId)
        };
      }
      return stage;
    });
    const updated: DealRoom = {
      ...room,
      stages: updatedStages
    };
    updateAndSync(updated);
    showToast('Widget removed from stage.');
  };

  // Reorder widget up or down in current stage
  const handleMoveWidget = (stageId: string, widgetIdx: number, direction: 'up' | 'down') => {
    const targetStage = room.stages.find(s => s.id === stageId);
    if (!targetStage) return;

    const widgets = [...targetStage.widgets];
    const newIdx = direction === 'up' ? widgetIdx - 1 : widgetIdx + 1;
    if (newIdx < 0 || newIdx >= widgets.length) return;

    const temp = widgets[widgetIdx];
    widgets[widgetIdx] = widgets[newIdx];
    widgets[newIdx] = temp;

    const updatedStages = room.stages.map(s => {
      if (s.id === stageId) {
        return { ...s, widgets };
      }
      return s;
    });

    const updated: DealRoom = { ...room, stages: updatedStages };
    updateAndSync(updated);
  };

  // Add New Stage
  const handleCreateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage: DealRoomStage = {
      id: `stg-${Date.now()}`,
      name: newStageName.trim(),
      order: room.stages.length + 1,
      status: 'current',
      description: newStageDesc.trim() || `Milestone review for ${newStageName.trim()}`,
      widgets: []
    };

    const updated: DealRoom = {
      ...room,
      stages: [...room.stages, newStage]
    };
    updateAndSync(updated);
    setActiveStageId(newStage.id);
    setIsAddStageOpen(false);
    setNewStageName('');
    setNewStageDesc('');
    showToast(`Added stage: ${newStage.name}`);
  };

  // Confirm Go Live
  const handleConfirmGoLive = (channels: DealRoomDeliveryChannel[], notes: string) => {
    const updated: DealRoom = {
      ...room,
      status: 'Live / Sent',
      deliveryConfig: {
        ...room.deliveryConfig,
        channels,
        sentAt: 'Just now',
        viewsCount: 1,
        totalTimeMinutes: 2
      }
    };
    updateAndSync(updated);
    showToast(`Opportunity room went live! Dispatched via ${channels.length} secure channels.`);
  };

  // Render Widget based on type
  const renderWidgetContent = (widget: DealRoomWidget, stageId: string, idx: number) => {
    let renderedComponent = null;

    switch (widget.type) {
      case 'ceo_welcome_video':
        renderedComponent = (
          <CeoWelcomeVideoWidget 
            candidateName={room.candidateName}
            isRecruiterPreview={isPreviewMode}
          />
        );
        break;
      case 'nda_agreement':
        renderedComponent = (
          <NdaAgreementWidget 
            candidateName={room.candidateName}
            isSigned={room.deliveryConfig.ndaSignedAt ? true : false}
            signedDate={room.deliveryConfig.ndaSignedAt}
            isRecruiterPreview={isPreviewMode}
            onSignNda={() => {
              const updated = {
                ...room,
                status: 'NDA Signed' as DealRoom['status'],
                deliveryConfig: {
                  ...room.deliveryConfig,
                  ndaSignedAt: 'Oct 06, 2026'
                }
              };
              updateAndSync(updated);
              showToast('Mutual Executive NDA digitally signed!');
            }}
          />
        );
        break;
      case 'equity_calculator':
        renderedComponent = (
          <FinancialEquityCalculatorWidget 
            model={room.financialModel}
            candidateName={room.candidateName}
            onUpdateModel={handleUpdateFinancialModel}
            isRecruiterPreview={isPreviewMode}
          />
        );
        break;
      case 'opportunity_strategic':
        renderedComponent = (
          <OpportunityStrategicWidget 
            targetRole={room.targetRole}
            department={room.department}
            isRecruiterPreview={isPreviewMode}
          />
        );
        break;
      case 'deal_team':
        renderedComponent = (
          <DealTeamStakeholdersWidget 
            stakeholders={room.stakeholders}
            onOpenAddStakeholderModal={() => setIsAddStakeholderOpen(true)}
            onRemoveStakeholder={handleRemoveStakeholder}
            isRecruiterPreview={isPreviewMode}
          />
        );
        break;
      case 'document_attachments':
        renderedComponent = (
          <DocumentAttachmentsWidget 
            attachments={room.attachments}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
            isRecruiterPreview={isPreviewMode}
          />
        );
        break;
      case 'executive_qna':
        renderedComponent = (
          <ExecutiveQnAWidget 
            candidateName={room.candidateName}
            recruiterName={room.leadRecruiter}
            isRecruiterPreview={isPreviewMode}
          />
        );
        break;
      default:
        renderedComponent = (
          <OpportunityStrategicWidget 
            targetRole={room.targetRole}
            department={room.department}
            isRecruiterPreview={isPreviewMode}
          />
        );
        break;
    }

    return (
      <div key={widget.id} className="relative group/widget-container">
        {/* Recruiter controls over widgets (hidden in candidate preview mode) */}
        {!isPreviewMode && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 opacity-0 group-hover/widget-container:opacity-100 transition-opacity bg-white/95 backdrop-blur-xs p-1.5 rounded-xl shadow-md border border-slate-200">
            <button
              type="button"
              disabled={idx === 0}
              onClick={() => handleMoveWidget(stageId, idx, 'up')}
              className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
              title="Move Widget Up"
            >
              <MoveUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={idx === activeStage.widgets.length - 1}
              onClick={() => handleMoveWidget(stageId, idx, 'down')}
              className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
              title="Move Widget Down"
            >
              <MoveDown className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-slate-200" />
            <button
              type="button"
              onClick={() => handleRemoveWidget(stageId, widget.id)}
              className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
              title="Remove Widget from Stage"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {renderedComponent}
      </div>
    );
  };

  return (
    <div className={cn(
      "min-h-full pb-20 transition-colors",
      isPreviewMode ? "bg-[#0B0F19] text-slate-100" : "bg-(--bg-surface-base) text-slate-900"
    )}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slideUp border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}
      <AddStakeholderModal 
        isOpen={isAddStakeholderOpen}
        onClose={() => setIsAddStakeholderOpen(false)}
        onAddStakeholder={handleAddStakeholder}
        dealRoomTitle={room.title}
      />

      <GoLiveDispatchModal 
        isOpen={isGoLiveModalOpen}
        onClose={() => setIsGoLiveModalOpen(false)}
        dealRoom={room}
        onConfirmGoLive={handleConfirmGoLive}
        onOpenPreview={() => setIsPreviewMode(true)}
      />

      {activeStage && (
        <AddWidgetModal 
          isOpen={isAddWidgetOpen}
          onClose={() => setIsAddWidgetOpen(false)}
          targetStage={activeStage}
          onAddWidget={handleAddWidget}
        />
      )}

      {/* TOP CONTROL BAR: Back button, Preview Toggle, Go Live Dispatch */}
      <div className={cn(
        "sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3",
        isPreviewMode 
          ? "bg-slate-900/90 border-slate-800 text-white shadow-xl" 
          : "bg-white/95 border-slate-200 text-slate-800 shadow-2xs"
      )}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer",
              isPreviewMode 
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" 
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Opportunity Rooms</span>
          </button>

          <div className="h-5 w-px bg-slate-300/60 dark:bg-slate-700" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold truncate max-w-xs sm:max-w-md">
              {room.title}
            </span>
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
              room.status === 'Draft' ? "bg-amber-100 text-amber-800 border border-amber-200" :
              room.status === 'Live / Sent' ? "bg-blue-100 text-blue-800 border border-blue-200" :
              room.status === 'NDA Signed' ? "bg-purple-100 text-purple-800 border border-purple-200" :
              "bg-emerald-100 text-emerald-800 border border-emerald-200"
            )}>
              {room.status}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* EDIT DESIGN & CONTENT BUTTON (DOCK.US PRODUCT EDITOR) */}
          <button
            type="button"
            onClick={() => setIsDockEditorOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white"
            title="Open Dock.us style visual design and content editor"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Design & Content</span>
          </button>

          {/* PREVIEW BUTTON */}
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs",
              isPreviewMode 
                ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400/40" 
                : "bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
            )}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Exit Candidate Preview' : 'Preview Opportunity Room'}</span>
          </button>

          {/* TAG STAKEHOLDER BUTTON (can do at any point) */}
          <button
            type="button"
            onClick={() => setIsAddStakeholderOpen(true)}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs",
              isPreviewMode 
                ? "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700" 
                : "bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
            )}
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Tag Stakeholder ({room.stakeholders.length})</span>
          </button>

          {/* GO LIVE & DISPATCH BUTTON */}
          <button
            type="button"
            onClick={() => setIsGoLiveModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{room.status === 'Draft' ? 'Go Live & Dispatch' : 'Dispatch Channels'}</span>
          </button>
        </div>
      </div>

      {/* 1. CANDIDATE CONFIGURED FLOW & JOURNEY TRACKER */}
      {/* LISTS FIRST WHERE THE EXECUTIVE CANDIDATE IS IN THE CONFIGURED FLOW */}
      {!isPreviewMode && (
        <div className="bg-(--bg-surface-base) border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            <CandidateFlowTracker 
              dealRoom={room}
              activeStageId={activeStageId}
              onSelectStage={(stgId) => setActiveStageId(stgId)}
              onUpdateDealRoom={updateAndSync}
            />

            {/* Dock Editor Launch Callout Banner */}
            <div className="p-3.5 rounded-2xl bg-purple-50/90 border border-purple-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-600 text-white shrink-0">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-purple-900 block">
                    Need to adjust the opportunity room design, branding, or content blocks?
                  </span>
                  <span className="text-purple-700 text-[11px]">
                    Customize colors, cover banners, executive welcome notes, and modular milestone widgets in the Dock editor.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDockEditorOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shrink-0 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sliders className="w-3 h-3" />
                <span>Open Dock Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE BRANDED HERO BANNER */}
      <div className={cn(
        "border-b transition-colors",
        isPreviewMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200/90"
      )}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img 
                  src={room.candidateAvatarUrl} 
                  alt={room.candidateName}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-500/20 shadow-md" 
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className={cn(
                    "text-xl sm:text-2xl font-bold tracking-tight",
                    isPreviewMode ? "text-white" : "text-slate-900"
                  )}>
                    Executive Opportunity Room for {room.candidateName}
                  </h1>
                </div>

                <div className={cn(
                  "flex items-center gap-2 mt-1 text-xs flex-wrap",
                  isPreviewMode ? "text-slate-400" : "text-slate-600"
                )}>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    Target Mandate: {room.targetRole}
                  </span>
                  <span>·</span>
                  <span>{room.department}</span>
                  <span>·</span>
                  <span>Current: {room.candidateCurrentRole} at {room.candidateCurrentCompany}</span>
                </div>

                {/* Tagged Stakeholders mini-avatars row */}
                <div className="flex items-center gap-2 mt-3">
                  <span className={cn(
                    "text-[11px] font-semibold uppercase tracking-wider",
                    isPreviewMode ? "text-slate-400" : "text-slate-500"
                  )}>
                    Executive Sponsors:
                  </span>
                  <div className="flex items-center -space-x-1.5">
                    {room.stakeholders.map((s) => (
                      <img 
                        key={s.id}
                        src={s.avatarUrl} 
                        alt={s.name} 
                        title={`${s.name} (${s.stakeholderType})`}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-white border border-slate-200"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddStakeholderOpen(true)}
                    className={cn(
                      "text-[11px] font-bold hover:underline cursor-pointer ml-1",
                      isPreviewMode ? "text-purple-400" : "text-purple-600"
                    )}
                  >
                    + Tag More
                  </button>
                </div>
              </div>
            </div>

            {/* Room Analytics & Verification Pill */}
            <div className={cn(
              "p-3.5 rounded-2xl border flex flex-col gap-1.5 self-start md:self-auto min-w-[200px]",
              isPreviewMode ? "bg-slate-800/80 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
            )}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Template:</span>
                <span className="font-bold truncate max-w-[120px]">{room.templateName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Lead Recruiter:</span>
                <span className="font-semibold">{room.leadRecruiter}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Candidate Views:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{room.deliveryConfig.viewsCount} visits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAGES NAVIGATION BAR */}
      <div className={cn(
        "border-b sticky top-[57px] z-30 transition-colors",
        isPreviewMode ? "bg-[#0d1322] border-slate-800" : "bg-white border-slate-200 shadow-2xs"
      )}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto py-2">
            {/* Stages tabs */}
            <div className="flex items-center gap-1.5 min-w-max">
              {room.stages.map((stage, idx) => {
                const isActive = stage.id === activeStageId;
                const widgetCount = stage.widgets.length;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                      isActive 
                        ? (isPreviewMode 
                            ? "bg-purple-600 text-white shadow-lg ring-1 ring-purple-400" 
                            : "bg-(--color-secondary-200) text-white shadow-xs")
                        : (isPreviewMode 
                            ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100")
                    )}
                  >
                    <span className={cn(
                      "w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold",
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    )}>
                      {idx + 1}
                    </span>
                    <span>{stage.name}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                      {widgetCount} widgets
                    </span>
                  </button>
                );
              })}

              {/* Add Stage button (in recruiter mode) */}
              {!isPreviewMode && (
                <button
                  type="button"
                  onClick={() => setIsAddStageOpen(true)}
                  className="px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-purple-500 text-slate-600 hover:text-purple-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Define Stage</span>
                </button>
              )}
            </div>

            {/* Drop Widget Action (in recruiter mode) */}
            {!isPreviewMode && (
              <button
                type="button"
                onClick={() => setIsAddWidgetOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Drop Widget into Stage</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ADD STAGE FORM DRAWER / COLLAPSIBLE */}
      {isAddStageOpen && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-fadeIn">
          <form onSubmit={handleCreateStage} className="p-4 rounded-2xl bg-white border border-purple-200 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-purple-600" />
                Define New Opportunity Room Stage
              </h4>
              <button 
                type="button" 
                onClick={() => setIsAddStageOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Stage Name (e.g. Stage 5: Board Dinner & Executive Reference Check)"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
                required
              />
              <input 
                type="text" 
                placeholder="Stage Description / Objective"
                value={newStageDesc}
                onChange={(e) => setNewStageDesc(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold cursor-pointer"
              >
                Save & Open Stage
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MAIN STAGE CONTENT & WIDGETS DISPLAY */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stage Header Info Banner */}
        <div className={cn(
          "p-4 rounded-2xl border flex items-center justify-between gap-4 transition-colors",
          isPreviewMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"
        )}>
          <div>
            <h2 className={cn(
              "text-base font-bold tracking-tight",
              isPreviewMode ? "text-white" : "text-slate-900"
            )}>
              {activeStage.name}
            </h2>
            <p className={cn(
              "text-xs mt-0.5",
              isPreviewMode ? "text-slate-400" : "text-slate-500"
            )}>
              {activeStage.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isPreviewMode && (
              <button
                type="button"
                onClick={() => setIsAddWidgetOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Widget</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State if stage has no widgets */}
        {activeStage.widgets.length === 0 ? (
          <div className={cn(
            "p-12 text-center rounded-2xl border-2 border-dashed space-y-3",
            isPreviewMode ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500 bg-white"
          )}>
            <Layers className="w-10 h-10 mx-auto text-purple-400" />
            <h3 className="text-sm font-bold">No widgets dropped in this stage yet</h3>
            <p className="text-xs max-w-sm mx-auto">
              Drop milestone widgets like the Mutual NDA, CEO Welcome Video, Equity Modeler, or Offer Package.
            </p>
            {!isPreviewMode && (
              <button
                type="button"
                onClick={() => setIsAddWidgetOpen(true)}
                className="px-4 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold cursor-pointer"
              >
                + Drop First Widget into {activeStage.name}
              </button>
            )}
          </div>
        ) : (
          /* Render Active Stage Widgets Stack */
          <div className="space-y-6">
            {activeStage.widgets.map((widget, idx) => 
              renderWidgetContent(widget, activeStage.id, idx)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
