// Data normalization helpers
export function unwrapPayload(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const obj = payload as { data?: unknown };
    return obj.data;
  }
  return payload;
}

export function normalizeProductList(payload: unknown): any[] {
  const level1 = unwrapPayload(payload);
  const level2 = unwrapPayload(level1);
  if (Array.isArray(level2)) {
    return level2 as any[];
  }
  return [];
}

export function normalizeProductObject(payload: unknown): any | null {
  const level1 = unwrapPayload(payload);
  const level2 = unwrapPayload(level1);
  if (level2 && typeof level2 === 'object' && !Array.isArray(level2)) {
    return level2 as any;
  }
  return null;
}
