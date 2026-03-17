# Frontend Architecture - Updates para Requisitos Adicionales

**Fecha**: 2026-03-16 | **Status**: Integración de Dark Mode, i18n, Responsive mejorado, Turbopack

## 📋 Requisitos Adicionales Integrados

1. ✅ **Dark Mode + Light Mode** - Tema dinámico con persistencia
2. ✅ **Multilanguage (i18n)** - ES + EN con URLs localizadas
3. ✅ **Responsive Design** - Desktop, Tablet, Mobile
4. ✅ **Turbopack** - Compilador por defecto

---

## 1. Dark Mode + Light Mode

### Implementación con next-themes

```typescript
// src/lib/theme.ts
import { ThemeProvider } from 'next-themes'

export const ThemeConfig = {
  attribute: 'class',
  defaultTheme: 'light',
  enableSystem: true,
  enableTransitionOnChangeOnly: true,
  storageKey: 'theme-preference'
}

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider {...ThemeConfig}>
      {children}
    </ThemeProvider>
  )
}
```

### Layout Root

```typescript
// src/app/layout.tsx
import { ThemeProviderWrapper } from '@/lib/theme'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
```

### CSS Variables - Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Usar class selector
  theme: {
    extend: {
      colors: {
        // Light mode
        light: {
          bg: '#ffffff',
          surface: '#f8fafc',
          border: '#e2e8f0',
          text: '#0f172a',
          textMuted: '#64748b',
          primary: '#2563eb',
          primaryHover: '#1d4ed8',
        },
        // Dark mode (opcional, Tailwind maneja automático con dark:)
      },
    },
  },
  plugins: [],
}

export default config
```

### CSS Variables en globals.css

```css
/* src/app/globals.css */

@layer base {
  :root {
    --bg-primary: 255 255 255;
    --bg-secondary: 248 250 252;
    --text-primary: 15 23 42;
    --text-secondary: 100 116 139;
    --border: 226 232 240;
    --primary: 37 99 235;
    --primary-hover: 29 78 216;
  }

  [data-theme='dark'] {
    --bg-primary: 15 23 42;
    --bg-secondary: 30 41 59;
    --text-primary: 241 245 249;
    --text-secondary: 148 163 184;
    --border: 51 65 85;
    --primary: 59 130 246;
    --primary-hover: 37 99 235;
  }
}

@layer components {
  .bg-primary { @apply bg-white dark:bg-slate-900; }
  .bg-secondary { @apply bg-slate-50 dark:bg-slate-800; }
  .text-primary { @apply text-slate-900 dark:text-slate-50; }
  .text-secondary { @apply text-slate-600 dark:text-slate-400; }
  .border-primary { @apply border-slate-200 dark:border-slate-700; }
}
```

### Hook de Tema

```typescript
// src/hooks/useTheme.ts
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  const toggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    theme: currentTheme,
    isDark,
    toggle,
    mounted
  }
}
```

### Componente Theme Toggle

```typescript
// src/components/organisms/ThemeToggle.tsx
import { memo } from 'react'
import { useThemeToggle } from '@/hooks/useTheme'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'

const ThemeToggle = memo(() => {
  const { isDark, toggle, mounted } = useThemeToggle()

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </Button>
  )
})

export default ThemeToggle
```

### Ejemplo de Componente con Dark Mode

```typescript
// src/components/molecules/TaskCard.tsx
import { memo } from 'react'
import Card from '@/components/atoms/Card'

interface TaskCardProps {
  task: Task
  onSelect: (id: string) => void
}

const TaskCard = memo(({ task, onSelect }: TaskCardProps) => {
  return (
    <Card
      className={`
        p-4 cursor-pointer transition-all
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        hover:shadow-md dark:hover:shadow-dark-lg
        text-slate-900 dark:text-slate-50
      `}
      onClick={() => onSelect(task.id)}
    >
      <h3 className="font-semibold text-slate-900 dark:text-slate-50">
        {task.title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
        {task.description}
      </p>
    </Card>
  )
})

export default TaskCard
```

### Database - User Preferences

```sql
-- Supabase migration
ALTER TABLE users ADD COLUMN theme_preference VARCHAR(10) DEFAULT 'auto';
-- Valores: 'light', 'dark', 'auto' (respeta SO)
```

### Store Zustand para Theme (opcional)

```typescript
// src/stores/themeStore.ts
import { create } from 'zustand'
import { useTheme } from 'next-themes'

interface ThemeState {
  isDark: boolean
  setTheme: (theme: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  setTheme: (theme: 'light' | 'dark') => {
    set({ isDark: theme === 'dark' })
  }
}))
```

---

## 2. Multilanguage (i18n) con next-intl

### Instalación y Setup

```bash
pnpm add next-intl
```

### Estructura de Carpetas

```
src/
├── app/
│   └── [locale]/                    # Segment para locale
│       ├── layout.tsx
│       ├── page.tsx
│       ├── (auth)/
│       │   ├── login/page.tsx
│       │   └── signup/page.tsx
│       └── (dashboard)/
│           ├── layout.tsx
│           ├── tasks/page.tsx
│           └── task/[id]/page.tsx
│
└── i18n/
    ├── en.json                      # Inglés
    ├── es.json                      # Español
    └── config.ts                    # Configuración
