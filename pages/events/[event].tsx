import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Event, getEventByEventId } from '../../database/events';

type Props =
  | {
      events: Event;
    }
  | {
      error: string;
    };

export default function Events(props: Props) {
  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Event not found</title>
          <meta name="single event page" content="Event not found" />
        </Head>
        <h1>{props.error}</h1>
        Click <Link href="/events"> here </Link> to be directed back to all
        events!
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{props.events.eventName}</title>
        <meta
          name="description"
          content={`This is a page showing the event ${props.events.eventName}.`}
        />
      </Head>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // retrieve eventId and show in url:

  const event = context.query.eventId as string;
  const eventId = await getEventByEventId(event);

  if (!event) {
    context.res.statusCode = 404;
    return {
      // returning empty object as props if we cannot find the event:
      props: {},
    };
  }
  // otherwise, so when the event is found, return and pass the user props:
  return {
    props: { event },
  };
}
