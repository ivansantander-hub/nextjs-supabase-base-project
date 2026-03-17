# Actualizaciones de Backend - Requisitos Adicionales

**Fecha:** 2026-03-16
**Status:** Actualizado con i18n, Dark Mode, Modelos IA

---

## 📝 Resumen de Cambios

Se han integrado 3 requisitos críticos en el diseño de backend:

### 1. Multilanguage (i18n) ✅
- **Impacto:** Mensajes de error en idioma del usuario
- **Implementación:** URLs con `[locale]`, tabla `translations`, helper de i18n
- **Cambios en BD:** Tabla `translations` nueva
- **Cambios en API:** Todos los endpoints usan `[locale]`

### 2. Dark Mode ✅
- **Impacto:** Persistencia de preferencia de tema
- **Implementación:** Campo `theme_preference` en tabla `users`
- **Cambios en BD:** Nuevo campo en `users` (light|dark|auto)
- **Endpoints nuevos:** `PUT /api/auth/preferences`

### 3. Arquitectura de Modelos IA Abiertos ✅
- **Impacto:** Soporte para Claude, OpenAI, Gemini, etc.
- **Implementación:** Service Layer Pattern + Factory
- **Cambios en BD:** Tabla `ai_providers`, tabla `ai_usage_logs`
- **Endpoints nuevos:** 5 endpoints para gestionar providers

---

## 🗄️ Cambios en Base de Datos

### Tabla `users` (Actualizada)

```sql
-- Agregar nuevos campos
ALTER TABLE users ADD COLUMN language_preference VARCHAR(10) DEFAULT 'es';
ALTER TABLE users ADD COLUMN theme_preference VARCHAR(10) DEFAULT 'light';

-- Índices
CREATE INDEX idx_users_language ON users(language_preference);
CREATE INDEX idx_users_theme ON users(theme_preference);
```

### Tabla `ai_providers` (Nueva)

```sql
CREATE TABLE ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_name VARCHAR(50) NOT NULL,  -- 'claude', 'openai', 'gemini'
  api_key_encrypted VARCHAR(500) NOT NULL,
  model VARCHAR(100),
  temperature DECIMAL(2,1) DEFAULT 0.7,
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, provider_name)
);

CREATE INDEX idx_ai_providers_user_id ON ai_providers(user_id);
CREATE INDEX idx_ai_providers_is_default ON ai_providers(is_default);
```

### Tabla `ai_usage_logs` (Nueva)

```sql
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  provider_name VARCHAR(50),
  model VARCHAR(100),
  tokens_used INT,
  cost DECIMAL(10,4),
  response_time_ms INT,
  status VARCHAR(50) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_task_id ON ai_usage_logs(task_id);
```

### Tabla `translations` (Nueva)

```sql
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,
  language VARCHAR(10) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(key, language)
);

CREATE INDEX idx_translations_key_lang ON translations(key, language);

-- Insertar traducciones iniciales
INSERT INTO translations (key, language, text) VALUES
-- Español
('error.invalid_email', 'es', 'El email no es válido'),
('error.rate_limit', 'es', 'Has hecho demasiadas solicitudes. Intenta de nuevo en {n} segundos'),
('error.unauthorized', 'es', 'No autenticado. Por favor inicia sesión'),
('error.forbidden', 'es', 'No tienes permiso para acceder a este recurso'),
('error.not_found', 'es', 'Recurso no encontrado'),
('error.enrichment_failed', 'es', 'Error al enriquecer la tarea. Intenta de nuevo'),
('success.task_created', 'es', 'Tarea creada exitosamente'),
('success.task_updated', 'es', 'Tarea actualizada exitosamente'),
-- English
('error.invalid_email', 'en', 'The email is not valid'),
('error.rate_limit', 'en', 'You have made too many requests. Try again in {n} seconds'),
('error.unauthorized', 'en', 'Not authenticated. Please log in'),
('error.forbidden', 'en', 'You do not have permission to access this resource'),
('error.not_found', 'en', 'Resource not found'),
('error.enrichment_failed', 'en', 'Failed to enrich the task. Try again'),
('success.task_created', 'en', 'Task created successfully'),
('success.task_updated', 'en', 'Task updated successfully');
```

---

## 🔄 Nuevos Endpoints

