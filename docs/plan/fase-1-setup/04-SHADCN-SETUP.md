# shadcn/ui Integration Guide

**Versión**: 1.0 | **Fecha**: 2026-03-16 | **Status**: New architecture decision

---

## 📋 Tabla de Contenidos

1. [Overview](#overview)
2. [Por qué shadcn/ui](#por-qué-shadcnui)
3. [Setup Inicial](#setup-inicial)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Componentes a Usar](#componentes-a-usar)
6. [Customización Dark Mode](#customización-dark-mode)
7. [Atomic Design + shadcn](#atomic-design--shadcn)
8. [Ejemplos de Uso](#ejemplos-de-uso)
9. [Extensiones Custom](#extensiones-custom)
10. [Testing](#testing)

---

## Overview

**shadcn/ui** es una colección de componentes reutilizables construidos con **Radix UI** primitives y **Tailwind CSS**.

**Ventaja clave**: Los componentes se **copian y pegan** directamente en tu proyecto (no como npm package), permitiendo:
- ✅ Máxima customización
- ✅ Sin dependencias externas
- ✅ Control total del código
- ✅ Perfecto para dark mode
- ✅ Accesibilidad built-in (WCAG 2.1 AA)

### Stack Actualizado

```
React 19 + Next.js 16
├── Tailwind CSS 4 (styling)
├── shadcn/ui (base components)
├── Radix UI (primitives - incluido en shadcn)
├── Zustand (state management)
├── next-themes (dark mode)
├── next-intl (i18n)
└── TypeScript (type safety)
```

---

## Por qué shadcn/ui

### Comparación

| Aspecto | shadcn/ui | MUI | Chakra | Ant Design |
|---------|-----------|-----|--------|-----------|
| Setup | Copy/paste | npm | npm | npm |
| Customizable | 100% | 80% | 90% | 70% |
| Bundle | 0KB (copy) | 200KB | 150KB | 250KB |
| Dark mode | Native | Yes | Yes | Yes |
| Tailwind | Yes | No | Partial | No |
| Atomic Design | ✅ Compatible | ⚠️ Difícil | ✅ Compatible | ⚠️ Difícil |
| Radix UI | Native | No | Own | Own |
| Accesibilidad | WCAG AA | WCAG A | WCAG AA | WCAG A |

**Conclusión**: shadcn/ui es la mejor opción para este proyecto porque:
- Copy/paste permite máximo control
- 100% customizable para Atomic Design
- Dark mode nativo
- Accesibilidad garantizada
- 0 overhead de bundle (sin npm dependency)

---

## Setup Inicial

### 1. Instalar shadcn/ui CLI

```bash
pnpm add -D shadcn-ui
```

### 2. Inicializar shadcn

```bash
npx shadcn-ui init
```

**Preguntas interactivas**:
```
✔ Would you like to use TypeScript (recommended)? › Yes
✔ Which style would you like to use? › New York
✔ Which color would you like as base color? › Slate
✔ Where is your global CSS file? › src/app/globals.css
✔ Do you want to use CSS variables for theming? › Yes
✔ Which CSS variables strategy would you like to use? › Yes
✔ Are you using a custom tsconfig? › No
```

### 3. Instalar Componentes Base

```bash
# Button
npx shadcn-ui add button

# Input
npx shadcn-ui add input

# Card
npx shadcn-ui add card

# Dialog
npx shadcn-ui add dialog

# Select
npx shadcn-ui add select

# Dropdown Menu
npx shadcn-ui add dropdown-menu

# Tabs
npx shadcn-ui add tabs

# Badge
npx shadcn-ui add badge

# Toast
npx shadcn-ui add toast

# Tooltip
npx shadcn-ui add tooltip

# Popover
npx shadcn-ui add popover

# Textarea
npx shadcn-ui add textarea

# Checkbox
npx shadcn-ui add checkbox

# Radio Group
npx shadcn-ui add radio-group

# Switch
npx shadcn-ui add switch

# Progress
npx shadcn-ui add progress

# Skeleton
npx shadcn-ui add skeleton

# Spinner (custom - no existe en shadcn, crear basado en badge)
# Pagination
npx shadcn-ui add pagination

# Breadcrumb
npx shadcn-ui add breadcrumb
```

### 4. Resultado

```
src/components/
├── ui/
│   ├── button.tsx           (from shadcn)
│   ├── input.tsx            (from shadcn)
│   ├── card.tsx             (from shadcn)
│   ├── dialog.tsx           (from shadcn)
│   ├── select.tsx           (from shadcn)
│   ├── dropdown-menu.tsx    (from shadcn)
│   ├── tabs.tsx             (from shadcn)
│   ├── badge.tsx            (from shadcn)
│   ├── toast.tsx            (from shadcn)
│   ├── tooltip.tsx          (from shadcn)
│   ├── popover.tsx          (from shadcn)
│   ├── textarea.tsx         (from shadcn)
│   ├── checkbox.tsx         (from shadcn)
│   ├── radio-group.tsx      (from shadcn)
│   ├── switch.tsx           (from shadcn)
│   ├── progress.tsx         (from shadcn)
│   ├── skeleton.tsx         (from shadcn)
│   ├── pagination.tsx       (from shadcn)
│   └── breadcrumb.tsx       (from shadcn)
```

---

## Estructura de Carpetas

```
src/components/
├── ui/                          ← shadcn/ui (copy/paste)
│   ├── button.tsx               (Button primitiva)
│   ├── input.tsx                (Input primitivo)
│   ├── card.tsx                 (Card primitivo)
│   ├── dialog.tsx               (Modal/Dialog primitivo)
│   ├── select.tsx               (Select primitivo)
│   ├── dropdown-menu.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   ├── toast.tsx
│   ├── tooltip.tsx
│   ├── popover.tsx
│   ├── textarea.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   ├── switch.tsx
│   ├── progress.tsx
│   ├── skeleton.tsx
│   ├── pagination.tsx
│   └── breadcrumb.tsx
│
├── atoms/                       ← Custom atoms (wraps shadcn)
│   ├── Button.tsx               (wraps ui/button)
│   ├── Input.tsx                (wraps ui/input)
│   ├── Badge.tsx                (wraps ui/badge)
│   ├── Card.tsx                 (wraps ui/card)
│   ├── Spinner.tsx              (custom, no shadcn)
│   ├── Icon.tsx                 (custom, no shadcn)
│   ├── Text.tsx                 (custom, no shadcn)
│   ├── Checkbox.tsx             (wraps ui/checkbox)
│   ├── Select.tsx               (wraps ui/select)
│   ├── TextArea.tsx             (wraps ui/textarea)
│   ├── Avatar.tsx               (custom, no shadcn)
│   └── Divider.tsx              (custom, no shadcn)
│
├── molecules/                   ← Combinaciones
│   ├── SearchInput.tsx          (Input + Icon)
│   ├── StatusBadge.tsx          (Badge + logic)
│   ├── PriorityBadge.tsx        (Badge + logic)
│   ├── TaskCard.tsx             (Card + content)
│   ├── ChatMessage.tsx          (Avatar + Text)
│   ├── TabNav.tsx               (Tabs + nav)
│   ├── Breadcrumb.tsx           (shadcn breadcrumb)
│   ├── Pagination.tsx           (shadcn pagination)
│   ├── ConfirmDialog.tsx        (Dialog + buttons)
│   ├── FilterBar.tsx            (Input + Select + Button)
│   └── UserChip.tsx             (Avatar + name)
│
├── organisms/                   ← Lógica compleja
│   ├── TaskFilters.tsx
│   ├── TaskList.tsx
│   ├── TaskPreview.tsx
│   ├── ChatInterface.tsx
│   ├── ReviewPanel.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
│
└── index.ts                     ← Exports centralizados
```

### Patrón: Custom Atom wrapping shadcn

```typescript
// src/components/atoms/Button.tsx
'use client'

import { forwardRef, memo } from 'react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnButton> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = 'primary',
        size = 'md',
        isLoading = false,
        fullWidth = false,
        className,
        children,
        disabled,
        ...props
      },
      ref
    ) => {
      // Map custom variants to shadcn variants
      const variantMap = {
        primary: 'default',
        secondary: 'outline',
        danger: 'destructive',
        ghost: 'ghost'
      }

      // Map custom sizes to shadcn sizes
      const sizeMap = {
        sm: 'sm',
        md: 'default',
        lg: 'lg'
      }

      return (
        <ShadcnButton
          ref={ref}
          variant={variantMap[variant] as any}
          size={sizeMap[size] as any}
          disabled={disabled || isLoading}
          className={cn(
            fullWidth && 'w-full',
            className
          )}
          {...props}
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" />
              {children}
            </span>
          ) : (
            children
          )}
        </ShadcnButton>
      )
    }
  )
)

Button.displayName = 'Button'

export default Button
```

---

## Componentes a Usar

### Del catálogo shadcn/ui (19 componentes)

| Componente | Uso | Ubicación |
|-----------|-----|-----------|
| button | CTA, acciones | atoms |
| input | Campos texto | atoms |
| card | Contenedores | atoms |
| dialog | Modales | molecules |
| select | Dropdowns | atoms |
| dropdown-menu | Menús contexto | molecules |
| tabs | Navegación por pestañas | molecules |
| badge | Etiquetas | atoms |
| toast | Notificaciones | organisms |
| tooltip | Tips flotantes | molecules |
| popover | Popovers | molecules |
| textarea | Campos largos | atoms |
| checkbox | Checkboxes | atoms |
| radio-group | Radio buttons | atoms |
| switch | Toggle switches | atoms |
| progress | Barras progreso | molecules |
| skeleton | Placeholders | molecules |
| pagination | Paginación | molecules |
| breadcrumb | Navegación ruta | molecules |

### Componentes Custom (13 componentes)

No existen en shadcn, crear custom:

| Componente | Por qué | Ubicación |
|-----------|--------|-----------|
| Spinner | Loading indicator | atoms |
| Icon | Icons SVG | atoms |
| Text | Typography | atoms |
| Avatar | User avatars | atoms |
| Divider | Separadores | atoms |
| SearchInput | Search con icon | molecules |
| StatusBadge | Badge con lógica | molecules |
| PriorityBadge | Badge con lógica | molecules |
| TaskCard | Card resumida | molecules |
| ChatMessage | Mensaje chat | molecules |
| ConfirmDialog | Dialog confirmación | molecules |
| FilterBar | Filtros + botones | molecules |
| UserChip | Avatar + nombre | molecules |

---

## Customización Dark Mode

### 1. CSS Variables en globals.css

```css
/* src/app/globals.css */

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.6%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 9.0%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.6%;
    --radius: 0.5rem;
    --primary: 222.2 47.6% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.6% 11.2%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 91.2% 59.8%;
    --accent-foreground: 222.2 47.6% 11.2%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.6% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
  }
}
```

### 2. Tailwind Config con CSS Variables

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}

export default config
```

### 3. next-themes Integration

shadcn + next-themes ya funcionan juntos perfectamente:

```typescript
// src/lib/theme.ts
export const ThemeConfig = {
  attribute: 'class',        // shadcn usa class-based dark mode
  defaultTheme: 'light',
  enableSystem: true,
  enableTransitionOnChangeOnly: true,
  storageKey: 'theme-preference'
}
```

---

## Atomic Design + shadcn

### Estrategia

1. **shadcn components** en `src/components/ui/` (primitivas)
2. **Custom atoms** en `src/components/atoms/` (wraps + customización)
3. **Molecules** en `src/components/molecules/` (combinaciones)
4. **Organisms** en `src/components/organisms/` (lógica compleja)

### Ventajas

- ✅ Base accesible (shadcn)
- ✅ Customizable (atoms wrapper)
- ✅ Composable (Atomic Design)
- ✅ Dark mode nativo
- ✅ Sin dependency bloat (copy/paste)

### Ejemplo: Search Input

```typescript
// src/components/atoms/Input.tsx
// Wraps shadcn input
import { Input as ShadcnInput } from '@/components/ui/input'

// src/components/molecules/SearchInput.tsx
// Combina Input + Icon
import Input from '@/components/atoms/Input'
import Icon from '@/components/atoms/Icon'

// src/components/organisms/TaskFilters.tsx
// Usa SearchInput en contexto
import SearchInput from '@/components/molecules/SearchInput'
```

---

## Ejemplos de Uso

### Button (shadcn base)

```typescript
import { Button } from '@/components/ui/button'

export function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  )
}
```

### Button (custom atom wrapper)

```typescript
import Button from '@/components/atoms/Button'

export function MyComponent() {
  return (
    <Button
      variant="primary"
      size="md"
      isLoading={isLoading}
      fullWidth
    >
      Click me
    </Button>
  )
}
```

### Input con shadcn

```typescript
import { Input } from '@/components/ui/input'

export function MyForm() {
  return (
    <Input
      type="email"
      placeholder="Enter your email"
      className="bg-white dark:bg-slate-950"
    />
  )
}
```

### Input custom atom

```typescript
import Input from '@/components/atoms/Input'

export function MyForm() {
  const [error, setError] = useState<string | null>(null)

  return (
    <Input
      type="email"
      label="Email"
      placeholder="Enter your email"
      error={error}
      helperText="We'll never share your email"
      onChange={(e) => {
        // validation logic
      }}
    />
  )
}
```

### Dialog (Modal)

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function MyDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        {/* content */}
      </DialogContent>
    </Dialog>
  )
}
```

### Tabs

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function MyTabs() {
  return (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  )
}
```

---

## Extensiones Custom

### Spinner (no existe en shadcn)

```typescript
// src/components/atoms/Spinner.tsx
'use client'

import { memo } from 'react'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Spinner = memo(({ size = 'md', className }: SpinnerProps) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
})

Spinner.displayName = 'Spinner'

export default Spinner
```

### Icon (SVG wrapper)

```typescript
// src/components/atoms/Icon.tsx
'use client'

import { memo } from 'react'
import { cn } from '@/utils/cn'

type IconName = 'search' | 'x' | 'menu' | 'sun' | 'moon' | 'check' | 'alert'

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

const icons: Record<IconName, React.ReactNode> = {
  search: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  x: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  // ... más icons
}

const Icon = memo(({ name, size = 24, className }: IconProps) => (
  <span
    className={cn('inline-flex', className)}
    style={{ width: size, height: size }}
  >
    {icons[name]}
  </span>
))

Icon.displayName = 'Icon'

export default Icon
```

### Text (Typography)

```typescript
// src/components/atoms/Text.tsx
'use client'

import { memo } from 'react'
import { cn } from '@/utils/cn'

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'small'
type TextColor = 'primary' | 'muted' | 'danger' | 'success'
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  variant?: TextVariant
  color?: TextColor
  weight?: TextWeight
  truncate?: boolean
}

const variantStyles = {
  h1: 'text-2xl md:text-3xl',
  h2: 'text-xl md:text-2xl',
  h3: 'text-lg md:text-xl',
  body: 'text-base',
  small: 'text-sm'
}

const colorStyles = {
  primary: 'text-foreground',
  muted: 'text-muted-foreground',
  danger: 'text-destructive',
  success: 'text-green-600 dark:text-green-400'
}

const weightStyles = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

const Text = memo(
  ({
    as: Component = 'p',
    variant = 'body',
    color = 'primary',
    weight = 'normal',
    truncate = false,
    className,
    ...props
  }: TextProps) => (
    <Component
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        weightStyles[weight],
        truncate && 'truncate',
        className
      )}
      {...props}
    />
  )
)

Text.displayName = 'Text'

export default Text
```

---

## Testing

### Dark Mode Testing con shadcn

```typescript
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { Button } from '@/components/ui/button'

describe('shadcn Button with dark mode', () => {
  it('renders with light theme', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Button>Click me</Button>
      </ThemeProvider>
    )
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders with dark theme', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <Button>Click me</Button>
      </ThemeProvider>
    )
    const button = screen.getByText('Click me')
    expect(button).toHaveClass('dark:bg-slate-800')
  })
})
```

### Accesibilidad Testing

```typescript
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '@/components/ui/button'

