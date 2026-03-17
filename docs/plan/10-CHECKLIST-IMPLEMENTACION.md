# Checklist de Implementación - Frontend

## Fase 1: Setup Base (Semana 1)

### Estructura & Configuración
- [ ] Crear carpetas Atomic Design (`src/components/*`)
- [ ] Crear carpetas de stores, hooks, services, types
- [ ] Instalar dependencias (Zustand, Supabase, Tailwind actualizado)
- [ ] Configurar path aliases (`@/*`)
- [ ] Setup ESLint + Prettier
- [ ] Configurar Testing (Vitest + React Testing Library)

### Componentes Atoms Básicos
- [ ] Button.tsx
- [ ] Input.tsx
- [ ] Badge.tsx
- [ ] Card.tsx
- [ ] Text.tsx
- [ ] Spinner.tsx
- [ ] Icon.tsx (o usar lucide-react)
- [ ] Avatar.tsx
- [ ] Divider.tsx
- [ ] Checkbox.tsx
- [ ] Select.tsx
- [ ] TextArea.tsx

### Configuración Inicial
- [ ] Root layout.tsx con Providers
- [ ] Tailwind configuración
- [ ] Global styles
- [ ] Theme configuration
- [ ] Constants (routes, colors, etc.)

---

## Fase 2: Autenticación (Semana 1-2)

### Stores & Services
- [ ] authStore.ts (Zustand)
- [ ] authService.ts (Supabase)
- [ ] Setup Supabase client
- [ ] Middleware de autenticación

### Componentes
- [ ] AuthTemplate.tsx
- [ ] AuthForm.tsx (login/signup compartido)
- [ ] Login page
- [ ] Signup page
- [ ] Forgot password flow

### Hooks
- [ ] useAuth.ts (usar authStore)
- [ ] useAuthGuard.ts (proteger rutas)

### Tests
- [ ] Unit tests: authService
- [ ] Integration tests: AuthForm
- [ ] E2E: login/signup flow

### API Routes
- [ ] POST /api/auth/login
- [ ] POST /api/auth/signup
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/refresh

---

## Fase 3: Task Management (Semana 2-3)

### Stores & Services
- [ ] taskStore.ts (Zustand)
- [ ] filterStore.ts (Zustand)
- [ ] taskService.ts
- [ ] notionService.ts

### Componentes - Molecules
- [ ] SearchInput.tsx
- [ ] FilterBar.tsx
- [ ] StatusBadge.tsx
- [ ] PriorityBadge.tsx
- [ ] UserChip.tsx
- [ ] TaskCard.tsx
- [ ] DatePicker.tsx
- [ ] TabNav.tsx
- [ ] Breadcrumb.tsx
- [ ] Pagination.tsx

### Componentes - Organisms
- [ ] TaskFilters.tsx
- [ ] TaskList.tsx
- [ ] TaskPreview.tsx
- [ ] TaskHistory.tsx
- [ ] TaskEditor.tsx

### Componentes - Templates & Pages
- [ ] DashboardTemplate.tsx
- [ ] Header.tsx
- [ ] Sidebar.tsx
- [ ] (dashboard)/tasks/page.tsx
- [ ] (dashboard)/task/[id]/page.tsx

### Hooks
- [ ] useTasks.ts
- [ ] useFilters.ts
- [ ] useDebounce.ts
- [ ] usePagination.ts

### API Routes
- [ ] GET /api/tasks
- [ ] POST /api/tasks
- [ ] GET /api/tasks/[id]
- [ ] PATCH /api/tasks/[id]
- [ ] DELETE /api/tasks/[id]
- [ ] POST /api/notion/sync

### Tests
- [ ] Unit: taskService, filterStore
- [ ] Integration: TaskFilters, TaskList
- [ ] E2E: Task filtering and selection

---

## Fase 4: Chat & MCPs (Semana 3-4)

### Stores & Services
- [ ] chatStore.ts (Zustand)
- [ ] chatService.ts (con MCPs)
- [ ] mcp.ts (configuración MCPs)

### Componentes - Molecules
- [ ] ChatMessage.tsx
- [ ] MCPSelector.tsx

### Componentes - Organisms
- [ ] ChatInterface.tsx

### Páginas
- [ ] (dashboard)/chat/page.tsx

### Hooks
- [ ] useChat.ts
- [ ] useMCP.ts (si es necesario)

### API Routes
- [ ] POST /api/chat
- [ ] GET /api/chat/[taskId]

### Tests
- [ ] Unit: chatService
- [ ] Integration: ChatInterface con MCPs
- [ ] E2E: Chat flow

---

## Fase 5: Review & Aprobaciones (Semana 3-4)

### Stores & Services
- [ ] reviewStore.ts (Zustand)
- [ ] reviewService.ts

### Componentes - Organisms
- [ ] ReviewPanel.tsx

### Páginas
- [ ] (dashboard)/review/page.tsx

