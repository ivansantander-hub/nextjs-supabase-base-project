# 🎨 shadcn/ui Integration Guide

**Decisión arquitectónica**: Usar **shadcn/ui** como base de componentes UI.

---

## ¿Por qué shadcn/ui?

✅ **Tailwind CSS + Radix UI** - Accesibilidad garantizada (WCAG 2.1 AA)
✅ **Copy/paste** - No es npm package, evita dependency bloat
✅ **100% customizable** - Copias el código, lo adaptas a tus necesidades
✅ **Dark mode ready** - Funciona perfectamente con `next-themes`
✅ **Atomic Design friendly** - Componentes base para construir atoms/molecules
✅ **TypeScript** - Tipado completo
✅ **Composable** - Combina fácilmente en arquitectura Atomic Design

---

## Estructura de Componentes

### Capa 1: shadcn/ui (Copy/Paste)
```
src/components/ui/
├── button.tsx           ← shadcn (copy/paste)
├── input.tsx            ← shadcn (copy/paste)
├── card.tsx             ← shadcn (copy/paste)
├── dialog.tsx           ← shadcn (copy/paste)
├── select.tsx           ← shadcn (copy/paste)
├── dropdown-menu.tsx    ← shadcn (copy/paste)
├── tabs.tsx             ← shadcn (copy/paste)
├── badge.tsx            ← shadcn (copy/paste)
├── toast.tsx            ← shadcn (copy/paste)
├── tooltip.tsx          ← shadcn (copy/paste)
├── popover.tsx          ← shadcn (copy/paste)
├── textarea.tsx         ← shadcn (copy/paste)
├── checkbox.tsx         ← shadcn (copy/paste)
├── radio-group.tsx      ← shadcn (copy/paste)
├── switch.tsx           ← shadcn (copy/paste)
├── progress.tsx         ← shadcn (copy/paste)
├── skeleton.tsx         ← shadcn (copy/paste)
└── spinner.tsx          ← shadcn (copy/paste)
```

### Capa 2: Atoms (Customización + Extensión)
```
src/components/atoms/
├── Button.tsx           ← Extiende shadcn/button
├── Input.tsx            ← Extiende shadcn/input
├── Text.tsx             ← Custom atom
├── Icon.tsx             ← Custom atom
├── Label.tsx            ← Custom atom
├── Link.tsx             ← Custom atom
└── Badge.tsx            ← Extiende shadcn/badge
```

### Capa 3: Molecules (Combinaciones)
```
src/components/molecules/
├── TaskCard.tsx         ← Card + Text + Button
├── SearchInput.tsx      ← Input + Icon
├── StatusBadge.tsx      ← Badge + Tooltip
├── FormField.tsx        ← Label + Input + Error message
└── ...
```

### Capa 4: Organisms (Composición)
```
src/components/organisms/
├── TaskFilters.tsx      ← Select + Button + Checkbox
├── TaskList.tsx         ← Múltiples TaskCards
├── TaskPreview.tsx      ← Card + Tabs + Buttons
├── ChatPanel.tsx        ← Textarea + Scroll + Messages
└── ...
```

---

## Setup Inicial

### 1. Instalar dependencias
```bash
pnpm add clsx class-variance-authority
# shadcn/ui requiere:
# - Tailwind CSS (ya instalado)
# - Radix UI (como peer dependency)
```

### 2. Configurar Tailwind (tsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 3. Copiar componentes shadcn
```bash
# Usar CLI de shadcn/ui (en el futuro)
# O copiar manualmente desde: https://ui.shadcn.com

# Componentes a copiar:
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
# ... etc
```

### 4. Verificar estructura
```
src/
├── components/
│   ├── ui/              ← shadcn/ui copiados
│   ├── atoms/           ← Custom atoms
│   ├── molecules/       ← Molecules
│   └── organisms/       ← Organisms
├── lib/
│   ├── utils.ts         ← cn() helper
│   └── theme.ts         ← Tema config
└── globals.css          ← CSS variables
```

---

## Personalización para Dark Mode

