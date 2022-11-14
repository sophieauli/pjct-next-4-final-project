import { sql } from './connect';
import { Guest } from './guests_table';
import { Session } from './sessions_table';

export type CookieTokenAttendingGuests = {
  guest_id: number;
  cookie_token_attending_guests: string;
};

export async function createEventCookieToken(
  guestId: Guest['id'],
  cookie_token_attending_guests: string,
) {
  const [eventCookieToken] = await sql<CookieTokenAttendingGuests[]>`
  INSERT INTO events_guests
    (cookie_token_attending_guests, guest_id)
  VALUES
    (${cookie_token_attending_guests}, ${guestId})
  RETURNING
    id,
    cookie_token_attending_guests
  `;
  // every time we create a new session by placing a cookie we delete the old one meaning:

  // await deleteExpiredSessions();

  return eventCookieToken;
}

// export async function deleteExpiredToken() {
//   const [eventCookieToken] = await sql<CookieTokenAttendingGuests[]>`
//   DELETE FROM
//   events_guests
//   WHERE expiry_timestamp < now()
//   RETURNING
//   id,
//   token`;

//   return eventCookieToken;
// }

//-> regarding expiry timestamp: ask Jose...

export async function getEventByCookieToken(token: Session['token']) {
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
