# Frontend Architecture - Quick Reference

## Documentación Completa

| Documento | Propósito | Secciones |
|-----------|-----------|-----------|
| **FRONTEND_ARCHITECTURE.md** | Arquitectura completa | Estructura carpetas, componentes por nivel, state management, APIs, testing, a11y, performance |
| **ARCHITECTURE_DIAGRAMS.md** | Visuales y flujos | 12 diagramas de datos, usuarios, composición, estado, chat, performance |
| **COMPONENT_EXAMPLES.md** | Código implementación | Button, Input, Badge, SearchInput, TaskCard, TaskFilters, TaskList, Stores, Hooks, Services, Tests |
| **IMPLEMENTATION_CHECKLIST.md** | Plan desarrollo | 8 fases con checkboxes, quality gates, dependencias, métricas de éxito |

---

## Carpetas & Propósito

```
src/
├── app/                    # Next.js App Router (pages)
├── components/             # Atomic Design (atoms → molecules → organisms)
├── stores/                 # Zustand state management (5 stores)
├── services/               # API layer (auth, task, notion, chat, review)
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript definitions
├── lib/                    # Librerías configuradas
├── utils/                  # Utilidades y helpers
└── config/                 # Configuración global
```

---

## Stack Frontend - Con shadcn/ui

```typescript
Next.js 16 + React 19
├─ Styling: Tailwind CSS
├─ Components Base: shadcn/ui (copy/paste, Radix UI accesible)
├─ State: Zustand
├─ Dark Mode: next-themes
├─ i18n: next-intl
├─ Compiler: Turbopack
└─ Testing: Vitest + Playwright
```

## Componentes por Nivel

### shadcn/ui Base (17 componentes)
`Button` `Input` `Card` `Dialog` `Select` `Dropdown` `Tabs` `Badge` `Toast` `Tooltip` `Popover` `Textarea` `Checkbox` `RadioGroup` `Switch` `Progress` `Skeleton`

### Atoms (custom + shadcn extensions)
`Button` `Input` `Badge` `Text` `Icon` `Label` `Link` `Spinner`

### Molecules (shadcn combinations)
`SearchInput` `StatusBadge` `TaskCard` `ChatMessage` `FormField` `FilterBar` `PaginationControl` `ConfirmDialog`

### Organisms (complex compositions)
`TaskFilters` `TaskList` `TaskPreview` `TaskHistory` `ChatInterface` `ReviewPanel` `TaskEditor` `Header` `Sidebar`

### Templates (layouts)
`AuthTemplate` `DashboardTemplate` `ModalTemplate`

---

## State Management - Zustand Stores

```typescript
authStore       // user, token, isLoading, error
taskStore       // tasks, selectedTask, isLoading, pagination, error
filterStore     // priority, status, assignee, dateRange
chatStore       // messages, isLoading
reviewStore     // pendingReviews, approvePending, rejectReason
```

---

## API Endpoints

### Auth
```
POST   /api/auth/login              Login
POST   /api/auth/logout             Logout
POST   /api/auth/refresh            Refresh token
```

### Tasks
```
GET    /api/tasks                   List tasks
POST   /api/tasks                   Create task
GET    /api/tasks/[id]              Get task
PATCH  /api/tasks/[id]              Update task
DELETE /api/tasks/[id]              Delete task
```

### Notion
```
POST   /api/notion/sync             Sync from Notion
```

### Chat
```
POST   /api/chat                    Send message
GET    /api/chat/[taskId]           Get messages
```

### Review
```
GET    /api/review/pending          Get pending tasks
POST   /api/review/[id]/approve     Approve task
POST   /api/review/[id]/reject      Reject task
```

---

## Pages (Next.js Routes)

```
/                          Home
/login                     Login
/signup                    Signup
/forgot-password           Forgot password

/dashboard                 Main dashboard
/dashboard/tasks           Task list
/dashboard/task/[id]       Task preview
/dashboard/chat            Chat interface
/dashboard/review          Review panel
/dashboard/history         Historial
```

---

## Custom Hooks

```typescript
useAuth()           // Current user, login, logout
useTasks()          // Tasks, reload, filters
useFilters()        // Filter state
useChat()           // Chat messages, send
useDebounce()       // Debounce values
useLocalStorage()   // Persist to localStorage
useMediaQuery()     // Responsive breakpoints
```

---

## Convenciones Rápido

### Imports
```typescript
// 1. React/Next
import React from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party
import { create } from 'zustand'
import clsx from 'clsx'

// 3. Internal - absolute imports
import { Button } from '@/components/atoms'
import { useAuth } from '@/hooks'

// 4. Types
import type { Task } from '@/types'
```

### Component Structure
```typescript
interface Props { /* ... */ }

const MyComponent = memo(function MyComponent(props: Props) {
  // Hooks
  // Handlers
  // Render
  return JSX
})

export default MyComponent
```

