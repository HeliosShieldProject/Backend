export const colored = (level: string) => {
  const colors = {
    info: "\x1b[36m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    debug: "\x1b[35m",
    http: "\x1b[34m",
    verbose: "\x1b[32m",
  };
  return `${colors[level]}${level.toUpperCase().padEnd(7)}\x1b[0m`;
};