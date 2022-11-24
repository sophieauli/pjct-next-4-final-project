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
`;

const privateProfile = css`
  display: flex;

  width: 27vw;

  .firstName {
    display: flex;
    margin-right: 20px;
    align-items: center;
    padding: 0px 0px 7px 20px;
  }
  .userIcon {
    padding: 14px 10px 10px 0px;
  }
`;

export default function Header(props: any) {
  const firstName =
    props.firstName.charAt(0).toUpperCase() + props.firstName.slice(1);
  return (
    <header>
      <title>Header</title>
      <meta name="description" content="XYZ" />
      <nav css={headerStyle}>
        <div css={privateProfile}>
          <div className="firstName">
            <Link href="/private-profile"> {firstName} </Link>
          </div>
          <div className="userIcon">
            <a href="/private-profile">
              <Image
                src="/usericon.svg"
                alt="Join Diego beige"
                width="50"
                height="50"
              />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
