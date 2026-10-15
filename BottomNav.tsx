import React from 'react';
import { ActiveTab } from '../../types';
import { LayoutDashboard, Wallet, CheckSquare, Flame, StickyNote } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Início', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'finance', label: 'Finanças', icon: <Wallet className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tarefas', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'habits', label: 'Hábitos', icon: <Flame className="w-5 h-5" /> },
    { id: 'notes', label: 'Notas', icon: <StickyNote className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-2 py-1.5 flex items-center justify-around transition-colors">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
