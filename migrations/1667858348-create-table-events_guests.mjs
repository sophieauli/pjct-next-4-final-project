export async function up(sql) {
  await sql`
    CREATE TABLE events_guests (
      PRIMARY KEY (event_id, guest_id),
      event_id integer REFERENCES events (id),
      guest_id integer REFERENCES guests (id),
      cookie_token_attending_guests integer NOT NULL UNIQUE,
      is_attending boolean)
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE events_guests
  `;
}
