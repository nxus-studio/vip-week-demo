const counters: Record<string, number> = {};

export function nextId(prefix: string): string {
  counters[prefix] = (counters[prefix] ?? 0) + 1;
  return `${prefix}-${String(counters[prefix]).padStart(4, '0')}`;
}

export function resetIds(): void {
  for (const key of Object.keys(counters)) delete counters[key];
}

// resetIds() exists for tests only.
