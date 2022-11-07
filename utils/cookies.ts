import cookie from 'cookie';

// import Cookies from 'js-cookie';

export function createSerializedRegisterSessionTokenCookie(token: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  const maxAge = 60 * 60 * 24; // 24h in seconds

  //returning directly from the library command:

  // first we give the cookie its name 'sessionToken' and then its value "token":
  return cookie.serialize(`session token`, token, {
    maxAge: maxAge,
    // for internet explorer :
    expires: new Date(Date.now() + maxAge * 1000),
  });
}

// // export function createSerializedCookieTokenAttendingGuests(
//   return cookie.serialize(`session ${eventId} Token`, token, {
// only after getting id from backend with getServerSideProps
