# 📝 Collaborative Rich Text Editor with Next.js, Clerk & Liveblocks

A fully authenticated, collaborative rich text editor built with **Next.js**, **Clerk**, **Liveblocks**, and **Lexical (jsm-editor)**.

---

## 🚀 Project Setup

### 1. ⚙️ Create a New Next.js App
```bash
npx create-next-app@latest project-next-js-live-docs
cd project-next-js-live-docs
```

---

### 2. 🧩 Install `shadcn/ui` Button Component
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
```

> ✨ Don't forget to set up styles and metadata as per [shadcn/ui docs](https://ui.shadcn.com/docs/installation/next)

---

### 3. ✍️ Install `jsm-editor` (Lexical Rich Text Editor)
```bash
npm i jsm-editor
npx jsm-editor add editor
```

This generates:
```
/src
  └── components
  └── styles
  └── assets
```

Move them to the root-level structure:
```
/
  └── components
    └── editor
  └── styles
  └── public
    └── assets
```

🧾 In `/app/globals.css`, import:
```css
@import "../styles/dark-theme.css";
```

---

### 4. 🔐 Authentication with Clerk
```bash
npm install @clerk/nextjs @clerk/themes
```

Wrap your root layout with:
```tsx
<ClerkProvider
  appearance={{
    baseTheme: dark,
    variables: {
      colorPrimary: "#3371FF",
      fontSize: "16px",
    },
  }}
>
  <html>
    <body>{children}</body>
  </html>
</ClerkProvider>
```

> `dark` is from `@clerk/themes`.

#### 📌 Create Auth Routes:
- `/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
```tsx
return <SignIn />; // imported from "@clerk/nextjs"
```
- `/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
```tsx
return <SignUp />; // imported from "@clerk/nextjs"
```

---

### 5. 🤝 Install Liveblocks & Lexical Collaboration
```bash
npm install @liveblocks/client @liveblocks/react @liveblocks/react-ui @liveblocks/react-lexical lexical @lexical/react
npx create-liveblocks-app@latest --init --framework react
```

> Setup `UserMeta` in `liveblocks.config.ts`:
```ts
UserMeta: {
  id: string;
  info: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    color: string;
  };
}
```

---

### 6. 🧪 Setup Liveblocks `Provider`

Create `/app/Provider.tsx`:
```tsx
// in the liveblocks doc it is said to enclose ClientSideSuspense within RoomProvider. Since, we will have many individual rooms, we will remove this for now and use later on.
			
// To setup ID token permissions setup authEndpoint- /api/liveblocks-auth instead of publicApiKey.

// resolveMentionSuggestions runs every time someone types after @.
// It fetches room users (except the current user) who match the typed text.
// Those users are shown in the mention suggestions list.

<LiveblocksProvider authEndpoint="/api/liveblocks-auth"
  resolveUsers={async ({ userIds }) => await getClerkUsers(userIds)}
  resolveMentionSuggestions={async ({ text, roomId }) => {
    return await getDocumentUsers({
      roomId,
      currentUser: clerkUser?.emailAddresses[0].emailAddress,
      text,
    });
  }}
>
  <ClientSideSuspense fallback={<div>Loading…</div>}>
    {children}
  </ClientSideSuspense>
</LiveblocksProvider>
```

Update `/app/layout.tsx`:
```tsx
<ClerkProvider>
  <html>
    <body>
      <Provider>{children}</Provider>
    </body>
  </html>
</ClerkProvider>
```

---

### 7. 🏠 Collaborative Room Setup

Create `/components/CollaborativeRoom.tsx`:
```tsx
// Whenever a user generates a document, we will create a new ID
<RoomProvider id={roomId}>
  <ClientSideSuspense fallback={<div>Loading…</div>}>
    <Header>
      <ActiveCollaborators />
// share logic is handled here
      <SignedOut><SignInButton /></SignedOut>
      <SignedIn><UserButton /></SignedIn>
    </Header>
    <Editor />
  </ClientSideSuspense>
</RoomProvider>
```

---

### 8. 👥 Active Collaborators Component

```tsx
// Get access to other users. Know who are the users given access to the document.
const collaborators = useOthers().map((other) => other.info);

<ul>
  {collaborators.map(({ avatar }, i) => (
    <Image key={i} src={avatar} ... />
  ))}
</ul>
```

Update `/next.config.js`:
```js
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "img.clerk.com",
    },
  ],
}
```
With the above Liveblocks setting is done.
In the doc, it is said to setup collaborative lexical text editor- to start integrating Lexical and Liveblocks. For this, jsm-editor is used.
Following this, add threads.

---

### 9. 🎨 Global Styling
In `/app/globals.css`, import:
```css
@import "@liveblocks/react-ui/styles.css";
@import "@liveblocks/react-lexical/styles.css";
```

---

### 10. 🔐 Liveblocks Authentication with Clerk

https://liveblocks.io/docs/authentication/id-token/nextjs
Install server SDK:
```bash
npm install @liveblocks/node
```

Create `/lib/liveblocks.ts`:
```ts
import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});
```

Create `/app/api/liveblocks-auth/route.ts`:
```ts
import { liveblocks } from "@/lib/liveblocks";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: "", // Add color generation logic
    },
  };

  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}
```

---

### 📁 Project Structure

```
/
├── app/
│   ├── (auth)/sign-in
│   ├── (auth)/sign-up
│   ├── api/liveblocks-auth/
│   ├── Provider.tsx
|   └── globals.css
│   └── layout.tsx
├── components/
│   └── editor/
│   └── CollaborativeRoom.tsx
├── lib/
│   ├── liveblocks.ts
│   ├── actions/
│   └── utils.ts
├── styles/
│   └── dark-theme.css
├── public/
│   └── assets/
├── types/
│   └── index.d.ts
├── next.config.js

```

---

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.dev/)
- [Liveblocks](https://liveblocks.io/)
- [Lexical](https://lexical.dev/)
- [jsm-editor](https://www.jsm-editor.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)

