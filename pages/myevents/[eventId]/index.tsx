import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import {
  Event,
  getEventByEventId,
  getHostEvents,
  HostEvent,
} from '../../../database/events';
import { getValidSessionByToken } from '../../../database/sessions';
import { getUserBySessionToken, User } from '../../../database/users';
import { parseIntFromContextQuery } from '../../../utils/contextQuery';

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
  | { user?: User; events: Event[]; hostEvents: HostEvent[] }
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

        <Header username={props.user?.firstName} />
        <h1>Coming up</h1>
        <h2>Looks like you have nothing planned yet...</h2>
      </div>
    );
  }
  // if the user is logged in, this page will be rendered:
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
        <Header username={props.user?.firstName} />
        <button
          css={buttonStyle}
          onClick={async () => {
            await router.push(`/myevents`);
          }}
        >
          back
        </button>
        {props.events.map((event) => {
          return (
            <div key={`hostevent-${event.id}`}>
              <Link href={`myevents/${event.id}`}>{event.eventName}</Link>
              {event.dateTime}
              {event.location}
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
  // if no user is logged in:
  if (!user) {
    context.res.statusCode = 404;
    return {
      // returning empty object as props if we cannot find the user:
      props: { error: 'Only hosts allowed!' },
    };
  }

  // retrieve eventId and show in url:

  const eventId = parseIntFromContextQuery(context.query.eventId);

  if (typeof eventId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'We are sorry, but that event does not exist...',
      },
    };
  }
  const host_user_id = user.id;
  const hostEvent = await getHostEvents(host_user_id);

  const foundEvent = await getEventByEventId(eventId);

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
      hostEvents: hostEvent,
      events: foundEvent,
    },
  };
}