### 1. CSS Variables en globals.css
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 89.8%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 9%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.6%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    --card: 0 0% 10%;
    --card-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 98%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 9%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.3%;
  }
}
```

### 2. Usar `next-themes` con shadcn
```typescript
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 3. Componentes shadcn ya respetan dark mode
```tsx
// Button automáticamente respeta el tema
<Button variant="default">Click me</Button>

// En dark mode, los colores cambian automáticamente
// (porque usan CSS variables)
```

---

## Ejemplo: Crear un Atom sobre shadcn

```typescript
// src/components/atoms/Button.tsx
'use client'

import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  onClick,
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'transition-all duration-200',
        isLoading && 'opacity-70 cursor-wait',
        className
      )}
    >
      {isLoading ? '⏳ Loading...' : children}
    </ShadcnButton>
  )
}
```

---

## Ejemplo: Crear una Molecule (TaskCard)

```typescript
// src/components/molecules/TaskCard.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/atoms/Button'
import { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onSelect, onDelete }: TaskCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer dark:hover:shadow-lg/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{task.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {task.description}
          </p>
          <div className="mt-3 flex gap-2">
            <Badge variant="secondary">{task.status}</Badge>
            {task.priority && (
              <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
                {task.priority}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(task.id)}
          >
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

---

## Componentes shadcn a Usar

| Componente | Uso | Incluir |
|-----------|-----|---------|
| Button | Acciones generales | ✅ |
| Input | Campos de texto | ✅ |
| Card | Contenedores | ✅ |
| Dialog | Modales | ✅ |
| Select | Dropdowns | ✅ |
| Dropdown Menu | Menús contextuales | ✅ |
| Tabs | Navegación por pestañas | ✅ |
| Badge | Etiquetas/estados | ✅ |
| Toast | Notificaciones | ✅ |
| Tooltip | Ayuda | ✅ |
| Popover | Popovers | ✅ |
| Textarea | Áreas de texto | ✅ |
| Checkbox | Checkboxes | ✅ |
| Radio Group | Radios | ✅ |
| Switch | Toggle switches | ✅ |
| Progress | Barras de progreso | ✅ |
| Skeleton | Loading placeholders | ✅ |
| Spinner | Loading indicators | (custom) |

---

## Testing con shadcn

```typescript
// src/components/atoms/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('respeta dark mode', () => {
    const { container } = render(<Button>Test</Button>)
    const button = container.querySelector('button')
    // Button automáticamente usa CSS variables
    expect(button).toHaveClass('bg-primary')
  })

  it('muestra loading state', () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByText('⏳ Loading...')).toBeInTheDocument()
  })
})
```

---

## Workflow de Desarrollo

### Crear nuevo componente
1. **Identify shadcn base** - Determinar si necesitas shadcn
2. **Copy from shadcn** - Copiar de https://ui.shadcn.com
3. **Customize** - Adaptar estilos/comportamiento
4. **Wrap en atom** - Crear atom si es necesario
5. **Compose en molecule** - Combinar en molecules
6. **Test** - Escribir tests (unit + dark mode)

### Actualizar shadcn
Si shadcn/ui actualiza:
1. Revisar changelog
2. Copiar versión nueva
3. Merge con customizaciones
4. Test en dark/light + responsive

---

## Decisiones Clave

✅ **Copy/paste vs npm package**: Copy/paste (control total, evita bloat)
✅ **Dark mode**: Automático con CSS variables + next-themes
✅ **Tailwind config**: Extender para custom colors si es necesario
✅ **Atomic Design**: shadcn como base, atoms encima, molecules combinan
✅ **Accesibilidad**: WCAG 2.1 AA garantizado (Radix UI)
✅ **TypeScript**: Tipado desde shadcn

---

## Checklist de Implementación

- [ ] Instalar dependencias (clsx, class-variance-authority)
- [ ] Setup Tailwind + CSS variables
- [ ] Copiar primeros 5 componentes (button, input, card, dialog, select)
- [ ] Crear atoms wrapper
- [ ] Crear molecules básicas
- [ ] Testing en dark + light mode
- [ ] Copiar componentes adicionales según sea necesario
- [ ] Documentar customizaciones
- [ ] Testing responsive (3 viewports)

---

**Resultado final**: Sistema de componentes limpio, accesible, dark-mode ready, y completamente bajo control. 🎨

