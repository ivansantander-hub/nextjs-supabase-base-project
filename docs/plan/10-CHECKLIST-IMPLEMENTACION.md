# ✅ Checklist de Implementación - COMPLETO

**Stack Final**: Next.js 16 + React 19 + Turbopack + Tailwind + shadcn/ui + Zustand + next-themes + next-intl + Supabase
**Timeline**: 8-9 semanas (sin presión)
**Quality Target**: ACID, WCAG 2.1 AA, >80% test coverage, <200KB bundle

---

## 🎯 FASE 0: Setup Inicial & Decisiones (Días 1-2)

### Decisiones Confirmadas
- [x] Framework: Next.js 16 + React 19
- [x] Compiler: Turbopack (always-on)
- [x] Styling: Tailwind CSS 4
- [x] Components: shadcn/ui (19 primitivas) + Atomic Design
- [x] State: Zustand (5 stores)
- [x] Themes: next-themes (dark/light)
- [x] i18n: next-intl (ES, EN)
- [x] Backend: Supabase (Auth + PostgreSQL)
- [x] AI: Multi-provider (Claude, OpenAI, Gemini)
- [x] Auth: JWT (15min/7days)

### Repo & Infrastructure
- [ ] Crear Next.js 16 project: `npx create-next-app@16 --turbopack`
- [ ] Setup git repo + .gitignore
- [ ] Setup node version (v18+)
- [ ] Create `.env.local` file
- [ ] Setup Vercel deployment (opcional)
- [ ] Setup Supabase project (Auth + PostgreSQL)

### Instalar Dependencias Principais
```bash
# Core
pnpm add next@16 react@19 tailwindcss typescript

# Styling & Components
pnpm add clsx class-variance-authority

# State Management
pnpm add zustand

# Temas & i18n
pnpm add next-themes next-intl

# Backend/Auth
pnpm add @supabase/supabase-js

# Testing & Dev
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
pnpm add -D playwright @axe-core/react eslint prettier

# Optional (pero recomendado)
pnpm add zod axios date-fns
```

### Setup Inicial de Turbopack
- [ ] Verificar `next.config.js` tiene `experimental: { turbopack: {} }`
- [ ] Verificar `package.json` tiene `"dev": "next dev --turbopack"`
- [ ] Test: `npm run dev` - debe arrancar en <3s

### Quality Tools Setup
- [ ] ESLint configuration
- [ ] Prettier setup
- [ ] TypeScript `tsconfig.json` (strict mode)
- [ ] Pre-commit hooks (husky)

---

## 🎨 FASE 1: Setup Base + shadcn/ui + Themes + i18n (Semana 1)

### shadcn/ui Setup
- [ ] `npx shadcn-ui@latest init`
- [ ] Copiar 19 componentes shadcn:
  - [ ] `npx shadcn-ui add button`
  - [ ] `npx shadcn-ui add input`
  - [ ] `npx shadcn-ui add card`
  - [ ] `npx shadcn-ui add dialog`
  - [ ] `npx shadcn-ui add select`
  - [ ] `npx shadcn-ui add dropdown-menu`
  - [ ] `npx shadcn-ui add tabs`
  - [ ] `npx shadcn-ui add badge`
  - [ ] `npx shadcn-ui add toast`
  - [ ] `npx shadcn-ui add tooltip`
  - [ ] `npx shadcn-ui add popover`
  - [ ] `npx shadcn-ui add textarea`
  - [ ] `npx shadcn-ui add checkbox`
  - [ ] `npx shadcn-ui add radio-group`
  - [ ] `npx shadcn-ui add switch`
  - [ ] `npx shadcn-ui add progress`
  - [ ] `npx shadcn-ui add skeleton`
  - [ ] `npx shadcn-ui add scroll-area`
  - [ ] `npx shadcn-ui add alert-dialog`

### Atomic Design - Estructura de Carpetas
- [ ] `src/components/ui/` (shadcn - copy/paste)
- [ ] `src/components/atoms/` (custom + wrapped shadcn)
- [ ] `src/components/molecules/` (combinaciones)
- [ ] `src/components/organisms/` (lógica compleja)
- [ ] `src/components/templates/` (layouts)
- [ ] `src/stores/` (Zustand stores)
- [ ] `src/hooks/` (custom hooks)
- [ ] `src/services/` (API layer)
- [ ] `src/types/` (TypeScript definitions)
- [ ] `src/lib/` (utilities)
- [ ] `src/config/` (configuration)
- [ ] `src/i18n/` (traducciones)
- [ ] `src/app/[locale]/` (next-intl structure)

