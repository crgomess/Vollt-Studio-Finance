import React, { useState } from 'react';
import { SecurityConfig } from '../../types';
import { Modal } from '../common/Modal';
import { Shield, ShieldAlert, Lock, Eye, EyeOff, Moon, Smartphone, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SecurityConfig;
  onSaveConfig: (updated: SecurityConfig) => void;
  onEmergencyFreeze: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onEmergencyFreeze,
  onShowToast,
}) => {
  const [modoSeguranca, setModoSeguranca] = useState(config.modoSegurancaAtivo);
  const [ocultarValores, setOcultarValores] = useState(config.ocultarValores);
  const [limiteDiurno, setLimiteDiurno] = useState(config.limiteTransferenciaDiurno.toString());
  const [limiteNoturno, setLimiteNoturno] = useState(config.limiteTransferenciaNoturno.toString());
  const [pin, setPin] = useState(config.pinSeguranca);
  const [biometria, setBiometria] = useState(config.biometriaAtiva);
  const [confirmFreeze, setConfirmFreeze] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const lDiurno = parseFloat(limiteDiurno.replace(',', '.')) || 10000;
    const lNoturno = parseFloat(limiteNoturno.replace(',', '.')) || 1000;

    const updated: SecurityConfig = {
      ...config,
      modoSegurancaAtivo: modoSeguranca,
      ocultarValores,
      limiteTransferenciaDiurno: Math.max(100, lDiurno),
      limiteTransferenciaNoturno: Math.max(50, lNoturno),
      pinSeguranca: pin.length === 6 ? pin : '123456',
      biometriaAtiva: biometria,
    };

    onSaveConfig(updated);
    onShowToast('Parâmetros de segurança atualizados!', 'success');
    onClose();
  };

  const handleExecuteFreeze = () => {
    onEmergencyFreeze();
    setConfirmFreeze(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cofre & Modo Segurança Bancária"
      description="Diretrizes do Banco Central para Open Finance, limites diurnos/noturnos e proteção de saldos."
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-5">
        {/* Main Mode Toggles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Modo Segurança Avançado
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Exigir PIN de 6 dígitos em qualquer transferência ou alteração bancária.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={modoSeguranca}
                onChange={(e) => setModoSeguranca(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                {ocultarValores ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Ocultar Valores (Privacidade em Público)
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Substituir valores monetários por ••••• no aplicativo.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ocultarValores}
                onChange={(e) => setOcultarValores(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
        </div>

        {/* Transfer Limits (Bacen Standard) */}
        <div>
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-neutral-500" />
            Limites Operacionais de Transferência (Bacen)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">
                Limite Diurno (06:00 às 20:00)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-400 font-mono">R$</span>
                <input
                  type="number"
                  step="100"
                  value={limiteDiurno}
                  onChange={(e) => setLimiteDiurno(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-neutral-500 mb-1 flex items-center gap-1">
                <Moon className="w-3 h-3 text-amber-500" /> Limite Noturno (20:00 às 06:00)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-400 font-mono">R$</span>
                <input
                  type="number"
                  step="50"
                  value={limiteNoturno}
                  onChange={(e) => setLimiteNoturno(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PIN & Biometry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-neutral-500 mb-1">
              PIN de Segurança (6 Dígitos)
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tracking-widest text-center"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <div>
              <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 block">
                Biometria
              </span>
              <span className="text-[10px] text-neutral-400">Touch ID / Face ID</span>
            </div>
            <input
              type="checkbox"
              checked={biometria}
              onChange={(e) => setBiometria(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Device Information */}
        <div className="p-3 bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-xl text-[11px] space-y-1 text-neutral-500">
          <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dispositivo Confiável: {config.dispositivoConfiavel}</span>
          </div>
          <p>Assinatura digital via chave criptográfica mTLS homologada pelo Open Finance Brasil.</p>
        </div>

        {/* Emergency Freeze Action */}
        <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Botão de Pânico / Bloqueio Imediato
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Pausa imediatamente todas as transferências automáticas e desconecta APIs bancárias.
              </p>
            </div>
            {!confirmFreeze ? (
              <button
                type="button"
                onClick={() => setConfirmFreeze(true)}
                className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition-colors shrink-0"
              >
                Pausar Tudo
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmFreeze(false)}
                  className="px-2 py-1 text-xs text-neutral-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteFreeze}
                  className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
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
            Salvar Configurações
          </button>
        </div>
      </form>
    </Modal>
  );
};
