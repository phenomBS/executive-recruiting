import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Quote, 
  RotateCcw
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface CeoWelcomeVideoWidgetProps {
  candidateName: string;
  ceoName?: string;
  ceoTitle?: string;
  ceoAvatar?: string;
  videoDuration?: string;
  isRecruiterPreview?: boolean;
}

export function CeoWelcomeVideoWidget({
  candidateName,
  ceoName = 'Dr. Julian Sterling',
  ceoTitle = 'Founder & Chief Executive Officer',
  ceoAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
  videoDuration = '3:45',
  isRecruiterPreview = false
}: CeoWelcomeVideoWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoProgress, setVideoProgress] = useState(38); // 38% watched initially

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img 
              src={ceoAvatar} 
              alt={ceoName}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-xs" 
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Personal Welcome & Strategic Mandate
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800">
                Direct from CEO
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {ceoName} ({ceoTitle}) addressing {candidateName} regarding the upcoming chapter.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Recorded Exclusively for {candidateName}</span>
        </div>
      </div>

      {/* Main Video Presentation Section */}
      <div className="p-6">
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-h-[380px] shadow-lg flex items-center justify-center group">
          {/* Background Poster Mock */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity scale-105 group-hover:scale-100 transition-transform duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Central Overlay Info */}
          <div className="relative z-10 text-center px-6 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Confidential Executive Briefing · {videoDuration}
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
              "Why this specific inflection point matters for our next 5 years."
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 drop-shadow">
              A private discussion on our AI platform roadmap, capital allocation, and empowering our new executive hire.
            </p>

            {/* Play Button */}
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-white text-slate-950 hover:bg-slate-100 flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-1" />}
              </button>
            </div>
          </div>

          {/* Video Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-20 flex flex-col gap-2">
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={togglePlay} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsMuted(!isMuted)} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-[11px]">1:24 / {videoDuration}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1.5",
                    showTranscript 
                      ? "bg-white text-slate-950 border-white" 
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Transcript</span>
                </button>
                <button type="button" className="hover:text-white transition-colors cursor-pointer">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CEO Quote Callout */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-3.5">
          <Quote className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Note from {ceoName}:</span>
            "{candidateName}, when the board and I outlined this mandate, we were not looking for an operator to merely sustain our current momentum. We need a transformative partner with the institutional caliber to double our velocity over the next 36 months. I am eager to welcome you to our table."
          </div>
        </div>

        {/* Collapsible Transcript */}
        {showTranscript && (
          <div className="mt-4 p-5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed space-y-3 border border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold uppercase tracking-wider text-[10px]">Verified Confidential Transcript</span>
              <span className="text-[10px]">Duration: 3m 45s</span>
            </div>
            <p>
              <span className="text-blue-400 font-semibold">[00:00]</span> "Hello {candidateName}. If you are watching this, our executive search committee and I have aligned that your track record makes you our unanimous top priority for this position."
            </p>
            <p>
              <span className="text-blue-400 font-semibold">[01:12]</span> "We are operating at an unprecedented inflection point. Over the next 18 months, our platform is scaling into a multi-billion dollar enterprise tier, and the leadership vacuum this role fills is critical to our IPO trajectory."
            </p>
            <p>
              <span className="text-blue-400 font-semibold">[02:30]</span> "I encourage you to explore the compensation modeler and strategic briefs in this room. My executive assistant and I are on standby whenever you are ready for our private dinner."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
