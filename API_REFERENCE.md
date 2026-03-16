# API Reference - Product Owner Backend

**Versión:** 1.0
**Base URL:** `http://localhost:3000/api` (dev) | `https://api.product-owner.app` (prod)
**Autenticación:** Bearer Token (JWT) en header `Authorization`

---

## 📌 Convenciones

- Todos los endpoints retornan JSON
- Errores: `{ success: false, error: { code, message } }`
- Éxito: `{ success: true, data: {...} }`
- Timestamps: ISO 8601 format
- Paginación: `limit` y `offset` (no page-based)

---

## 🔐 Authentication Endpoints

### POST /auth/login
Autenticar usuario con email y contraseña.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "tpo"
    },
    "access_token": "eyJhbGc..."
  }
}
```

**Errors:**
- `400 Bad Request` - Email o contraseña inválidos
- `401 Unauthorized` - Credenciales incorrectas

---

### POST /auth/signup
Registrar nuevo usuario.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "viewer"
    }
  }
}
```

**Errors:**
- `400 Bad Request` - Email ya existe o contraseña débil
- `422 Unprocessable Entity` - Datos inválidos

---

### POST /auth/logout
Cerrar sesión del usuario.

**Request:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

---

### POST /auth/refresh
Obtener nuevo access token usando refresh token.

**Request:**
```
Cookie: refresh_token=...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc..."
  }
}
```

**Errors:**
- `401 Unauthorized` - Token inválido o expirado

---

### GET /auth/me
Obtener información del usuario actual.

**Request:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "tpo",
    "created_at": "2026-03-16T10:00:00Z",
    "last_login": "2026-03-16T14:30:00Z"
  }
}
```

---

## 📝 Tasks Endpoints

### GET /tasks
Listar tareas del usuario con filtros y paginación.

**Query Parameters:**
- `limit` (default: 20, max: 100)
- `offset` (default: 0)
- `status` (draft | ready | completed)
- `priority` (low | medium | high)
- `search` (búsqueda en título/descripción)

**Request:**
```
Authorization: Bearer <token>
GET /tasks?limit=20&offset=0&status=ready
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_uuid",
        "title": "Fix API authentication",
        "description": "Implement JWT...",
        "status": "ready",
        "priority": "high",
        "source_type": "manual",
        "enrichment_data": null,
        "created_at": "2026-03-16T10:00:00Z",
        "updated_at": "2026-03-16T14:30:00Z"
      }
    ],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 42,
      "pages": 3
    }
  }
}
```

**Errors:**
- `401 Unauthorized` - No autenticado

---

### POST /tasks
Crear nueva tarea.

**Request:**
```json
{
  "title": "Fix API authentication",
  "description": "Implement JWT with refresh...",
  "status": "draft",
  "priority": "high",
  "source_type": "manual"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "task_uuid",
    "user_id": "user_uuid",
    "title": "Fix API authentication",
    "description": "Implement JWT with refresh...",
    "status": "draft",
    "priority": "high",
    "source_type": "manual",
    "enrichment_data": null,
    "created_at": "2026-03-16T14:30:00Z",
    "updated_at": "2026-03-16T14:30:00Z"
  }
}
```

**Errors:**
- `400 Bad Request` - Título requerido
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Role insuficiente

---

### GET /tasks/:id
Obtener detalle de una tarea.

**Request:**
```
Authorization: Bearer <token>
GET /tasks/task_uuid
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task_uuid",
    "user_id": "user_uuid",
    "title": "Fix API authentication",
    "description": "...",
    "status": "ready",
    "priority": "high",
    "source_type": "notion",
    "source_id": "notion_page_id",
    "source_url": "https://notion.so/...",
    "enrichment_data": {
      "source": "notion",
      "properties": {...},
      "content": "..."
    },
    "created_at": "2026-03-16T10:00:00Z",
    "updated_at": "2026-03-16T14:30:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `404 Not Found` - Tarea no existe o acceso denegado

---

### PUT /tasks/:id
Actualizar una tarea.

**Request:**
```json
{
  "title": "Fix API authentication (updated)",
  "status": "ready",
  "priority": "medium"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task_uuid",
    "title": "Fix API authentication (updated)",
    "status": "ready",
    "priority": "medium",
    "updated_at": "2026-03-16T15:00:00Z"
  }
}
```

**Errors:**
- `400 Bad Request` - Datos inválidos
- `403 Forbidden` - No es propietario
- `404 Not Found` - Tarea no existe

---

### DELETE /tasks/:id
Eliminar tarea (soft delete).

