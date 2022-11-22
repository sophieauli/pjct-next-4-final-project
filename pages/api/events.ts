import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { createEvent, getEventByEventId } from '../../database/events';
import { createGuestWithGuestTokenByEventId } from '../../database/events_guests';
import { Guest } from '../../database/guests';
import { getUserBySessionToken, User } from '../../database/users';
import {
  createSerializedCookieTokenAttendingGuests,
  createSerializedRegisterSessionTokenCookie,
} from '../../utils/cookies';

type Props = {
  guest: Guest;
  user: User;
  event: Event;
};

// body is part of the message we send with our api, we can also define its data type:

export type CreateEventResponseBody =
  | { errors: [{ message: string }] }
  | { event: { eventName: string } };
// above we are defining that there is an object type with a property called errors that could contain an array of one or more objects with a message and an event that could contain an object.

export default async function CreateEventHandler(
  // const eventName = request.body.eventName
  request: NextApiRequest,
  response: NextApiResponse<CreateEventResponseBody>,
) {
  if (request.method === 'POST') {
    // 1. check whether data is stored:
    const token = request.cookies.sessionToken;

    if (!token) {
      return response.status(400).json({
        errors: [{ message: 'token not found thus user not authorised' }],
      });
    }
    const user = await getUserBySessionToken(token);

    if (!user) {
      return response.status(400).json({
        errors: [{ message: 'user not found.' }],
      });
    }
    const id = user.id;
    const userId = id;
    // if (user) {
    //   const id = user.id;
    //   const userId = id;
    // }
    if (
      // checking whether it is provided as a string:
      typeof request.body.eventName !== 'string' ||
      typeof request.body.location !== 'string' ||
      typeof request.body.dateTime !== 'string' ||
      typeof request.body.description !== 'string' ||
      !request.body.eventName ||
      !request.body.location ||
      !request.body.dateTime ||
      !request.body.description
    ) {
      return response.status(400).json({
        errors: [{ message: 'event information not provided correctly.' }],
      });
    }

    // run the sql query to create the record in the database:

    const newEvent = await createEvent(
      request.body.eventName,
      request.body.location,
      request.body.dateTime,
      request.body.description,
      userId,
    );

    const guests = request.body.addedGuest;

    const eventInfo = [];

    // here we create a token for every guest by running a loop and running the crypto function for every loop:

    for (const guest of guests) {
      const guestToken = crypto
        .randomBytes(45)
        .toString('base64')
        .replace(/\//g, '_')
        .replace(/\+/g, '-') as string;

      // here we run the db query entering the event.id and guest.id as well as the token we created above:

      const fullEventInfo = await createGuestWithGuestTokenByEventId(
        newEvent.id,
        guest.id,
        guestToken,
      );
      // (this is where the sendinvite API will go)
      eventInfo.push(fullEventInfo);
    }

    console.log(guests);

    // 6. Since we already have the guestToken, all that's left is to serialize a cookie with the token. :

    // const serializedGuestCookie =
    //   await createSerializedCookieTokenAttendingGuests(guestToken.guestToken);

    response
      .status(200)
      // .setHeader('Set-Cookie', serializedGuestCookie)
      .json({ event: { eventName: newEvent.eventName } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}

//   eventWithAllInfo.id,
//   crypto.randomBytes(80).toString('base64'),
// );

// // 7. create a id:

// const serializedGuestCookie = createSerializedRegisterSessionTokenCookie(
//   guestSession.cookie_token_attending_guests,
// );
