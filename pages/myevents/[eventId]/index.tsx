import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import {
  Event,
  getEventByEventId,
  getEventsByHostId,
  getSingleHostEventById,
  HostEvent,
} from '../../../database/events';
import { getValidSessionByToken } from '../../../database/sessions';
import { getUserBySessionToken, User } from '../../../database/users';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';

const eventName = css`
  font-size: 32px;
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
  | { user?: User; hostEvent: HostEvent[] }
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
        Click <Link href="/myevents"> here </Link> to be directed back to all
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
  // if the user is logged in, this page will be rendered:
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
              <div css={eventName}>{hostEvent.eventName}</div>

              {hostEvent.dateTime}
              {hostEvent.location}
            </div>
          );
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
  console.log(user);
  // if no user is logged in:
  if (!user) {
    context.res.statusCode = 404;
    return {
      // returning empty object as props if we cannot find the user:
      props: { error: 'Only hosts allowed!' },
    };
  }

  const userId = user.id;

  // retrieve eventId from url:

  const eventId = parseIntFromContextQuery(context.query.eventId);

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

  const foundEvent = await getEventByEventId(eventId);
  console.log(foundEvent);

  // const foundEvent = await getEventByEventId(eventId);

  if (typeof foundEvent === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'We are sorry, but that event could not be found...',
      },
    };
  }
  return {
    props: {
      user: user,
      hostEvent: foundEvent,
    },
  };
}
