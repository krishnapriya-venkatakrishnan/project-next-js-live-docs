// since we are using the provider
"use client";

import Loader from "@/components/Loader";
import { getClerkUsers } from "@/lib/actions/user.actions";
import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

// in the live blocks doc it is said to enclose ClientSideSuspense within RoomProvider. Since we will have many individual rooms, we will remove this for now and use later on.
// also remove the publicApiKey, because later we will use id tokens, a different way of authenticating our users.
// we will soon implement this endpoint- /api/liveblocks-auth
const Provider = ({children}: {children: ReactNode}) => {
  return (
    <LiveblocksProvider 
    authEndpoint="/api/liveblocks-auth"
    resolveUsers={async({userIds}) => {
      const users = await getClerkUsers({userIds});
      return users;
    }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>    
    </LiveblocksProvider>
  )
}

export default Provider