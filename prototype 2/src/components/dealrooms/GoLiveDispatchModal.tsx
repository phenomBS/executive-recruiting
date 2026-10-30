import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  Smartphone, 
  Linkedin, 
  ShieldCheck, 
  Key, 
  Calendar, 
  CheckCircle2, 
  Eye, 
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { DealRoom, DealRoomDeliveryChannel } from '../../data/dealRoomsData';
import { cn } from '../../lib/utils';

interface GoLiveDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealRoom: DealRoom;
  onConfirmGoLive: (selectedChannels: DealRoomDeliveryChannel[], notes: string) => void;
  onOpenPreview: () => void;
}

export function GoLiveDispatchModal({
  isOpen,
  onClose,
  dealRoom,
  onConfirmGoLive,
  onOpenPreview
}: GoLiveDispatchModalProps) {
  const [selectedChannels, setSelectedChannels] = useState<DealRoomDeliveryChannel[]>(
    dealRoom.deliveryConfig?.channels?.length ? dealRoom.deliveryConfig.channels : ['secure_email_link', 'executive_sms_direct']
  );
  const [personalizedNote, setPersonalizedNote] = useState(
    `Dear ${dealRoom.candidateName.split(' ')[0]},\n\nOur CEO, Julian Sterling, and the board search committee have authorized the release of this private executive opportunity room for your exploration of the ${dealRoom.targetRole} mandate.\n\nPlease find the encrypted link and our bilateral mutual NDA enclosed.`
  );
  const [requirePasscode, setRequirePasscode] = useState(dealRoom.deliveryConfig?.accessCodeRequired ?? true);
  const [passcode, setPasscode] = useState('772-901');

  if (!isOpen) return null;

  const toggleChannel = (ch: DealRoomDeliveryChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length === 1) return; // keep at least 1
      setSelectedChannels(selectedChannels.filter(c => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const channelOptions = [
    {
      id: 'secure_email_link' as DealRoomDeliveryChannel,
      icon: Mail,
      title: 'Secure Executive Email Dispatch',
      desc: `Dispatches authenticated magic link to ${dealRoom.candidateEmail}`,
      badge: 'Recommended'
    },
    {
      id: 'executive_sms_direct' as DealRoomDeliveryChannel,
      icon: Smartphone,
      title: 'Direct Executive SMS / WhatsApp',
      desc: 'Mobile ping with instantaneous single-sign-on biometric passkey',
      badge: 'Fast Response'
    },
    {
      id: 'linkedin_inmail_private' as DealRoomDeliveryChannel,
      icon: Linkedin,
      title: 'Private LinkedIn InMail VIP Dispatch',
      desc: 'High-priority VIP reach directly from Lead Recruiter verified profile',
      badge: 'Discreet'
    },
    {
      id: 'ea_confidential_dispatch' as DealRoomDeliveryChannel,
      icon: ShieldCheck,
      title: 'EA Confidential Protocol',
      desc: 'Transmitted directly through Executive Assistant calendar & briefing docket',
      badge: 'VIP Protocol'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmGoLive(selectedChannels, personalizedNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Go Live & Dispatch Executive Opportunity Room
              </h3>
              <p className="text-xs text-slate-500">
                Candidate: <strong className="text-slate-800">{dealRoom.candidateName}</strong> · {dealRoom.targetRole}
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Quick Preview Prompt */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-blue-900">
              <Eye className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Verify that all CEO videos, stage widgets, and equity models look flawless.</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPreview();
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Preview Room
            </button>
          </div>

          {/* Delivery Channels Specification */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-2 text-[10px]">
              Specify Multi-Channel Delivery Vectors *
            </label>
            <div className="space-y-2">
              {channelOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedChannels.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleChannel(opt.id)}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3",
                      isSelected 
                        ? "bg-purple-50/50 border-purple-300 ring-1 ring-purple-400/30" 
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        isSelected ? "bg-(--color-secondary-200) text-white" : "bg-slate-100 text-slate-600"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {opt.title}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>

                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center shrink-0",
                      isSelected ? "bg-(--color-secondary-200) border-(--color-secondary-200) text-white" : "border-slate-300 bg-white"
                    )}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Access Security Controls */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-bold">
                <input 
                  type="checkbox"
                  checked={requirePasscode}
                  onChange={(e) => setRequirePasscode(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  Enforce Confidential 6-Digit Passcode Gate
                </span>
              </label>
              {requirePasscode && (
                <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-slate-300">
                  {passcode}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Protects board-level financials from accidental forwardings. Passcode will be delivered via candidate's mobile.
            </p>
          </div>

          {/* Personalized Message Preview */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1 text-[10px]">
              Personalized Dispatch Note
            </label>
            <textarea
              rows={4}
              value={personalizedNote}
              onChange={(e) => setPersonalizedNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-sans leading-relaxed focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Dispatch Opportunity Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
