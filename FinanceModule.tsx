import React, { useState } from 'react';
import {
  Transaction,
  Account,
  CreditCard,
  FinancialGoal,
  OpenFinanceConsent,
  PortabilityRequest,
  AutomatedTransferRule,
  SecurityConfig,
} from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { FinanceCharts } from './FinanceCharts';
import { TransactionsList } from './TransactionsList';
import { AccountsCardsManager } from './AccountsCardsManager';
import { FinancialGoals } from './FinancialGoals';
import { OpenFinanceModule } from './OpenFinanceModule';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Calendar, Repeat, ShieldCheck } from 'lucide-react';

interface FinanceModuleProps {
  transactions: Transaction[];
  accounts: Account[];
  cards: CreditCard[];
  goals: FinancialGoal[];
  consents: OpenFinanceConsent[];
  portabilidades: PortabilityRequest[];
  regras: AutomatedTransferRule[];
  securityConfig: SecurityConfig;
  initialSubTab?: 'charts' | 'transactions' | 'accounts' | 'goals' | 'openfinance';
  onOpenNewTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onSaveAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
  onSaveCard: (card: CreditCard) => void;
  onDeleteCard: (id: string) => void;
  onSaveGoal: (goal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoalBalance: (id: string, newBalance: number) => void;
  onSaveRule: (rule: AutomatedTransferRule) => void;
  onDeleteRule: (id: string) => void;
  onToggleRule: (id: string) => void;
  onExecuteRuleNow: (rule: AutomatedTransferRule) => void;
  onSavePortability: (request: PortabilityRequest) => void;
  onDeletePortability: (id: string) => void;
  onConnectBankConsent: (consent: OpenFinanceConsent) => void;
  onRevokeConsent: (id: string) => void;
  onOpenSecurityModal: () => void;
  onTogglePrivacyMask: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  transactions,
  accounts,
  cards,
  goals,
  consents,
  portabilidades,
  regras,
  securityConfig,
  initialSubTab,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onSaveAccount,
  onDeleteAccount,
  onSaveCard,
  onDeleteCard,
  onSaveGoal,
  onDeleteGoal,
  onUpdateGoalBalance,
  onSaveRule,
  onDeleteRule,
  onToggleRule,
  onExecuteRuleNow,
  onSavePortability,
  onDeletePortability,
  onConnectBankConsent,
  onRevokeConsent,
  onOpenSecurityModal,
  onTogglePrivacyMask,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'charts' | 'transactions' | 'accounts' | 'goals' | 'openfinance'
  >(initialSubTab || 'charts');

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  // Compute month metrics
  const monthTransactions = transactions.filter(
    (tx) => tx.data.startsWith(selectedMonth) && tx.status === 'pago'
  );

  const totalReceitas = monthTransactions
    .filter((tx) => tx.tipo === 'receita')
    .reduce((sum, tx) => sum + tx.valor, 0);

  const totalDespesas = monthTransactions
    .filter((tx) => tx.tipo === 'despesa')
    .reduce((sum, tx) => sum + tx.valor, 0);

  const balancoMes = totalReceitas - totalDespesas;

  // Total balance across all accounts
  const totalPatrimonio = accounts.reduce((sum, acc) => {
    let saldo = acc.saldoInicial;
    for (const tx of transactions) {
      if (tx.status !== 'pago') continue;
      if (tx.tipo === 'receita' && tx.contaId === acc.id) saldo += tx.valor;
      if (tx.tipo === 'despesa' && tx.contaId === acc.id) saldo -= tx.valor;
      if (tx.tipo === 'transferencia') {
        if (tx.contaId === acc.id) saldo -= tx.valor;
        if (tx.contaDestinoId === acc.id) saldo += tx.valor;
      }
    }
    return sum + saldo;
  }, 0);

  const maskValue = (val: number) => {
    return securityConfig.ocultarValores ? 'R$ ••••••' : formatCurrency(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Month Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
            Controle Financeiro & Open Finance
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Gestão patrimonial, fluxo de caixa, portabilidade bancária e transferências automatizadas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-medium text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
            >
              <option value="2026-10">Outubro / 2026</option>
              <option value="2026-09">Setembro / 2026</option>
              <option value="2026-08">Agosto / 2026</option>
              <option value="2026-07">Julho / 2026</option>
            </select>
          </div>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Nova Transação
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Saldo Geral Total */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Patrimônio em Contas</span>
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
            {maskValue(totalPatrimonio)}
          </p>
          <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
            <span>{accounts.length} contas cadastradas</span>
          </div>
        </div>

        {/* Card 2: Entradas do Mês */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Receitas no Mês</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            +{maskValue(totalReceitas)}
          </p>
          <div className="text-[11px] text-neutral-400 mt-1">
            <span>Entradas confirmadas</span>
          </div>
        </div>

        {/* Card 3: Saídas do Mês */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Despesas no Mês</span>
            <TrendingDown className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            -{maskValue(totalDespesas)}
          </p>
          <div className="text-[11px] text-neutral-400 mt-1">
            <span>Gastos fixos e variáveis</span>
          </div>
        </div>

        {/* Card 4: Balanço Líquido */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Balanço do Mês</span>
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
          <div className="text-[11px] text-neutral-400 mt-1">
            <span>{balancoMes >= 0 ? 'Superávit no período' : 'Déficit no período'}</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl max-w-fit overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('charts')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'charts'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Indicadores & Gráficos
        </button>
        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'transactions'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Transações ({transactions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('accounts')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'accounts'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Contas & Cartões
        </button>
        <button
          onClick={() => setActiveSubTab('goals')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'goals'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Metas & Caixinhas ({goals.length})
        </button>
        <button
          onClick={() => setActiveSubTab('openfinance')}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'openfinance'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Open Finance & Automações</span>
          <span className="text-[10px] bg-white/20 dark:bg-neutral-950/40 px-1 rounded-sm ml-0.5">
            {regras.length}
          </span>
        </button>
      </div>

      {/* Render Subtab Content */}
      {activeSubTab === 'charts' && (
        <div className="space-y-6">
          <FinanceCharts transactions={transactions} currentMonth={selectedMonth} />
          {/* Quick Recent Transactions snippet */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                Últimas Movimentações em {selectedMonth === '2026-10' ? 'Outubro' : selectedMonth}
              </h3>
              <button
                onClick={() => setActiveSubTab('transactions')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Ver todas ({transactions.length}) →
              </button>
            </div>
            <TransactionsList
              transactions={monthTransactions.slice(0, 5)}
              accounts={accounts}
              cards={cards}
              onOpenNewTransaction={onOpenNewTransaction}
              onEditTransaction={onEditTransaction}
              onDeleteTransaction={onDeleteTransaction}
            />
          </div>
        </div>
      )}

      {activeSubTab === 'transactions' && (
        <TransactionsList
          transactions={transactions}
          accounts={accounts}
          cards={cards}
          onOpenNewTransaction={onOpenNewTransaction}
          onEditTransaction={onEditTransaction}
          onDeleteTransaction={onDeleteTransaction}
        />
      )}

      {activeSubTab === 'accounts' && (
        <AccountsCardsManager
          accounts={accounts}
          cards={cards}
          transactions={transactions}
          onSaveAccount={onSaveAccount}
          onDeleteAccount={onDeleteAccount}
          onSaveCard={onSaveCard}
          onDeleteCard={onDeleteCard}
        />
      )}

      {activeSubTab === 'goals' && (
        <FinancialGoals
          goals={goals}
          onSaveGoal={onSaveGoal}
          onDeleteGoal={onDeleteGoal}
          onUpdateGoalBalance={onUpdateGoalBalance}
        />
      )}

      {activeSubTab === 'openfinance' && (
        <OpenFinanceModule
          consents={consents}
          portabilidades={portabilidades}
          regras={regras}
          accounts={accounts}
          securityConfig={securityConfig}
          onSaveRule={onSaveRule}
          onDeleteRule={onDeleteRule}
          onToggleRule={onToggleRule}
          onExecuteRuleNow={onExecuteRuleNow}
          onSavePortability={onSavePortability}
          onDeletePortability={onDeletePortability}
          onConnectBankConsent={onConnectBankConsent}
          onRevokeConsent={onRevokeConsent}
          onOpenSecurityModal={onOpenSecurityModal}
          onTogglePrivacyMask={onTogglePrivacyMask}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
