# 📋 FASE 2.5: Interim - Pendientes Obligatorios

**Fecha Inicio**: 2026-03-18
**Estado**: 🟡 **EN PROGRESO**
**Objetivo**: Completar lo pendiente obligatorio antes de FASE 3 (Task Management)

---

## 📌 Resumen Ejecutivo

Implementación de componentes UI faltantes que son necesarios para FASE 3 (Task Management). Estos componentes NO fueron incluidos en FASE 1 pero son obligatorios para que funcione correctamente FASE 3.

**Total items**: 8
**Implementación**: 0/8

---

## ✅ OBLIGATORIOS PARA FASE 3

### UI Components Wrapper Atoms (5)
- [ ] **Card.tsx** - Card container wrapper
  - Extiende estilos base
  - Soporta dark mode
  - Responsive padding
  - Estado: NECESARIO para TaskCard

- [ ] **Dialog.tsx** - Modal dialog wrapper
  - Confirmaciones, modales
  - Estados: open, close, loading
  - Estado: NECESARIO para task modals

- [ ] **Select.tsx** - Dropdown select wrapper
  - Filter by status, priority
  - Soporte multiple select
  - Estado: NECESARIO para TaskFilters

- [ ] **Tabs.tsx** - Tab navigation wrapper
  - Task details tabs (Info, History, Activity)
  - Estado: NECESARIO para TaskPreview

- [ ] **Badge.tsx** - Badge/label wrapper
  - Status badges, priority badges
  - Color variants
  - Estado: NECESARIO para TaskCard status

### Additional Features (3)
- [ ] **ForgotPasswordForm.tsx** - Forgot password
  - En molecules/
  - Email recovery flow
  - Estado: RECOMENDADO

- [ ] **Role-Based Access Control** - Middleware
  - Admin, tpo, viewer, integration roles
  - Protected routes por rol
  - Estado: RECOMENDADO para FASE 3+

- [ ] **Limpiar src/components/ui/**
  - Eliminar componentes no usados que causaron dependencias
  - Mantener solo los que se usan
  - Estado: NECESARIO para evitar build errors

---

## 🎯 Plan de Implementación

### Semana 1: UI Components Wrapper Atoms (5)
```
[x] Card wrapper
[x] Dialog wrapper
[x] Select wrapper
[x] Tabs wrapper
[x] Badge wrapper
[x] Tests para cada uno
```

### Semana 2: Features Adicionales (3)
```
[x] ForgotPasswordForm
[x] RBAC middleware
[x] Cleanup src/components/ui/
[x] Tests
```

---

## 📂 Archivos a Crear/Modificar

### Crear
```
src/components/atoms/Card.tsx
src/components/atoms/Dialog.tsx
src/components/atoms/Select.tsx
src/components/atoms/Tabs.tsx
src/components/atoms/Badge.tsx
src/components/molecules/ForgotPasswordForm.tsx
```

### Modificar
```
src/components/ui/index.ts     (limpiar imports no usados)
src/middleware.ts              (agregar RBAC)
```

### Testar
```
src/components/atoms/__tests__/Card.test.tsx
src/components/atoms/__tests__/Dialog.test.tsx
src/components/atoms/__tests__/Select.test.tsx
src/components/atoms/__tests__/Tabs.test.tsx
src/components/atoms/__tests__/Badge.test.tsx
src/components/molecules/__tests__/ForgotPasswordForm.test.tsx
```

---

## 📊 Checklist Técnico

### UI Components
- [ ] Card
  - [ ] Extiende estilos Tailwind base
  - [ ] Dark mode support
  - [ ] Responsive (sm, md, lg)
  - [ ] Tests unitarios
  - [ ] TypeScript tipos

- [ ] Dialog
  - [ ] Modal con overlay
  - [ ] Cerrar con ESC
  - [ ] Focus trapping
  - [ ] Tests unitarios
  - [ ] TypeScript tipos

- [ ] Select
  - [ ] Dropdown states (open, closed, disabled)
  - [ ] Keyboard navigation
  - [ ] Multiple select option
  - [ ] Tests unitarios
  - [ ] TypeScript tipos

- [ ] Tabs
  - [ ] Keyboard navigation
  - [ ] Active state
  - [ ] Aria labels
  - [ ] Tests unitarios
  - [ ] TypeScript tipos

- [ ] Badge
  - [ ] Color variants (default, primary, success, error, warning)
  - [ ] Size variants (sm, md, lg)
  - [ ] Dark mode
  - [ ] Tests unitarios
  - [ ] TypeScript tipos

### Features Adicionales
- [ ] ForgotPasswordForm
  - [ ] Email input + validation
  - [ ] Submit to Supabase reset link
  - [ ] Success/error messages
  - [ ] i18n support (ES/EN)
  - [ ] Dark mode
  - [ ] Tests

- [ ] RBAC Middleware
  - [ ] Check user role
  - [ ] Restrict routes by role
  - [ ] Handle unauthorized (403)
  - [ ] Tests

- [ ] Cleanup UI Components
  - [ ] Remover componentes con dependencias faltantes
  - [ ] Limpiar imports
  - [ ] Verificar no hay referencias rotas

---

## 🧪 Testing Strategy

- Unit tests para cada componente (5 tests cada uno)
- Integration tests con components que los usan
- Dark mode testing (light/dark)
- Responsive testing (3 viewports)
- Accessibility testing (WCAG 2.1 AA)

---

## 📈 Métricas de Éxito

| Item | Target | Status |
|------|--------|--------|
| Card wrapper | ✅ | ⏳ |
| Dialog wrapper | ✅ | ⏳ |
| Select wrapper | ✅ | ⏳ |
| Tabs wrapper | ✅ | ⏳ |
| Badge wrapper | ✅ | ⏳ |
| ForgotPasswordForm | ✅ | ⏳ |
| RBAC middleware | ✅ | ⏳ |
| UI cleanup | ✅ | ⏳ |
| Tests passing | 100% | 0% |
| TypeScript errors | 0 | ? |

---

## 🔗 Dependencias

- **Bloqueador de FASE 3**: Sí (Sin estos componentes no funciona Task Management)
- **FASE 1**: ✅ Completada (depende de esto)
- **FASE 2**: ✅ Completada (depende de esto)

---

## 📝 Notas

- No usar shadcn/ui - componentes custom solamente
- Mantener consistencia con 5 atoms existentes (Button, Input, Text, Icon, Spinner)
- Todos deben soportar dark mode
- Todos deben ser responsive
- Todos deben tener TypeScript tipos

---

**FASE 2.5 es PRE-REQUISITO para FASE 3**
