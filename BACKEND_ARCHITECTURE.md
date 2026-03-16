# Arquitectura de Backend - Sistema de Enriquecimiento de Tareas Técnicas

**Versión:** 1.0
**Fecha:** 2026-03-16
**Responsable:** Backend Expert

---

## 1. Visión General

Sistema de backend basado en **Next.js 16** con **Supabase** como plataforma de autenticación, base de datos y almacenamiento. El sistema enriquece tareas técnicas integrando datos de Notion, GitLab, Claude API y otros servicios externos.

### Stack Tecnológico
- **Frontend/Backend:** Next.js 16 (Full-stack)
- **Auth:** Supabase Auth (JWT)
- **Database:** PostgreSQL (Supabase)
- **External APIs:** Notion, GitLab, Claude AI, OpenAI
- **Rate Limiting:** Redis (o Upstash Redis)
- **Logging:** Structured logging a Supabase
- **Auditoría:** Tabla de audit logs en PostgreSQL

---

## 2. Modelo de Roles y Permisos

### Roles Definidos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Admin** | Administrador del sistema | Acceso total, gestionar usuarios, ver auditoría completa |
| **TPO** | Technical Product Owner | Crear/editar/eliminar tareas, ver auditoría de sus recursos |
| **Viewer** | Visualizador | Solo lectura de tareas públicas, sin edición |
| **Integration** | Usuario de sistemas (para bots/integraciones) | APIs específicas con scope limitado |

### Matriz de Permisos por Endpoint

```
┌─────────────────────────────────────────────────────────────────┐
│                      MATRIZ DE PERMISOS                          │
├─────────────────────────────────────────────────────────────────┤
│ Endpoint                  │ GET │ POST │ PUT │ DELETE │ Rol Min │
├─────────────────────────────────────────────────────────────────┤
│ /api/tasks                │  ✓  │  ✓   │  -  │   -    │  TPO   │
│ /api/tasks/:id            │  ✓  │  -   │  ✓  │   ✓    │  TPO   │
│ /api/tasks/:id/snapshots  │  ✓  │  ✓   │  -  │   -    │  TPO   │
│ /api/tasks/:id/enrich     │  -  │  ✓   │  -  │   -    │  TPO   │
│ /api/audit-logs           │  ✓  │  -   │  -  │   -    │ Admin  │
│ /api/users                │  ✓  │  -   │  -  │   -    │ Admin  │
│ /api/integrations         │  ✓  │  ✓   │  ✓  │   ✓    │  TPO   │
│ /api/webhooks             │  -  │  ✓   │  -  │   -    │  Public│
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura de Endpoints API

### 3.1 Autenticación

```
POST   /api/auth/login              - Login con email/password
POST   /api/auth/signup             - Registro de nuevo usuario
POST   /api/auth/logout             - Logout (invalida token)
POST   /api/auth/refresh            - Refresh JWT token
GET    /api/auth/me                 - Obtener info del usuario actual
POST   /api/auth/password-reset     - Solicitar reset de contraseña
POST   /api/auth/verify-email       - Verificar email
```

### 3.2 Tareas

```
GET    /api/tasks                   - Listar tareas (con filtros, paginación)
POST   /api/tasks                   - Crear nueva tarea
GET    /api/tasks/:id               - Obtener detalle de tarea
PUT    /api/tasks/:id               - Actualizar tarea
DELETE /api/tasks/:id               - Eliminar tarea (soft delete)
PATCH  /api/tasks/:id/status        - Actualizar solo el estado
POST   /api/tasks/batch             - Operaciones en batch
```

### 3.3 Enriquecimiento de Tareas

```
POST   /api/tasks/:id/enrich        - Enriquecer tarea con datos externos
  Request: { source: 'notion|gitlab|claude', options: {...} }

