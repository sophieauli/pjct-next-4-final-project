import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { createEvent, Event, getEventByEventId } from '../../database/events';
import { createEventCookieToken } from '../../database/events_guests';
import { Guest } from '../../database/guests';
import { getUserBySessionToken, User } from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';

type Props = {
  guest: Guest;
  user?: User;
  event: Event;
};

// import { createCsrfSecret } from '../../utils/csrf';

// body is part of the message we send with our api, we can also define its data type:

export type CreateEventResponseBody =
  | { errors: [{ message: string }] }
  | { event: { eventName: string } };
// above we are defining that there is an object type with a property called errors and user that could contain an array of one or more objects with a message.

export default async function CreateEventHandler(
  // const eventName = request.body.eventName
  request: NextApiRequest,
  response: NextApiResponse<CreateEventResponseBody>,
) {
  if (request.method === 'POST') {
    // 1. check whether data is stored:
    const token = request.cookies.sessionToken;
    const user = token && (await getUserBySessionToken(token));
    if (user) {
      const id = user.id;
      const userId = id;
    }
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
        errors: [
          {
            message:
              'event information not provided correctly - please fill out every input field.',
          },
        ],
      });
    }
    // 2. check whether event has already been created - not necessary - maybe by date?:

    const event = await getEventByEventId(request.body.event_id);
    const userId = user?.id;
    if (event) {
      return response.status(401).json({
        errors: [{ message: 'This event already exists.' }],
      });
    }
    // 3. run the sql query to create the record in the database:

    const eventWithAllInfo = await createEvent(
      request.body.eventName,
      request.body.location,
      request.body.dateTime,
      request.body.description,
      userId,
    );

    // console.log(eventWithAllInfo);
    // console.log(request.body.id);
    // console.log(user.id);
    // console.log(userId);
    // console.log(user);
    // insertIntoEventGuestTable
    // twilio REST API

    // 5. optional: create a csrf token, which is a secret, user-specific token to prevent Cross-Site Request Forgeries:
    //   const secret = await await createCsrfSecret();
    // }

    // 6.Create a token and serialize a cookie with the token:

    // const guestSession = await createEventCookieToken(
    //   eventWithAllInfo.id,
    //   crypto.randomBytes(80).toString('base64'),
    // );

    // 7. create an id:

    // const serializedGuestCookie = createSerializedRegisterSessionTokenCookie(
    //   guestSession.cookie_token_attending_guests,
    // );

    response
      .status(200)
      //     .setHeader('Set-Cookie', serializedGuestCookie)
      .json({ event: { eventName: eventWithAllInfo.eventName } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
