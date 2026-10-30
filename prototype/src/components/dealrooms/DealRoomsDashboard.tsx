import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Handshake, 
  Sparkles, 
  Users, 
  FileCheck2, 
  ShieldCheck, 
  Eye, 
  Send, 
  Layers, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock,
  Building2,
  Video,
  Calculator,
  FileText
} from 'lucide-react';
import { 
  DealRoom, 
  dealRoomTemplates, 
  initialDealRooms,
  DealRoomTemplate
} from '../../data/dealRoomsData';
import { DealRoomDetailView } from './DealRoomDetailView';
import { CreateDealRoomModal } from './CreateDealRoomModal';
import { cn } from '../../lib/utils';
import { useRouter } from '../../context/RouterContext';

interface DealRoomsDashboardProps {
  initialDealRoomId?: string | null;
  onNavigateCandidate?: (candidateId: string) => void;
}

export function DealRoomsDashboard({
  initialDealRoomId,
  onNavigateCandidate
}: DealRoomsDashboardProps) {
  const router = useRouter();
  const [dealRooms, setDealRooms] = useState<DealRoom[]>(initialDealRooms);
  const selectedDealRoomId = router.dealRoomId || initialDealRoomId || null;
  const setSelectedDealRoomId = (id: string | null) => {
    router.setDealRoomId(id);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showTemplatesPreview, setShowTemplatesPreview] = useState(false);

  // Selected Deal Room object
  const selectedRoom = dealRooms.find(r => r.id === selectedDealRoomId);

  // Filtered rooms
  const filteredRooms = dealRooms.filter(r => {
    const matchesSearch = 
      r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.candidateCurrentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.leadRecruiter.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // Global KPIs
  const totalRooms = dealRooms.length;
  const liveRoomsCount = dealRooms.filter(r => r.status === 'Live / Sent' || r.status === 'In Review').length;
  const ndaSignedCount = dealRooms.filter(r => r.status === 'NDA Signed' || r.deliveryConfig?.ndaSignedAt).length;
  const offerStageCount = dealRooms.filter(r => r.status === 'Offer Stage' || r.status === 'Offer Accepted').length;

  const handleCreateRoom = (newRoom: DealRoom) => {
    setDealRooms([newRoom, ...dealRooms]);
    setSelectedDealRoomId(newRoom.id);
  };

  const handleUpdateRoom = (updated: DealRoom) => {
    setDealRooms(dealRooms.map(r => r.id === updated.id ? updated : r));
  };

  // If a room is selected, show detail view
  if (selectedRoom) {
    return (
      <DealRoomDetailView 
        dealRoom={selectedRoom}
        onBack={() => setSelectedDealRoomId(null)}
        onUpdateDealRoom={handleUpdateRoom}
      />
    );
  }

  return (
    <div className="min-h-full bg-(--bg-surface-base) pb-16">
      {/* Create Modal */}
      <CreateDealRoomModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateDealRoom={handleCreateRoom}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-(--text-strong)">
                Opportunity Rooms
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                Candidate Experience
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Centralized, branded digital opportunity rooms for executive candidates from first touch all the way to board offer closing.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowTemplatesPreview(!showTemplatesPreview)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>{showTemplatesPreview ? 'Hide Templates' : 'Browse Templates'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Opportunity Room</span>
            </button>
          </div>
        </div>

        {/* Global Executive Deal Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Total Opportunity Rooms
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  {totalRooms}
                </span>
                <span className="text-xs font-medium text-slate-400">executives</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Active / In Flight
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-blue-600">
                  {liveRoomsCount}
                </span>
                <span className="text-xs font-medium text-slate-400">dispatched</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Bilateral NDAs Signed
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-indigo-600">
                  {ndaSignedCount}
                </span>
                <span className="text-xs font-medium text-slate-400">gated vaults</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200/90 shadow-2xs flex items-center gap-4 bg-emerald-50/20">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 block uppercase tracking-wider">
                Offer Closing Stage
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-emerald-700">
                  {offerStageCount}
                </span>
                <span className="text-xs font-medium text-emerald-600/80">closing slates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Templates Explorer */}
        {showTemplatesPreview && (
          <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Pre-Packaged Branded Opportunity Room Templates
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Executive recruiters never start from scratch. Templates include pre-loaded CEO welcome videos, strategic decks, and equity calculators.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
              >
                + Create with Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dealRoomTemplates.map((tpl) => (
                <div key={tpl.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {tpl.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">{tpl.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tpl.tagline}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                    <span>{tpl.stageNames.length} Stages</span>
                    <span className="font-semibold text-purple-700">{tpl.widgetCount} Widgets</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Status Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by candidate name, target role, company, or recruiter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'draft', 'live / sent', 'nda signed', 'offer stage'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer capitalize",
                  statusFilter === status 
                    ? "bg-(--color-secondary-200) text-white shadow-2xs" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Deal Rooms List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => {
            const completedStagesCount = room.stages.filter(s => s.status === 'completed').length;
            const currentStageObj = room.stages.find(s => s.id === room.currentStageId) || room.stages[0];

            return (
              <div 
                key={room.id}
                onClick={() => setSelectedDealRoomId(room.id)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                {/* Top Card Section */}
                <div className="p-5 space-y-4">
                  {/* Status & Template header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                      room.status === 'Draft' ? "bg-amber-50 text-amber-800 border-amber-200" :
                      room.status === 'Live / Sent' ? "bg-blue-50 text-blue-800 border-blue-200" :
                      room.status === 'NDA Signed' ? "bg-purple-50 text-purple-800 border-purple-200" :
                      "bg-emerald-50 text-emerald-800 border-emerald-200"
                    )}>
                      {room.status}
                    </span>

                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                      {room.templateName.split(' ')[0]} Template
                    </span>
                  </div>

                  {/* Candidate Identity */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img 
                        src={room.candidateAvatarUrl} 
                        alt={room.candidateName}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-purple-200 transition-all" 
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">
                        ✓
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                        {room.candidateName}
                      </h3>
                      <p className="text-xs text-purple-900 font-semibold truncate mt-0.5">
                        {room.targetRole}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        Current: {room.candidateCurrentRole} · {room.candidateCurrentCompany}
                      </p>
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 truncate">
                        {currentStageObj?.name || 'Active Stage'}
                      </span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                        {completedStagesCount}/{room.stages.length} Milestones
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                      {room.stages.map((stg, i) => (
                        <div 
                          key={stg.id}
                          className={cn(
                            "h-full flex-1 border-r border-white/50 first:rounded-l-full last:rounded-r-full transition-all",
                            stg.status === 'completed' ? "bg-emerald-500" :
                            stg.id === room.currentStageId ? "bg-purple-600 animate-pulse" :
                            "bg-slate-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tagged Stakeholders mini-avatars */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-medium">{room.stakeholders.length} Tagged Sponsors:</span>
                    </div>
                    <div className="flex items-center -space-x-1.5">
                      {room.stakeholders.slice(0, 4).map((s) => (
                        <img 
                          key={s.id}
                          src={s.avatarUrl} 
                          alt={s.name}
                          title={`${s.name} (${s.stakeholderType})`}
                          className="w-5 h-5 rounded-full object-cover ring-2 ring-white"
                        />
                      ))}
                      {room.stakeholders.length > 4 && (
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                          +{room.stakeholders.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {room.deliveryConfig.viewsCount} views
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {room.attachments.length} files
                    </span>
                  </div>

                  <span className="font-bold text-(--color-secondary-200) flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter Room <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredRooms.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Handshake className="w-10 h-10 mx-auto text-purple-300" />
            <h3 className="text-sm font-bold text-slate-800">No opportunity rooms found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No executive opportunity rooms match your search. Create a new branded opportunity room for an executive candidate.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold cursor-pointer"
            >
              + Create Executive Opportunity Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
