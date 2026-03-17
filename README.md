# Technical Product Owner Platform

> Plataforma para enriquecer tareas de Notion con análisis técnico de GitLab usando Claude API

**Status**: FASE 1 ✅ COMPLETADA

## 📚 Documentación

**→ [VE A docs/plan/README.md](./docs/plan/README.md) PARA TODA LA DOCUMENTACIÓN**

La documentación está completamente organizada por fases. Empieza por:

1. **[docs/plan/README.md](./docs/plan/README.md)** - Índice maestro
2. **[docs/plan/fase-0-diseño/00-STATUS.md](./docs/plan/fase-0-diseño/00-STATUS.md)** - Estado del proyecto
3. **[docs/plan/fase-1-setup/01-PROGRESS.md](./docs/plan/fase-1-setup/01-PROGRESS.md)** - FASE 1 checklist

## 🚀 Quick Start

```bash
# Instalar dependencias
pnpm install

# Iniciar desarrollo (Turbopack)
pnpm dev

# Correr tests
pnpm test

# Build producción
pnpm build
```

## 📁 Estructura

```
src/
├── app/              (Next.js 16 app directory)
├── components/       (Atomic Design)
│   ├── atoms/       (5 custom atoms)
│   ├── molecules/   (Ready for Phase 2)
│   ├── organisms/   (Ready for Phase 3)
│   ├── templates/   (Ready for Phase 4)
│   └── ui/          (18 shadcn/ui components)
├── hooks/           (5 custom hooks)
├── stores/          (5 Zustand stores)
└── i18n/            (ES/EN translations)

docs/
└── plan/            (📖 Documentación por fases)
    ├── fase-0-diseño/       (✅ Diseño completo)
    ├── fase-1-setup/        (✅ Setup base completado)
    ├── fase-2-molecules/    (⏳ Próxima)
    └── fase-3-8/            (⏳ Futuro)
```

## 🛠 Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Build**: Turbopack (<3s hot reload)
- **UI**: shadcn/ui (19 components) + 5 custom atoms
- **State**: Zustand (5 stores)
- **i18n**: next-intl (ES, EN)
- **Themes**: next-themes (dark/light)
- **Testing**: Vitest + Testing Library
- **Database**: Supabase PostgreSQL
- **AI**: Claude API (extensible)

## ✅ FASE 1 Completada

- ✅ 18 componentes UI
- ✅ 5 custom atoms
- ✅ 5 Zustand stores
- ✅ 5 custom hooks
- ✅ 43+ test cases
- ✅ Dark mode + i18n
- ✅ Responsive design
- ✅ Turbopack verificado

**[→ Ver detalles de FASE 1](./docs/plan/fase-1-setup/02-SUMMARY.md)**

## 📖 Leer Documentación

- **Diseño completo**: [docs/plan/fase-0-diseño/](./docs/plan/fase-0-diseño/)
- **Implementación FASE 1**: [docs/plan/fase-1-setup/](./docs/plan/fase-1-setup/)
- **Próximas fases**: [docs/plan/](./docs/plan/)
