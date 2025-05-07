import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { getUserById } from "@/lib/db/users";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      console.log("Auth/Me: No access token found in cookies");
      return new Response(JSON.stringify({ error: "No access token found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the access token
    const verifiedPayload = verifyAccessToken(token);
    if (verifiedPayload?.error) {
      console.log(
        `Auth/Me: Token verification failed (${verifiedPayload.error})`
      );
      const response = new Response(
        JSON.stringify({ error: verifiedPayload.error }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
      response.headers.append(
        "Set-Cookie",
        "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      return response;
    }

    console.log("Auth/Me: Fetching user with ID:", verifiedPayload.id);
    const user = await getUserById(verifiedPayload.id);
    if (!user) {
      console.log("Auth/Me: User not found for ID:", verifiedPayload.id);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Auth/Me: User email fetched successfully:", user.email);
    return new Response(JSON.stringify({ email: user.email }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    const response = new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
    response.headers.append(
      "Set-Cookie",
      "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
    return response;
  }
}