### Preferencias de Usuario

```typescript
PUT /api/auth/preferences
Request: {
  language_preference?: 'es' | 'en',
  theme_preference?: 'light' | 'dark' | 'auto'
}
Response: { preferences: {...} }
```

### Gestión de AI Providers

```typescript
// Listar providers
GET /api/[locale]/ai/providers
Response: [{ id, provider_name, model, is_active, is_default }]

// Crear provider
POST /api/[locale]/ai/providers
Request: {
  provider_name: 'claude',
  api_key: 'sk-...',
  model: 'claude-opus-4-6',
  is_default: false
}

// Actualizar provider
PUT /api/[locale]/ai/providers/:id
Request: { model, temperature, is_default }

// Eliminar provider
DELETE /api/[locale]/ai/providers/:id

// Test conexión
POST /api/[locale]/ai/providers/:id/test
Response: { connection_status: 'healthy|failed', error?: string }

// Listar modelos disponibles
GET /api/[locale]/ai/models?provider=claude
Response: [{ name: 'claude-opus-4-6', ... }]
```

---

## 💻 Ejemplos de Código

### 1. Service Layer - Interface

```typescript
// lib/services/ai/types.ts
export interface EnrichmentContext {
  task: Task;
  language: string;  // Nuevo: para prompts en idioma del usuario
  model?: string;
}

export interface IAIProvider {
  enrich(context: EnrichmentContext): Promise<AIResponse>;
  chat(messages: Message[]): Promise<AIResponse>;
  getModels(): Promise<string[]>;
  testConnection(): Promise<boolean>;
  enrichStream(context: EnrichmentContext): AsyncGenerator<string>;
}
```

### 2. ClaudeProvider

