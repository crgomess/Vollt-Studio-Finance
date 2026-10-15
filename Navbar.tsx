import React from 'react';
import { ActiveTab } from '../../types';
import { Plus, Moon, Sun, Database, Terminal, Shield, Eye, EyeOff } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickAction: () => void;
  onOpenSettings: () => void;
  onOpenSupabase: () => void;
  onOpenSecurity: () => void;
  isSecurityModeActive: boolean;
  isValuesMasked: boolean;
  onTogglePrivacyMask: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickAction,
  onOpenSettings,
  onOpenSupabase,
  onOpenSecurity,
  isSecurityModeActive,
  isValuesMasked,
  onTogglePrivacyMask,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-4 md:px-8 py-3.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Zone 1: Single Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className="text-left group flex items-center gap-2.5 focus:outline-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-bold text-base shadow-xs">
            N
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-display whitespace-nowrap">
              Nexus
            </span>
            <span className="hidden sm:inline text-xs text-neutral-400 dark:text-neutral-500 ml-2 font-normal">
              Finanças & Rotina
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: 4–5 Clean Single-Line Text Navigation Links (Desktop) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`transition-colors whitespace-nowrap py-1 ${
            activeTab === 'overview'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`transition-colors whitespace-nowrap py-1 ${
            activeTab === 'finance'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Finanças
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`transition-colors whitespace-nowrap py-1 ${
            activeTab === 'tasks'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Tarefas
        </button>
        <button
          onClick={() => setActiveTab('habits')}
          className={`transition-colors whitespace-nowrap py-1 ${
            activeTab === 'habits'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Hábitos
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`transition-colors whitespace-nowrap py-1 ${
            activeTab === 'notes'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Notas
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action + Utility Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Privacy Mask Toggle */}
        <button
          onClick={onTogglePrivacyMask}
          className={`p-2 rounded-lg transition-colors ${
            isValuesMasked
              ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title={isValuesMasked ? 'Valores ocultos (Clique para exibir)' : 'Ocultar valores na tela'}
          aria-label="Ocultar valores sensíveis"
        >
          {isValuesMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Security Vault Button */}
        <button
          onClick={onOpenSecurity}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
            isSecurityModeActive
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
          title="Modo Segurança Bancária & Limites Open Finance"
        >
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Modo Segurança</span>
        </button>

        {/* Supabase SQL trigger */}
        <button
          onClick={onOpenSupabase}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          title="Ver Script SQL e Configuração do Supabase"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Supabase SQL</span>
          <span className="sm:hidden">SQL</span>
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          aria-label="Alternar tema"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Backup & Dados"
          aria-label="Gerenciamento de Dados"
        >
          <Database className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Registro</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>
    </header>
  );
};
