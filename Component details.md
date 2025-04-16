## 📁 Features Overview

### 🏠 Home Page (`/`)
- 🔐 **Authentication**: Fetched via `await currentUser()` from `@clerk/nextjs/server`.
- 👤 **Header**: Displays
  - 🔔 `<Notifications />` component
  - 🙍‍♂️ `<UserButton />` within `<SignedIn>` block
- 📄 **Documents List**:
  - Fetched using `getDocuments(email)`
  - Renders a list of existing documents with:
    - 🕓 Created timestamp
    - 🗑️ Delete option via `<DeleteModal roomId={id} />`
    - 🔗 Each document links to its detail page
- ➕ **AddDocumentBtn**:
  - Creates a new document and routes to `/documents/:id`

---

## ➕ AddDocumentBtn Component
Creates a new document and navigates to its page:
```tsx
const addDocumentHandler = async () => {
  const room = await createDocument({ userId, email });
  if (room) router.push(`/documents/${room.id}`);
};
```
📍 Triggered by `<Button onClick={addDocumentHandler}>Create Document</Button>`

---

## 📃 Document Page (`/documents/[id]`)
- Gets current user with Clerk
- Fetches document using `getDocument({ roomId, userId })`
- Redirects if unauthorized

### 🔐 User Permissions
- Permissions derived from `room.usersAccesses`
- Users are mapped as:
  - 👀 Viewer
  - ✏️ Editor

### 🧑‍🤝‍🧑 CollaborativeRoom
Rendered with:
```tsx
<CollaborativeRoom
  roomId={id}
  roomMetadata={room.metadata}
  users={usersData}
  currentUserType={currentUserType}
/>
```

---

## 🧩 CollaborativeRoom Component
### 📝 Document Title Editing
- Only editors can edit title
- Edit icon toggles an input field
- Title is updated via:
```tsx
await updateDocument(roomId, documentTitle);
```

### 👥 ShareModal Integration
Displays after collaborators:
```tsx
<ShareModal
  roomId={roomId}
  collaborators={users}
  creatorId={roomMetadata.creatorId}
  currentUserType={currentUserType}
/>
```

### ✍️ Editor Integration
```tsx
<Editor
  roomId={roomId}
  currentUserType={currentUserType}
/>
```

---

## 🔗 ShareModal Component
Allows sharing documents via email with permission level:
- Input email
- Select permission:
  - 👁️ "Can view"
  - ✏️ "Can edit"
- Share via:
```tsx
await updateDocumentAccess({ roomId, email, userType, updatedBy });
```

### 👤 Collaborator List
- Lists current collaborators
- Allows changing permission and removing collaborators via:
```tsx
await removeCollaborator({ roomId, email });
```

---

## 🔧 UserTypeSelector
Used to set user access level:
```tsx
<Select
  value={userType}
  onValueChange={accessChangeHandler}
/>
```
Options:
- 👁️ Viewer
- ✏️ Editor

---

## 🗑️ DeleteModal Component
Renders a confirmation dialog to delete a document:
```tsx
await deleteDocument(roomId);
```
Includes a "Delete" button with loading state.

---

## 🔔 Notifications Component
Displays unread Liveblocks notifications:
- 🛎️ Bell icon shows a blue dot if there are unread notifications
- Uses `useInboxNotifications()` and `useUnreadInboxNotificationsCount()`
- Renders inside `<Popover>`

---

## 💬 Comments Component
Real-time threaded comment section using Liveblocks:
```tsx
<Composer />
{threads.map((thread) => (
  <Thread ... />
))}
```

---

## 🧠 Editor Component

### Props
- `roomId`
- `currentUserType`

### Plugins and Configuration
```tsx
const initialConfig = liveblocksConfig({
  editable: currentUserType === "editor",
  ...
});
```

### Rendering
- 🛠️ ToolbarPlugin
- 🧠 HistoryPlugin, AutoFocusPlugin
- ✍️ `<DeleteModal />` if `editor`
- 💬 Liveblocks Comments and Threads:
```tsx
<LiveblocksPlugin>
  <FloatingComposer />
  <FloatingThreads threads={threads} />
  <Comments />
</LiveblocksPlugin>
```

---

## 🧱 Folder Structure
```
/app
  /documents
    /[id]
      page.tsx
/components
  /editor
    Editor.tsx
    /plugins
      FloatingToolbarPlugin.tsx
  AddDocumentBtn.tsx
  DeleteModal.tsx
  ShareModal.tsx
  Collaborator.tsx
  UserTypeSelector.tsx
  Comments.tsx
  Notifications.tsx
```

---

## 🧪 Technologies Used
- **Next.js 14+**
- **TypeScript**
- **TailwindCSS**
- **Liveblocks**
- **Clerk Authentication**
- **ShadCN UI components**

---
