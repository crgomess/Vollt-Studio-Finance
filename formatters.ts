export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateBR(dateString?: string): string {
  if (!dateString) return '-';
  // dateString in YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('pt-BR');
}

export function formatLongDateBR(dateString?: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return dateString;
}

export function formatDateTimeBR(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRecentDays(count: number = 7): { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] {
  const result = [];
  const today = new Date();
  const todayStr = getTodayString();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Short day name in pt-BR
    const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
    
    result.push({
      dateStr,
      dayName: dayName.slice(0, 3),
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }

  return result;
}

export function calculateHabitStreak(historico: string[]): { current: number; longest: number } {
  if (!historico || historico.length === 0) return { current: 0, longest: 0 };

  const sorted = Array.from(new Set(historico)).sort();
  const todayStr = getTodayString();
  
  // Find current streak backwards from today or yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yYear = yesterday.getFullYear();
  const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

  const set = new Set(sorted);
  let current = 0;
  let checkDate = new Date();

  // If today is completed, streak starts today, else if yesterday was completed, it starts from yesterday
  if (set.has(todayStr)) {
    checkDate = new Date();
  } else if (set.has(yesterdayStr)) {
    checkDate = yesterday;
  } else {
    current = 0;
  }

  if (set.has(todayStr) || set.has(yesterdayStr)) {
    while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const ds = `${year}-${month}-${day}`;
      if (set.has(ds)) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Longest streak
  let longest = 0;
  let running = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    if (running > longest) longest = running;
  }

  return { current, longest: Math.max(current, longest) };
}

export function getTaskDueStatus(vencimento?: string): { text: string; isOverdue: boolean; isDueToday: boolean } {
  if (!vencimento) return { text: '', isOverdue: false, isDueToday: false };
  const today = getTodayString();
  if (vencimento === today) {
    return { text: 'Vence hoje', isOverdue: false, isDueToday: true };
  }
  if (vencimento < today) {
    // calculate days late
    const d1 = new Date(vencimento);
    const d2 = new Date(today);
    const diff = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    return { text: `Atrasada há ${diff} dia${diff > 1 ? 's' : ''}`, isOverdue: true, isDueToday: false };
  }
  const d1 = new Date(today);
  const d2 = new Date(vencimento);
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return { text: `Vence em ${diff} dia${diff > 1 ? 's' : ''}`, isOverdue: false, isDueToday: false };
}

export const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: '#F59E0B',
  Moradia: '#3B82F6',
  Transporte: '#8B5CF6',
  Lazer: '#EC4899',
  Saúde: '#10B981',
  Educação: '#06B6D4',
  Salário: '#22C55E',
  Investimentos: '#6366F1',
  Serviços: '#64748B',
  Compras: '#F97316',
  Outros: '#71717A',
};
