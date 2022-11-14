import crypto from 'node:crypto';
import { request } from 'node:http';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  createGuest,
  getGuestByPhonenumber,
} from '../../database/guests_table';
import { createSession } from '../../database/sessions_table';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';

// body is part of the message we send with our api, we can also define its data type:

export type AddGuestResponseBody =
  | { errors: [{ message: string }] }
  | { guest: [{ id: string }] };
// above we are defining that there is an object type with a property called errors and user that could contain an array of one or more objects with a message.

export default async function GuestHandler(
  request: NextApiRequest,
  response: NextApiResponse<AddGuestResponseBody>,
);

// 1. check whether data was provided correctly as a string or number:
if (
  typeof request.body.guest_first_name !== 'string' ||
  typeof request.body.guest_last_name !== 'string' ||
  typeof request.body.guest_phone_number !== 'number' ||
  !request.body.firstName ||
  !request.body.last_name ||
  !request.body.guest_phone_number
) {
  return response.status(400).json({
    errors: [{ message: 'guest details not provided correctly' }],
  });
}
// 2. check whether guest has already been added to event:

const guest = await getGuestByPhonenumber(request.body.guest_phone_number);
if (guest) {
  return response.status(401).json({
    errors: [{ message: 'A guest with this phone number already exists.' }],
  });
}

// 3. if all good run the sql query to create the record in the database:

const guestInDatabase = await createGuest(
  request.body.first_name,
  request.body.last_name,
  request.body.guest_phone_number,
);

// 4. create a session token that will be added to the guests_events table so that guests can't register twice:

// const guestSession = await createSession(
//   userWithoutPassword.id,
//   crypto.randomBytes(80).toString('base64'),
// );

// const serializedCookie = createSerializedRegisterSessionTokenCookie(
//   session.token,
// );

// response
//   .status(200)
//   .setHeader('Set-Cookie', serializedCookie)
//   .json({ user: { username: userWithoutPassword.username } });
// } else {
// response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
// }
// }
