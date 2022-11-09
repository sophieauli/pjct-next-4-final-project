import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getUserByUsername, User } from '../../database/users';

type Props = {
  user?: User;
};

export default function UserProfile(props: Props) {
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
    await router.push(`/login`);
  }

  if (!props.user) {
    // if profile can't be found, return the following page / passing a user not found component:
    return (
      <div>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
          <h1>404 - this user could not be found</h1>
        </Head>
      </div>
    );
  }

  // in other cases, return regular profile page:
  return (
    <div>
      <Head>
        <title>User Profile</title>
        <meta
          name="description"
          content="User Information and Profile Settings"
        />
      </Head>
      id: {props.user.id} username: {props.user.username}
      <button
        onClick={async () => {
          await logoutHandler();
        }}
      >
        logout
      </button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // retrieve username and show in url:
  const username = context.query.username as string;
  const user = await getUserByUsername(username.toLowerCase());

  if (!user) {
    context.res.statusCode = 404;
    return {
      // returning empty object as props if we cannot find the user:
      props: {},
    };
  }
  // otherwise, so when the user is found, return and pass the user props:
  return {
    props: { user },
  };
}
