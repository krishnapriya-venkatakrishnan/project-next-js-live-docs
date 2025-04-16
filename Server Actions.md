# 📦 Server Actions Overview

This document outlines the server-side actions used in the project for document and user management. The logic primarily integrates with **Liveblocks** for real-time collaboration and **Clerk** for user management.

---

## 📁 `/lib/actions/room.action.ts`

### 🆕 `createDocument({userId, email})`
Creates a new document room.
- Generates `roomId` via `nanoid()`.
- Sets metadata: creator, email, and default title.
- Defines `usersAccesses` giving the creator `room:write` access.
- Calls `liveblocks.createRoom`.
- ✅ Revalidates home page (`/`) and returns the room object.

---

### 📄 `getDocument({roomId, userId})`
Fetches a specific room by `roomId` and validates if the user has access.
- Uses `liveblocks.getRoom`.
- Throws an error if user is not in `usersAccesses`.

---

### ✏️ `updateDocument(roomId, title)`
Updates the document title.
- Uses `liveblocks.updateRoom`.
- ✅ Revalidates the path `/documents/:roomId`.

---

### 📚 `getDocuments(email)`
Retrieves all documents associated with the provided email.
- Uses `liveblocks.getRooms({ userId: email })`.

---

### 🔄 `updateDocumentAccess({roomId, email, userType, updatedBy})`
Updates access permission for a user.
- Sets new access via `getAccessType(userType)`.
- Uses `liveblocks.updateRoom`.
- Triggers an inbox notification to the invited user. Uses `liveblocks.triggerInboxNotification`
- ✅ Revalidates path `/documents/:roomId`.

- 🛎️ **Notification includes:**
--  Access level granted.
--  Who granted the access (name, avatar, email).

---

### ❌ `removeCollaborator({roomId, email})`
Removes a collaborator from the document.
- Uses `liveblocks.getRoom`
- Prevents self-removal (if email matches the creator).
- Sets their access to `null`.
- ✅ Revalidates path `/documents/:roomId`.
---

### 🗑️ `deleteDocument(roomId)`
Deletes the document completely.
- Calls `liveblocks.deleteRoom`.
- ✅ Revalidates and redirects to `/`.

---

## 🙋 `/lib/actions/user.actions.ts`

### 👥 `getClerkUsers({userIds: string[]})`
Fetches user info from Clerk using `emailAddress` as identifiers.
- Uses `clerkClient` and `getUserList`.
- Returns sorted user data (id, name, email, avatar) matching the order of `userIds`.

---

### 🧑‍🤝‍🧑 `getDocumentUsers({roomId, currentUser, text})`
Fetches all collaborators of a document except the current user.
- Uses `liveblocks.getRoom`.
- Optionally filters by `text` if provided (case-insensitive match on email).
- Returns a parsed, filtered list.

---

## ✅ Liveblocks Integration Notes
- All actions are based on `liveblocks` methods: `createRoom`, `getRoom`, `updateRoom`, `getRooms`, `deleteRoom`, etc.
- Metadata and `usersAccesses` are essential for access control and document filtering.
- Notifications are triggered via `liveblocks.triggerInboxNotification`.

---

## 🛠️ Revalidation & Redirects
- `revalidatePath()` is used to re-fetch pages in Next.js after mutations.
- `redirect()` is used for programmatic navigation post-action.

---

