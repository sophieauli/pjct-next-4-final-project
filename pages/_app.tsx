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
            font-size: 24px;
            color: #e9d8ac;
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
            text-align: center;
            align-items: center;
            width: 100vw;
            /* padding: 20px; */
          }
          h2 {
            font-family: 'Saira';
            font-size: 22;
            color: #e9d8ac;
            text-align: left;
            align-items: center;
            width: 100vw;
            padding: 20px 0px 0px 2px;
          }
          hr {
            border-top: 1px solid #e9d8ac;
          }
        `}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
