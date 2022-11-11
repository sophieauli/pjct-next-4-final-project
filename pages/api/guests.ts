import crypto from 'node:crypto';
import { request } from 'node:http';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { createGuest, getGuestbyPhonenumber } from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';

// body is part of the message we send with our api, we can also define its data type:

export type AddGuestResponseBody =
  | { errors: [{ message: string }] }
  | { guest: [{ id: string }] };
// above we are defining that there is an object type with a property called errors and user that could contain an array of one or more objects with a message.

export default async function AddGuestHandler(
  request: NextApiRequest,
  response: NextApiResponse<AddGuestResponseBody>,
);

// 1. check whether data was provided correctly as a string or number:
if (
  typeof request.body.firstName !== 'string' ||
  typeof request.body.lastName !== 'string' ||
  typeof request.body.password !== 'string' ||
  !request.body.firstName ||
  !request.body.username ||
  !request.body.password
) {
  return response.status(400).json({
    errors: [{ message: 'username or password not provided correctly' }],
  });
}
