import Head from 'next/head';
import Footer from './Footer.js';

export default function Layout(props) {
  return (
    <>
      <Head>
        <link rel="icon" />
      </Head>

      <main>{props.children}</main>

      <Footer />
    </>
  );
}
