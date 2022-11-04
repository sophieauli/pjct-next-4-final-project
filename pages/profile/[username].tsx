import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserByUsername } from '../../database/users';

export default function UserProfile() {
  return (
    <div>
      <Head>
        <title>User Profile</title>
        <meta
          name="description"
          content="User Information and Profile Settings"
        />
      </Head>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // retrieve username from url:
  const username = context.query.username;

  if (!(await getUserByUsername(username.toLowerCase()))) {
    console.log('user not found');
    // context.res.statusCode = 404;
    return {
      props: { usre },
    };
  }
  console.log('user found');
}