```

### Configuración i18n

```typescript
// src/i18n/config.ts
export const locales = ['es', 'en'] as const
export const defaultLocale = 'es' as const

export type Locale = (typeof locales)[number]

export const translations = {
  es: () => import('./es.json'),
  en: () => import('./en.json'),
} as const
```

### Archivos de Traducción

```json
// src/i18n/es.json
{
  "common": {
    "appName": "Product Owner",
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito"
  },
  "auth": {
    "login": "Iniciar sesión",
    "signup": "Registrarse",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "loginError": "Email o contraseña inválidos"
  },
  "tasks": {
    "title": "Tareas",
    "newTask": "Nueva tarea",
    "filterBy": "Filtrar por",
    "priority": "Prioridad",
    "status": "Estado",
    "delete": "Eliminar",
    "edit": "Editar"
  },
  "nav": {
    "tasks": "Tareas",
    "review": "Revisión",
    "chat": "Chat",
    "history": "Historial",
    "profile": "Perfil",
    "settings": "Configuración"
  }
}
```

```json
// src/i18n/en.json
{
  "common": {
    "appName": "Product Owner",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "auth": {
    "login": "Sign in",
    "signup": "Sign up",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot password?",
    "loginError": "Invalid email or password"
  },
  "tasks": {
    "title": "Tasks",
    "newTask": "New task",
    "filterBy": "Filter by",
    "priority": "Priority",
    "status": "Status",
    "delete": "Delete",
    "edit": "Edit"
  },
  "nav": {
    "tasks": "Tasks",
    "review": "Review",
    "chat": "Chat",
    "history": "History",
    "profile": "Profile",
    "settings": "Settings"
  }
}
```

### Middleware next-intl

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export const config = {
  matcher: [
    // Skip all internal paths and assets
    '/((?!_next|api|.*\\..*).)*',
  ]
}
```

### Layout Root con Locale

```typescript
// src/app/[locale]/layout.tsx
import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'
import { ThemeProviderWrapper } from '@/lib/theme'

interface RootLayoutProps {
  children: ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  if (!locales.includes(locale as any)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
```

### Hook para Traducciones

```typescript
// src/hooks/useI18n.ts
'use client'

import { useTranslations } from 'next-intl'

export function useI18n() {
  const t = useTranslations()
  return { t }
}
```

### Componente con Traducciones

```typescript
// src/components/molecules/LoginForm.tsx
'use client'

import { useI18n } from '@/hooks/useI18n'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

export default function LoginForm() {
  const { t } = useI18n()

  return (
    <form className="space-y-4">
      <Input
        label={t('auth.email')}
        type="email"
        placeholder="example@mail.com"
        required
      />
      <Input
        label={t('auth.password')}
        type="password"
        placeholder="••••••••"
        required
      />
      <Button fullWidth>
        {t('auth.login')}
      </Button>
      <a href="#" className="text-sm text-blue-600">
        {t('auth.forgotPassword')}
      </a>
    </form>
  )
}
```

### Selector de Idioma

```typescript
// src/components/organisms/LanguageSelector.tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import Select from '@/components/atoms/Select'

export default function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}/`, `/${newLocale}/`)
    router.push(newPathname)
  }

  return (
    <Select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      options={[
        { label: 'Español', value: 'es' },
        { label: 'English', value: 'en' }
      ]}
    />
  )
}
```

### Database - Language Preference

```sql
-- Supabase migration
ALTER TABLE users ADD COLUMN language_preference VARCHAR(5) DEFAULT 'es';
-- Valores: 'es', 'en'
```

---

## 3. Responsive Design Mejorado

### Tailwind Breakpoints Actualizado

```typescript
// tailwind.config.ts
theme: {
  screens: {
    'sm': '640px',    // Mobile/Tablet
    'md': '1024px',   // Tablet/Desktop
    'lg': '1280px',   // Desktop
    'xl': '1536px',   // Large Desktop
  }
}
```

### Estructura de Componentes Responsive

```typescript
// src/components/organisms/TaskLayout.tsx
// Desktop: Grid 3 columnas
// Tablet: Grid 2 columnas
// Mobile: Stack vertical

export default function TaskLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Automáticamente responsive */}
    </div>
  )
}
```

### Chat Responsive (Modal en Mobile)

```typescript
// src/components/organisms/ChatInterface.tsx
'use client'

