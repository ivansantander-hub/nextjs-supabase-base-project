# Arquitectura Frontend - Atomic Design

## 1. Visión General

Esta aplicación Next.js implementa **Atomic Design** para organizar componentes reutilizables. La arquitectura soporta:

- ✅ Autenticación con Supabase
- ✅ Filtrado y visualización de tareas desde Notion
- ✅ Preview enriquecido de tareas
- ✅ Chat interactivo (con MCPs)
- ✅ Panel de revisión y aprobación
- ✅ Historial de iteraciones
- ✅ Gestión de estado escalable

---

## 2. Estructura de Carpetas - Atomic Design

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + providers
│   ├── page.tsx                  # Home page
│   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/              # Grupo de rutas autenticadas
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── tasks/page.tsx        # Task filtering & list
│   │   ├── task/[id]/page.tsx    # Task preview detallado
│   │   ├── review/page.tsx       # Panel de revisión
│   │   ├── chat/page.tsx         # Chat interactivo
│   │   └── history/page.tsx      # Historial de iteraciones
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── refresh/route.ts
│   │   ├── tasks/
│   │   │   ├── route.ts          # GET/POST tasks
│   │   │   └── [id]/route.ts     # GET/PATCH/DELETE task
│   │   ├── notion/
│   │   │   └── sync/route.ts     # Sincronizar desde Notion
│   │   ├── chat/route.ts         # Chat messages
│   │   └── review/route.ts       # Aprobaciones
│   ├── globals.css               # Estilos globales + Tailwind
│   └── favicon.ico
│
├── components/                   # ATOMIC DESIGN
│   ├── atoms/                    # Componentes primitivos
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Spinner.tsx
│   │   ├── Icon.tsx
│   │   ├── Text.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Select.tsx
│   │   ├── TextArea.tsx
│   │   ├── Avatar.tsx
│   │   └── Divider.tsx
│   │
│   ├── molecules/                # Componentes compuestos simples
│   │   ├── FilterBar.tsx         # Filtros + búsqueda
│   │   ├── SearchInput.tsx       # Input con ícono
│   │   ├── PriorityBadge.tsx     # Badge + Label
│   │   ├── StatusBadge.tsx       # Estado visual
│   │   ├── UserChip.tsx          # Avatar + nombre
│   │   ├── DatePicker.tsx        # Input + calendario
│   │   ├── TaskCard.tsx          # Card de tarea resumida
│   │   ├── ChatMessage.tsx       # Mensaje en chat
│   │   ├── TabNav.tsx            # Pestañas de navegación
│   │   ├── Breadcrumb.tsx        # Navegación de ruta
│   │   ├── Pagination.tsx        # Controles de página
│   │   └── ConfirmDialog.tsx     # Diálogo de confirmación
│   │
│   ├── organisms/                # Componentes complejos
│   │   ├── TaskFilters.tsx       # Filtros avanzados
│   │   ├── TaskList.tsx          # Lista con estado
│   │   ├── TaskPreview.tsx       # Vista enriquecida de tarea
│   │   ├── TaskHistory.tsx       # Historial de cambios
│   │   ├── ChatInterface.tsx     # Chat + MCPs
│   │   ├── ReviewPanel.tsx       # Panel de aprobación
│   │   ├── TaskEditor.tsx        # Editor de tarea
│   │   ├── AuthForm.tsx          # Formulario de login/signup
│   │   ├── Header.tsx            # Header navegación global
│   │   └── Sidebar.tsx           # Menú lateral
│   │
│   ├── templates/                # Layouts complejos
│   │   ├── AuthTemplate.tsx      # Layout para auth
│   │   ├── DashboardTemplate.tsx # Layout principal
│   │   └── ModalTemplate.tsx     # Modales
│   │
│   └── index.ts                  # Exports centralizados
│
├── types/                        # TypeScript definitions
│   ├── index.ts                  # Tipos comunes
│   ├── auth.ts
│   ├── task.ts
│   ├── notion.ts
│   ├── chat.ts
│   ├── user.ts
│   └── api.ts
│
├── stores/                       # State Management (Zustand)
│   ├── authStore.ts             # Autenticación
│   ├── taskStore.ts             # Tareas
│   ├── filterStore.ts           # Filtros
│   ├── chatStore.ts             # Chat
│   ├── reviewStore.ts           # Estado de revisión
│   └── index.ts
│
├── hooks/                        # Custom React Hooks
│   ├── useAuth.ts
│   ├── useTasks.ts
│   ├── useFilters.ts
│   ├── useChat.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
│
├── services/                     # Servicios de API
│   ├── supabase.ts              # Cliente Supabase
│   ├── taskService.ts           # CRUD de tareas
│   ├── notionService.ts         # Integración Notion
│   ├── chatService.ts           # Chat + MCPs
│   ├── reviewService.ts         # Aprobaciones
│   └── authService.ts           # Autenticación
│
├── utils/                        # Utilidades
│   ├── constants.ts             # Constantes globales
│   ├── helpers.ts               # Funciones auxiliares
│   ├── formatters.ts            # Formato de datos
│   ├── validators.ts            # Validación
│   ├── cn.ts                    # Class name helper (Tailwind)
│   └── errors.ts                # Manejo de errores
│
├── lib/                          # Librerías configuradas
│   ├── supabase.ts
│   ├── queryClient.ts
│   └── mcp.ts                   # Configuración MCPs
│
└── config/                       # Configuración
    ├── env.ts
    ├── routes.ts
    └── theme.ts
