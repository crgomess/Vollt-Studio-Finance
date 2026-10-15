import React, { useState, useEffect } from 'react';
import { NoteItem } from '../../types';
import { Modal } from '../common/Modal';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<NoteItem, 'id' | 'atualizadoEm'>, editId?: string) => void;
  initialData?: NoteItem | null;
}

const CATEGORIES = ['Geral', 'Finanças', 'Compromissos', 'Ideias', 'Trabalho', 'Viagem', 'Projetos'];

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [categoria, setCategoria] = useState('Geral');
  const [fixado, setFixado] = useState(false);
  const [compromissoDataHora, setCompromissoDataHora] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [cor, setCor] = useState('#3B82F6');

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setConteudo(initialData.conteudo);
      setCategoria(initialData.categoria);
      setFixado(initialData.fixado);
      setCompromissoDataHora(initialData.compromissoDataHora || '');
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setCor(initialData.cor || '#3B82F6');
    } else {
      setTitulo('');
      setConteudo('');
      setCategoria('Geral');
      setFixado(false);
      setCompromissoDataHora('');
      setTagsInput('');
      setCor('#3B82F6');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() && !conteudo.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onSave(
      {
        titulo: titulo.trim() || 'Sem Título',
        conteudo: conteudo.trim(),
        categoria,
        fixado,
        compromissoDataHora: compromissoDataHora || undefined,
        tags,
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
      title={initialData ? 'Editar Anotação' : 'Nova Anotação ou Compromisso'}
      description="Espaço livre para notas rápidas, atas, ideias e datas importantes."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Título *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Resumo da Reunião, Ideias de Investimento..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Conteúdo / Anotações
          </label>
          <textarea
            rows={6}
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva suas anotações livres, listas com tópicos, observações..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              Data e Hora do Compromisso (Opcional)
            </label>
            <input
              type="datetime-local"
              value={compromissoDataHora}
              onChange={(e) => setCompromissoDataHora(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: financas, planejamento, reuniao"
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Cor do Card
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

        <div className="flex items-center gap-2 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 dark:text-neutral-300 font-medium">
            <input
              type="checkbox"
              checked={fixado}
              onChange={(e) => setFixado(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Fixar no topo das notas
          </label>
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
            {initialData ? 'Salvar Nota' : 'Criar Nota'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
