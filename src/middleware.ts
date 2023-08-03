// import { getServerSession } from 'next-auth';
// // import { headers } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';
import { NextResponse } from 'next/server';

// // import { isAuthenticated } from '@lib/auth' // assuming you have an auth library

// // Limit the middleware to paths starting with `/api/`

// export default async function middleware(request: NextRequest) {
//   console.log("HEREERERE")
//   // const cookie = headers().get('cookie')
//   const session = await getServerSession(authOptions);
//   console.log({session})
//   // const sesh = await getServerSession();
//   // console.log({ sesh });
//   // console.log("!*!*!*!*!*!*!")

//   // Call our authentication function to check the request
// //   if (!isAuthenticated(request)) {
// //     // Respond with JSON indicating an error message
// //     return new NextResponse(
// //       JSON.stringify({ success: false, message: 'authentication failed' }),
// //       { status: 401, headers: { 'content-type': 'application/json' } },
// //     );
// //   }
//   // If authenticated, continue to the next handler
//   return NextResponse.next();
// }
export const config = {
  matcher: ['/api/:function*', '/chat/:any*'],
};

// export { default } from "next-auth/middleware"

export default function () {
  return NextResponse.next();
}
