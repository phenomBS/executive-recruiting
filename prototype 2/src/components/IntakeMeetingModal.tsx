import React, { useState } from 'react';
import { X, Calendar, Clock, Zap, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface IntakeMeetingModalProps {
  onClose: () => void;
}

export function IntakeMeetingModal({ onClose }: IntakeMeetingModalProps) {
  const [selected, setSelected] = useState<'schedule' | 'agent' | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-slate-50 w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white flex items-start justify-between border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Configure intake setup</h2>
            <p className="text-sm text-slate-500 mt-1">
              Chief Data Officer • San Francisco, California, United States of America | R-DEPT1-00754
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1 */}
            <div 
              onClick={() => setSelected('schedule')}
              className={cn(
                "bg-white rounded-xl border p-6 cursor-pointer transition-all",
                selected === 'schedule' ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200 hover:border-blue-300"
              )}
            >
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Schedule 1:1 Meeting</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Collaborate in real time — recorded, transcribed, and summarized
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6">
                <h4 className="text-sm font-bold text-slate-800 mb-3">Availability</h4>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Depends on participant calendar
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-800 mb-4">What to expect</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center shrink-0">1</span>
                    <span className="text-sm text-slate-600">Arrange and hold a live meeting with the hiring manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center shrink-0">2</span>
                    <span className="text-sm text-slate-600">Discuss role details (recorded & transcribed)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center shrink-0">3</span>
                    <span className="text-sm text-slate-600">Meeting assistant summarizes answers into job details</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => setSelected('agent')}
              className={cn(
                "bg-white rounded-xl border p-6 cursor-pointer transition-all",
                selected === 'agent' ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200 hover:border-blue-300"
              )}
            >
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Send Intake Agent</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Hiring manager completes intake through a guided conversation
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6">
                <h4 className="text-sm font-bold text-slate-800 mb-3">Availability</h4>
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  <Zap className="w-4 h-4" />
                  Starts instantly - no scheduling required
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-800 mb-4">What to expect</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 text-sm font-bold flex items-center justify-center shrink-0">1</span>
                    <span className="text-sm text-slate-600">Agent drafts intake questions and guardrails for you to review or edit</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 text-sm font-bold flex items-center justify-center shrink-0">2</span>
                    <span className="text-sm text-slate-600">Sends questions to the hiring manager and collects responses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 text-sm font-bold flex items-center justify-center shrink-0">3</span>
                    <span className="text-sm text-slate-600">Intake Agent summarizes answers into job details</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!selected}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white disabled:bg-slate-100 disabled:text-slate-400 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