import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function ChatInterface() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  if (isMobile) {
    return (
      <>
        <button onClick={() => setIsChatOpen(!isChatOpen)}>
          💬 Chat
        </button>
        {isChatOpen && (
          <div className="fixed inset-0 bg-white z-50 p-4">
            {/* Chat modal */}
          </div>
        )}
      </>
    )
  }

  return (
    <div className="w-2/5">
      {/* Chat sidebar en desktop */}
    </div>
  )
}
```

### Media Query Hook

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
```

### Touch-Friendly Buttons

```typescript
// Componente Button actualizado
const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant, size = 'md', ...props }, ref) => {
      // Mínimo 44x44px para touch
      const sizeStyles = {
        sm: 'px-3 py-1.5 min-h-[40px] min-w-[40px]',
        md: 'px-4 py-2 min-h-[44px] min-w-[44px]',
        lg: 'px-6 py-3 min-h-[48px] min-w-[48px]'
      }
      // ...
    }
  )
)
```

### Testing Responsive

```typescript
// src/__tests__/responsive.test.tsx
import { render, screen } from '@testing-library/react'
import TaskLayout from '@/components/organisms/TaskLayout'

describe('Responsive Design', () => {
  it('renders single column on mobile', () => {
    global.innerWidth = 375
    window.dispatchEvent(new Event('resize'))

    render(<TaskLayout />)
    const grid = screen.getByRole('grid')
    expect(grid).toHaveClass('grid-cols-1')
  })

  it('renders multi-column on desktop', () => {
    global.innerWidth = 1440
    window.dispatchEvent(new Event('resize'))

    render(<TaskLayout />)
    const grid = screen.getByRole('grid')
    expect(grid).toHaveClass('lg:grid-cols-3')
  })
})
```

---

## 4. Turbopack Configuration

### next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopack: {},  // Activo por defecto en dev
  },
  // Otras configuraciones...
}

export default nextConfig
```

### package.json

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

### Verificar Turbopack

```bash
pnpm dev
# Output esperado:
# ▲ Next.js 16.1.6
# - Local:        http://localhost:3000
# ✓ compiled with turbopack (1.5s)
```

### Performance Targets

```
Dev server startup: < 3 segundos
Hot module reload: < 1 segundo
Production build: < 30 segundos
```

---

## 5. Estructura de Carpetas Actualizada

```
src/
├── app/
│   └── [locale]/                    # NEW: Segment locale
│       ├── layout.tsx               # UPDATED: with locale
│       ├── page.tsx
│       ├── (auth)/
│       │   ├── login/page.tsx
│       │   ├── signup/page.tsx
│       │   └── forgot-password/page.tsx
│       └── (dashboard)/
│           ├── layout.tsx           # UPDATED: with theme toggle
│           ├── tasks/page.tsx
│           ├── task/[id]/page.tsx
│           ├── review/page.tsx
│           ├── chat/page.tsx
│           └── history/page.tsx
│
├── components/
│   ├── atoms/
│   │   ├── Button.tsx               # UPDATED: dark mode
│   │   ├── Input.tsx                # UPDATED: dark mode
│   │   └── ... (todos con dark mode)
│   ├── molecules/
│   │   ├── TaskCard.tsx             # UPDATED: dark mode
│   │   ├── LanguageSelector.tsx     # NEW
│   │   └── ... (todos con dark mode)
│   └── organisms/
│       ├── ThemeToggle.tsx          # NEW
│       ├── LanguageSelector.tsx     # NEW
│       └── ... (todos con dark mode)
│
├── i18n/
│   ├── es.json                      # NEW: Spanish translations
│   ├── en.json                      # NEW: English translations
│   └── config.ts                    # NEW: i18n config
│
├── lib/
│   ├── theme.ts                     # NEW: next-themes config
│   ├── supabase.ts
│   └── ...
│
├── hooks/
│   ├── useTheme.ts                  # NEW: Theme hook
│   ├── useI18n.ts                   # NEW: i18n hook
│   ├── useMediaQuery.ts             # UPDATED: for responsive
│   └── ...
│
├── middleware.ts                    # NEW: next-intl middleware
│
└── globals.css                      # UPDATED: dark mode CSS variables
```

---

## 6. Nuevas Dependencias

```json
{
  "dependencies": {
    "next-themes": "^0.2.1",
    "next-intl": "^3.0.0"
  }
}
```

### Instalación

```bash
pnpm add next-themes next-intl
```

---

## 7. Testing con Dark Mode e i18n

### Test de Dark Mode

```typescript
// src/__tests__/dark-mode.test.tsx
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import TaskCard from '@/components/molecules/TaskCard'

