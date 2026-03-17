# Cambios en Arquitectura por Requisitos Adicionales

**Fecha**: 2026-03-16
**Responsable**: Arquitecto de Software
**Impacto**: Integraciones transversales en Frontend, Backend y Base de Datos

---

## Resumen Ejecutivo

Se han integrado **5 requisitos críticos adicionales** en la arquitectura. No requieren refactor major, son cambios **aditivos**:

| Requisito | Impacto | Esfuerzo | Prioridad |
|-----------|---------|----------|-----------|
| 🌓 Dark Mode | Frontend + BD | Bajo (3-5h) | Alta |
| 🌍 Multilanguage | Frontend + Backend + URLs | Medio (8-12h) | Alta |
| 📱 Responsive | Frontend + Testing | Bajo (2-4h) | Alta |
| ⚡ Turbopack | Config + Performance | Mínimo (1h) | Media |
| 🤖 Multi-AI | Backend + Config + BD | Alto (20-30h) | Alta |

**Total Esfuerzo**: ~35-55 horas de desarrollo

---

## 1. Dark Mode + Light Mode

### Cambios Requeridos

#### Frontend
```
- Setup: npm install next-themes
- Layout root: Agregar <ThemeProvider>
- Tailwind config: Enable dark mode (ya incluido)
- Componentes: Usar dark: prefix en Tailwind classes
- Storage: Persistencia en localStorage (next-themes lo maneja)
```

#### Base de Datos
```sql
-- Nuevo campo en user_profiles
ALTER TABLE user_profiles ADD COLUMN theme_preference VARCHAR(10) DEFAULT 'auto';
-- Valores: 'light', 'dark', 'auto'
```

#### Componentes a Actualizar
```
- src/app/layout.tsx: Agregar ThemeProvider
- src/components/*: Agregar dark: classes
- src/styles/globals.css: CSS variables para dark mode (opcional)
```

### Checklist Implementación
- [ ] `npm install next-themes`
- [ ] Configurar `next-themes` en layout root
- [ ] Auditar todos los colores de componentes → agregar `dark:` variants
- [ ] BD migration: agregar `theme_preference` a `user_profiles`
- [ ] API GET `/api/auth/me` → retorna `theme_preference`
- [ ] API POST `/api/settings/theme` → actualiza preferencia
- [ ] Testing: verificar dark mode en todos los componentes

---

## 2. Multilanguage (i18n)

### Cambios Requeridos

#### Frontend - Estructura de Carpetas
```
src/
├── i18n/
│   ├── messages/
│   │   ├── es.json          # Español
│   │   ├── en.json          # English
│   │   └── index.ts         # Export
│   ├── request.ts           # getRequestConfig
│   └── routing.ts           # defineRouting
├── app/
│   └── [locale]/            # ⭐ Nueva estructura
│       ├── (auth)/
│       │   ├── login/
│       │   ├── signup/
│       │   └── layout.tsx
│       ├── (main)/
│       │   ├── dashboard/
│       │   ├── tasks/
│       │   └── layout.tsx
│       └── layout.tsx
└── middleware.ts            # Routing de locales
```

#### Setup next-intl
```bash
npm install next-intl
```

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es'
});
```

```typescript
// middleware.ts
import { createNavigationMiddleware } from 'next-intl/next';
import { routing } from './i18n/routing';

export default createNavigationMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|.*\\..*).)*']
};
```

#### Uso en Componentes
```typescript
// Server Components
import { getTranslations } from 'next-intl/server';

export default async function TaskPage() {
  const t = getTranslations('tasks');
  return <h1>{t('title')}</h1>;
}

// Client Components
'use client';
import { useTranslations } from 'next-intl';

