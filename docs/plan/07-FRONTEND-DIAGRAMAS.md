# Diagramas de Arquitectura Frontend

## 1. Flujo de Datos - State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Components                             │
│  (Pages, Templates, Organisms, Molecules, Atoms)                │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ useStore() / useHook()
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Zustand Stores                            │
├─────────────────────────────────────────────────────────────────┤
│ • authStore        (usuario, sesión)                             │
│ • taskStore        (tareas, estado)                              │
│ • filterStore      (filtros activos)                             │
│ • chatStore        (mensajes)                                    │
│ • reviewStore      (aprobaciones)                                │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ dispatch actions
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Services Layer                            │
├─────────────────────────────────────────────────────────────────┤
│ • authService      (login, logout, refresh)                      │
│ • taskService      (CRUD, filtrado)                              │
│ • notionService    (sync Notion)                                 │
│ • chatService      (mensajes, MCPs)                              │
│ • reviewService    (aprobaciones)                                │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ HTTP requests (Supabase, Notion API, MCPs)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend APIs                              │
│  (/api/auth, /api/tasks, /api/notion, /api/chat, /api/review)   │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ Database queries, external API calls
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  (Supabase DB, Notion API, MCP Servers)                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Flujo de Usuario - Task Management

```
┌────────────────┐
│  Login/Signup  │
└────────────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │   Dashboard Main (Task List)    │
    │  TaskFilters + TaskList         │
    └─────────────────────────────────┘
         │
         ├──► Filter by Priority
         ├──► Filter by Status
         ├──► Search / Sort
         │
         ▼
    ┌─────────────────────────────────┐
    │   Task Preview (Detailed View)  │
    │  TaskPreview Organism           │
    │  ├─ Task info                   │
    │  ├─ History                     │
    │  ├─ Chat interface + MCPs       │
    │  └─ Quick actions               │
    └─────────────────────────────────┘
         │
         ├──► Edit task
         ├──► Send message (with MCP)
         ├──► View history
         │
         ▼
    ┌─────────────────────────────────┐
    │    Review Panel (Approve/Reject) │
    │   ReviewPanel Organism          │
    │   ├─ Pending tasks              │
    │   ├─ Approve button             │
    │   ├─ Reject with reason         │
    │   └─ Bulk actions               │
    └─────────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │      History View               │
    │   TaskHistory Organism          │
    │   ├─ Timeline de cambios        │
    │   ├─ Quien cambió qué           │
    │   ├─ Cuando                     │
    │   └─ Revert option (si aplica)  │
    └─────────────────────────────────┘
```

---

## 3. Composición de Componentes - Task Preview

```
┌──────────────────────────────────────────────────────────┐
│              TaskPreview (Organism)                       │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │ Header Section (Molecule)                          │  │
│  │  ├─ Title + Status Badge (Atoms)                   │  │
│  │  ├─ Priority Badge (Molecule)                      │  │
│  │  └─ Quick Actions (Button atoms)                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Details Section (Molecules)                        │  │
│  │  ├─ Assignee (UserChip molecule)                   │  │
│  │  ├─ Due Date (DatePicker molecule)                 │  │
│  │  ├─ Description (Text atom)                        │  │
│  │  └─ Custom Fields (dynamic molecules)              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ TabNav Molecule (Tasks History / Chat)             │  │
│  │  ├─ Tab 1: History (TaskHistory organism)          │  │
│  │  └─ Tab 2: Chat (ChatInterface organism)           │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ History Section (TaskHistory Organism)             │  │
│  │  ├─ Timeline container                             │  │
│  │  └─ Change items (molecules)                       │  │
│  │     ├─ Avatar + User name (Atom)                   │  │
│  │     ├─ Change description (Text atom)              │  │
│  │     └─ Timestamp (Text atom)                       │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Chat Section (ChatInterface Organism)              │  │
│  │  ├─ Messages list (ChatMessage molecules)          │  │
│  │  │  ├─ Avatar + name (UserChip molecule)           │  │
│  │  │  ├─ Message content (Text atom)                 │  │
│  │  │  └─ Timestamp (Text atom)                       │  │
│  │  │                                                  │  │
│  │  └─ Input area                                     │  │
│  │     ├─ TextArea (Atom)                             │  │
│  │     ├─ MCP Select (Molecule)                       │  │
│  │     └─ Send Button (Atom)                          │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Estado Global - Task Store

```
┌─────────────────────────────────────────┐
│          taskStore (Zustand)            │
├─────────────────────────────────────────┤
│                                         │
│  STATE:                                 │
│  ├─ tasks: Task[]                       │
│  ├─ selectedTask: Task | null           │
│  ├─ isLoading: boolean                  │
│  ├─ error: string | null                │
│  └─ pagination: {                       │
│      page: number                       │
│      pageSize: number                   │
│      total: number                      │
│     }                                   │
│                                         │
│  ACTIONS (setters):                     │
│  ├─ fetchTasks(filters) → Promise       │
│  ├─ selectTask(id) → void               │
│  ├─ updateTask(id, updates) → Promise   │
│  ├─ deleteTask(id) → Promise            │
│  ├─ createTask(task) → Promise          │
│  ├─ resetError() → void                 │
│  └─ resetStore() → void                 │
│                                         │
│  SELECTORS:                             │
│  ├─ getSelectedTask() → Task | null     │
│  ├─ getPending() → Task[]               │
│  ├─ getByPriority(p) → Task[]           │
│  └─ hasErrors() → boolean               │
│                                         │
└─────────────────────────────────────────┘

  Component Usage:
  ┌──────────────────────────────────────┐
  │ const TaskList = () => {             │
  │   const tasks = useTaskStore(         │
  │     (s) => s.tasks                   │
  │   )                                  │
  │   const { fetchTasks } = useTaskStore│
  │                                       │
  │   useEffect(() => {                  │
  │     fetchTasks()                     │
  │   }, [])                             │
  │                                       │
  │   return tasks.map(...)              │
  │ }                                    │
  └──────────────────────────────────────┘