```typescript
// lib/services/ai/providers/ClaudeProvider.ts
export class ClaudeProvider implements IAIProvider {
  private client: Anthropic;

  constructor(apiKey: string, private config: any) {
    this.client = new Anthropic({ apiKey });
  }

  async enrich(context: EnrichmentContext): Promise<AIResponse> {
    // Prompt en idioma del usuario
    const systemPrompt = this.buildPrompt(context.language);

    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Enriquece: ${context.task.title}`
      }]
    });

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      model: this.config.model,
      provider: 'claude'
    };
  }

  async getModels(): Promise<string[]> {
    return ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5'];
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: this.config.model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      });
      return true;
    } catch {
      return false;
    }
  }

  private buildPrompt(language: string): string {
    const prompts = {
      es: `Eres un experto en análisis de tareas técnicas.
Enriquece la tarea con:
- Análisis de complejidad
- Dependencias potenciales
- Riesgos identificados
- Recomendaciones de mejora
Responde en español.`,
      en: `You are an expert in technical task analysis.
Enrich the task with:
- Complexity analysis
- Potential dependencies
- Identified risks
- Improvement recommendations
Respond in English.`
    };
    return prompts[language as keyof typeof prompts] || prompts.en;
  }
}
```

### 3. AI Factory

```typescript
// lib/services/ai/AIFactory.ts
export function createAIProvider(
  providerName: string,
  apiKey: string,
  config: any
): IAIProvider {
  switch (providerName.toLowerCase()) {
    case 'claude':
      return new ClaudeProvider(apiKey, config);
    case 'openai':
      return new OpenAIProvider(apiKey, config);
    case 'gemini':
      return new GeminiProvider(apiKey, config);
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

export async function getAIProviderForUser(
  userId: string,
  supabase: any
): Promise<IAIProvider> {
  const { data: provider } = await supabase
    .from('ai_providers')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (!provider) {
    throw new Error('No AI provider configured');
  }

  const apiKey = await decryptToken(provider.api_key_encrypted);
  return createAIProvider(provider.provider_name, apiKey, {
    model: provider.model,
    temperature: provider.temperature
  });
}
```

### 4. Endpoint con i18n

```typescript
// app/api/[locale]/tasks/[id]/enrich/route.ts
export async function POST(
  request: NextRequest & { user?: any }
) {
  const locale = getLocaleFromPath(request);
  const { taskId } = await request.json();

  try {
    const provider = await getAIProviderForUser(request.user.id, supabase);
    const task = await getTask(taskId, request.user.id);
    const user = await getUser(request.user.id);

    const response = await provider.enrich({
      task,
      language: user.language_preference,  // Pasar idioma
      model: user.preferred_ai_model
    });

    // Registrar uso
    await logAIUsage(request.user.id, taskId, response);

    return successResponse({ enriched: response }, 200);
  } catch (error) {
    // Obtener mensaje de error en idioma del usuario
    const errorMsg = await getTranslation(
      'error.enrichment_failed',
      locale,
      supabase
    );
    return errorResponse('ENRICHMENT_FAILED', errorMsg, 500);
  }
}
```

### 5. Helper de Traducciones

```typescript
// lib/i18n/translations.ts
export async function getTranslation(
  key: string,
  language: string,
  supabase: any,
  params?: Record<string, string>
): Promise<string> {
  const { data } = await supabase
    .from('translations')
    .select('text')
    .eq('key', key)
    .eq('language', language)
    .single();

  if (!data) {
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

// Uso
const msg = await getTranslation(
  'error.rate_limit',
  'es',
  supabase,
  { n: '60' }
);
// Retorna: "Has hecho demasiadas solicitudes. Intenta de nuevo en 60 segundos"
```

### 6. Preferencias de Usuario

```typescript
// app/api/auth/preferences/route.ts
export async function PUT(
  request: NextRequest & { user?: any }
) {
  const { language_preference, theme_preference } = await request.json();

  const updates: any = {};
  if (language_preference) {
    if (!['es', 'en'].includes(language_preference)) {
      return errorResponse('INVALID_LANGUAGE', 'Unsupported language', 400);
    }
    updates.language_preference = language_preference;
  }
  if (theme_preference) {
    if (!['light', 'dark', 'auto'].includes(theme_preference)) {
      return errorResponse('INVALID_THEME', 'Unsupported theme', 400);
    }
    updates.theme_preference = theme_preference;
  }

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', request.user.id);

  if (error) {
    return errorResponse('UPDATE_FAILED', error.message, 500);
  }

  return successResponse({ preferences: updates }, 200);
}
```

---

## 🔐 Seguridad

### Encriptación de API Keys

```typescript
// lib/security/crypto.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptToken(encrypted: string): string {
  const [iv, token] = encrypted.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(token, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

## 📋 Checklist de Implementación Incremental

### Phase 1A (Antes de i18n y IA)
- [x] Arquitectura general
- [x] Auth basic
- [x] Tasks CRUD
- [x] Auditoría

### Phase 1B (Nuevos requisitos)
- [ ] Agregar campos a tabla `users`
- [ ] Crear tabla `translations`
- [ ] Crear tabla `ai_providers`
- [ ] Crear tabla `ai_usage_logs`
- [ ] Implementar helper de traducciones

### Phase 1C (Service Layer de IA)
- [ ] Interface `IAIProvider`
- [ ] `ClaudeProvider` impl.
- [ ] `OpenAIProvider` impl.
- [ ] `AIFactory` pattern
- [ ] Endpoint `/api/[locale]/ai/providers`

### Phase 1D (Integración)
- [ ] Actualizar endpoint `/api/auth/me` (include language, theme)
- [ ] Nuevo endpoint `PUT /api/auth/preferences`
- [ ] Actualizar enrich endpoint para usar factory
- [ ] Logging de uso en `ai_usage_logs`

---

## 🔄 Variables de Entorno Nuevas

```bash
# Nuevos proveedores
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...

# Encriptación de API keys
ENCRYPTION_KEY=64hexadecimalcharacters

# i18n
SUPPORTED_LANGUAGES=es,en
DEFAULT_LANGUAGE=es

# IA
AI_DEFAULT_PROVIDER=claude
AI_FALLBACK_PROVIDER=openai
```

---

## ✅ Impacto No Breaking

- ✅ Campos `language_preference` y `theme_preference` son opcionales
- ✅ Nuevas tablas no afectan existentes
- ✅ Service layer es interno (abstracción)
- ✅ Endpoints nuevos (no reemplazan existentes)
- ✅ i18n es gradual (fallback a inglés)

**Todos los cambios son aditivos. Zero breaking changes.**

---

**Actualización completada:** 2026-03-16
**Status:** ✅ Listo para implementación incremental
