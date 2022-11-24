import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { hostname } from 'os';
import Header from '../../../components/Header';
import {
  Event,
  getEventByEventId,
  getEventsByHostId,
  getSingleHostEventById,
  HostEvent,
} from '../../../database/events';
import {
  getAttendingGuestIds,
  getInvitedGuestIds,
  GuestEventInfo,
} from '../../../database/events_guests';
import { getGuestByGuestId, Guest } from '../../../database/guests';
// import { getGuestByGuestId } from '../../../database/guests';
import { getValidSessionByToken } from '../../../database/sessions';
import { getUserBySessionToken, User } from '../../../database/users';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';

const eventName = css`
  font-size: 38px;
  color: #e9d8ac;
  min-width: 10px;
  padding: 20px;
  border-radius: 10px;
  border-width: 1px;
  font-weight: bold;
  border: solid;
  margin: 20px 0px 20px;
`;

const eventInfo = css`
  font-size: 28px;
  color: #e9d8ac;
  min-width: 10px;
  padding: 20px 10px 20px;
  margin: 20px 0px 20px;
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

const status = css`
  border-bottom: 2px solid;
  font-family: 'Saira';
  font-weight: bold;
  color: #e9d8ac;
  font-size: 38px;
  margin-bottom: 40px;
`;

type Props =
  | {
      user?: User;
      hostEvent: HostEvent[];
      foundInvitedGuests?: (Guest | undefined)[];
      foundAttendingGuests?: (Guest | undefined)[];
    }
  | {
      error: string;
    };

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
        Click <Link href="/myevents"> here </Link> to be directed back to your
        events!
      </div>
    );
  }
  if (!props.hostEvent) {
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
  // if the user is not logged in, this page will be rendered:
  if (!props.user) {
    return (
      <>
        <Head>
          <title>No user</title>
          <meta name="description" content="No user logged in" />
          <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
          <h1>404 - this event could not be found</h1>
        </Head>

        <h1>Please log in!</h1>
      </>
    );
  }

  if (props.user) {
    return (
      <div>
        <Head>
          <title>Single Event</title>
          <meta
            name="description"
            content="This is a page showing the single event"
          />
          <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
        </Head>
        <Header firstName={props.user?.firstName} />
        <button
          css={buttonStyle}
          onClick={async () => {
            await router.push(`/myevents`);
          }}
        >
          back
        </button>
        {props.hostEvent.map((hostEvent) => {
          return (
            <div key={`hostEvent-${hostEvent.id}`}>
              <div css={eventName}>
                {hostEvent.eventName.charAt(0).toUpperCase()}
                {hostEvent.eventName.slice(1)}
              </div>
              <div css={eventInfo}>
                When: {''}
                {hostEvent.dateTime.slice(8, 10)}
                {'/'}
                {hostEvent.dateTime.slice(5, 7)}
                {'/'}
                {hostEvent.dateTime.slice(0, 4)} at{' '}
                {hostEvent.dateTime.slice(11, 16).replace(':', 'h')}
                <br />
                Where: {hostEvent.location.charAt(0).toUpperCase()}
                {hostEvent.location.slice(1)}
                <br />
                Info: {hostEvent.description}
              </div>
            </div>
          );
        })}

        <div css={status}>Attending</div>

        {props.foundAttendingGuests?.map((foundAttendingGuest) => {
          if (!foundAttendingGuest) {
            return <div>Looks like noone has rsvp d yet...</div>;
          }
          if (foundAttendingGuest) {
            return (
              <div key={`guest-${foundAttendingGuest.id}`}>
                <ul>
                  <li>
                    {foundAttendingGuest.guestFirstName.charAt(0).toUpperCase()}
                    {foundAttendingGuest.guestLastName.charAt(0).toUpperCase()}
                  </li>
                </ul>
              </div>
            );
          }
        })}

        <div css={status}>Invited</div>

        {props.foundInvitedGuests?.map((foundInvitedGuest) => {
          if (foundInvitedGuest) {
            return (
              <div key={`guest-${foundInvitedGuest.id}`}>
                <ul>
                  <li>
                    {foundInvitedGuest.guestFirstName.charAt(0).toUpperCase()}
                    {foundInvitedGuest.guestFirstName.slice(1)}{' '}
                    {foundInvitedGuest.guestLastName.charAt(0).toUpperCase()}
                    {foundInvitedGuest.guestLastName.slice(1)}{' '}
                  </li>
                </ul>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  // to make sure that only logged in users can see this:

  // get the token :
  const token = context.req.cookies.sessionToken;
  // console.log('token', token);
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
  // console.log('user', user);
  // if no user is logged in:
  if (!user) {
    context.res.statusCode = 404;
    return {
      // returning empty object as props if we cannot find the user:
      props: { error: 'Only hosts allowed!' },
    };
  }

  // retrieve eventId from url:

  const eventId = parseIntFromContextQuery(context.query.eventId);
  // console.log('eventID', context.query.eventId);

  if (typeof eventId === 'undefined') {
    context.res.statusCode = 404;
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {
        error: 'We are sorry, but that event does not exist...',
      },
    };
  }

  const foundEventBefore = await getEventByEventId(eventId);
  // console.log('foundEventBefore', foundEventBefore);
  const foundEvent = JSON.parse(JSON.stringify(foundEventBefore));
  // console.log('foundevent', foundEvent);
  if (foundEvent.length === 0) {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'We are sorry, but that event could not be found...',
      },
    };
  }

  const foundInvitedGuestIds: GuestEventInfo[] | undefined =
    await getInvitedGuestIds(eventId);

  // as unknown as number
  console.log('foundGuestIds', foundInvitedGuestIds);

  const foundAttendingGuestIds: GuestEventInfo[] | undefined =
    await getAttendingGuestIds(eventId);

  if (typeof foundInvitedGuestIds === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'no guest id with that id found',
      },
    };
  }

  if (!foundInvitedGuestIds) {
    return {
      props: {
        error: 'no guests invited',
      },
    };
  }

  if (typeof foundAttendingGuestIds === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'no guest id with that id found',
      },
    };
  }

  if (!foundAttendingGuestIds) {
    return {
      props: {
        error: 'no guests attending',
      },
    };
  }

  const allInvitedGuests = await Promise.all(
    foundInvitedGuestIds.map(async (foundGuestId) => {
      const guest = await getGuestByGuestId(foundGuestId.guestId);
      if (!guest) {
        return;
      }
      return guest;
    }),
  );
  const attendingGuests = await Promise.all(
    foundAttendingGuestIds.map(async (foundAttendingGuestId) => {
      const guest = await getGuestByGuestId(foundAttendingGuestId.guestId);
      if (!guest) {
        return;
      }
      return guest;
    }),
  );

  console.log('attendingGuests', attendingGuests);

  // console.log('foundGuests', foundGuests);

  const userId = user.id;
  // console.log('userid', userId);

  // console.log('hostUserId', foundEvent[0].hostUserId);
  // console.log('foundEvent', foundEvent);

  if (userId !== foundEvent[0].hostUserId) {
    return {
      props: {
        error: 'Only hosts allowed...',
      },
    };
  }

  // const foundEvent = await getEventByEventId(eventId);

  return {
    props: {
      user: user,
      hostEvent: foundEvent,
      foundInvitedGuests: allInvitedGuests,
      foundAttendingGuests: attendingGuests,
    },
  };
}