### Dark Mode Setup (next-themes)
- [ ] Instalar: `pnpm add next-themes`
- [ ] Crear `src/lib/theme.ts` con config
- [ ] Setup `src/app/layout.tsx` con `ThemeProvider`
- [ ] Crear `src/globals.css` con CSS variables (light + dark)
- [ ] Crear component `ThemeToggle.tsx` en Header
- [ ] Tailwind config: agregar `darkMode: 'class'`
- [ ] Test: verificar que dark mode cambia CSS variables

### Multilanguage Setup (next-intl)
- [ ] Instalar: `pnpm add next-intl`
- [ ] Crear `src/i18n/` folder
- [ ] Crear `src/i18n/es.json` (traducciones ES)
- [ ] Crear `src/i18n/en.json` (traducciones EN)
- [ ] Crear `src/i18n/config.ts` con config de idiomas
- [ ] Setup `src/middleware.ts` para next-intl
- [ ] Estructura URLs con `[locale]`: `/es/tasks`, `/en/tasks`
- [ ] Crear component `LanguageSelector.tsx`
- [ ] Test: verificar URLs con locale

### Responsive Design Setup
- [ ] Tailwind config: breakpoints (sm: 640px, md: 1024px, lg: 1280px)
- [ ] Crear utilities: `useMediaQuery.ts` hook
- [ ] Verificar todos los componentes tienen `sm:`, `md:`, `lg:` classes
- [ ] Mobile-first CSS approach

### Custom Atoms (5)
- [ ] `Button.tsx` (wraps shadcn/button)
- [ ] `Input.tsx` (wraps shadcn/input)
- [ ] `Spinner.tsx` (custom)
- [ ] `Icon.tsx` (custom, lucide-react)
- [ ] `Text.tsx` (custom typography)

### Wrap shadcn Componentes en Atoms (14)
- [ ] `Card.tsx` → wraps shadcn/card
- [ ] `Dialog.tsx` → wraps shadcn/dialog
- [ ] `Select.tsx` → wraps shadcn/select
- [ ] `Dropdown.tsx` → wraps shadcn/dropdown-menu
- [ ] `Tabs.tsx` → wraps shadcn/tabs
- [ ] `Badge.tsx` → wraps shadcn/badge
- [ ] `Toast.tsx` → wraps shadcn/toast
- [ ] `Tooltip.tsx` → wraps shadcn/tooltip
- [ ] `Popover.tsx` → wraps shadcn/popover
- [ ] `Textarea.tsx` → wraps shadcn/textarea
- [ ] `Checkbox.tsx` → wraps shadcn/checkbox
- [ ] `Radio.tsx` → wraps shadcn/radio-group
- [ ] `Switch.tsx` → wraps shadcn/switch
- [ ] `Avatar.tsx` (custom, si es necesario)

### Root Layout & Providers
- [ ] `src/app/layout.tsx` con providers:
  - [ ] `ThemeProvider` (next-themes)
  - [ ] i18n middleware
  - [ ] Global styles
- [ ] `src/app/[locale]/layout.tsx` para locale
- [ ] `src/globals.css` con CSS variables (light/dark)
- [ ] `src/globals.css` con Tailwind directives

### Zustand Stores Setup
- [ ] `src/stores/authStore.ts`
- [ ] `src/stores/taskStore.ts`
- [ ] `src/stores/filterStore.ts`
- [ ] `src/stores/chatStore.ts`
- [ ] `src/stores/reviewStore.ts`

### Custom Hooks (Phase 1)
- [ ] `src/hooks/useAuth.ts`
- [ ] `src/hooks/useTheme.ts`
- [ ] `src/hooks/useI18n.ts`
- [ ] `src/hooks/useMediaQuery.ts`
- [ ] `src/hooks/useDebounce.ts`

### Testing Setup (Phase 1)
- [ ] Vitest configuration (`vitest.config.ts`)
- [ ] Jest setup file para React Testing Library
- [ ] Unit tests para atoms (5 tests)
- [ ] Unit tests para wrapped atoms (5 tests)
- [ ] Dark mode tests (verify theme toggle)
- [ ] Responsive tests (verify breakpoints)
- [ ] i18n tests (verify translations load)

