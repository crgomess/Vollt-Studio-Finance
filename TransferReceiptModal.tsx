import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDateBR } from '../../utils/formatters';
import { CheckCircle2, ShieldCheck, Copy, Check, ExternalLink, ArrowRight, Download } from 'lucide-react';

export interface TransferReceiptData {
  id: string;
  endToEndId: string;
  protocoloBacen: string;
  timestamp: string;
  valor: number;
  contaOrigemNome: string;
  bancoOrigem: string;
  contaDestinoNome: string;
  bancoDestino: string;
  chavePixDestino?: string;
  hashAutenticacao: string;
  regraTitulo: string;
}

interface TransferReceiptModalProps {
  receipt: TransferReceiptData | null;
  onClose: () => void;
}

export const TransferReceiptModal: React.FC<TransferReceiptModalProps> = ({ receipt, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!receipt) return null;

  const handleCopy = () => {
    const text = `=== COMPROVANTE DE TRANSFERÊNCIA OPEN FINANCE ===
Protocolo Bacen: ${receipt.protocoloBacen}
End-to-End ID: ${receipt.endToEndId}
Data/Hora: ${receipt.timestamp}
Valor: ${formatCurrency(receipt.valor)}
Origem: ${receipt.contaOrigemNome} (${receipt.bancoOrigem})
Destino: ${receipt.contaDestinoNome} (${receipt.bancoDestino})
${receipt.chavePixDestino ? `Chave Pix: ${receipt.chavePixDestino}\n` : ''}Regra de Automação: ${receipt.regraTitulo}
Autenticação SHA-256: ${receipt.hashAutenticacao}
Status: Liquidado no SPI (Sistema de Pagamentos Instantâneos)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={Boolean(receipt)}
      onClose={onClose}
      title="Comprovante de Transferência Automatizada"
      description="Liquidação instantânea realizada via Open Finance Brasil e Sistema de Pagamentos Instantâneos (SPI)."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Success Header Banner */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/80 px-2.5 py-0.5 rounded-full font-semibold">
            Transação Liquidada com Sucesso
          </span>
          <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2">
            {formatCurrency(receipt.valor)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {receipt.regraTitulo}
          </p>
        </div>

        {/* Transfer Path Box */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="w-[45%]">
              <span className="text-[10px] text-neutral-400 uppercase block font-semibold">Conta Debitada</span>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {receipt.contaOrigemNome}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">{receipt.bancoOrigem}</p>
            </div>

            <div className="w-[10%] flex justify-center">
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="w-[45%] text-right">
              <span className="text-[10px] text-neutral-400 uppercase block font-semibold">Conta Creditada</span>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {receipt.contaDestinoNome}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">{receipt.bancoDestino}</p>
            </div>
          </div>

          {receipt.chavePixDestino && (
            <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 text-center">
              <span className="text-[10px] text-neutral-400">Chave Pix de Liquidação: </span>
              <span className="text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200">
                {receipt.chavePixDestino}
              </span>
            </div>
          )}
        </div>

        {/* Regulatory & Security Details */}
        <div className="space-y-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-neutral-500 py-1 border-b border-neutral-100 dark:border-neutral-800/80">
            <span className="text-[11px]">Protocolo Bacen:</span>
            <span className="font-mono text-[11px] text-neutral-900 dark:text-neutral-100 font-medium">
              {receipt.protocoloBacen}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-500 py-1 border-b border-neutral-100 dark:border-neutral-800/80">
            <span className="text-[11px]">ID FAPI / End-to-End:</span>
            <span className="font-mono text-[10px] text-neutral-900 dark:text-neutral-100 truncate max-w-[220px]" title={receipt.endToEndId}>
              {receipt.endToEndId}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-500 py-1 border-b border-neutral-100 dark:border-neutral-800/80">
            <span className="text-[11px]">Data e Hora da Liquidação:</span>
            <span className="font-mono text-[11px] text-neutral-900 dark:text-neutral-100">
              {receipt.timestamp}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-500 py-1">
            <span className="text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Hash SHA-256:
            </span>
            <span className="font-mono text-[9px] text-neutral-400 truncate max-w-[220px]" title={receipt.hashAutenticacao}>
              {receipt.hashAutenticacao}
            </span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Canal Seguro mTLS FAPI Bacen
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Comprovante'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
