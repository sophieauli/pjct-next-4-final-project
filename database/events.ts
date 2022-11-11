import { sql } from './connect';
import { User } from './users';

export type Event = {
  id: number;
  eventName: string;
  location: string;
  dateTime: string;
  description: string;
  hostUserId: number;
};

export async function getEvents(id: string) {
  if (!id) return undefined;

  const [eventId] = await sql<Event[]>`
  SELECT
    *
  FROM
    events
    `;

  return eventId;
}

export async function getEventByEventId(id: string) {
  if (!id) return undefined;

  const [eventId] = await sql<Event[]>`
  SELECT
    id,
    eventName
  FROM
    events
  WHERE
    events.eventId = ${id}
    `;

  return eventId;
}