### Quality Gates - Antes de Phase 2
- [ ] Todos los tests pasan
- [ ] ESLint sin errores
- [ ] TypeScript strict mode sin errores
- [ ] Dark mode toggle funciona ✅
- [ ] Language selector funciona ✅
- [ ] Responsive en mobile (375px), tablet (768px), desktop (1440px) ✅
- [ ] Turbopack dev server <3s startup ✅

---

## 🔐 FASE 2: Autenticación (Semana 1-2)

### Backend - Auth Endpoints (Next.js API Routes)
- [ ] `POST /api/auth/login` - Login con Supabase
- [ ] `POST /api/auth/signup` - Signup
- [ ] `POST /api/auth/logout` - Logout
- [ ] `POST /api/auth/refresh` - Refresh token
- [ ] `GET /api/auth/me` - Current user (incluye theme + language)
- [ ] `PATCH /api/user/preferences` - Actualizar preferences

### Database - Users Table
```sql
ALTER TABLE users ADD COLUMN theme_preference VARCHAR(10) DEFAULT 'auto';
ALTER TABLE users ADD COLUMN language_preference VARCHAR(5) DEFAULT 'es';
```

### Frontend - Auth Components
- [ ] `AuthTemplate.tsx` (layout)
- [ ] `LoginForm.tsx` (con traducciones)
- [ ] `SignupForm.tsx` (con traducciones)
- [ ] `ForgotPasswordForm.tsx` (opcional)
- [ ] `/[locale]/auth/login` page
- [ ] `/[locale]/auth/signup` page

### Frontend - Auth Services
- [ ] `authService.ts` - Supabase client setup
- [ ] JWT token management
- [ ] Session persistence
- [ ] Logout cleanup

### Frontend - Auth Middleware
- [ ] Protected routes (redirect to login)
- [ ] Route guards para rol-based access
- [ ] Token refresh automation

### Frontend - Auth Hooks
- [ ] `useAuth()` - Current user + methods
- [ ] `useAuthGuard()` - Protect routes
- [ ] `useLogin()` - Login logic
- [ ] `useSignup()` - Signup logic

### Testing - Phase 2
- [ ] Unit: loginService, signupService
- [ ] Unit: authStore
- [ ] Integration: LoginForm + authService
- [ ] Integration: Protected routes
- [ ] E2E: Login → Dashboard flow
- [ ] E2E: Dark mode persists after login ✅
- [ ] E2E: Language preference persists ✅

### Quality Gates - Antes de Phase 3
- [ ] Login/signup E2E tests pasan ✅
- [ ] JWT tokens funcionan correctamente ✅
- [ ] Protected routes funcionan ✅
- [ ] User preferences (theme, language) cargan correctamente ✅

---

## 📋 FASE 3: Task Management & Backend (Semana 2-3)

### Database - Task Tables (10 total)
```
- users (existente + new fields)
- tasks
- task_snapshots
- chat_messages
- audit_logs
- roles
- integrations
- ai_providers (NEW)
- ai_usage_logs (NEW)
- translations (NEW)
```

### Backend - Task Endpoints (17 endpoints)
- [ ] `GET /api/[locale]/tasks` - List (con filters)
- [ ] `POST /api/[locale]/tasks` - Create
- [ ] `GET /api/[locale]/tasks/[id]` - Get
- [ ] `PATCH /api/[locale]/tasks/[id]` - Update
- [ ] `DELETE /api/[locale]/tasks/[id]` - Delete
- [ ] `POST /api/[locale]/tasks/[id]/enrich` - Enrich con Claude
- [ ] `GET /api/[locale]/tasks/[id]/snapshots` - Get snapshots
- [ ] `POST /api/[locale]/tasks/[id]/restore` - Restore snapshot
- [ ] `POST /api/[locale]/notion/sync` - Sync from Notion
- [ ] `POST /api/[locale]/notion/push` - Push to Notion

### Backend - Service Layer (Multi-AI)
- [ ] `AIProvider` interface (abstracta)
- [ ] `ClaudeProvider` implementation
- [ ] `OpenAIProvider` implementation
- [ ] `GeminiProvider` implementation
- [ ] `AIFactory` pattern
- [ ] `AIOrchestrator` (con fallback/retry)
- [ ] Config-driven provider selection

