import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  getUserBySessionToken,
  getUserByUsername,
  User,
} from '../database/users';

const headerStyle = css`
  display: flex;
  justify-content: flex-start;
  flex-direction: row-reverse;
  padding: 10px;
`;

export default function Header(props: any) {
  const firstName =
    props.firstName.charAt(0).toUpperCase() + props.firstName.slice(1);
  return (
    <header>
      <title>Header</title>
      <meta name="description" content="XYZ" />
      <nav css={headerStyle}>
        <div>
          <Link href="/private-profile"> {firstName} </Link>
          <Image
            src="/usericon.svg"
            alt="Join Diego beige"
            width="50"
            height="50"
          />
        </div>
      </nav>
    </header>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const token = context.req.cookies.sessionToken;

//   const user = token && (await getUserBySessionToken(token));

//   if (!user) {
//     return {
//       redirect: {
//         destination: '/login?returnTo=/private-profile',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { user },
//   };
// }
