import React, { useState } from 'react';
import { Task, TaskStatus, PriorityLevel } from '../../types';
import { formatDateBR, getTaskDueStatus } from '../../utils/formatters';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Plus,
  LayoutGrid,
  List,
  Search,
  Edit3,
  Trash2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  onOpenNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = Array.from(new Set(tasks.map((t) => t.categoria))).sort();

  const filteredTasks = tasks.filter((task) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = task.titulo.toLowerCase().includes(q);
      const matchDesc = task.descricao?.toLowerCase().includes(q);
      const matchTag = task.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    if (filterPriority !== 'all' && task.prioridade !== filterPriority) return false;
    if (filterCategory !== 'all' && task.categoria !== filterCategory) return false;
    return true;
  });

  const getPriorityStyle = (prioridade: PriorityLevel) => {
    switch (prioridade) {
      case 'Alta':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'Media':
        return 'text-amber-600 dark:text-amber-400 font-medium';
      case 'Baixa':
        return 'text-neutral-500 dark:text-neutral-400';
    }
  };

  const kanbanColumns: { id: TaskStatus; title: string; count: number }[] = [
    {
      id: 'a_fazer',
      title: 'A Fazer',
      count: filteredTasks.filter((t) => t.status === 'a_fazer').length,
    },
    {
      id: 'em_andamento',
      title: 'Em Andamento',
      count: filteredTasks.filter((t) => t.status === 'em_andamento').length,
    },
    {
      id: 'concluida',
      title: 'Concluídas',
      count: filteredTasks.filter((t) => t.status === 'concluida').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
            Gerenciador de Tarefas
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Acompanhe prioridades, prazos de entrega e progresso em lista ou Kanban
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Lista
            </button>
          </div>

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Nova Tarefa
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar tarefas por título, descrição ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="all">Todas as prioridades</option>
            <option value="Alta">Alta prioridade</option>
            <option value="Media">Média prioridade</option>
            <option value="Baixa">Baixa prioridade</option>
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
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-neutral-100/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl p-3.5 flex flex-col min-h-[420px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                    {col.title}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-neutral-500 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded shadow-2xs">
                    {col.count}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[11px] text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                      Nenhuma tarefa nesta etapa
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const dueStatus = getTaskDueStatus(task.vencimento);

                      return (
                        <div
                          key={task.id}
                          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3.5 shadow-2xs group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Top: Category & Priority */}
                            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                              <span className="text-[11px]">{task.categoria}</span>
                              <span className={`text-[11px] ${getPriorityStyle(task.prioridade)}`}>
                                Prioridade {task.prioridade}
                              </span>
                            </div>

                            {/* Title & Checkbox */}
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={() => onToggleComplete(task.id)}
                                className="mt-0.5 text-neutral-400 hover:text-emerald-600 transition-colors shrink-0"
                                aria-label="Concluir tarefa"
                              >
                                {task.concluida ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Circle className="w-4 h-4" />
                                )}
                              </button>
                              <div className="flex-1">
                                <h4
                                  className={`text-xs font-medium text-neutral-900 dark:text-neutral-100 ${
                                    task.concluida ? 'line-through text-neutral-400' : ''
                                  }`}
                                >
                                  {task.titulo}
                                </h4>
                                {task.descricao && (
                                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                                    {task.descricao}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="text-[10px] text-neutral-400 mt-2 flex flex-wrap gap-1">
                                {task.tags.map((t) => (
                                  <span key={t}>#{t}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Card Footer: Due Date & Actions */}
                          <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                            {task.vencimento ? (
                              <span
                                className={`flex items-center gap-1 font-mono tabular-nums ${
                                  dueStatus.isOverdue
                                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                    : dueStatus.isDueToday
                                    ? 'text-amber-600 dark:text-amber-400 font-semibold'
                                    : 'text-neutral-400'
                                }`}
                              >
                                {dueStatus.isOverdue && <AlertTriangle className="w-3 h-3" />}
                                {formatDateBR(task.vencimento)}
                                {dueStatus.text && ` (${dueStatus.text})`}
                              </span>
                            ) : (
                              <span className="text-neutral-400">Sem prazo</span>
                            )}

                            {/* Move Status Buttons */}
                            <div className="flex items-center gap-1">
                              {col.id !== 'concluida' && (
                                <button
                                  onClick={() =>
                                    onUpdateStatus(
                                      task.id,
                                      col.id === 'a_fazer' ? 'em_andamento' : 'concluida'
                                    )
                                  }
                                  className="p-1 text-neutral-400 hover:text-emerald-600 transition-colors"
                                  title={col.id === 'a_fazer' ? 'Mover para Em Andamento' : 'Concluir'}
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => onEditTask(task)}
                                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                title="Editar"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 text-neutral-400 hover:text-rose-600"
                                title="Excluir"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-500">
              Nenhuma tarefa encontrada com os filtros selecionados.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredTasks.map((task) => {
                const dueStatus = getTaskDueStatus(task.vencimento);

                return (
                  <div
                    key={task.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className="mt-0.5 text-neutral-400 hover:text-emerald-600 transition-colors shrink-0"
                        aria-label="Marcar como concluída"
                      >
                        {task.concluida ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`text-xs font-semibold text-neutral-900 dark:text-neutral-100 ${
                            task.concluida ? 'line-through text-neutral-400' : ''
                          }`}
                        >
                          {task.titulo}
                        </h4>
                        {task.descricao && (
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {task.descricao}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1.5">
                          <span>{task.categoria}</span>
                          <span aria-hidden="true">·</span>
                          <span className={getPriorityStyle(task.prioridade)}>
                            {task.prioridade}
                          </span>
                          {task.tags && task.tags.length > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{task.tags.map((t) => `#${t}`).join(' ')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs pl-7 sm:pl-0">
                      {task.vencimento && (
                        <span
                          className={`font-mono tabular-nums text-[11px] ${
                            dueStatus.isOverdue
                              ? 'text-rose-600 font-semibold'
                              : dueStatus.isDueToday
                              ? 'text-amber-600 font-semibold'
                              : 'text-neutral-500'
                          }`}
                        >
                          {formatDateBR(task.vencimento)}
                          {dueStatus.text && ` (${dueStatus.text})`}
                        </span>
                      )}

                      {/* Status Selector */}
                      <select
                        value={task.status}
                        onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                        className="px-2 py-1 text-[11px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-700 dark:text-neutral-300"
                      >
                        <option value="a_fazer">A Fazer</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                      </select>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
