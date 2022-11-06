import bcrypt from 'bcrypt';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  getUserByUsername,
  getUserWithPasswordHashByUsername,
} from '../../database/users';

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
    // 2. we can assume that the user already exists so no we need to get the user from the database by his username without the password:

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

    console.log('password is valid=', isPasswordValid);

    // 4. create a csrf secret:

    // 5. create a session token and serialize a cookie with that token:

    await user;
  }

  // 4. run the sql query to store user in database:
}