GET    /api/tasks/:id/enrichment-status - Ver estado del enriquecimiento
```

### 3.4 Snapshots (Versiones)

```
GET    /api/tasks/:id/snapshots     - Listar snapshots de una tarea
POST   /api/tasks/:id/snapshots     - Crear snapshot manual
GET    /api/tasks/:id/snapshots/:snapshotId - Obtener snapshot específico
DELETE /api/tasks/:id/snapshots/:snapshotId - Eliminar snapshot
```

### 3.5 Integraciones

```
GET    /api/integrations            - Listar integraciones configuradas
POST   /api/integrations            - Registrar nueva integración
GET    /api/integrations/:id        - Obtener datos de integración
PUT    /api/integrations/:id        - Actualizar integración
DELETE /api/integrations/:id        - Desconectar integración
POST   /api/integrations/:id/test   - Probar conexión
```

### 3.6 Webhooks

```
POST   /api/webhooks/notion         - Webhook de Notion
POST   /api/webhooks/gitlab         - Webhook de GitLab
POST   /api/webhooks/github         - Webhook de GitHub
```

### 3.7 Auditoría y Logs

```
GET    /api/audit-logs              - Listar logs de auditoría (Admin only)
GET    /api/audit-logs/user/:userId - Logs de un usuario específico
POST   /api/audit-logs/export       - Exportar logs en CSV/JSON
```

### 3.8 Gestión de Usuarios (Admin)

```
GET    /api/users                   - Listar usuarios
GET    /api/users/:id               - Obtener detalle de usuario
PUT    /api/users/:id               - Actualizar usuario
DELETE /api/users/:id               - Eliminar usuario
PUT    /api/users/:id/role          - Cambiar rol del usuario
```

---

## 4. Autenticación y Autorización

### 4.1 Flujo de Autenticación

```
┌────────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                       │
└────────────────────────────────────────────────────────────────┘

1. Usuario ingresa email/password en frontend
   ↓
2. Frontend -> POST /api/auth/login
   ↓
3. Backend valida con Supabase Auth
   ↓
4. Supabase retorna: { access_token, refresh_token, user }
   ↓
5. Backend:
   - Obtiene/crea usuario en tabla 'users'
   - Asigna rol por defecto (Viewer)
   - Genera JWT interno con claims: [user_id, email, role]
   ↓
6. Backend retorna JWT en HttpOnly cookie + refresh token
   ↓
7. Frontend almacena JWT en memoria, refresh_token en HttpOnly cookie
   ↓
8. Requests posteriores incluyen JWT en header: Authorization: Bearer <jwt>
```

### 4.2 JWT Claims

```typescript
{
  sub: string,           // user_id de Supabase
  email: string,
  role: 'admin' | 'tpo' | 'viewer' | 'integration',
  permissions: string[],
  iat: number,
  exp: number,
  iss: 'product-owner-api',
  aud: 'product-owner-web'
}
```

### 4.3 Estrategia de Tokens

| Tipo | Duración | Almacenamiento | Uso |
|------|----------|-----------------|-----|
| **Access Token** | 15 minutos | HttpOnly Cookie | Autenticación |
| **Refresh Token** | 7 días | HttpOnly Cookie | Renovación |
| **Session** | 24 horas | Base de datos | Control de sesión |

### 4.4 Middleware de Autenticación

```typescript
// Middleware a implementar en Next.js
export async function authMiddleware(request) {
  // 1. Extraer JWT de cookie o header
  // 2. Validar firma y expiración
  // 3. Si expirado -> intentar refresh con refresh_token
  // 4. Si refresh válido -> emitir nuevo JWT
  // 5. Si ambos inválidos -> redirigir a login
  // 6. Inyectar user context en request
}
```

---

## 5. Modelo de Datos (Supabase PostgreSQL)

### 5.1 Tablas Principales

#### Tabla: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'viewer',
  status VARCHAR(50) DEFAULT 'active',
  supabase_user_id UUID UNIQUE NOT NULL,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supabase_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Tabla: `tasks`
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  priority VARCHAR(50) DEFAULT 'medium',
  source_type VARCHAR(50), -- 'manual', 'notion', 'gitlab'
  source_id VARCHAR(255),   -- ID externo
  source_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  enrichment_data JSONB,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_is_deleted ON tasks(is_deleted);
```

