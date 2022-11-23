// import { NextApiRequest, NextApiResponse } from 'next';
// import { updateAttendanceGuest } from '../../database/events_guests';

// export type CreateEventResponseBody =
//   | { errors: [{ message: string }] }
//   | { attendanceStatus: { isAttending: boolean } };

// export default async function UpdateAttendanceGuestHandler(
//   request: NextApiRequest,
//   response: NextApiResponse<CreateEventResponseBody>,
// ) {
//   if (request.method === 'PUT') {
//     const guestToken = request.cookies.guestToken;

//     if (!guestToken) {
//       return response.status(400).json({
//         errors: [{ message: 'guestToken not found' }],
//       });
//     }
//     const statusInfo = await updateAttendanceGuest(isAttending, guestToken);

//   response
//       .status(200)
//       // .setHeader('Set-Cookie', serializedGuestCookie)
//       .json({ attendanceStatus: { isAttending:  } });
//   } else {
//     response.status(401).json({ errors: [{ message: 'Method not allowed' }] });
//   }
// }