```

---

## 3. Componentes Principales por Nivel

### 3.1 Atoms (Componentes Primitivos)

```typescript
// Componentes básicos reutilizables sin lógica
Button, Input, Badge, Card, Spinner, Icon, Text, Checkbox,
Select, TextArea, Avatar, Divider
```

**Características:**
- Sin estado (presentacionales)
- Props bien tipificadas
- Estilos consistentes con Tailwind
- Accesibles (ARIA labels)

---

### 3.2 Molecules (Componentes Compuestos)

```typescript
// Combinación de atoms con lógica simple
FilterBar       // Input + Button + filtros
SearchInput     // Input + Icon
PriorityBadge   // Badge + Label
StatusBadge     // Indicador de estado
UserChip        // Avatar + nombre usuario
DatePicker      // Input + selector de fecha
TaskCard        // Card resumida con acciones
ChatMessage     // Mensaje con avatar
TabNav          // Navegación por pestañas
Breadcrumb      // Ruta de navegación
Pagination      // Controles de paginación
ConfirmDialog   // Diálogo modal
```

---

### 3.3 Organisms (Componentes Complejos)

```typescript
// Componentes con lógica de negocio y estado
TaskFilters       // Filtros avanzados (prioridad, estado, asignado)
TaskList          // Lista con paginación, ordenamiento, carga
TaskPreview       // Vista enriquecida (detalles + historial + chat)
TaskHistory       // Timeline de cambios
ChatInterface     // Chat + integración MCPs
ReviewPanel       // Panel de aprobación/rechazo
TaskEditor        // Edición inline de tarea
AuthForm          // Login/signup/forgot-password
Header            // Navegación global + user menu
Sidebar           // Menú lateral con rutas
```

---

### 3.4 Templates (Layouts)

```typescript
// Estructuras de página
AuthTemplate      // Para login/signup (centrado, sin sidebar)
DashboardTemplate // Para dashboard (header + sidebar + main)
ModalTemplate     // Para modales (overlay + contenido)
```

---

### 3.5 Pages (Next.js)

```
(auth)/login           → AuthTemplate + AuthForm
(auth)/signup          → AuthTemplate + AuthForm
(dashboard)/tasks      → DashboardTemplate + TaskFilters + TaskList
(dashboard)/task/[id]  → DashboardTemplate + TaskPreview
(dashboard)/review     → DashboardTemplate + ReviewPanel
(dashboard)/chat       → DashboardTemplate + ChatInterface
(dashboard)/history    → DashboardTemplate + TaskHistory
```

---

## 4. State Management - Zustand

Usaremos **Zustand** por su simplicidad, bundle size pequeño y fácil testing.

### 4.1 Estructura de Stores

```typescript
// src/stores/authStore.ts
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(...)

