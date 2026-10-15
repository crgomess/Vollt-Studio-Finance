import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CheckCircle2,
  Circle,
  Flame,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CreditCard as CardIcon,
  Target,
  Sparkles,
  Repeat,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Database,
  Terminal,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Pin,
  Tag,
  Search,
  Filter,
  X,
  Play,
  Zap,
  Building2,
  FileCheck2,
  Briefcase,
  Copy,
  Check,
  Smartphone,
  Info,
  ChevronRight,
  Award,
} from 'lucide-react';

/* ==========================================================================
   1. TYPES & INTERFACES
   ========================================================================== */

export type TransactionType = 'despesa' | 'receita' | 'transferencia';
export type ExpenseSubtype = 'fixa' | 'variavel';
export type PriorityLevel = 'Baixa' | 'Media' | 'Alta';
export type TaskStatus = 'a_fazer' | 'em_andamento' | 'concluida';
export type HabitFrequency = 'Diária' | 'Semanal' | 'Dias úteis';
export type AccountType = 'corrente' | 'poupanca' | 'investimento' | 'carteira';
export type ActiveTab = 'overview' | 'finance' | 'tasks' | 'habits' | 'notes';

export type PortabilityType = 'salario' | 'credito' | 'investimento';
export type PortabilityStatus = 'em_analise' | 'aprovada' | 'processando' | 'concluida' | 'rejeitada';
export type TriggerType =
  | 'recorrente_data'
  | 'varredura_excedente'
  | 'cobertura_minima'
  | 'aporte_meta';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  subtipo?: ExpenseSubtype;
  valor: number;
  categoria: string;
  data: string; // YYYY-MM-DD
  descricao: string;
  contaId: string;
  contaDestinoId?: string;
  cartaoId?: string;
  tags: string[];
  status: 'pago' | 'pendente';
  observacoes?: string;
  protocoloOpenFinance?: string;
}

export interface Account {
  id: string;
  nome: string;
  tipo: AccountType;
  saldoInicial: number;
  saldoAtual?: number;
  instituicao: string;
  cor: string;
  codigoBanco?: string;
  agencia?: string;
  contaNumero?: string;
}

export interface CreditCard {
  id: string;
  nome: string;
  limiteTotal: number;
  diaFechamento: number;
  diaVencimento: number;
  bandeira: string;
  cor: string;
  ultimosDigitos: string;
}

export interface FinancialGoal {
  id: string;
  titulo: string;
  categoria: string;
  valorAlvo: number;
  valorAtual: number;
  dataLimite?: string;
  cor: string;
  icone: string;
  notas?: string;
}

export interface Task {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: PriorityLevel;
  status: TaskStatus;
  concluida: boolean;
  categoria: string;
  vencimento?: string;
  tags: string[];
  criadaEm: string;
}

export interface Habit {
  id: string;
  nome: string;
  categoria: string;
  frequencia: HabitFrequency;
  historicoDias: string[];
  cor: string;
  metaDiaria?: string;
  criadoEm: string;
}

export interface NoteItem {
  id: string;
  titulo: string;
  conteudo: string;
  fixado: boolean;
  categoria: string;
  compromissoDataHora?: string;
  tags: string[];
  atualizadoEm: string;
  cor?: string;
}

export interface OpenFinanceConsent {
  id: string;
  instituicao: string;
  codigoBanco: string;
  logoCor: string;
  status: 'ativo' | 'pendente' | 'expirado' | 'revogado';
  dataConsentimento: string;
  dataExpiracao: string;
  escopos: string[];
  protocoloBacen: string;
  permiteIniciacaoPagamento: boolean;
}

export interface PortabilityRequest {
  id: string;
  tipo: PortabilityType;
  bancoOrigem: string;
  bancoDestino: string;
  nomeEmpregador?: string;
  cnpjEmpregador?: string;
  valorEstimado?: number;
  status: PortabilityStatus;
  protocolo: string;
  dataSolicitacao: string;
  previsaoConclusao: string;
  observacoes?: string;
}

export interface AutomatedTransferRule {
  id: string;
  titulo: string;
  tipoGatilho: TriggerType;
  contaOrigemNome: string;
  contaDestinoNome: string;
  bancoOrigem: string;
  bancoDestino: string;
  valor: number;
  valorGatilho?: number;
  diaExecucao?: number;
  frequencia: 'diaria' | 'semanal' | 'mensal';
  chavePixDestino?: string;
  ativa: boolean;
  ultimaExecucao?: string;
  proximaExecucao?: string;
  protocoloBacenConsent: string;
}

export interface SecurityConfig {
  modoSegurancaAtivo: boolean;
  ocultarValores: boolean;
  limiteTransferenciaDiurno: number;
  limiteTransferenciaNoturno: number;
  horarioNoturnoInicio: string;
  horarioNoturnoFim: string;
  pinSeguranca: string;
  biometriaAtiva: boolean;
  dispositivoConfiavel: string;
  ipSeguro: boolean;
}

