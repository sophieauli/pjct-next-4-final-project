import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { LoginResponseBody } from './api/login';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

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

const loginSectionStyle = css`
  text-align: center;
`;

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
      }),
    });

    const loginResponseBody = (await loginResponse.json()) as LoginResponseBody;

    // we need to "set" the errors to whatever error messages are coming from the response body:
    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return console.log(loginResponseBody.errors);
    }
    // by assiging it a variable, we are going to limit redirects to pages from my domain:
    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      /^\/[a-zA-Z0-9?=/]*$/.test(returnTo)
    ) {
      // refresh the user on state
      await props.refreshUserProfile();
      return await router.push(returnTo);
    }

    // refresh the user on state
    // await props.refreshUserProfile();
    // redirect user to user profile
    await router.push(`/myevents`);
    // await router.push(`/profile/${loginResponseBody.user.username}`);
  }

  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="login" />
        <link rel="icon" href="/App-Icon-Logo-Diego.ico" />
      </Head>

      <h1>Login</h1>
      <div css={loginSectionStyle}>
        {errors.map((error) => {
          return <p key={error.message}>ERROR: {error.message}</p>;
        })}
        <label>
          username
          <input
            css={inputFieldStyle}
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value.toLowerCase());
            }}
          />
        </label>
        <br />
        <label>
          password
          <input
            css={inputFieldStyle}
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <button
          onClick={async () => {
            await loginHandler();
          }}
          css={buttonStyle}
        >
          login
        </button>
        <br />
        <div>
          Not a member yet? <Link href="/register"> Sign up </Link>
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   // first we are going to get the token:
//   const token = context.req.cookies.sessionToken;

//   if (token && (await getValidSessionByToken(token))) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: true,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// }
