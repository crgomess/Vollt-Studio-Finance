import React from 'react';
import { AppData, ActiveTab, Task, Habit, Transaction } from '../../types';
import {
  formatCurrency,
  formatDateBR,
  getTodayString,
  getTaskDueStatus,
  calculateHabitStreak,
} from '../../utils/formatters';
import { computeAccountBalances, computeCreditCardInvoice } from '../../utils/storage';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CheckCircle2,
  Circle,
  Flame,
  AlertTriangle,
  ArrowRight,
  Plus,
  CreditCard as CardIcon,
  Target,
  Sparkles,
  Repeat,
  ShieldCheck,
} from 'lucide-react';

interface OverviewDashboardProps {
  data: AppData;
  setActiveTab: (tab: ActiveTab) => void;
  onNavigateToOpenFinance?: () => void;
  onToggleTask: (id: string) => void;
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onOpenQuickAction: () => void;
  onOpenNewTransaction: () => void;
  onOpenNewTask: () => void;
  onOpenNewGoal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  data,
  setActiveTab,
  onNavigateToOpenFinance,
  onToggleTask,
  onToggleHabitDay,
  onOpenQuickAction,
  onOpenNewTransaction,
  onOpenNewTask,
  onOpenNewGoal,
}) => {
  const todayStr = getTodayString();
  const currentMonth = '2026-10';

  // Compute Balances
  const computedAccounts = computeAccountBalances(data.contas, data.transacoes);
  const totalPatrimonio = computedAccounts.reduce((sum, acc) => sum + (acc.saldoAtual || 0), 0);

  // Month transactions
  const monthTxs = data.transacoes.filter(
    (tx) => tx.data.startsWith(currentMonth) && tx.status === 'pago'
  );
  const receitasMes = monthTxs
    .filter((tx) => tx.tipo === 'receita')
    .reduce((s, tx) => s + tx.valor, 0);
  const despesasMes = monthTxs
    .filter((tx) => tx.tipo === 'despesa')
    .reduce((s, tx) => s + tx.valor, 0);
  const balancoMes = receitasMes - despesasMes;

  // Urgent or Pending Tasks
  const pendingTasks = data.tarefas.filter((t) => !t.concluida);
  const urgentTasks = pendingTasks
    .sort((a, b) => {
      const pMap = { Alta: 3, Media: 2, Baixa: 1 };
      if (a.vencimento && b.vencimento) {
        return a.vencimento.localeCompare(b.vencimento);
      }
      return pMap[b.prioridade] - pMap[a.prioridade];
    })
    .slice(0, 4);

  // Habits for today
  const habitsTodayCount = data.habitos.filter((h) => h.historicoDias.includes(todayStr)).length;

  const maskValue = (val: number) => {
    return data.seguranca?.ocultarValores ? 'R$ ••••••' : formatCurrency(val);
  };

  const activeAutomationsCount = data.regrasAutomacao?.filter((r) => r.ativa).length || 0;
  const activeConsentsCount = data.consents?.filter((c) => c.status === 'ativo').length || 0;

  return (
    <div className="space-y-6">
      {/* Header & Date Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Painel Geral
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
            Controle & Rotina Diária
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            14 de Outubro de 2026 · Tudo sob controle hoje
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo Registro
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => setActiveTab('finance')}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Patrimônio Total</span>
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
            {maskValue(totalPatrimonio)}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            {computedAccounts.length} contas bancárias
          </p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => setActiveTab('finance')}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Receitas (Outubro)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            +{maskValue(receitasMes)}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Entradas realizadas</p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => setActiveTab('finance')}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Despesas (Outubro)</span>
            <TrendingDown className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            -{maskValue(despesasMes)}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Gastos no mês</p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => setActiveTab('finance')}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Balanço Líquido</span>
            <PiggyBank className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <p
            className={`text-xl font-bold font-mono tabular-nums ${
              balancoMes >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {balancoMes >= 0 ? '+' : ''}
            {maskValue(balancoMes)}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Resultado financeiro</p>
        </div>
      </div>

      {/* Open Finance & Automated Transfer Bar */}
      <div
        onClick={onNavigateToOpenFinance || (() => setActiveTab('finance'))}
        className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-emerald-300 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Repeat className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Open Finance & Transferências Automatizadas
              </h4>
              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono">
                {activeAutomationsCount} ativas
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {activeConsentsCount} bancos conectados via Bacen · Portabilidade e varredura inteligente de saldo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
          <span>Configurar automações</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMN 1: Rotina & Tarefas do Dia */}
        <div className="space-y-6">
          {/* Card: Hábitos de Hoje */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                  Hábitos Diários de Hoje
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {habitsTodayCount} de {data.habitos.length} hábitos completados
                </p>
              </div>
              <button
                onClick={() => setActiveTab('habits')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {data.habitos.map((habit) => {
                const isDoneToday = habit.historicoDias.includes(todayStr);
                const { current } = calculateHabitStreak(habit.historicoDias);

                return (
                  <div
                    key={habit.id}
                    onClick={() => onToggleHabitDay(habit.id, todayStr)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isDoneToday
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/60'
                        : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                          isDoneToday
                            ? 'text-white shadow-xs'
                            : 'border border-neutral-300 dark:border-neutral-600 text-transparent'
                        }`}
                        style={{ backgroundColor: isDoneToday ? habit.cor : 'transparent' }}
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            isDoneToday
                              ? 'text-neutral-900 dark:text-neutral-100'
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {habit.nome}
                        </p>
                        <span className="text-[11px] text-neutral-400">
                          {habit.categoria}
                          {habit.metaDiaria && ` · ${habit.metaDiaria}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono tabular-nums text-amber-600 dark:text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{current} dias</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Tarefas Prioritárias */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                  Tarefas Prioritárias
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Pendências com prazos próximos e alta relevância
                </p>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
              >
                Gerenciar tarefas <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {urgentTasks.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">
                Todas as tarefas prioritárias estão em dia!
              </p>
            ) : (
              <div className="space-y-2.5">
                {urgentTasks.map((task) => {
                  const due = getTaskDueStatus(task.vencimento);

                  return (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 rounded-lg group hover:border-neutral-300 transition-all"
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 text-neutral-400 hover:text-emerald-600 transition-colors"
                        >
                          <Circle className="w-4 h-4" />
                        </button>
                        <div>
                          <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                            {task.titulo}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                            <span>{task.categoria}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={
                                task.prioridade === 'Alta'
                                  ? 'text-rose-600 font-medium'
                                  : 'text-amber-600'
                              }
                            >
                              {task.prioridade}
                            </span>
                          </div>
                        </div>
                      </div>

                      {task.vencimento && (
                        <span
                          className={`text-[11px] font-mono tabular-nums shrink-0 ${
                            due.isOverdue
                              ? 'text-rose-600 font-semibold'
                              : due.isDueToday
                              ? 'text-amber-600 font-semibold'
                              : 'text-neutral-400'
                          }`}
                        >
                          {formatDateBR(task.vencimento)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: Metas Financeiras & Cartões */}
        <div className="space-y-6">
          {/* Card: Metas & Caixinhas */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                  Metas Financeiras (Caixinhas)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Progresso dos seus objetivos de curto e longo prazo
                </p>
              </div>
              <button
                onClick={() => setActiveTab('finance')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
              >
                Ver metas <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {data.metas.slice(0, 3).map((goal) => {
                const pct = Math.min(100, Math.round((goal.valorAtual / (goal.valorAlvo || 1)) * 100));

                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">
                        {goal.titulo}
                      </span>
                      <span className="font-mono tabular-nums text-neutral-500 text-[11px]">
                        {maskValue(goal.valorAtual)} / {maskValue(goal.valorAlvo)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: goal.cor }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>{pct}% concluído</span>
                      {goal.dataLimite && <span>Meta: {formatDateBR(goal.dataLimite)}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Faturas de Cartão de Crédito */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                  Faturas de Cartões de Crédito
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Acompanhamento de gastos e vencimentos
                </p>
              </div>
              <button
                onClick={() => setActiveTab('finance')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
              >
                Gerenciar cartões <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.cartoes.map((card) => {
                const fatura = computeCreditCardInvoice(card.id, data.transacoes);
                const pct = Math.min(100, Math.round((fatura / (card.limiteTotal || 1)) * 100));

                return (
                  <div
                    key={card.id}
                    className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 rounded-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {card.nome}
                        </span>
                        <CardIcon className="w-4 h-4 text-neutral-400" />
                      </div>
                      <span className="text-[10px] text-neutral-400 uppercase">Fatura Atual</span>
                      <p className="text-base font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                        {maskValue(fatura)}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-[10px] text-neutral-500">
                      <span>Vencimento dia {card.diaVencimento}</span>
                      <span>{pct}% do limite</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