// src/stores/taskStore.ts
interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilter) => Promise<void>;
  selectTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

// src/stores/filterStore.ts
interface FilterState {
  priority: Priority[];
  status: Status[];
  assignee: User[];
  dateRange: DateRange;
  setPriority: (filters: Priority[]) => void;
  setStatus: (filters: Status[]) => void;
  // ... setters
  reset: () => void;
}

// src/stores/chatStore.ts
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
}

// src/stores/reviewStore.ts
interface ReviewState {
  pendingReviews: Task[];
  approvePending: string[];
  rejectReason: string;
  approve: (taskId: string) => Promise<void>;
  reject: (taskId: string, reason: string) => Promise<void>;
}
```

---

## 5. Integración con APIs

### 5.1 Estructura de Servicios

```typescript
// src/services/supabase.ts
export const supabase = createClient(...)

// src/services/authService.ts
export const authService = {
  login: async (email, password) => {...},
  signup: async (email, password) => {...},
  logout: async () => {...},
  getCurrentUser: async () => {...},
  refreshToken: async () => {...}
}

// src/services/taskService.ts
export const taskService = {
  getTasks: async (filters?: TaskFilter) => {...},
  getTaskById: async (id: string) => {...},
  createTask: async (task: CreateTaskDTO) => {...},
  updateTask: async (id: string, updates: UpdateTaskDTO) => {...},
  deleteTask: async (id: string) => {...},
  syncFromNotion: async () => {...}
}

// src/services/notionService.ts
export const notionService = {
  fetchFromNotion: async (databaseId: string) => {...},
  mapTaskFromNotion: (notion: NotionTask) => Task,
  syncChanges: async () => {...}
}

// src/services/chatService.ts
export const chatService = {
  sendMessage: async (taskId: string, message: string) => {...},
  getMessages: async (taskId: string) => {...},
  invokeMCP: async (query: string, type: 'search' | 'analyze') => {...}
}

// src/services/reviewService.ts
export const reviewService = {
  getPendingReviews: async () => {...},
  approveTask: async (taskId: string) => {...},
  rejectTask: async (taskId: string, reason: string) => {...}
}
```

### 5.2 API Routes (Next.js)

```
POST   /api/auth/login              → Autenticación
POST   /api/auth/logout             → Cierre sesión
POST   /api/auth/refresh            → Refresh token

GET    /api/tasks                   → Listar tareas
GET    /api/tasks/[id]              → Obtener tarea
POST   /api/tasks                   → Crear tarea
PATCH  /api/tasks/[id]              → Actualizar tarea
DELETE /api/tasks/[id]              → Eliminar tarea

POST   /api/notion/sync             → Sincronizar desde Notion

POST   /api/chat                    → Enviar mensaje
GET    /api/chat/[taskId]           → Obtener mensajes

POST   /api/review/[id]/approve     → Aprobar tarea
POST   /api/review/[id]/reject      → Rechazar tarea
GET    /api/review/pending          → Tareas pendientes
```

---

## 6. Testing Strategy

### 6.1 Tipos de Tests

#### A. Unit Tests (Vitest)
```typescript
// Components: props, renders, accesibilidad
// Utils: funciones puras
// Hooks: lógica personalizada

describe('Button', () => {
  it('renders with correct text', () => {})
  it('calls onClick when clicked', () => {})
  it('has correct aria attributes', () => {})
})
```

#### B. Integration Tests (Vitest + React Testing Library)
```typescript
// Componentes con hooks
// Flujos de usuario (filtrar, buscar, editar)
// Interacción entre componentes

describe('TaskFilters', () => {
  it('filters tasks by priority', async () => {})
  it('resets filters when clicking reset', async () => {})
})
```

#### C. E2E Tests (Playwright)
```typescript
// Flujos completos de usuario
// Auth → Tasks → Preview → Review
// Chat interactivo
// Sincronización Notion

describe('Task Management Flow', () => {
  it('creates, edits and approves a task', async () => {})
})
```

#### D. Performance Tests
```typescript
// Lighthouse CI para Core Web Vitals
// Bundle analysis
// Component rendering performance
// Search/filter performance