**Request:**
```
Authorization: Bearer <token>
DELETE /tasks/task_uuid
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { "message": "Task deleted successfully" }
}
```

**Errors:**
- `403 Forbidden` - No es propietario
- `404 Not Found` - Tarea no existe

---

## 🎨 Task Snapshots Endpoints

### GET /tasks/:id/snapshots
Listar snapshots de una tarea.

**Request:**
```
Authorization: Bearer <token>
GET /tasks/task_uuid/snapshots
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "snapshot_uuid",
      "task_id": "task_uuid",
      "snapshot_number": 1,
      "title": "Fix API authentication",
      "status": "draft",
      "priority": "high",
      "change_reason": "enrichment_started",
      "created_by": "user_uuid",
      "created_at": "2026-03-16T10:00:00Z"
    },
    {
      "id": "snapshot_uuid_2",
      "task_id": "task_uuid",
      "snapshot_number": 2,
      "title": "Fix API authentication",
      "status": "draft",
      "priority": "high",
      "change_reason": "enrichment_completed",
      "created_by": "user_uuid",
      "created_at": "2026-03-16T10:05:00Z"
    }
  ]
}
```

---

### POST /tasks/:id/snapshots
Crear snapshot manual.

**Request:**
```json
{
  "reason": "Before major refactoring"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "snapshot_uuid",
    "snapshot_number": 3,
    "change_reason": "manual",
    "created_at": "2026-03-16T15:00:00Z"
  }
}
```

---

### POST /tasks/:id/snapshots/:snapshotId/revert
Revertir tarea a snapshot anterior.

**Request:**
```
Authorization: Bearer <token>
POST /tasks/task_uuid/snapshots/snapshot_uuid/revert
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "task": {...},
    "message": "Reverted to snapshot 2"
  }
}
```

---

## 🔄 Enrichment Endpoints

### POST /tasks/:id/enrich
Enriquecer tarea con datos de fuente externa.

**Request:**
```json
{
  "source": "notion",
  "options": {
    "page_id": "notion_page_id"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_uuid",
      "title": "Fix API authentication",
      "enrichment_data": {
        "source": "notion",
        "page_id": "...",
        "properties": {...},
        "content": "..."
      },
      "updated_at": "2026-03-16T15:00:00Z"
    },
    "snapshots_created": 2
  }
}
```

**Sources válidos:**
- `notion` - Requiere integración Notion conectada
- `gitlab` - Requiere integración GitLab conectada
- `claude` - Requiere API key de Claude

**Errors:**
- `400 Bad Request` - Source no válida o integración no conectada
- `404 Not Found` - Tarea no existe
- `429 Too Many Requests` - Límite de enriquecimiento excedido

---

### GET /tasks/:id/enrichment-status
Obtener estado del enriquecimiento.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "completed|pending|failed",
    "source": "notion",
    "last_enriched": "2026-03-16T14:30:00Z",
    "error_message": null
  }
}
```

---

## 🔌 Integrations Endpoints

### GET /integrations
Listar integraciones del usuario.

**Request:**
```
Authorization: Bearer <token>
GET /integrations
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "integration_uuid",
      "integration_type": "notion",
      "name": "My Notion Workspace",
      "is_connected": true,
      "last_sync": "2026-03-16T14:30:00Z",
      "created_at": "2026-03-01T10:00:00Z"
    },
    {
      "id": "integration_uuid_2",
      "integration_type": "gitlab",
      "name": "My GitLab",
      "is_connected": false,
      "last_sync": null,
      "created_at": "2026-03-15T10:00:00Z"
    }
  ]
}
```

---

### POST /integrations/:type/authorize
Iniciar OAuth flow para integración.

**Request:**
```
GET /integrations/notion/authorize
```

**Response (302 Redirect):**
Redirige a `https://api.notion.com/v1/oauth/authorize?...`

---

### POST /integrations/:type/callback
Callback de OAuth (manejado por frontend después de autorización).

**Request:**
```json
{
  "code": "oauth_code_from_provider"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "integration": {
      "id": "integration_uuid",
      "integration_type": "notion",
      "is_connected": true
    }
  }
}
```

---

### POST /integrations/:id/test
Probar conexión de integración.

**Request:**
```
Authorization: Bearer <token>
POST /integrations/integration_uuid/test
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "connection_status": "healthy",
    "message": "Successfully connected to Notion API",
    "last_checked": "2026-03-16T15:00:00Z"
  }
}
```