### API Routes
- [ ] GET /api/review/pending
- [ ] POST /api/review/[id]/approve
- [ ] POST /api/review/[id]/reject

### Tests
- [ ] Unit: reviewService
- [ ] Integration: ReviewPanel
- [ ] E2E: Review workflow

---

## Fase 6: Historial (Semana 4)

### Componentes - Molecules
- [ ] HistoryItem.tsx
- [ ] Timeline.tsx

### Componentes - Organisms
- [ ] TaskHistory.tsx (ya incluido en Phase 3)

### Páginas
- [ ] (dashboard)/history/page.tsx

---

## Fase 7: Testing & Optimización (Semana 4-5)

### Unit Tests (>80% coverage)
- [ ] All atoms
- [ ] All molecules
- [ ] Custom hooks
- [ ] Services
- [ ] Stores
- [ ] Utils

### Integration Tests
- [ ] Component interactions
- [ ] Store + Component integration
- [ ] API mocking

### E2E Tests (Playwright)
- [ ] Auth: Login → Dashboard
- [ ] Tasks: Filter → Select → Preview → Edit
- [ ] Chat: Send message with MCP
- [ ] Review: Approve/Reject flow
- [ ] Full user journey

### Performance
- [ ] Bundle analysis (< 200KB gzipped)
- [ ] Lighthouse CI setup
- [ ] Core Web Vitals tracking
- [ ] Component performance profiling
- [ ] Image optimization
- [ ] Code splitting verification

### Accessibility
- [ ] axe-core automated tests
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA/JAWS)
- [ ] WCAG 2.1 AA compliance audit
- [ ] Focus management review

### Documentation
- [ ] Component storybook (si aplica)
- [ ] API documentation
- [ ] Architecture guide
- [ ] Contributing guide

---

## Fase 8: Polish & Deployment (Semana 5)

### Bug Fixes & Refinement
- [ ] User feedback fixes
- [ ] Edge case handling
- [ ] Error messages improvement
- [ ] Loading states review

### CI/CD
- [ ] GitHub Actions workflow
- [ ] Pre-commit hooks
- [ ] Automated tests on PR
- [ ] Lighthouse CI

### Deployment
- [ ] Environment variables setup
- [ ] Build optimization
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics setup
- [ ] Deploy to staging
- [ ] Deploy to production

---

## Quality Gates

### Antes de cada Phase:
- [ ] Todos los tests pasan (unit + integration)
- [ ] ESLint sin errores
- [ ] TypeScript strict mode sin errores
- [ ] PR review completada
- [ ] Documentación actualizada

### Antes de Production:
- [ ] E2E tests todos pasan
- [ ] Lighthouse ≥ 90 en Performance/Accessibility
- [ ] 0 violations en axe-core
- [ ] Core Web Vitals dentro de límites
- [ ] Bundle size revisado
- [ ] Security review completado
- [ ] Staging deployment exitoso

---

## Dependencias por Instalar

```bash
# Package manager
pnpm install

# Additions needed:
pnpm add zustand @supabase/supabase-js @tanstack/react-query clsx date-fns axios

# Dev:
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright @axe-core/react
```

---

## Convenciones de Código - Quick Reference

### Import Order
1. React/Next imports
2. Third-party libraries
3. Absolute imports (@/...)
4. Type imports

### Component Structure
1. Interface/Props definition
2. Component function
3. JSX return
4. Display name
5. Export default

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `useNameHere.ts`
- Stores: `nameStore.ts`
- Services: `nameService.ts`
- Utils: `lowerCamelCase.ts`
- Types: `name.ts`

---

## Métricas de Éxito

### Code Quality
- ✅ Coverage > 80% (unit + integration)
- ✅ ESLint 0 errors/warnings
- ✅ TypeScript strict mode
- ✅ Bundle < 200KB (gzipped)

### Performance
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1
- ✅ TTI < 3.5s

### Accessibility
- ✅ WCAG 2.1 AA compliance
- ✅ 0 violations axe-core
- ✅ Keyboard navigable
- ✅ Screen reader compatible

### User Experience
- ✅ All critical flows E2E tested
- ✅ Error handling for all paths
- ✅ Loading states for all async ops
- ✅ Responsive and touch-friendly

---

## Notas Importantes

1. **Desktop-first approach**: Empezar con lg/xl breakpoints, adaptar down
2. **Accesibilidad**: Integrada desde el inicio, no al final
3. **Testing**: Escribir tests mientras se desarrolla, no después
4. **Performance**: Monitorizar bundle size continuamente
5. **State management**: Preferir simpler es mejor (Zustand es suficiente)
6. **API mocking**: Usar MSW para E2E tests en CI
7. **Components**: Reutilizar, no duplicar (Atomic Design)
8. **Error handling**: Mostrar errores claros al usuario
9. **Loading states**: Importante para UX
10. **Documentation**: Mantener actualizada mientras se desarrolla

