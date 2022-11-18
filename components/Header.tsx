import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getValidSessionByToken } from '../database/sessions';
import {
  getUserBySessionToken,
  getUserByUsername,
  User,
} from '../database/users';

const headerStyle = css`
  /* position: absolute;
  top: 20px;
  right: 0px;
  padding: 20px; */

  display: flex;
  justify-content: flex-start;
  flex-direction: row-reverse;
  padding: 10px;
  /* width: 100%; */
  /* padding: 10px 20px 20px; */
`;

export default function Header(props: any) {
  return (
    <header>
      <title>Header</title>
      <meta name="description" content="XYZ" />
      <nav css={headerStyle}>
        <div>
          <Link href="/profile"> {props.username} </Link>
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
