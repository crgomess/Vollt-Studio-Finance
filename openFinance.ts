export type PortabilityType = 'salario' | 'credito' | 'investimento';
export type PortabilityStatus = 'em_analise' | 'aprovada' | 'processando' | 'concluida' | 'rejeitada';

export type TriggerType =
  | 'recorrente_data'       // Ex: Todo dia 05 transferir R$ 2.000
  | 'varredura_excedente'   // Ex: Se saldo > R$ 3.000, transferir excedente para investimentos
  | 'cobertura_minima'      // Ex: Se saldo < R$ 200, resgatar da reserva para cobrir
  | 'aporte_meta';          // Ex: Aporte semanal para meta de viagem

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
  valorGatilho?: number; // Para varredura ou cobertura mínima
  diaExecucao?: number;  // 1 a 31
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
  horarioNoturnoInicio: string; // "20:00"
  horarioNoturnoFim: string;    // "06:00"
  pinSeguranca: string;         // PIN de 6 dígitos
  biometriaAtiva: boolean;
  dispositivoConfiavel: string;
  ipSeguro: boolean;
}
