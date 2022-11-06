import bcrypt from 'bcrypt';
import Head from 'next/head';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

export default function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: name.toLowerCase(),
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
          name
          <input
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value);
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