// Criterios:
// - LCP < 2.5s
// - FID < 100ms
// - CLS < 0.1
// - Total bundle < 200KB (gzipped)
```

#### E. Accessibility Tests
```typescript
// axe-core para validación automatizada
// Manual WCAG 2.1 AA compliance
// Keyboard navigation
// Screen reader testing

describe('Accessibility', () => {
  it('passes axe-core checks', async () => {})
  it('is navigable with keyboard', async () => {})
})
```

### 6.2 Test Structure

```
src/
├── __tests__/
│   ├── components/
│   │   ├── atoms/
│   │   │   └── Button.test.tsx
│   │   ├── molecules/
│   │   │   └── SearchInput.test.tsx
│   │   └── organisms/
│   │       └── TaskList.test.tsx
│   ├── hooks/
│   │   └── useTasks.test.ts
│   ├── services/
│   │   └── taskService.test.ts
│   ├── stores/
│   │   └── taskStore.test.ts
│   └── e2e/
│       └── task-management.spec.ts
```

### 6.3 Criterios de Aceptación

Para cada feature:
1. ✅ Tests unitarios: >80% coverage
2. ✅ Tests de integración: flujos críticos
3. ✅ Tests E2E: happy path completo
4. ✅ Lighthouse: ≥90 en Performance, Accessibility
5. ✅ Accesibilidad: WCAG 2.1 AA (0 violations axe-core)
6. ✅ Performance: Core Web Vitals dentro de límites

---

## 7. Accesibilidad (WCAG 2.1 AA)

### 7.1 Patterns por Componente

#### Buttons
```tsx
<button
  aria-label={descriptiveLabel}
  aria-pressed={isActive}
  disabled={isDisabled}
>
  {children}
</button>
```

#### Form Inputs
```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={hasError}
  aria-describedby="email-error"
  required
/>
{hasError && <span id="email-error" role="alert">{error}</span>}
```

#### Lists & Navigation
```tsx
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a href="/tasks" role="menuitem">Tasks</a>
    </li>
  </ul>
</nav>
```

#### Modals
```tsx
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Confirm Action</h2>
  {/* focus trap implementation */}
</div>
```

#### Keyboard Navigation
- Tab: navegar forward
- Shift+Tab: navegar backward
- Enter/Space: activar botones
- Escape: cerrar modales
- Arrow keys: navegar listas/tabs

#### Screen Readers
- Semantic HTML5
- aria-label / aria-labelledby
- aria-describedby para ayuda
- role attributes donde sea necesario
- Announce dynamic updates con aria-live

---

## 8. Performance Optimization

### 8.1 Code Splitting
```typescript
// Lazy load páginas
import dynamic from 'next/dynamic'

const ChatInterface = dynamic(
  () => import('@/components/organisms/ChatInterface'),
  { loading: () => <Skeleton />, ssr: false }
)
```

### 8.2 Image Optimization
```tsx
<Image
  src="/task-preview.jpg"
  width={800}
  height={600}
  priority={false}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 8.3 Component Memoization
```typescript
// Evitar re-renders innecesarios
const TaskCard = memo(({ task }: Props) => {...})

// Memoizar callbacks
const handleFilter = useCallback((filters) => {
  taskStore.setFilters(filters)
}, [])
```

### 8.4 List Virtualization
```typescript
// Para listas largas
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={tasks.length}
  itemSize={80}
>
  {({ index, style }) => (
    <TaskCard style={style} task={tasks[index]} />
  )}
</FixedSizeList>
```

### 8.5 Bundle Analysis
```bash
# Análisis de bundle
npx next/bundle-analyzer

# Objetivos:
# - Main bundle < 150KB (gzipped)
# - React libraries < 50KB
# - Vendor libraries < 100KB
```

---

## 9. Responsive Design

### 9.1 Breakpoints (Tailwind)
```
sm:  640px   (tablets pequeñas)
md:  768px   (tablets)
lg:  1024px  (laptops)
xl:  1280px  (desktops grandes)
2xl: 1536px  (ultra-wide)

Desktop-first approach: empezar en lg/xl, adaptarse down
```

