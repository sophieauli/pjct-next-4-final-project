import { sql } from './connect';

export type Guest = {
  id: number;
  firstName: string;
  username: string;
  phoneNumber: number;
};

export async function getGuestByPhonenumber(phoneNumber: number) {
  if (!phoneNumber) return undefined;

  const [guestPhonenumber] = await sql<Guest[]>`
  SELECT
    id,
    phoneNumber
  FROM
    guests
  WHERE
    guests.phoneNumber = ${phoneNumber}
    `;

  return guestPhonenumber;
}

export async function createGuest(
  firstName: string,
  lastName: string,
  phoneNumber: number,
) {
  const [guest] = await sql<{ id: number; username: string }[]>`
  INSERT INTO guests
    (first_name, last_name, guest_phone_number)
  VALUES
    (${firstName}, ${lastName}, ${phoneNumber})
  RETURNING
    id,
    firstName,
    lastName,
    phoneNumber
  `;

  return guest!;
}
