import { css } from '@emotion/react';

const footerStyles = css`
  position: absolute;
  bottom: 0;
`;

export default function Footer() {
  return <footer css={footerStyles}>© Diego Ltdx</footer>;
}
