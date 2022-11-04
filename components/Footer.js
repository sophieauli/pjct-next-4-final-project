import { css } from '@emotion/react';

const footerStyles = css`
  margin-top: 20px;
  padding: 15px 20px;
  padding-top: 10px;
  border-top: 1px solid #999999;
`;

export default function Footer() {
  return <footer css={footerStyles}>© Diego Ltdx</footer>;
}
