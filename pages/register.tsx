import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { RegisterResponseBody } from './api/register';

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
    await router.push(`/profile/${registerResponseBody.user.username}`);
  }
  return (
    <div>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="register" />
      </Head>

      <main>
        <h2>Join Diego</h2>
        <label>
          first name
          <input
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
        >
          sign up
        </button>
      </main>
    </div>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // first we are going to the token:
  const token = context.req.cookies.sessionToken;

  if (token && (await getValidSessionByToken(token)))
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
}
