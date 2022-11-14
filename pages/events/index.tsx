import { css } from '@emotion/react';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Event, getEvents } from '../../database/events_table';

// import { getProducts, Product } from '../../database/products';

// style variable for hats incl rainbow hover for product name:

type Props = {
  events: Event;
};

export default function Events(props: Props) {
  if (!props.events) {
    // if profile can't be found, return the following page / passing a user not found component:
    return (
      <div>
        <Head>
          <title>Event not found</title>
          <meta name="description" content="Event not found" />
          <h1>404 - this event could not be found</h1>
        </Head>
        <h1>Coming up</h1>
        <h2>Looks like you have nothing planned yet...</h2>
      </div>
    );
  }
  // in other cases, return regular event page:
  return (
    <>
      <Head>
        <title>Events</title>
        <meta name="event overview" content="List page of all events" />
      </Head>

      <h1>Coming up</h1>
      <h2>You're invited to...</h2>
      <div>
        {props.events.map((event) => {
          return (
            <div key={`event number ${event.id}`}>
              <div>
                <a data-test-id={`event-${event.id}`}>
                  <Link href={`events/${event.id}`}></Link>
                </a>
              </div>
              <div>
                <h3>
                  <Link href={`events/${event.id}`}>{event.eventName}</Link>
                </h3>
                <div>EUR {event.location}</div>
              </div>
            </div>
          );
        })}
      </div>
      <h2>You're hosting...</h2>
      <div>
        {props.events.map((event) => {
          return (
            <div key={`event number ${event.id}`}>
              <div>
                <a data-test-id={`event-${event.id}`}>
                  <Link href={`events/${event.id}`}></Link>
                </a>
              </div>
              <div>
                <h3>
                  <Link href={`events/${event.id}`}>{event.eventName}</Link>
                </h3>
                <div>EUR {event.location}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<Props>
> {
  const event = await getEvents();
  return {
    props: {
      events: event,
    },
  };
  // will be passed to the page component as props
  // as frontend: going from back- to frontend.
}
