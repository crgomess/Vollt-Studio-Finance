import React from 'react';
import { Modal } from './Modal';
import { ArrowDownRight, CheckSquare, Flame, Target, StickyNote } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'transaction' | 'task' | 'habit' | 'goal' | 'note') => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const options = [
    {
      id: 'transaction' as const,
      title: 'Transação Financeira',
      description: 'Lançar uma nova receita, despesa ou transferência entre contas.',
      icon: <ArrowDownRight className="w-5 h-5 text-emerald-600" />,
      color: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20',
    },
    {
      id: 'task' as const,
      title: 'Nova Tarefa',
      description: 'Adicionar uma pendência com data limite e nível de prioridade.',
      icon: <CheckSquare className="w-5 h-5 text-sky-600" />,
      color: 'hover:bg-sky-50/50 dark:hover:bg-sky-950/20',
    },
    {
      id: 'habit' as const,
      title: 'Novo Hábito',
      description: 'Cadastrar uma rotina ou hábito diário para rastreamento.',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      color: 'hover:bg-amber-50/50 dark:hover:bg-amber-950/20',
    },
    {
      id: 'goal' as const,
      title: 'Meta Financeira / Caixinha',
      description: 'Definir um objetivo de poupança com barra de progresso.',
      icon: <Target className="w-5 h-5 text-purple-600" />,
      color: 'hover:bg-purple-50/50 dark:hover:bg-purple-950/20',
    },
    {
      id: 'note' as const,
      title: 'Anotação ou Compromisso',
      description: 'Escrever uma nota rápida, ata de reunião ou compromisso na agenda.',
      icon: <StickyNote className="w-5 h-5 text-rose-600" />,
      color: 'hover:bg-rose-50/50 dark:hover:bg-rose-950/20',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="O que você deseja registrar?"
      description="Escolha uma das ações rápidas para adicionar ao seu sistema."
      maxWidth="md"
    >
      <div className="space-y-2.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              onSelectAction(opt.id);
              onClose();
            }}
            className={`w-full flex items-start gap-3.5 p-3.5 text-left border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all ${opt.color} group`}
          >
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 group-hover:scale-105 transition-transform">
              {opt.icon}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                {opt.title}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {opt.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};
