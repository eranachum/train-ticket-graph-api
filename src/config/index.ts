import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface Config {
  server: {
    port: number;
    nodeEnv: string;
  };
  graph: {
    filePath: string;
  };
  api: {
    prefix: string;
  };
  logging: {
    level: string;
  };
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

function getEnvNumber(name: string, defaultValue?: number): number {
  const value = getEnvVar(name, defaultValue?.toString());
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number, got: ${value}`);
  }
  return parsed;
}

export const config: Config = {
  server: {
    port: getEnvNumber('PORT', 3000),
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
  },
  graph: {
    filePath: getEnvVar('GRAPH_FILE_PATH', './src/train-ticket-be.json'),
  },
  api: {
    prefix: getEnvVar('API_PREFIX', '/api'),
  },
  logging: {
    level: getEnvVar('LOG_LEVEL', 'info'),
  }
};

export default config;
