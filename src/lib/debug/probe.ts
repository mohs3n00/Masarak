/**
 * DIAGNOSTIC PROBE — نقطة تشخيصية مؤقتة
 * يُطبع هذا الملف في Console كل استدعاءات إعادة التوجيه بالترتيب الزمني
 * مع قيم: pathname / isAuthenticated / role / isReady / userId
 */

let _callOrder = 0;

export function probeLog(
  source: string,
  action: string,
  state: {
    pathname?: string;
    isAuthenticated?: boolean;
    role?: string | null;
    isReady?: boolean;
    userId?: string | null;
    redirectTarget?: string;
    reason?: string;
  }
) {
  const order = ++_callOrder;
  const ts = new Date().toISOString().split('T')[1].slice(0, 12);
  const isRedirect = action.toLowerCase().includes('redirect');
  
  const style = isRedirect ? 'background:#ff4444;color:white;font-weight:bold;padding:2px 6px;border-radius:3px' : 'background:#2266cc;color:white;padding:2px 6px;border-radius:3px';
  
  console.log(
    `%c[#${order}] [${ts}] [${source}] ${action}%c\n  pathname=${state.pathname ?? '—'}\n  isAuthenticated=${state.isAuthenticated ?? '—'}\n  role=${state.role ?? '—'}\n  isReady=${state.isReady ?? '—'}\n  userId=${state.userId ?? '—'}${state.redirectTarget ? `\n  → REDIRECT TO: ${state.redirectTarget}` : ''}${state.reason ? `\n  reason: ${state.reason}` : ''}`,
    style,
    'color:inherit'
  );
  
  // Stack trace only for redirects
  if (isRedirect) {
    console.trace(`  [STACK TRACE for redirect #${order}]`);
  }
}