```

---

## 5. Jerarquía de Componentes - Dashboard

```
DashboardTemplate
├── Header
│   ├── Logo (Atom)
│   ├── Navigation (Molecules)
│   │   ├─ NavLink × N
│   │   └─ Breadcrumb (Molecule)
│   └── User Menu
│       ├─ Avatar (Atom)
│       ├─ Dropdown (Molecule)
│       └─ Logout (Atom Button)
│
├── Sidebar
│   ├── Logo (Atom)
│   ├── Navigation Links (Molecules)
│   │   ├─ NavItem × N
│   │   │  ├─ Icon (Atom)
│   │   │  └─ Text (Atom)
│   │   └─ Divider (Atom)
│   └── User Info (Molecule)
│       ├─ Avatar (Atom)
│       └─ Name/Email (Atoms)
│
└── Main Content
    └── Page (varies)
        ├── TaskFilters (Organism)
        │   ├── FilterBar (Molecule)
        │   ├── PriorityFilter (Molecule)
        │   ├── StatusFilter (Molecule)
        │   └── ResetButton (Atom)
        │
        ├── TaskList (Organism)
        │   ├── Pagination (Molecule)
        │   └── TaskCard (Molecules) × N
        │       ├── Checkbox (Atom)
        │       ├── Title (Text atom)
        │       ├── StatusBadge (Molecule)
        │       ├── PriorityBadge (Molecule)
        │       ├── Assignee (Molecule)
        │       └── Actions (Molecules)
        │
        └── Floating Action Button (Atom)
            └── New Task
```

---

## 6. Flujo de Autenticación

```
┌──────────────────┐
│  Login Page      │
│  AuthTemplate    │
│  + AuthForm      │
└──────────────────┘
         │
         │ Email + Password
         ▼
    ┌─────────────────────────┐
    │  authService.login()    │
    │  POST /api/auth/login   │
    └──────────┬──────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Backend: Supabase Auth           │
    │  - Validate credentials          │
    │  - Create session                │
    │  - Return JWT + Refresh token    │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Client: Save tokens              │
    │  - localStorage / httpOnly cookie │
    │  - Set authStore state           │
    │  - Redirect to /dashboard        │
    └──────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Protected Route Middleware       │
    │  - Check authStore.user          │
    │  - Validate JWT                  │
    │  - Refresh if needed             │
    │  - Redirect if invalid           │
    └──────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Dashboard / Protected Pages      │
    │  - Render with user context      │
    └──────────────────────────────────┘
```

---

## 7. Flujo de Chat con MCPs

```
┌──────────────────────────────────┐
│  ChatInterface (Organism)        │
│  ├─ Message list                 │
│  └─ Input + MCP selector         │
└──────────────────────────────────┘
         │
         │ User writes message + selects MCP
         ▼
    ┌──────────────────────────────────┐
    │ chatService.sendMessage()        │
    │ POST /api/chat                   │
    │ { taskId, message, mcpType }     │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Backend: Process message         │
    │  1. Save message to DB           │
    │  2. If MCP:                      │
    │     - Invoke MCP (search/analyze)│
    │     - Get results                │
    │  3. Return to client             │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Client: Update chatStore         │
    │  - Add message                   │
    │  - Display in ChatInterface      │
    │  - If MCP results, show context  │
    └──────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Real-time updates                │
    │ (WebSocket/polling if needed)    │
    │  - Show typing indicators        │
    │  - Refresh messages              │
    │  - Notify on new replies         │
    └──────────────────────────────────┘
