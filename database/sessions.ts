import { sql } from './connect';
import { User } from './users';

export type Session = {
  // id: number; commented out because we do not want to expose the session id, the user id is enough:
  user_id: string;
  token: string;
  // expiryTimestamp: Date;
};

export async function createSession(userId: User['id'], token: string) {
  const [session] = await sql<Session[]>`
  INSERT INTO sessions
    (token, user_id)
  VALUES
    (${token}, ${userId})
  RETURNING
    id,
    token
  `;

  return session;
}

export async function getValidSessionByTOken(token: Session['token']) {
  if (!token) return undefined;

  const [session] = await sql<Session[]>`
  SELECT
    sessions.id,
    sessions.token
  FROM sessions
  WHERE
    sessions.token = ${token}
  AND
    sessions.expiry_timestamp > now()`;

  return session;
}
