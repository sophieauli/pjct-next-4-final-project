import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { userAgent } from 'next/server';
import { idText } from 'typescript';
import Header from '../../components/Header';
import { Event, getAllEvents, getHostEvents } from '../../database/events';
import { CookieTokenAttendingGuests } from '../../database/events_guests';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken, User } from '../../database/users';

// import { getProducts, Product } from '../../database/products';

// style variable for hats incl rainbow hover for product name:
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
`;
type Props = {
  user?: User;
  events: Event[];
  cookieTokenAttending: CookieTokenAttendingGuests[];
};

export default function Events(props: Props) {
  const router = useRouter();
  console.log('porps events', props.events);
  // if (!props.user) {
  //   // if profile can't be found, return the following page / passing a user not found component:
  //   return (
  //     <div>
  //       <Head>
  //         <title>Event List</title>
  //         <meta name="description" content="User not found" />
  //       </Head>
  //       <h2>
  //         Hmm looks like you need to
  //         <Link href="/login"> login</Link> first...{' '}
  //       </h2>
  //     </div>
  //   );
  // }
  if (!props.events) {
    // if profile can't be found, return the following page / passing a user not found component:
    return (
      <div>
        <Head>
          <title>Event not found</title>
          <meta name="description" content="Event not found" />
          <h1>404 - this event could not be found</h1>
        </Head>
        <h2>Looks like you have nothing planned yet...</h2>
      </div>
    );
  }

  // in other cases, return regular event page:
  if (props.user) {
    return (
      <>
        <Head>
          <title>Events</title>
          <meta name="event overview" content="List page of all events" />
          <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
        </Head>
        <Header username={props.user?.firstName} />
        <h1>Coming up</h1>
        <h2>My Events</h2>

        {props.events.map((event) => {
          return (
            <div key={`event-${event.id}`}>
              <Link href={`myevents/${event.id}`}>{event.eventName}</Link>
              <br />
              <div>{event.dateTime}</div>

              <div>{event.location}</div>
            </div>
          );
        })}

        <h2>My Invites</h2>
        {/* <h2>You're hosting</h2>
       {props.cookieTokenAttending.map((event) => {
        return (
          <div>

              <Link href={`events/${cookieTokenAttending.id}`}>{event.eventName}</Link>
              {cookieTokenAttending.dateTime}
              {cookieTokenAttending.location}
          </div>
        )}

    );} */}
        <button
          css={roundButtonStyle}
          onClick={async () => {
            await router.push(`/newevent`);
          }}
        >
          +
        </button>
      </>
    );
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get the token :
  const token = context.req.cookies.sessionToken;

  // if no token: return to first page
  if (!token || !(await getValidSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // get user that is logged in after having gotten "his" token:
  const user = await getUserBySessionToken(token);

  // if no user is logged in:
  if (!user) {
    context.res.statusCode = 404;
    return {
      // returning empty object as props if we cannot find the user:
      props: {},
    };
  }

  // get all events:
  const events = JSON.stringify(await getAllEvents());

  // console.log(JSON.parse(events), 'events');
  return {
    props: {
      events: JSON.parse(events),
      user,
    },
  };
}

// -> like on private profile page:
// - check cookies / session token of specific user and ; -> get events by user idText- get hosteventsbyId

// wie im ecommer -> get all events by user id
// first we are going to get the cookietoken:
// const token = context.req.cookies.sessionToken;
