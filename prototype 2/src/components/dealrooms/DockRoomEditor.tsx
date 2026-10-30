import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Check, 
  Eye, 
  Layout, 
  Palette, 
  Sliders, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  ShieldCheck, 
  Video, 
  FileText, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Layers, 
  Settings, 
  Sparkles, 
  GripVertical, 
  FolderPlus, 
  Monitor, 
  Image as ImageIcon, 
  Type, 
  ExternalLink,
  Lock,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  DealRoom, 
  DealRoomStage, 
  DealRoomWidget, 
  DealRoomDesignConfig, 
  DEFAULT_DEAL_ROOM_DESIGN,
  DealRoomWidgetType
} from '../../data/dealRoomsData';
import { cn } from '../../lib/utils';

// Widgets for live preview in canvas
import { NdaAgreementWidget } from './widgets/NdaAgreementWidget';
import { FinancialEquityCalculatorWidget } from './widgets/FinancialEquityCalculatorWidget';
import { CeoWelcomeVideoWidget } from './widgets/CeoWelcomeVideoWidget';
import { OpportunityStrategicWidget } from './widgets/OpportunityStrategicWidget';
import { DealTeamStakeholdersWidget } from './widgets/DealTeamStakeholdersWidget';
import { ExecutiveOfferPackageWidget } from './widgets/ExecutiveOfferPackageWidget';
import { DocumentAttachmentsWidget } from './widgets/DocumentAttachmentsWidget';
import { ExecutiveQnAWidget } from './widgets/ExecutiveQnAWidget';

interface DockRoomEditorProps {
  dealRoom: DealRoom;
  onSave: (updated: DealRoom) => void;
  onClose: () => void;
}

type EditorSidebarTab = 'blocks' | 'design' | 'settings';

const ACCENT_COLORS = [
  { name: 'Brand Indigo', hex: 'var(--color-secondary-200)' },
  { name: 'Indigo Light', hex: 'var(--color-secondary-100)' },
  { name: 'Success Green', hex: 'var(--color-green-400)' },
  { name: 'Neutral Strong', hex: 'var(--color-neutrals-500)' },
  { name: 'Brand Teal', hex: 'var(--color-primary-400)' },
  { name: 'Error Red', hex: 'var(--color-red-400)' },
  { name: 'Warning', hex: 'var(--color-yellow-400)' },
];

const BANNER_THEMES = [
  { 
    id: 'modern_gradient', 
    name: 'Modern Gradient Glow', 
    preview: 'from-purple-900 via-indigo-950 to-slate-900',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80'
  },
  { 
    id: 'midnight', 
    name: 'Executive Midnight Dark', 
    preview: 'from-slate-950 via-slate-900 to-slate-950',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80'
  },
  { 
    id: 'emerald_growth', 
    name: 'High-Growth Emerald', 
    preview: 'from-emerald-950 via-teal-900 to-slate-950',
    img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80'
  },
  { 
    id: 'corporate_indigo', 
    name: 'Corporate Tech Indigo', 
    preview: 'from-blue-950 via-indigo-900 to-slate-900',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80'
  },
  { 
    id: 'minimal_slate', 
    name: 'Minimalist Clean Slate', 
    preview: 'from-slate-800 via-slate-700 to-slate-800',
    img: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&auto=format&fit=crop&q=80'
  }
];