#### Tabla: `task_snapshots`
```sql
CREATE TABLE task_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL,
  snapshot_number INT NOT NULL,
  title VARCHAR(500),
  description TEXT,
  status VARCHAR(50),
  priority VARCHAR(50),
  enrichment_data JSONB,
  change_reason VARCHAR(255),
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(task_id, snapshot_number)
);

CREATE INDEX idx_snapshots_task_id ON task_snapshots(task_id);
```

#### Tabla: `integrations`
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  integration_type VARCHAR(50) NOT NULL, -- 'notion', 'gitlab', 'github'
  name VARCHAR(255),
  is_connected BOOLEAN DEFAULT FALSE,
  access_token_encrypted VARCHAR(500),
  refresh_token_encrypted VARCHAR(500),
  metadata JSONB,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_integrations_type ON integrations(integration_type);
```

#### Tabla: `audit_logs`
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
  resource_type VARCHAR(100), -- 'task', 'user', 'integration'
  resource_id VARCHAR(255),
  changes JSONB, -- { before: {...}, after: {...} }
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

#### Tabla: `session_tokens`
```sql
CREATE TABLE session_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_session_tokens_user_id ON session_tokens(user_id);
CREATE INDEX idx_session_tokens_expires_at ON session_tokens(expires_at);
```

#### Tabla: `rate_limits`
```sql
CREATE TABLE rate_limits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  endpoint VARCHAR(255),
  request_count INT DEFAULT 1,
  window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_rate_limits_user_id ON rate_limits(user_id);
CREATE INDEX idx_rate_limits_endpoint ON rate_limits(endpoint);
```

### 5.2 Relaciones y Constraints

```
users (1) ──── (N) tasks
users (1) ──── (N) task_snapshots (as created_by)
users (1) ──── (N) integrations
users (1) ──── (N) audit_logs
users (1) ──── (N) session_tokens
tasks (1) ──── (N) task_snapshots
```

---

## 6. Seguridad

### 6.1 CSRF Protection

```typescript
// Implementar CSRF tokens en formularios
// 1. Generar token único por sesión
// 2. Incluir en formularios HTML y request headers
// 3. Validar en middleware antes de mutaciones (POST, PUT, DELETE)

// Next.js con middleware
export function csrfToken(request) {
  const token = crypto.randomUUID();
  // Almacenar en session
  return token;
}
```

### 6.2 Rate Limiting

```typescript
// Rate limits por endpoint y usuario
const RATE_LIMITS = {
  '/api/auth/login': { requests: 5, window: 900 },     // 5 por 15 min
  '/api/tasks': { requests: 100, window: 3600 },       // 100 por hora
  '/api/tasks/:id/enrich': { requests: 10, window: 3600 }, // 10 por hora
  '/api/webhooks/*': { requests: 1000, window: 3600 }, // 1000 por hora
};

// Implementación con Redis:
// - Key: `ratelimit:${user_id}:${endpoint}:${window}`
// - Incrementar contador
// - Si > límite -> 429 Too Many Requests
```

### 6.3 Validación de Inputs

```typescript
// Usar Zod o similar para validación
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  status: z.enum(['draft', 'ready', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
});

// En endpoint:
export async function POST(request) {
  const data = await request.json();
  const validated = createTaskSchema.parse(data); // Lanza si inválido
  // ... procesar
}
```

### 6.4 Encriptación de Datos Sensibles

```typescript
// Tokens de integraciones
function encryptToken(token: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return cipher.update(token, 'utf8', 'hex') + cipher.final('hex');
}

// Usar en tabla integrations:
// access_token_encrypted: encryptToken(access_token)
```

### 6.5 CORS y Headers de Seguridad

```typescript
// Middleware de seguridad
export function securityHeaders(response) {
  response.set('X-Content-Type-Options', 'nosniff');
  response.set('X-Frame-Options', 'DENY');
  response.set('X-XSS-Protection', '1; mode=block');
  response.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.set('Content-Security-Policy', "default-src 'self'");
  response.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}

// CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://product-owner.app',
];
```

---

## 7. Auditoría y Logging

### 7.1 Qué Auditar

| Evento | Tabla | Campos |
|--------|-------|--------|
| Login | audit_logs | user_id, ip_address, success/failure |
| Crear tarea | audit_logs | user_id, task_id, datos iniciales |
| Actualizar tarea | audit_logs | user_id, task_id, before/after |
| Eliminar tarea | audit_logs | user_id, task_id, razón |
| Crear snapshot | audit_logs | user_id, task_id, reason |
| Cambiar rol usuario | audit_logs | admin_id, user_id, old_role, new_role |
| Error API | audit_logs | user_id, endpoint, error_message |

### 7.2 Estructura de Audit Log

```typescript
interface AuditLog {
  id: string;
  user_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ERROR';
  resource_type: 'task' | 'user' | 'integration' | 'auth';
  resource_id: string;
  changes: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  ip_address: string;
  user_agent: string;
  status: 'success' | 'failure';
  error_message?: string;
  created_at: timestamp;
}
```

### 7.3 Logging de Errores

```typescript
// Centralizar en servicio de logging
export async function logError(error: Error, context: any) {
  const log = {
    timestamp: new Date(),
    message: error.message,
    stack: error.stack,
    context,
    environment: process.env.NODE_ENV,
  };

  // Guardar en Supabase y console en dev
  await supabase.from('error_logs').insert(log);
  console.error(log);
}
```

---

## 8. Snapshots (Versionado de Tareas)

### 8.1 Estrategia de Snapshots

```
┌─────────────────────────────────────────────────────────────┐
│              ESTRATEGIA DE SNAPSHOTS                         │
└─────────────────────────────────────────────────────────────┘

1. Auto-snapshots:
   - Antes de cada cambio significativo
   - Enriquecimiento completado
   - Cambio de estado
   - Cada 24 horas (snapshot diario)

2. Manual snapshots:
   - Usuario puede crear snapshot en cualquier momento
   - Con razón/nota del cambio

3. Recuperación:
   - Versión anterior completa
   - Diff visualizado en UI
   - Revertir a snapshot anterior
```

### 8.2 Estructura de Snapshot

```typescript
interface TaskSnapshot {
  id: string;
  task_id: string;
  snapshot_number: number; // 1, 2, 3...

  // Contenido congelado
  title: string;
  description: string;
  status: string;
  priority: string;
  enrichment_data: Record<string, any>;

  // Metadata
  change_reason: string; // 'enrichment', 'status_change', 'manual'
  created_by: string;
  created_at: timestamp;
}
```

### 8.3 Crear Snapshot

```typescript
export async function createSnapshot(
  taskId: string,
  reason: string,
  userId: string
) {
  // 1. Obtener tarea actual
  const task = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  // 2. Contar snapshots existentes
  const { count } = await supabase
    .from('task_snapshots')
    .select('*', { count: 'exact' })
    .eq('task_id', taskId);

  // 3. Insertar nuevo snapshot
  const snapshot = await supabase
    .from('task_snapshots')
    .insert({
      task_id: taskId,
      snapshot_number: count + 1,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      enrichment_data: task.enrichment_data,
      change_reason: reason,
      created_by: userId,
    });

  // 4. Auditar
  await logAudit({
    action: 'CREATE',
    resource_type: 'snapshot',
    resource_id: snapshot.id,
  });
}
```

---

## 9. Manejo de Errores

### 9.1 Códigos HTTP y Respuestas

```typescript
// Respuesta estándar de error
interface ApiError {
  success: false;
  error: {
    code: string;        // 'INVALID_INPUT', 'UNAUTHORIZED', etc.
    message: string;
    details?: Record<string, any>;
  };
  request_id: string;
}

// Ejemplos:
400 Bad Request
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Title is required",
    "details": { "field": "title" }
  }
}

401 Unauthorized
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Invalid or expired token"
  }
}

403 Forbidden
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "User does not have permission to delete this resource"
  }
}

429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Retry after 60 seconds"
  }
}

