import { sql } from './connect';

// import { User } from './users';

export type Event = {
  id: number;
  eventName: string;
  location: string;
  dateTime: string;
  description: string;
  hostUserId: number;
};

export async function createEvent(
  id: number,
  event_name: string,
  location: string,
  date_time: number,
  description: string,
  host_user_id: number,
) {
  const [event] = await sql<{ id: number; eventName: string }[]>`
  INSERT INTO events
    (event_name, location, date_time, description, host_user_id)
  VALUES
    (${event_name}, ${location}, ${date_time}, ${description}, ${host_user_id})
  RETURNING
    id,
    eventName,
    location,
    dateTime,
    description,
    hostUserId
  `;

  return event!;
}

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
