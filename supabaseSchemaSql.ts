export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- NEXUS - SUPABASE SQL SCHEMA & AUTH SETUP
-- Plataforma de Controle Financeiro & Organização Pessoal
-- ==============================================================================
-- Este script cria todas as tabelas, funções, triggers de autenticação e
-- políticas de segurança (Row Level Security - RLS) para o Supabase.
--
-- COMO EXECUTAR NO SUPABASE:
-- 1. Acesse o painel do Supabase (https://supabase.com/dashboard)
-- 2. Vá em 'SQL Editor' -> 'New Query'
-- 3. Cole todo este código e clique em 'Run' (Executar)
-- ==============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABELA DE PERFIS DE USUÁRIO (VINCULADA AO SUPABASE AUTH)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nome TEXT,
  avatar_url TEXT,
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Habilitar RLS no perfil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger para criar perfil automaticamente após cadastro no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove trigger antigo se existir e recria
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 2. CONTAS BANCÁRIAS E CARTEIRAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupanca', 'investimento', 'carteira')),
  saldo_inicial NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  instituicao TEXT NOT NULL,
  cor TEXT DEFAULT '#8B5CF6' NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam apenas suas próprias contas"
  ON public.accounts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);


-- ==============================================================================
-- 3. CARTÕES DE CRÉDITO
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.credit_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  limite_total NUMERIC(15, 2) NOT NULL DEFAULT 1000.00,
  dia_fechamento INT NOT NULL CHECK (dia_fechamento BETWEEN 1 AND 31),
  dia_vencimento INT NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
  bandeira TEXT DEFAULT 'Mastercard' NOT NULL,
  ultimos_digitos VARCHAR(4) DEFAULT '0000' NOT NULL,
  cor TEXT DEFAULT '#1E293B' NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam apenas seus próprios cartões"
  ON public.credit_cards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_credit_cards_user_id ON public.credit_cards(user_id);


-- ==============================================================================
-- 4. TRANSAÇÕES FINANCEIRAS (RECEITAS, DESPESAS E TRANSFERÊNCIAS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('despesa', 'receita', 'transferencia')),
  subtipo TEXT CHECK (subtipo IN ('fixa', 'variavel') OR subtipo IS NULL),
  valor NUMERIC(15, 2) NOT NULL CHECK (valor > 0),
  categoria TEXT NOT NULL,
  data DATE NOT NULL,
  descricao TEXT NOT NULL,
  conta_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT,
  conta_destino_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT,
  cartao_id UUID REFERENCES public.credit_cards(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pago' NOT NULL CHECK (status IN ('pago', 'pendente')),
  observacoes TEXT,
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam apenas suas próprias transações"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_cat ON public.transactions(user_id, categoria);
CREATE INDEX IF NOT EXISTS idx_transactions_conta ON public.transactions(conta_id);


-- ==============================================================================
-- 5. METAS FINANCEIRAS (CAIXINHAS DE POUPANÇA)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.financial_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  categoria TEXT DEFAULT 'Reserva' NOT NULL,
  valor_alvo NUMERIC(15, 2) NOT NULL CHECK (valor_alvo > 0),
  valor_atual NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (valor_atual >= 0),
  data_limite DATE,
  cor TEXT DEFAULT '#10B981' NOT NULL,
  icone TEXT DEFAULT 'shield' NOT NULL,
  notas TEXT,
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam apenas suas próprias metas"
  ON public.financial_goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.financial_goals(user_id);


-- ==============================================================================
-- 6. TAREFAS PESSOAIS & PROFISSIONAIS (TO-DO & KANBAN)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  prioridade TEXT NOT NULL CHECK (prioridade IN ('Baixa', 'Media', 'Alta')) DEFAULT 'Media',
  status TEXT NOT NULL CHECK (status IN ('a_fazer', 'em_andamento', 'concluida')) DEFAULT 'a_fazer',
  concluida BOOLEAN NOT NULL DEFAULT false,
  categoria TEXT DEFAULT 'Trabalho' NOT NULL,
  vencimento DATE,
  tags TEXT[] DEFAULT '{}',
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam apenas suas próprias tarefas"
  ON public.tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_vencimento ON public.tasks(user_id, vencimento);


-- ==============================================================================
-- 7. RASTREADOR DE HÁBITOS & ROTINAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT DEFAULT 'Saúde' NOT NULL,
  frequencia TEXT NOT NULL CHECK (frequencia IN ('Diária', 'Semanal', 'Dias úteis')) DEFAULT 'Diária',
  meta_diaria TEXT,
  cor TEXT DEFAULT '#06B6D4' NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam apenas seus próprios hábitos"
  ON public.habits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);

-- Registro diário de cumprimento de hábitos
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  data_conclusao DATE NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(habit_id, data_conclusao)
);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam apenas seus próprios registros de hábitos"
  ON public.habit_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habit_logs_query ON public.habit_logs(habit_id, data_conclusao);


-- ==============================================================================
-- 8. AGENDA & BLOCO DE NOTAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT DEFAULT '' NOT NULL,
  fixado BOOLEAN DEFAULT false NOT NULL,
  categoria TEXT DEFAULT 'Geral' NOT NULL,
  compromisso_data_hora TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  cor TEXT DEFAULT '#3B82F6',
  criado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam apenas suas próprias anotações"
  ON public.notes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notes_user_pinned ON public.notes(user_id, fixado DESC, atualizado_em DESC);


-- ==============================================================================
-- 9. FUNÇÃO PARA ATUALIZAÇÃO AUTOMÁTICA DE 'atualizado_em'
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de atualização automática para cada tabela
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'atualizado_em' 
      AND table_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trigger_set_timestamp ON public.%I;', t);
    EXECUTE format('CREATE TRIGGER trigger_set_timestamp BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();', t);
  END LOOP;
END;
$$;
`;