500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "request_id": "req_12345"
  }
}
```

### 9.2 Manejo Centralizado

```typescript
// middleware/errorHandler.ts
export async function errorHandler(
  error: Error,
  request: Request
) {
  // Log error
  await logError(error, {
    path: request.url,
    method: request.method,
  });

  // Determinar respuesta
  if (error instanceof ValidationError) {
    return new Response(JSON.stringify({
      error: {
        code: 'INVALID_INPUT',
        message: error.message,
      },
    }), { status: 400 });
  }

  if (error instanceof AuthenticationError) {
    return new Response(JSON.stringify({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Invalid credentials',
      },
    }), { status: 401 });
  }

  // ... más tipos de error

  // Default
  return new Response(JSON.stringify({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Server error',
    },
  }), { status: 500 });
}
```

---

## 10. Integraciones Externas

### 10.1 OAuth Flows

#### Notion
```
1. Usuario hace click "Conectar Notion"
2. Redirigir a: https://api.notion.com/v1/oauth/authorize?
   client_id=xxx&redirect_uri=https://app/callback/notion&response_type=code
3. Notion redirige a: /callback/notion?code=xxx
4. Backend intercambia code por access_token
5. Guardar en tabla integrations (encriptado)
6. Marcar como is_connected = true
```

#### GitLab/GitHub
```
Similar a Notion, pero con scopes apropiados:
- GitLab: api, read_user
- GitHub: repo, user
```

### 10.2 Validación de Webhooks

```typescript
// Verificar firma del webhook
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## 11. Testing y Deployment

### 11.1 Tests a Implementar

```
Authentication:
  ✓ Login con credenciales válidas
  ✓ Login con credenciales inválidas
  ✓ Refresh token expirado
  ✓ Token JWT inválido

Authorization:
  ✓ TPO puede editar sus tareas
  ✓ Viewer no puede editar
  ✓ Admin puede cambiar roles

Tasks:
  ✓ Crear tarea válida
  ✓ Validación de campos requeridos
  ✓ Soft delete mantiene auditoría
  ✓ Snapshots se crean automáticamente

Rate Limiting:
  ✓ Bloquear después de N requests
  ✓ Reset de window después de X segundos

Audit:
  ✓ Todos los cambios se registran
  ✓ No se pueden modificar audit logs
```

### 11.2 Environment Variables Necesarios

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Auth
JWT_SECRET=xxxxx
ENCRYPTION_KEY=xxxxx

# External APIs
NOTION_OAUTH_CLIENT_ID=xxxxx
NOTION_OAUTH_CLIENT_SECRET=xxxxx
GITLAB_OAUTH_CLIENT_ID=xxxxx
GITLAB_OAUTH_CLIENT_SECRET=xxxxx
CLAUDE_API_KEY=xxxxx

# Redis (Rate Limiting)
REDIS_URL=redis://xxxxx

# Logging
LOG_LEVEL=info

# Environment
NODE_ENV=production
```

---

## 12. Checklist de Implementación

### Fase 1: Foundation (Week 1-2)
- [ ] Setup Supabase (Auth, PostgreSQL)
- [ ] Crear tablas (users, tasks, integrations, audit_logs)
- [ ] Implementar JWT middleware
- [ ] Auth endpoints (login, signup, refresh)
- [ ] Basic rate limiting

### Fase 2: Core APIs (Week 3-4)
- [ ] Task CRUD endpoints
- [ ] Snapshot functionality
- [ ] Audit logging
- [ ] Error handling centralizado

### Fase 3: Integraciones (Week 5-6)
- [ ] Notion OAuth integration
- [ ] GitLab OAuth integration
- [ ] Webhook handlers
- [ ] Data enrichment APIs

### Fase 4: Security & Ops (Week 7+)
- [ ] CSRF protection
- [ ] Input validation (Zod)
- [ ] Security headers
- [ ] Logging infrastructure
- [ ] Test suite completo
- [ ] Documentation de APIs
- [ ] CI/CD pipeline

---

## 13. Referencias y Recursos

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Notion API](https://developers.notion.com/)
- [GitLab API](https://docs.gitlab.com/ee/api/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Documento creado por:** Backend Expert
**Última actualización:** 2026-03-16
**Estado:** Para implementación