const WIDGET_CATALOG: {
  type: DealRoomWidgetType;
  title: string;
  description: string;
  category: string;
  icon: any;
}[] = [
  {
    type: 'nda_agreement',
    title: 'Mutual Executive Confidentiality Agreement (NDA)',
    description: 'Digital signature milestone protecting strategic IP and recruitment discussions.',
    category: 'Legal & Compliance',
    icon: ShieldCheck
  },
  {
    type: 'equity_calculator',
    title: 'Financial Equity & Total Rewards Modeler',
    description: 'Interactive calculator for base, bonus, vesting, and valuation upside.',
    category: 'Compensation',
    icon: DollarSign
  },
  {
    type: 'ceo_welcome_video',
    title: 'CEO / Leadership Video Greeting',
    description: 'Embedded video from the CEO or hiring executive welcoming the candidate.',
    category: 'Engagement',
    icon: Video
  },
  {
    type: 'opportunity_strategic',
    title: 'Strategic Mandate & Org Scope Briefing',
    description: 'Executive outline of headcount, revenue scope, and 3-year mandate deliverables.',
    category: 'Strategy',
    icon: FileText
  },
  {
    type: 'deal_team',
    title: 'Executive Deal Team & Board Sponsors',
    description: 'Tagged leadership stakeholders, CEO, Board Members, and Lead Recruiter.',
    category: 'People',
    icon: Users
  },
  {
    type: 'document_attachments',
    title: 'Confidential Document Vault',
    description: 'Secure attachments: board decks, total rewards overviews, roadmap PDFs.',
    category: 'Documents',
    icon: FileText
  },
  {
    type: 'executive_qna',
    title: 'Confidential Executive Q&A Channel',
    description: 'Private asynchronous discussion channel between executive and recruiter.',
    category: 'Communication',
    icon: MessageSquare
  }
];

