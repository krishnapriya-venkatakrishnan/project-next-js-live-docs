// https://liveblocks.io/docs/authentication/id-token/nextjs

import { Liveblocks } from "@liveblocks/node";
// /node means it runs on server

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});