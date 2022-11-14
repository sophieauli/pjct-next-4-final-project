import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { createEventCookieToken } from '../../database/events_guests_table';
import { createEvent, getEventByEventId } from '../../database/events_table';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';

// import { createCsrfSecret } from '../../utils/csrf';

// body is part of the message we send with our api, we can also define its data type:

export type CreateEventResponseBody =
  | { errors: [{ message: string }] }
  | { event: { eventName: string } };
// above we are defining that there is an object type with a property called errors and user that could contain an array of one or more objects with a message.

export default async function CreateEventHandler(
  request: NextApiRequest,
  response: NextApiResponse<CreateEventResponseBody>,
) {
  if (request.method === 'POST') {
    // 1. check whether data is stored:

    if (
      // checking whether it is provided as a string:
      typeof request.body.eventName !== 'string' ||
      typeof request.body.location !== 'string' ||
      typeof request.body.dateTime !== 'number' ||
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
    // 2. check whether user has already been registered:

    const user = await getEventByEventId(request.body.username);
    if (user) {
      return response.status(401).json({
        errors: [{ message: 'A user with this username already exists.' }],
      });
    }
    // 3. if all good hash the given password:
    const passwordHash = await bcrypt.hash(request.body.password, 12);
    console.log(passwordHash);

    // 4. run the sql query to create the record in the database:

    const eventWithAllInfo = await createEvent(
      request.body.id,
      request.body.event_name,
      request.body.location,
      request.body.date_time,
      request.body.description,
      request.body.host_user_id,
    );

    // 5. optional: create a csrf token, which is a secret, user-specific token to prevent Cross-Site Request Forgeries:
    //   const secret = await await createCsrfSecret();
    // }

    // 6.Create a token and serialize a cookie with the token:

    const guestSession = await createEventCookieToken(
      eventWithAllInfo.id,
      crypto.randomBytes(80).toString('base64'),
    );

    const serializedGuestCookie = createSerializedRegisterSessionTokenCookie(
      guestSession.cookie_token_attending_guests,
    );

    response
      .status(200)
      .setHeader('Set-Cookie', serializedGuestCookie)
      .json({ event: { eventName: eventWithAllInfo.eventName } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
