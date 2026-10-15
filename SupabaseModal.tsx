import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { SUPABASE_SCHEMA_SQL } from '../../lib/supabaseSchemaSql';
import {
  isSupabaseConfigured,
  supabase,
  signInWithEmail,
  signUpWithEmail,
  signOutSupabase,
  getSupabaseUser,
} from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import {
  Database,
  Copy,
  Check,
  Download,
  KeyRound,
  ShieldCheck,
  User as UserIcon,
  LogIn,
  LogOut,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'auth' | 'tables'>('sql');
  const [copied, setCopied] = useState(false);

  // Supabase Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (isOpen && isSupabaseConfigured) {
      getSupabaseUser().then((u) => setCurrentUser(u));
    }
  }, [isOpen]);

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopied(true);
      onShowToast('Código SQL copiado para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Não foi possível copiar automaticamente.', 'error');
    }
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([SUPABASE_SCHEMA_SQL], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supabase_nexus_schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Download do arquivo schema.sql iniciado!', 'info');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      onShowToast(
        'Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu ambiente.',
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'login') {
        const { data, error } = await signInWithEmail(email, password);
        if (error) throw error;
        setCurrentUser(data.user);
        onShowToast(`Login efetuado com sucesso como ${data.user?.email}!`, 'success');
      } else {
        const { data, error } = await signUpWithEmail(email, password, name);
        if (error) throw error;
        setCurrentUser(data.user);
        onShowToast('Conta criada no Supabase! Verifique seu e-mail caso solicitado.', 'success');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Erro na autenticação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOutSupabase();
      setCurrentUser(null);
      onShowToast('Você saiu da sua conta Supabase.', 'info');
    } catch (err: any) {
      onShowToast(err.message || 'Erro ao sair.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tablesList = [
    {
      name: 'profiles',
      desc: 'Perfis de usuários vinculados automaticamente à tabela auth.users pelo trigger handle_new_user.',
      cols: 'id (UUID), email, nome, avatar_url, criado_em',
      rls: 'Usuário só visualiza e edita seu próprio perfil.',
    },
    {
      name: 'accounts',
      desc: 'Contas bancárias, carteiras físicas e contas de investimento com saldo base.',
      cols: 'id, user_id, nome, tipo, saldo_inicial, instituicao, cor',
      rls: 'Restrito por user_id = auth.uid()',
    },
    {
      name: 'credit_cards',
      desc: 'Cartões de crédito com controle de limite total e dias de fechamento/vencimento.',
      cols: 'id, user_id, nome, limite_total, dia_fechamento, dia_vencimento, bandeira',
      rls: 'Restrito por user_id = auth.uid()',
    },
    {
      name: 'transactions',
      desc: 'Livro-razão de receitas, despesas (fixas/variáveis) e transferências.',
      cols: 'id, user_id, tipo, subtipo, valor, categoria, data, descricao, conta_id, cartao_id, tags, status',
      rls: 'Restrito por user_id = auth.uid()',
    },
    {
      name: 'financial_goals',
      desc: 'Metas financeiras / caixinhas de poupança com barra de progresso.',
      cols: 'id, user_id, titulo, categoria, valor_alvo, valor_atual, data_limite, cor, icone',
      rls: 'Restrito por user_id = auth.uid()',
    },
    {
      name: 'tasks',
      desc: 'Tarefas em lista e quadro Kanban com prioridades e prazos.',
      cols: 'id, user_id, titulo, descricao, prioridade, status, concluida, categoria, vencimento',
      rls: 'Restrito por user_id = auth.uid()',
    },
    {
      name: 'habits & habit_logs',
      desc: 'Rastreador de hábitos contínuos e tabela de histórico diário com controle de sequência (streaks).',
      cols: 'id, user_id, nome, frequencia, meta_diaria / habit_logs (habit_id, data_conclusao)',
      rls: 'Restrito por user_id = auth.uid()',
    },
    {
      name: 'notes',
      desc: 'Bloco de notas livre, itens fixados no topo e compromissos com data e hora.',
      cols: 'id, user_id, titulo, conteudo, fixado, categoria, compromisso_data_hora, tags',
      rls: 'Restrito por user_id = auth.uid()',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Integração Supabase: Banco de Dados & Login"
      description="Script SQL completo com tabelas, Row Level Security (RLS) e autenticação de usuários."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'sql'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Código SQL (Schema)
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'auth'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Login & Autenticação
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'tables'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Estrutura & RLS ({tablesList.length})
          </button>
        </div>

        {/* TAB 1: SQL SCHEMA CODE */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-neutral-600 dark:text-neutral-300">
                  Compatível com <strong>Supabase PostgreSQL</strong> (com RLS e Auth triggers)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySQL}
                  className="flex items-center gap-1 px-3 py-1.5 font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-md transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
                </button>
                <button
                  onClick={handleDownloadSQL}
                  className="flex items-center gap-1 px-3 py-1.5 font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .sql</span>
                </button>
              </div>
            </div>

            {/* Step-by-step guidance */}
            <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Como aplicar no seu projeto Supabase:
              </p>
              <ol className="list-decimal list-inside space-y-0.5 ml-1">
                <li>
                  Acesse seu painel no{' '}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 underline inline-flex items-center gap-0.5"
                  >
                    Supabase Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>No menu lateral esquerdo, clique em <strong>SQL Editor</strong> e depois em <strong>New Query</strong>.</li>
                <li>Clique no botão <strong>Copiar SQL</strong> acima, cole no editor do Supabase e clique em <strong>Run</strong>.</li>
                <li>O script cria automaticamente todas as tabelas, triggers para novos usuários e políticas de segurança RLS!</li>
              </ol>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="p-4 bg-neutral-950 text-neutral-200 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-[380px] selection:bg-emerald-500/30 border border-neutral-800">
                <code>{SUPABASE_SCHEMA_SQL}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: AUTH & LOGIN */}
        {activeTab === 'auth' && (
          <div className="space-y-4">
            {currentUser ? (
              <div className="p-5 border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Conectado ao Supabase
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-white dark:bg-neutral-800 border border-rose-200 dark:border-rose-900 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sair
                  </button>
                </div>
                <div className="text-xs text-neutral-500 pt-2 border-t border-emerald-100 dark:border-emerald-900/50">
                  <span>ID do Usuário (UUID): </span>
                  <code className="font-mono text-[11px] bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">
                    {currentUser.id}
                  </code>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {!isSupabaseConfigured && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                    <p className="font-semibold mb-1">Conexão com o Supabase:</p>
                    <p>
                      Para autenticação em nuvem ao vivo, adicione suas credenciais no arquivo <code>.env</code> ou variáveis de ambiente:
                    </p>
                    <div className="mt-2 font-mono text-[11px] bg-white/80 dark:bg-neutral-900/80 p-2 rounded border border-amber-300 dark:border-amber-700">
                      VITE_SUPABASE_URL="https://seu-projeto.supabase.co"<br />
                      VITE_SUPABASE_ANON_KEY="sua-chave-anon"
                    </div>
                    <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">
                      Enquanto isso, todos os dados continuam salvos com segurança em LocalStorage!
                    </p>
                  </div>
                )}

                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {authMode === 'login' ? 'Entrar com Conta Supabase' : 'Cadastrar no Supabase'}
                    </h4>
                    <div className="flex text-xs">
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className={`px-2.5 py-1 rounded-l-md font-medium ${
                          authMode === 'login'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
                        }`}
                      >
                        Entrar
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className={`px-2.5 py-1 rounded-r-md font-medium ${
                          authMode === 'signup'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
                        }`}
                      >
                        Cadastrar
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-3">
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Nome Completo</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Rafael Carvalho"
                          className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">E-mail *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Senha *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      {loading
                        ? 'Processando...'
                        : authMode === 'login'
                        ? 'Acessar Conta Supabase'
                        : 'Criar Conta no Supabase'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TABLE BREAKDOWN & RLS */}
        {activeTab === 'tables' && (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                Todas as tabelas possuem <strong>Row Level Security (RLS)</strong> ativado. Cada usuário só consegue ler, gravar e modificar registros onde <code>user_id = auth.uid()</code>.
              </span>
            </div>

            <div className="space-y-2">
              {tablesList.map((t) => (
                <div
                  key={t.name}
                  className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      public.{t.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                      RLS Ativo
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">{t.desc}</p>
                  <p className="text-[10px] font-mono text-neutral-400 truncate">
                    Colunas: {t.cols}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
