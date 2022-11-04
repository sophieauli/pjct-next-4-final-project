import { sql } from './connect';

export type User = {
  id: number;
  name: string;
  username: string;
  passwordHash: string;
};

export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<User[]>`
  SELECT
    id,
    username
  FROM
    users
  WHERE
    users.username = ${username}
    `;

  return user;
}
// since we don't want to use the top functino with the password hash everytime since it's sensitive information:

export async function getUserWithPasswordHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<User[]>`
  SELECT
    *
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}
// the createUser function will with params of name, username and pw hash that is adding a user to the database with that information (objects) and then returning the user without the pw:

export async function createUser(
  name: string,
  username: string,
  password_hash: string,
) {
  const [userWithoutPasswordHash] = await sql<
    { id: number; username: string }[]
  >`
  INSERT INTO users
    (name, username, password_hash)
  VALUES
    (${name}, ${username}, ${password_hash})
  RETURNING
  id,
  username
  `;

  return userWithoutPasswordHash;
}
