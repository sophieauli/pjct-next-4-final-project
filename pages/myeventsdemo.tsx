import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { Event, getHostEvents } from '../database/events';
import { getValidSessionByToken } from '../database/sessions';
import {
  getUserBySessionToken,
  getUserByUsername,
  User,
} from '../database/users';

const buttonStyle = css`
  background-color: #d9d9d974;
  color: #e9d8ac;
  font-size: 22px;
  border-radius: 5px;
  border-width: 1px;
  border: solid;
  border-color: #e9d8ac;
  padding: 6px 20px;
  border-radius: 5px;
  width: auto;
  cursor: pointer;
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

type Props = {
  user?: User;
  events?: Event;
};

export default function MyEvents(props: Props) {
  const router = useRouter();
  async function logoutHandler() {
    const returnTo = router.query.returnTo;
    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      /^\/[a-zA-Z0-9?=/]*$/.test(returnTo)
    ) {
      return await router.push(returnTo);
    }
    await router.push(`/logout`);
  }

  if (!props.user) {
    // if profile can't be found, return the following page / passing a user not found component:
    return (
      <div>
        <Head>
          <title>Event List</title>
          <meta name="description" content="User not found" />
        </Head>
        <h2>
          Hmm looks like you need to
          <Link href="/login"> login</Link> first...{' '}
        </h2>
      </div>
    );
  }

  // in other cases, return regular profile page:
  return (
    <div>
      <Head>
        <title>Event List</title>
        <meta
          name="description"
          content="User Information and Profile Settings"
        />
        <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
      </Head>
      <Header username={props.user.username} />
      hi {props.user.firstName}!<h2>Coming up</h2>
      <h2>My Events</h2>
      {}
      <button
        css={roundButtonStyle}
        onClick={async () => {
          await router.push(`/newevent`);
        }}
      >
        +
      </button>
      <br />
      <br />
      <button
        css={buttonStyle}
        onClick={async () => {
          await logoutHandler();
        }}
      >
        logout{' '}
      </button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // build redirect:
  const token = context.req.cookies.sessionToken;
  console.log(token);
  if (!token || !(await getValidSessionByToken(token))) {
    return {
      // redirect: {
      //   destination: '/',
      //   permanent: false,
      // },
      props: {},
    };
  }

  const user = await getUserBySessionToken(token);

  console.log(user);

  if (!user) {
    context.res.statusCode = 404;
    return {
      // returning empty object as props if we cannot find the user:
      props: {},
    };
  }

  // retrieve hostEvents and show on page:

  // const eventname = context.query.eventName as string;

  // const hostEvents = await getHostEvents(eventname);
  // if (!hostEvents) {
  //   {
  //     context.res.statusCode = 404;
  //     return {
  //       // returning empty object as props if we cannot find the user:
  //       props: {},
  //     };
  //   }
  // }

  return {
    props: {
      user,
    },
  };
}