**Errors:**
- `400 Bad Request` - Integración no conectada
- `504 Gateway Timeout` - No se pudo conectar al servicio

---

### DELETE /integrations/:id
Desconectar integración.

**Request:**
```
Authorization: Bearer <token>
DELETE /integrations/integration_uuid
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { "message": "Integration disconnected" }
}
```

---

## 📋 Audit Logs Endpoints (Admin Only)

### GET /audit-logs
Listar logs de auditoría (Admin only).

**Query Parameters:**
- `user_id` - Filtrar por usuario
- `resource_type` - task | user | integration | auth
- `action` - CREATE | UPDATE | DELETE | LOGIN | LOGOUT | ERROR
- `from_date` - ISO 8601 date
- `to_date` - ISO 8601 date
- `limit` (default: 50, max: 500)
- `offset` (default: 0)

**Request:**
```
Authorization: Bearer <admin_token>
GET /audit-logs?user_id=user_uuid&resource_type=task&action=UPDATE&limit=50
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "audit_uuid",
      "user_id": "user_uuid",
      "action": "UPDATE",
      "resource_type": "task",
      "resource_id": "task_uuid",
      "changes": {
        "before": { "status": "draft" },
        "after": { "status": "ready" }
      },
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "status": "success",
      "created_at": "2026-03-16T15:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 342
  }
}
```

**Errors:**
- `403 Forbidden` - Solo Admin puede acceder

---

### GET /audit-logs/export
Exportar logs en CSV/JSON.

**Query Parameters:**
- `format` - csv | json
- `from_date` - ISO 8601
- `to_date` - ISO 8601

**Request:**
```
GET /audit-logs/export?format=csv&from_date=2026-03-01&to_date=2026-03-16
```

**Response (200 OK):**
Content-Disposition: attachment; filename="audit_logs.csv"

---

## ❌ Error Codes

| Code | HTTP | Descripción |
|------|------|-------------|
| `UNAUTHENTICATED` | 401 | Token faltante o inválido |
| `INSUFFICIENT_PERMISSIONS` | 403 | Role no tiene permiso |
| `INVALID_INPUT` | 400 | Datos enviados son inválidos |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `CONFLICT` | 409 | Conflicto (ej: email duplicado) |
| `RATE_LIMIT_EXCEEDED` | 429 | Demasiadas requests |
| `INTEGRATION_NOT_CONNECTED` | 400 | Integración no disponible |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

---

## 🔒 Rate Limits

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| POST /auth/login | 5 | 15 min |
| POST /auth/signup | 3 | 1 hora |
| GET /tasks | 100 | 1 hora |
| POST /tasks | 50 | 1 hora |
| POST /tasks/:id/enrich | 10 | 1 hora |
| GET /integrations | 100 | 1 hora |
| POST /integrations/:id/test | 20 | 1 hora |
| GET /audit-logs | 10 | 1 hora |

**Headers de Rate Limit:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1710694200
Retry-After: 3600
```

---

## 📦 Webhooks

### POST /webhooks/notion
Webhook para sincronización de cambios desde Notion.

**Request (from Notion):**
```json
{
  "type": "page_changed|page_deleted",
  "timestamp": "2026-03-16T15:00:00Z",
  "object": {
    "id": "page_id",
    "properties": {...}
  }
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

### POST /webhooks/gitlab
Webhook para sincronización desde GitLab.

**Request (from GitLab):**
```json
{
  "event_type": "issue_event|push_event",
  "timestamp": "2026-03-16T15:00:00Z",
  "object_kind": "issue|push",
  "object_attributes": {...}
}
```

---

## 🎯 Ejemplos de Uso

### Flujo Completo: Login → Create Task → Enrich

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
# Response: { access_token: "jwt..." }

# 2. Crear tarea
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer jwt..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix API",
    "status": "draft",
    "priority": "high"
  }'
# Response: { task: {...} }

# 3. Enriquecer con Notion
curl -X POST http://localhost:3000/api/tasks/task_uuid/enrich \
  -H "Authorization: Bearer jwt..." \
  -H "Content-Type: application/json" \
  -d '{
    "source": "notion",
    "options": {"page_id": "notion_page_id"}
  }'
# Response: { task: {..., enrichment_data: {...}} }

# 4. Ver snapshots
curl -X GET http://localhost:3000/api/tasks/task_uuid/snapshots \
  -H "Authorization: Bearer jwt..."
# Response: { snapshots: [...] }
```

---

**API Reference v1.0**
**Generado:** 2026-03-16
**Estado:** ✅ Listo para integración frontend
