import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { deleteSessionByToken } from '../database/sessions';

export default function Logout() {
  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // first we have to store the session token in a variable:

  const token = context.req.cookies.sessionToken;
  console.log(token);

  // then we take that variable and delete it frmo the database:

  if (token) {
    await deleteSessionByToken(token);

    // here we delete the cookie from the browser:

    context.res.setHeader(
      'Set-Cookie',
      cookie.serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    );
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
// if token is there only show logout: otherwise show login.
