// since we are using the provider
"use client";

import Loader from "@/components/Loader";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

// in the live blocks doc it is said to enclose ClientSideSuspense within RoomProvider. Since we will have many individual rooms, we will remove this for now and use later on.
// also remove the publicApiKey, because later we will use id tokens, a different way of authenticating our users.
// we will soon implement this endpoint- /api/liveblocks-auth
const Provider = ({children}: {children: ReactNode}) => {
  
  const { user: clerkUser } = useUser();
  
  return (
    <LiveblocksProvider 
    authEndpoint="/api/liveblocks-auth"
    resolveUsers={async({userIds}) => {
      const users = await getClerkUsers({userIds});
      return users;
    }}
    // to know which users are available in the room.
    resolveMentionSuggestions={async({text, roomId}) => {
      const roomUsers = await getDocumentUsers({
        roomId, 
        currentUser: clerkUser?.emailAddresses[0].emailAddress,
        text,
      });
      return roomUsers;
    }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>    
    </LiveblocksProvider>
  )
}

export default Provider