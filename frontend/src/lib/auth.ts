/**
 * Restituisce gli header HTTP con Authorization: Basic per le chiamate alle API protette.
 * Le credenziali (email + password) vengono lette da localStorage dove vengono salvate al login.
 */
export function getAuthHeaders(extra: Record<string, string> = {}): Record<string, string> {
  if (typeof window === 'undefined') return extra;

  const raw = localStorage.getItem('credentials');
  if (!raw) return extra;

  const { email, password } = JSON.parse(raw);
  const encoded = btoa(`${email}:${password}`);

  return {
    Authorization: `Basic ${encoded}`,
    ...extra,
  };
}
