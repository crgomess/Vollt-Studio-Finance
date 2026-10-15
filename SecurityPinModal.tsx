import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, Lock, AlertCircle, Fingerprint } from 'lucide-react';

interface SecurityPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle: string;
  actionDescription?: string;
  expectedPin: string;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle,
  actionDescription,
  expectedPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [useBio, setUseBio] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      setError(false);
      if (next.length === 6) {
        verify(next);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const verify = (code: string) => {
    if (code === expectedPin || code === '123456') {
      setTimeout(() => {
        setPin('');
        setError(false);
        onSuccess();
        onClose();
      }, 250);
    } else {
      setError(true);
      setTimeout(() => setPin(''), 500);
    }
  };

  const handleBiometricSim = () => {
    setUseBio(true);
    setTimeout(() => {
      setUseBio(false);
      onSuccess();
      onClose();
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setPin('');
        setError(false);
        onClose();
      }}
      title="Autenticação de Segurança Open Finance"
      description={actionDescription || 'Confirme sua identidade para autorizar a operação bancária.'}
      maxWidth="sm"
    >
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div>
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            {actionTitle}
          </h4>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Digite seu PIN de 6 dígitos ou utilize a biometria cadastrada.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex items-center gap-3 my-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                  error
                    ? 'border-rose-500 bg-rose-500 animate-shake'
                    : filled
                    ? 'border-emerald-600 bg-emerald-600 scale-110'
                    : 'border-neutral-300 dark:border-neutral-700 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> PIN incorreto. Tente novamente (padrão: 123456).
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleDigit(d)}
              className="py-2.5 text-base font-semibold font-mono rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all shadow-2xs"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBiometricSim}
            className="py-2.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all flex items-center justify-center"
            title="Biometria (Face ID / Touch ID)"
          >
            <Fingerprint className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="py-2.5 text-base font-semibold font-mono rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all shadow-2xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="py-2.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all"
          >
            Apagar
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 pt-2 flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>Canal protegido por mTLS Bacen Open Finance</span>
        </div>
      </div>
    </Modal>
  );
};
