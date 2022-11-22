import { sql } from './connect';
import { Guest } from './guests';
import { Session } from './sessions';

// export type CookieTokenAttendingGuests = {
//   guest_id: number;
//   cookie_token_attending_guests: string;
// };

export type GuestEventInfo = {
  event_id: number;
  guest_id: number;
  guestToken: string;
};

export async function createGuestWithGuestTokenByEventId(
  eventId: number,
  guestId: number,
  guestToken: string,
) {
  const [guest] = await sql`
INSERT INTO events_guests
(event_id, guest_id, cookie_token_attending_guests)
VALUES
(${eventId}, ${guestId}, ${guestToken})
RETURNING
event_id,
guest_id,
cookie_token_attending_guests
`;
}

// export async function getGuestByEventIdAndGuestToken(
//   eventId: number,
//   guestToken: string,
// ) {
//   const [token] = await sql<GuestEventInfo[]>`
//   SELECT
//   event_id,
//   cookie_token_attending_guests
//   FROM events_guests
//   WHERE
//   events_guests.event_id = ${eventId} AND
//   events_guests.cookie_token_attending_guests = ${guestToken}
//   `;

//   return token;
// }

export async function getGuestByEventIdAndGuestToken(
  eventId: number,
  guestToken: string,
) {
  if (!guestToken) return undefined;
  if (!eventId) return undefined;
  const [guest] = await sql<{ id: number; guestToken: string }[]>`
  SELECT
  event_id,
  cookie_token_attending_guests
  FROM events_guests
  WHERE
  event_id = ${eventId} AND
  cookie_token_attending_guests = ${guestToken}
  `;

  return guest;
}

// export async function createEventCookieToken(
//   guestId: Guest['id'],
//   cookie_token_attending_guests: string,
// ) {
//   const [eventCookieToken] = await sql<CookieTokenAttendingGuests[]>`
//   INSERT INTO events_guests
//     (cookie_token_attending_guests, guest_id)
//   VALUES
//     (${cookie_token_attending_guests}, ${guestId})
//   RETURNING
//     id,
//     cookie_token_attending_guests
//   `;
// every time we create a new session by placing a cookie we delete the old one meaning:

// await deleteExpiredSessions();

//   return eventCookieToken;
// }

// export async function getEventByCookieToken(
//   cookie_token_attending_guests: string,
// ) {
//   if (!cookie_token_attending_guests) return undefined;
//   const [guest] = await sql<CookieTokenAttendingGuests[]>`
//   SELECT
//     *
//   FROM
//     events,
//     events_guests
//   WHERE
//     events_guests.cookie_token_attending_guests = ${cookie_token_attending_guests}
//   AND
//     events_guests.event_id = events.id
//   AND
//   sessions.expiry_timestamp > now() `;

//   return guest;
// }

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

//-> regarding expiry timestamp: ask Jose.
