import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import {
  Event,
  getAllEvents,
  getEventsByHostId,
  HostEvent,
} from '../../database/events';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken, User } from '../../database/users';

const eventBox = css`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 400px;
  border: solid;
  border-color: #e9d8ac;
  border-radius: 40px;
`;

const eventName = css`
  font-size: 32px;
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
`;
type Props =
  // | {
  //     user?: User;
  //     events: Event[];
  //     hostEvents: HostEvent[];
  //     // cookieTokenAttending: CookieTokenAttendingGuests[];
  //   }
  | {
      events: Event[];
      user?: User;
      hostEvents: HostEvent[];
    }
  | { error: string };

export default function Events(props: Props) {
  const router = useRouter();
  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Event not found</title>
          <meta name="single event page" content="Event not found" />
        </Head>
        <h1>{props.error}</h1>
        Click <Link href="/myevents"> here </Link> to be directed back to all
        events!
      </div>
    );
  }

  if (!props.events) {
    // if profile can't be found, return the following page / passing an event not found component:
    return (
      <div>
        <Head>
          <title>Event not found</title>
          <meta name="description" content="Event not found" />
          <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
          <h1>404 - this event could not be found</h1>
        </Head>

        <Header firstName={props.user?.firstName} />
        <h1>Coming up</h1>
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
        <Header firstName={props.user?.firstName} />
        <h1>Coming up</h1>
        <h2>My events</h2>
        {props.hostEvents.map((hostEvent) => {
          return (
            <div key={`hostEvent-${hostEvent.id}`} css={eventBox}>
              <Link href={`myevents/${hostEvent.id}`}>
                {hostEvent.eventName}
              </Link>
              <br />
              When: {hostEvent.dateTime}
              <br />
              Where: {hostEvent.location}
            </div>
          );
        })}
        <hr />
        <h2>My invites</h2>
        <button
          css={roundButtonStyle}
          onClick={async () => {
            await router.push(`/newevent`);
          }}
        >
          +
        </button>{' '}
        create an event!
      </>
    );
  }
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
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
      props: { error: 'Only hosts allowed!' },
    };
  }
  // get all events of that user:

  const hostEventsBefore = await getEventsByHostId(user.id);
  const hostEvents = JSON.parse(JSON.stringify(hostEventsBefore));
  console.log(hostEvents);
  const eventsBefore = await getAllEvents();
  const events = JSON.parse(JSON.stringify(eventsBefore));

  // console.log(JSON.parse(events), 'events');
  return {
    props: {
      hostEvents: hostEvents,
      events: events,
      user,
    },
  };
}
