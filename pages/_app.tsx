import '../styles/globals.css';
import '@fontsource/saira';
import { css, Global } from '@emotion/react';
import { AppProps } from 'next/app';
import Layout from '../components/Layout.js';

export default function MyApp({ Component, pageProps }: AppProps) {
  // the component's props are Component and pageProps for which you then define the type AppProps!
  return (
    <>
      <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }
          body {
            background-color: black;
            font-family: 'Saira';
            font-size: 22px;
            color: #e9d8ac;
            text-align: center;
            width: 100vw;
            display: 'flex';
            justify-content: 'center';
            align-items: 'center';
            height: 200vh;
          }
          h1 {
            font-family: 'Saira';
            font-weight: 2000;
            color: #e9d8ac;
            align-items: center;
            width: 100vw;
            /* padding: 20px; */
          }
        `}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
