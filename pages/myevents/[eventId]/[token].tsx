// import { GetServerSidePropsContext } from 'next';

import { GetServerSidePropsContext } from 'next';

export default function Token() {
  return <div> token page </div>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log(context.query);
  return { props: {} };
}
