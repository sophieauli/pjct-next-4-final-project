import { css } from '@emotion/react';
import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { userAgent } from 'next/server';
import { idText } from 'typescript';
import { Event, getAllEvents, getHostEvents } from '../../database/events';
import { CookieTokenAttendingGuests } from '../../database/events_guests';

// import { getProducts, Product } from '../../database/products';

// style variable for hats incl rainbow hover for product name:

type Props = {
  events: Event[];
  cookieTokenAttending: CookieTokenAttendingGuests[];
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
      <h2>Your invites</h2>
      {props.events.map((event) => {
        return (
          <div key={`event number ${event.id}`}>
            <Link href={`events/${event.id}`}>{event.eventName}</Link>
            {event.dateTime}
            {event.location}
          </div>
        );
      })}
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
    </>
  );
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<Props>
> {
  // first we are going to get the cookietoken:
  // const token = context.req.cookies.sessionToken;

  const event = await getAllEvents();
  return {
    props: {
      events: events,
    },
  };

  // will be passed to the page component as props
  // as frontend: going from back- to frontend.
}


-> like on private profile page:
- check cookies / session token of specific user and ; -> get events by user idText- get hosteventsbyId

wie im ecommer -> get all events by user id
