import React, { useState } from 'react';
import { Account, CreditCard, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { computeAccountBalances, computeCreditCardInvoice } from '../../utils/storage';
import { Modal } from '../common/Modal';
import { CreditCard as CardIcon, Landmark, Plus, Trash2, Edit3, DollarSign } from 'lucide-react';

interface AccountsCardsManagerProps {
  accounts: Account[];
  cards: CreditCard[];
  transactions: Transaction[];
  onSaveAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
  onSaveCard: (card: CreditCard) => void;
  onDeleteCard: (id: string) => void;
  onQuickPayInvoice?: (card: CreditCard, invoiceAmount: number) => void;
}

export const AccountsCardsManager: React.FC<AccountsCardsManagerProps> = ({
  accounts,
  cards,
  transactions,
  onSaveAccount,
  onDeleteAccount,
  onSaveCard,
  onDeleteCard,
  onQuickPayInvoice,
}) => {
  const computedAccounts = computeAccountBalances(accounts, transactions);

  // Modals state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accNome, setAccNome] = useState('');
  const [accTipo, setAccTipo] = useState<Account['tipo']>('corrente');
  const [accInstituicao, setAccInstituicao] = useState('');
  const [accSaldoInicial, setAccSaldoInicial] = useState('0');
  const [accCor, setAccCor] = useState('#8B5CF6');

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [cardNome, setCardNome] = useState('');
  const [cardLimite, setCardLimite] = useState('5000');
  const [cardFechamento, setCardFechamento] = useState('5');
  const [cardVencimento, setCardVencimento] = useState('12');
  const [cardBandeira, setCardBandeira] = useState('Mastercard');
  const [cardDigitos, setCardDigitos] = useState('1234');
  const [cardCor, setCardCor] = useState('#1E293B');

  const openNewAccount = () => {
    setEditingAccount(null);
    setAccNome('');
    setAccTipo('corrente');
    setAccInstituicao('');
    setAccSaldoInicial('0');
    setAccCor('#8B5CF6');
    setIsAccountModalOpen(true);
  };

  const openEditAccount = (acc: Account) => {
    setEditingAccount(acc);
    setAccNome(acc.nome);
    setAccTipo(acc.tipo);
    setAccInstituicao(acc.instituicao);
    setAccSaldoInicial(acc.saldoInicial.toString());
    setAccCor(acc.cor);
    setIsAccountModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const saldo = parseFloat(accSaldoInicial.replace(',', '.')) || 0;
    const account: Account = {
      id: editingAccount ? editingAccount.id : `acc-${Date.now()}`,
      nome: accNome.trim() || 'Nova Conta',
      tipo: accTipo,
      instituicao: accInstituicao.trim() || 'Banco',
      saldoInicial: saldo,
      cor: accCor,
    };
    onSaveAccount(account);
    setIsAccountModalOpen(false);
  };

  const openNewCard = () => {
    setEditingCard(null);
    setCardNome('');
    setCardLimite('5000');
    setCardFechamento('5');
    setCardVencimento('12');
    setCardBandeira('Mastercard Platinum');
    setCardDigitos('9999');
    setCardCor('#1E293B');
    setIsCardModalOpen(true);
  };

  const openEditCard = (card: CreditCard) => {
    setEditingCard(card);
    setCardNome(card.nome);
    setCardLimite(card.limiteTotal.toString());
    setCardFechamento(card.diaFechamento.toString());
    setCardVencimento(card.diaVencimento.toString());
    setCardBandeira(card.bandeira);
    setCardDigitos(card.ultimosDigitos);
    setCardCor(card.cor);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    const lim = parseFloat(cardLimite.replace(',', '.')) || 1000;
    const fech = parseInt(cardFechamento, 10) || 5;
    const venc = parseInt(cardVencimento, 10) || 12;

    const card: CreditCard = {
      id: editingCard ? editingCard.id : `card-${Date.now()}`,
      nome: cardNome.trim() || 'Novo Cartão',
      limiteTotal: lim,
      diaFechamento: Math.min(31, Math.max(1, fech)),
      diaVencimento: Math.min(31, Math.max(1, venc)),
      bandeira: cardBandeira.trim() || 'Mastercard',
      ultimosDigitos: cardDigitos.slice(-4) || '0000',
      cor: cardCor,
    };
    onSaveCard(card);
    setIsCardModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* SECTION: Contas Bancárias */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
              Contas & Carteiras
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Saldo consolidado em contas correntes, investimentos e dinheiro físico
            </p>
          </div>
          <button
            onClick={openNewAccount}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Conta
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {computedAccounts.map((acc) => {
            const saldo = acc.saldoAtual !== undefined ? acc.saldoAtual : acc.saldoInicial;
            const isNegative = saldo < 0;

            return (
              <div
                key={acc.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs relative flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: acc.cor }}
                      >
                        <Landmark className="w-3.5 h-3.5" />
                      </div>
                      <div className="leading-tight">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[130px]">
                          {acc.nome}
                        </h4>
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          {acc.instituicao}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditAccount(acc)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                        title="Editar conta"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {accounts.length > 1 && (
                        <button
                          onClick={() => onDeleteAccount(acc.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                          title="Excluir conta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                      Saldo Atual
                    </span>
                    <p
                      className={`text-lg font-bold font-mono tabular-nums ${
                        isNegative ? 'text-rose-600' : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {formatCurrency(saldo)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="capitalize">{acc.tipo}</span>
                  <span>Saldo base: {formatCurrency(acc.saldoInicial)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: Cartões de Crédito */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
              Cartões de Crédito
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Controle de faturas abertas, limite disponível e datas de vencimento
            </p>
          </div>
          <button
            onClick={openNewCard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Cartão
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
            Nenhum cartão cadastrado. Clique no botão acima para cadastrar seu primeiro cartão de crédito.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card) => {
              const invoiceAmount = computeCreditCardInvoice(card.id, transactions);
              const availableLimit = Math.max(0, card.limiteTotal - invoiceAmount);
              const limitUsagePct = Math.min(
                100,
                Math.round((invoiceAmount / (card.limiteTotal || 1)) * 100)
              );

              return (
                <div
                  key={card.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs relative flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                >
                  <div>
                    {/* Visual Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: card.cor }}
                        >
                          <CardIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {card.nome}
                          </h4>
                          <span className="text-[11px] text-neutral-400">
                            •••• {card.ultimosDigitos} · {card.bandeira}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditCard(card)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                          title="Editar cartão"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCard(card.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                          title="Excluir cartão"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Invoice & Limit Values */}
                    <div className="grid grid-cols-2 gap-4 my-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                          Fatura Atual
                        </span>
                        <p className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
                          {formatCurrency(invoiceAmount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                          Disponível
                        </span>
                        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">
                          {formatCurrency(availableLimit)}
                        </p>
                      </div>
                    </div>

                    {/* Limit Progress Bar */}
                    <div className="my-2">
                      <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
                        <span>Uso do Limite ({limitUsagePct}%)</span>
                        <span className="font-mono tabular-nums">
                          Total: {formatCurrency(card.limiteTotal)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            limitUsagePct > 85
                              ? 'bg-rose-500'
                              : limitUsagePct > 60
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${limitUsagePct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Dates & Pay Invoice Action */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-500">
                      Fecha dia <strong>{card.diaFechamento}</strong> · Vence dia <strong>{card.diaVencimento}</strong>
                    </span>
                    {onQuickPayInvoice && invoiceAmount > 0 && (
                      <button
                        onClick={() => onQuickPayInvoice(card, invoiceAmount)}
                        className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
                      >
                        <DollarSign className="w-3 h-3" /> Pagar Fatura
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Adicionar / Editar Conta */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title={editingAccount ? 'Editar Conta' : 'Nova Conta Bancária'}
        description="Configure conta corrente, investimento ou reserva."
      >
        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Nome da Conta *
            </label>
            <input
              type="text"
              required
              value={accNome}
              onChange={(e) => setAccNome(e.target.value)}
              placeholder="Ex: Nubank Principal, Reserva Tesouro..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Instituição
              </label>
              <input
                type="text"
                value={accInstituicao}
                onChange={(e) => setAccInstituicao(e.target.value)}
                placeholder="Ex: Itaú, XP, Nubank..."
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Tipo
              </label>
              <select
                value={accTipo}
                onChange={(e) => setAccTipo(e.target.value as Account['tipo'])}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="corrente">Conta Corrente</option>
                <option value="investimento">Investimento</option>
                <option value="poupanca">Poupança</option>
                <option value="carteira">Carteira / Dinheiro</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Saldo Inicial (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={accSaldoInicial}
                onChange={(e) => setAccSaldoInicial(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Cor de Identificação
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accCor}
                  onChange={(e) => setAccCor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-neutral-300 dark:border-neutral-700 p-0.5 bg-transparent"
                />
                <span className="text-xs text-neutral-500 font-mono">{accCor}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              {editingAccount ? 'Salvar Conta' : 'Criar Conta'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Adicionar / Editar Cartão */}
      <Modal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        title={editingCard ? 'Editar Cartão' : 'Novo Cartão de Crédito'}
        description="Configure limites e datas de corte e vencimento."
      >
        <form onSubmit={handleSaveCard} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Nome do Cartão *
            </label>
            <input
              type="text"
              required
              value={cardNome}
              onChange={(e) => setCardNome(e.target.value)}
              placeholder="Ex: Nubank Ultravioleta, XP Infinite..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Bandeira / Modelo
              </label>
              <input
                type="text"
                value={cardBandeira}
                onChange={(e) => setCardBandeira(e.target.value)}
                placeholder="Ex: Mastercard Black, Visa..."
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Últimos 4 Dígitos
              </label>
              <input
                type="text"
                maxLength={4}
                value={cardDigitos}
                onChange={(e) => setCardDigitos(e.target.value)}
                placeholder="Ex: 8492"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Limite Total (R$)
              </label>
              <input
                type="number"
                step="50"
                min="100"
                value={cardLimite}
                onChange={(e) => setCardLimite(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Dia Fechamento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={cardFechamento}
                onChange={(e) => setCardFechamento(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Dia Vencimento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={cardVencimento}
                onChange={(e) => setCardVencimento(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsCardModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              {editingCard ? 'Salvar Cartão' : 'Criar Cartão'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
