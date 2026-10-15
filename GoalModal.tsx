import React, { useState, useEffect } from 'react';
import { FinancialGoal } from '../../types';
import { Modal } from '../common/Modal';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: FinancialGoal) => void;
  initialData?: FinancialGoal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Reserva');
  const [valorAlvo, setValorAlvo] = useState('5000');
  const [valorAtual, setValorAtual] = useState('0');
  const [dataLimite, setDataLimite] = useState('');
  const [cor, setCor] = useState('#10B981');
  const [icone, setIcone] = useState('shield');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setCategoria(initialData.categoria);
      setValorAlvo(initialData.valorAlvo.toString());
      setValorAtual(initialData.valorAtual.toString());
      setDataLimite(initialData.dataLimite || '');
      setCor(initialData.cor);
      setIcone(initialData.icone);
      setNotas(initialData.notas || '');
    } else {
      setTitulo('');
      setCategoria('Reserva');
      setValorAlvo('5000');
      setValorAtual('0');
      setDataLimite('');
      setCor('#10B981');
      setIcone('shield');
      setNotas('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const alvo = parseFloat(valorAlvo.replace(',', '.')) || 1000;
    const atual = parseFloat(valorAtual.replace(',', '.')) || 0;

    const goal: FinancialGoal = {
      id: initialData ? initialData.id : `goal-${Date.now()}`,
      titulo: titulo.trim() || 'Nova Meta',
      categoria: categoria.trim() || 'Geral',
      valorAlvo: Math.max(1, alvo),
      valorAtual: Math.max(0, atual),
      dataLimite: dataLimite || undefined,
      cor,
      icone,
      notas: notas.trim() || undefined,
    };
    onSave(goal);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Meta Financeira' : 'Nova Meta Financeira'}
      description="Defina um objetivo com valor pretendido e prazo."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Título da Meta *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Reserva de Emergência, Fundo de Viagem..."
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
              placeholder="Ex: Segurança, Lazer, Imóvel..."
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
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Valor Inicial Acumulado (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={valorAtual}
              onChange={(e) => setValorAtual(e.target.value)}
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
            Notas & Planejamento
          </label>
          <textarea
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Ex: Guardar no Tesouro Selic todo dia 10..."
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
            {initialData ? 'Salvar Alterações' : 'Criar Meta'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
