import React from 'react';
import { 
  LayoutDashboard,
  Building2,
  Search,
  User,
  Briefcase,
  FolderKanban,
  Bot,
  List, 
  Megaphone, 
  MessageSquare, 
  Calendar, 
  Users, 
  Network, 
  ShieldCheck, 
  FileText, 
  CheckSquare, 
  Handshake, 
  Target,
  Layers,
} from 'lucide-react';
import { cn } from '../lib/utils';

export type View = 'home' | 'candidates' | 'jobs' | 'projects' | 'companies' | 'agents' | 'roles' | 'dealrooms';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const mainIcons = [
    { icon: LayoutDashboard, id: 'home', label: 'Workspace' },
    { icon: FolderKanban, id: 'projects', label: 'Projects' },
    { icon: User, id: 'candidates', label: 'Candidates' },
    { icon: Building2, id: 'companies', label: 'Companies' },
    { icon: Layers, id: 'roles', label: 'Roles' },
    { icon: Briefcase, id: 'jobs', label: 'Jobs' },
    { icon: Handshake, id: 'dealrooms', label: 'Opportunity Rooms' },
    { icon: Bot, id: 'agents', label: 'Agents' },
  ];

  const otherIcons = [
    { icon: List, id: 'lists' },
    { icon: Megaphone, id: 'campaigns' },
    { icon: MessageSquare, id: 'messages' },
    { icon: Calendar, id: 'calendar' },
    { icon: Users, id: 'people' },
    { icon: Network, id: 'org' },
    { icon: ShieldCheck, id: 'shield' },
    { icon: FileText, id: 'docs' },
    { icon: CheckSquare, id: 'tasks' },
    { icon: Target, id: 'goals' },
  ];

  return (
    <aside className="w-(--shell-rail-width) bg-(--components-sidebar-navigation-bg-default) border-r border-(--components-sidebar-navigation-border-default) flex flex-col items-center py-4 gap-4 h-full z-10 flex-shrink-0 overflow-y-auto">
      <div className="w-9 h-9 mb-4 flex items-center justify-center text-(--icon-strong)">
        <svg width="36" height="36" viewBox="0 0 100 100" className="shrink-0">
          <g transform="translate(0, -2)" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
            <circle cx="55" cy="42" r="14" />
            <line x1="41" y1="28" x2="41" y2="65" />
            <path d="M32,82 Q50,92 68,82" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col gap-2 w-full items-center">
        {mainIcons.map(({ icon: Icon, id, label }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id as View)}
              title={label}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative group",
                active
                  ? "bg-(--components-sidebar-navigation-menu-item-bg-active) text-(--components-sidebar-navigation-menu-item-icon-active)"
                  : "text-(--components-sidebar-navigation-menu-item-icon-default) hover:bg-(--components-sidebar-navigation-menu-item-bg-hover) hover:text-(--components-sidebar-navigation-menu-item-icon-active)"
              )}
            >
              <Icon className="w-5 h-5 stroke-[1.5]" />
            </button>
          );
        })}
      </div>

      <div className="w-8 h-px bg-slate-200 my-2" />

      <div className="flex flex-col gap-2 w-full items-center">
        {otherIcons.map(({ icon: Icon, id }) => (
          <button
            key={id}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative group text-(--components-sidebar-navigation-menu-item-icon-default) hover:bg-(--components-sidebar-navigation-menu-item-bg-hover) hover:text-(--components-sidebar-navigation-menu-item-icon-active)"
          >
            <Icon className="w-5 h-5 stroke-[1.5]" />
          </button>
        ))}
      </div>
    </aside>
  );
}
