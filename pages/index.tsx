import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
`;

const thinnerText = css`
  font-weight: 1000;
`;
export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>My Events</title>
        <meta name="description" />
        <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
      </Head>

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
    </>
  );
}