### Naming
- Components: `PascalCase` (Button, TaskList)
- Hooks: `useNameHere` (useAuth, useTasks)
- Stores: `nameStore` (taskStore, authStore)
- Services: `nameService` (taskService, authService)
- Utils: `lowerCamelCase` (formatDate, cn)
- Constants: `UPPER_SNAKE_CASE` (MAX_TASKS)

---

## Testing Levels

| Level | Tool | Coverage | Examples |
|-------|------|----------|----------|
| Unit | Vitest | >80% | Components, hooks, utils |
| Integration | React Testing Library | Flows críticos | Component interactions |
| E2E | Playwright | Happy paths | Auth → Tasks → Review |
| Performance | Lighthouse | Core Web Vitals | Bundle, LCP, FID, CLS |
| Accessibility | axe-core | 0 violations | WCAG 2.1 AA |

---

## Performance Targets

| Métrica | Target | Tool |
|---------|--------|------|
| Bundle (gzipped) | < 200KB | webpack-bundle-analyzer |
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Web Vitals |
| CLS | < 0.1 | Web Vitals |
| Coverage | > 80% | Vitest |
| Lighthouse | ≥ 90 | Lighthouse CI |

---

## Accesibilidad Checklist

- [ ] Semantic HTML5
- [ ] ARIA labels/describedby
- [ ] Focus indicators visible
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Escape, Arrows)
- [ ] Screen reader tested
- [ ] axe-core 0 violations
- [ ] WCAG 2.1 AA compliant
- [ ] Color contrast > 4.5:1
- [ ] Touch targets ≥ 44x44px

---

## Dependencias Clave

```json
{
  "zustand": "^4.4.0",
  "@supabase/supabase-js": "^2.38.0",
  "@tanstack/react-query": "^5.0.0",
  "clsx": "^2.0.0",
  "date-fns": "^2.30.0",
  "axios": "^1.6.0"
}
```

---

## Implementación - 8 Fases

| Fase | Duración | Focus | Componentes |
|------|----------|-------|-------------|
| 1 | Week 1 | Setup + Atoms | Estructura, Button, Input, etc. |
| 2 | Week 1-2 | Auth | Login, signup, authStore |
| 3 | Week 2-3 | Tasks | TaskList, TaskFilters, Preview |
| 4 | Week 3-4 | Chat | ChatInterface, MCPs |
| 5 | Week 3-4 | Review | ReviewPanel, aprobaciones |
| 6 | Week 4 | History | TaskHistory, timeline |
| 7 | Week 4-5 | Testing | Unit, Integration, E2E, Performance |
| 8 | Week 5 | Deploy | CI/CD, optimización, production |

---

## Decisions Made

### Why Zustand?
- Simple, minimal boilerplate
- Small bundle (2KB)
- Excellent DevTools
- No Provider wrapping needed
- Great for this scope

### Why Atomic Design?
- Clear component hierarchy
- Easy to reuse
- Scalable as grows
- Team collaboration friendly
- Testing easier

### Why Tailwind?
- Utility-first, no CSS bloat
- Built-in responsive (mobile-first)
- Performance optimized
- Dark mode ready
- Extensible

### Why TypeScript?
- Type safety from day 1
- Better IDE support
- Self-documenting code
- Catch errors early

---

## Common Tasks

### Add New Component
1. Create file in appropriate folder (atoms/molecules/organisms)
2. Create interface for Props
3. Implement component with TypeScript
4. Add unit tests (>80% coverage)
5. Export from components/index.ts
6. Add to COMPONENT_EXAMPLES.md

### Add New Store
1. Create file in stores/
2. Define interface with state + actions
3. Create with create<State>()(devtools(...))
4. Add unit tests
5. Export from stores/index.ts
6. Create custom hook in hooks/useStoreName.ts

### Add New API Endpoint
1. Create route in src/app/api/
2. Create service method in services/
3. Call service from component/hook
4. Add error handling
5. Add tests (mock with MSW)

### Add New Page
1. Create folder/file in src/app/(group)/
2. Use template layout
3. Import necessary components
4. Add route to config/routes.ts
5. Update navigation
6. Add E2E test

---

## Recursos Útiles

- Next.js: https://nextjs.org/docs
- Zustand: https://github.com/pmndrs/zustand
- Atomic Design: https://atomicdesign.bradfrost.com
- Testing Library: https://testing-library.com
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Web Vitals: https://web.dev/vitals/

---

## Contact & Support

Cualquier duda sobre la arquitectura:
- Revisar FRONTEND_ARCHITECTURE.md (sección específica)
- Ver ARCHITECTURE_DIAGRAMS.md (diagrama visual)
- Revisar COMPONENT_EXAMPLES.md (código)
- Seguir IMPLEMENTATION_CHECKLIST.md (pasos)

