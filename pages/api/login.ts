import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { userAgent } from 'next/server';
import { createSession } from '../../database/sessions';
import {
  getUserByUsername,
  getUserWithPasswordHashByUsername,
} from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';

// 1. check if the data is in the body of the request = check the request to protect the database!

export type LoginResponseBody =
  | { errors: [{ message: string }] }
  | { user: { username: string } };
// above we are defining that there is an object type with a property called errors and user that could contain an array of one or more objects with a message.

export default async function LoginHandler(
  request: NextApiRequest,
  response: NextApiResponse<LoginResponseBody>,
) {
  if (request.method === 'POST') {
    // 1. check whether data is stored:

    if (
      // checking whether it is provided as a string:
      typeof request.body.username !== 'string' ||
      typeof request.body.password !== 'string' ||
      // and then if it was entered:
      !request.body.username ||
      !request.body.password
    ) {
      return response.status(400).json({
        errors: [{ message: 'Username or password not provided correctly.' }],
      });
    }
    // 2. we can assume that the user already exists so now we need to get the user from the database by his username without the password:

    const user = await getUserWithPasswordHashByUsername(request.body.username);
    if (!user) {
      return response.status(401).json({
        errors: [{ message: 'User not found.' }],
      });
    }
    // 3. defining a variable with a function that will check whether the pw hash and actual plaintext pw match by using bcrypt's compare function. (note: isPasswordValid is going to be boolean, true/false depending on whether the two match!):

    const isPasswordValid = await bcrypt.compare(
      request.body.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return response.status(401).json({
        errors: [{ message: 'Wrong password. Please try again.' }],
      });
    }

    // optional step 4: create a csrf secret:

    // 5. create a session token and serialize a cookie with that token:

    // 5.1. this function is a callback function. First we await the result from createSession with which we create a session in our database. Then crypto.randomBytes etc is going to create a 110 length token; 110 because that is the length of characters we defined for the column "session-token" in the table.
    // Additional note to self: Base64 is a binary-to-text algorithm used to convert data to plain text in order to prevent data corruption when transmitting data between different storage mediums:

    const session = await createSession(
      user.id,
      crypto.randomBytes(80).toString('base64'),
    );

    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    // 5.2. send the command to the server to create the cookie with the name (bc serializedCookie = await....) of session token:

    response
      .status(200)
      .setHeader('Set-Cookie', serializedCookie)
      .json({ user: { username: user.username } });
  } else {
    response.status(401).json({ errors: [{ message: 'Methos not allowed.' }] });
  }
}