### Backend - Auditoría & Logging
- [ ] `audit_logs` table con todas las acciones
- [ ] `audit_service.ts` para logging
- [ ] User identification en logs
- [ ] Timestamp + action details

### Frontend - Task Components (Molecules)
- [ ] `SearchInput.tsx` (con debounce)
- [ ] `FilterBar.tsx` (status, priority, etc.)
- [ ] `StatusBadge.tsx`
- [ ] `PriorityBadge.tsx`
- [ ] `TaskCard.tsx`
- [ ] `DatePicker.tsx`
- [ ] `UserChip.tsx`

### Frontend - Task Components (Organisms)
- [ ] `TaskFilters.tsx` (contains FilterBar)
- [ ] `TaskList.tsx` (contains TaskCards)
- [ ] `TaskPreview.tsx` (detail view)
- [ ] `TaskEditor.tsx` (edit form)
- [ ] `TaskHistory.tsx` (version history)

### Frontend - Task Pages
- [ ] `/[locale]/dashboard/tasks` page (con Filters + List)
- [ ] `/[locale]/dashboard/task/[id]` page (detail)

### Frontend - Task Stores & Services
- [ ] `taskStore.ts` (Zustand - current tasks, loading, error)
- [ ] `filterStore.ts` (Zustand - applied filters)
- [ ] `taskService.ts` (API calls to backend)
- [ ] `notionService.ts` (Notion integration)

### Frontend - Task Hooks
- [ ] `useTasks()` - Fetch + manage tasks
- [ ] `useTaskFilters()` - Manage filters
- [ ] `usePagination()` - Pagination logic
- [ ] `useTask(id)` - Single task

### Testing - Phase 3
- [ ] Unit: taskService, filterStore
- [ ] Unit: AI service layer (all providers)
- [ ] Integration: TaskFilters + TaskList
- [ ] Integration: Task creation + update
- [ ] E2E: Create → Edit → Save task
- [ ] E2E: Filtering works across dark/light modes ✅
- [ ] E2E: All text is translated (ES/EN) ✅
- [ ] E2E: Responsive on mobile/tablet/desktop ✅

### Quality Gates - Antes de Phase 4
- [ ] Task CRUD E2E tests pasan ✅
- [ ] Filters funcionan correctamente ✅
- [ ] Notion sync works ✅
- [ ] AI service layer funciona con all providers ✅
- [ ] Auditoría logs all actions ✅

---

## 💬 FASE 4: Chat & MCPs (Semana 3-4)

### Frontend - Chat Components
- [ ] `ChatMessage.tsx` (molecule)
- [ ] `ChatInterface.tsx` (organism)

### Frontend - Chat Pages
- [ ] `/[locale]/dashboard/chat` page

### Frontend - Chat Services
- [ ] `chatService.ts` (con MCPs)
- [ ] MCP integration (GitLab + Notion)
- [ ] Streaming responses from Claude

### Frontend - Chat Stores & Hooks
- [ ] `chatStore.ts` (Zustand)
- [ ] `useChat()` hook

### Backend - Chat Endpoints (2 endpoints)
- [ ] `POST /api/[locale]/chat` - Send message
- [ ] `GET /api/[locale]/chat/[taskId]` - Get history

### Testing - Phase 4
- [ ] Integration: ChatInterface + chatService
- [ ] E2E: Send message → Get response
- [ ] Dark mode tests (chat bubbles) ✅
- [ ] Responsive chat on mobile ✅

---

## ✅ FASE 5: Review & Aprobaciones (Semana 3-4)

### Frontend - Review Components
- [ ] `ReviewPanel.tsx` (organism)
- [ ] Side-by-side diff viewer

### Frontend - Review Pages
- [ ] `/[locale]/dashboard/review` page

### Frontend - Review Stores & Services
- [ ] `reviewStore.ts` (Zustand)
- [ ] `reviewService.ts`

### Backend - Review Endpoints (3 endpoints)
- [ ] `GET /api/[locale]/review/pending` - Get pending
- [ ] `POST /api/[locale]/review/[id]/approve` - Approve
- [ ] `POST /api/[locale]/review/[id]/reject` - Reject

### Testing - Phase 5
- [ ] Integration: ReviewPanel
- [ ] E2E: Approve/reject flow
- [ ] Dark mode diffs readable ✅

---

## 📜 FASE 6: Historial (Semana 4)

