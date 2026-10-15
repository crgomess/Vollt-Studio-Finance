import React, { useState } from 'react';
import { FinancialGoal } from '../../types';
import { formatCurrency, formatDateBR } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Target, Plus, TrendingUp, ArrowDownRight, Edit3, Trash2, Shield, Plane, Car, Home, Sparkles } from 'lucide-react';

interface FinancialGoalsProps {
  goals: FinancialGoal[];
  onSaveGoal: (goal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoalBalance: (id: string, newBalance: number) => void;
}

export const FinancialGoals: React.FC<FinancialGoalsProps> = ({
  goals,
  onSaveGoal,
  onDeleteGoal,
  onUpdateGoalBalance,
}) => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Reserva');
  const [valorAlvo, setValorAlvo] = useState('5000');
  const [valorAtual, setValorAtual] = useState('1000');
  const [dataLimite, setDataLimite] = useState('');
  const [cor, setCor] = useState('#10B981');
  const [icone, setIcone] = useState('shield');
  const [notas, setNotas] = useState('');

  // Deposit/Withdraw modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionGoal, setActionGoal] = useState<FinancialGoal | null>(null);
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [actionAmount, setActionAmount] = useState('');

  const openNewGoal = () => {
    setEditingGoal(null);
    setTitulo('');
    setCategoria('Reserva');
    setValorAlvo('10000');
    setValorAtual('0');
    setDataLimite('');
    setCor('#10B981');
    setIcone('shield');
    setNotas('');
    setIsGoalModalOpen(true);
  };

  const openEditGoal = (g: FinancialGoal) => {
    setEditingGoal(g);
    setTitulo(g.titulo);
    setCategoria(g.categoria);
    setValorAlvo(g.valorAlvo.toString());
    setValorAtual(g.valorAtual.toString());
    setDataLimite(g.dataLimite || '');
    setCor(g.cor);
    setIcone(g.icone || 'target');
    setNotas(g.notas || '');
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const alvo = parseFloat(valorAlvo.replace(',', '.')) || 1000;
    const atual = parseFloat(valorAtual.replace(',', '.')) || 0;

    const goal: FinancialGoal = {
      id: editingGoal ? editingGoal.id : `goal-${Date.now()}`,
      titulo: titulo.trim() || 'Nova Meta',
      categoria: categoria.trim() || 'Geral',
      valorAlvo: Math.max(1, alvo),
      valorAtual: Math.max(0, atual),
      dataLimite: dataLimite || undefined,
      cor,
      icone,
      notas: notas.trim() || undefined,
    };
    onSaveGoal(goal);
    setIsGoalModalOpen(false);
  };

  const openDepositWithdraw = (goal: FinancialGoal, type: 'deposit' | 'withdraw') => {
    setActionGoal(goal);
    setActionType(type);
    setActionAmount('');
    setIsActionModalOpen(true);
  };

  const handleExecuteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionGoal) return;
    const amount = parseFloat(actionAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;

    const newBalance =
      actionType === 'deposit'
        ? actionGoal.valorAtual + amount
        : Math.max(0, actionGoal.valorAtual - amount);

    onUpdateGoalBalance(actionGoal.id, newBalance);
    setIsActionModalOpen(false);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="w-4 h-4" />;
      case 'plane':
        return <Plane className="w-4 h-4" />;
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'home':
        return <Home className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
            Metas Financeiras & Caixinhas
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Defina objetivos com acompanhamento visual do progresso de poupança
          </p>
        </div>
        <button
          onClick={openNewGoal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
        >
          <Plus className="w-3.5 h-3.5" /> Criar Meta
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
          Você ainda não tem metas cadastradas. Crie sua primeira caixinha de objetivos financeiros!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.valorAtual / (goal.valorAlvo || 1)) * 100));
            const remaining = Math.max(0, goal.valorAlvo - goal.valorAtual);

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: goal.cor }}
                      >
                        {renderIcon(goal.icone)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                          {goal.titulo}
                        </h4>
                        <span className="text-[11px] text-neutral-500">
                          {goal.categoria}
                          {goal.dataLimite && ` · Até ${formatDateBR(goal.dataLimite)}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditGoal(goal)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                        title="Editar meta"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                        title="Excluir meta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {goal.notas && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-2">
                      {goal.notas}
                    </p>
                  )}

                  {/* Progress Bar & Amount */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono tabular-nums text-neutral-900 dark:text-neutral-100 font-bold">
                        {formatCurrency(goal.valorAtual)}
                      </span>
                      <span className="font-mono tabular-nums text-neutral-500 text-[11px]">
                        Meta: {formatCurrency(goal.valorAlvo)}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 100 ? '#10B981' : goal.cor,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>{pct}% concluído</span>
                      <span>Faltam {formatCurrency(remaining)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions: Aportar / Resgatar */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openDepositWithdraw(goal, 'deposit')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> Aportar
                  </button>
                  <button
                    onClick={() => openDepositWithdraw(goal, 'withdraw')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" /> Resgatar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Criar / Editar Meta */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title={editingGoal ? 'Editar Meta' : 'Nova Meta Financeira'}
        description="Defina uma meta com valor alvo e prazo estimado."
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Título da Meta *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Viagem de Férias, Reserva de Emergência..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Categoria
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ex: Viagem, Segurança, Carro..."
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Data Limite (Opcional)
              </label>
              <input
                type="date"
                value={dataLimite}
                onChange={(e) => setDataLimite(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Valor Alvo (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={valorAlvo}
                onChange={(e) => setValorAlvo(e.target.value)}
                placeholder="5000"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Valor Atual Acumulado (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={valorAtual}
                onChange={(e) => setValorAtual(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Ícone
              </label>
              <select
                value={icone}
                onChange={(e) => setIcone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="shield">Segurança (Escudo)</option>
                <option value="plane">Viagem (Avião)</option>
                <option value="car">Veículo (Carro)</option>
                <option value="home">Imóvel (Casa)</option>
                <option value="target">Geral (Alvo)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Cor
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-neutral-300 dark:border-neutral-700 p-0.5 bg-transparent"
                />
                <span className="text-xs text-neutral-500 font-mono">{cor}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Notas & Estratégia
            </label>
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Onde o dinheiro será guardado ou investido..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsGoalModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              {editingGoal ? 'Salvar Alterações' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Aporte ou Resgate Rápido */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={actionType === 'deposit' ? 'Aportar na Meta' : 'Resgatar da Meta'}
        description={`Meta selecionada: ${actionGoal?.titulo}`}
        maxWidth="sm"
      >
        <form onSubmit={handleExecuteAction} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Valor da Operação (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              autoFocus
              value={actionAmount}
              onChange={(e) => setActionAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-3 py-2 text-base bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            {actionGoal && (
              <p className="text-xs text-neutral-500 mt-1.5">
                Saldo atual da meta:{' '}
                <span className="font-mono tabular-nums font-semibold">
                  {formatCurrency(actionGoal.valorAtual)}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsActionModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors ${
                actionType === 'deposit'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {actionType === 'deposit' ? 'Confirmar Aporte' : 'Confirmar Resgate'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
