# Arquitectura de Backend - Sistema de Enriquecimiento de Tareas

**Versión:** 2.0 (Actualizada con Requisitos Adicionales)
**Fecha:** 2026-03-16
**Responsable:** Backend Expert

---

## 1. Visión General

Sistema de backend basado en **Next.js 16** con **Supabase** como plataforma de autenticación, base de datos y almacenamiento. El sistema enriquece tareas técnicas integrando datos de múltiples servicios y modelos de IA abiertos.

### Stack Tecnológico
- **Frontend/Backend:** Next.js 16 (Full-stack)
- **Auth:** Supabase Auth (JWT)
- **Database:** PostgreSQL (Supabase)
- **External APIs:** Notion, GitLab, Claude, OpenAI, Gemini
- **Rate Limiting:** Redis (o Upstash Redis)
- **Logging:** Structured logging a Supabase
- **i18n:** next-intl (soporte ES, EN)
- **Theme:** next-themes (dark/light mode)

---

## 2. Modelo de Roles y Permisos

### Roles Definidos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Admin** | Administrador del sistema | Acceso total, gestionar usuarios, ver auditoría completa |
| **TPO** | Technical Product Owner | Crear/editar/eliminar tareas, ver auditoría de sus recursos |
| **Viewer** | Visualizador | Solo lectura de tareas públicas, sin edición |
| **Integration** | Usuario de sistemas (para bots/integraciones) | APIs específicas con scope limitado |

---

## 3. Estructura de Endpoints API

### 3.1 Autenticación

```
POST   /api/auth/login              - Login con email/password
POST   /api/auth/signup             - Registro de nuevo usuario
POST   /api/auth/logout             - Logout (invalida token)
POST   /api/auth/refresh            - Refresh JWT token
GET    /api/auth/me                 - Obtener info del usuario actual (incluye language, theme)
POST   /api/auth/password-reset     - Solicitar reset de contraseña
POST   /api/auth/verify-email       - Verificar email
```

**Nota:** Endpoint `/api/auth/me` ahora retorna `language_preference` y `theme_preference`.

### 3.2 Tareas

```
GET    /api/[locale]/tasks                   - Listar tareas
POST   /api/[locale]/tasks                   - Crear tarea
GET    /api/[locale]/tasks/:id               - Obtener detalle
PUT    /api/[locale]/tasks/:id               - Actualizar tarea
DELETE /api/[locale]/tasks/:id               - Eliminar tarea (soft delete)
PATCH  /api/[locale]/tasks/:id/status        - Actualizar solo estado
POST   /api/[locale]/tasks/batch             - Operaciones en batch
```

**Nota:** Todos los endpoints incluyen `[locale]` para soporte i18n. Mensajes de error en idioma del usuario.

### 3.3 Enriquecimiento de Tareas

```
POST   /api/[locale]/tasks/:id/enrich        - Enriquecer con datos externos
  Request: { source: 'notion|gitlab|claude', provider: 'claude|openai|gemini', options: {...} }
```

### 3.4 IA Providers (Nuevo)

```
GET    /api/[locale]/ai/providers            - Listar providers configurados
POST   /api/[locale]/ai/providers            - Registrar nuevo provider
GET    /api/[locale]/ai/providers/:id        - Obtener provider
PUT    /api/[locale]/ai/providers/:id        - Actualizar provider
DELETE /api/[locale]/ai/providers/:id        - Eliminar provider
POST   /api/[locale]/ai/providers/:id/test   - Probar conexión
GET    /api/[locale]/ai/models               - Listar modelos disponibles
PUT    /api/auth/preferences                 - Actualizar language + theme
```

### 3.5 Otras Secciones

[Se mantienen iguales: Snapshots, Integraciones, Webhooks, Auditoría, Admin]

---

## 4. Modelo de Datos (Supabase PostgreSQL)

### 4.1 Tabla: `users` (ACTUALIZADA)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'viewer',
  status VARCHAR(50) DEFAULT 'active',

  -- NUEVOS CAMPOS
  language_preference VARCHAR(10) DEFAULT 'es',  -- 'es', 'en'
  theme_preference VARCHAR(10) DEFAULT 'light',  -- 'light', 'dark', 'auto'

  supabase_user_id UUID UNIQUE NOT NULL,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supabase_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### 4.2 Tabla: `ai_providers` (NUEVA)

```sql
CREATE TABLE ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider_name VARCHAR(50) NOT NULL,  -- 'claude', 'openai', 'gemini', 'llama'
  api_key_encrypted VARCHAR(500) NOT NULL,
  model VARCHAR(100),                   -- 'claude-opus-4-6', 'gpt-4-turbo', etc.
  temperature DECIMAL(2,1) DEFAULT 0.7,
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, provider_name)
);

CREATE INDEX idx_ai_providers_user_id ON ai_providers(user_id);
CREATE INDEX idx_ai_providers_is_active ON ai_providers(is_active);
```

