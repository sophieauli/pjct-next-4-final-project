import Head from 'next/head';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password,
      }),
    });
    const loginResponseBody = (await loginResponse.json()) as LoginResponseBody;

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return console.log(loginResponseBody.errors);
    }
    return (
      <div>
        <Head>
          <title>Login</title>
          <meta name="description" content="register" />
        </Head>

        <main>
          <h1>Login</h1>
          <label>
            e-mail
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
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
        </main>
      </div>
    );
  }
}
