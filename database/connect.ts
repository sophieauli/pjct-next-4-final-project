import { config } from 'dotenv-safe';
import postgres from 'postgres';

// config function loads all variables from .env file

config();

// typescript type for connection function:
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

function connectOneTimeToDatabase() {
  if (!globalThis.postgresSqlClient) {
    globalThis.postgresSqlClient = postgres({
      transform: {
        ...postgres.camel,
        undefined: null,
      },
    });
  }
  const sql = globalThis.postgresSqlClient;
  return sql;
}
// connect to PostgreSQL:
export const sql = connectOneTimeToDatabase();
