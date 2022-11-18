import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getValidSessionByToken } from '../database/sessions';

const buttonStyle = css`
  background-color: #d9d9d974;
  color: #e9d8ac;
  font-size: 24px;
  border-radius: 5px;
  border-width: 1px;
  border: solid;
  border-color: #e9d8ac;
  padding: 6px 20px;
  border-radius: 5px;
  width: auto;
  cursor: pointer;
`;

const displaySectionStyle = css`
  text-align: center;
`;

const thinnerText = css`
  font-weight: 1000;
`;
export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" />
        <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
      </Head>
      <div css={displaySectionStyle}>
        <main>
          <Image
            src="/Join Diego.svg"
            alt="Join Diego beige"
            width="402"
            height="123"
          />
          <br />
          <button
            css={buttonStyle}
            onClick={async () => {
              await router.push(`/register`);
            }}
          >
            sign up
          </button>
          <div css={thinnerText}>
            Already have an account? <Link href="/login"> Login </Link>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // first we are going to get the token:
  const token = context.req.cookies.sessionToken;

  if (token && (await getValidSessionByToken(token))) {
    return {
      redirect: {
        destination: '/private-profile',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
