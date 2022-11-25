import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import RSVPNo from '../../../components/rsvp_no';
import RSVPYes from '../../../components/rsvp_yes';
import {
  getGuestByEventIdAndGuestToken,
  GuestEventInfo,
} from '../../../database/events_guests';
import { Guest } from '../../../database/guests';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';
import { getParsedCookie, setStringifiedCookie } from '../../../utils/cookies';

// import { GetServerSidePropsContext } from 'next';

const attendanceButton = css`
  background-color: black;
  :active {
    background-color: #d9d9d974;
  }
  :disabled {
    background-color: #646161f4;
    opacity: 50%;
    border: 1px solid #efefef;
  }
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

type Props =
  | {
      guestEventInfo: GuestEventInfo;
      guestToken: string;
    }
  | { guest: Guest; guestToken: string }
  // | { guestToken: string }
  | {
      error: string;
      guestToken: string;
    };

export default function GuestToken(props: Props) {
  const [clickYes, setClickYes] = useState(false);
  const [clickNo, setClickNo] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const guestToken = props.guestToken;
  console.log(isAttending);

  async function updateAttendanceHandler() {
    // console.log('clicked');
    await fetch(`/api/attendance`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        isAttending: isAttending,
        guestToken,
      }),
    });
  }

  return (
    <>
      <Head>
        <title>Guest RSVP page</title>
        <meta
          name="description"
          content="This is a page showing the event where the guest can click on attending or not attending"
        />
        <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
      </Head>
      <div>
        <h1>Will you make it?</h1>

        <button
          css={attendanceButton}
          onClick={() => {
            setClickYes(true);
            setIsAttending(true);
            // get current status:
            // if cookie was placed before, check:
            // if no cookie was placed, return undefined:
            const currentCookieStatus = getParsedCookie('attendance');
            if (!currentCookieStatus) {
              setStringifiedCookie('attendance', 'not attending');
            }
            setStringifiedCookie('attendance', 'attending');
          }}
        >
          Yes!
        </button>
        <button
          css={attendanceButton}
          onClick={() => {
            setClickNo(true);
            setIsAttending(false);
            setStringifiedCookie('attendance', 'not attending');
          }}
        >
          Sadly, no...
        </button>
        {clickYes ? <RSVPYes /> : ''}
        {clickNo ? <RSVPNo /> : ''}
        <button
          css={buttonStyle}
          onClick={() => {
            updateAttendanceHandler();
          }}
        >
          send
        </button>
      </div>
    </>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  // console.log('context.query 1', context.query);
  const eventId = parseIntFromContextQuery(context.query.eventId);
  // console.log('eventId', eventId);

  if (typeof eventId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'no event id with that id found',
      },
    };
  }
  const guestToken = context.query.token;

  // console.log('guestToken', guestToken);

  // check if arr is array
  const result = Array.isArray(guestToken);

  if (result) {
    return;
  }
  console.log('test not array');

  console.log(`${guestToken} is not an array.`);

  if (!guestToken) {
    console.log('guest token', guestToken);
    context.res.statusCode = 404;
    return {
      props: {
        error: 'no guest with that token exists',
      },
    };
  }

  if (typeof guestToken === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'no guest with that token exists',
      },
    };
  }

  const foundGuestToken = getGuestByEventIdAndGuestToken(eventId, guestToken);

  console.log(foundGuestToken);

  console.log(context.query);
  console.log('guest token', guestToken);
  return {
    props: {
      guestToken: guestToken,
      eventId: eventId,
    },
  };
}