export function TaskCard() {
  const t = useTranslations('tasks');
  return <div>{t('card_title')}</div>;
}
```

#### Base de Datos
```sql
-- Nuevo campo en user_profiles
ALTER TABLE user_profiles ADD COLUMN language_preference VARCHAR(5) DEFAULT 'es';
-- Valores: 'es', 'en'
```

#### Backend
```typescript
// API GET /api/auth/me → incluye language_preference
// API POST /api/settings/language → cambia idioma
// Todos los endpoints retornan mensajes en idioma del usuario
```

#### Archivos de Traducción
```json
// i18n/messages/es.json
{
  "navigation": {
    "tasks": "Tareas",
    "settings": "Configuración"
  },
  "tasks": {
    "title": "Mis Tareas",
    "card_title": "Detalles de la Tarea",
    "enrich": "Enriquecer",
    "approve": "Aprobar"
  },
  "errors": {
    "not_found": "Tarea no encontrada",
    "unauthorized": "No autorizado"
  }
}

// i18n/messages/en.json
{
  "navigation": {
    "tasks": "Tasks",
    "settings": "Settings"
  },
  "tasks": {
    "title": "My Tasks",
    "card_title": "Task Details",
    "enrich": "Enrich",
    "approve": "Approve"
  },
  "errors": {
    "not_found": "Task not found",
    "unauthorized": "Unauthorized"
  }
}
```

### Checklist Implementación
- [ ] `npm install next-intl`
- [ ] Crear estructura `i18n/messages/es.json`, `en.json`
- [ ] Setup `routing.ts` y `middleware.ts`
- [ ] Refactorizar URLs: `app/(main)` → `app/[locale]/(main)`
- [ ] Reemplazar strings hardcodeados con `useTranslations()`
- [ ] BD migration: agregar `language_preference` a `user_profiles`
- [ ] API `/api/auth/me` → retorna `language_preference`
- [ ] API POST `/api/settings/language` → actualiza idioma
- [ ] Testing: verificar ambos idiomas en todos los flujos

---

## 3. Responsive Design

### Cambios Requeridos

#### Frontend - CSS Responsive
```typescript
// Usar Tailwind breakpoints: sm (640), md (1024), lg (1280)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 col | Tablet: 2 cols | Desktop: 3 cols */}
</div>

// Chat responsive (ejemplo)
<div className="flex flex-col lg:flex-row">
  <div className="w-full lg:w-2/3">{/* Task */}</div>
  <div className="w-full lg:w-1/3 hidden lg:block">{/* Chat */}</div>
</div>
```

#### Consideraciones Mobile
```
- Touch targets: 44x44px mínimo
- No usar :hover (usar :active, :focus)
- Manejar teclado virtual
- Orientación portrait y landscape
- Viewport meta tag (ya en layout.tsx)
```

#### Testing
```
Viewports a probar:
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1440px width
```

### Checklist Implementación
- [ ] Auditar todos los componentes → agregar responsive classes
- [ ] Reemplazar valores hardcodeados con Tailwind breakpoints
- [ ] Mobile: verificar touch targets (44x44px)
- [ ] Mobile: reemplazar :hover con :active/:focus
- [ ] Testing: 375px, 768px, 1440px viewports
- [ ] Testing: orientación portrait y landscape
- [ ] Verificar formularios en mobile (teclado virtual)

---

## 4. Turbopack

### Cambios Requeridos

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {}, // Activo en dev
  },
};
module.exports = nextConfig;
```

#### package.json
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  }
}
```

#### Verificación
```bash
npm run dev
# Output debe mostrar: "compiled with turbopack"
# Hot reload debe ser <1s
```

### Checklist Implementación
- [ ] Actualizar `next.config.js` con turbopack
- [ ] Actualizar `package.json` script `dev`
- [ ] Verificar: `npm run dev` muestra turbopack
- [ ] Verificar: hot reload <1s
- [ ] CI/CD: agregar flag `--turbopack` en builds

---

## 5. Multi-AI Architecture (Highest Impact)

### Cambios Requeridos

#### Backend - Nuevos Archivos
```
lib/ai/
├── types/
│   └── IAIProvider.ts         # Interface
├── providers/
│   ├── ClaudeProvider.ts
│   ├── OpenAIProvider.ts
│   ├── GeminiProvider.ts
│   └── MockProvider.ts        # Para testing
├── AIFactory.ts               # Factory function
├── config.ts                  # AI_CONFIG
└── adapters/
    ├── ClaudeAdapter.ts       # Normalizar respuestas
    ├── OpenAIAdapter.ts
    └── GeminiAdapter.ts
```

#### Interface IAIProvider
```typescript
interface IAIProvider {
  enrich(task: Task, context: Context): Promise<EnrichedTask>;
  chat(messages: Message[]): Promise<string>;
  refine(enrichment: Enrichment, prompt: string): Promise<string>;
  getModels(): Promise<Model[]>;
  stream(messages: Message[]): AsyncIterator<string>;
}
```

#### Providers a Implementar
```typescript
// 1. ClaudeProvider (default)
// 2. OpenAIProvider
// 3. GeminiProvider
// Cada uno implementa IAIProvider
```

#### AI Factory
```typescript
export function createAIProvider(providerName: string): IAIProvider {
  switch(providerName) {
    case 'claude': return new ClaudeProvider();
    case 'openai': return new OpenAIProvider();
    case 'gemini': return new GeminiProvider();
    default: throw new Error(`Unknown provider: ${providerName}`);
  }
}
```

#### Configuración
```typescript
export const AI_CONFIG = {
  defaultProvider: process.env.AI_DEFAULT_PROVIDER || 'claude',
  providers: {
    claude: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      models: {
        draft: 'claude-3-5-haiku-20241022',
        standard: 'claude-3-5-sonnet-20241022',
        final: 'claude-opus-4-20250514'
      },
      temperature: 0.7,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      models: {
        draft: 'gpt-4-mini',
        standard: 'gpt-4-turbo',
        final: 'gpt-4'
      },
      temperature: 0.7,
    },
    gemini: {
      apiKey: process.env.GOOGLE_API_KEY,
      models: {
        draft: 'gemini-1.5-flash',
        standard: 'gemini-1.5-pro',
        final: 'gemini-2.0-pro'
      },
      temperature: 0.7,
    },
  },
};
```

#### Base de Datos
```sql
-- Nueva tabla ai_providers
CREATE TABLE ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  provider_name VARCHAR(50) NOT NULL, -- 'claude', 'openai', 'gemini'
  api_key TEXT NOT NULL, -- Encrypted!
  is_active BOOLEAN DEFAULT true,
  model VARCHAR(100),
  config JSONB,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, provider_name)
);

-- Agregar campos a interactions
ALTER TABLE interactions ADD COLUMN ai_provider VARCHAR(50);
ALTER TABLE interactions ADD COLUMN ai_model VARCHAR(100);
ALTER TABLE interactions ADD COLUMN token_usage INT;

-- Agregar campo a enrichments
ALTER TABLE enrichments ADD COLUMN ai_provider VARCHAR(50);
ALTER TABLE enrichments ADD COLUMN ai_model VARCHAR(100);
```

#### API Routes Actualizado
```typescript
// app/api/enrichment/process/route.ts
export async function POST(req: Request) {
  const { taskId, provider } = await req.json();

  const providerName = provider || AI_CONFIG.defaultProvider;
  const aiProvider = createAIProvider(providerName);

  // Log qué provider se usó
  const enriched = await aiProvider.enrich(task, context);

  return Response.json(enriched);
}

// app/api/enrichment/[id]/stream/route.ts
export async function GET(req: Request, { params }) {
  const { provider } = await req.json();

  const aiProvider = createAIProvider(provider || AI_CONFIG.defaultProvider);

  for await (const chunk of await aiProvider.stream([...])) {
    yield chunk;
  }
}
```

#### Frontend - Selector de Modelo
```typescript
// components/molecules/ModelSelector.tsx
'use client';
import { AI_CONFIG } from '@/lib/ai/config';

export function ModelSelector({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {Object.entries(AI_CONFIG.providers).map(([name, config]) => (
        <optgroup key={name} label={name.toUpperCase()}>
          {Object.entries(config.models).map(([tier, model]) => (
            <option key={model} value={model}>
              {name} - {tier}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
```

#### Fallback y Error Handling
```typescript
async function enrichWithFallback(task, context, primaryProvider, fallback) {
  try {
    const provider = createAIProvider(primaryProvider);
    return await provider.enrich(task, context);
  } catch (error) {
    if (fallback) {
      const fallbackProvider = createAIProvider(fallback);
      return await fallbackProvider.enrich(task, context);
    }
    throw error;
  }
}
```

### Checklist Implementación
- [ ] Crear `lib/ai/types/IAIProvider.ts` (interface)
- [ ] Crear `lib/ai/providers/ClaudeProvider.ts`
- [ ] Crear `lib/ai/providers/OpenAIProvider.ts`
- [ ] Crear `lib/ai/providers/GeminiProvider.ts`
- [ ] Crear `lib/ai/providers/MockProvider.ts` (testing)
- [ ] Crear `lib/ai/AIFactory.ts`
- [ ] Crear `lib/ai/config.ts`
- [ ] Refactorizar API routes → usar factory pattern
- [ ] BD migration: tabla `ai_providers` + campos en `interactions` y `enrichments`
- [ ] Frontend: componente ModelSelector
- [ ] Implementar fallback logic
- [ ] Testing: tests con mock providers
- [ ] Streaming: adaptar streaming de cada provider

---

## Matriz de Impacto Detallada

### Dark Mode
| Componente | Cambios | Complejidad |
|------------|---------|-------------|
| Frontend | next-themes + dark: classes | Baja |
| Backend | GET /api/auth/me → theme_preference | Baja |
| BD | +1 columna user_profiles | Mínima |
| Testing | Verificar dark/light | Baja |

### Multilanguage
| Componente | Cambios | Complejidad |
|------------|---------|-------------|
| Frontend | next-intl + [locale] routing | Media |
| Backend | Mensajes en idioma usuario | Baja |
| BD | +1 columna user_profiles | Mínima |
| Testing | 2 idiomas en todos los flujos | Media |

### Responsive
| Componente | Cambios | Complejidad |
|------------|---------|-------------|
| Frontend | Tailwind breakpoints + classes | Baja |
| Backend | N/A | N/A |
| BD | N/A | N/A |
| Testing | 3 viewports | Baja |

### Turbopack
| Componente | Cambios | Complejidad |
|------------|---------|-------------|
| Frontend | next.config.js + package.json | Mínima |
| Backend | N/A | N/A |
| BD | N/A | N/A |
| Testing | Verificar hot reload | Mínima |

### Multi-AI
| Componente | Cambios | Complejidad |
|------------|---------|-------------|
| Frontend | ModelSelector + UI | Baja |
| Backend | AIFactory + Providers | Alta |
| BD | +tabla, +4 columnas | Media |
| Testing | Mock providers | Media |

---

## Orden Recomendado de Implementación

1. **Turbopack** (1h) - Sin dependencias, mejora DX inmediatamente
2. **Dark Mode** (5h) - Frontend independent
3. **Responsive** (3h) - Frontend independent
4. **Multilanguage** (10h) - Depende de estructura de rutas
5. **Multi-AI** (30h) - Depende de Backend + BD, refactor significativo

**Total**: ~50 horas

---

## Environment Variables Nuevas

```bash
# .env.local

# AI Providers
ANTHROPIC_API_KEY=sk-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...

# AI Configuration
AI_DEFAULT_PROVIDER=claude # claude, openai, gemini

# Feature Flags
ENABLE_DARK_MODE=true
ENABLE_MULTILANGUAGE=true
ENABLE_MULTI_AI=true
```

---

## Conclusión

Los 5 requisitos adicionales se integran **sin refactor major**:

✅ **Dark Mode**: 5h, bajo riesgo, alta prioridad
✅ **Multilanguage**: 10h, medio riesgo, alta prioridad
✅ **Responsive**: 3h, bajo riesgo, alta prioridad
✅ **Turbopack**: 1h, ningún riesgo, inmediata
✅ **Multi-AI**: 30h, medio riesgo, inversión en futuro

**No** requieren cambios arquitectónicos fundamentales, solo extensiones de patrones existentes.

Documento actualizado: **01-ARQUITECTURA-GENERAL.md**