### 4.3 Tabla: `ai_usage_logs` (NUEVA - para auditoría de modelos)

```sql
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  task_id UUID,
  provider_name VARCHAR(50),
  model VARCHAR(100),
  tokens_used INT,
  cost DECIMAL(10,4),
  response_time_ms INT,
  status VARCHAR(50) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
```

### 4.4 Tabla: `translations` (NUEVA - para mensajes de error)

```sql
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,           -- 'error.invalid_email', 'error.rate_limit', etc.
  language VARCHAR(10) NOT NULL,       -- 'es', 'en'
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(key, language)
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_translations_key_lang ON translations(key, language);
```

### 4.5 Relaciones Actualizadas

```
users (1) ──── (N) ai_providers
users (1) ──── (N) ai_usage_logs
tasks (1) ──── (N) ai_usage_logs
```

---

## 5. Service Layer de IA (NUEVO)

### 5.1 Interface Abstracta

```typescript
// lib/services/ai/types.ts
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  tokensUsed?: number;
  cost?: number;
  model: string;
  provider: string;
}

export interface EnrichmentContext {
  task: Task;
  language: string;
  model?: string;
}

export interface IAIProvider {
  /**
   * Enriquecer una tarea con análisis y recomendaciones
   */
  enrich(context: EnrichmentContext): Promise<AIResponse>;

  /**
   * Chat conversation
   */
  chat(messages: Message[], context?: EnrichmentContext): Promise<AIResponse>;

  /**
   * Listar modelos disponibles
   */
  getModels(): Promise<string[]>;

  /**
   * Test de conexión
   */
  testConnection(): Promise<boolean>;

  /**
   * Streaming enrich (para UI en tiempo real)
   */
  enrichStream(context: EnrichmentContext): AsyncGenerator<string>;
}

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens?: number;
}
```

### 5.2 ClaudeProvider (Implementación)

