import '../styles/globals.css';
import '@fontsource/saira';
import { css, Global } from '@emotion/react';
import { AppProps } from 'next/app';
import Layout from '../components/Layout';

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
            align-items: 'left';
            height: 200vh;
            padding: 20px;
          }
          h1 {
            font-family: 'Saira';
            font-weight: 2000;
            font-size: 42px;
            color: #e9d8ac;
            /* text-align: left;
            align-items: left; */
            width: 100vw;
            /* padding: 20px; */
          }
          h2 {
            font-family: 'Saira';
            color: #e9d8ac;
            font-size: 38px;
            /* text-align: left;
            align-items: left; */
            width: 100vw;
            padding: 20px 0px 0px 2px;
          }
          h3 {
            font-family: 'Saira';
            color: #e9d8ac;
            font-size: 32px;
            /* text-align: left;
            align-items: left; */
            width: 100vw;
            padding: 20px 0px 0px 2px;
          }
          hr {
            border: 1px solid #e9d8ac;
          }
        `}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
