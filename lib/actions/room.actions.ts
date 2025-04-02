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

    const usersAccesses: RoomAccesses = {
      [email]: ['room:write']
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: []
    });

    revalidatePath("/"); // a new document will appear whenever we create a new room
    return parseStringify(room); // for any server action, stringify

  } catch(error) {
    console.log(`Error happened while creating a room: ${error}`)
  }
}