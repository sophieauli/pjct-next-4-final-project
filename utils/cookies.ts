import cookie from 'cookie';

// import Cookies from 'js-cookie';

// serializing a cookie = transforming it in such a way, that it can be understood by http - Jose: "JSON stringify for cookies":

export function createSerializedRegisterSessionTokenCookie(token: string) {
  // first checking whether we are in production e.g. fly.io:

  const isProduction = process.env.NODE_ENV === 'production';

  const maxAge = 60 * 60 * 24; // 24h in seconds

  //returning directly from the library command:

  // giving the cookie its name 'sessionToken' and then its value token:
  return cookie.serialize(`sessionToken`, token, {
    maxAge: maxAge,
    // for internet explorer :
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}

// // export function createSerializedCookieTokenAttendingGuests(
//   return cookie.serialize(`session ${eventId} Token`, token, {
// only after getting id from backend with getServerSideProps