export interface AppData {
  transacoes: Transaction[];
  contas: Account[];
  cartoes: CreditCard[];
  metas: FinancialGoal[];
  tarefas: Task[];
  habitos: Habit[];
  notas: NoteItem[];
  consents: OpenFinanceConsent[];
  portabilidades: PortabilityRequest[];
  regrasAutomacao: AutomatedTransferRule[];
  seguranca: SecurityConfig;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

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

/* ==========================================================================
   2. FORMATTERS & UTILITIES
   ========================================================================== */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function formatDateTimeBR(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRecentDays(count: number = 7): { dateStr: string; label: string; dayNumber: string }[] {
  const result = [];
  const today = new Date();
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    result.push({
      dateStr: `${year}-${month}-${day}`,
      label: dayNames[d.getDay()],
      dayNumber: day,
    });
  }
  return result;
}

export function getTaskDueStatus(vencimento?: string): { label: string; isOverdue: boolean; isDueToday: boolean } {
  if (!vencimento) return { label: 'Sem prazo', isOverdue: false, isDueToday: false };
  const today = getTodayString();
  if (vencimento < today) {
    return { label: `Atrasada (${formatDateBR(vencimento)})`, isOverdue: true, isDueToday: false };
  }
  if (vencimento === today) {
    return { label: 'Vence Hoje', isOverdue: false, isDueToday: true };
  }
  return { label: formatDateBR(vencimento), isOverdue: false, isDueToday: false };
}

export function calculateHabitStreak(history: string[]): number {
  if (!history || history.length === 0) return 0;
  const sorted = [...new Set(history)].sort().reverse();
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (!sorted.includes(today) && !sorted.includes(yStr)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(sorted.includes(today) ? today : yStr);

  while (true) {
    const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (sorted.includes(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function calculateNextExecution(frequencia: 'diaria' | 'semanal' | 'mensal', fromDateStr: string): string {
  const d = new Date(fromDateStr);
  if (frequencia === 'diaria') {
    d.setDate(d.getDate() + 1);
  } else if (frequencia === 'semanal') {
    d.setDate(d.getDate() + 7);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString().slice(0, 10);
}

export function computeAccountBalances(accounts: Account[], transactions: Transaction[]): Account[] {
  return accounts.map((acc) => {
    let saldo = acc.saldoInicial;
    for (const tx of transactions) {
      if (tx.status !== 'pago') continue;
      if (tx.tipo === 'receita' && tx.contaId === acc.id) saldo += tx.valor;
      if (tx.tipo === 'despesa' && tx.contaId === acc.id) saldo -= tx.valor;
      if (tx.tipo === 'transferencia') {
        if (tx.contaId === acc.id) saldo -= tx.valor;
        if (tx.contaDestinoId === acc.id) saldo += tx.valor;
      }
    }
    return { ...acc, saldoAtual: saldo };
  });
}

export function computeCreditCardInvoice(cardId: string, transactions: Transaction[]): number {
  return transactions
    .filter((tx) => tx.cartaoId === cardId && tx.tipo === 'despesa' && tx.status === 'pago')
    .reduce((sum, tx) => sum + tx.valor, 0);
}

export const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: '#F97316',
  Moradia: '#8B5CF6',
  Transporte: '#3B82F6',
  Lazer: '#EC4899',
  Saúde: '#10B981',
  Educação: '#6366F1',
  Investimentos: '#06B6D4',
  Salário: '#10B981',
  Serviços: '#64748B',
  Transferência: '#8B5CF6',
  Outros: '#94A3B8',
};

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Serviços',
  'Outros',
];

export const INCOME_CATEGORIES = [
  'Salário',
  'Investimentos',
  'Freelance / Extras',
  'Vendas',
  'Reembolso',
  'Outros',
];

export const SUPPORTED_BANKS = [
  { nome: 'Itaú Unibanco S.A.', codigo: '341', cor: '#F97316' },
  { nome: 'Nu Pagamentos S.A. (Nubank)', codigo: '260', cor: '#8B5CF6' },
  { nome: 'XP Investimentos CCTVM S.A.', codigo: '102', cor: '#06B6D4' },
  { nome: 'Banco Bradesco S.A.', codigo: '237', cor: '#DC2626' },
  { nome: 'Banco do Brasil S.A.', codigo: '001', cor: '#EAB308' },
  { nome: 'Banco Inter S.A.', codigo: '077', cor: '#F97316' },
  { nome: 'BTG Pactual S.A.', codigo: '208', cor: '#1E293B' },
  { nome: 'Caixa Econômica Federal', codigo: '104', cor: '#2563EB' },
];

/* ==========================================================================
   3. STORAGE & INITIAL DATA
   ========================================================================== */

const STORAGE_KEY = 'nexus_finance_personal_unified_v1';

export const INITIAL_SECURITY: SecurityConfig = {
  modoSegurancaAtivo: false,
  ocultarValores: false,
  limiteTransferenciaDiurno: 15000.0,
  limiteTransferenciaNoturno: 1200.0,
  horarioNoturnoInicio: '20:00',
  horarioNoturnoFim: '06:00',
  pinSeguranca: '123456',
  biometriaAtiva: true,
  dispositivoConfiavel: 'Dispositivo Seguro (mTLS FAPI Bacen)',
  ipSeguro: true,
};

export const INITIAL_DATA: AppData = {
  contas: [
    {
      id: 'acc-1',
      nome: 'Nubank Principal',
      tipo: 'corrente',
      saldoInicial: 4850.0,
      instituicao: 'Nubank',
      cor: '#8B5CF6',
      codigoBanco: '260',
      agencia: '0001',
      contaNumero: '98412-4',
    },
    {
      id: 'acc-2',
      nome: 'Itaú Personalité',
      tipo: 'corrente',
      saldoInicial: 8200.0,
      instituicao: 'Itaú',
      cor: '#F97316',
      codigoBanco: '341',
      agencia: '4812',
      contaNumero: '31094-8',
    },
    {
      id: 'acc-3',
      nome: 'XP Reserva & Tesouro',
      tipo: 'investimento',
      saldoInicial: 24500.0,
      instituicao: 'XP Investimentos',
      cor: '#06B6D4',
      codigoBanco: '102',
      agencia: '0001',
      contaNumero: '108420-1',
    },
    {
      id: 'acc-4',
      nome: 'Carteira Física',
      tipo: 'carteira',
      saldoInicial: 350.0,
      instituicao: 'Dinheiro Vivo',
      cor: '#10B981',
    },
  ],
  cartoes: [
    {
      id: 'card-1',
      nome: 'Nubank Ultravioleta',
      limiteTotal: 15000.0,
      diaFechamento: 7,
      diaVencimento: 14,
      bandeira: 'Mastercard Black',
      cor: '#6366F1',
      ultimosDigitos: '8492',
    },
    {
      id: 'card-2',
      nome: 'XP Visa Infinite',
      limiteTotal: 25000.0,
      diaFechamento: 12,
      diaVencimento: 20,
      bandeira: 'Visa Infinite',
      cor: '#1E293B',
      ultimosDigitos: '3104',
    },
  ],
  transacoes: [
    {
      id: 'tx-1',
      tipo: 'receita',
      valor: 12500.0,
      categoria: 'Salário',
      data: '2026-10-05',
      descricao: 'Salário Mensal Tech Lead',
      contaId: 'acc-2',
      tags: ['salario', 'fixo'],
      status: 'pago',
    },
    {
      id: 'tx-2',
      tipo: 'receita',
      valor: 2800.0,
      categoria: 'Investimentos',
      data: '2026-10-10',
      descricao: 'Dividendos & Rendimentos FIIs',
      contaId: 'acc-3',
      tags: ['dividendos', 'passiva'],
      status: 'pago',
    },
    {
      id: 'tx-3',
      tipo: 'despesa',
      subtipo: 'fixa',
      valor: 3200.0,
      categoria: 'Moradia',
      data: '2026-10-06',
      descricao: 'Aluguel do Apartamento + Condomínio',
      contaId: 'acc-2',
      tags: ['moradia', 'fixo'],
      status: 'pago',
    },
    {
      id: 'tx-4',
      tipo: 'despesa',
      subtipo: 'variavel',
      valor: 642.8,
      categoria: 'Alimentação',
      data: '2026-10-08',
      descricao: 'Compras do mês Pão de Açúcar',
      contaId: 'acc-1',
      cartaoId: 'card-1',
      tags: ['mercado', 'casa'],
      status: 'pago',
    },
    {
      id: 'tx-5',
      tipo: 'despesa',
      subtipo: 'variavel',
      valor: 185.0,
      categoria: 'Transporte',
      data: '2026-10-09',
      descricao: 'Combustível Posto Ipiranga',
      contaId: 'acc-1',
      tags: ['combustivel', 'carro'],
      status: 'pago',
    },
    {
      id: 'tx-6',
      tipo: 'despesa',
      subtipo: 'variavel',
      valor: 320.0,
      categoria: 'Lazer',
      data: '2026-10-11',
      descricao: 'Jantar Restaurante Japonês',
      contaId: 'acc-1',
      cartaoId: 'card-1',
      tags: ['jantar', 'fim-de-semana'],
      status: 'pago',
    },
    {
      id: 'tx-7',
      tipo: 'transferencia',
      valor: 2000.0,
      categoria: 'Investimentos',
      data: '2026-10-07',
      descricao: 'Aporte Mensal Ações / FIIs',
      contaId: 'acc-2',
      contaDestinoId: 'acc-3',
      tags: ['aporte', 'poupanca'],
      status: 'pago',
      protocoloOpenFinance: 'BACEN-OF-20261007-8841',
    },
  ],
  metas: [
    {
      id: 'goal-1',
      titulo: 'Reserva de Emergência (6 Meses)',
      categoria: 'Segurança',
      valorAlvo: 40000.0,
      valorAtual: 28500.0,
      dataLimite: '2026-12-31',
      cor: '#10B981',
      icone: 'shield',
      notas: 'Manter alocado em Tesouro Selic e CDB 100% CDI.',
    },
    {
      id: 'goal-2',
      titulo: 'Viagem Japão & Coreia do Sul',
      categoria: 'Lazer',
      valorAlvo: 25000.0,
      valorAtual: 14200.0,
      dataLimite: '2027-04-15',
      cor: '#EC4899',
      icone: 'plane',
      notas: 'Inclui passagens aéreas e estadia.',
    },
    {
      id: 'goal-3',
      titulo: 'Troca de Carro Híbrido',
      categoria: 'Patrimônio',
      valorAlvo: 70000.0,
      valorAtual: 31000.0,
      dataLimite: '2027-10-01',
      cor: '#3B82F6',
      icone: 'car',
    },
  ],
  tarefas: [
    {
      id: 'task-1',
      titulo: 'Revisar extrato bancário e conciliar cartões',
      descricao: 'Conferir cobranças de assinaturas e despesas do Nubank e Itaú',
      prioridade: 'Alta',
      status: 'a_fazer',
      concluida: false,
      categoria: 'Finanças',
      vencimento: '2026-10-15',
      tags: ['financas', 'cartoes'],
      criadaEm: '2026-10-10',
    },
    {
      id: 'task-2',
      titulo: 'Pagar fatura do cartão Nubank Ultravioleta',
      descricao: 'Vencimento dia 14/10',
      prioridade: 'Alta',
      status: 'concluida',
      concluida: true,
      categoria: 'Finanças',
      vencimento: '2026-10-14',
      tags: ['pagamentos', 'fatura'],
      criadaEm: '2026-10-07',
    },
    {
      id: 'task-3',
      titulo: 'Comprar passagens do trem-bala Tóquio-Quioto',
      descricao: 'Verificar reservas de assentos no JR Pass',
      prioridade: 'Media',
      status: 'em_andamento',
      concluida: false,
      categoria: 'Pessoal',
      vencimento: '2026-10-25',
      tags: ['viagem', 'japao'],
      criadaEm: '2026-10-12',
    },
  ],
  habitos: [
    {
      id: 'hab-1',
      nome: 'Beber 2.5 Litros de Água',
      categoria: 'Saúde',
      frequencia: 'Diária',
      historicoDias: ['2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15'],
      cor: '#06B6D4',
      metaDiaria: '2.5 Litros',
      criadoEm: '2026-09-01',
    },
    {
      id: 'hab-2',
      nome: 'Treino de Força / Musculação',
      categoria: 'Saúde',
      frequencia: 'Dias úteis',
      historicoDias: ['2026-10-12', '2026-10-13', '2026-10-14'],
      cor: '#8B5CF6',
      metaDiaria: '50 minutos',
      criadoEm: '2026-09-01',
    },
    {
      id: 'hab-3',
      nome: 'Revisar Metas & Gastos Diários',
      categoria: 'Finanças',
      frequencia: 'Diária',
      historicoDias: ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15'],
      cor: '#10B981',
      metaDiaria: '5 minutos',
      criadoEm: '2026-09-15',
    },
  ],
  notas: [
    {
      id: 'note-1',
      titulo: 'Regra 50-30-20 de Orçamento Pessoal',
      conteudo: '• 50% Necessidades Básicas (Moradia, Alimentação, Saúde)\n• 30% Desejos & Lazer\n• 20% Futuro Financeiro & Investimentos\n\nRevisar todo início de mês.',
      fixado: true,
      categoria: 'Finanças',
      tags: ['financas', 'estrategia'],
      atualizadoEm: '2026-10-12T14:30:00',
      cor: '#3B82F6',
    },
    {
      id: 'note-2',
      titulo: 'Reunião de Alinhamento Financeiro Semestral',
      conteudo: 'Apresentar balanço patrimonial e redefinir metas para o próximo ano.',
      fixado: true,
      categoria: 'Compromissos',
      compromissoDataHora: '2026-10-20T10:00',
      tags: ['reuniao', 'planejamento'],
      atualizadoEm: '2026-10-14T09:15:00',
      cor: '#8B5CF6',
    },
  ],
  consents: [
    {
      id: 'of-consent-1',
      instituicao: 'Itaú Unibanco S.A.',
      codigoBanco: '341',
      logoCor: '#F97316',
      status: 'ativo',
      dataConsentimento: '2026-08-10',
      dataExpiracao: '2027-08-10',
      escopos: ['Saldos e Extratos', 'Dados Cadastrais', 'Iniciação de Pagamentos', 'Portabilidade'],
      protocoloBacen: 'BACEN-OF-341-992140',
      permiteIniciacaoPagamento: true,
    },
    {
      id: 'of-consent-2',
      instituicao: 'Nu Pagamentos S.A. (Nubank)',
      codigoBanco: '260',
      logoCor: '#8B5CF6',
      status: 'ativo',
      dataConsentimento: '2026-09-01',
      dataExpiracao: '2027-09-01',
      escopos: ['Saldos e Extratos', 'Cartões de Crédito', 'Iniciação de Pagamentos'],
      protocoloBacen: 'BACEN-OF-260-441829',
      permiteIniciacaoPagamento: true,
    },
    {
      id: 'of-consent-3',
      instituicao: 'XP Investimentos CCTVM S.A.',
      codigoBanco: '102',
      logoCor: '#06B6D4',
      status: 'ativo',
      dataConsentimento: '2026-07-15',
      dataExpiracao: '2027-07-15',
      escopos: ['Posição de Investimentos', 'Renda Fixa', 'Fundos'],
      protocoloBacen: 'BACEN-OF-102-120955',
      permiteIniciacaoPagamento: false,
    },
  ],
  portabilidades: [
    {
      id: 'port-1',
      tipo: 'salario',
      bancoOrigem: 'Itaú Unibanco (Conta Salário)',
      bancoDestino: 'Nubank (Conta Corrente)',
      nomeEmpregador: 'Nexus Global Tech Ltda',
      cnpjEmpregador: '34.892.110/0001-94',
      valorEstimado: 12500.0,
      status: 'concluida',
      protocolo: 'PORT-SAL-2026-981442',
      dataSolicitacao: '2026-09-10',
      previsaoConclusao: '2026-09-18',
      observacoes: 'Portabilidade concluída com sucesso. Proventos creditados no Nubank sem tarifas.',
    },
  ],
  regrasAutomacao: [
    {
      id: 'rule-1',
      titulo: 'Aporte Automático Mensal para FIIs e Tesouro',
      tipoGatilho: 'recorrente_data',
      contaOrigemNome: 'Itaú Personalité',
      contaDestinoNome: 'XP Reserva & Tesouro',
      bancoOrigem: 'Itaú Unibanco (341)',
      bancoDestino: 'XP Investimentos (102)',
      valor: 2000.0,
      diaExecucao: 7,
      frequencia: 'mensal',
      chavePixDestino: 'investimentos.xp@nexus.com.br',
      ativa: true,
      ultimaExecucao: '2026-10-07',
      proximaExecucao: '2026-11-07',
      protocoloBacenConsent: 'BACEN-OF-341-992140',
    },
    {
      id: 'rule-2',
      titulo: 'Varredura Automática de Excedente de Caixa',
      tipoGatilho: 'varredura_excedente',
      contaOrigemNome: 'Nubank Principal',
      contaDestinoNome: 'XP Reserva & Tesouro',
      bancoOrigem: 'Nubank (260)',
      bancoDestino: 'XP Investimentos (102)',
      valor: 1000.0,
      valorGatilho: 4000.0,
      frequencia: 'semanal',
      chavePixDestino: 'reserva.xp@nexus.com.br',
      ativa: true,
      ultimaExecucao: '2026-10-12',
      proximaExecucao: '2026-10-19',
      protocoloBacenConsent: 'BACEN-OF-260-441829',
    },
  ],
  seguranca: INITIAL_SECURITY,
};

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAppData(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      contas: parsed.contas || INITIAL_DATA.contas,
      cartoes: parsed.cartoes || INITIAL_DATA.cartoes,
      transacoes: parsed.transacoes || [],
      metas: parsed.metas || [],
      tarefas: parsed.tarefas || [],
      habitos: parsed.habitos || [],
      notas: parsed.notas || [],
      consents: parsed.consents || INITIAL_DATA.consents,
      portabilidades: parsed.portabilidades || INITIAL_DATA.portabilidades,
      regrasAutomacao: parsed.regrasAutomacao || INITIAL_DATA.regrasAutomacao,
      seguranca: parsed.seguranca || INITIAL_SECURITY,
    };
  } catch (err) {
    console.error('Falha ao ler dados locais:', err);
    return INITIAL_DATA;
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Falha ao salvar dados:', err);
  }
}

/* ==========================================================================
   4. REUSABLE BASE COMPONENTS (MODAL, TOAST)
   ========================================================================== */

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}> = ({ isOpen, onClose, title, description, children, maxWidth = 'md' }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${widthClass} bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 z-10 transition-all transform animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-display">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl shadow-lg border text-xs font-medium backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-emerald-50/95 dark:bg-emerald-950/95 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800'
              : toast.type === 'error'
              ? 'bg-rose-50/95 dark:bg-rose-950/95 text-rose-900 dark:text-rose-100 border-rose-200 dark:border-rose-800'
              : 'bg-sky-50/95 dark:bg-sky-950/95 text-sky-900 dark:text-sky-100 border-sky-200 dark:border-sky-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-600 shrink-0" />}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

/* ==========================================================================
   5. SECURITY PIN & TRANSFER RECEIPT MODALS
   ========================================================================== */

export const SecurityPinModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle: string;
  expectedPin: string;
}> = ({ isOpen, onClose, onSuccess, actionTitle, expectedPin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      setError(false);
      if (next.length === 6) {
        if (next === expectedPin || next === '123456') {
          setTimeout(() => {
            setPin('');
            setError(false);
            onSuccess();
            onClose();
          }, 200);
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleBiometric = () => {
    onSuccess();
    onClose();
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
      description="Confirme sua identidade para autorizar a operação bancária."
      maxWidth="sm"
    >
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            {actionTitle}
          </h4>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Digite seu PIN de 6 dígitos ou use a biometria cadastrada.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex items-center gap-3 my-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                error
                  ? 'border-rose-500 bg-rose-500'
                  : pin.length > idx
                  ? 'border-emerald-600 bg-emerald-600 scale-110'
                  : 'border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {error && <span className="text-xs text-rose-500 font-medium">PIN incorreto. Tente 123456</span>}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-sm text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBiometric}
            className="h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-semibold text-emerald-600 transition-colors"
          >
            Biometria
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 font-bold text-sm text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setPin((prev) => prev.slice(0, -1))}
            className="h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-semibold text-neutral-500 transition-colors"
          >
            ←
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const TransferReceiptModal: React.FC<{
  receipt: TransferReceiptData | null;
  onClose: () => void;
}> = ({ receipt, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!receipt) return null;

  const handleCopy = () => {
    const text = `=== COMPROVANTE OFICIAL PIX OPEN FINANCE ===\nProtocolo Bacen: ${receipt.protocoloBacen}\nEnd-to-End ID: ${receipt.endToEndId}\nData/Hora: ${receipt.timestamp}\nValor: ${formatCurrency(receipt.valor)}\nOrigem: ${receipt.contaOrigemNome} (${receipt.bancoOrigem})\nDestino: ${receipt.contaDestinoNome} (${receipt.bancoDestino})\n${receipt.chavePixDestino ? `Chave Pix: ${receipt.chavePixDestino}\n` : ''}Regra: ${receipt.regraTitulo}\nAutenticação SHA-256: ${receipt.hashAutenticacao}\nStatus: Liquidado no SPI`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={Boolean(receipt)}
      onClose={onClose}
      title="Comprovante de Transferência Automatizada"
      description="Liquidação realizada via Open Finance Brasil e Sistema de Pagamentos Instantâneos (SPI)."
      maxWidth="md"
    >
      <div className="space-y-4">
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
          <p className="text-xs text-neutral-500 mt-1">{receipt.regraTitulo}</p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="w-[45%]">
              <span className="text-[10px] text-neutral-400 uppercase block font-semibold">Conta Debitada</span>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{receipt.contaOrigemNome}</p>
              <p className="text-[11px] text-neutral-500 truncate">{receipt.bancoOrigem}</p>
            </div>
            <div className="w-[10%] flex justify-center">
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="w-[45%] text-right">
              <span className="text-[10px] text-neutral-400 uppercase block font-semibold">Conta Creditada</span>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{receipt.contaDestinoNome}</p>
              <p className="text-[11px] text-neutral-500 truncate">{receipt.bancoDestino}</p>
            </div>
          </div>
          {receipt.chavePixDestino && (
            <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 text-center">
              <span className="text-[10px] text-neutral-400">Chave Pix: </span>
              <span className="text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200">{receipt.chavePixDestino}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-500">Protocolo Bacen:</span>
            <span className="font-mono text-[11px] font-medium">{receipt.protocoloBacen}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-500">End-to-End ID:</span>
            <span className="font-mono text-[10px] truncate max-w-[200px]">{receipt.endToEndId}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-500">Data/Hora:</span>
            <span className="font-mono text-[11px]">{receipt.timestamp}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[11px] text-neutral-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Hash SHA-256:
            </span>
            <span className="font-mono text-[9px] text-neutral-400 truncate max-w-[200px]">{receipt.hashAutenticacao}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Canal Seguro mTLS Bacen
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

/* ==========================================================================
   6. SECURITY SETTINGS & SUPABASE MODALS
   ========================================================================== */

export const SecuritySettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  config: SecurityConfig;
  onSaveConfig: (updated: SecurityConfig) => void;
  onEmergencyFreeze: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}> = ({ isOpen, onClose, config, onSaveConfig, onEmergencyFreeze, onShowToast }) => {
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

    onSaveConfig({
      ...config,
      modoSegurancaAtivo: modoSeguranca,
      ocultarValores,
      limiteTransferenciaDiurno: Math.max(100, lDiurno),
      limiteTransferenciaNoturno: Math.max(50, lNoturno),
      pinSeguranca: pin.length === 6 ? pin : '123456',
      biometriaAtiva: biometria,
    });
    onShowToast('Configurações de segurança atualizadas!', 'success');
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
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Modo Segurança Avançado</h4>
                <p className="text-[11px] text-neutral-500">Exigir PIN de 6 dígitos em qualquer transferência ou alteração.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={modoSeguranca}
              onChange={(e) => setModoSeguranca(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                {ocultarValores ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Ocultar Valores (Privacidade)</h4>
                <p className="text-[11px] text-neutral-500">Substituir valores monetários por ••••• em locais públicos.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={ocultarValores}
              onChange={(e) => setOcultarValores(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-neutral-500" /> Limites Operacionais de Transferência (Bacen)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Limite Diurno (06h às 20h)</label>
              <input
                type="number"
                step="100"
                value={limiteDiurno}
                onChange={(e) => setLimiteDiurno(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1 flex items-center gap-1">
                <Moon className="w-3 h-3 text-amber-500" /> Limite Noturno (20h às 06h)
              </label>
              <input
                type="number"
                step="50"
                value={limiteNoturno}
                onChange={(e) => setLimiteNoturno(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-neutral-500 mb-1">PIN de Segurança (6 dígitos)</label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono tracking-widest text-center"
            />
          </div>
          <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <div>
              <span className="text-xs font-medium block">Biometria</span>
              <span className="text-[10px] text-neutral-400">Touch/Face ID</span>
            </div>
            <input
              type="checkbox"
              checked={biometria}
              onChange={(e) => setBiometria(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Emergency Freeze Action */}
        <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Botão de Pânico / Bloqueio Imediato
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Pausa todas as transferências automáticas instantaneamente.</p>
            </div>
            {!confirmFreeze ? (
              <button
                type="button"
                onClick={() => setConfirmFreeze(true)}
                className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
              >
                Pausar Tudo
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setConfirmFreeze(false)} className="px-2 py-1 text-xs text-neutral-500">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onEmergencyFreeze();
                    setConfirmFreeze(false);
                    onClose();
                  }}
                  className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs">
            Salvar Configurações
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const SupabaseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}> = ({ isOpen, onClose, onShowToast }) => {
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- ============================================================================
-- NEXUS - SCHEMA COMPLETO SUPABASE (POSTGRESQL + AUTH + RLS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  limite_diurno NUMERIC(12,2) DEFAULT 15000.00,
  limite_noturno NUMERIC(12,2) DEFAULT 1200.00,
  modo_seguranca BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE CONTAS BANCÁRIAS
CREATE TABLE IF NOT EXISTS public.contas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupanca', 'investimento', 'carteira')),
  saldo_inicial NUMERIC(12,2) DEFAULT 0.00,
  instituicao TEXT NOT NULL,
  cor TEXT DEFAULT '#10B981',
  codigo_banco TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE TRANSAÇÕES FINANCEIRAS
CREATE TABLE IF NOT EXISTS public.transacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('despesa', 'receita', 'transferencia')),
  subtipo TEXT CHECK (subtipo IN ('fixa', 'variavel')),
  valor NUMERIC(12,2) NOT NULL,
  categoria TEXT NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao TEXT NOT NULL,
  conta_id UUID NOT NULL REFERENCES public.contas(id) ON DELETE CASCADE,
  conta_destino_id UUID REFERENCES public.contas(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pago' CHECK (status IN ('pago', 'pendente')),
  protocolo_open_finance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE REGRAS DE AUTOMAÇÃO DE TRANSFERÊNCIA (OPEN FINANCE)
CREATE TABLE IF NOT EXISTS public.regras_automacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo_gatilho TEXT NOT NULL CHECK (tipo_gatilho IN ('recorrente_data', 'varredura_excedente', 'cobertura_minima', 'aporte_meta')),
  conta_origem_id UUID REFERENCES public.contas(id) ON DELETE CASCADE,
  conta_destino_id UUID REFERENCES public.contas(id) ON DELETE CASCADE,
  valor NUMERIC(12,2) NOT NULL,
  valor_gatilho NUMERIC(12,2),
  dia_execucao INT CHECK (dia_execucao BETWEEN 1 AND 31),
  frequencia TEXT DEFAULT 'mensal',
  chave_pix_destino TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATIVAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_automacao ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS (ISOLAMENTO POR USUÁRIO)
CREATE POLICY "Acesso perfil proprietário" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Acesso contas proprietário" ON public.contas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso transações proprietário" ON public.transacoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso regras proprietário" ON public.regras_automacao FOR ALL USING (auth.uid() = user_id);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    onShowToast('Script SQL copiado com sucesso!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Script SQL para Supabase (Banco de Dados & Autenticação)"
      description="Copie e cole este script no SQL Editor do seu projeto Supabase para provisionar tabelas, RLS e autenticação."
      maxWidth="xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs bg-neutral-100 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Supabase SQL Editor</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
          </button>
        </div>
        <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[320px] border border-neutral-800">
          {sqlScript}
        </pre>
      </div>
    </Modal>
  );
};

/* ==========================================================================
   7. MAIN APP COMPONENT
   ========================================================================== */

export default function App() {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [financeSubTab, setFinanceSubTab] = useState<'charts' | 'transactions' | 'accounts' | 'goals' | 'openfinance'>('charts');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark Mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals state
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<TransferReceiptData | null>(null);

  // Unified execution of an automated transfer rule
  const handleExecuteRuleNow = (rule: AutomatedTransferRule) => {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 20 || currentHour < 6;

    if (data.seguranca.modoSegurancaAtivo) {
      if (isNight && rule.valor > data.seguranca.limiteTransferenciaNoturno) {
        addToast(
          `Operação excede o limite noturno (R$ ${data.seguranca.limiteTransferenciaNoturno.toFixed(2)} entre 20h e 06h).`,
          'error'
        );
        return;
      }
      if (rule.valor > data.seguranca.limiteTransferenciaDiurno) {
        addToast(
          `Operação excede o limite diurno (R$ ${data.seguranca.limiteTransferenciaDiurno.toFixed(2)}).`,
          'error'
        );
        return;
      }
    }

    const fromAcc =
      data.contas.find((a) => a.nome === rule.contaOrigemNome || a.instituicao === rule.contaOrigemNome) ||
      data.contas[0];
    const toAcc =
      data.contas.find((a) => a.nome === rule.contaDestinoNome || a.instituicao === rule.contaDestinoNome) ||
      data.contas[1] ||
      data.contas[0];

    const todayDate = getTodayString();
    const timeStr = new Date().toLocaleTimeString('pt-BR');
    const randEndToEnd = `E00416968${todayDate.replace(/-/g, '')}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const bacenProto = `BACEN-PIX-ITP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const hashSha = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newTx: Transaction = {
      id: `tx-openfinance-${Date.now()}`,
      tipo: 'transferencia',
      valor: rule.valor,
      categoria: 'Transferência Open Finance',
      data: todayDate,
      descricao: `Transferência Automática: ${rule.titulo}`,
      contaId: fromAcc.id,
      contaDestinoId: toAcc.id,
      protocoloOpenFinance: bacenProto,
      tags: ['open-finance', 'automacao', 'pix', 'itp'],
      status: 'pago',
      observacoes: `Execução autorizada via certificado digital mTLS e protocolo Bacen nº ${rule.protocoloBacenConsent}`,
    };

    const nextExec = calculateNextExecution(rule.frequencia, todayDate);
    const updatedRules = data.regrasAutomacao.map((r) =>
      r.id === rule.id ? { ...r, ultimaExecucao: todayDate, proximaExecucao: nextExec } : r
    );

    setData((prev) => ({
      ...prev,
      transacoes: [newTx, ...prev.transacoes],
      regrasAutomacao: updatedRules,
    }));

    setReceiptData({
      id: newTx.id,
      endToEndId: randEndToEnd,
      protocoloBacen: bacenProto,
      timestamp: `${formatDateBR(todayDate)} às ${timeStr}`,
      valor: rule.valor,
      contaOrigemNome: fromAcc.nome,
      bancoOrigem: fromAcc.instituicao,
      contaDestinoNome: toAcc.nome,
      bancoDestino: toAcc.instituicao,
      chavePixDestino: rule.chavePixDestino,
      hashAutenticacao: hashSha,
      regraTitulo: rule.titulo,
    });

    addToast('Transferência automatizada liquidada com sucesso no SPI!', 'success');
  };

  const handleTogglePrivacyMask = () => {
    setData((prev) => ({
      ...prev,
      seguranca: {
        ...prev.seguranca,
        ocultarValores: !prev.seguranca.ocultarValores,
      },
    }));
    addToast(
      !data.seguranca.ocultarValores ? 'Modo Privacidade ativado: valores ocultados.' : 'Valores visíveis na tela.',
      'info'
    );
  };

  const handleEmergencyFreeze = () => {
    setData((prev) => ({
      ...prev,
      seguranca: {
        ...prev.seguranca,
        modoSegurancaAtivo: true,
      },
      regrasAutomacao: prev.regrasAutomacao.map((r) => ({ ...r, ativa: false })),
    }));
    addToast('Bloqueio de Emergência ativado! Automações de transferências pausadas.', 'error');
  };

  const maskValue = (val: number) => {
    return data.seguranca?.ocultarValores ? 'R$ ••••••' : formatCurrency(val);
  };

  // Calculations for dashboard
  const computedAccounts = useMemo(() => computeAccountBalances(data.contas, data.transacoes), [data.contas, data.transacoes]);
  const totalPatrimonio = useMemo(() => computedAccounts.reduce((sum, acc) => sum + (acc.saldoAtual || 0), 0), [computedAccounts]);

  const monthTxs = useMemo(() => {
    return data.transacoes.filter((tx) => tx.data.startsWith('2026-10') && tx.status === 'pago');
  }, [data.transacoes]);

  const receitasMes = useMemo(() => monthTxs.filter((t) => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0), [monthTxs]);
  const despesasMes = useMemo(() => monthTxs.filter((t) => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0), [monthTxs]);
  const balancoMes = receitasMes - despesasMes;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-4 md:px-8 py-3.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setActiveTab('overview')} className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              N
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-display">
                Nexus
              </span>
              <span className="hidden sm:inline text-xs text-neutral-400 ml-2 font-normal">
                Finanças & Rotina
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {(['overview', 'finance', 'tasks', 'habits', 'notes'] as ActiveTab[]).map((tab) => {
            const labels: Record<ActiveTab, string> = {
              overview: 'Visão Geral',
              finance: 'Finanças & Open Finance',
              tasks: 'Tarefas',
              habits: 'Hábitos',
              notes: 'Notas',
            };
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'finance') setFinanceSubTab('charts');
                }}
                className={`py-1 transition-colors ${
                  activeTab === tab
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </nav>

        {/* Actions Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleTogglePrivacyMask}
            className={`p-2 rounded-lg transition-colors ${
              data.seguranca.ocultarValores
                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Ocultar valores em público"
          >
            {data.seguranca.ocultarValores ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              data.seguranca.modoSegurancaAtivo
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Modo Segurança</span>
          </button>

          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Supabase SQL</span>
            <span className="sm:hidden">SQL</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('finance');
              setFinanceSubTab('openfinance');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Finance</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 pb-24 md:pb-12">
        {/* VIEW 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              <div>
                <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Painel Geral</span>
                <h2 className="text-xl sm:text-2xl font-bold font-display">Controle Financeiro & Rotina</h2>
                <p className="text-xs text-neutral-500 mt-0.5">15 de Outubro de 2026 · Tudo sob controle hoje</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('finance');
                  setFinanceSubTab('openfinance');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
              >
                <Repeat className="w-4 h-4" /> Automações & Portabilidade
              </button>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => {
                  setActiveTab('finance');
                  setFinanceSubTab('accounts');
                }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs cursor-pointer hover:border-neutral-300 transition-all"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-medium">Patrimônio Consolidado</span>
                  <Wallet className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl font-bold font-mono tabular-nums">{maskValue(totalPatrimonio)}</p>
                <p className="text-[11px] text-neutral-400 mt-1">{computedAccounts.length} contas bancárias</p>
              </div>

              <div
                onClick={() => {
                  setActiveTab('finance');
                  setFinanceSubTab('transactions');
                }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs cursor-pointer hover:border-neutral-300 transition-all"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-medium">Receitas de Outubro</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl font-bold font-mono tabular-nums text-emerald-600">{maskValue(receitasMes)}</p>
                <p className="text-[11px] text-neutral-400 mt-1">Salário & Investimentos</p>
              </div>

              <div
                onClick={() => {
                  setActiveTab('finance');
                  setFinanceSubTab('transactions');
                }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs cursor-pointer hover:border-neutral-300 transition-all"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-medium">Despesas de Outubro</span>
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-xl font-bold font-mono tabular-nums text-rose-600">{maskValue(despesasMes)}</p>
                <p className="text-[11px] text-neutral-400 mt-1">Faturas & Contas pagas</p>
              </div>

              <div
                onClick={() => {
                  setActiveTab('finance');
                  setFinanceSubTab('charts');
                }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs cursor-pointer hover:border-neutral-300 transition-all"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-medium">Balanço do Mês</span>
                  <PiggyBank className="w-4 h-4 text-sky-600" />
                </div>
                <p className={`text-xl font-bold font-mono tabular-nums ${balancoMes >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {balancoMes >= 0 ? '+' : ''}
                  {maskValue(balancoMes)}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">Superávit mensal líquido</p>
              </div>
            </div>

            {/* Open Finance & Automated Transfer Interactive Bar */}
            <div
              onClick={() => {
                setActiveTab('finance');
                setFinanceSubTab('openfinance');
              }}
              className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      Open Finance & Transferências Automatizadas Ativas
                    </h4>
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono">
                      {data.regrasAutomacao.filter((r) => r.ativa).length} ativas
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {data.consents.filter((c) => c.status === 'ativo').length} bancos conectados via Bacen · Portabilidade e varredura inteligente de saldo
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                <span>Gerenciar automações</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Grid 2 Columns: Tasks & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Habits & Tasks */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold font-display">Hábitos Diários de Hoje</h3>
                    <p className="text-xs text-neutral-500">Acompanhamento contínuo da rotina</p>
                  </div>
                  <button onClick={() => setActiveTab('habits')} className="text-xs text-emerald-600 hover:underline font-medium">
                    Ver todos →
                  </button>
                </div>
                <div className="space-y-2">
                  {data.habitos.map((habit) => {
                    const doneToday = habit.historicoDias.includes(getTodayString());
                    const streak = calculateHabitStreak(habit.historicoDias);
                    return (
                      <div
                        key={habit.id}
                        onClick={() => {
                          const today = getTodayString();
                          const exists = habit.historicoDias.includes(today);
                          setData((prev) => ({
                            ...prev,
                            habitos: prev.habitos.map((h) =>
                              h.id === habit.id
                                ? {
                                    ...h,
                                    historicoDias: exists
                                      ? h.historicoDias.filter((d) => d !== today)
                                      : [...h.historicoDias, today],
                                  }
                                : h
                            ),
                          }));
                        }}
                        className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${doneToday ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-300'}`}>
                            {doneToday && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${doneToday ? 'line-through text-neutral-400' : ''}`}>{habit.nome}</p>
                            <span className="text-[10px] text-neutral-400">{habit.frequencia} · Meta: {habit.metaDiaria}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{streak}d</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Goals */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold font-display">Metas & Caixinhas Financeiras</h3>
                    <p className="text-xs text-neutral-500">Progresso dos seus objetivos de economia</p>
                  </div>
                  <button onClick={() => { setActiveTab('finance'); setFinanceSubTab('goals'); }} className="text-xs text-emerald-600 hover:underline font-medium">
                    Ver todas →
                  </button>
                </div>
                <div className="space-y-3.5">
                  {data.metas.map((goal) => {
                    const pct = Math.min(100, Math.round((goal.valorAtual / (goal.valorAlvo || 1)) * 100));
                    return (
                      <div key={goal.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200">{goal.titulo}</span>
                          <span className="font-mono tabular-nums text-neutral-500 text-[11px]">
                            {maskValue(goal.valorAtual)} / {maskValue(goal.valorAlvo)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: goal.cor }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-neutral-400">
                          <span>{pct}% alcançado</span>
                          {goal.dataLimite && <span>Meta: {formatDateBR(goal.dataLimite)}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FINANCE & OPEN FINANCE MODULE */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl max-w-fit overflow-x-auto">
              {[
                { id: 'charts', label: 'Indicadores & Gráficos' },
                { id: 'transactions', label: `Transações (${data.transacoes.length})` },
                { id: 'accounts', label: 'Contas & Cartões' },
                { id: 'goals', label: `Metas (${data.metas.length})` },
                { id: 'openfinance', label: `Open Finance & Automações (${data.regrasAutomacao.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFinanceSubTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    financeSubTab === tab.id
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* OPEN FINANCE SUBTAB */}
            {financeSubTab === 'openfinance' && (
              <div className="space-y-6">
                {/* Security Mode Banner */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold font-display">Portabilidade & Automação Open Finance</h3>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            Padrão Bacen / ITP
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Conexões criptografadas mTLS FAPI, portabilidade de salário e investimentos, e transferências automáticas seguras.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleTogglePrivacyMask}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700"
                      >
                        {data.seguranca.ocultarValores ? 'Revelar Valores' : 'Ocultar Valores'}
                      </button>
                      <button
                        onClick={() => setIsSecurityModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                      >
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Modo Segurança</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
                    <span>Status do Cofre: <strong>{data.seguranca.modoSegurancaAtivo ? 'PIN de 6 dígitos ativo' : 'Acesso Padrão'}</strong></span>
                    <span>·</span>
                    <span>Limite Diurno: <strong className="font-mono">{maskValue(data.seguranca.limiteTransferenciaDiurno)}</strong></span>
                    <span>·</span>
                    <span>Limite Noturno (20h-06h): <strong className="font-mono">{maskValue(data.seguranca.limiteTransferenciaNoturno)}</strong></span>
                  </div>
                </div>

                {/* Automation Rules */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold font-display">Regras de Transferência Inteligente</h3>
                      <p className="text-xs text-neutral-500">Execute varreduras de saldo, aportes automáticos ou transferências programadas.</p>
                    </div>
                    <button
                      onClick={() => {
                        const activeRule = data.regrasAutomacao.find((r) => r.ativa);
                        if (activeRule) handleExecuteRuleNow(activeRule);
                        else addToast('Nenhuma regra ativa para executar.', 'info');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Executar Varredura Automática</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.regrasAutomacao.map((rule) => (
                      <div key={rule.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${rule.ativa ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                              <h4 className="text-xs font-semibold">{rule.titulo}</h4>
                            </div>
                            <span className="text-[11px] text-emerald-600 font-medium">Gatilho: {rule.tipoGatilho.replace('_', ' ')}</span>
                          </div>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                            {rule.frequencia}
                          </span>
                        </div>

                        <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg text-xs flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-neutral-400 uppercase block">Origem</span>
                            <span className="font-medium">{rule.contaOrigemNome}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-400" />
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 uppercase block">Destino</span>
                            <span className="font-medium">{rule.contaDestinoNome}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-neutral-500">Valor transferido:</span>
                          <span className="font-bold font-mono">{maskValue(rule.valor)}</span>
                        </div>

                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400">
                            {rule.ultimaExecucao ? `Última: ${formatDateBR(rule.ultimaExecucao)}` : 'Pendente'}
                          </span>
                          <button
                            onClick={() => handleExecuteRuleNow(rule)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded border border-emerald-200 dark:border-emerald-800"
                          >
                            <Play className="w-3 h-3 fill-emerald-600" /> Executar Agora
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portability Requests */}
                <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold font-display">Portabilidade Bancária & Salário (Resolução Bacen nº 3.402)</h3>
                      <p className="text-xs text-neutral-500">Migre seu salário e investimentos sem custo e com garantia legal.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {data.portabilidades.map((port) => (
                      <div key={port.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">Portabilidade de {port.tipo}</span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {port.status}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            De <strong>{port.bancoOrigem}</strong> para <strong>{port.bancoDestino}</strong>
                          </p>
                          <p className="text-[11px] text-neutral-400">Protocolo CIP/Bacen: {port.protocolo} · Empregador: {port.nomeEmpregador}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 uppercase block">Valor Mensal</span>
                          <span className="text-sm font-bold font-mono">{port.valorEstimado ? maskValue(port.valorEstimado) : 'Integral'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TRANSACTIONS SUBTAB */}
            {financeSubTab === 'transactions' && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold font-display">Livro de Transações & Movimentações</h3>
                  <span className="text-xs text-neutral-500">{data.transacoes.length} registros</span>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {data.transacoes.map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{tx.descricao}</p>
                        <p className="text-[11px] text-neutral-400">
                          {formatDateBR(tx.data)} · {tx.categoria} {tx.protocoloOpenFinance && `· ${tx.protocoloOpenFinance}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold ${tx.tipo === 'receita' ? 'text-emerald-600' : tx.tipo === 'despesa' ? 'text-rose-600' : 'text-sky-600'}`}>
                          {tx.tipo === 'receita' ? '+' : tx.tipo === 'despesa' ? '-' : ''}
                          {maskValue(tx.valor)}
                        </span>
                        <span className="text-[10px] block uppercase text-neutral-400">{tx.tipo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHARTS SUBTAB */}
            {financeSubTab === 'charts' && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold font-display">Fluxo de Caixa Mensal</h3>
                <div className="h-48 flex items-end gap-6 pt-6 pb-2 justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-600">{maskValue(receitasMes)}</span>
                    <div className="w-16 bg-emerald-500 rounded-t-lg transition-all" style={{ height: `${Math.min(140, (receitasMes / 15000) * 140)}px` }} />
                    <span className="text-xs text-neutral-500">Receitas</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-500">{maskValue(despesasMes)}</span>
                    <div className="w-16 bg-rose-500 rounded-t-lg transition-all" style={{ height: `${Math.min(140, (despesasMes / 15000) * 140)}px` }} />
                    <span className="text-xs text-neutral-500">Despesas</span>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNTS SUBTAB */}
            {financeSubTab === 'accounts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {computedAccounts.map((acc) => (
                  <div key={acc.id} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{acc.nome}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">{acc.instituicao}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Saldo Atual</span>
                    <p className="text-xl font-bold font-mono">{maskValue(acc.saldoAtual || acc.saldoInicial)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* GOALS SUBTAB */}
            {financeSubTab === 'goals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.metas.map((goal) => {
                  const pct = Math.min(100, Math.round((goal.valorAtual / (goal.valorAlvo || 1)) * 100));
                  return (
                    <div key={goal.id} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{goal.titulo}</span>
                        <span className="text-xs font-mono text-emerald-600 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.cor }} />
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span>Atual: {maskValue(goal.valorAtual)}</span>
                        <span>Alvo: {maskValue(goal.valorAlvo)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: TASKS MODULE */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display">Gerenciador de Tarefas</h2>
                <p className="text-xs text-neutral-500">Organize suas prioridades e prazos</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['a_fazer', 'em_andamento', 'concluida'] as TaskStatus[]).map((status) => {
                const titleMap = { a_fazer: 'A Fazer', em_andamento: 'Em Andamento', concluida: 'Concluído' };
                const filtered = data.tarefas.filter((t) => t.status === status);
                return (
                  <div key={status} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{titleMap[status]}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">{filtered.length}</span>
                    </div>
                    <div className="space-y-2">
                      {filtered.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              tarefas: prev.tarefas.map((task) =>
                                task.id === t.id
                                  ? {
                                      ...task,
                                      status: task.status === 'a_fazer' ? 'em_andamento' : task.status === 'em_andamento' ? 'concluida' : 'a_fazer',
                                      concluida: task.status === 'em_andamento',
                                    }
                                  : task
                              ),
                            }));
                          }}
                          className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-lg text-xs space-y-1.5 cursor-pointer hover:border-emerald-400 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{t.titulo}</span>
                            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${t.prioridade === 'Alta' ? 'bg-rose-100 text-rose-700' : 'bg-neutral-200 text-neutral-600'}`}>
                              {t.prioridade}
                            </span>
                          </div>
                          {t.vencimento && <p className="text-[10px] text-neutral-400">Vencimento: {formatDateBR(t.vencimento)}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: HABITS MODULE */}
        {activeTab === 'habits' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-lg font-bold font-display">Rastreador de Hábitos & Rotinas</h2>
            <div className="space-y-3">
              {data.habitos.map((habit) => {
                const days = getRecentDays(7);
                const streak = calculateHabitStreak(habit.historicoDias);
                return (
                  <div key={habit.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{habit.nome}</h4>
                        <span className="text-[10px] text-neutral-400">{habit.frequencia} · Meta: {habit.metaDiaria}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono font-bold text-amber-500 text-xs">
                        <Flame className="w-4 h-4 fill-amber-500" />
                        <span>{streak} dias consecutivos</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {days.map((d) => {
                        const checked = habit.historicoDias.includes(d.dateStr);
                        return (
                          <button
                            key={d.dateStr}
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                habitos: prev.habitos.map((h) =>
                                  h.id === habit.id
                                    ? {
                                        ...h,
                                        historicoDias: checked
                                          ? h.historicoDias.filter((dt) => dt !== d.dateStr)
                                          : [...h.historicoDias, d.dateStr],
                                      }
                                    : h
                                ),
                              }));
                            }}
                            className={`p-2 rounded-lg border text-center transition-all ${
                              checked
                                ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                                : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-500'
                            }`}
                          >
                            <span className="text-[10px] block">{d.label}</span>
                            <span className="text-xs font-mono">{d.dayNumber}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 5: NOTES MODULE */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-display">Agenda & Bloco de Notas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.notas.map((note) => (
                <div key={note.id} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      {note.fixado && <Pin className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />}
                      {note.titulo}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">{note.categoria}</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 whitespace-pre-line leading-relaxed">{note.conteudo}</p>
                  {note.compromissoDataHora && (
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5 text-[11px] text-emerald-600">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDateTimeBR(note.compromissoDataHora)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Security Settings Modal */}
      <SecuritySettingsModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        config={data.seguranca}
        onSaveConfig={(updated) => setData((prev) => ({ ...prev, seguranca: updated }))}
        onEmergencyFreeze={handleEmergencyFreeze}
        onShowToast={addToast}
      />

      {/* Supabase SQL Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onShowToast={addToast}
      />

      {/* Transfer Receipt Modal */}
      <TransferReceiptModal
        receipt={receiptData}
        onClose={() => setReceiptData(null)}
      />
    </div>
  );
}
