import React, { useState, useEffect } from 'react';
import { Habit, HabitFrequency } from '../../types';
import { Modal } from '../common/Modal';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id' | 'historicoDias' | 'criadoEm'>, editId?: string) => void;
  initialData?: Habit | null;
}

const CATEGORIES = ['Saúde', 'Produtividade', 'Estudos', 'Finanças', 'Mente', 'Espiritualidade', 'Rotina'];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Saúde');
  const [frequencia, setFrequencia] = useState<HabitFrequency>('Diária');
  const [metaDiaria, setMetaDiaria] = useState('');
  const [cor, setCor] = useState('#06B6D4');

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setCategoria(initialData.categoria);
      setFrequencia(initialData.frequencia);
      setMetaDiaria(initialData.metaDiaria || '');
      setCor(initialData.cor);
    } else {
      setNome('');
      setCategoria('Saúde');
      setFrequencia('Diária');
      setMetaDiaria('');
      setCor('#06B6D4');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    onSave(
      {
        nome: nome.trim(),
        categoria,
        frequencia,
        metaDiaria: metaDiaria.trim() || undefined,
        cor,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Hábito' : 'Novo Hábito'}
      description="Construa consistência acompanhando hábitos diários e semanais."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Nome do Hábito *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Beber 2L de água, Meditação, Treinar..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
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
              Frequência
            </label>
            <select
              value={frequencia}
              onChange={(e) => setFrequencia(e.target.value as HabitFrequency)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Diária">Diária (Todos os dias)</option>
              <option value="Dias úteis">Dias Úteis (Seg a Sex)</option>
              <option value="Semanal">Semanal (Fins de semana)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Meta Quantitativa (Opcional)
            </label>
            <input
              type="text"
              value={metaDiaria}
              onChange={(e) => setMetaDiaria(e.target.value)}
              placeholder="Ex: 2L, 30 min, 15 páginas"
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Cor do Marcador
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
            {initialData ? 'Salvar Alterações' : 'Criar Hábito'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
