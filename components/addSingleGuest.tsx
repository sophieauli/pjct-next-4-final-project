import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Guest } from '../database/guests';
import { getValidSessionByToken } from '../database/sessions';
import { AddGuestResponseBody } from '../pages/api/guests';

const lighterText = css`
  color: #e9d8ac;
`;
const buttonStyle = css`
  background-color: #d9d9d974;
  color: #e9d8ac;
  font-size: 24px;
  border-radius: 5px;
  border-width: 1px;
  border: solid;
  border-color: #e9d8ac;
  padding: 6px 20px;
  border-radius: 5px;
  width: auto;
  cursor: pointer;
`;
const inputFieldStyle = css`
  color: #e9d8ac;
  background-color: #e9d8ac3e;
  font-size: 22px;
  border-radius: 5px;
  border-width: 1px;
  font-size: 24px;
  margin: 5px;
  padding: 10px;
  border: solid;
  border-color: #e9d8ac;
  display: table-cell;
`;

type AddedGuest = Guest[];

export default function AddSingleGuest() {
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestPhoneNumber, setGuestPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [addedGuest, setAddedGuest] = useState<Guest[]>([]);
  const router = useRouter();

  async function guestHandler() {
    const addGuestResponse = await fetch('/api/guests', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        guestFirstName: guestFirstName.toLowerCase(),
        guestLastName: guestLastName.toLowerCase(),
        guestPhoneNumber: guestPhoneNumber,
      }),
    });
    console.log(addGuestResponse);
    // packing the api response into a variable and giving it a type at the end (either as a type error or type user because those are the types we defined it with in api/register file):

    const addGuestResponseBody =
      (await addGuestResponse.json()) as AddGuestResponseBody;

    // we still need to "set" the errors to whatever error messages are coming from the response body:

    if ('errors' in addGuestResponseBody) {
      setErrors(addGuestResponseBody.errors);

      return console.log(addGuestResponseBody.errors);
    }
    setAddedGuest([...addedGuest, addGuestResponseBody]);
  }

  return (
    <>
      <Head>
        <title>Add single Guest</title>
        <meta name="description" />
        <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
      </Head>
      <h1>Add Guest</h1>
      <label>
        first name
        <input
          placeholder="Diego"
          css={inputFieldStyle}
          value={guestFirstName}
          onChange={(event) => {
            setGuestFirstName(event.currentTarget.value.toLowerCase());
          }}
        />
      </label>
      <br />
      <label>
        last name
        <input
          css={inputFieldStyle}
          placeholder="Smith"
          value={guestLastName}
          onChange={(event) => {
            setGuestLastName(event.currentTarget.value.toLowerCase());
          }}
        />
      </label>
      <br />
      <label>
        phonenumber
        <input
          placeholder="+43 123 1234567"
          type="tel"
          css={inputFieldStyle}
          value={guestPhoneNumber}
          onChange={(event) => {
            setGuestPhoneNumber(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <button
        css={buttonStyle}
        onClick={async () => {
          await guestHandler();
          setGuestPhoneNumber('');
          setGuestLastName('');
          setGuestFirstName('');
        }}
      >
        Add Guest
      </button>
      <br />
      <h2>Guestlist</h2>
      {addedGuest.map((guest) => {
        return (
          <div key={guest.id}>
            {guest.guestFirstName} {guest.guestLastName}{' '}
            {guest.guestPhoneNumber}
          </div>
        );
      })}
      <hr />
    </>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   // first we are going to the token:
//   const token = context.req.cookies.sessionToken;

//   if (token && (await getValidSessionByToken(token))) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: true,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// }
