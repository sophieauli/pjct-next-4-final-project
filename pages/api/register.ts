import bcrypt from 'bcrypt';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByUsername } from '../../database/users';

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
      typeof request.body.username !== 'string' ||
      typeof request.body.password !== 'string' ||
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

    // First we are going to await the response from the database>user.ts function userWithoutPasswordHash

    await user;
  }

  // 4. run the sql query to store user in database:
}
