// https://liveblocks.io/docs/authentication/id-token/nextjs
import {liveblocks} from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  // Use Clerk to get the session claims for the current user.
  // Redirect to sign-in page, if the user is not logged in.
  const { sessionClaims } = await auth();
  if (!sessionClaims) redirect ("/sign-in");
  
  // Use Clerk to get more details about the current user.
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // Get the current user from clerk info
  const {id, firstName, lastName, emailAddresses, imageUrl} = clerkUser;
  const userEmail = emailAddresses[0].emailAddress;
  if (!userEmail) {
    return new Response("User email not found", {status: 400});
  }

  // get the room id from the request body
  const { room } = await request.json(); 
  // Construct user object
  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: userEmail,
      avatar: imageUrl,
      color: getUserColor(id),
    },
  };
  
  // Create a Liveblocks session
  const session = liveblocks.prepareSession(user.id, {
    userInfo: user.info
  });
  
  // Grant full access to the room
  session.allow(room, session.FULL_ACCESS);
  
  // Authorize session
  const { body, status } = await session.authorize();
  return new Response(body, { status });
  
}