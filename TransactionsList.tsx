import React, { useState } from 'react';
import { Transaction, Account, CreditCard, TransactionType } from '../../types';
import { formatCurrency, formatDateBR, CATEGORY_COLORS } from '../../utils/formatters';
import { Search, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, Edit3, Trash2, Download, Plus } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  accounts: Account[];
  cards: CreditCard[];
  onOpenNewTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  accounts,
  cards,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  // Unique categories in transactions
  const categories = Array.from(new Set(transactions.map((t) => t.categoria))).sort();

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDesc = tx.descricao.toLowerCase().includes(q);
      const matchCat = tx.categoria.toLowerCase().includes(q);
      const matchTags = tx.tags && tx.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchDesc && !matchCat && !matchTags) return false;
    }

    // Type
    if (filterType !== 'all') {
      if (filterType === 'receita' && tx.tipo !== 'receita') return false;
      if (filterType === 'despesa' && tx.tipo !== 'despesa') return false;
      if (filterType === 'despesa_fixa' && (tx.tipo !== 'despesa' || tx.subtipo !== 'fixa')) return false;
      if (filterType === 'despesa_variavel' && (tx.tipo !== 'despesa' || tx.subtipo !== 'variavel')) return false;
      if (filterType === 'transferencia' && tx.tipo !== 'transferencia') return false;
    }

    // Category
    if (filterCategory !== 'all' && tx.categoria !== filterCategory) {
      return false;
    }

    // Account or Card
    if (filterAccount !== 'all') {
      if (tx.contaId !== filterAccount && tx.cartaoId !== filterAccount && tx.contaDestinoId !== filterAccount) {
        return false;
      }
    }

    return true;
  });

  // Sort by date descending
  const sorted = [...filtered].sort((a, b) => b.data.localeCompare(a.data));

  const exportCSV = () => {
    const headers = ['Data', 'Tipo', 'Subtipo', 'Descricao', 'Categoria', 'Valor', 'Conta', 'Status', 'Tags'];
    const rows = sorted.map((tx) => {
      const acc = accounts.find((a) => a.id === tx.contaId);
      return [
        tx.data,
        tx.tipo,
        tx.subtipo || '',
        `"${tx.descricao.replace(/"/g, '""')}"`,
        `"${tx.categoria}"`,
        tx.valor.toFixed(2),
        `"${acc?.nome || ''}"`,
        tx.status,
        `"${(tx.tags || []).join(', ')}"`,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transacoes_nexus_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por descrição, categoria ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="all">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Todas Despesas</option>
            <option value="despesa_fixa">Despesas Fixas</option>
            <option value="despesa_variavel">Despesas Variáveis</option>
            <option value="transferencia">Transferências</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={exportCSV}
            title="Exportar para CSV"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            Nenhuma transação encontrada para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Conta / Cartão</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {sorted.map((tx) => {
                  const isReceita = tx.tipo === 'receita';
                  const isTransf = tx.tipo === 'transferencia';
                  const isDespesa = tx.tipo === 'despesa';

                  const account = accounts.find((a) => a.id === tx.contaId);
                  const destAccount = accounts.find((a) => a.id === tx.contaDestinoId);
                  const card = cards.find((c) => c.id === tx.cartaoId);
                  const catColor = CATEGORY_COLORS[tx.categoria] || '#71717A';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-500 font-mono text-[11px]">
                        {formatDateBR(tx.data)}
                      </td>

                      {/* Description & Tags */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                              isReceita
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                                : isTransf
                                ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400'
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                            }`}
                          >
                            {isReceita ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : isTransf ? (
                              <RefreshCw className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            )}
                          </span>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">
                              {tx.descricao}
                            </p>
                            {tx.tags && tx.tags.length > 0 && (
                              <p className="text-[11px] text-neutral-400 mt-0.5">
                                {tx.tags.map((t) => `#${t}`).join(' · ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: catColor }}
                          />
                          <span>{tx.categoria}</span>
                          {tx.subtipo && (
                            <span className="text-[10px] text-neutral-400">
                              ({tx.subtipo})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Account / Card */}
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-500">
                        {card ? (
                          <span>Cartão {card.nome} (•••• {card.ultimosDigitos})</span>
                        ) : isTransf && destAccount ? (
                          <span>
                            {account?.nome || 'Conta'} → {destAccount.nome}
                          </span>
                        ) : (
                          <span>{account?.nome || 'Conta'}</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-mono tabular-nums font-semibold ${
                            isReceita
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isTransf
                              ? 'text-sky-600 dark:text-sky-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isReceita ? '+' : isDespesa ? '-' : ''}
                          {formatCurrency(tx.valor)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTransaction(tx.id)}
                            className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