### Frontend - History Components
- [ ] `HistoryItem.tsx` (molecule)
- [ ] `Timeline.tsx` (molecule)
- [ ] `TaskHistory.tsx` (organism)

### Frontend - History Pages
- [ ] `/[locale]/dashboard/history` page

### Backend - History Endpoints
- [ ] `GET /api/[locale]/tasks/[id]/history` - Get history
- [ ] Snapshots storage y retrieval

### Testing - Phase 6
- [ ] E2E: View history + restore
- [ ] Responsive timeline ✅

---

## 🧪 FASE 7: Testing & Optimización (Semana 4-5)

### Unit Tests (>80% coverage)
- [ ] All atoms (19 tests)
- [ ] All molecules (11 tests)
- [ ] Custom hooks (10+ tests)
- [ ] Services (task, chat, auth, etc.)
- [ ] Stores (all 5 Zustand stores)
- [ ] Utils + helpers

### Integration Tests
- [ ] Component interactions
- [ ] Store + Component integration
- [ ] API mocking (MSW)
- [ ] Dark mode switch in context ✅
- [ ] i18n string loading ✅
- [ ] Responsive layout breakpoints ✅

### E2E Tests (Playwright)
- [ ] Full auth flow (signup → login → dashboard)
- [ ] Full task flow (create → edit → enrich → review → approve → Notion)
- [ ] Chat with MCPs
- [ ] Dark mode toggle persists ✅
- [ ] Language change updates all UI ✅
- [ ] Responsive on 3 viewports (375/768/1440px) ✅

### Dark Mode Testing
- [ ] Color contrast WCAG AA in dark mode ✅
- [ ] All components render correctly in dark ✅
- [ ] Toggle persists after page reload ✅

### i18n Testing
- [ ] All strings are translated (ES + EN) ✅
- [ ] Language change updates immediately ✅
- [ ] URLs reflect language (/es/..., /en/...) ✅

### Responsive Testing
- [ ] Mobile (375px) - single column layout ✅
- [ ] Tablet (768px) - 2 column layout ✅
- [ ] Desktop (1440px) - 3 column layout ✅
- [ ] Touch targets 44x44px+ ✅
- [ ] No horizontal scroll ✅

### Performance
- [ ] Bundle analysis < 200KB gzipped ✅
- [ ] Lighthouse CI ≥90 Performance ✅
- [ ] Lighthouse CI ≥90 Accessibility ✅
- [ ] Core Web Vitals:
  - [ ] LCP < 2.5s ✅
  - [ ] FID < 100ms ✅
  - [ ] CLS < 0.1 ✅
- [ ] Code splitting verification
- [ ] Image optimization

### Accessibility (WCAG 2.1 AA)
- [ ] axe-core automated tests (0 violations) ✅
- [ ] Keyboard navigation (Tab, Enter, Escape) ✅
- [ ] Screen reader testing (NVDA/JAWS) ✅
- [ ] Focus management ✅
- [ ] Color contrast 4.5:1 (light + dark) ✅
- [ ] ARIA labels properly used ✅

### Documentation
- [ ] Component API docs
- [ ] Setup guide
- [ ] Architecture guide
- [ ] Troubleshooting guide

---

## 🚀 FASE 8: Polish & Deployment (Semana 5)

### Bug Fixes & Refinement
- [ ] User feedback fixes
- [ ] Edge case handling
- [ ] Error messages improvement
- [ ] Loading states + skeletons
- [ ] Empty states

### CI/CD Pipeline
- [ ] GitHub Actions workflow
- [ ] Pre-commit hooks (ESLint + Prettier + TypeScript)
- [ ] Automated tests on every PR
- [ ] Lighthouse CI
- [ ] Code coverage reporting

### Environment & Deployment
- [ ] `.env.local` setup (NEXT_PUBLIC_SUPABASE_URL, etc.)
- [ ] Secrets management (API keys, tokens)
- [ ] Build optimization (`next build`)
- [ ] Error tracking (Sentry, opcional)
- [ ] Analytics setup (opcional)

### Staging Deployment
- [ ] Deploy to staging Vercel
- [ ] Smoke tests on staging
- [ ] Performance check on staging
- [ ] Cross-browser testing

### Production Deployment
- [ ] Database migrations applied
- [ ] Secrets configured on Vercel
- [ ] Domain DNS setup
- [ ] SSL certificate verification
- [ ] Deploy to production Vercel
- [ ] Monitoring setup
- [ ] Rollback plan ready

