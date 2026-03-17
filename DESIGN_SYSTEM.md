# Design System - Next.js + Supabase Boilerplate

Sistema de diseño limpio y minimalista incluido en este boilerplate. Está completamente configurado en Tailwind CSS.

## 🎨 Paleta de Colores

### Variables CSS Globales

```css
/* Light Mode */
--primary: #7c3aed (Violeta)
--primary-light: #a78bfa
--background: #ffffff
--surface: #f8fafc (Slate 50)
--text: #0f172a (Slate 900)
--text-secondary: #64748b (Slate 500)
--border: #e2e8f0 (Slate 200)

/* Dark Mode */
--primary: #a78bfa (Violeta lavanda)
--background: #0f172a (Slate 900)
--surface: #1e293b (Slate 800)
--text: #f1f5f9 (Slate 50)
--border: #334155 (Slate 700)
```

**Características:**
- ✅ Contraste WCAG AA+ en todos los estados
- ✅ Transiciones suaves 300ms entre temas
- ✅ Sistema de colores coherente

## 📝 Tipografía

```
Display Font:  Playfair Display (headings)
Body Font:     Sora (body, UI)
Mono Font:     Monaco (code)
```

### Jerarquía de Tamaños

| Elemento | Tamaño | Peso |
|----------|--------|------|
| h1 | 2.5rem | 700 |
| h2 | 2rem | 700 |
| h3 | 1.5rem | 600 |
| body | 1rem | 400 |
| small | 0.875rem | 400 |

## 🎯 Componentes Base

### Button

**Variantes:** primary, secondary, outline, ghost, danger
**Tamaños:** sm, md, lg
**Features:**
- Gradiente dinámico en primarios
- Hover states con elevación
- Active states con escala
- Loading states con spinner
- Focus rings accesibles

```tsx
// Uso
<Button variant="primary" size="md">Click me</Button>
<Button variant="outline">Outlined</Button>
<Button disabled>Disabled</Button>
```

### Input

**Features:**
- Focus ring con shadow suave
- Estados hover mejorados
- Soporte para iconos left/right
- Indicador visual de error
- Helper text y hints

```tsx
// Uso
<Input
  type="email"
  placeholder="user@example.com"
  icon="mail"
/>
```

### Card

Contenedor flexible para organizar contenido.

```tsx
<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

## ✨ Animaciones

### Duraciones Estándar

```css
--duration-fast:  150ms
--duration-base:  200ms
--duration-slow:  300ms
```

### Animaciones Disponibles

```css
fadeIn        → opacity 0 → 1
slideInUp     → translateY -12px, opacity 0 → 1
slideInDown   → translateY +12px, opacity 0 → 1
scaleIn       → scale 0.95 → 1, opacity 0 → 1
shimmer       → Loading effect
pulse-ring    → Focus effect
```

## 🌙 Dark Mode

- ✅ Automático según system preferences
- ✅ Manual toggle disponible (next-themes)
- ✅ Transiciones suaves
- ✅ Colores optimizados para ambos modos

**Configuración en código:**

```tsx
// Usar next-themes
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle
    </button>
  )
}
```

## 📱 Responsividad

```css
Mobile:   < 640px   (full width)
Tablet:   640-1024px (2 columns)
Desktop:  > 1024px   (3+ columns)
```

**Enfoque:** Mobile-first
**Tipografía responsive:** h1 grows de 1.875rem → 2.5rem
**Touch targets:** Mínimo 44x44px

## ♿ Accesibilidad

**WCAG 2.1 AA Compliant:**
- ✅ Contraste ≥ 4.5:1
- ✅ Focus rings visibles
- ✅ Aria-labels en iconos
- ✅ Keyboard navigation completa
- ✅ HTML semántico
- ✅ Soporte prefers-reduced-motion

## 🔧 Personalización

### Cambiar colores primarios

En `src/app/globals.css`:

```css
:root {
  --primary: #tu-color-aqui;
  --primary-light: #variante-clara;
}

[data-theme="dark"] {
  --primary: #tu-color-oscuro;
}
```

### Cambiar tipografía

En `src/app/layout.tsx`:

```tsx
// Importar Google Fonts
import { YourFont } from 'next/font/google'

const font = YourFont({ subsets: ['latin'] })

export default function RootLayout() {
  return (
    <html className={font.className}>
      {/* ... */}
    </html>
  )
}
```

## 📐 Sistema de Espaciado

Basado en múltiplos de 8px (escala 8pt):

```
2px   = 0.125rem
4px   = 0.25rem
8px   = 0.5rem
12px  = 0.75rem
16px  = 1rem
20px  = 1.25rem
24px  = 1.5rem
```

## 🎬 Estados de Componentes

### Botones

| Estado | Cambio |
|--------|--------|
| Default | Color base |
| Hover | Shadow mayor + translate -2px |
| Active | Scale 0.95 |
| Disabled | Opacity 50% |
| Focus | Blue ring 2px |

### Inputs

| Estado | Cambio |
|--------|--------|
| Default | Borde slate-200 |
| Hover | Borde slate-300 |
| Focus | Blue ring + borde blue |
| Error | Borde rojo |
| Disabled | Opacity 50% |

### Cards

| Estado | Cambio |
|--------|--------|
| Default | Shadow base |
| Hover | Shadow lg + translateY -4px |

## 🚀 Archivos Relevantes

```
src/
├── app/globals.css        ← Estilos globales y variables CSS
├── app/layout.tsx         ← Tema setup con next-themes
└── components/
    ├── atoms/Button.tsx   ← Componente botón
    ├── atoms/Input.tsx    ← Componente input
    └── atoms/Card.tsx     ← Componente card
```

## 📊 Resumen

| Métrica | Valor |
|---------|-------|
| Color Palette | 12 colores base + gradientes |
| Font Pairings | 2 (Display + Body) |
| Animation Speeds | 3 (150ms, 200ms, 300ms) |
| Breakpoints | 3 (mobile, tablet, desktop) |
| Min Contrast | 4.5:1 (WCAG AA) |
| Button Variants | 5 |
| Input States | 5 |

---

**Design System Version**: 1.0
**Status**: ✅ Producción Ready
