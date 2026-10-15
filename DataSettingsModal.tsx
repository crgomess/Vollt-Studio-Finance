import React, { useRef, useState } from 'react';
import { AppData } from '../../types';
import { Modal } from '../common/Modal';
import { Download, Upload, RotateCcw, Trash2, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';

interface DataSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AppData;
  onImportData: (data: AppData) => void;
  onResetToDefault: () => void;
  onClearAll: () => void;
  onOpenSupabase?: () => void;
}

export const DataSettingsModal: React.FC<DataSettingsModalProps> = ({
  isOpen,
  onClose,
  data,
  onImportData,
  onResetToDefault,
  onClearAll,
  onOpenSupabase,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (
          !parsed ||
          !Array.isArray(parsed.transacoes) ||
          !Array.isArray(parsed.tarefas) ||
          !Array.isArray(parsed.habitos)
        ) {
          setImportStatus('Formato de arquivo JSON inválido para o Nexus.');
          return;
        }

        onImportData(parsed);
        setImportStatus('Backup importado com sucesso!');
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1500);
      } catch (err) {
        setImportStatus('Erro ao ler arquivo JSON. Verifique o conteúdo.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gerenciamento de Dados & Backup"
      description="Exporte seus dados localmente, restaure backups ou conecte com o Supabase."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Supabase SQL Callout */}
        {onOpenSupabase && (
          <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
            <div>
              <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Script SQL & Supabase
              </h4>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                Acesse o código DDL com tabelas, Row Level Security e login do Supabase.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenSupabase();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shrink-0 shadow-xs"
            >
              Abrir SQL
            </button>
          </div>
        )}

        {/* Status Counts */}
        <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-2">
            Registros Ativos em Armazenamento Local:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-600 dark:text-neutral-400 font-mono">
            <div>Transações: <strong className="text-neutral-900 dark:text-neutral-100">{data.transacoes.length}</strong></div>
            <div>Contas: <strong className="text-neutral-900 dark:text-neutral-100">{data.contas.length}</strong></div>
            <div>Tarefas: <strong className="text-neutral-900 dark:text-neutral-100">{data.tarefas.length}</strong></div>
            <div>Hábitos: <strong className="text-neutral-900 dark:text-neutral-100">{data.habitos.length}</strong></div>
          </div>
        </div>

        {/* Action 1: Exportar Backup */}
        <div className="flex items-center justify-between p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Exportar Backup JSON
            </h4>
            <p className="text-[11px] text-neutral-500">
              Baixe um arquivo seguro com todas as transações, metas, tarefas e hábitos.
            </p>
          </div>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800 shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> Baixar JSON
          </button>
        </div>

        {/* Action 2: Importar Backup */}
        <div className="flex items-center justify-between p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Restaurar Backup JSON
            </h4>
            <p className="text-[11px] text-neutral-500">
              Carregue um arquivo JSON gerado anteriormente para restaurar seu histórico.
            </p>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700 shrink-0"
            >
              <Upload className="w-3.5 h-3.5" /> Importar
            </button>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Action 3: Restaurar Dados Padrão */}
        <div className="flex items-center justify-between p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Restaurar Dados de Exemplo
            </h4>
            <p className="text-[11px] text-neutral-500">
              Restaura a base de demonstração rica para o mês de outubro de 2026.
            </p>
          </div>
          <button
            onClick={() => {
              onResetToDefault();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 dark:border-amber-800 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar
          </button>
        </div>

        {/* Action 4: Limpar Tudo */}
        <div className="p-3.5 border border-rose-200 dark:border-rose-950 rounded-xl bg-rose-50/40 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Zona de Perigo
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Apagar permanentemente todos os registros salvos neste navegador.
              </p>
            </div>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition-colors"
              >
                Limpar Dados
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                    onClose();
                  }}
                  className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                >
                  Confirmar Limpeza
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