expect.extend(toHaveNoViolations)

describe('shadcn Button a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

---

## Migración Actualizada

### Antigua estructura (sin shadcn)

```
atoms/
├─ Button.tsx (custom)
├─ Input.tsx (custom)
├─ Badge.tsx (custom)
└─ ... (12 custom atoms)
```

### Nueva estructura (con shadcn)

```
ui/                    (shadcn - copy/paste)
├─ button.tsx
├─ input.tsx
├─ badge.tsx
├─ ... (19 shadcn components)

atoms/                 (wrappers + custom)
├─ Button.tsx          (wraps ui/button)
├─ Input.tsx           (wraps ui/input)
├─ Badge.tsx           (wraps ui/badge)
├─ Spinner.tsx         (custom)
├─ Icon.tsx            (custom)
├─ Text.tsx            (custom)
└─ ... (13 atoms)
```

---

## Resumen

### Ventajas de shadcn/ui

✅ **Copy/paste** - Máximo control, sin dependency bloat
✅ **Accesibilidad** - WCAG 2.1 AA built-in via Radix UI
✅ **Dark mode** - CSS variables nativas
✅ **Tailwind** - Styling consistente
✅ **Atomic Design compatible** - Perfecta composición
✅ **Customizable** - 100% control del código
✅ **No overhead** - 0KB added to bundle (copy/paste)

### Proceso de desarrollo

1. **shadcn/ui primitivas** → `src/components/ui/`
2. **Atoms custom** → `src/components/atoms/` (wrappers)
3. **Molecules** → combinaciones de atoms
4. **Organisms** → lógica compleja
5. **Pages** → composición de organisms

### Flujo actualizado

```
shadcn/ui (primitivas accesibles)
    ↓
Custom atoms (wrappers + lógica)
    ↓
Molecules (combinaciones)
    ↓
Organisms (componentes complejos)
    ↓
Pages (aplicación)
```

---

**Status**: Ready to implement
**Next step**: Run `npx shadcn-ui init` and start copying components
**Documentation**: Updated FRONTEND_ARCHITECTURE.md with shadcn stack

