import { sql } from './connect';

export type Guest = {
  id: number;
  guestFirstName: string;
  guestLastName: string;
  guestPhoneNumber: string;
};

export async function getGuestByPhonenumber(guestPhoneNumber: string) {
  if (!guestPhoneNumber) return undefined;

  const [guest] = await sql<Guest[]>`
  SELECT
    id,
    guest_phone_number
  FROM
    guests
  WHERE
    guests.guest_phone_number = ${guestPhoneNumber}
    `;

  return guest;
}

export async function createGuest(
  guestFirstName: string,
  guestLastName: string,
  guestPhoneNumber: string,
) {
  const [guest] = await sql<Guest[]>`

  INSERT INTO guests
    (guest_first_name, guest_last_name, guest_phone_number)
  VALUES
    (${guestFirstName}, ${guestLastName}, ${guestPhoneNumber})
  RETURNING
    *
  `;

  return guest!;
}
