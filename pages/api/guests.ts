import { request } from 'node:http';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  createGuest,
  getGuestByPhonenumber,
  Guest,
} from '../../database/guests';
// import { createSession } from '../../database/sessions';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';

type Props = { guest: Guest };
// body is part of the message we send with our api, we can also define its data type:

export type AddGuestResponseBody =
  | { errors: [{ message: string }] }
  // | { guest: { guest_phone_number: string } }
  | Guest;
// | { message: string };

// above we are defining that there is an object type with a property called errors and user that could contain an array of one or more objects with a message.

// this function will create the db entry of adding a guest and his/her information to the guests table:

export default async function GuestHandler(
  request: NextApiRequest,
  response: NextApiResponse<AddGuestResponseBody>,
) {
  if (request.method === 'POST') {
    // 1. check whether data was provided correctly as a string or number:

    if (
      typeof request.body.guestFirstName !== 'string' ||
      typeof request.body.guestLastName !== 'string' ||
      typeof request.body.guestPhoneNumber !== 'string' ||
      !request.body.guestFirstName ||
      !request.body.guestLastName ||
      !request.body.guestPhoneNumber
    ) {
      return response.status(400).json({
        errors: [{ message: 'guest details not provided correctly' }],
      });
    }
    // 2. check whether guest has already been added to event:

    const guest = await getGuestByPhonenumber(request.body.guestPhoneNumber);
    if (guest) {
      return response.status(401).json({
        errors: [{ message: 'A guest with this phone number already exists.' }],
      });
    }

    // 3. if all good run the sql query to create the record in the database:
    console.log(
      request.body.guestFirstName,
      request.body.guestLastName,
      request.body.guestPhoneNumber,
    );

    const guestInDatabase = await createGuest(
      request.body.guestFirstName,
      request.body.guestLastName,
      request.body.guestPhoneNumber,
    );

    console.log(guestInDatabase);

    // this function will create the db entry of adding the before created guest_id to the guests_events table:

    // this function will create a token so that guests are recognized by the dynamic page rendered and so that they can't register twice:

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

    return response.status(200).json(guestInDatabase);
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
