import { sql } from './connect';
import { User } from './users';

// import { User } from './users';

export type HostEvent = {
  id: number;
  eventName: string;
  location: string;
  dateTime: string;
  description: string;
  hostUserId: number;
};

export type Event = {
  id: number;
  eventName: string;
  location: string;
  dateTime: string;
  description: string;
  hostUserId: number;
};

export async function createEvent(
  eventName: string,
  location: string,
  dateTime: string,
  description: string,
  hostUserId: number,
) {
  const [newEvent] = await sql<{ id: number; eventName: string }[]>`
  INSERT INTO events
    (event_name, location, date_time, description, host_user_id)
  VALUES
    (${eventName}, ${location}, ${dateTime}, ${description}, ${hostUserId})
  RETURNING
    *
  `;

  return newEvent!;
}

export async function getAllEvents() {
  const events = await sql<Event[]>`
  SELECT
    *
  FROM
    events
    `;
  return events;
}

export async function getEventByEventId(id: number) {
  const eventId = await sql<Event[]>`
  SELECT
    *
  FROM
    events
  WHERE
    events.id = ${id}
    `;

  return eventId;
}

export async function getEventsByHostId(userId: number) {
  // if (!hostEvents) return undefined;

  const hostEvents = await sql<HostEvent[]>`
  SELECT
    *
  FROM
    events
    -- users
  WHERE
    events.host_user_id = ${userId}
    `;

  return hostEvents;
}

export async function getSingleHostEventById(eventId: number, userId: number) {
  const hostEventId = await sql<HostEvent[]>`
  SELECT * FROM events WHERE id = ${eventId} AND host_user_id = ${userId}`;
  return hostEventId;
}
