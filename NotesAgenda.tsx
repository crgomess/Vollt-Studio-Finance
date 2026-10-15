import React, { useState } from 'react';
import { NoteItem } from '../../types';
import { formatDateTimeBR } from '../../utils/formatters';
import { Pin, Calendar, Search, Plus, Edit3, Trash2, Tag } from 'lucide-react';

interface NotesAgendaProps {
  notes: NoteItem[];
  onOpenNewNote: () => void;
  onEditNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const NotesAgenda: React.FC<NotesAgendaProps> = ({
  notes,
  onOpenNewNote,
  onEditNote,
  onDeleteNote,
  onTogglePin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');

  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags || []))
  ).sort();

  const filteredNotes = notes.filter((n) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = n.titulo.toLowerCase().includes(q);
      const matchContent = n.conteudo.toLowerCase().includes(q);
      const matchTag = n.tags && n.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }
    if (filterTag !== 'all' && (!n.tags || !n.tags.includes(filterTag))) {
      return false;
    }
    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.fixado);
  const otherNotes = filteredNotes.filter((n) => !n.fixado);

  const renderNoteCard = (note: NoteItem) => {
    return (
      <div
        key={note.id}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all relative"
      >
        <div>
          {/* Header with Title and Pin */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
              {note.titulo}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onTogglePin(note.id)}
                className={`p-1 rounded transition-colors ${
                  note.fixado
                    ? 'text-amber-500 hover:text-amber-600'
                    : 'text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
                title={note.fixado ? 'Desafixar nota' : 'Fixar nota no topo'}
              >
                <Pin className={`w-3.5 h-3.5 ${note.fixado ? 'fill-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Appointment Date Tag if present */}
          {note.compromissoDataHora && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mb-2">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{formatDateTimeBR(note.compromissoDataHora)}</span>
            </div>
          )}

          {/* Note content preview */}
          <p className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-pre-line line-clamp-6 leading-relaxed font-sans">
            {note.conteudo}
          </p>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 text-[10px] text-neutral-400 mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              {note.tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-neutral-400">
          <span>{note.categoria}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditNote(note)}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
              title="Editar anotação"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="p-1 text-neutral-400 hover:text-rose-600 rounded"
              title="Excluir anotação"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
            Agenda & Bloco de Notas
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Registre atas, ideias, compromissos importantes e lembretes com fixação no topo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewNote}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Nova Nota
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar notas por título, conteúdo ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-2.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
            >
              <option value="all">Todas as tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  #{t}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredNotes.length === 0 ? (
        <div className="p-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
          Nenhuma anotação encontrada. Crie sua primeira nota clicando no botão acima!
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned section */}
          {pinnedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Notas Fixadas ({pinnedNotes.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => renderNoteCard(note))}
              </div>
            </div>
          )}

          {/* Other notes section */}
          {otherNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Outras Notas ({otherNotes.length})
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherNotes.map((note) => renderNoteCard(note))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
