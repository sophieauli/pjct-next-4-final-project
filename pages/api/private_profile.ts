// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { idText } from 'typescript';
import { getUserFirstNameBySessionToken } from '../../database/users';

export async function profileHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // 1. here we are getting the cookie by requesting it:
  if (request.method === 'GET') {
    const token = request.cookies.sessionToken;

    if (!token) {
      response
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
    }
  }

  return;
}

// 2. here we are getting the user from the token by comparing it to the sessions table:
const user = await getUserFirstNameBySessionToken(session.token);
    if (!user) {
      return response.status(401).json({
        errors: [{ message: 'User not found.' }],
      });

const user = await getUserFirstNameBySessionToken(token);

if (!user) {
  response.status(400).json({ errors: [{ message: 'invalid session token' }] });
}
