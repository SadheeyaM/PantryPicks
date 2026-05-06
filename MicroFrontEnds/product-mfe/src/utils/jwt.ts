// JWT parsing helpers
export function parseJwtPayload(token: string | null): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

export function readUserIdFromToken(): number | null {
  const accessPayload = parseJwtPayload(window.localStorage.getItem('accessToken'));
  const idPayload =
    parseJwtPayload(window.localStorage.getItem('idToken')) ||
    parseJwtPayload(window.localStorage.getItem('id_token'));
  const candidate = accessPayload?.userId ?? accessPayload?.id ?? idPayload?.userId ?? idPayload?.id;
  const numeric = Number(candidate);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}
