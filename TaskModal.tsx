import React, { useState, useEffect } from 'react';
import { Task, PriorityLevel, TaskStatus } from '../../types';
import { Modal } from '../common/Modal';
import { getTodayString } from '../../utils/formatters';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'criadaEm'>, editId?: string) => void;
  initialData?: Task | null;
}

const CATEGORIES = ['Trabalho', 'Pessoal', 'Finanças', 'Estudos', 'Saúde', 'Projetos', 'Casa'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<PriorityLevel>('Media');
  const [status, setStatus] = useState<TaskStatus>('a_fazer');
  const [categoria, setCategoria] = useState('Trabalho');
  const [vencimento, setVencimento] = useState(getTodayString());
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setDescricao(initialData.descricao || '');
      setPrioridade(initialData.prioridade);
      setStatus(initialData.status);
      setCategoria(initialData.categoria);
      setVencimento(initialData.vencimento || '');
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
    } else {
      setTitulo('');
      setDescricao('');
      setPrioridade('Media');
      setStatus('a_fazer');
      setCategoria('Trabalho');
      setVencimento(getTodayString());
      setTagsInput('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onSave(
      {
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        prioridade,
        status,
        concluida: status === 'concluida',
        categoria,
        vencimento: vencimento || undefined,
        tags,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Tarefa' : 'Nova Tarefa'}
      description="Organize suas pendências com prioridades e prazos claros."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Título da Tarefa *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Entregar relatório fiscal, pagar fatura..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Descrição / Detalhes (Opcional)
          </label>
          <textarea
            rows={2}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Adicione orientações ou checklist rápido..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Prioridade
            </label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Baixa">Baixa (Rotina)</option>
              <option value="Media">Média (Importante)</option>
              <option value="Alta">Alta (Urgente)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Status Inicial
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="a_fazer">A Fazer</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Data de Vencimento
            </label>
            <input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Ex: sprint, urgente, casa"
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            {initialData ? 'Salvar Tarefa' : 'Adicionar Tarefa'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