```typescript
// lib/services/ai/providers/ClaudeProvider.ts
import Anthropic from '@anthropic-ai/sdk';
import { IAIProvider, Message, AIResponse, EnrichmentContext } from '../types';

export class ClaudeProvider implements IAIProvider {
  private client: Anthropic;
  private config: any;

  constructor(apiKey: string, model: string, temperature: number) {
    this.client = new Anthropic({ apiKey });
    this.config = { model, temperature };
  }

  async enrich(context: EnrichmentContext): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(context.language);

    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Enriquece esta tarea: ${context.task.title}\n${context.task.description}`
      }]
    });

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      tokensUsed: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      model: this.config.model,
      provider: 'claude'
    };
  }

  async chat(messages: Message[]): Promise<AIResponse> {
    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 1024,
      system: this.buildChatSystemPrompt(),
      messages: messages
    });

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      model: this.config.model,
      provider: 'claude'
    };
  }

  async getModels(): Promise<string[]> {
    // Retornar modelos disponibles de Claude
    return ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5'];
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: this.config.model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'ping' }]
      });
      return true;
    } catch {
      return false;
    }
  }

  async *enrichStream(context: EnrichmentContext): AsyncGenerator<string> {
    const systemPrompt = this.buildSystemPrompt(context.language);

    const stream = await this.client.messages.stream({
      model: this.config.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Enriquece: ${context.task.title}`
      }]
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        yield chunk.delta.text;
      }
    }
  }

  private buildSystemPrompt(language: string): string {
    // Construir prompt en idioma del usuario
    const prompts = {
      es: 'Eres un experto en análisis de tareas técnicas...',
      en: 'You are an expert in technical task analysis...'
    };
    return prompts[language as keyof typeof prompts] || prompts.en;
  }

  private buildChatSystemPrompt(): string {
    return 'Eres un asistente útil para enriquecer tareas técnicas.';
  }
}
```

### 5.3 OpenAIProvider (Similar)

```typescript
// lib/services/ai/providers/OpenAIProvider.ts
import OpenAI from 'openai';
import { IAIProvider, Message, AIResponse, EnrichmentContext } from '../types';

export class OpenAIProvider implements IAIProvider {
  private client: OpenAI;
  private config: any;

  constructor(apiKey: string, model: string, temperature: number) {
    this.client = new OpenAI({ apiKey });
    this.config = { model, temperature };
  }

  // Implementaciones similares a ClaudeProvider
  // ...
}
```

### 5.4 GeminiProvider

```typescript
// lib/services/ai/providers/GeminiProvider.ts
// Implementación similar para Google Gemini API
```

### 5.5 AI Factory Pattern

```typescript
// lib/services/ai/AIFactory.ts
import { IAIProvider } from './types';
import { ClaudeProvider } from './providers/ClaudeProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { GeminiProvider } from './providers/GeminiProvider';

export function createAIProvider(
  providerName: string,
  apiKey: string,
  model: string,
  temperature: number = 0.7
): IAIProvider {
  switch (providerName.toLowerCase()) {
    case 'claude':
      return new ClaudeProvider(apiKey, model, temperature);
    case 'openai':
      return new OpenAIProvider(apiKey, model, temperature);
    case 'gemini':
      return new GeminiProvider(apiKey, model, temperature);
    default:
      throw new Error(`Unknown AI provider: ${providerName}`);
  }
}

export async function getAIProviderForUser(
  userId: string,
  supabase: any
): Promise<IAIProvider> {
  // Obtener provider preferido del usuario
  const { data: provider, error } = await supabase
    .from('ai_providers')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error || !provider) {
    throw new Error('No AI provider configured for user');
  }

  const apiKey = await decryptToken(provider.api_key_encrypted);
  return createAIProvider(
    provider.provider_name,
    apiKey,
    provider.model,
    provider.temperature
  );
}
```

### 5.6 Uso en Endpoint

```typescript
// app/api/[locale]/tasks/[id]/enrich/route.ts
export async function POST(request: NextRequest) {
  const locale = request.nextUrl.pathname.split('/')[2];
  const user = request.user; // From middleware
  const { taskId } = await request.json();

  try {
    // Obtener provider del usuario
    const provider = await getAIProviderForUser(user.id, supabase);

    // Obtener tarea
    const task = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single();

    // Enriquecer
    const startTime = Date.now();
    const response = await provider.enrich({
      task,
      language: user.language_preference || 'es'
    });

    // Registrar uso
    await supabase.from('ai_usage_logs').insert({
      user_id: user.id,
      task_id: taskId,
      provider_name: provider.constructor.name,
      model: response.model,
      tokens_used: response.tokensUsed,
      response_time_ms: Date.now() - startTime,
      status: 'success'
    });

    // Actualizar tarea
    await supabase
      .from('tasks')
      .update({ enrichment_data: response.content })
      .eq('id', taskId);

    return successResponse({ enriched: response }, 200);
  } catch (error) {
    // Logging de errores en idioma del usuario
    const errorMessage = getTranslation('error.enrichment_failed', locale, supabase);
    return errorResponse('ENRICHMENT_FAILED', errorMessage, 500);
  }
}
```

---

## 6. Internacionalización (i18n) en Backend

### 6.1 Tabla de Traducciones

```sql
-- Insertar mensajes de error en dos idiomas
INSERT INTO translations (key, language, text) VALUES
-- Español
('error.invalid_email', 'es', 'El email no es válido'),
('error.rate_limit', 'es', 'Has hecho demasiadas solicitudes. Intenta de nuevo en {n} segundos'),
('error.unauthorized', 'es', 'No autenticado. Por favor inicia sesión'),
('error.forbidden', 'es', 'No tienes permiso para acceder a este recurso'),
('error.not_found', 'es', 'Recurso no encontrado'),
('error.enrichment_failed', 'es', 'Error al enriquecer la tarea. Intenta de nuevo'),

-- English
('error.invalid_email', 'en', 'The email is not valid'),
('error.rate_limit', 'en', 'You have made too many requests. Try again in {n} seconds'),
('error.unauthorized', 'en', 'Not authenticated. Please log in'),
('error.forbidden', 'en', 'You do not have permission to access this resource'),
('error.not_found', 'en', 'Resource not found'),
('error.enrichment_failed', 'en', 'Failed to enrich the task. Try again');
```

### 6.2 Helper para Traducciones

```typescript
// lib/i18n/translations.ts
export async function getTranslation(
  key: string,
  language: string,
  supabase: any,
  params?: Record<string, string>
): Promise<string> {
  const { data, error } = await supabase
    .from('translations')
    .select('text')
    .eq('key', key)
    .eq('language', language)
    .single();

  if (error || !data) {
    // Fallback a inglés
    const fallback = await supabase
      .from('translations')
      .select('text')
      .eq('key', key)
      .eq('language', 'en')
      .single();

    let text = fallback?.data?.text || key;
    // Reemplazar parámetros
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
      }
    }
    return text;
  }

  let text = data.text;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v);
    }
  }
  return text;
}
```

### 6.3 URLs con Locale

```typescript
// Estructura de URLs
GET /api/es/tasks         // Español
GET /api/en/tasks         // English

// Middleware para extraer locale
export function extractLocale(pathname: string): string {
  const match = pathname.match(/\/api\/(es|en)\//);
  return match ? match[1] : 'es';
}
```

---

## 7. Dark Mode en Backend

### 7.1 Persistencia en BD

```typescript
// El campo `theme_preference` en tabla `users` guardará:
// 'light', 'dark', 'auto' (respeta SO)

// app/api/auth/preferences/route.ts
export async function PUT(request: NextRequest & { user?: any }) {
  const { language_preference, theme_preference } = await request.json();

  const updates: any = {};
  if (language_preference) updates.language_preference = language_preference;
  if (theme_preference) updates.theme_preference = theme_preference;

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', request.user.id);

  if (error) {
    return errorResponse('UPDATE_FAILED', 'Failed to update preferences', 500);
  }

  return successResponse({ preferences: updates }, 200);
}
```

### 7.2 Cargar en Endpoint de Login

```typescript
// app/api/auth/me/route.ts
export async function GET(request: NextRequest & { user?: any }) {
  const { data: user } = await supabase
    .from('users')
    .select('id, email, role, language_preference, theme_preference')
    .eq('id', request.user.id)
    .single();

  return successResponse({ user }, 200);
}
```

---

## 8. Configuración Centralizada de IA

```typescript
// config/ai.config.ts
export const AI_CONFIG = {
  defaultProvider: 'claude', // Configurable por env
  providers: {
    claude: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-opus-4-6',
      temperature: 0.7,
      maxTokens: 2048,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo',
      temperature: 0.7,
      maxTokens: 2048,
    },
    gemini: {
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2048,
    },
  },
};

// Por tarea:
export const TASK_ENRICHMENT_CONFIG = {
  analysis: 'openai',      // Rápido para análisis
  summary: 'claude',       // Robusto para resumen
};
```

---

## 9. Fallback y Retry Logic

```typescript
// lib/services/ai/AIOrchestrator.ts
export class AIOrchestrator {
  async enrichWithFallback(
    context: EnrichmentContext,
    primaryProvider: string,
    fallbackProvider?: string
  ): Promise<AIResponse> {
    try {
      const provider = await this.getProvider(primaryProvider);
      return await provider.enrich(context);
    } catch (error) {
      if (fallbackProvider) {
        console.warn(`Primary provider ${primaryProvider} failed, using fallback`);
        const fallback = await this.getProvider(fallbackProvider);
        return await fallback.enrich(context);
      }
      throw error;
    }
  }

  // Retry con exponential backoff
  async enrichWithRetry(
    context: EnrichmentContext,
    provider: string,
    maxRetries: number = 3
  ): Promise<AIResponse> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const p = await this.getProvider(provider);
        return await p.enrich(context);
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;

        const delayMs = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    throw new Error('Failed after all retries');
  }
}
```

---

## 10. Checklist de Implementación Actualizado

### Nuevos Campos en BD
- [ ] Agregar `language_preference` a tabla `users`
- [ ] Agregar `theme_preference` a tabla `users`
- [ ] Crear tabla `ai_providers` con encriptación
- [ ] Crear tabla `ai_usage_logs`
- [ ] Crear tabla `translations`
- [ ] Índices para performance

### Service Layer de IA
- [ ] Interface `IAIProvider`
- [ ] `ClaudeProvider` implementation
- [ ] `OpenAIProvider` implementation
- [ ] `GeminiProvider` implementation
- [ ] `AIFactory` pattern
- [ ] `AIOrchestrator` con fallback/retry

### Endpoints Nuevos
- [ ] `PUT /api/auth/preferences` (language, theme)
- [ ] `GET /api/[locale]/ai/providers`
- [ ] `POST /api/[locale]/ai/providers`
- [ ] `POST /api/[locale]/ai/providers/:id/test`
- [ ] `GET /api/[locale]/ai/models`

### i18n
- [ ] Cargar locale desde URL
- [ ] Tabla `translations` poblada
- [ ] Helper `getTranslation()`
- [ ] Mensajes de error en idioma del usuario
- [ ] Fallback a inglés

### Auditoría de IA
- [ ] Registrar uso en `ai_usage_logs`
- [ ] Tracking de tokens/costo
- [ ] Streaming compatible

---

## 11. Variables de Entorno Nuevas

```bash
# IA Providers
ANTHROPIC_API_KEY=xxxxx
OPENAI_API_KEY=xxxxx
GOOGLE_API_KEY=xxxxx

# Default provider
AI_DEFAULT_PROVIDER=claude

# i18n
SUPPORTED_LANGUAGES=es,en
DEFAULT_LANGUAGE=es

# Theme
DEFAULT_THEME=light
```

---

## 12. Cambios No Breaking

- ✅ Nuevas tablas (no afectan existentes)
- ✅ Nuevos campos en `users` (son opcionales)
- ✅ Nuevos endpoints (agregan funcionalidad)
- ✅ Service layer de IA (abstracción interna)
- ✅ i18n (traducción de mensajes únicamente)

**Conclusión:** Todos los cambios son aditivos. No requieren refactor del código existente.

---

**Documento actualizado:** 2026-03-16
**Versión:** 2.0 (Con requisitos adicionales integrados)
**Status:** ✅ Listo para implementación
