import React, { useState } from 'react';
import {
  OpenFinanceConsent,
  PortabilityRequest,
  AutomatedTransferRule,
  SecurityConfig,
  Account,
  Transaction,
} from '../../types';
import { formatCurrency, formatDateBR, getTodayString } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { SecurityPinModal } from './SecurityPinModal';
import {
  ShieldCheck,
  RefreshCw,
  Repeat,
  ArrowRight,
  Plus,
  Play,
  Lock,
  Building2,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  Briefcase,
  Zap,
} from 'lucide-react';

interface OpenFinanceModuleProps {
  consents: OpenFinanceConsent[];
  portabilidades: PortabilityRequest[];
  regras: AutomatedTransferRule[];
  accounts: Account[];
  securityConfig: SecurityConfig;
  onSaveRule: (rule: AutomatedTransferRule) => void;
  onDeleteRule: (id: string) => void;
  onToggleRule: (id: string) => void;
  onExecuteRuleNow: (rule: AutomatedTransferRule) => void;
  onSavePortability: (request: PortabilityRequest) => void;
  onDeletePortability: (id: string) => void;
  onConnectBankConsent: (consent: OpenFinanceConsent) => void;
  onRevokeConsent: (id: string) => void;
  onOpenSecurityModal: () => void;
  onTogglePrivacyMask: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const SUPPORTED_BANKS = [
  { nome: 'Itaú Unibanco S.A.', codigo: '341', cor: '#F97316' },
  { nome: 'Nu Pagamentos S.A. (Nubank)', codigo: '260', cor: '#8B5CF6' },
  { nome: 'XP Investimentos CCTVM S.A.', codigo: '102', cor: '#06B6D4' },
  { nome: 'Banco Bradesco S.A.', codigo: '237', cor: '#DC2626' },
  { nome: 'Banco do Brasil S.A.', codigo: '001', cor: '#EAB308' },
  { nome: 'Banco Inter S.A.', codigo: '077', cor: '#F97316' },
  { nome: 'BTG Pactual S.A.', codigo: '208', cor: '#1E293B' },
  { nome: 'Caixa Econômica Federal', codigo: '104', cor: '#2563EB' },
];

export const OpenFinanceModule: React.FC<OpenFinanceModuleProps> = ({
  consents,
  portabilidades,
  regras,
  accounts,
  securityConfig,
  onSaveRule,
  onDeleteRule,
  onToggleRule,
  onExecuteRuleNow,
  onSavePortability,
  onDeletePortability,
  onConnectBankConsent,
  onRevokeConsent,
  onOpenSecurityModal,
  onTogglePrivacyMask,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'automacoes' | 'portabilidade' | 'consentimentos'>('automacoes');

  // Security PIN flow
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [pinActionTitle, setPinActionTitle] = useState('');

  // Modals for new items
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);
  const [isNewPortabilityModalOpen, setIsNewPortabilityModalOpen] = useState(false);
  const [isConnectBankModalOpen, setIsConnectBankModalOpen] = useState(false);
  const [selectedPortForCert, setSelectedPortForCert] = useState<PortabilityRequest | null>(null);

  // Form states: New Automation Rule
  const [ruleTitulo, setRuleTitulo] = useState('');
  const [ruleTipoGatilho, setRuleTipoGatilho] = useState<AutomatedTransferRule['tipoGatilho']>('recorrente_data');
  const [ruleContaOrigem, setRuleContaOrigem] = useState(accounts[0]?.nome || 'Nubank Principal');
  const [ruleContaDestino, setRuleContaDestino] = useState(accounts[1]?.nome || 'XP Reserva');
  const [ruleValor, setRuleValor] = useState('500');
  const [ruleValorGatilho, setRuleValorGatilho] = useState('3000');
  const [ruleDia, setRuleDia] = useState('5');
  const [ruleFrequencia, setRuleFrequencia] = useState<'diaria' | 'semanal' | 'mensal'>('mensal');
  const [rulePix, setRulePix] = useState('');

  // Form states: New Portability
  const [portTipo, setPortTipo] = useState<PortabilityRequest['tipo']>('salario');
  const [portBancoOrigem, setPortBancoOrigem] = useState(SUPPORTED_BANKS[0].nome);
  const [portBancoDestino, setPortBancoDestino] = useState(SUPPORTED_BANKS[1].nome);
  const [portNomeEmpregador, setPortNomeEmpregador] = useState('');
  const [portCnpjEmpregador, setPortCnpjEmpregador] = useState('');
  const [portValorEstimado, setPortValorEstimado] = useState('');

  // Form states: Connect Bank Consent
  const [selectedBankToConnect, setSelectedBankToConnect] = useState(SUPPORTED_BANKS[3].nome);

  const requireSecurityCheck = (actionTitle: string, action: () => void) => {
    if (securityConfig.modoSegurancaAtivo) {
      setPinActionTitle(actionTitle);
      setPendingAction(() => action);
      setIsPinModalOpen(true);
    } else {
      action();
    }
  };

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(ruleValor.replace(',', '.')) || 100;
    const valGatilho = parseFloat(ruleValorGatilho.replace(',', '.')) || undefined;
    const diaNum = parseInt(ruleDia, 10) || 5;

    const newRule: AutomatedTransferRule = {
      id: `rule-${Date.now()}`,
      titulo: ruleTitulo.trim() || 'Transferência Automatizada',
      tipoGatilho: ruleTipoGatilho,
      contaOrigemNome: ruleContaOrigem,
      contaDestinoNome: ruleContaDestino,
      bancoOrigem: ruleContaOrigem,
      bancoDestino: ruleContaDestino,
      valor: Math.max(1, val),
      valorGatilho: valGatilho,
      diaExecucao: diaNum,
      frequencia: ruleFrequencia,
      chavePixDestino: rulePix.trim() || undefined,
      ativa: true,
      protocoloBacenConsent: consents[0]?.protocoloBacen || 'BACEN-OF-AUTOTRANSFER',
      proximaExecucao: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`,
    };

    requireSecurityCheck('Cadastrar Nova Regra de Transferência Automática', () => {
      onSaveRule(newRule);
      setIsNewRuleModalOpen(false);
      onShowToast('Regra de transferência automatizada ativada!', 'success');
    });
  };

  const handleCreatePortabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valEst = parseFloat(portValorEstimado.replace(',', '.')) || undefined;
    const randCode = Math.floor(100000 + Math.random() * 900000);

    const newPort: PortabilityRequest = {
      id: `port-${Date.now()}`,
      tipo: portTipo,
      bancoOrigem: portBancoOrigem,
      bancoDestino: portBancoDestino,
      nomeEmpregador: portNomeEmpregador.trim() || undefined,
      cnpjEmpregador: portCnpjEmpregador.trim() || undefined,
      valorEstimado: valEst,
      status: 'em_analise',
      protocolo: `PORT-${portTipo.slice(0, 3).toUpperCase()}-2026-${randCode}`,
      dataSolicitacao: getTodayString(),
      previsaoConclusao: 'Em até 5 dias úteis (Resolução Bacen nº 3.402)',
      observacoes: 'Solicitação enviada para a câmara interbancária (CIP). Aguardando processamento.',
    };

    requireSecurityCheck('Autorizar Solicitação de Portabilidade Open Finance', () => {
      onSavePortability(newPort);
      setIsNewPortabilityModalOpen(false);
      onShowToast(`Solicitação de portabilidade protocolada: ${newPort.protocolo}`, 'success');
    });
  };

  const handleConnectBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const b = SUPPORTED_BANKS.find((item) => item.nome === selectedBankToConnect) || SUPPORTED_BANKS[0];
    const randProtocol = `BACEN-OF-${b.codigo}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newConsent: OpenFinanceConsent = {
      id: `of-consent-${Date.now()}`,
      instituicao: b.nome,
      codigoBanco: b.codigo,
      logoCor: b.cor,
      status: 'ativo',
      dataConsentimento: getTodayString(),
      dataExpiracao: '2027-10-14',
      escopos: ['Saldos e Extratos', 'Dados Cadastrais', 'Iniciação de Pagamentos', 'Portabilidade'],
      protocoloBacen: randProtocol,
      permiteIniciacaoPagamento: true,
    };

    requireSecurityCheck(`Conectar ${b.nome} via Open Finance`, () => {
      onConnectBankConsent(newConsent);
      setIsConnectBankModalOpen(false);
      onShowToast(`Conexão com ${b.nome} estabelecida com sucesso!`, 'success');
    });
  };

  const maskValue = (val: number) => {
    return securityConfig.ocultarValores ? 'R$ ••••••' : formatCurrency(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Security Status */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-display">
                  Portabilidade & Automação Open Finance
                </h3>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  Padrão Bacen / ITP
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Conexões criptografadas de ponta a ponta, portabilidade de salário e investimentos, e transferências inteligentes automatizadas.
              </p>
            </div>
          </div>

          {/* Quick Security Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTogglePrivacyMask}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                securityConfig.ocultarValores
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'
              }`}
              title={securityConfig.ocultarValores ? 'Revelar valores' : 'Ocultar valores em tela'}
            >
              {securityConfig.ocultarValores ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {securityConfig.ocultarValores ? 'Valores Ocultos' : 'Ocultar Valores'}
              </span>
            </button>

            <button
              onClick={onOpenSecurityModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modo Segurança</span>
            </button>
          </div>
        </div>

        {/* Security Limits Pill Strip */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
          <span>
            Status do Cofre:{' '}
            <strong className={securityConfig.modoSegurancaAtivo ? 'text-emerald-600' : 'text-neutral-600 dark:text-neutral-300'}>
              {securityConfig.modoSegurancaAtivo ? 'PIN de 6 dígitos ativo' : 'Acesso Padrão'}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Limite Diurno: <strong className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200">{maskValue(securityConfig.limiteTransferenciaDiurno)}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Limite Noturno (20h-06h): <strong className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200">{maskValue(securityConfig.limiteTransferenciaNoturno)}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Consentimentos Ativos: <strong className="text-neutral-800 dark:text-neutral-200">{consents.filter((c) => c.status === 'ativo').length} bancos</strong>
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl max-w-fit">
        <button
          onClick={() => setActiveSubTab('automacoes')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeSubTab === 'automacoes'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" /> Automação de Transferências ({regras.length})
        </button>
        <button
          onClick={() => setActiveSubTab('portabilidade')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeSubTab === 'portabilidade'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Portabilidade Bancária ({portabilidades.length})
        </button>
        <button
          onClick={() => setActiveSubTab('consentimentos')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeSubTab === 'consentimentos'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Instituições Conectadas ({consents.length})
        </button>
      </div>

      {/* SUBTAB 1: AUTOMAÇÃO DE TRANSFERÊNCIAS */}
      {activeSubTab === 'automacoes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                Regras de Transferência Inteligente
              </h3>
              <p className="text-xs text-neutral-500">
                Execute varreduras de saldo, aportes automáticos ou transferências programadas via Open Finance Pix.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const activeRule = regras.find((r) => r.ativa);
                  if (!activeRule) {
                    onShowToast('Nenhuma regra de automação ativa no momento.', 'info');
                    return;
                  }
                  requireSecurityCheck(
                    `Executar Varredura Inteligente: ${activeRule.titulo}`,
                    () => onExecuteRuleNow(activeRule)
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors shadow-xs"
                title="Executar ciclo automático de transferências bancárias"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Executar Varredura Automática</span>
                <span className="sm:hidden">Varredura</span>
              </button>
              <button
                onClick={() => setIsNewRuleModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Regra
              </button>
            </div>
          </div>

          {regras.length === 0 ? (
            <div className="p-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
              Nenhuma regra de automação configurada. Crie sua primeira regra para automatizar aportes ou varredura de saldo!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regras.map((rule) => {
                const getTriggerDesc = () => {
                  switch (rule.tipoGatilho) {
                    case 'recorrente_data':
                      return `Programado: Todo dia ${rule.diaExecucao || 5} do mês`;
                    case 'varredura_excedente':
                      return `Varredura: Se saldo > ${maskValue(rule.valorGatilho || 3000)}`;
                    case 'cobertura_minima':
                      return `Proteção: Se saldo < ${maskValue(rule.valorGatilho || 200)}`;
                    case 'aporte_meta':
                      return 'Aporte Recorrente para Meta';
                  }
                };

                return (
                  <div
                    key={rule.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                rule.ativa ? 'bg-emerald-500' : 'bg-neutral-400'
                              }`}
                            />
                            <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                              {rule.titulo}
                            </h4>
                          </div>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                            {getTriggerDesc()}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                          {rule.frequencia}
                        </span>
                      </div>

                      {/* Path from Origin to Destination */}
                      <div className="my-3 p-2.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 block uppercase">Origem</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {rule.contaOrigemNome}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 mx-2" />
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 block uppercase">Destino</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {rule.contaDestinoNome}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Valor transferido:</span>
                        <span className="font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                          {maskValue(rule.valor)}
                        </span>
                      </div>

                      {rule.chavePixDestino && (
                        <p className="text-[10px] font-mono text-neutral-400 mt-1 truncate">
                          Chave Pix: {rule.chavePixDestino}
                        </p>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                      <div className="text-neutral-400">
                        {rule.ultimaExecucao && (
                          <span>Última: {formatDateBR(rule.ultimaExecucao)}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            requireSecurityCheck(
                              `Executar Transferência Imediata de ${maskValue(rule.valor)}`,
                              () => onExecuteRuleNow(rule)
                            )
                          }
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded border border-emerald-200 dark:border-emerald-800 transition-colors"
                          title="Disparar transferência agora via Open Finance"
                        >
                          <Play className="w-3 h-3 fill-emerald-600" /> Executar
                        </button>
                        <button
                          onClick={() => onToggleRule(rule.id)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            rule.ativa
                              ? 'text-neutral-500 hover:text-neutral-800'
                              : 'text-emerald-600 font-medium'
                          }`}
                        >
                          {rule.ativa ? 'Pausar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => onDeleteRule(rule.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                          title="Excluir regra"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: PORTABILIDADE BANCÁRIA */}
      {activeSubTab === 'portabilidade' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                Portabilidade Bancária & Salário
              </h3>
              <p className="text-xs text-neutral-500">
                Migre seu salário ou investimentos entre bancos sem custo e de forma 100% digital.
              </p>
            </div>
            <button
              onClick={() => setIsNewPortabilityModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Nova Solicitação
            </button>
          </div>

          {portabilidades.length === 0 ? (
            <div className="p-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
              Nenhuma solicitação de portabilidade em andamento. Clique no botão acima para transferir seu salário para a conta de sua preferência!
            </div>
          ) : (
            <div className="space-y-3">
              {portabilidades.map((port) => {
                const isConcluida = port.status === 'concluida';
                const isAnalise = port.status === 'em_analise';

                return (
                  <div
                    key={port.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          Portabilidade de {port.tipo === 'salario' ? 'Salário' : port.tipo === 'investimento' ? 'Investimentos' : 'Crédito'}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                            isConcluida
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {port.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-300">
                        De <strong>{port.bancoOrigem}</strong> para <strong>{port.bancoDestino}</strong>
                      </p>

                      {port.nomeEmpregador && (
                        <p className="text-[11px] text-neutral-400">
                          Empregador: {port.nomeEmpregador} {port.cnpjEmpregador && `· CNPJ: ${port.cnpjEmpregador}`}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                        <span>Protocolo: {port.protocolo}</span>
                        <span aria-hidden="true">·</span>
                        <span>Solicitado em: {formatDateBR(port.dataSolicitacao)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                      {port.valorEstimado && (
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 uppercase block">Valor Mensal</span>
                          <span className="text-sm font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                            {maskValue(port.valorEstimado)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPortForCert(port)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded border border-emerald-200 dark:border-emerald-800 transition-colors"
                          title="Visualizar Termo de Portabilidade e Rastreamento Bacen"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Termo Bacen</span>
                        </button>

                        {port.tipo === 'salario' && (
                          <button
                            onClick={() => {
                              setRuleTitulo(`Aporte Automático Salário (${port.bancoDestino.split(' ')[0]})`);
                              setRuleContaOrigem(port.bancoDestino.split(' ')[0] || accounts[0]?.nome);
                              setRuleValor(port.valorEstimado ? Math.round(port.valorEstimado * 0.3).toString() : '1500');
                              setRuleTipoGatilho('recorrente_data');
                              setRuleDia('5');
                              setActiveSubTab('automacoes');
                              setIsNewRuleModalOpen(true);
                              onShowToast('Configurando regra de transferência para os proventos da portabilidade.', 'info');
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-700 transition-colors"
                            title="Criar regra para direcionar/investir este salário automaticamente"
                          >
                            <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">Automatizar Aporte</span>
                          </button>
                        )}

                        <button
                          onClick={() => onDeletePortability(port.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                          title="Remover histórico"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: CONSENTIMENTOS OPEN FINANCE */}
      {activeSubTab === 'consentimentos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                Instituições Conectadas (Open Finance Brasil)
              </h3>
              <p className="text-xs text-neutral-500">
                Gerencie seus consentimentos de compartilhamento de dados e iniciação de pagamentos.
              </p>
            </div>
            <button
              onClick={() => setIsConnectBankModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Conectar Banco
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consents.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: c.logoCor }}
                      >
                        {c.codigoBanco}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                          {c.instituicao}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Código Bacen {c.codigoBanco}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        c.status === 'ativo'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-neutral-500 my-2">
                    <p className="font-mono text-[10px] text-neutral-400">
                      Protocolo: {c.protocoloBacen}
                    </p>
                    <p>Válido até: {formatDateBR(c.dataExpiracao)}</p>
                    <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                      {c.escopos.map((esc) => (
                        <span
                          key={esc}
                          className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded"
                        >
                          {esc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Conexão Segura
                  </span>
                  <button
                    onClick={() =>
                      requireSecurityCheck(`Revogar Consentimento de ${c.instituicao}`, () =>
                        onRevokeConsent(c.id)
                      )
                    }
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Revogar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Nova Regra de Automação */}
      <Modal
        isOpen={isNewRuleModalOpen}
        onClose={() => setIsNewRuleModalOpen(false)}
        title="Nova Regra de Transferência Automatizada"
        description="Configure gatilhos inteligentes para mover saldos automaticamente entre suas contas."
        maxWidth="md"
      >
        <form onSubmit={handleCreateRuleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Nome da Regra *
            </label>
            <input
              type="text"
              required
              value={ruleTitulo}
              onChange={(e) => setRuleTitulo(e.target.value)}
              placeholder="Ex: Aporte Mensal Ações / FIIs, Varredura de Caixa..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Tipo de Gatilho da Automação *
            </label>
            <select
              value={ruleTipoGatilho}
              onChange={(e) => setRuleTipoGatilho(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
            >
              <option value="recorrente_data">Data Programada (Ex: Todo dia 05 ou dia útil)</option>
              <option value="varredura_excedente">Varredura de Saldo Excedente (Enviar sobra para investimentos)</option>
              <option value="cobertura_minima">Cobertura de Saldo Mínimo (Evitar cheque especial)</option>
              <option value="aporte_meta">Aporte Direto em Meta Financeira</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Conta de Origem *
              </label>
              <select
                value={ruleContaOrigem}
                onChange={(e) => setRuleContaOrigem(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.nome}>
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
                value={ruleContaDestino}
                onChange={(e) => setRuleContaDestino(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.nome}>
                    {acc.nome} ({acc.instituicao})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Valor da Transferência (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={ruleValor}
                onChange={(e) => setRuleValor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums"
              />
            </div>
            {ruleTipoGatilho === 'recorrente_data' ? (
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Dia da Transferência (1 a 31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={ruleDia}
                  onChange={(e) => setRuleDia(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Saldo de Gatilho (R$)
                </label>
                <input
                  type="number"
                  step="50"
                  value={ruleValorGatilho}
                  onChange={(e) => setRuleValorGatilho(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Chave Pix de Destino (Opcional)
            </label>
            <input
              type="text"
              value={rulePix}
              onChange={(e) => setRulePix(e.target.value)}
              placeholder="Ex: financeiro@empresa.com ou CPF"
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsNewRuleModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Ativar Automação
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Nova Solicitação de Portabilidade */}
      <Modal
        isOpen={isNewPortabilityModalOpen}
        onClose={() => setIsNewPortabilityModalOpen(false)}
        title="Solicitação de Portabilidade Bancária"
        description="Transfira seu salário ou investimentos pelo ecossistema Open Finance (Gratuito e garantido pelo Bacen)."
        maxWidth="md"
      >
        <form onSubmit={handleCreatePortabilitySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Tipo de Portabilidade
            </label>
            <select
              value={portTipo}
              onChange={(e) => setPortTipo(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
            >
              <option value="salario">Portabilidade de Salário (Conta Salário → Conta Corrente)</option>
              <option value="investimento">Portabilidade de Investimentos (STVM entre corretoras)</option>
              <option value="credito">Portabilidade de Crédito / Financiamento</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Banco de Origem *
              </label>
              <select
                value={portBancoOrigem}
                onChange={(e) => setPortBancoOrigem(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              >
                {SUPPORTED_BANKS.map((b) => (
                  <option key={b.codigo} value={b.nome}>
                    {b.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Banco de Destino (Onde quer receber) *
              </label>
              <select
                value={portBancoDestino}
                onChange={(e) => setPortBancoDestino(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              >
                {SUPPORTED_BANKS.map((b) => (
                  <option key={b.codigo} value={b.nome}>
                    {b.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {portTipo === 'salario' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Razão Social da Empresa Empregadora *
                </label>
                <input
                  type="text"
                  required
                  value={portNomeEmpregador}
                  onChange={(e) => setPortNomeEmpregador(e.target.value)}
                  placeholder="Ex: Nexus Tecnologia e Serviços Ltda"
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    CNPJ da Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={portCnpjEmpregador}
                    onChange={(e) => setPortCnpjEmpregador(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Salário Líquido Estimado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={portValorEstimado}
                    onChange={(e) => setPortValorEstimado(e.target.value)}
                    placeholder="Ex: 12000"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-neutral-100/60 dark:bg-neutral-800/40 rounded-lg text-[11px] text-neutral-500 space-y-1">
            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Garantia Bacen:</p>
            <p>O banco de origem tem até 5 dias úteis para aprovar e direcionar os proventos para o novo banco sem tarifas.</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsNewPortabilityModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Protocolar Solicitação
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Conectar Novo Banco via Open Finance */}
      <Modal
        isOpen={isConnectBankModalOpen}
        onClose={() => setIsConnectBankModalOpen(false)}
        title="Conectar Instituição Financeira"
        description="Autorize o compartilhamento seguro pelo Open Finance Brasil (Resolução BCB nº 1)."
        maxWidth="sm"
      >
        <form onSubmit={handleConnectBankSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Selecione o Banco
            </label>
            <select
              value={selectedBankToConnect}
              onChange={(e) => setSelectedBankToConnect(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
            >
              {SUPPORTED_BANKS.map((b) => (
                <option key={b.codigo} value={b.nome}>
                  {b.nome} (Cód. {b.codigo})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
            <p className="font-semibold">Escopos Autorizados:</p>
            <p>• Dados cadastrais e contas correntes</p>
            <p>• Saldos, extratos e transações em tempo real</p>
            <p>• Iniciação de pagamentos Pix automatizados</p>
            <p className="text-[10px] text-neutral-500 pt-1">Validade do consentimento: 12 meses (renovável).</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsConnectBankModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Autorizar Conexão
            </button>
          </div>
        </form>
      </Modal>

      {/* SECURITY PIN CONFIRMATION MODAL */}
      <SecurityPinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          if (pendingAction) pendingAction();
        }}
        actionTitle={pinActionTitle}
        expectedPin={securityConfig.pinSeguranca}
      />

      {/* MODAL: Termo e Rastreamento da Portabilidade Bacen */}
      {selectedPortForCert && (
        <Modal
          isOpen={Boolean(selectedPortForCert)}
          onClose={() => setSelectedPortForCert(null)}
          title="Termo & Certificado de Portabilidade Bancária"
          description="Diretriz formal nos termos da Resolução Bacen nº 3.402/2006 e nº 4.793/2020."
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Header Status Card */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  Protocolo Oficial CIP: {selectedPortForCert.protocolo}
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  Portabilidade de {selectedPortForCert.tipo === 'salario' ? 'Salário' : selectedPortForCert.tipo === 'investimento' ? 'Investimentos' : 'Crédito'}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  De {selectedPortForCert.bancoOrigem} → {selectedPortForCert.bancoDestino}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>

            {/* 4-Step Progress Tracking Stepper */}
            <div>
              <h5 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2.5">
                Rastreamento Interbancário (Bacen / CIP)
              </h5>
              <div className="space-y-2">
                {[
                  {
                    title: '1. Solicitação Protocolada',
                    desc: `Registrada em ${formatDateBR(selectedPortForCert.dataSolicitacao)} via Open Finance Brasil`,
                    done: true,
                  },
                  {
                    title: '2. Envio à Câmara Interbancária (CIP)',
                    desc: 'Notificação formal de portabilidade enviada à instituição de origem',
                    done: true,
                  },
                  {
                    title: '3. Validação do Empregador / Folha',
                    desc: selectedPortForCert.nomeEmpregador
                      ? `Conferência do CNPJ ${selectedPortForCert.cnpjEmpregador || ''} na folha`
                      : 'Análise de conformidade cadastral',
                    done: selectedPortForCert.status === 'concluida',
                  },
                  {
                    title: '4. Direcionamento Automático Efetivado',
                    desc: 'Salário creditado automaticamente no banco de destino no mesmo dia útil sem tarifas',
                    done: selectedPortForCert.status === 'concluida',
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 rounded-lg text-xs"
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      step.done
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                    }`}>
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div>
                      <p className={`font-semibold ${step.done ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Notice */}
            <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/60 rounded-xl text-[11px] text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">Garantias Legais & Segurança:</p>
              <p>• Gratuidade total (É vedada a cobrança de qualquer tarifa conforme Art. 2º da Resolução nº 3.402).</p>
              <p>• Prazo de processamento máximo de 5 dias úteis a contar do protocolo.</p>
              <p>• Transmissão criptografada via certificados mTLS homologados pela autoridade do Banco Central.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`Protocolo Portabilidade Bacen: ${selectedPortForCert.protocolo}`);
                  onShowToast('Protocolo de portabilidade copiado!', 'success');
                }}
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700"
              >
                Copiar Protocolo
              </button>
              <button
                type="button"
                onClick={() => setSelectedPortForCert(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
