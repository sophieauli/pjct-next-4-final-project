export async function up(sql) {
  await sql`
    CREATE TABLE guests (
      id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      guest_first_name varchar(110) NOT NULL,
      guest_last_name varchar(110) NOT NULL,
      guest_phone_number varchar NOT NULL UNIQUE
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE guests
  `;
}