### 9.2 Layout Patterns
```tsx
// Desktop: sidebar + main
// Tablet: sidebar colapsado + main
// Mobile: drawer + main (si aplica, pero app es desktop-first)

<div className="flex gap-4">
  <aside className="hidden lg:block w-64">
    <Sidebar />
  </aside>

  <main className="flex-1">
    <Header />
    {children}
  </main>
</div>
```

### 9.3 Touch-Friendly UI
- Click targets ≥ 44x44px
- Spacing para móvil (si aplica)
- Confirm actions antes de ejecutar

---

## 10. Dependencias Necesarias

```json
{
  "dependencies": {
    "next": "^16.1.6",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "zustand": "^4.4.0",
    "@supabase/supabase-js": "^2.38.0",
    "@tanstack/react-query": "^5.0.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^19.0.0",
    "@types/node": "^20.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "playwright": "^1.40.0",
    "@axe-core/react": "^4.8.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0"
  }
}
```

---

## 11. Convenciones de Código

### 11.1 Naming
```typescript
// Components: PascalCase
Button, TaskList, ChatInterface

// Hooks: use + PascalCase
useAuth, useTasks, useDebounce

// Stores: lowerCamelCase + Store
authStore, taskStore, filterStore

// Utils/services: lowerCamelCase
formatDate, cn, taskService

// Constants: UPPER_SNAKE_CASE
MAX_TASKS_PER_PAGE, PRIORITY_LEVELS
```

### 11.2 Imports Organization
```typescript
// 1. React/Next
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party
import { create } from 'zustand'
import clsx from 'clsx'

// 3. Internal - absolute imports
import { Button } from '@/components/atoms'
import { useAuth } from '@/hooks'
import { taskService } from '@/services'
import { cn } from '@/utils'

// 4. Types
import type { Task } from '@/types'
```

### 11.3 Component Structure
```typescript
import type { ReactNode } from 'react'
import { memo } from 'react'

interface Props {
  title: string
  children: ReactNode
  onSubmit?: (data: Data) => void
}

const MyComponent = memo(function MyComponent({
  title,
  children,
  onSubmit
}: Props) {
  // hooks
  const [state, setState] = useState()

  // handlers
  const handleClick = () => {}

  // render
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
})

export default MyComponent
```

---

## 12. Integración Continua / Deployment

### 12.1 GitHub Actions Workflow
```yaml
name: Frontend CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test:unit
      - run: pnpm test:integration
      - run: pnpm build
      - run: pnpm test:e2e

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          uploadArtifacts: true
```

---

## 13. Próximos Pasos - Implementación

### Fase 1: Setup Base (Week 1)
- [ ] Crear estructura de carpetas Atomic Design
- [ ] Configurar Zustand stores
- [ ] Setup Supabase client
- [ ] Componentes atoms básicos (Button, Input, Card)

### Fase 2: Autenticación (Week 1-2)
- [ ] AuthService + authStore
- [ ] Componentes de login/signup
- [ ] Middleware de autenticación
- [ ] Tests de autenticación

### Fase 3: Task Management (Week 2-3)
- [ ] TaskService + taskStore
- [ ] TaskFilters + TaskList organisms
- [ ] TaskPreview enriquecido
- [ ] Sincronización Notion

### Fase 4: Chat & MCPs (Week 3-4)
- [ ] ChatService integración MCPs
- [ ] ChatInterface organism
- [ ] Búsqueda en repos

### Fase 5: Review & Polish (Week 4-5)
- [ ] ReviewPanel organism
- [ ] Historial de cambios
- [ ] Tests E2E
- [ ] Performance optimization
- [ ] Accesibilidad audit

---

## 14. Referencias & Recursos

- **Atomic Design**: [atomicdesign.bradfrost.com](https://atomicdesign.bradfrost.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Zustand**: [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Testing Library**: [testing-library.com](https://testing-library.com)
- **WCAG 2.1**: [w3.org/WAI/WCAG21](https://www.w3.org/WAI/WCAG21/quickref/)
- **Web Vitals**: [web.dev/vitals](https://web.dev/vitals/)

