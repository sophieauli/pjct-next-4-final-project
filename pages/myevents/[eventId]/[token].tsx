import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  getGuestByEventIdAndGuestToken,
  GuestEventInfo,
} from '../../../database/events_guests';
import { Guest } from '../../../database/guests';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';
import { getParsedCookie, setStringifiedCookie } from '../../../utils/cookies';

// import { GetServerSidePropsContext } from 'next';

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
    }
  | { guest: Guest }
  | { guestToken: string }
  | {
      error: string;
    };

export default function GuestToken(props: Props) {
  const router = useRouter();
  // if ('error' in props) {
  //   return (
  //     <div>
  //       <Head>
  //         <title>Event not found</title>
  //         <meta name="single event page" content="Event not found" />
  //       </Head>
  //       <h1>{props.error}</h1>
  //       Click <Link href="/myevents"> here </Link> to be directed back to all
  //       events!
  //     </div>
  //   );
  // }
  return (
    <>
      <Head>
        <title>eventname</title>
        <meta
          name="description"
          content="This is a page showing the event where the guest can click on attending or not attending"
        />
        <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
      </Head>
      <div>
        <h1>Will you make it?</h1>

        <button
          css={buttonStyle}
          onClick={() => {
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
          css={buttonStyle}
          onClick={() => {
            setStringifiedCookie('attendance', 'not attending');
          }}
        >
          Sadly, no...
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const eventId = parseIntFromContextQuery(context.query.id);

  if (typeof eventId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'no event id what that id found',
      },
    };
  }
  const guestToken = context.req.cookies.guestToken;

  console.log(guestToken);

  if (!guestToken) {
    console.log('guest token', guestToken);
    context.res.statusCode = 404;
    return {
      props: {
        error: 'no event id what that id found',
      },
    };
  }

  if (typeof guestToken === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'NFI',
      },
    };
  }

  const foundGuestToken = getGuestByEventIdAndGuestToken(eventId, guestToken);

  console.log(context.query);
  console.log('guest token', guestToken);
  return { props: {} };
}
