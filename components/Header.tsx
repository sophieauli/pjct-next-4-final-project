import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  getUserBySessionToken,
  getUserByUsername,
  User,
} from '../database/users';

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  color: #939090;
`;
type Props = {
  user: User;
};
export default function Header(props: Props) {
  return (
    <header>
      <title>Header</title>
      <meta name="description" content="XYZ" />
      <nav css={headerStyle}>
        <div>
          <Link href="/profile"> testuser </Link>
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
