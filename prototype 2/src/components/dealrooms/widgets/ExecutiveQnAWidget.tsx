import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Lock, 
  Clock, 
  User, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ExecutiveQnAWidgetProps {
  candidateName: string;
  recruiterName?: string;
  isRecruiterPreview?: boolean;
}

interface MessageItem {
  id: string;
  sender: 'candidate' | 'recruiter' | 'ceo';
  senderName: string;
  senderRole: string;
  avatar: string;
  timestamp: string;
  content: string;
}

export function ExecutiveQnAWidget({
  candidateName,
  recruiterName = 'Brian Stepan',
  isRecruiterPreview = false
}: ExecutiveQnAWidgetProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm1',
      sender: 'candidate',
      senderName: candidateName,
      senderRole: 'Candidate',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
      timestamp: 'Yesterday at 3:15 PM',
      content: 'Could you clarify the vesting acceleration trigger if there is a change of control prior to our target IPO window?'
    },
    {
      id: 'm2',
      sender: 'recruiter',
      senderName: recruiterName,
      senderRole: 'Lead In-House Recruiter',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
      timestamp: 'Yesterday at 4:02 PM',
      content: 'Yes! Our board package features standard double-trigger acceleration: 100% immediate vesting of all unvested options and RSUs upon acquisition if involuntary termination or material diminution of duties occurs.'
    },
    {
      id: 'm3',
      sender: 'ceo',
      senderName: 'Dr. Julian Sterling',
      senderRole: 'Chief Executive Officer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
      timestamp: 'Today at 8:40 AM',
      content: 'Looking forward to our dinner on Thursday to discuss our international data sovereignty strategy in person.'
    }
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      sender: isRecruiterPreview ? 'candidate' : 'recruiter',
      senderName: isRecruiterPreview ? candidateName : recruiterName,
      senderRole: isRecruiterPreview ? 'Candidate' : 'Lead Recruiter',
      avatar: isRecruiterPreview 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
      timestamp: 'Just now',
      content: inputVal.trim()
    };

    setMessages([...messages, newMsg]);
    setInputVal('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Confidential Executive Inquiry Back-Channel
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800">
                End-to-End Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct private channel between {candidateName}, the CEO, and executive search leadership.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero External Logging</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto bg-slate-50/30">
        {messages.map((m) => {
          const isCandidate = m.sender === 'candidate';
          return (
            <div 
              key={m.id}
              className={cn(
                "flex items-start gap-3",
                isCandidate ? "flex-row-reverse" : "flex-row"
              )}
            >
              <img 
                src={m.avatar} 
                alt={m.senderName} 
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-200 shrink-0" 
              />
              <div className={cn(
                "max-w-md p-4 rounded-2xl text-xs space-y-1 shadow-2xs",
                isCandidate 
                  ? "bg-(--color-secondary-200) text-white rounded-tr-none" 
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
              )}>
                <div className="flex items-center justify-between gap-3 text-[10px] font-semibold opacity-80 mb-1">
                  <span>{m.senderName} ({m.senderRole})</span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="leading-relaxed">{m.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Input Box */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder={`Send confidential message as ${isRecruiterPreview ? candidateName : recruiterName}...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-(--color-secondary-200) hover:bg-(--bg-brand-secondary-hover) text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