export function DockRoomEditor({ dealRoom: initialDealRoom, onSave, onClose }: DockRoomEditorProps) {
  const [room, setRoom] = useState<DealRoom>({
    ...initialDealRoom,
    designConfig: initialDealRoom.designConfig || DEFAULT_DEAL_ROOM_DESIGN
  });

  const [activeTab, setActiveTab] = useState<EditorSidebarTab>('blocks');
  const [activeStageId, setActiveStageId] = useState<string>(
    initialDealRoom.stages[0]?.id || ''
  );
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState<'editor' | 'candidate_preview'>('editor');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New stage form state
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const activeStage = room.stages.find(s => s.id === activeStageId) || room.stages[0];
  const design = room.designConfig || DEFAULT_DEAL_ROOM_DESIGN;

  const updateRoomState = (newRoom: DealRoom) => {
    setRoom(newRoom);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onSave(room);
    setHasUnsavedChanges(false);
    showToast('Saved all opportunity room design and content changes!');
  };

  // Block management
  const handleAddWidget = (widgetType: DealRoomWidgetType, title: string, description: string) => {
    if (!activeStage) return;

    const newWidget: DealRoomWidget = {
      id: `w-${Date.now()}`,
      type: widgetType,
      title,
      description,
      stageId: activeStage.id,
      order: activeStage.widgets.length + 1,
      isRequiredMilestone: false,
      isCompleted: false
    };

    const targetWidgets = [...activeStage.widgets];
    if (insertAtIndex !== null && insertAtIndex >= 0 && insertAtIndex <= targetWidgets.length) {
      targetWidgets.splice(insertAtIndex, 0, newWidget);
    } else {
      targetWidgets.push(newWidget);
    }

    const updatedStages = room.stages.map(s => {
      if (s.id === activeStage.id) {
        return { ...s, widgets: targetWidgets };
      }
      return s;
    });

    updateRoomState({ ...room, stages: updatedStages });
    setIsAddBlockModalOpen(false);
    setInsertAtIndex(null);
    showToast(`Added ${title} block to ${activeStage.name}!`);
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (!activeStage) return;
    const updatedStages = room.stages.map(s => {
      if (s.id === activeStage.id) {
        return {
          ...s,
          widgets: s.widgets.filter(w => w.id !== widgetId)
        };
      }
      return s;
    });
    updateRoomState({ ...room, stages: updatedStages });
    showToast('Block removed from stage.');
  };

  const handleMoveWidget = (widgetIdx: number, direction: 'up' | 'down') => {
    if (!activeStage) return;
    const widgets = [...activeStage.widgets];
    const targetIdx = direction === 'up' ? widgetIdx - 1 : widgetIdx + 1;
    if (targetIdx < 0 || targetIdx >= widgets.length) return;

    const temp = widgets[widgetIdx];
    widgets[widgetIdx] = widgets[targetIdx];
    widgets[targetIdx] = temp;

    const updatedStages = room.stages.map(s => {
      if (s.id === activeStage.id) {
        return { ...s, widgets };
      }
      return s;
    });
    updateRoomState({ ...room, stages: updatedStages });
  };

  const handleToggleRequired = (widgetId: string) => {
    if (!activeStage) return;
    const updatedStages = room.stages.map(s => {
      if (s.id === activeStage.id) {
        return {
          ...s,
          widgets: s.widgets.map(w => {
            if (w.id === widgetId) {
              return { ...w, isRequiredMilestone: !w.isRequiredMilestone };
            }
            return w;
          })
        };
      }
      return s;
    });
    updateRoomState({ ...room, stages: updatedStages });
  };

  const handleUpdateWidgetTitle = (widgetId: string, title: string) => {
    if (!activeStage) return;
    const updatedStages = room.stages.map(s => {
      if (s.id === activeStage.id) {
        return {
          ...s,
          widgets: s.widgets.map(w => {
            if (w.id === widgetId) {
              return { ...w, title };
            }
            return w;
          })
        };
      }
      return s;
    });
    updateRoomState({ ...room, stages: updatedStages });
  };

  // Stage management
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

    updateRoomState({
      ...room,
      stages: [...room.stages, newStage]
    });
    setActiveStageId(newStage.id);
    setIsAddingStage(false);
    setNewStageName('');
    setNewStageDesc('');
    showToast(`Added new stage: ${newStage.name}`);
  };

  const handleDeleteStage = (stageId: string) => {
    if (room.stages.length <= 1) {
      alert('An opportunity room must contain at least one configured stage.');
      return;
    }
    const filteredStages = room.stages.filter(s => s.id !== stageId);
    updateRoomState({ ...room, stages: filteredStages });
    if (activeStageId === stageId) {
      setActiveStageId(filteredStages[0]?.id || '');
    }
    showToast('Stage deleted.');
  };

  // Design updates
  const handleUpdateDesign = (patch: Partial<DealRoomDesignConfig>) => {
    const updatedDesign: DealRoomDesignConfig = {
      ...design,
      ...patch
    };
    updateRoomState({
      ...room,
      designConfig: updatedDesign
    });
  };

  // Render Widget in canvas
  const renderCanvasWidget = (widget: DealRoomWidget, idx: number) => {
    let renderedWidget = null;
    switch (widget.type) {
      case 'ceo_welcome_video':
        renderedWidget = (
          <CeoWelcomeVideoWidget 
            candidateName={room.candidateName}
            isRecruiterPreview={previewMode === 'candidate_preview'}
          />
        );
        break;
      case 'nda_agreement':
        renderedWidget = (
          <NdaAgreementWidget 
            candidateName={room.candidateName}
            isSigned={room.deliveryConfig.ndaSignedAt ? true : false}
            signedDate={room.deliveryConfig.ndaSignedAt}
            isRecruiterPreview={previewMode === 'candidate_preview'}
            onSignNda={() => {}}
          />
        );
        break;
      case 'equity_calculator':
        renderedWidget = (
          <FinancialEquityCalculatorWidget 
            model={room.financialModel}
            candidateName={room.candidateName}
            onUpdateModel={(newModel) => updateRoomState({ ...room, financialModel: newModel })}
            isRecruiterPreview={previewMode === 'candidate_preview'}
          />
        );
        break;
      case 'opportunity_strategic':
        renderedWidget = (
          <OpportunityStrategicWidget 
            targetRole={room.targetRole}
            department={room.department}
            isRecruiterPreview={previewMode === 'candidate_preview'}
          />
        );
        break;
      case 'deal_team':
        renderedWidget = (
          <DealTeamStakeholdersWidget 
            stakeholders={room.stakeholders}
            isRecruiterPreview={previewMode === 'candidate_preview'}
            onOpenAddStakeholderModal={() => {}}
            onRemoveStakeholder={() => {}}
          />
        );
        break;
      case 'document_attachments':
        renderedWidget = (
          <DocumentAttachmentsWidget 
            attachments={room.attachments}
            isRecruiterPreview={previewMode === 'candidate_preview'}
            onAddAttachment={() => {}}
            onRemoveAttachment={() => {}}
          />
        );
        break;
      case 'executive_qna':
        renderedWidget = (
          <ExecutiveQnAWidget 
            candidateName={room.candidateName}
            recruiterName={room.leadRecruiter}
            isRecruiterPreview={previewMode === 'candidate_preview'}
          />
        );
        break;
      default:
        renderedWidget = (
          <div className="p-6 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800">{widget.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{widget.description}</p>
          </div>
        );
    }

    if (previewMode === 'candidate_preview') {
      return (
        <div key={widget.id} className="transition-all">
          {renderedWidget}
        </div>
      );
    }

    // In Dock Editor mode, wrap with Dock Block controls
    return (
      <div key={widget.id} className="group relative">
        <div className="rounded-2xl border-2 border-slate-200 hover:border-purple-500/80 bg-white shadow-xs hover:shadow-md transition-all overflow-hidden">
          {/* Dock Block Top Control Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <span className="cursor-grab text-slate-400 hover:text-slate-600">
                <GripVertical className="w-4 h-4" />
              </span>
              <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                {idx + 1}
              </span>
              <input 
                type="text" 
                value={widget.title} 
                onChange={(e) => handleUpdateWidgetTitle(widget.id, e.target.value)}
                className="font-bold text-slate-800 bg-transparent hover:bg-white focus:bg-white px-2 py-0.5 rounded border border-transparent focus:border-purple-300 outline-hidden text-xs flex-1 max-w-md truncate"
                title="Click to edit block title"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Toggle Required Milestone */}
              <button
                type="button"
                onClick={() => handleToggleRequired(widget.id)}
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer",
                  widget.isRequiredMilestone 
                    ? "bg-rose-100 text-rose-700 border border-rose-200" 
                    : "bg-slate-200/80 text-slate-600 hover:bg-slate-300"
                )}
                title="Toggle milestone completion requirement"
              >
                {widget.isRequiredMilestone ? 'Required Milestone' : 'Optional'}
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              {/* Move Up */}
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMoveWidget(idx, 'up')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 cursor-pointer"
                title="Move block up"
              >
                <MoveUp className="w-3.5 h-3.5" />
              </button>

              {/* Move Down */}
              <button
                type="button"
                disabled={idx === activeStage.widgets.length - 1}
                onClick={() => handleMoveWidget(idx, 'down')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 cursor-pointer"
                title="Move block down"
              >
                <MoveDown className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleRemoveWidget(widget.id)}
                className="p-1.5 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                title="Delete block from stage"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render actual widget inner view */}
          <div className="p-4 sm:p-5 pointer-events-auto">
            {renderedWidget}
          </div>
        </div>

        {/* Dock-style Add Block Divider between blocks */}
        <div className="relative py-2.5 flex items-center justify-center opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-purple-300" />
          </div>
          <button
            type="button"
            onClick={() => {
              setInsertAtIndex(idx + 1);
              setIsAddBlockModalOpen(true);
            }}
            className="relative px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-transform hover:scale-105 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Insert Block Here</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-(--color-grays-50) flex flex-col antialiased">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* DOCK.US TOP WORKSPACE HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-2xs">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Details</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
              Dock Editor
            </span>
            <span className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
              {room.title}
            </span>
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Unsaved changes" />
            )}
          </div>
        </div>

        {/* Center: Mode Switcher (Editor vs Candidate Preview) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setPreviewMode('editor')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer",
              previewMode === 'editor' 
                ? "bg-white text-purple-700 shadow-2xs" 
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Dock Canvas Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode('candidate_preview')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer",
              previewMode === 'candidate_preview' 
                ? "bg-purple-600 text-white shadow-2xs" 
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Candidate Live View</span>
          </button>
        </div>

        {/* Right: Save & Done Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish Changes</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </header>

      {/* MAIN STUDIO WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT DOCK CONTROL RAIL (Only visible in editor mode) */}
        {previewMode === 'editor' && (
          <aside className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
            {/* Dock Sidebar Navigation Tabs */}
            <div className="flex items-center border-b border-slate-200 p-2 gap-1 bg-slate-50">
              <button
                type="button"
                onClick={() => setActiveTab('blocks')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                  activeTab === 'blocks' ? "bg-white text-purple-700 shadow-2xs" : "text-slate-600 hover:bg-slate-200/60"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Blocks</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                  activeTab === 'design' ? "bg-white text-purple-700 shadow-2xs" : "text-slate-600 hover:bg-slate-200/60"
                )}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Design</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                  activeTab === 'settings' ? "bg-white text-purple-700 shadow-2xs" : "text-slate-600 hover:bg-slate-200/60"
                )}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Access</span>
              </button>
            </div>

            {/* TAB CONTENT: BLOCKS & STAGES */}
            {activeTab === 'blocks' && (
              <div className="p-4 space-y-5">
                {/* Stages Manager */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Journey Stages ({room.stages.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingStage(true)}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stage</span>
                    </button>
                  </div>

                  {isAddingStage && (
                    <form onSubmit={handleCreateStage} className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2 mb-3">
                      <input 
                        type="text" 
                        placeholder="Stage Name"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-purple-300 bg-white"
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="Stage Objective / Summary"
                        value={newStageDesc}
                        onChange={(e) => setNewStageDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-purple-300 bg-white"
                      />
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingStage(false)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs bg-purple-600 text-white rounded font-bold"
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-1.5">
                    {room.stages.map((stage, idx) => {
                      const isSelected = stage.id === activeStageId;
                      return (
                        <div
                          key={stage.id}
                          onClick={() => setActiveStageId(stage.id)}
                          className={cn(
                            "p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors text-xs",
                            isSelected 
                              ? "bg-purple-50 border-purple-300 text-purple-900 font-bold shadow-2xs" 
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0",
                              isSelected ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                            )}>
                              {idx + 1}
                            </span>
                            <span className="truncate">{stage.name}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-slate-400 font-normal">
                              {stage.widgets.length}
                            </span>
                            {room.stages.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStage(stage.id);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Delete stage"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Blocks in Current Stage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Blocks in {activeStage?.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setInsertAtIndex(null);
                      setIsAddBlockModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-purple-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mb-3"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Block to Stage</span>
                  </button>

                  <div className="space-y-2">
                    {activeStage?.widgets.map((w, idx) => (
                      <div 
                        key={w.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          <div className="truncate">
                            <p className="font-semibold text-slate-800 truncate">{w.title}</p>
                            <span className="text-[10px] text-slate-400 capitalize">
                              {w.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveWidget(idx, 'up')}
                            className="p-1 hover:bg-slate-100 text-slate-400 disabled:opacity-20 rounded"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === activeStage.widgets.length - 1}
                            onClick={() => handleMoveWidget(idx, 'down')}
                            className="p-1 hover:bg-slate-100 text-slate-400 disabled:opacity-20 rounded"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveWidget(w.id)}
                            className="p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DESIGN & STYLING (Dock.us Palette) */}
            {activeTab === 'design' && (
              <div className="p-4 space-y-5 text-xs">
                {/* Accent Color Palette */}
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Theme Accent Color
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {ACCENT_COLORS.map(c => {
                      const isSelected = design.accentColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handleUpdateDesign({ accentColor: c.hex })}
                          style={{ backgroundColor: c.hex }}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative",
                            isSelected ? "border-white ring-2 ring-purple-600 scale-110 shadow-md" : "border-transparent hover:scale-105"
                          )}
                          title={c.name}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 text-white mx-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Banner Cover Theme */}
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Cover Banner Theme
                  </label>
                  <div className="space-y-2">
                    {BANNER_THEMES.map(t => {
                      const isSelected = design.bannerTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleUpdateDesign({ bannerTheme: t.id as any, bannerCustomUrl: t.img })}
                          className={cn(
                            "w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer",
                            isSelected ? "border-purple-600 bg-purple-50 ring-1 ring-purple-500 shadow-2xs" : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br shrink-0 shadow-xs", t.preview)} />
                          <div className="truncate flex-1">
                            <span className="font-bold text-slate-900 block truncate">{t.name}</span>
                            <span className="text-[10px] text-slate-500">Boardroom Quality</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Header Layout */}
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Header Layout Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['standard', 'spotlight', 'compact'] as const).map(layoutStyle => (
                      <button
                        key={layoutStyle}
                        type="button"
                        onClick={() => handleUpdateDesign({ headerStyle: layoutStyle })}
                        className={cn(
                          "p-2 rounded-xl border text-center capitalize font-bold transition-all cursor-pointer",
                          design.headerStyle === layoutStyle 
                            ? "bg-purple-600 text-white border-purple-600 shadow-2xs" 
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        {layoutStyle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Executive Welcome Note */}
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Personalized Welcome Message
                  </label>
                  <textarea 
                    rows={3}
                    value={design.welcomeNote || ''}
                    onChange={(e) => handleUpdateDesign({ welcomeNote: e.target.value })}
                    placeholder="Custom greeting message presented directly to the executive candidate..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>

                {/* Recruiter Transparency Note */}
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Recruiter Introduction Note
                  </label>
                  <textarea 
                    rows={3}
                    value={design.recruiterIntroNote || ''}
                    onChange={(e) => handleUpdateDesign({ recruiterIntroNote: e.target.value })}
                    placeholder="Overview of search mandate, deal team, and confidentiality framework..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>

                {/* Toggle Elements */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-slate-700">Show Tagged Sponsors in Header</span>
                    <input 
                      type="checkbox"
                      checked={design.showExecutiveSponsorsBar}
                      onChange={(e) => handleUpdateDesign({ showExecutiveSponsorsBar: e.target.checked })}
                      className="rounded text-purple-600"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-slate-700">Display Engagement Badge</span>
                    <input 
                      type="checkbox"
                      checked={design.showEngagementBadge}
                      onChange={(e) => handleUpdateDesign({ showEngagementBadge: e.target.checked })}
                      className="rounded text-purple-600"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ACCESS & GATING */}
            {activeTab === 'settings' && (
              <div className="p-4 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Room Gating Status
                  </label>
                  <select
                    value={room.status}
                    onChange={(e) => updateRoomState({ ...room, status: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="Draft">Draft (Internal Recruiter Only)</option>
                    <option value="Live / Sent">Live / Sent to Executive</option>
                    <option value="In Review">In Review (Active Interaction)</option>
                    <option value="NDA Signed">NDA Signed (Confidential Access)</option>
                    <option value="Offer Stage">Offer Stage (Compensation Delivery)</option>
                    <option value="Offer Accepted">Offer Accepted (Celebration)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Access Code Protection
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">Passcode Required</p>
                      <p className="text-[11px] text-slate-500">Requires unique one-time SMS verification</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={room.deliveryConfig.accessCodeRequired}
                      onChange={(e) => updateRoomState({
                        ...room,
                        deliveryConfig: { ...room.deliveryConfig, accessCodeRequired: e.target.checked }
                      })}
                      className="rounded text-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Mutual NDA Gate
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Requires executive to digitally sign before accessing confidential financial & org chart blocks.
                  </p>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold",
                    room.deliveryConfig.ndaSignedAt ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  )}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{room.deliveryConfig.ndaSignedAt ? `Signed on ${room.deliveryConfig.ndaSignedAt}` : 'Signature Gate Active'}</span>
                  </span>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* CENTER LIVE CANVAS (Dock.us Canvas) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* HERO BANNER SECTION (Reflecting live Dock design styles) */}
            <div className={cn(
              "rounded-3xl border shadow-md overflow-hidden transition-all relative text-white",
              design.bannerTheme === 'midnight' ? "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800" :
              design.bannerTheme === 'emerald_growth' ? "bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border-emerald-900" :
              design.bannerTheme === 'corporate_indigo' ? "bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 border-indigo-900" :
              design.bannerTheme === 'minimal_slate' ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700" :
              "bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border-purple-900"
            )}>
              <div className="p-6 sm:p-10 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  {/* Candidate Profile Avatar & Header Title */}
                  <div className="flex items-start gap-5">
                    <img 
                      src={room.candidateAvatarUrl} 
                      alt={room.candidateName}
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span 
                          style={{ backgroundColor: design.accentColor }}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
                        >
                          Executive Opportunity Room
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-semibold">
                          {room.status}
                        </span>
                      </div>

                      {previewMode === 'editor' ? (
                        <input 
                          type="text" 
                          value={room.title}
                          onChange={(e) => updateRoomState({ ...room, title: e.target.value })}
                          className="text-xl sm:text-2xl font-black bg-transparent hover:bg-white/10 focus:bg-white/15 px-2 py-1 rounded-lg border border-transparent focus:border-white/30 text-white outline-hidden w-full max-w-xl"
                          title="Click to edit room title"
                        />
                      ) : (
                        <h1 className="text-xl sm:text-2xl font-black text-white">
                          {room.title}
                        </h1>
                      )}

                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Prepared for <strong className="text-white">{room.candidateName}</strong> — Target Mandate: <strong className="text-white">{room.targetRole}</strong> ({room.department})
                      </p>
                    </div>
                  </div>

                  {/* Real-time visits card */}
                  {design.showEngagementBadge && (
                    <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md self-start shrink-0 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Views</span>
                      <span className="text-sm font-extrabold text-emerald-300">{room.deliveryConfig.viewsCount} visits logged</span>
                      <span className="text-[10px] text-slate-300 block mt-0.5">Recruiter: {room.leadRecruiter}</span>
                    </div>
                  )}
                </div>

                {/* Welcome Note from CEO / Recruiter */}
                {design.welcomeNote && (
                  <div className="mt-6 pt-5 border-t border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                    <p className="italic">"{design.welcomeNote}"</p>
                  </div>
                )}

                {/* Tagged Stakeholders Row */}
                {design.showExecutiveSponsorsBar && room.stakeholders.length > 0 && (
                  <div className="mt-5 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Leadership Deal Team:
                    </span>
                    <div className="flex items-center -space-x-2">
                      {room.stakeholders.map(s => (
                        <img 
                          key={s.id}
                          src={s.avatarUrl} 
                          alt={s.name}
                          title={`${s.name} (${s.stakeholderType})`}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-900"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-300 ml-1">
                      {room.stakeholders.length} tagged executive sponsors
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* STAGES BAR (Interactive Navigator) */}
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                {room.stages.map((stage, idx) => {
                  const isActive = stage.id === activeStageId;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setActiveStageId(stage.id)}
                      className={cn(
                        "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
                        isActive 
                          ? "bg-purple-600 text-white shadow-2xs" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black",
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      )}>
                        {idx + 1}
                      </span>
                      <span>{stage.name}</span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px]",
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        {stage.widgets.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {previewMode === 'editor' && (
                <button
                  type="button"
                  onClick={() => {
                    setInsertAtIndex(null);
                    setIsAddBlockModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Block</span>
                </button>
              )}
            </div>

            {/* ACTIVE STAGE CONTENT BLOCKS */}
            <div className="space-y-4">
              {activeStage?.widgets.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-300 bg-white space-y-3">
                  <Layers className="w-10 h-10 mx-auto text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-800">
                    No blocks in {activeStage?.name} yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add modular Dock blocks like Mutual NDA, Total Rewards Modeler, CEO Video, or Strategic Brief.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setInsertAtIndex(null);
                      setIsAddBlockModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Drop First Block</span>
                  </button>
                </div>
              ) : (
                activeStage?.widgets.map((widget, idx) => renderCanvasWidget(widget, idx))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* DOCK BLOCK CATALOG PICKER MODAL */}
      {isAddBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span>Insert Dock Block into {activeStage?.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a modular interactive milestone block to deliver to the executive candidate.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WIDGET_CATALOG.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.type}
                      type="button"
                      onClick={() => handleAddWidget(cat.type, cat.title, cat.description)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 text-left transition-all cursor-pointer group flex flex-col justify-between h-36"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 rounded-xl bg-purple-100 group-hover:bg-purple-600 text-purple-700 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {cat.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-purple-700">
                          {cat.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      <div className="flex items-center text-[10px] font-bold text-purple-600 mt-2">
                        <span>+ Add to Stage</span>
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
