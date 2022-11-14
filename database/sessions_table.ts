import { sql } from './connect';
import { User } from './users_table';

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
  // every time we create a new session by placing a cookie we delete the old one meaning:

  await deleteExpiredSessions();

  return session;
}

export async function getValidSessionByToken(token: Session['token']) {
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

export async function deleteExpiredSessions() {
  const [session] = await sql<Session[]>`
  DELETE FROM
  sessions
  WHERE expiry_timestamp < now()
  RETURNING
  id,
  token`;

  return session;
}

// here we are getting the token from the cookie from the person that is going to the page logout, passing that token to the function that will delete the db entry wherever this token exists:

export async function deleteSessionByToken(token: string) {
  const [session] = await sql<Session[]>`
  DELETE FROM
  sessions
  WHERE
  sessions.token = ${token}
  RETURNING
  id,
  token`;

  return session;
}
