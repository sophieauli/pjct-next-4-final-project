import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { getUserByUsername, User } from '../database/users_table';

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
  color: #939090;
`;
type Props = {
  user: User;
};
export default function Header(props: Props) {
  return (
    <header>
      <title>Header</title>
      <meta name="description" content="XYZ" />
      <nav css={headerStyle}>
        <div>
          <Link href="/"> {props.firstName} </Link>
        </div>
        <div>
          <Link href="/products" data-test-id="products-link">
            our hats
          </Link>
        </div>
        <div data-test-id="cart-count">
          <Link href="/cart" data-test-id="cart-link">
            <a>cart ({props.cart ? cartAmountCount : 0})</a>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default function GetServerSideProps
