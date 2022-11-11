import { sql } from './connect';

export type User = {
  id: number;
  firstName: string;
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
    username,
    password_hash
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}
// the createUser function will with params of name, username and pw hash that is adding a user to the database with that information (objects) and then returning the user without the pw:

// run a query that will identidy the user by the token:

export async function getUserBySessionToken(token: string) {
  if (!token) return undefined;

  const [user] = await sql<{ id: number; username: string }[]>`
  SELECT
    users.id,
    users.username
  FROM
    users,
     sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = users.id AND
  sessions.expiry_timestamp > now();
  `;

  return user;
}

export async function createUser(
  first_name: string,
  username: string,
  password_hash: string,
) {
  const [userWithoutPassword] = await sql<{ id: number; username: string }[]>`
  INSERT INTO users
    (first_name, username, password_hash)
  VALUES
    (${first_name}, ${username}, ${password_hash})
  RETURNING
    id,
    username
  `;

  return userWithoutPassword!;
}
