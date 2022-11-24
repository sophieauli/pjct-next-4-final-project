import { Dispatch, SetStateAction } from 'react';
import { sql } from './connect';
import { Event } from './events';
import { Guest } from './guests';
import { Session } from './sessions';

// export type CookieTokenAttendingGuests = {
//   guest_id: number;
//   cookie_token_attending_guests: string;
// };

export type GuestEventInfo = {
  eventId: number;
  guestId: number;
  guestToken: string;
  isAttending: boolean;
};

export async function createGuestWithGuestTokenByEventId(
  eventId: number,
  guestId: number,
  guestToken: string,
  isAttending: boolean,
) {
  const [guest] = await sql`
INSERT INTO events_guests
(event_id, guest_id, cookie_token_attending_guests, is_attending)
VALUES
(${eventId}, ${guestId}, ${guestToken}, ${isAttending})
RETURNING
event_id,
guest_id,
cookie_token_attending_guests,
is_attending
`;
}

export async function updateAttendanceGuest(
  isAttending: boolean,
  guestToken: string,
) {
  const statusAttendance = await sql`
  UPDATE events_guests
  SET is_attending = ${isAttending}
  WHERE cookie_token_attending_guests = ${guestToken}

  RETURNING is_attending
  `;
}

export async function getInvitedGuestIds(eventId: number) {
  const attendingGuest = await sql<GuestEventInfo[]>`
  SELECT guest_id
  FROM events_guests
  WHERE event_id = ${eventId}
  `;
  return attendingGuest;
}

export async function getAttendingGuestIds(eventId: number) {
  const attendingGuest = await sql<GuestEventInfo[]>`
  SELECT guest_id
  FROM events_guests
  WHERE event_id = ${eventId}
  AND is_attending = ${true}
  `;
  return attendingGuest;
}

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
