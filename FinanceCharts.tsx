import React, { useState } from 'react';
import { Transaction } from '../../types';
import { formatCurrency, CATEGORY_COLORS } from '../../utils/formatters';

interface FinanceChartsProps {
  transactions: Transaction[];
  currentMonth: string; // YYYY-MM
}

export const FinanceCharts: React.FC<FinanceChartsProps> = ({ transactions, currentMonth }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Filter transactions for current month or period
  const monthTransactions = transactions.filter(
    (tx) => tx.data.startsWith(currentMonth) && tx.status === 'pago'
  );

  const receitas = monthTransactions
    .filter((tx) => tx.tipo === 'receita')
    .reduce((acc, tx) => acc + tx.valor, 0);

  const despesas = monthTransactions
    .filter((tx) => tx.tipo === 'despesa')
    .reduce((acc, tx) => acc + tx.valor, 0);

  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  monthTransactions
    .filter((tx) => tx.tipo === 'despesa')
    .forEach((tx) => {
      expensesByCategory[tx.categoria] = (expensesByCategory[tx.categoria] || 0) + tx.valor;
    });

  const categoryEntries = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const totalExpenses = despesas > 0 ? despesas : 1;

  // Donut chart geometry
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  // Multi-month comparison (last 4 months)
  const monthsData = [];
  const [currY, currM] = currentMonth.split('-').map(Number);
  for (let i = 3; i >= 0; i--) {
    let m = currM - i;
    let y = currY;
    if (m <= 0) {
      m += 12;
      y -= 1;
    }
    const mStr = `${y}-${String(m).padStart(2, '0')}`;
    const txs = transactions.filter((tx) => tx.data.startsWith(mStr) && tx.status === 'pago');
    const rec = txs.filter((t) => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
    const desp = txs.filter((t) => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
    const dateObj = new Date(y, m - 1, 1);
    const label = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    monthsData.push({ monthKey: mStr, label: label.toUpperCase(), receitas: rec, despesas: desp });
  }

  const maxBarValue = Math.max(
    ...monthsData.map((d) => Math.max(d.receitas, d.despesas)),
    1000
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Cash Flow Comparison Bar Chart */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
              Fluxo de Caixa dos Últimos Meses
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Comparativo de receitas vs. despesas realizadas
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Receitas
            </span>
            <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" /> Despesas
            </span>
          </div>
        </div>

        {/* Bar chart area */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-neutral-100 dark:border-neutral-800">
          {monthsData.map((d) => {
            const recHeight = (d.receitas / maxBarValue) * 100;
            const despHeight = (d.despesas / maxBarValue) * 100;
            const isCurrent = d.monthKey === currentMonth;

            return (
              <div key={d.monthKey} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  {/* Receita bar */}
                  <div
                    className="w-1/2 max-w-[24px] bg-emerald-500/80 hover:bg-emerald-600 rounded-t-sm transition-all relative flex justify-center"
                    style={{ height: `${Math.max(recHeight, 4)}%` }}
                    title={`Receitas em ${d.label}: ${formatCurrency(d.receitas)}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[10px] font-mono tabular-nums bg-neutral-900 text-white px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 pointer-events-none transition-opacity">
                      {formatCurrency(d.receitas)}
                    </span>
                  </div>
                  {/* Despesa bar */}
                  <div
                    className="w-1/2 max-w-[24px] bg-rose-500/80 hover:bg-rose-600 rounded-t-sm transition-all relative flex justify-center"
                    style={{ height: `${Math.max(despHeight, 4)}%` }}
                    title={`Despesas em ${d.label}: ${formatCurrency(d.despesas)}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[10px] font-mono tabular-nums bg-neutral-900 text-white px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 pointer-events-none transition-opacity">
                      {formatCurrency(d.despesas)}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-3 pt-1">
          <span>
            Receitas no Mês Atual: <strong className="text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">{formatCurrency(receitas)}</strong>
          </span>
          <span>
            Despesas: <strong className="text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">{formatCurrency(despesas)}</strong>
          </span>
        </div>
      </div>

      {/* Chart 2: Category Donut Chart */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                Despesas por Categoria
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Distribuição percentual dos gastos no período
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
              Total: {formatCurrency(despesas)}
            </span>
          </div>

          {categoryEntries.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-neutral-400 text-xs">
              <p>Nenhuma despesa registrada para o período selecionado.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              {/* SVG Donut */}
              <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-neutral-100 dark:text-neutral-800"
                  />
                  {categoryEntries.map(([cat, val]) => {
                    const ratio = val / totalExpenses;
                    const strokeDasharray = `${ratio * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedAngle;
                    accumulatedAngle += ratio * circumference;
                    const color = CATEGORY_COLORS[cat] || '#71717A';
                    const isHovered = hoveredCategory === cat;

                    return (
                      <circle
                        key={cat}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    );
                  })}
                </svg>

                {/* Center text in donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    {hoveredCategory || 'Categorias'}
                  </span>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 font-mono tabular-nums truncate max-w-[85px]">
                    {hoveredCategory
                      ? formatCurrency(expensesByCategory[hoveredCategory] || 0)
                      : `${categoryEntries.length} itens`}
                  </span>
                </div>
              </div>

              {/* Category Legend */}
              <div className="flex-1 w-full flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
                {categoryEntries.map(([cat, val]) => {
                  const pct = ((val / totalExpenses) * 100).toFixed(1);
                  const color = CATEGORY_COLORS[cat] || '#71717A';
                  const isHovered = hoveredCategory === cat;

                  return (
                    <div
                      key={cat}
                      onMouseEnter={() => setHoveredCategory(cat)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`flex items-center justify-between text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
                        isHovered
                          ? 'bg-neutral-100 dark:bg-neutral-800'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate text-neutral-700 dark:text-neutral-300 font-medium">
                          {cat}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono tabular-nums text-neutral-500 dark:text-neutral-400 shrink-0">
                        <span>{formatCurrency(val)}</span>
                        <span className="text-[10px] text-neutral-400">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