---

## 🏆 Quality Gates Finales

### Antes de cada Phase
- [ ] Todos los tests pasan (unit + integration)
- [ ] ESLint sin errores
- [ ] TypeScript strict mode sin errores
- [ ] Prettier formatting OK
- [ ] PR review completada
- [ ] Documentación actualizada

### Antes de Production (CRÍTICO)
- [ ] ✅ E2E tests: 100% pasan
- [ ] ✅ Lighthouse Performance ≥90
- [ ] ✅ Lighthouse Accessibility ≥90
- [ ] ✅ axe-core: 0 violations
- [ ] ✅ Core Web Vitals dentro de límites
- [ ] ✅ Bundle size < 200KB
- [ ] ✅ Dark mode funciona perfectamente
- [ ] ✅ i18n (ES + EN) completamente funcional
- [ ] ✅ Responsive en mobile/tablet/desktop
- [ ] ✅ Turbopack dev <3s startup
- [ ] ✅ Security review completado
- [ ] ✅ Staging deployment exitoso
- [ ] ✅ Backup plan ready

---

## 📦 Dependencias Final List

```bash
# Core
next@16
react@19
typescript

# Styling & Components
tailwindcss@4
clsx
class-variance-authority

# State Management
zustand

# Themes & i18n
next-themes
next-intl

# Backend/Auth
@supabase/supabase-js

# API & Data
axios
zod

# Dates
date-fns

# Icons (opcional)
lucide-react

# Dev Dependencies
vitest
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
playwright
@axe-core/react
eslint
prettier
husky
lint-staged
typescript
```

---

## 📋 Convenciones de Código

### File Naming
- Components: `PascalCase.tsx` (ex: `Button.tsx`)
- Hooks: `useNameHere.ts` (ex: `useAuth.ts`)
- Stores: `nameStore.ts` (ex: `authStore.ts`)
- Services: `nameService.ts` (ex: `taskService.ts`)
- Utilities: `lowerCamelCase.ts` (ex: `formatDate.ts`)
- Types: `name.ts` (ex: `task.ts`)

### Import Order
1. React/Next imports
2. Third-party libraries
3. Absolute imports (@/...)
4. Type imports

### Component Structure
1. Props interface
2. Component function
3. JSX return
4. Exports

---

## ✨ Métricas de Éxito (Final)

### Code Quality
✅ Coverage > 80% (unit + integration)
✅ ESLint 0 errors/warnings
✅ TypeScript strict mode
✅ Bundle < 200KB gzipped

### Performance
✅ LCP < 2.5s
✅ FID < 100ms
✅ CLS < 0.1
✅ TTI < 3.5s

### Accessibility
✅ WCAG 2.1 AA compliance
✅ 0 violations axe-core
✅ Keyboard navigable
✅ Screen reader compatible

### Features
✅ Dark mode works perfectly
✅ i18n (ES + EN) fully functional
✅ Responsive (mobile/tablet/desktop)
✅ Turbopack <1s hot reload
✅ Multi-AI providers working

---

## 🎯 Timeline Visual

```
Week 1:   Phase 0 (Setup) + Phase 1 (Base + shadcn + themes + i18n)
Week 1-2: Phase 2 (Auth)
Week 2-3: Phase 3 (Task Management)
Week 3-4: Phase 4 (Chat) + Phase 5 (Review)
Week 4:   Phase 6 (History)
Week 4-5: Phase 7 (Testing & Optimization)
Week 5:   Phase 8 (Deployment)
Total:    8-9 semanas
```

---

## 📝 Notas Importantes

1. **Requisitos Integrados**: Dark mode ✅, i18n ✅, Responsive ✅, Turbopack ✅, Multi-AI ✅, shadcn/ui ✅
2. **Desktop-first**: Empezar lg/xl, adaptar down
3. **Accesibilidad**: Integrada desde inicio
4. **Testing**: Mientras se desarrolla, no después
5. **Performance**: Monitorizar bundle continuamente
6. **Zustand**: Simple es suficiente
7. **shadcn/ui**: Copy/paste = 50% más rápido
8. **Dark mode**: Testear en cada phase
9. **i18n**: Completamente integrado en URLs
10. **Responsive**: 3 breakpoints (mobile/tablet/desktop)

---

**¡LISTO PARA IMPLEMENTACIÓN! 🚀**

