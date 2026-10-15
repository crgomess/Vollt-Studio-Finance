export type TransactionType = 'despesa' | 'receita' | 'transferencia';
export type ExpenseSubtype = 'fixa' | 'variavel';
export type PriorityLevel = 'Baixa' | 'Media' | 'Alta';
export type TaskStatus = 'a_fazer' | 'em_andamento' | 'concluida';
export type HabitFrequency = 'Diária' | 'Semanal' | 'Dias úteis';
export type AccountType = 'corrente' | 'poupanca' | 'investimento' | 'carteira';

export * from './openFinance';
import { OpenFinanceConsent, PortabilityRequest, AutomatedTransferRule, SecurityConfig } from './openFinance';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  subtipo?: ExpenseSubtype;
  valor: number;
  categoria: string;
  data: string; // YYYY-MM-DD
  descricao: string;
  contaId: string;
  contaDestinoId?: string; // Para transferências
  cartaoId?: string; // Se debitado em fatura de cartão
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
  saldoAtual?: number; // Calculado
  instituicao: string;
  cor: string;
  icone?: string;
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
  dataLimite?: string; // YYYY-MM-DD
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
  vencimento?: string; // YYYY-MM-DD
  tags: string[];
  criadaEm: string;
}

export interface Habit {
  id: string;
  nome: string;
  categoria: string;
  frequencia: HabitFrequency;
  historicoDias: string[]; // ['2026-10-14', ...]
  cor: string;
  metaDiaria?: string; // ex: "2 Litros", "30 minutos"
  criadoEm: string;
}

export interface NoteItem {
  id: string;
  titulo: string;
  conteudo: string;
  fixado: boolean;
  categoria: string;
  compromissoDataHora?: string; // YYYY-MM-DDTHH:mm
  tags: string[];
  atualizadoEm: string;
  cor?: string;
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

export type ActiveTab = 'overview' | 'finance' | 'tasks' | 'habits' | 'notes';
