import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

// async function handler(...params: any[]) {
//     const authHandler = NextAuth(authOptions);
//     await authHandler(...params);
//     console.log('HERE')
// }

export { handler as GET, handler as POST }