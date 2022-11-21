import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AddSingleGuest from '../components/addSingleGuest';
import { Guest } from '../database/guests';
import { getValidSessionByToken } from '../database/sessions';
import { getUserBySessionToken } from '../database/users';
import { CreateEventResponseBody } from './api/events';

const buttonStyle = css`
  background-color: #d9d9d974;
  color: #e9d8ac;
  font-size: 24px;
  border-radius: 5px;
  border-width: 1px;
  border: solid;
  border-color: #e9d8ac;
  padding: 6px 20px;
  width: auto;
  cursor: pointer;
`;

const roundButtonStyle = css`
  background-color: #d9d9d974;
  color: #e9d8ac;
  font-size: 24px;
  border-radius: 100px;
  border-width: 1px;
  border: solid;
  border-color: #e9d8ac;
  padding: 5px 6px;
  width: 40px;
  text-align: center;
  cursor: pointer;
  margin: 20px;
`;

const styleInputField = css`
  color: #e9d8ac;
  background-color: #e9d8ac3e;
  font-size: 24px;
  border-radius: 5px;
  border-width: 1px;
  font-size: 24px;
  margin: 5px;
  padding: 10px;
  border: solid;
  border-color: #e9d8ac;
  display: table-cell;
  placeholder {
    color: #e9d8ac;
  }
`;
const descriptionInputField = css`
  color: #e9d8ac;
  background-color: #e9d8ac3e;
  font-size: 24px;
  border-radius: 5px;
  border-width: 1px;
  font-size: 24px;
  margin: 5px;
  padding: 10px;
  border: solid;
  border-color: #e9d8ac;
  display: table-cell;
  height: 200px;
  text-align: left;
  .placeholder {
    color: #e9d8ac;
  }
`;
// import { getValidSessionByToken } from '../../database/sessions';

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [clickAddGuest, setClickAddGuest] = useState(false);
  const [clickNext, setClickNext] = useState(false);
  const [addedGuest, setAddedGuest] = useState<Guest[]>([]);
  console.log(addedGuest);

  // const [guestFirstName, setGuestFirstName] = useState('');
  // const [guestLastName, setGuestLastName] = useState('');
  // const [guestPhoneNumber, setguestPhoneNumber] = useState('');

  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function eventHandler() {
    const createEventResponse = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        eventName: eventName.toLowerCase(),
        location: location.toLowerCase(),
        dateTime,
        description,
        addedGuest,
      }),
    });

    // packing the api response into a variable and giving it a type at the end (either as a type error or type user because those are the types we defined it with in api/register file):

    const createEventResponseBody =
      (await createEventResponse.json()) as CreateEventResponseBody;

    // we still need to "set" the errors to whatever error messages are coming from the response body:

    if ('errors' in createEventResponseBody) {
      setErrors(createEventResponseBody.errors);

      return console.log(createEventResponseBody.errors);
    }

    const returnTo = router.query.returnTo;
    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      /^\/[a-zA-Z0-9?=/]*$/.test(returnTo)
    ) {
      return await router.push(returnTo);
    }
    await router.push(`/myevents`);
  }

  // if (clickAddGuest) {
  //   return <AddSingleGuest />;
  // }
  return (
    <>
      <Head>
        <title>Create Event</title>
        <meta name="description" content="create event" />
        <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
      </Head>

      <button
        css={buttonStyle}
        onClick={async () => {
          await router.push(`/myevents`);
        }}
      >
        back
      </button>

      <h1>Make it happen!</h1>
      <div>
        <label>New Event</label>
        <br />
        <input
          css={styleInputField}
          placeholder="Birthday Dinner"
          required
          value={eventName}
          onChange={(event) => {
            setEventName(event.currentTarget.value);
          }}
        />

        <br />
        <label>When?</label>
        <br />
        <input
          css={styleInputField}
          placeholder="01.01.2022"
          required
          type="datetime-local"
          value={dateTime}
          onChange={(event) => {
            setDateTime(event.currentTarget.value);
          }}
        />

        <br />
        <label>Where?</label>
        <br />
        <input
          css={styleInputField}
          placeholder="Linienstraße 110"
          required
          value={location}
          onChange={(event) => {
            setLocation(event.currentTarget.value);
          }}
        />
        <br />
        <label>Description</label>
        <br />

        <textarea
          css={descriptionInputField}
          placeholder="Some extra info..."
          maxLength={150}
          required
          value={description}
          onChange={(event) => {
            setDescription(event.currentTarget.value);
          }}
        />
      </div>
      <br />
      <label>Add Guests</label>
      <button
        css={roundButtonStyle}
        onClick={() => {
          setClickAddGuest(true);
        }}
      >
        +
      </button>
      {clickAddGuest ? (
        <AddSingleGuest addedGuest={addedGuest} setAddedGuest={setAddedGuest} />
      ) : (
        ''
      )}

      <h2>Guestlist</h2>
      {JSON.stringify(addedGuest)}
      <br />
      <br />
      <button
        onClick={async () => {
          await eventHandler();
        }}
        css={buttonStyle}
      >
        send invites
      </button>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // first we are going to the token:
  const token = context.req.cookies.sessionToken;

  if (!token || !(await getValidSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
  const user = await getUserBySessionToken(token);

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
