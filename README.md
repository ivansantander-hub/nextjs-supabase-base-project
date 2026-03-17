# Next.js 16 + Supabase Boilerplate

Un boilerplate minimalista y moderno para construir aplicaciones con **Next.js 16**, **Supabase Authentication** y **Tailwind CSS**.

## 🚀 Características

- ✅ **Next.js 16** con App Router y Turbopack (hot reload < 3s)
- ✅ **Autenticación Supabase** integrada (email/password, social login ready)
- ✅ **TypeScript** completo
- ✅ **Tailwind CSS 4** + sistema de diseño limpio
- ✅ **Internacionalización** (ES/EN) con `next-intl`
- ✅ **Dark Mode** con `next-themes`
- ✅ **Estado global** con Zustand (5 stores preconfigurados)
- ✅ **Componentes reutilizables** (atoms, molecules, con shadcn/ui)
- ✅ **Testing** (Vitest + Testing Library)
- ✅ **Responsive Design** mobile-first

## 📦 Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Build** | Turbopack |
| **Estilos** | Tailwind CSS 4, next-themes |
| **UI** | shadcn/ui (18+ componentes) |
| **Estado** | Zustand |
| **i18n** | next-intl (ES, EN) |
| **Base de datos** | Supabase PostgreSQL |
| **Auth** | Supabase Auth |
| **Testing** | Vitest + Testing Library |

## ⚡ Quick Start

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔐 Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia las credenciales a `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. Las tablas y funciones de autenticación se sincronizarán automáticamente

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Rutas con soporte i18n
│   │   ├── auth/
│   │   │   ├── login/     # Página de login
│   │   │   └── signup/    # Página de registro
│   │   └── dashboard/     # Dashboard (protegido)
│   └── globals.css        # Estilos globales
│
├── components/
│   ├── atoms/             # Componentes pequeños (Button, Input, etc.)
│   ├── molecules/         # Componentes compuestos (Forms, etc.)
│   ├── organisms/         # Componentes complejos
│   ├── templates/         # Layouts y templates
│   └── ui/               # shadcn/ui components
│
├── hooks/                 # React hooks personalizados
├── stores/                # Zustand stores (auth, user, etc.)
├── lib/                   # Utilidades y helpers
├── types/                 # TypeScript types y interfaces
└── i18n/                  # Traducciones (ES, EN)
```

## 🛠 Desarrollo

```bash
# Hot reload con Turbopack (desarrollo)
pnpm dev

# Build optimizado
pnpm build

# Correr en producción
pnpm start

# Tests
pnpm test
pnpm test:ui          # Interfaz visual
pnpm test:coverage    # Coverage report

# Linting
pnpm lint
```

## 🎨 Diseño

- **Tipografía**: Playfair Display (headings) + Sora (body)
- **Colores**: Sistema de 12 colores + gradientes
- **Animaciones**: Transiciones suaves 150ms-300ms
- **Responsivo**: Mobile-first (640px, 1024px breakpoints)
- **Accesibilidad**: WCAG AA+ compliant

### Temas disponibles

- 🌙 Dark Mode automático
- ☀️ Light Mode
- 🔄 Sistema automático según preferencias del SO

## 🔑 Variables de Entorno

Copia `.env.example` a `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Opcional - Otros servicios
NODE_ENV=development
```

## 📖 Documentación

- **Componentes**: Ver `src/components/` para ejemplos
- **Hooks**: Ver `src/hooks/` para utilidades
- **Autenticación**: Revisar `src/lib/auth.ts`
- **Variables de CSS**: `src/app/globals.css`

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Deployment automático desde GitHub
vercel --prod
```

### Otros proveedores

```bash
# Build production
pnpm build

# Start server
pnpm start
```

**Variables de entorno requeridas en producción:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🧪 Testing

```bash
# Correr todos los tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test:coverage
```

## ✨ Próximos Pasos

Para usar este boilerplate:

1. **Personaliza el branding**:
   - Actualiza logos en `public/`
   - Modifica colores en `src/app/globals.css`
   - Ajusta tipografía en `src/app/layout.tsx`

2. **Configura Supabase Auth**:
   - Activa social login en dashboard
   - Configura email templates
   - Añade reglas de Row Level Security (RLS)

3. **Extiende funcionalidad**:
   - Crea nuevas rutas en `src/app/[locale]/`
   - Añade stores en `src/stores/`
   - Crea componentes en `src/components/`

4. **Deploy**:
   - Conecta tu repo a Vercel
   - Configura variables de entorno
   - Haz deploy de tu aplicación

## 📝 Licencia

MIT

## 🤝 Contribuciones

Este es un boilerplate base. Siéntete libre de modificarlo para tus necesidades.

---

**Última actualización**: 2026-03-17
**Status**: ✅ Listo para usar
