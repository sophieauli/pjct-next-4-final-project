import Head from 'next/head';
import { User } from '../database/users.js';
import Footer from './Footer.js';
import Header from './Header';

type Props = {
  user?: User;
  events?: Event;
  children: JSX.Element;
};

export default function Layout(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <link rel="icon" />
        </Head>

        <main>{props.children}</main>

        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <link rel="icon" />
        </Head>
        <Header />
        <main>{props.children}</main>

        <Footer />
      </>
    );
  }
}
