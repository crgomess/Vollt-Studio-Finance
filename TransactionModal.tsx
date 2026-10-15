import React, { useState, useEffect } from 'react';
import { Transaction, Account, CreditCard, TransactionType, ExpenseSubtype } from '../../types';
import { Modal } from '../common/Modal';
import { getTodayString } from '../../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>, editId?: string) => void;
  accounts: Account[];
  cards: CreditCard[];
  initialData?: Transaction | null;
}

const CATEGORIES_BY_TYPE: Record<TransactionType, string[]> = {
  despesa: [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Lazer',
    'Saúde',
    'Educação',
    'Serviços',
    'Compras',
    'Outros',
  ],
  receita: ['Salário', 'Investimentos', 'Freelance / Extra', 'Presente', 'Venda', 'Outros'],
  transferencia: ['Transferência entre Contas', 'Investimentos', 'Reserva'],
};

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  accounts,
  cards,
  initialData,
}) => {
  const [tipo, setTipo] = useState<TransactionType>('despesa');
  const [subtipo, setSubtipo] = useState<ExpenseSubtype>('variavel');
  const [valor, setValor] = useState<string>('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Alimentação');
  const [data, setData] = useState(getTodayString());
  const [contaId, setContaId] = useState('');
  const [contaDestinoId, setContaDestinoId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'conta' | 'cartao'>('conta');
  const [cartaoId, setCartaoId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'pago' | 'pendente'>('pago');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (initialData) {
      setTipo(initialData.tipo);
      setSubtipo(initialData.subtipo || 'variavel');
      setValor(initialData.valor.toString());
      setDescricao(initialData.descricao);
      setCategoria(initialData.categoria);
      setData(initialData.data);
      setContaId(initialData.contaId);
      setContaDestinoId(initialData.contaDestinoId || '');
      if (initialData.cartaoId) {
        setPaymentMethod('cartao');
        setCartaoId(initialData.cartaoId);
      } else {
        setPaymentMethod('conta');
        setCartaoId('');
      }
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setStatus(initialData.status);
      setObservacoes(initialData.observacoes || '');
    } else {
      setTipo('despesa');
      setSubtipo('variavel');
      setValor('');
      setDescricao('');
      setCategoria('Alimentação');
      setData(getTodayString());
      setContaId(accounts[0]?.id || '');
      setContaDestinoId(accounts[1]?.id || '');
      setPaymentMethod('conta');
      setCartaoId(cards[0]?.id || '');
      setTagsInput('');
      setStatus('pago');
      setObservacoes('');
    }
  }, [initialData, isOpen, accounts, cards]);

  const handleTipoChange = (newTipo: TransactionType) => {
    setTipo(newTipo);
    const availableCategories = CATEGORIES_BY_TYPE[newTipo];
    if (!availableCategories.includes(categoria)) {
      setCategoria(availableCategories[0] || 'Outros');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValor = parseFloat(valor.replace(',', '.'));
    if (isNaN(numValor) || numValor <= 0) {
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const txData: Omit<Transaction, 'id'> = {
      tipo,
      subtipo: tipo === 'despesa' ? subtipo : undefined,
      valor: numValor,
      descricao: descricao.trim() || (tipo === 'receita' ? 'Receita' : 'Despesa'),
      categoria,
      data,
      contaId: paymentMethod === 'cartao' ? accounts[0]?.id || '' : contaId,
      contaDestinoId: tipo === 'transferencia' ? contaDestinoId : undefined,
      cartaoId: paymentMethod === 'cartao' && tipo === 'despesa' ? cartaoId : undefined,
      tags,
      status,
      observacoes: observacoes.trim() || undefined,
    };

    onSave(txData, initialData?.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Transação' : 'Nova Transação'}
      description="Registre entradas, saídas ou transferências financeiras."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo Selector */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
            Tipo de Movimentação
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <button
              type="button"
              onClick={() => handleTipoChange('despesa')}
              className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                tipo === 'despesa'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => handleTipoChange('receita')}
              className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                tipo === 'receita'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => handleTipoChange('transferencia')}
              className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                tipo === 'transferencia'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
              }`}
            >
              Transferência
            </button>
          </div>
        </div>

        {/* Subtipo de Despesa */}
        {tipo === 'despesa' && (
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-700 dark:text-neutral-300">
              <input
                type="radio"
                name="subtipo"
                checked={subtipo === 'variavel'}
                onChange={() => setSubtipo('variavel')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              Despesa Variável (Mercado, Lazer, etc.)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-neutral-700 dark:text-neutral-300">
              <input
                type="radio"
                name="subtipo"
                checked={subtipo === 'fixa'}
                onChange={() => setSubtipo('fixa')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              Despesa Fixa (Aluguel, Internet, etc.)
            </label>
          </div>
        )}

        {/* Valor & Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Valor (R$) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-mono">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Data *
            </label>
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Descrição *
          </label>
          <input
            type="text"
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Almoço no Bistrô, Supermercado..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            {CATEGORIES_BY_TYPE[tipo].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Pagamento / Conta / Cartão */}
        {tipo === 'despesa' && cards.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Forma de Pagamento
            </label>
            <div className="flex gap-4 text-xs mb-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-neutral-700 dark:text-neutral-300">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'conta'}
                  onChange={() => setPaymentMethod('conta')}
                  className="text-emerald-600"
                />
                Conta / Débito
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-neutral-700 dark:text-neutral-300">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cartao'}
                  onChange={() => setPaymentMethod('cartao')}
                  className="text-emerald-600"
                />
                Cartão de Crédito
              </label>
            </div>
          </div>
        )}

        {tipo === 'transferencia' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Conta de Origem *
              </label>
              <select
                value={contaId}
                onChange={(e) => setContaId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.nome} ({acc.instituicao})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Conta de Destino *
              </label>
              <select
                value={contaDestinoId}
                onChange={(e) => setContaDestinoId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} disabled={acc.id === contaId}>
                    {acc.nome} ({acc.instituicao})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : paymentMethod === 'cartao' && tipo === 'despesa' ? (
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Cartão de Crédito *
            </label>
            <select
              value={cartaoId}
              onChange={(e) => setCartaoId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} (•••• {c.ultimosDigitos})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Conta Vinculada *
            </label>
            <select
              value={contaId}
              onChange={(e) => setContaId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.nome} ({acc.instituicao})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="mercado, ifood, lazer, reforma"
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 dark:text-neutral-300">
            <input
              type="checkbox"
              checked={status === 'pago'}
              onChange={(e) => setStatus(e.target.checked ? 'pago' : 'pendente')}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            {tipo === 'receita' ? 'Valor já recebido' : 'Transação já quitada / paga'}
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            {initialData ? 'Salvar Alterações' : 'Adicionar Transação'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
