"use server";
import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { nanoid } from "nanoid";
import { parseStringify } from "../utils";

export const createDocument = async({userId, email}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    // create a room
    // create a metadata
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled"
    };

    // only the user who created the document will have write access.
    const usersAccesses: RoomAccesses = {
      [email]: ['room:write']
    };

    // for timebeing to see other users viewing the document on screen, we set the defaultAccesses to ['room:write']
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ['room:write']
    });

    revalidatePath("/"); // a new document will appear whenever we create a new room
    return parseStringify(room); // for any server action, stringify

  } catch(error) {
    console.log(`Error happened while creating a room: ${error}`)
  }
}

export const getDocument = async ({roomId, userId}: {
  roomId: string;
  userId: string;
}) => {
  try{
    const room = await liveblocks.getRoom(roomId);
    
    // TODO: Bring this back. Commenting this for the scenario- login with email1, create a document. Open another site with email2 and try accessing the document- you will be redirected to the home page.
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
  
    // if (!hasAccess) {
    //   throw new Error("You do not have access to this document");
    // }
  
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while getting a room: ${error}`);
  }
}

export const updateDocument = async(roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title
      }
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
    
  } catch(error) {
    console.log(`Error happened while updating the room ${error}`);
  }
}