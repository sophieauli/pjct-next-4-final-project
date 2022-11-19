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

export async function createEvent(
  userId: User['id'],
  eventName: string,
  location: string,
  dateTime: string,
  description: string,
) {
  const [newEvent] = await sql<Event[]>`
  INSERT INTO events
    (event_name, location, date_time, description, host_user_id)
  VALUES
    (${eventName}, ${location}, ${dateTime}, ${description}, ${userId})
  RETURNING
    *
  `;

  return newEvent!;
}

export async function getAllEvents() {
  const events = await sql`
  SELECT
    *
  FROM
    events
    `;

  return events;
}

export async function getEventByEventId(id: number) {
  const [eventId] = await sql<Event[]>`
  SELECT
    *
  FROM
    events
  WHERE
    id = ${id}
    `;

  return eventId;
}
// export async function getEventByEventId(id: number) {
//   if (!id) return undefined;

//   const [eventId] = await sql<Event[]>`
//   SELECT
//     id,
//     eventName
//   FROM
//     events
//   WHERE
//     events.eventId = ${id}
//     `;

//   return eventId;
// }

export async function getHostEvents(host_user_id: string) {
  if (!host_user_id) return undefined;

  const [hostEvent] = await sql<Event[]>`
  SELECT
    events.id,
    events.event_name,
    events.location,
    events.date_time,
    events.description,
    events.host_user_id
  FROM
    events,
    users
  WHERE
    events.host_user_id = users.id
    `;

  return hostEvent;
}
