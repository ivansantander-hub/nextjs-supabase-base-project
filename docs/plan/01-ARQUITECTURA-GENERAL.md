# Arquitectura del Sistema - Product Owner Task Enrichment

**Versión:** 1.0
**Fecha:** 2026-03-16
**Responsable:** Arquitecto de Software

---

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Requisitos Adicionales Críticos](#requisitos-adicionales-críticos)
3. [Componentes Principales](#componentes-principales)
4. [Arquitectura de Capas](#arquitectura-de-capas)
5. [Flujo de Datos](#flujo-de-datos)
6. [Patrones de Diseño](#patrones-de-diseño)
7. [Manejo de Concurrencia](#manejo-de-concurrencia)
8. [Cumplimiento ACID](#cumplimiento-acid)
9. [Decisiones Clave](#decisiones-clave)
10. [Trade-offs](#trade-offs)

---

## Visión General

Sistema web full-stack que enriquece tareas técnicas de un Product Owner mediante:

- **Filtrado inteligente** de tareas en Notion por sprint, estado y tags
- **Enriquecimiento automático** usando Claude API + contexto de GitLab
- **Almacenamiento revisable** en Supabase con snapshots de cada iteración
- **Chat interactivo** para ajustes iterativos (MCPs de GitLab y Notion)
- **Sincronización bidireccional** con Notion con auditoría completa

### Stack Tecnológico (Actualizado con Requisitos Adicionales)

```
Frontend:        Next.js 16 + React 19 + TypeScript + TailwindCSS
                 ⭐ Turbopack (compilador por defecto, <1s hot reload)
                 ⭐ next-themes (Dark/Light mode dinámico)
                 ⭐ next-intl (Multilanguage: ES, EN)
                 ⭐ Responsive Design (Mobile-first, Tablet, Desktop)

Backend:         Next.js API Routes (Serverless) + Edge Middleware
                 ⭐ AIFactory Pattern (Multi-modelo: Claude, OpenAI, Gemini)

Base de Datos:   Supabase (PostgreSQL con RLS + Real-time)
                 ⭐ Nueva tabla: ai_providers (multi-modelo config)
                 ⭐ Nueva tabla: user_preferences (tema, idioma)

IA:              ⭐ Multi-modelo (abstraído por interface)
                 - Claude (default - Opus/Sonnet/Haiku)
                 - OpenAI (GPT-4, GPT-4-turbo)
                 - Google Gemini (Pro, Pro Vision)
                 - Extensible para otros providers

Integraciones:   Notion API + MCP, GitLab API + MCP
Autenticación:   Supabase Auth (OAuth + Email)
```

---

## Requisitos Adicionales Críticos

Estos 5 requisitos han sido integrados en la arquitectura completa:

### 1. 🌓 Dark Mode + Light Mode

**Implementación**:
- Librería: `next-themes` (recomendada)
- CSS: Tailwind `dark:` classes + CSS variables
- Context global: `ThemeProvider` en layout root
- Base de datos: Campo `theme_preference` en `user_profiles` (light | dark | auto)
- Cambio dinámico: Sin recargar página, persistencia inmediata

```typescript
// components/ThemeProvider.tsx
'use client';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

// Uso en componentes:
// className="bg-white dark:bg-slate-900 text-black dark:text-white"
```

**Impacto en Base de Datos**:
```sql
ALTER TABLE user_profiles ADD COLUMN theme_preference VARCHAR(10) DEFAULT 'auto';
-- Valores: 'light', 'dark', 'auto' (respeta prefers-color-scheme del SO)
```

### 2. 🌍 Multilanguage (i18n) - ES, EN

**Implementación**:
- Librería: `next-intl` (nativa para Next.js 16)
- Estructura de URLs: `/es/tasks`, `/en/tasks` (con segment `[locale]`)
- Archivos de traducción: `src/i18n/messages/es.json`, `src/i18n/messages/en.json`
- Hook en componentes: `const t = useTranslations()`
- Base de datos: Campo `language_preference` en `user_profiles` (es | en)

```typescript
// app/[locale]/layout.tsx
import { getTranslations } from 'next-intl/server';

export default async function LocaleLayout({ children, params }) {
  const t = getTranslations();

  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}

// app/[locale]/tasks/page.tsx
'use client';
import { useTranslations } from 'next-intl';

export default function TasksPage() {
  const t = useTranslations('tasks');
  return <h1>{t('title')}</h1>;
}
```

**Backend API**:
- GET `/api/auth/me` incluye `language_preference`
- Mensajes de error en idioma del usuario
- Soporte para cambio dinámico de idioma

**Impacto en Base de Datos**:
```sql
ALTER TABLE user_profiles ADD COLUMN language_preference VARCHAR(5) DEFAULT 'es';
-- Valores: 'es', 'en'
```

### 3. 📱 Responsive Design (Desktop, Tablet, Mobile)

**Implementación**:
- Framework: Tailwind CSS (ya incluido)
- Breakpoints: sm (640px), md (1024px), lg (1280px)
- Enfoque: Mobile-first CSS pero desarrollo desktop-first
- Testing: 3 viewports (375px mobile, 768px tablet, 1440px desktop)

```typescript
// Ejemplo de layout responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 columna | Tablet: 2 columnas | Desktop: 3 columnas */}
</div>

// Chat responsive
<div className="flex flex-col lg:flex-row">
  <div className="w-full lg:w-2/3">
    {/* Task panel - full width en mobile, 2/3 en desktop */}
  </div>
  <div className="w-full lg:w-1/3 hidden lg:block">
    {/* Chat - hidden en mobile, 1/3 en desktop */}
  </div>
</div>
```

**Consideraciones Mobile**:
- Touch targets: mínimo 44x44px
- No usar `hover` (usar `active` o `focus`)
- Teclado virtual handling
- Orientación portrait y landscape

### 4. ⚡ Turbopack - Siempre Activo

**Implementación**:
- next.config.js: `experimental.turbopack: {}`
- package.json: `"dev": "next dev --turbopack"`
- Performance targets: Dev start <3s, Hot reload <1s, Build <30s

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {}, // Activo en dev
    // NO usar swc (legacy)
  },
};
module.exports = nextConfig;
```

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  }
}
```

**Verificación**:
```bash
npm run dev
# Output debe mostrar: "compiled with turbopack"
```

### 5. 🤖 Arquitectura de Modelos Abiertos (Multi-AI)

**Implementación**: Abstracción completa con Factory Pattern

```typescript
// lib/ai/types/IAIProvider.ts
interface IAIProvider {
  enrich(task: Task, context: Context): Promise<EnrichedTask>;
  chat(messages: Message[]): Promise<string>;
  refine(enrichment: Enrichment, prompt: string): Promise<string>;
  getModels(): Promise<Model[]>;
  stream(messages: Message[]): AsyncIterator<string>;
}

// lib/ai/providers/ClaudeProvider.ts
class ClaudeProvider implements IAIProvider {
  async enrich(task, context) { /* Claude API call */ }
  async chat(messages) { /* Claude API call */ }
  // ...
}

// lib/ai/providers/OpenAIProvider.ts
class OpenAIProvider implements IAIProvider {
  async enrich(task, context) { /* OpenAI API call */ }
  async chat(messages) { /* OpenAI API call */ }
  // ...
}

// lib/ai/providers/GeminiProvider.ts
class GeminiProvider implements IAIProvider {
  async enrich(task, context) { /* Gemini API call */ }
  async chat(messages) { /* Gemini API call */ }
  // ...
}

// lib/ai/AIFactory.ts
export function createAIProvider(providerName: string): IAIProvider {
  switch(providerName) {
    case 'claude': return new ClaudeProvider();
    case 'openai': return new OpenAIProvider();
    case 'gemini': return new GeminiProvider();
    default: throw new Error(`Unknown provider: ${providerName}`);
  }
}
```

**Configuración**:
```typescript
// lib/ai/config.ts
export const AI_CONFIG = {
  defaultProvider: 'claude', // Configurable via ENV
  providers: {
    claude: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      models: {
        draft: 'claude-3-5-haiku-20241022',     // Rápido
        standard: 'claude-3-5-sonnet-20241022',  // Balance
        final: 'claude-opus-4-20250514'          // Robusto
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

**Uso en API Routes**:
```typescript
// app/api/enrichment/process/route.ts
export async function POST(req: Request) {
  const { taskId, provider = AI_CONFIG.defaultProvider } = await req.json();

  const aiProvider = createAIProvider(provider);
  const enriched = await aiProvider.enrich(task, gitlabContext);

  return Response.json(enriched);
}
```

**Streaming Multi-Provider**:
```typescript
// Adapter pattern para normalizar streaming
async function streamEnrichment(provider: string, task: Task) {
  const aiProvider = createAIProvider(provider);

  for await (const chunk of await aiProvider.stream([...])) {
    yield chunk; // Normalizado a string
  }
}
```

**Base de Datos - Nueva Tabla**:
```sql
CREATE TABLE ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  provider_name VARCHAR(50) NOT NULL, -- 'claude', 'openai', 'gemini'
  api_key TEXT NOT NULL, -- Encrypted
  is_active BOOLEAN DEFAULT true,
  model VARCHAR(100), -- Modelo preferido para este provider
  config JSONB, -- Temperatura, max_tokens, etc.
  usage_count INT DEFAULT 0, -- Para tracking
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, provider_name)
);

-- Tabla de interacciones para trackear qué modelo se usó
ALTER TABLE interactions ADD COLUMN ai_provider VARCHAR(50);
ALTER TABLE interactions ADD COLUMN ai_model VARCHAR(100);
ALTER TABLE interactions ADD COLUMN token_usage INT;
```

**Fallback y Failover**:
```typescript
async function enrichWithFallback(
  task: Task,
  context: Context,
  primaryProvider: string,
  fallbackProvider?: string
) {
  try {
    const provider = createAIProvider(primaryProvider);
    return await provider.enrich(task, context);
  } catch (error) {
    if (fallbackProvider) {
      logger.warn(`${primaryProvider} failed, trying fallback: ${fallbackProvider}`, error);
      const fallback = createAIProvider(fallbackProvider);
      return await fallback.enrich(task, context);
    }
    throw error;
  }
}
```

**UI para seleccionar modelo**:
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
              {name} - {tier} ({model})
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
```

---

### 1. **Capa de Presentación (Frontend)**

#### Módulos Principales
- **TaskFilterModule**: UI para filtrar tareas de Notion
  - Sprint selector
  - Status filter (To Do, In Progress, Done, etc.)
  - Tags/Labels search
  - Search across task titles and descriptions

- **EnrichmentWorkspace**: Panel central de enriquecimiento
  - Task display (original + metadata)
  - Claude AI response viewer
  - GitLab context panel (MRs, commits, issues)
  - Modification history sidebar

- **InteractiveChat**: Chat para ajustes iterativos
  - Prompt input (supports mentions of @tasks @files)
  - Response streaming (real-time)
  - Context awareness (current task, related items)
  - Attachment support (screenshots, logs)

- **ReviewDatabase**: Interface de Review DB
  - Snapshot timeline
  - Diff viewer
  - Version comparison
  - Snapshot rollback (UI, no actual rollback)

- **ApprovalFlow**: Workflow de aprobación
  - Task summary for sync
  - Changelog viewer
  - Approve/Reject/Request Changes
  - Sync status monitor

#### Estructura de Componentes (Atomic Design)

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button
│   │   ├── Badge
│   │   ├── Icon
│   │   ├── Input
│   │   ├── Label
│   │   └── Tag
│   ├── molecules/
│   │   ├── TaskCard
│   │   ├── FilterBar
│   │   ├── ChatMessage
│   │   ├── SnapshotItem
│   │   └── StatusBadge
│   ├── organisms/
│   │   ├── TaskPanel
│   │   ├── EnrichmentEditor
│   │   ├── ChatInterface
│   │   ├── SnapshotTimeline
│   │   └── ReviewHistory
│   └── templates/
│       ├── MainLayout
│       ├── TaskLayout
│       └── ReviewLayout
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── (main)/
│   │   ├── dashboard/
│   │   ├── tasks/[id]/
│   │   ├── review/
│   │   └── settings/
│   └── api/
│       └── (handled below)
└── lib/
    ├── api/
    ├── hooks/
    ├── utils/
    └── types/
```

### 2. **Capa de API Backend**

#### Endpoints RESTful + Realtime

```
API Routes (Next.js):
├── /api/auth/
│   ├── POST   /login
│   ├── POST   /signup
│   ├── POST   /logout
│   └── GET    /session
├── /api/tasks/
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /sync (pull from Notion)
│   └── POST   /:id/enrich (trigger enrichment)
├── /api/enrichment/
│   ├── POST   /process (main enrichment pipeline)
│   ├── POST   /:id/stream (streaming response)
│   └── POST   /:id/refine (interactive refinement)
├── /api/review/
│   ├── GET    /:taskId/snapshots
│   ├── POST   /:taskId/snapshot
│   ├── GET    /:snapshotId
│   └── POST   /:taskId/approve
├── /api/sync/
│   ├── POST   /notion (push enriched task)
│   ├── GET    /status/:taskId
│   └── POST   /audit
├── /api/gitlab/
│   ├── GET    /context/:taskId (get MRs, commits)
│   └── GET    /file/:path (get file content)
└── /api/integrations/
    ├── GET    /notion/workspaces
    ├── GET    /gitlab/projects
    └── POST   /webhooks/notion (incoming webhooks)
```

#### Características de Backend

- **Server Components** para server-side data fetching
- **API Routes** para operaciones que requieren autenticación
- **Middleware** para validación, rate limiting, logging
- **Streaming** para respuestas largas (Claude API)
- **Webhooks** para sincronización en tiempo real

### 3. **Capa de Datos - Supabase**

#### Tablas Principales

```sql
-- Usuarios y Autenticación (managed by Supabase Auth)
public.user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID (FK to auth.users),
  role ENUM ('owner', 'reviewer', 'viewer'),
  notion_workspace_id VARCHAR,
  gitlab_token_encrypted VARCHAR,
  notion_token_encrypted VARCHAR,
  preferences JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Tareas (snapshot actual de Notion)
public.tasks (
  id UUID PRIMARY KEY,
  notion_task_id VARCHAR UNIQUE,
  title VARCHAR NOT NULL,
  description TEXT,
  status ENUM ('todo', 'in_progress', 'in_review', 'done'),
  sprint VARCHAR,
  tags TEXT[],
  assignee VARCHAR,
  priority INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_sync_at TIMESTAMP,
  INDEX (sprint, status, updated_at)
)

-- Enriquecimientos (current version)
public.enrichments (
  id UUID PRIMARY KEY,
  task_id UUID (FK tasks.id),
  original_task JSONB NOT NULL,
  enriched_content TEXT NOT NULL,
  enrichment_metadata JSONB (claude_model, temperature, prompt_version),
  gitlab_context JSONB (MRs, commits, branches),
  status ENUM ('draft', 'review', 'approved', 'rejected'),
  reviewer_id UUID (FK user_profiles.id),
  review_notes TEXT,
  created_by UUID (FK user_profiles.id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (task_id, status, updated_at)
)

-- Snapshots (auditoría completa)
public.enrichment_snapshots (
  id UUID PRIMARY KEY,
  enrichment_id UUID (FK enrichments.id),
  iteration INT NOT NULL,
  previous_content TEXT,
  current_content TEXT,
  changes_applied JSONB (list of modifications),
  interaction_type ENUM ('ai_generation', 'user_edit', 'chat_refinement'),
  interaction_metadata JSONB (prompt, response, model),
  created_by UUID (FK user_profiles.id),
  created_at TIMESTAMP,
  INDEX (enrichment_id, iteration, created_at)
)

-- Chat/Conversaciones
public.interactions (
  id UUID PRIMARY KEY,
  enrichment_id UUID (FK enrichments.id),
  type ENUM ('user_message', 'ai_response', 'system'),
  user_id UUID (FK user_profiles.id),
  content TEXT NOT NULL,
  metadata JSONB (tokens, latency, model),
  parent_id UUID (FK interactions.id, for threading),
  created_at TIMESTAMP,
  INDEX (enrichment_id, created_at)
)

-- Sincronización con Notion
public.sync_log (
  id UUID PRIMARY KEY,
  enrichment_id UUID (FK enrichments.id),
  action ENUM ('sync_to_notion', 'pull_from_notion', 'conflict'),
  direction ENUM ('inbound', 'outbound'),
  status ENUM ('pending', 'in_progress', 'success', 'failed'),
  source_data JSONB (what was synced),
  result JSONB (success details or error),
  error_message TEXT,
  created_by UUID (FK user_profiles.id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (enrichment_id, created_at, status)
)

-- Auditoría de cambios
public.audit_log (
  id UUID PRIMARY KEY,
  entity_type VARCHAR (tasks, enrichments, user_profiles),
  entity_id UUID,
  action VARCHAR (create, update, delete, approve, reject),
  previous_values JSONB,
  new_values JSONB,
  user_id UUID (FK user_profiles.id),
  ip_address INET,
  user_agent VARCHAR,
  created_at TIMESTAMP,
  INDEX (entity_type, entity_id, created_at, user_id)
)
```

#### Policies RLS (Row Level Security)

```
-- Users solo ven sus propios datos
tasks: SELECT, INSERT, UPDATE (con restricciones)
enrichments: SELECT (owner + reviewers), UPDATE (owner)
snapshots: SELECT (owner + reviewers), INSERT (owner)
audit_log: SELECT (admins only), INSERT (system)
```

#### Índices y Optimizaciones

```sql
-- Performance critical indices
CREATE INDEX idx_tasks_sprint_status ON tasks(sprint, status);
CREATE INDEX idx_enrichments_task_status ON enrichments(task_id, status);
CREATE INDEX idx_snapshots_enrichment_iter ON enrichment_snapshots(enrichment_id, iteration DESC);
CREATE INDEX idx_interactions_enrichment_time ON interactions(enrichment_id, created_at DESC);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id, created_at DESC);

-- Full-text search
CREATE INDEX idx_tasks_search ON tasks USING GIN (to_tsvector('spanish', title || ' ' || description));
```

### 4. **Capa de Integración**

#### Claude API Integration

```typescript
// Flujo de enriquecimiento
1. Fetch task desde Notion
2. Fetch contexto GitLab (MCPs)
3. Build system + user prompts
4. Stream response desde Claude
5. Guardar snapshot en Supabase
6. Show delta a usuario
```

Modelos:
- **Haiku** (draft enrichment, fast iteration)
- **Sonnet** (final review, quality enrichment)
- Token management + caching para prompts comunes

#### Notion Integration (MCP + API)

```
- Pull tasks (filtrado por sprint/status/tags)
- Push enriched content (con versionado)
- Webhooks para cambios en Notion
- Bidirectional sync con conflict resolution
```

#### GitLab Integration (MCP + API)

```
- Context gathering:
  * MRs relevantes (linking to task keywords)
  * Recent commits
  * Branch info
  * File content (para context)
- Linked mentions en enrichment
- Status checks para validación
```

---

## Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTACIÓN (UI)                        │
│  Next.js Components + React Server Components              │
│  Atomic Design: Atoms → Molecules → Organisms → Templates   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│              LÓGICA DE NEGOCIO (BFF)                        │
│  Next.js API Routes + Server Actions                        │
│  - Authentication & Authorization                           │
│  - Orchestration & State Management                         │
│  - Rate Limiting & Validation                               │
│  - Streaming & Real-time Handlers                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│           INTEGRACIONES EXTERNAS                            │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │ Claude API   │ Notion API   │ GitLab API   │             │
│  │   + MCP      │    + MCP     │    + MCP     │             │
│  └──────────────┴──────────────┴──────────────┘             │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│            CAPA DE DATOS (Supabase)                         │
│  ┌──────────────────────────────────────────┐              │
│  │  PostgreSQL Database                     │              │
│  │  - Tasks, Enrichments, Snapshots         │              │
│  │  - Interactions, Audit Log               │              │
│  │  - User Profiles, Sync Log               │              │
│  └──────────────────────────────────────────┘              │
│  ┌──────────────────────────────────────────┐              │
│  │  Realtime Subscriptions                  │              │
│  │  - WebSocket para cambios en datos       │              │
│  └──────────────────────────────────────────┘              │
│  ┌──────────────────────────────────────────┐              │
│  │  Auth (Supabase Auth)                    │              │
│  │  - JWT tokens, Sessions                  │              │
│  └──────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

### 1. Flujo de Enriquecimiento (Happy Path)

```
Usuario UI
    ↓
[1] Selecciona tarea de Notion + aplica filtros
    ↓
[2] Frontend → GET /api/tasks/:id
    ↓
[3] Backend: Fetch task + metadata desde Notion
    ↓
[4] Backend: Fetch contexto GitLab (MRs, commits, branches)
    ↓
[5] Backend: Build prompt con task + contexto + history
    ↓
[6] Backend: Stream GET /api/enrichment/:id/stream → Claude API
    ↓
[7] Frontend: Mostrar respuesta en tiempo real (streaming)
    ↓
[8] Usuario: Revisa el enriquecimiento
    ↓
[9] Backend: Guardar snapshot en enrichment_snapshots
    ↓
[10] Transición a Review State
```

### 2. Flujo de Chat Interactivo

```
Usuario escriba prompt en chat
    ↓
POST /api/enrichment/:id/refine
    ↓
Backend: Append user message → interactions
    ↓
Backend: Build refined prompt (task + context + chat history)
    ↓
Backend: Stream response desde Claude
    ↓
Frontend: Mostrar response + auto-update enrichment preview
    ↓
Backend: Apply changes → enrichment.enriched_content
    ↓
Guardar snapshot (interaction_type: 'chat_refinement')
    ↓
Update UI con versión más reciente
```

### 3. Flujo de Sincronización con Notion

```
Usuario aprueba enrichment
    ↓
[Pre-sync] Validar que no hay conflictos en Notion
    ↓
POST /api/sync/notion → {enrichment_id, task_id}
    ↓
[1] Fetch task actual de Notion (refresh)
    ↓
[2] Comparar versión local vs remote
    ↓
[3] Si conflicto → Guardar en sync_log + Ask user
    ↓
[4] Si OK → Update Notion task con enriched content
    ↓
[5] Guardar link a enrichment_id en Notion task metadata
    ↓
[6] Log sync en sync_log (success)
    ↓
[7] Actualizar task.last_sync_at
    ↓
[8] Email notification al PO: "Task synced to Notion"
```

### 4. Flujo de Auditoría

```
Cualquier operación CRUD
    ↓
Backend: Grabber previous_values + new_values
    ↓
Backend: INSERT audit_log {entity_type, entity_id, action, ...}
    ↓
Frontend (Admin): Puede ver audit_log completo
    ↓
Retención: 1 año (policy de Supabase)
```

---

## Patrones de Diseño

### 1. **Server Components + Client Components**

- **Server Components**: Data fetching, auth checks, secrets
- **Client Components**: Interactivos (forms, filters, chat)
- **Boundary**: Usar `use client` juiciosamente

```typescript
// app/tasks/page.tsx - Server Component
export default async function TasksPage() {
  const tasks = await fetchTasks(); // server-only
  return <TaskList tasks={tasks} />;
}

// components/TaskList.tsx - Client Component
'use client';
export function TaskList({ tasks }) {
  const [filtered, setFiltered] = useState(tasks);
  return <>{filtered.map(t => <TaskCard task={t} />)}</>;
}
```

### 2. **Repository Pattern for Data Access**

```typescript
// lib/repositories/TaskRepository.ts
class TaskRepository {
  async getById(id: string): Promise<Task>
  async list(filters: TaskFilters): Promise<Task[]>
  async create(task: TaskInput): Promise<Task>
  async update(id: string, changes: Partial<Task>): Promise<Task>
  async delete(id: string): Promise<void>
}

// Usage in API routes
const taskRepo = new TaskRepository(supabaseClient);
const task = await taskRepo.getById(id);
```

### 3. **Service Layer for Business Logic**

```typescript
// lib/services/EnrichmentService.ts
class EnrichmentService {
  async enrichTask(task: Task, context: GitLabContext): Promise<Enrichment>
  async refineEnrichment(enrichment: Enrichment, userPrompt: string)
  async approveAndSync(enrichment: Enrichment, reviewer: User)
}

// Usage in API routes
const enrichmentService = new EnrichmentService();
const result = await enrichmentService.enrichTask(task, gitlabContext);
```

### 4. **Transactional Operations with Supabase**

```typescript
// Para operaciones multi-tabla (enriquecimiento + snapshot + sync log)
async function enrichAndSave(taskId, enrichedContent) {
  const { data, error } = await supabase.rpc('enrich_and_save', {
    task_id: taskId,
    content: enrichedContent,
    user_id: currentUser.id
  });

  if (error) throw new Error(error);
  return data;
}

-- PL/pgSQL function (stored procedure)
CREATE FUNCTION enrich_and_save(
  task_id UUID,
  content TEXT,
  user_id UUID
) RETURNS TABLE (enrichment_id UUID, snapshot_id UUID) AS $$
BEGIN
  -- Crear enrichment o actualizar
  INSERT INTO enrichments (...) VALUES (...)
  ON CONFLICT (task_id) DO UPDATE SET ...
  RETURNING id INTO enrichment_id;

  -- Crear snapshot
  INSERT INTO enrichment_snapshots (...)
  RETURNING id INTO snapshot_id;

  -- Log change
  INSERT INTO audit_log (...) VALUES (...);

  RETURN QUERY SELECT enrichment_id, snapshot_id;
END;
$$ LANGUAGE plpgsql;
```

### 5. **Error Handling & Validation**

```typescript
// lib/errors.ts
class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) { super(message); }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

// API route error handling
export async function POST(req: Request) {
  try {
    const data = validateRequest(req);
    const result = await service.process(data);
    return Response.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({
        code: error.code,
        message: error.message,
        details: error.details
      }, { status: error.statusCode });
    }
    // Log unknown error
    return Response.json({
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }, { status: 500 });
  }
}
```

### 6. **Rate Limiting & Throttling**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const key = `${ip}:${new Date().getHours()}`;

  // Redis/Upstash para rate limiting
  const count = redis.incr(key);

  if (count > RATE_LIMIT) {
    return new Response('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};
```

---

## Manejo de Concurrencia

### 1. **Race Conditions - Task Sync**

**Problema**: Dos usuarios enriquecen la misma tarea simultáneamente

**Solución**: Optimistic Locking con versiones

```typescript
-- Schema
CREATE TABLE enrichments (
  id UUID PRIMARY KEY,
  task_id UUID,
  version INT DEFAULT 1,
  content TEXT,
  ...
);

-- API
async function updateEnrichment(enrichmentId, newContent, clientVersion) {
  const { data, error } = await supabase
    .from('enrichments')
    .update({ content: newContent, version: version + 1 })
    .eq('id', enrichmentId)
    .eq('version', clientVersion)
    .select();

  if (data.length === 0) {
    // Conflict: client version doesn't match server
    throw new ConflictError('Enrichment was modified by another user');
  }
}

-- Frontend
const { enrichment, setEnrichment } = useState();

async function save() {
  try {
    const updated = await updateEnrichment(
      enrichment.id,
      enrichment.content,
      enrichment.version  // optimistic lock
    );
    setEnrichment(updated);
  } catch (error) {
    if (error instanceof ConflictError) {
      // Mostrar dialog: "Task was modified by X, reload?"
      const latest = await fetchEnrichment(enrichment.id);
      setEnrichment(latest);
    }
  }
}
```

### 2. **Notion Sync Conflicts**

**Problema**: Task modificada en Notion while enrichment is in progress

**Solución**: Last-Write-Wins con audit trail

```typescript
async function syncToNotion(enrichmentId) {
  const enrichment = await getEnrichment(enrichmentId);
  const notionTask = await notion.getTask(enrichment.task_id);

  // Compara timestamps
  if (notionTask.updatedAt > enrichment.createdAt) {
    // Notion fue modificado after enrichment
    return {
      status: 'conflict',
      message: 'Task was updated in Notion after enrichment',
      action: 'manual_review_required'
    };
  }

  // Safe to sync
  await notion.updateTask({
    ...notionTask,
    enriched_content: enrichment.enriched_content,
    enrichment_version: enrichmentId,
    synced_at: new Date()
  });

  // Log
  await logSync({
    enrichment_id: enrichmentId,
    action: 'sync_to_notion',
    status: 'success'
  });
}
```

### 3. **Claude API Rate Limiting**

**Problema**: Múltiples enriquecimientos simultáneos pueden exceder rate limits

**Solución**: Queue con backoff exponencial

```typescript
// lib/queue/EnrichmentQueue.ts
import Bull from 'bull';

const enrichmentQueue = new Bull('enrichment', {
  redis: process.env.REDIS_URL
});

enrichmentQueue.process(1, async (job) => {
  // Process only 1 at a time
  const { taskId, enrichmentId } = job.data;

  try {
    const result = await enrichTask(taskId);
    job.progress(100);
    return result;
  } catch (error) {
    if (error.status === 429) {
      // Rate limit: retry with backoff
      throw error; // Bull handles exponential backoff
    }
    throw error;
  }
});

// API route
export async function POST(req: Request) {
  const { taskId } = await req.json();

  const job = await enrichmentQueue.add(
    { taskId, enrichmentId: generateId() },
    { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
  );

  return Response.json({ jobId: job.id });
}

// WebSocket para progress
const job = await enrichmentQueue.getJob(jobId);
job.on('progress', (progress) => {
  broadcast({ event: 'enrichment:progress', jobId, progress });
});
```

### 4. **Real-time Updates con Supabase Realtime**

```typescript
// Frontend
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function EnrichmentViewer({ taskId }) {
  const [enrichment, setEnrichment] = useState(null);

  useEffect(() => {
    // Subscribe to changes
    const subscription = supabase
      .from(`enrichments:task_id=eq.${taskId}`)
      .on('*', (payload) => {
        if (payload.eventType === 'UPDATE') {
          setEnrichment(payload.new);
        }
      })
      .subscribe();

    return () => supabase.removeSubscription(subscription);
  }, [taskId]);

  return <div>{enrichment?.enriched_content}</div>;
}
```

---

## Cumplimiento ACID

### Atomicity (Atomicidad)

Operaciones indivisibles usando Supabase RPC (stored procedures):

```sql
-- Transaction wrapper
BEGIN;

INSERT INTO enrichments (...) RETURNING id INTO enrichment_id;
INSERT INTO enrichment_snapshots (...);
UPDATE tasks SET last_enrichment_id = enrichment_id;
INSERT INTO audit_log (...);

COMMIT;
```

Si cualquier statement falla → ROLLBACK automático.

### Consistency (Consistencia)

- **Foreign keys**: Enforced a nivel DB
- **Constraints**: CHECK constraints en columnas críticas
- **Triggers**: Para mantener invariantes

```sql
CREATE TRIGGER ensure_enrichment_status
BEFORE UPDATE ON enrichments
FOR EACH ROW
BEGIN
  IF NEW.status NOT IN ('draft', 'review', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
END;
```

### Isolation (Aislamiento)

- **Read Committed** (default Postgres): Suficiente para este sistema
- **Serializable** para operaciones críticas de sync:

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN;
  -- Sync operation
  SELECT * FROM tasks WHERE id = ? FOR UPDATE; -- Lock
  UPDATE tasks SET ... WHERE id = ?;
COMMIT;
```

### Durability (Durabilidad)

- Supabase usa WAL (Write-Ahead Logging)
- Daily backups automáticos
- Point-in-time recovery habilitado

---

## Decisiones Clave

### 1. **Turbopack por defecto (NO swc)**

**Decisión**: Usar Turbopack como compilador en dev, activado en next.config.js

**Justificación**:
- Compilación 5-10x más rápida que SWC
- Hot reload <1s (crítico para UX de desarrollo)
- Nativo en Next.js 16
- Mejor soporte para TypeScript y JSX

**Trade-off**: Requiere Node 18+, pero ya lo tenemos

### 2. **next-themes para Dark Mode**

**Decisión**: Usar `next-themes` + Tailwind `dark:` classes

**Justificación**:
- Librería estándar en comunidad Next.js
- Respeta `prefers-color-scheme` del SO automáticamente
- Cambio dinámico sin flash FOUC (Flash of Unstyled Content)
- Pequeño bundle size (~2KB gzip)

**Alternativa rechazada**: Custom context + CSS variables (más trabajo, menos robusto)

### 3. **next-intl para Multilanguage**

**Decisión**: Usar `next-intl` con estructura `[locale]` en URLs

**Justificación**:
- Diseñada específicamente para Next.js 16
- SEO-friendly (cada idioma es una URL diferente)
- Server-side translation por defecto
- Soporte para plurales, formatos de fecha, etc.

**URLs**: `/es/tasks`, `/en/tasks`, `/es/login`

**Alternativa rechazada**: i18next (más compleja, overhead innecesario)

### 4. **Mobile-first Responsive con Tailwind**

**Decisión**: CSS mobile-first con breakpoints sm/md/lg

**Justificación**:
- Tailwind es mobile-first por defecto
- Ya incluido en stack
- Componentes más ligeros en mobile
- Testing en 3 viewports aseguran cobertura

**No requiere**: Librería adicional (Tailwind lo maneja nativamente)

### 5. **Factory Pattern para Multi-AI**

**Decisión**: Abstracción completa con interface `IAIProvider` + Factory

**Justificación**:
- Cambiar de provider sin cambiar código (config-driven)
- Fácil agregar nuevos providers (OpenAI, Gemini, LLaMA)
- Testing con mock providers
- Fallback automático si un provider falla

**Providers soportados**:
- Claude (Anthropic) - default
- OpenAI (GPT-4, GPT-4-turbo)
- Google Gemini (Pro, Pro Vision)
- Extensible para otros

**Trade-off**: Pequeño overhead de abstracción, pero justificado por flexibilidad

### 6. **Next.js como framework full-stack**

**Decisión**: Usar Next.js 16 con App Router, Server Components y API Routes

**Justificación**:
- Single framework para frontend + backend
- Server Components reducen bundle size
- Streaming nativo para Claude API responses
- Deployment simple en Vercel o self-hosted

**Trade-off**: Moins de flexibilidad que arquitectura desacoplada (React SPA + Express backend)

### 2. **Supabase para base de datos + auth**

**Decisión**: PostgreSQL (Supabase) + Supabase Auth

**Justificación**:
- ACID compliance nativo → confiabilidad
- RLS para seguridad a nivel row
- Real-time subscriptions built-in
- Supabase Auth integrado (OAuth, email)
- Mejor que Firebase para operaciones complejas

**Trade-off**: Vendor lock-in (pero mitigable con abstracciones)

### 3. **Streaming para Claude API responses**

**Decisión**: Usar streaming de Claude API directamente en frontend

**Justificación**:
- UX superior (ver respuesta mientras se genera)
- Reducir latencia percibida
- Feedback temprano para errores

```typescript
// API route con streaming
export async function GET(req: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const stream = await claudeClient.messages.stream({
        max_tokens: 1024,
        model: 'claude-3-5-sonnet-20241022',
        messages: [{ role: 'user', content: prompt }]
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          controller.enqueue(
            new TextEncoder().encode(chunk.delta.text)
          );
        }
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}

// Frontend
const response = await fetch('/api/enrichment/123/stream');
const reader = response.body.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = new TextDecoder().decode(value);
  setContent(prev => prev + text); // Live update
}
```

### 4. **MCP (Model Context Protocol) para integraciones**

**Decisión**: Usar Notion MCP + GitLab MCP para context gathering

**Justificación**:
- Standardized protocol para integrar múltiples sistemas
- Evitar mantener múltiples API clients
- Mejor security (tokens managed centrally)

### 5. **Snapshots para auditoría**

**Decisión**: Guardar cada versión como snapshot (immutable)

**Justificación**:
- Compliance requirements
- Full history para auditoría
- Rollback capability (UI-only, no destructive)

**Trade-off**: Más storage, pero acceptable para este use case

### 6. **Roles y Permisos con RLS**

**Decisión**: Row-Level Security en Supabase para enforce permissions

**Justificación**:
- Seguridad a nivel DB (defense in depth)
- Prevenir acceso no autorizado incluso si backend comprometido
- Menos código de validación en aplicación

---

## Trade-offs

### 1. **Monolito vs Microservicios**

| Aspecto | Monolito Next.js | Microservicios |
|---------|------------------|-----------------|
| **Desarrollo** | Más rápido (MVP) | Más lento (overhead) |
| **Deployment** | 1 comando | Múltiples servicios |
| **Escalabilidad** | Limitada | Horizontal |
| **Complejidad** | Baja | Alta |

**Decisión: Monolito** (mejor para este MVP)

**Migración futura**: Si crece, separar a:
- `service-notion` (sync/webhooks)
- `service-enrichment` (Claude + queueing)
- `service-api` (API gateway)

### 2. **Streaming vs Polling**

| Aspecto | Streaming | Polling |
|---------|-----------|---------|
| **Latencia** | ~1-2s | 5-10s |
| **Complejidad** | Media | Baja |
| **Overhead** | Bajo | Alto (N requests/min) |

**Decisión: Streaming** (mejor UX para enriquecimiento en vivo)

### 3. **Supabase Realtime vs Pull**

| Aspecto | Realtime | Pull |
|---------|----------|------|
| **Latencia** | ~100ms | 1-2s |
| **Conexiones** | WebSocket (persistent) | HTTP (stateless) |
| **Escalabilidad** | Media | Alta |

**Decisión: Realtime** (para colaboración en tiempo real)

**Con fallback** a polling si Realtime falla.

### 4. **Custom auth vs Supabase Auth**

**Decisión: Supabase Auth** (OAuth + email)

Ventajas:
- No mantener custom auth system
- OAuth providers (Google, GitHub, Microsoft)
- Magic links / email confirmation built-in

### 5. **PostgreSQL vs Document DB (MongoDB)**

| Aspecto | PostgreSQL | MongoDB |
|---------|-----------|---------|
| **Transacciones** | ACID completo | Limitadas |
| **Queries complejas** | SQL poderoso | Aggregation pipeline |
| **Normalización** | Strict | Flexible |
| **Relaciones** | Excelentes | Embedding |

**Decisión: PostgreSQL** (necesitamos ACID para sync)

---

## Security & Compliance

### 1. **Autenticación & Autorización**

- Supabase Auth con JWT tokens
- RLS policies en todas las tablas
- Middleware para validar token en API routes

### 2. **Encriptación**

- Tokens de terceros (GitLab, Notion) encriptados en DB
- HTTPS obligatorio
- At-rest encryption (Supabase + PG)

### 3. **Rate Limiting**

- IP-based rate limiting en middleware
- Per-user limits para Claude API calls
- Queue para evitar abuse

### 4. **Auditoría**

- audit_log table para todas las operaciones
- IP, user agent, timestamps
- 1 año retención

### 5. **GDPR Compliance**

- User data export endpoint
- User deletion (cascade delete con soft deletes)
- Consent tracking para emails

---

## Métricas y Monitoring

### 1. **Observabilidad**

```typescript
// Sentry para error tracking
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.PostgresIntegration()],
});
```

### 2. **Logging**

```typescript
// Structured logging
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label })
  }
});

logger.info({ enrichmentId, userId, action: 'enrichment_started' });
```

### 3. **Performance Monitoring**

- Core Web Vitals con Next.js Analytics
- API response times
- Claude API latency
- Database query performance

---

## Próximos Pasos

1. **Backend Specialist**: Implementar API routes y servicios
2. **Frontend Specialist**: Componentes con Atomic Design
3. **Designer**: UI/UX y flujos de usuario
4. **QA**: Testing e integración

---

**Documento creado por**: Arquitecto de Software
**Versión**: 1.0
**Última actualización**: 2026-03-16
