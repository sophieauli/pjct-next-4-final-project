import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { createUser, getUserByUsername } from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';

// import { createCsrfSecret } from '../../utils/csrf';

// body is part of the message we send with our api, we can also define its data type:

export type RegisterResponseBody =
  | { errors: [{ message: string }] }
  | { user: { username: string } };
// above we are defining that there is an object type with a property called errors and user that could contain an array of one or more objects with a message.

export default async function RegisterHandler(
  request: NextApiRequest,
  response: NextApiResponse<RegisterResponseBody>,
) {
  if (request.method === 'POST') {
    // 1. check whether data is stored:

    if (
      // checking whether it is provided as a string:
      typeof request.body.firstName !== 'string' ||
      typeof request.body.username !== 'string' ||
      typeof request.body.password !== 'string' ||
      !request.body.firstName ||
      !request.body.username ||
      !request.body.password
    ) {
      return response.status(400).json({
        errors: [{ message: 'username or password not provided correctly' }],
      });
    }
    // 2. check whether user has already been registered:

    const user = await getUserByUsername(request.body.username);
    if (user) {
      return response.status(401).json({
        errors: [{ message: 'A user with this username already exists.' }],
      });
    }
    // 3. if all good hash the given password:
    const passwordHash = await bcrypt.hash(request.body.password, 12);
    console.log(passwordHash);

    // 4. run the sql query to create the record in the database:

    const userWithoutPassword = await createUser(
      request.body.firstName,
      request.body.username,
      passwordHash,
    );

    // 5. optional: create a csrf token, which is a secret, user-specific token to prevent Cross-Site Request Forgeries:
    //   const secret = await await createCsrfSecret();
    // }

    // 6.Create a session token and serialize a cookie with the token:

    const session = await createSession(
      userWithoutPassword.id,
      crypto.randomBytes(80).toString('base64'),
    );

    const serializedCookie = createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    response
      .status(200)
      .setHeader('Set-Cookie', serializedCookie)
      .json({ user: { username: userWithoutPassword.username } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
