import React, { useState } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Crown, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { DealRoomStakeholder, StakeholderType } from '../../data/dealRoomsData';

interface AddStakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStakeholder: (stakeholder: DealRoomStakeholder) => void;
  dealRoomTitle?: string;
}

export function AddStakeholderModal({
  isOpen,
  onClose,
  onAddStakeholder,
  dealRoomTitle = 'Opportunity Room'
}: AddStakeholderModalProps) {
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [stakeholderType, setStakeholderType] = useState<StakeholderType>('Hiring Manager');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isPrimaryContact, setIsPrimaryContact] = useState(false);

  // Quick preset stakeholders for fast executive tagging
  const quickPresets = [
    {
      name: 'Dr. Julian Sterling',
      roleTitle: 'Founder & Chief Executive Officer',
      type: 'Company CEO' as StakeholderType,
      email: 'julian.sterling@phenom.com',
      phone: '+1 (415) 890-2341',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Elena Rostova',
      roleTitle: 'VP of Engineering & Hiring Sponsor',
      type: 'Hiring Manager' as StakeholderType,
      email: 'elena.rostova@phenom.com',
      phone: '+1 (415) 670-8912',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Marcus Vance',
      roleTitle: 'Lead Independent Board Director & Comp Committee Chair',
      type: 'Board Member' as StakeholderType,
      email: 'marcus.vance@sequoia-allies.com',
      phone: '+1 (212) 555-0198',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Claire Beauchamp',
      roleTitle: 'Executive Assistant to the CEO & Board Liaison',
      type: 'Executive Assistant' as StakeholderType,
      email: 'claire.beauchamp@phenom.com',
      phone: '+1 (415) 443-8901',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Sarah Chen, Esq.',
      roleTitle: 'General Counsel & Chief Legal Officer',
      type: 'General Counsel' as StakeholderType,
      email: 'sarah.chen@phenom.com',
      phone: '+1 (415) 998-3321',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80'
    }
  ];

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setName(preset.name);
    setRoleTitle(preset.roleTitle);
    setStakeholderType(preset.type);
    setEmail(preset.email);
    setPhone(preset.phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newStakeholder: DealRoomStakeholder = {
      id: `stk-${Date.now()}`,
      name: name.trim(),
      roleTitle: roleTitle.trim() || stakeholderType,
      stakeholderType,
      email: email.trim(),
      phone: phone.trim() || undefined,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
      isPrimaryContact
    };

    onAddStakeholder(newStakeholder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tag In Executive Stakeholder
              </h3>
              <p className="text-xs text-slate-500">
                Add key leadership sponsors to {dealRoomTitle} at any point.
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
          {/* Quick Presets Carousel */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-2 text-[10px]">
              Fast Tag Key Executive Sponsors
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-300 transition-all text-left flex items-center gap-2.5 cursor-pointer group"
                >
                  <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 truncate block text-[11px] group-hover:text-purple-700">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {p.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <span className="font-bold text-slate-700 uppercase tracking-wider block mb-3 text-[10px]">
              Or Custom Stakeholder Details
            </span>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Stakeholder Type *
                  </label>
                  <select
                    value={stakeholderType}
                    onChange={(e) => setStakeholderType(e.target.value as StakeholderType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Company CEO">Company CEO</option>
                    <option value="Hiring Manager">Hiring Manager</option>
                    <option value="Executive Assistant">Executive Assistant</option>
                    <option value="Board Member">Board Member</option>
                    <option value="Lead Recruiter">Lead Recruiter</option>
                    <option value="General Counsel">General Counsel</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Elena Rostova"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Title & Mandate
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. VP of Engineering & Head of Search Sponsor"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Direct Email *
                  </label>
                  <input 
                    type="email" 
                    placeholder="elena@phenom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Direct Mobile (Optional)
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+1 (415) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input 
                    type="checkbox"
                    checked={isPrimaryContact}
                    onChange={(e) => setIsPrimaryContact(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-semibold">Mark as Primary Point of Contact for candidate</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white font-bold shadow-xs hover:shadow-sm cursor-pointer"
                >
                  Tag Stakeholder into Opportunity Room
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
