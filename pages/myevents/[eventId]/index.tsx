// import { GetServerSidePropsContext } from 'next';
// import Head from 'next/head';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { Event, getEventByEventId } from '../../database/events';

// type Props =
//   | {
//       events: Event[];
//     }
//   | {
//       error: string;
//     };

// export default function Events(props: Props) {
//   if ('error' in props) {
//     return (
//       <div>
//         <Head>
//           <title>Event not found</title>
//           <meta name="single event page" content="Event not found" />
//         </Head>
//         <h1>{props.error}</h1>
//         Click <Link href="/events"> here </Link> to be directed back to all
//         events!
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Head>
//         <title>{props.events.eventName}</title>
//         <meta
//           name="description"
//           content={`This is a page showing the event ${props.events.eventName}.`}
//         />
//       </Head>
//     </div>
//   );
// }

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   // retrieve eventId and show in url:

//   const event = context.query.eventId as string;
//   const eventId = await getEventByEventId(event);

//   if (!event) {
//     context.res.statusCode = 404;
//     return {
//       // returning empty object as props if we cannot find the event:
//       props: {},
//     };
//   }
//   // otherwise, so when the event is found, return and pass the user props:
//   return {
//     props: { event },
//   };
// }
import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Event, getEventByEventId } from '../../../database/events';
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
  | {
      events: Event;
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
        Click <Link href="/myevents"> here </Link> to be directed back to all
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
      <div>{props.events.eventName}</div>
      <div>{props.events.dateTime}</div>
      <div>{props.events.location}</div>
      <div>{props.events.description}</div>
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
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

  const foundEvent = await getEventByEventId(eventId);

  if (typeof foundEvent === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'We are sorry, but that hat event not be found...',
      },
    };
  }
  return {
    props: {
      events: foundEvent,
    },
  };
}
