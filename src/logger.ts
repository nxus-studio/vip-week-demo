export type Level = 'info' | 'warn' | 'error';

const history: string[] = [];

export function log(level: Level, message: string): void {
  const line = `[${level}] ${message}`;
  history.push(line);
  if (level === 'info') console.log(line);
  else console.error(line);
}

export function recentLogs(limit = 20): string[] {
  return history.slice(-limit);
}

// levels: info < warn < error; nothing is written below the configured level.
