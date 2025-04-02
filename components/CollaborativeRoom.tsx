// since we will have multiple rooms for each one of our documents, we are creating a separate component
"use client";

import {
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Editor } from "@/components/editor/Editor"
import Header from "@/components/Header"
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

// whenever a user generates a document, we will create a new id
const CollaborativeRoom = ({roomId}: {roomId: string}) => {
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <div className="collaborative-room">
          <Header>
            <div className="flex w-fit items-center justify-center gap-2">
              <p className="document-title">Share</p>
            </div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom