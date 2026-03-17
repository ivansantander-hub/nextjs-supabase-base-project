# 🆕 Requisitos Adicionales Críticos

Estos requisitos fueron agregados después del diseño inicial y **deben ser integrados en toda la arquitectura**.

---

## 1. 🌓 Dark Mode + Light Mode

### Requisito
- Soporte completo para **tema claro y oscuro**
- Cambio dinámico sin recargar página
- Persistencia de preferencia del usuario en BD
- Respeta preferencia del SO (prefers-color-scheme)

### Impacto en Arquitectura

**Frontend**:
- Usar **CSS variables** (no valores hardcodeados)
- Implementar Context de tema + provider global
- Herramienta: `next-themes` (recomendado) o custom
- Design System debe tener colores duales (light/dark)

**Ejemplo de estructura**:
```typescript
// contexts/ThemeContext.ts
export const themes = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    primary: '#2563eb',
    // ...
  },
  dark: {
    bg: '#0f172a',
    text: '#f1f5f9',
    primary: '#3b82f6',
    // ...
  }
}
```

**BD (Supabase)**:
- Campo `theme_preference` en tabla `users` (light | dark | auto)
- Cargar en primer render

**CSS**:
```css
:root[data-theme="light"] { --bg: #fff; }
:root[data-theme="dark"] { --bg: #0f172a; }
body { background: var(--bg); }
```

**Decisión**: Usar `next-themes` + Tailwind `dark:` classes (más limpio)

---

## 2. 🌍 Multilanguage (i18n)

### Requisito
- Soporte para múltiples idiomas (mínimo: ES, EN)
- Cambio dinámico sin recargar
- Persistencia en BD + localStorage
- URLs con locale: `/es/tasks`, `/en/tasks`

### Impacto en Arquitectura

**Frontend**:
- Librería: **next-intl** (recomendado para Next.js 16) o i18next
- Estructura de carpetas:
```
src/
├── i18n/
│   ├── en.json
│   ├── es.json
│   └── config.ts
└── app/
    ├── [locale]/
    │   ├── tasks/
    │   ├── login/
    │   └── layout.tsx
```

**Traducción de contenido**:
- Strings en archivos `.json`
- Componentes use hook: `const t = useTranslations()`
- Dinámico: cambio de idioma → re-render

**BD**:
- Campo `language_preference` en tabla `users` (es, en)
- Cargar en context global

**API Backend**:
- Endpoint `GET /api/auth/me` → incluye `language`
- Mensajes de error en idioma del usuario
- Documentación de APIs multiidioma

**Decisión**: next-intl + JSON files + segment [locale] en URL

---

## 3. 📱 Responsive Design (Desktop, Tablet, Mobile)

### Requisito
- **Desktop-first** development
- Tablet: responsive adaptationes
- **Mobile**: full mobile experience (NO se requiere app nativa)
- Breakpoints: 640px (tablet), 1024px (desktop)

### Impacto en Arquitectura

**Frontend**:
- Usar **Tailwind CSS** (ya incluido)
- Breakpoints: sm (640), md (1024)
- Mobile-first CSS pero orden desktop-first en desarrollo
- Testing en 3 viewports

**Cambios de layout por viewport**:
```jsx
// En desktop: chat lateral (40% width)
// En tablet: chat collapsible
// En mobile: chat fullscreen modal
```

**Componentes responsive**:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

**Consideraciones Mobile**:
- Touch targets: mínimo 44x44px
- No hover (usar active/focus)
- Orientación portrait + landscape
- Input handling (teclado virtual)

**Testing**:
- Responsive testing en Chrome DevTools
- Real devices (si es posible)
- Viewport: 375px (mobile), 768px (tablet), 1440px (desktop)

**Decisión**: Tailwind responsive + mobile-first CSS + testing en 3 viewports

---

## 4. ⚡ Turbopack Siempre Activo

### Requisito
- Usar **Turbopack** (compilador de Next.js) en dev
- NO usar swc (legacy)
- Performance dev: <1s hot reload

### Impacto en Arquitectura

**next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {}, // Activo en dev
  },
};
module.exports = nextConfig;
```

**package.json**:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  }
}
```

**Performance targets**:
- Dev server start: <3s
- Hot reload: <1s
- Build: <30s

**Verificación**:
```bash
npm run dev
# Output debe mostrar: "compiled with turbopack"
```

**Decisión**: Turbopack por defecto, NO desactivar

---

## 5. 🤖 Arquitectura de Modelos Abiertos (No Claude-only)

### Requisito
- **Abstracción completa** de proveedor de IA
- Soportar: Claude, OpenAI, Gemini (Google), LLaMA, otros
- Cambio de modelo sin cambio de código
- Multi-modelo: usar diferentes modelos para diferentes tareas

### Impacto en Arquitectura

**Backend**: Service Layer Pattern

```typescript
// services/ai/AIProvider.ts (interfaz abstracta)
interface IAIProvider {
  enrich(task: Task, context: Context): Promise<EnrichedTask>;
  chat(messages: Message[]): Promise<string>;
  getModels(): Promise<Model[]>;
}

// services/ai/providers/ClaudeProvider.ts
class ClaudeProvider implements IAIProvider { ... }

// services/ai/providers/OpenAIProvider.ts
class OpenAIProvider implements IAIProvider { ... }

// services/ai/providers/GeminiProvider.ts
class GeminiProvider implements IAIProvider { ... }

// services/ai/AIFactory.ts
export function createAIProvider(provider: string): IAIProvider {
  switch(provider) {
    case 'claude': return new ClaudeProvider();
    case 'openai': return new OpenAIProvider();
    case 'gemini': return new GeminiProvider();
    default: throw new Error(`Unknown provider: ${provider}`);
  }
}
```

**Configuración**:
```typescript
// config/ai.config.ts
export const AI_CONFIG = {
  defaultProvider: 'claude', // Configurable
  providers: {
    claude: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-opus-4-6',
      temperature: 0.7,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo',
      temperature: 0.7,
    },
    gemini: {
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-pro',
      temperature: 0.7,
    },
  },
};
```

**Endpoints**:
```typescript
// pages/api/ai/enrich.ts
const provider = createAIProvider(req.body.provider || AI_CONFIG.defaultProvider);
const enriched = await provider.enrich(task, context);
```

**BD (Supabase)**:
```sql
CREATE TABLE ai_providers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider_name VARCHAR(50), -- 'claude', 'openai', 'gemini'
  api_key TEXT ENCRYPTED,
  model VARCHAR(100),
  is_active BOOLEAN,
  created_at TIMESTAMP
);
```

**Multi-modelo por tarea**:
```typescript
// Algunos modelos para análisis ligeros, otros para heavy-lifting
const enrichmentModel = AI_CONFIG.providers.openai; // Rápido
const completionModel = AI_CONFIG.providers.claude; // Robusto
```

**Fallback**:
```typescript
// Si primary provider falla, usar fallback
try {
  return await primaryProvider.enrich(...);
} catch (error) {
  return await fallbackProvider.enrich(...);
}
```

**Streaming**:
- Soportar streaming de respuestas de todos los providers
- Adaptar formato de streaming a cliente

**Testing**:
- Mock providers para testing
- Tests con múltiples modelos

**Decisión**:
- Abstracción completa (interface + factory pattern)
- Default: Claude
- Extensible: agregar nuevos providers sin cambiar core
- Config-driven: cambiar provider por env variable

---

## 6. 📊 Integración con Otros Servicios

### Impacto

**Notion API**:
- Ya está (no cambios)

**GitLab API + MCPs**:
- Ya está (no cambios)

**Servicios de IA nuevos**:
- Cada nuevo provider es un archivo nuevo
- No afecta código existente
- Solo agregar a factory y config

---

## ✅ Checklist de Implementación

### Dark Mode
- [ ] Setup `next-themes`
- [ ] CSS variables en design system
- [ ] Tailwind `dark:` classes
- [ ] Context/provider global
- [ ] BD: campo `theme_preference`
- [ ] Testing: dark/light mode

### Multilanguage
- [ ] Setup `next-intl`
- [ ] Archivos de traducción (ES, EN)
- [ ] Estructura [locale] en URLs
- [ ] Context global de idioma
- [ ] BD: campo `language_preference`
- [ ] Testing: i18n

### Responsive
- [ ] Tailwind breakpoints
- [ ] Mobile-first CSS approach
- [ ] Testing en 3 viewports
- [ ] Touch-friendly (44x44px targets)
- [ ] Testing: desktop, tablet, mobile

### Turbopack
- [ ] next.config.js: turbopack enabled
- [ ] package.json: `next dev --turbopack`
- [ ] Verificar hot reload <1s
- [ ] CI/CD: usar turbopack en builds

### Modelos Abiertos
- [ ] Interface IAIProvider
- [ ] ClaudeProvider (default)
- [ ] OpenAIProvider
- [ ] GeminiProvider
- [ ] AIFactory pattern
- [ ] Config-driven provider selection
- [ ] BD: tabla `ai_providers`
- [ ] Tests con múltiples providers
- [ ] Streaming adapters

---

## 📋 Documentos a Actualizar

1. `01-ARQUITECTURA-GENERAL.md` - Agregar secciones de dark mode, i18n, modelos
2. `06-FRONTEND-ARQUITECTURA.md` - Detallar Tailwind dark mode, next-intl
3. `02-BACKEND-ARQUITECTURA.md` - Agregar service layer de IA, providers
4. `11-REFERENCIA-RAPIDA.md` - Actualizar stack con next-themes, next-intl, providers

---

## 🎯 Impacto General

| Aspecto | Impacto | Esfuerzo |
|---------|---------|----------|
| Dark Mode | Frontend + BD | Bajo |
| i18n | Frontend + Backend + URLs | Medio |
| Responsive | Frontend + Testing | Bajo |
| Turbopack | Config + Performance | Mínimo |
| Modelos Abiertos | Backend + Config + DB | Alto |

**Total Impacto**: Arquitectura debe ser revisada, pero todos son cambios additive (no requieren refactor major).

---

**Acción siguiente**: El equipo debe integrar estos requisitos en:
- Arquitectura general
- Diseño frontend
- Diseño backend

