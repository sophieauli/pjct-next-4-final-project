// import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

export default function Login() {
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
    if (router.query.returnTo && !Array.isArray(router.query.returnTo)) {
      return await router.push(router.query.returnTo);
    }
  }

  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="login" />
      </Head>

      <h1>Login</h1>
      {errors.map((error) => {
        return <p key={error.message}>ERROR: {error.message}</p>;
      })}
      <label>
        username
        <input
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
      >
        login
      </button>
      <br />
    </div>
  );
}
