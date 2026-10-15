import {
  AppData,
  Transaction,
  Account,
  CreditCard,
  FinancialGoal,
  Task,
  Habit,
  NoteItem,
  OpenFinanceConsent,
  PortabilityRequest,
  AutomatedTransferRule,
  SecurityConfig,
} from '../types';

const STORAGE_KEY = 'nexus_finance_personal_v1';

export const INITIAL_SECURITY: SecurityConfig = {
  modoSegurancaAtivo: false,
  ocultarValores: false,
  limiteTransferenciaDiurno: 15000.0,
  limiteTransferenciaNoturno: 1200.0,
  horarioNoturnoInicio: '20:00',
  horarioNoturnoFim: '06:00',
  pinSeguranca: '123456',
  biometriaAtiva: true,
  dispositivoConfiavel: 'MacBook Pro / iPhone 15 Pro (mTLS Autenticado)',
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
      data: '2026-10-11',
      descricao: 'Abastecimento Posto Shell (Gasolina)',
      contaId: 'acc-1',
      cartaoId: 'card-1',
      tags: ['combustivel', 'carro'],
      status: 'pago',
    },
    {
      id: 'tx-6',
      tipo: 'despesa',
      subtipo: 'variavel',
      valor: 240.0,
      categoria: 'Lazer',
      data: '2026-10-12',
      descricao: 'Jantar Restaurante Italiano',
      contaId: 'acc-1',
      cartaoId: 'card-1',
      tags: ['lazer', 'fim-de-semana'],
      status: 'pago',
    },
    {
      id: 'tx-7',
      tipo: 'despesa',
      subtipo: 'fixa',
      valor: 380.0,
      categoria: 'Saúde',
      data: '2026-10-02',
      descricao: 'Plano de Saúde Unimed',
      contaId: 'acc-2',
      tags: ['saude', 'mensalidade'],
      status: 'pago',
    },
    {
      id: 'tx-8',
      tipo: 'despesa',
      subtipo: 'fixa',
      valor: 149.9,
      categoria: 'Serviços',
      data: '2026-10-03',
      descricao: 'Internet Fibra 600MB',
      contaId: 'acc-1',
      tags: ['internet', 'trabalho'],
      status: 'pago',
    },
    {
      id: 'tx-9',
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
    {
      id: 'tx-10',
      tipo: 'despesa',
      subtipo: 'variavel',
      valor: 78.5,
      categoria: 'Alimentação',
      data: '2026-10-14',
      descricao: 'Almoço Executivo Bistrô',
      contaId: 'acc-4',
      tags: ['almoco', 'trabalho'],
      status: 'pago',
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
      notas: 'Manter alocado em Tesouro Selic e CDB de liquidez diária 100% CDI.',
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
      notas: 'Inclui passagens aéreas internacionais, hospedagem em Kyoto e Tokyo.',
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
      notas: 'Entrada substancial para financiamento com taxa zero.',
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
      vencimento: '2026-10-14',
      tags: ['rotina', 'financas'],
      criadaEm: '2026-10-12',
    },
    {
      id: 'task-2',
      titulo: 'Preparar apresentação da Sprint de Arquitetura',
      descricao: 'Montar slides com métricas de desempenho e próximos passos',
      prioridade: 'Alta',
      status: 'em_andamento',
      concluida: false,
      categoria: 'Trabalho',
      vencimento: '2026-10-15',
      tags: ['tech', 'sprint'],
      criadaEm: '2026-10-10',
    },
    {
      id: 'task-3',
      titulo: 'Agendar revisão do carro e troca de óleo',
      descricao: 'Ligar para a concessionária autorizada e reservar horário matutino',
      prioridade: 'Media',
      status: 'a_fazer',
      concluida: false,
      categoria: 'Pessoal',
      vencimento: '2026-10-17',
      tags: ['carro', 'manutencao'],
      criadaEm: '2026-10-13',
    },
    {
      id: 'task-4',
      titulo: 'Finalizar leitura do livro de Finanças Pessoais',
      descricao: 'Capítulo sobre psicologia do dinheiro e alocação de ativos',
      prioridade: 'Baixa',
      status: 'concluida',
      concluida: true,
      categoria: 'Estudos',
      vencimento: '2026-10-13',
      tags: ['livros', 'desenvolvimento'],
      criadaEm: '2026-10-01',
    },
    {
      id: 'task-5',
      titulo: 'Enviar comprovante de pagamento do condomínio',
      descricao: 'Encaminhar PDF para a administradora predial',
      prioridade: 'Media',
      status: 'concluida',
      concluida: true,
      categoria: 'Finanças',
      vencimento: '2026-10-07',
      tags: ['condominio', 'comprovante'],
      criadaEm: '2026-10-06',
    },
  ],
  habitos: [
    {
      id: 'hab-1',
      nome: 'Beber 2.5L de água',
      categoria: 'Saúde',
      frequencia: 'Diária',
      historicoDias: ['2026-10-09', '2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14'],
      cor: '#06B6D4',
      metaDiaria: '2.5 Litros',
      criadoEm: '2026-09-01',
    },
    {
      id: 'hab-2',
      nome: 'Treino de Força / Academia',
      categoria: 'Saúde',
      frequencia: 'Dias úteis',
      historicoDias: ['2026-10-09', '2026-10-12', '2026-10-13', '2026-10-14'],
      cor: '#F97316',
      metaDiaria: '45 minutos',
      criadoEm: '2026-09-10',
    },
    {
      id: 'hab-3',
      nome: 'Leitura de Livro ou Artigo',
      categoria: 'Estudos',
      frequencia: 'Diária',
      historicoDias: ['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13'],
      cor: '#8B5CF6',
      metaDiaria: '20 páginas',
      criadoEm: '2026-09-15',
    },
    {
      id: 'hab-4',
      nome: 'Planejamento do Dia Seguinte',
      categoria: 'Produtividade',
      frequencia: 'Diária',
      historicoDias: ['2026-10-11', '2026-10-12', '2026-10-13'],
      cor: '#10B981',
      metaDiaria: '10 minutos à noite',
      criadoEm: '2026-09-20',
    },
  ],
  notas: [
    {
      id: 'note-1',
      titulo: 'Regra 50-30-20 de Orçamento Pessoal',
      conteudo: 'Diretrizes para distribuição da renda líquida:\n• 50% Necessidades Básicas (Moradia, Alimentação, Saúde, Contas fixas)\n• 30% Desejos Pessoais & Lazer (Restaurantes, Viagens, Streaming, Hobbies)\n• 20% Futuro Financeiro & Investimentos (Reserva de emergência, Ações, FIIs)\n\nRevisar mensalmente no dia 1º de cada mês.',
      fixado: true,
      categoria: 'Finanças',
      tags: ['financas', 'estrategia', 'planejamento'],
      atualizadoEm: '2026-10-12T14:30:00',
      cor: '#3B82F6',
    },
    {
      id: 'note-2',
      titulo: 'Reunião Trimestral de Alinhamento de Metas',
      conteudo: 'Apresentar balanço patrimonial dos últimos 6 meses e redefinir metas para o primeiro semestre de 2027.',
      fixado: true,
      categoria: 'Compromissos',
      compromissoDataHora: '2026-10-20T10:00',
      tags: ['reuniao', 'planejamento'],
      atualizadoEm: '2026-10-14T09:15:00',
      cor: '#8B5CF6',
    },
    {
      id: 'note-3',
      titulo: 'Checklist para Viagem ao Japão',
      conteudo: '• Verificar validade do passaporte (mínimo 6 meses)\n• Comprar JR Rail Pass com antecedência\n• Contratar Seguro Viagem com cobertura médica internacional\n• Habilitar cartões de débito global (Nomad / Wise)\n• Baixar aplicativo Japan Travel e Google Tradutor offline',
      fixado: false,
      categoria: 'Viagem',
      tags: ['viagem', 'japao', 'checklist'],
      atualizadoEm: '2026-10-05T18:00:00',
      cor: '#EC4899',
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
      observacoes: 'Portabilidade concluída com sucesso. Salário creditado diretamente no Nubank.',
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
    if (!parsed.transacoes || !parsed.tarefas || !parsed.habitos) {
      saveAppData(INITIAL_DATA);
      return INITIAL_DATA;
    }
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
    console.error('Falha ao salvar dados no LocalStorage:', err);
  }
}

// Compute dynamic balance for each account based on transactions
export function computeAccountBalances(accounts: Account[], transactions: Transaction[]): Account[] {
  return accounts.map((acc) => {
    let saldo = acc.saldoInicial;
    for (const tx of transactions) {
      if (tx.status !== 'pago') continue;
      
      if (tx.tipo === 'receita' && tx.contaId === acc.id) {
        saldo += tx.valor;
      } else if (tx.tipo === 'despesa' && tx.contaId === acc.id) {
        saldo -= tx.valor;
      } else if (tx.tipo === 'transferencia') {
        if (tx.contaId === acc.id) {
          saldo -= tx.valor;
        }
        if (tx.contaDestinoId === acc.id) {
          saldo += tx.valor;
        }
      }
    }
    return { ...acc, saldoAtual: saldo };
  });
}

// Compute credit card open invoice
export function computeCreditCardInvoice(cardId: string, transactions: Transaction[]): number {
  return transactions
    .filter((tx) => tx.cartaoId === cardId && tx.tipo === 'despesa' && tx.status === 'pago')
    .reduce((sum, tx) => sum + tx.valor, 0);
}
