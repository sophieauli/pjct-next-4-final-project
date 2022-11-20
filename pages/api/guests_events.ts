import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { createEvent, Event, getEventByEventId } from '../../database/events';
import { createGuestByEventId } from '../../database/events_guests';
import { getGuestIdByGuestId, Guest } from '../../database/guests';

type Props = {
  guest: Guest;
  event: Event;
};

export type CreateGuestByIdResponseBody =
  | { errors: [{ message: string }] }
  | Guest
  | Event;
// | { event: { eventName: string } };

export default async function createGuestByEventIdHandler(
  request: NextApiRequest,
  response: NextApiResponse<CreateGuestByIdResponseBody>,
) {
  if (request.method === 'POST') {
    // get the guestId from the database:
    const guestId = await getGuestIdByGuestId(request.body.id);
    const eventId = await getEventByEventId(request.body.id);

    // if (
    //   typeof request.body.userId !== 'number' ||
    //   typeof request.body.guestId !== 'number' ||
    //   !request.body.userId ||
    //   !request.body.guestId
    // ) {
    //   return response.status(400).json({
    //     errors: [{ message: 'guest id and event id not provided correctly' }],
    //   });;
    // }

    console.log(request.body.userId);
    console.log(request.body.guestId);
    // run sql query to create joint table entry:

    const eventGuest = await createGuestByEventId(
      request.body.userId,
      request.body.guestId,
    );
    console.log(eventGuest);

    response.status(200).json();

    // return response.status(200).json(eventGuest);
    //     .setHeader('Set-Cookie', serializedGuestCookie)
    // .json({ eventGuest: { eventName: eventWithAllInfo.eventName } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
