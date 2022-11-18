import Head from 'next/head';
import Footer from './Footer.js';
import Header from './Header.tsx';

export default function Layout(props) {
  return (
    <>
      <Header />
      <Head>
        <link rel="icon" />
      </Head>

      <main>{props.children}</main>

      <Footer />
    </>
  );
}
