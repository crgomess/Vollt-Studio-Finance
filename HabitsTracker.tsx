import React, { useState } from 'react';
import { Habit } from '../../types';
import { getRecentDays, getTodayString, calculateHabitStreak } from '../../utils/formatters';
import { Flame, Check, Plus, Edit3, Trash2, Award, Calendar } from 'lucide-react';

interface HabitsTrackerProps {
  habits: Habit[];
  onOpenNewHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onToggleDay: (habitId: string, dateStr: string) => void;
}

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({
  habits,
  onOpenNewHabit,
  onEditHabit,
  onDeleteHabit,
  onToggleDay,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const recentDays = getRecentDays(7);
  const todayStr = getTodayString();

  const categories = Array.from(new Set(habits.map((h) => h.categoria))).sort();

  const filteredHabits = habits.filter((h) => {
    if (filterCategory !== 'all' && h.categoria !== filterCategory) return false;
    return true;
  });

  // Calculate today's overall completion
  const completedTodayCount = habits.filter((h) => h.historicoDias.includes(todayStr)).length;
  const todayRate = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
            Rastreador de Hábitos & Rotinas
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Construa disciplina diária com acompanhamento visual e sequências contínuas
          </p>
        </div>

        <div className="flex items-center gap-3">
          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onOpenNewHabit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Novo Hábito
          </button>
        </div>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500">Hábitos Cumpridos Hoje</span>
            <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-0.5">
              {completedTodayCount} de {habits.length}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500">Taxa de Sucesso Diária</span>
            <p className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
              {todayRate}%
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500">Total de Hábitos Ativos</span>
            <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-0.5">
              {habits.length}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Habits List and Weekly Matrix */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
        {filteredHabits.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            Nenhum hábito cadastrado nesta categoria. Crie um novo hábito para começar seu histórico!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
                <tr>
                  <th className="py-3 px-4 font-medium min-w-[200px]">Hábito & Frequência</th>
                  <th className="py-3 px-4 font-medium text-center">Sequência</th>
                  {recentDays.map((d) => (
                    <th
                      key={d.dateStr}
                      className={`py-3 px-2 text-center font-medium ${
                        d.isToday ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                      }`}
                    >
                      <div className="text-[10px] uppercase">{d.dayName}</div>
                      <div className="text-xs font-mono">{d.dayNum}</div>
                    </th>
                  ))}
                  <th className="py-3 px-4 font-medium text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {filteredHabits.map((habit) => {
                  const isDoneToday = habit.historicoDias.includes(todayStr);
                  const { current, longest } = calculateHabitStreak(habit.historicoDias);

                  return (
                    <tr
                      key={habit.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors group"
                    >
                      {/* Name & Meta */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: habit.cor }}
                          />
                          <div>
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {habit.nome}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                              <span>{habit.categoria}</span>
                              <span aria-hidden="true">·</span>
                              <span>{habit.frequencia}</span>
                              {habit.metaDiaria && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono">{habit.metaDiaria}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-xs font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{current} dias</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            (max {longest})
                          </span>
                        </div>
                      </td>

                      {/* 7 Days Columns */}
                      {recentDays.map((d) => {
                        const isDone = habit.historicoDias.includes(d.dateStr);

                        return (
                          <td key={d.dateStr} className="py-3.5 px-2 text-center">
                            <button
                              onClick={() => onToggleDay(habit.id, d.dateStr)}
                              className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                                isDone
                                  ? 'text-white shadow-xs'
                                  : 'border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 text-transparent'
                              }`}
                              style={{
                                backgroundColor: isDone ? habit.cor : 'transparent',
                              }}
                              title={`${habit.nome} em ${d.dateStr}: ${isDone ? 'Concluído' : 'Não feito'}`}
                              aria-label={`Marcar hábito em ${d.dateStr}`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </td>
                        );
                      })}

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditHabit(habit)}
                            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                            title="Editar hábito"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteHabit(habit.id)}
                            className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                            title="Excluir hábito"
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