describe('Dark Mode', () => {
  it('renders with light mode classes', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TaskCard task={mockTask} onSelect={jest.fn()} />
      </ThemeProvider>
    )
    expect(screen.getByRole('article')).toHaveClass('bg-white')
  })

  it('renders with dark mode classes', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TaskCard task={mockTask} onSelect={jest.fn()} />
      </ThemeProvider>
    )
    expect(screen.getByRole('article')).toHaveClass('dark:bg-slate-800')
  })
})
```

### Test de i18n

```typescript
// src/__tests__/i18n.test.tsx
import { render, screen } from '@testing-library/react'
import { NextIntlProvider } from 'next-intl'
import LoginForm from '@/components/molecules/LoginForm'
import es from '@/i18n/es.json'
import en from '@/i18n/en.json'

describe('i18n', () => {
  it('renders Spanish text', () => {
    render(
      <NextIntlProvider locale="es" messages={es}>
        <LoginForm />
      </NextIntlProvider>
    )
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })

  it('renders English text', () => {
    render(
      <NextIntlProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlProvider>
    )
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })
})
```

---

## 8. API Backend Updates

### AuthMe Endpoint - Incluir Preferences

```typescript
// src/app/api/auth/me/route.ts
export async function GET(request: Request) {
  const user = await getCurrentUser()

  return Response.json({
    id: user.id,
    email: user.email,
    name: user.name,
    theme_preference: user.theme_preference,      // NEW
    language_preference: user.language_preference, // NEW
    created_at: user.created_at
  })
}
```

### Update User Preferences

```typescript
// src/app/api/user/preferences/route.ts
export async function PATCH(request: Request) {
  const { theme_preference, language_preference } = await request.json()
  const user = await getCurrentUser()

  const updated = await db
    .from('users')
    .update({
      theme_preference,
      language_preference
    })
    .eq('id', user.id)
    .select()
    .single()

  return Response.json(updated)
}
```

---

## 9. Actualización del Checklist

### Dark Mode
- [x] Setup next-themes
- [x] CSS variables + Tailwind dark: classes
- [x] ThemeToggle component
- [x] Hook useThemeToggle
- [x] Database field theme_preference
- [ ] Actualizar todos los componentes con dark mode
- [ ] Testing dark/light mode

### i18n
- [x] Setup next-intl
- [x] Archivos ES.json, EN.json
- [x] Middleware [locale]
- [x] Hook useI18n
- [x] LanguageSelector component
- [x] Database field language_preference
- [ ] Traducir todos los strings
- [ ] Testing i18n

### Responsive
- [x] Tailwind breakpoints (sm, md, lg)
- [x] useMediaQuery hook
- [x] Touch-friendly buttons (44x44px)
- [ ] Testear en 3 viewports (375px, 768px, 1440px)
- [ ] Revisar componentes responsivos

### Turbopack
- [x] next.config.ts con turbopack
- [x] package.json `next dev --turbopack`
- [ ] Verificar hot reload < 1s

---

## 10. Impact on Implementation Phases

### Phase 1: Setup Base (Actualizado)
- [ ] Create folder structure including [locale]
- [ ] Setup next-themes + next-intl
- [ ] Add CSS variables for dark mode
- [ ] Create ThemeToggle + LanguageSelector
- [ ] Verify Turbopack in dev

### Phase 2-8: (No major changes)
- Todos los componentes ahora con dark: classes
- Strings en componentes usar t('key') en lugar de hardcoded
- Testing incluye dark mode + responsive + i18n

---

## 11. URLs con Locale

### Antes (sin i18n)
```
/login
/tasks
/task/123
/review
```

### Después (con i18n)
```
/es/login
/es/tasks
/es/task/123
/es/review

/en/login
/en/tasks
/en/task/123
/en/review
```

---

## 12. Resumen de Cambios

| Aspecto | Cambio | Impacto |
|---------|--------|--------|
| Dark Mode | next-themes + dark: classes | Todos los componentes |
| i18n | next-intl + [locale] segment | URLs + strings |
| Responsive | useMediaQuery + tailwind | Layouts |
| Turbopack | next.config + npm script | Dev experience |
| Database | +2 campos en users | User preferences |
| Hooks | useThemeToggle, useI18n | Global usage |

---

## 13. Migration Checklist

- [ ] Install next-themes, next-intl
- [ ] Create i18n files (es.json, en.json)
- [ ] Update next.config.ts with turbopack
- [ ] Update package.json scripts
- [ ] Create middleware.ts
- [ ] Create app/[locale]/layout.tsx
- [ ] Add theme.ts to lib/
- [ ] Create useThemeToggle, useI18n hooks
- [ ] Add CSS variables to globals.css
- [ ] Update all components with dark: classes
- [ ] Replace hardcoded strings with t('key')
- [ ] Update database schema (+2 fields)
- [ ] Test dark mode toggle
- [ ] Test language switching
- [ ] Test responsive in 3 viewports
- [ ] Verify Turbopack compilation

