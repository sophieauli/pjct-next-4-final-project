import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CreateEventResponseBody } from '../api/events';

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
`;

// import { getValidSessionByToken } from '../../database/sessions';

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [description, setDescription] = useState('');

  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestPhoneNumber, setguestPhoneNumber] = useState('');

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
    await router.push(`/events/${createEventResponseBody.event.eventName}`);
  }
  return (
    <div>
      <Head>
        <title>Create Event</title>
        <meta name="description" content="create event" />
      </Head>

      <main>
        <h1>Make it happen!</h1>
        <Image
          src="/Join Diego.svg"
          alt="Join Diego beige"
          width="402"
          height="123"
        />
        <label>
          New Event
          <input
            value={eventName}
            onChange={(event) => {
              setEventName(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          When?
          <input
            value={dateTime}
            onChange={(event) => {
              setDateTime(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          Where?
          <input
            value={location}
            onChange={(event) => {
              setLocation(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        {/* <label>
          Add Guests
          <input
            value={location}
            onChange={(event) => {
              setLocation(event.currentTarget.value);
            }}
          />
        </label> */}
        <br />
        <button
          onClick={async () => {
            await eventHandler();
          }}
          css={buttonStyle}
        >
          sign up
        </button>
        <div>
          Already have an account? <Link href="/login"> Login </Link>
        </div>
      </main>
    </div>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // first we are going to the token:
  const token = context.req.cookies.sessionToken;

  if (token && (await getValidSessionByToken(token))) {
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
