// "use strict";
// // app/api/admin-only/route.js

// import { cookies } from "next/headers";
// import { verifyAccessToken } from "@/lib/auth/jwt";
// import { NextResponse } from "next/server";

// export async function GET() {
//   // Await cookies to access the token
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   // If token is not present, return an error
//   if (!token) {
//     return NextResponse.json(
//       { error: "Access token missing" },
//       { status: 401 }
//     );
//   }

//   try {
//     // Verify and decode the access token
//     const payload = verifyAccessToken(token);

//     // Check if the user has admin role
//     if (payload.role !== "admin") {
//       return NextResponse.json(
//         { error: "Access denied: Admins only" },
//         { status: 403 }
//       );
//     }

//     // If everything is fine, welcome the admin
//     return NextResponse.json({ message: "Welcome Admin!" });
//   } catch (err) {
//     // Handle invalid or expired token
//     return NextResponse.json(
//       { error: "Invalid or expired token" },
//       { status: 403 }
//     );
//   }
// // }
