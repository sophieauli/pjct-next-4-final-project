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
  dateTime: number,
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

export async function getHostEvents(host_user_id: number) {
  // if (!host_user_id) return undefined;

  const hostEvent = await sql<HostEvent[]>`
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
