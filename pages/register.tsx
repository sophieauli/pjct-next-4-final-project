import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { RegisterResponseBody } from './api/register';

const lighterText = css`
  color: #e9d8ac;
`;
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

const inputFieldStyle = css`
  color: #e9d8ac;
  background-color: #e9d8ac3e;
  font-size: 22px;
  border-radius: 5px;
  border-width: 1px;
  font-size: 24px;
  margin: 5px;
  padding: 10px;
  border: solid;
  border-color: #e9d8ac;
  display: table-cell;
`;

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName.toLowerCase(),
        username: username.toLowerCase(),
        password,
      }),
    });

    // packing the api response into a variable and giving it a type at the end (either as a type error or type user because those are the types we defined it with in api/register file):

    const registerResponseBody =
      (await registerResponse.json()) as RegisterResponseBody;

    // we still need to "set" the errors to whatever error messages are coming from the response body:

    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);

      return console.log(registerResponseBody.errors);
    }
    // check login.tsx for explanation of logic below:

    const returnTo = router.query.returnTo;
    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      /^\/[a-zA-Z0-9?=/]*$/.test(returnTo)
    ) {
      return await router.push(returnTo);
    }
    // await router.push(`/profile/${registerResponseBody.user.username}`);
    await router.push(`/private-profile`);
  }
  return (
    <div>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="register" />
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
          <label>
            first name
            <input
              css={inputFieldStyle}
              value={firstName}
              onChange={(event) => {
                setFirstName(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <label>
            username
            <input
              css={inputFieldStyle}
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <label>
            password
            <input
              css={inputFieldStyle}
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <button
            onClick={async () => {
              await registerHandler();
            }}
            css={buttonStyle}
          >
            sign up
          </button>
          <div css={lighterText}>
            Already have an account? <Link href="/login"> Login </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // first we are going to the token:
  const token = context.req.cookies.sessionToken;

  if (token && (await getValidSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