```

---

## 8. Performance Optimization Flow

```
┌─────────────────────────────────────────────────────┐
│              Code Splitting Strategy                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Main Bundle (85KB gzipped)                         │
│  ├─ React + Next.js core                            │
│  ├─ Atoms + Molecules (shared)                      │
│  ├─ Zustand stores                                  │
│  └─ Auth + Layout core                             │
│                                                     │
│  Lazy-loaded (dynamically imported):                │
│  ├─ ChatInterface → 25KB (loaded on demand)         │
│  ├─ TaskPreview → 20KB (loaded on demand)           │
│  ├─ ReviewPanel → 15KB (loaded on demand)           │
│  └─ TaskHistory → 18KB (loaded on demand)           │
│                                                     │
│  Strategies:                                        │
│  ├─ Route-based splitting (next/dynamic)            │
│  ├─ Component lazy loading (React.lazy)             │
│  ├─ Image optimization (next/image)                 │
│  └─ Memoization (React.memo)                        │
│                                                     │
│  Monitoring:                                        │
│  ├─ Web Vitals tracking                             │
│  ├─ Bundle analyzer                                 │
│  └─ Lighthouse CI                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 9. Testing Pyramid

```
                    ▲
                   /│\
                  / │ \
                 /  │  \
                /   │   \  E2E Tests
               /    │    \ (Playwright)
              /     │     \ ~10 tests
             /______│______\
            /       │       \
           /        │        \
          /         │         \ Integration Tests
         /          │          \ (React Testing Library)
        /           │           \ ~40 tests
       /____________│____________\
      /             │             \
     /              │              \
    /               │               \ Unit Tests
   /                │                \ (Vitest)
  /                 │                 \ ~150 tests
 /___________________│___________________\

E2E: Auth → Tasks → Preview → Chat → Review
Integration: Component flows, user interactions
Unit: Individual components, hooks, utils
```

---

## 10. Accesibilidad - Focus Management

```
┌─────────────────────────────────────────┐
│    Focus Management Strategy             │
├─────────────────────────────────────────┤
│                                         │
│  Modal/Dialog:                          │
│  1. Save focus before opening           │
│  2. Set initial focus (close button)    │
│  3. Trap focus inside modal             │
│  4. Restore focus on close              │
│                                         │
│  Form Validation:                       │
│  1. Mark invalid inputs (aria-invalid)  │
│  2. Show error messages (role="alert")  │
│  3. Focus on error on submit            │
│  4. Clear on correction                 │
│                                         │
│  Dynamic Updates:                       │
│  1. Use aria-live for announcements     │
│  2. Politeness: assertive for urgent    │
│  3. Announce results of actions         │
│  4. Update aria-busy during loading     │
│                                         │
│  Keyboard Navigation:                   │
│  ├─ Tab: forward navigation             │
│  ├─ Shift+Tab: backward                 │
│  ├─ Enter/Space: activate buttons       │
│  ├─ Escape: close modals                │
│  ├─ Arrow keys: list navigation         │
│  └─ Visible focus indicators            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 11. Data Flow - Notion Sync

```
┌────────────────────┐
│  Notion Database   │
│  (Tasks)           │
└────────────────────┘
         │
         │ Sync triggered (manual/scheduled)
         ▼
    ┌──────────────────────────────────┐
    │ POST /api/notion/sync            │
    │ notionService.syncFromNotion()   │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Fetch from Notion API            │
    │ notionService.fetchFromNotion()  │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Map Notion properties to Task    │
    │ notionService.mapTaskFromNotion()│
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Upsert to Supabase DB            │
    │ taskService.syncChanges()        │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Update local state (taskStore)   │
    │ useTaskStore.setState()          │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Re-render TaskList, filters, etc │
    │ Components get updated data      │
    └──────────────────────────────────┘
```

---

## 12. Responsive Layout Transitions

```
Desktop (≥1024px):
┌──────────────────────────────────────┐
│ Header                               │
├────────────┬───────────────────────┤
│  Sidebar   │  Main Content          │
│  (280px)   │  (flex-1)              │
│            │                        │
│            │  ┌──────────────────┐  │
│            │  │ Filters          │  │
│            │  ├──────────────────┤  │
│            │  │ Task List        │  │
│            │  │ (grid/flex)      │  │
│            │  └──────────────────┘  │
│            │                        │
└────────────┴───────────────────────┘

Tablet (768-1023px):
┌──────────────────────────┐
│ Header + Mobile Menu    │
├──────────────────────────┤
│  Main Content            │
│  ┌────────────────────┐  │
│  │ Filters (collapsed)│  │
│  ├────────────────────┤  │
│  │ Task List          │  │
│  │ (flex column)      │  │
│  └────────────────────┘  │
│                          │
└──────────────────────────┘

Mobile (< 768px):
Not supported (Desktop-first)
But if needed:
┌──────────────────────┐
│ Header + Drawer btn  │
├──────────────────────┤
│ Main Content         │
│                      │
└──────────────────────┘
+ Drawer overlay
```

