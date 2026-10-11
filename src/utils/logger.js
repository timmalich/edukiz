const isDev = import.meta.env.DEV;

export const logger = {
  error: (...args) => {
    if (isDev) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  },
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },
  // Always log version info in production
  version: (...args) => {
    console.log(...args);
  },
};

export default logger;
