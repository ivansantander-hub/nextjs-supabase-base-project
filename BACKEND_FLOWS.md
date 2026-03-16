# Flujos de Arquitectura del Backend

**Versión:** 1.0
**Fecha:** 2026-03-16

---

## 1. Flujo Completo de Autenticación y Autorización

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE AUTENTICACIÓN COMPLETO                           │
└─────────────────────────────────────────────────────────────────────────────────┘

[USUARIO]
   │
   │ 1. Envía email + password
   ↓
[FRONTEND]
   │ POST /api/auth/login
   │ { email, password }
   ↓
[BACKEND - HANDLER LOGIN]
   │
   ├─→ 2. Validar formato email
   │      (Zod schema)
   │
   ├─→ 3. Validar contraseña (length >= 6)
   │
   ├─→ 4. Llamar Supabase Auth
   │      supabase.auth.signInWithPassword()
   │         │
   │         ├─→ Si error: retornar 401
   │         ├─→ Si success: obtener user_id + tokens
   │
   ├─→ 5. Buscar usuario en DB
   │      SELECT * FROM users
   │      WHERE supabase_user_id = ?
   │
   ├─→ 6. Generar JWT interno
   │      JWT Claims: { sub, email, role, permissions, iat, exp }
   │      Duración: 15 minutos
   │
   ├─→ 7. Actualizar last_login
   │      UPDATE users SET last_login = NOW()
   │
   ├─→ 8. Crear audit log
   │      INSERT INTO audit_logs
   │      { user_id, action: 'LOGIN', status: 'success' }
   │
   └─→ 9. Retornar respuesta
       Cookies:
         - access_token (HttpOnly, Secure, SameSite=Strict)
       Body:
         { user: {...}, access_token: "jwt..." }
           │
           ↓
       [FRONTEND]
       - Guarda JWT en memoria
       - Guarda refresh_token en HttpOnly cookie
       - Redirige a /dashboard


┌─────────────────────────────────────────────────────────────────────────────────┐
│                     VALIDACIÓN DE REQUESTS SUBSECUENTES                          │
└─────────────────────────────────────────────────────────────────────────────────┘

[USUARIO]
   │
   │ Hace request a /api/tasks
   │ Header: Authorization: Bearer <jwt>
   ↓
[FRONTEND]
   │ GET /api/tasks
   │ Header: { Authorization: Bearer <jwt> }
   ↓
[NEXT.JS MIDDLEWARE]
   │
   ├─→ 1. Extraer JWT del header
   │      Authorization.split(' ')[1]
   │
   ├─→ 2. Verificar firma JWT
   │      jwt.verify(token, JWT_SECRET)
   │
   ├─→ 3. Validar no expirado
   │      if (now > exp):
   │         Intentar refresh
   │         POST /api/auth/refresh con refresh_token
   │
   ├─→ 4. Extraer claims
   │      { sub, email, role, permissions }
   │
   ├─→ 5. Inyectar en request
   │      request.user = { id, email, role }
   │
   ├─→ 6. Verificar permisos si requerido
   │      if (requiredRole && !requiredRole.includes(role)):
   │         retornar 403 Forbidden
   │
   └─→ 7. Llamar handler
       request.user está disponible en la función
```

---

## 2. Flujo de Enriquecimiento de Tareas

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       FLUJO DE ENRIQUECIMIENTO DE TAREAS                          │
└─────────────────────────────────────────────────────────────────────────────────┘

[USUARIO - Frontend]
   │
   │ Click en "Enriquecer tarea"
   │ Selecciona fuente: Notion / GitLab / Claude
   ↓
[FRONTEND]
   │ POST /api/tasks/:id/enrich
   │ { source: 'notion', options: {...} }
   ↓
[BACKEND - HANDLER ENRICH]
   │
   ├─→ 1. Validar autenticación
   │      JWT válido
   │
   ├─→ 2. Autorizar TPO/Admin
   │      role in ['tpo', 'admin']
   │
   ├─→ 3. Obtener tarea
   │      SELECT * FROM tasks WHERE id = ? AND user_id = ?
   │      if not found: retornar 404
   │
   ├─→ 4. Obtener integración
   │      SELECT * FROM integrations
   │      WHERE user_id = ? AND integration_type = source
   │      if not connected: retornar 400
   │
   ├─→ 5. Desencriptar token
   │      decrypt(access_token_encrypted)
   │
   ├─→ 6. Crear snapshot PRE-enriquecimiento
   │      INSERT INTO task_snapshots
   │      { reason: 'enrichment_started' }
   │
   ├─→ 7. Según fuente, enriquecer
   │
   │   ┌─ NOTION ─────────────────────────┐
   │   │ Llamar: notionClient.fetch()     │
   │   │ Obtener: propiedades, contenido  │
   │   │ Parsear datos                    │
   │   └──────────────────────────────────┘
   │
   │   ┌─ GITLAB ─────────────────────────┐
   │   │ Llamar: gitlabClient.getIssue()  │
   │   │ Obtener: description, commits    │
   │   │ Parsear datos                    │
   │   └──────────────────────────────────┘
   │
   │   ┌─ CLAUDE ─────────────────────────┐
   │   │ Llamar: claudeClient.analyze()   │
   │   │ Enviar contenido actual          │
   │   │ Obtener: recomendaciones         │
   │   └──────────────────────────────────┘
   │
   ├─→ 8. Actualizar tarea con datos
   │      UPDATE tasks
   │      SET enrichment_data = {...}, updated_at = NOW()
   │      WHERE id = ?
   │
   ├─→ 9. Crear snapshot POST-enriquecimiento
   │      INSERT INTO task_snapshots
   │      { reason: 'enrichment_completed' }
   │
   ├─→ 10. Auditar
   │       INSERT INTO audit_logs
   │       { action: 'UPDATE', resource_type: 'task' }
   │
   └─→ 11. Retornar tarea actualizada
       { task: {..., enrichment_data: {...}} }
           │
           ↓
       [FRONTEND]
       - Actualiza UI con datos enriquecidos
       - Muestra snapshot history
```

---

## 3. Flujo de Snapshots (Versionado)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          CREACIÓN AUTOMÁTICA DE SNAPSHOTS                        │
└─────────────────────────────────────────────────────────────────────────────────┘

[EVENTO TRIGGER]
   │
   ├─ Cambio de estado (draft → ready → completed)
   ├─ Enriquecimiento completado
   ├─ Manual (usuario hace click)
   └─ Diario (cron job cada 24h)
   │
   ↓
[FUNCIÓN: createTaskSnapshot(taskId, reason, userId)]
   │
   ├─→ 1. Obtener tarea actual
   │      SELECT * FROM tasks WHERE id = taskId
   │
   ├─→ 2. Contar snapshots existentes
   │      SELECT COUNT(*) FROM task_snapshots WHERE task_id = taskId
   │
   ├─→ 3. Insertar snapshot
   │      INSERT INTO task_snapshots
   │      {
   │        task_id,
   │        snapshot_number: count + 1,
   │        title, description, status, priority,
   │        enrichment_data,
   │        change_reason: reason,
   │        created_by: userId
   │      }
   │
   ├─→ 4. Auditar creación
   │      INSERT INTO audit_logs
   │      { action: 'CREATE', resource_type: 'snapshot' }
   │
   └─→ 5. Retornar snapshot creado
       { snapshot: {..., snapshot_number: N} }


┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REVERTIR A SNAPSHOT ANTERIOR                           │
└─────────────────────────────────────────────────────────────────────────────────┘

[USUARIO - Frontend]
   │
   │ Selecciona snapshot anterior
   │ Click "Revertir a esta versión"
   ↓
[FRONTEND]
   │ POST /api/tasks/:id/snapshots/:snapshotId/revert
   ↓
[BACKEND - HANDLER REVERT]
   │
   ├─→ 1. Validar autenticación y permisos
   │
   ├─→ 2. Crear snapshot del estado ACTUAL
   │      insertSnapshot(taskId, 'revert_preparation', userId)
   │      Esto preserva el estado antes del revert
   │
   ├─→ 3. Obtener snapshot a restaurar
   │      SELECT * FROM task_snapshots WHERE id = snapshotId
   │
   ├─→ 4. Actualizar tarea con datos del snapshot
   │      UPDATE tasks
   │      SET {
   │        title: snapshot.title,
   │        description: snapshot.description,
   │        status: snapshot.status,
   │        priority: snapshot.priority,
   │        enrichment_data: snapshot.enrichment_data
   │      }
   │      WHERE id = taskId
   │
   ├─→ 5. Auditar revert
   │      INSERT INTO audit_logs
   │      {
   │        action: 'UPDATE',
   │        changes: {
   │          before: { action: 'revert_to_snapshot' },
   │          after: { snapshot_number: snapshotId }
   │        }
   │      }
   │
   └─→ 6. Retornar tarea restaurada
       { task: {...} }
           │
           ↓
       [FRONTEND]
       - Actualiza UI
       - Muestra confirmación
       - Permite ver history
```

---

## 4. Flujo de Integración con Notion/GitLab (OAuth)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FLUJO OAUTH - CONECTAR NOTION                          │
└─────────────────────────────────────────────────────────────────────────────────┘

[USUARIO - Frontend]
   │
   │ Click "Conectar Notion"
   ↓
[FRONTEND]
   │ Redirige a:
   │ https://api.notion.com/v1/oauth/authorize?
   │   client_id=xxx
   │   redirect_uri=https://app/callback/notion
   │   response_type=code
   ↓
[NOTION - AUTHORIZATION PAGE]
   │
   │ Usuario autoriza acceso
   │ Notion redirige a:
   │ https://app/callback/notion?code=xxx
   ↓
[FRONTEND - CALLBACK HANDLER]
   │
   │ Extrae code del URL
   │ POST /api/integrations/notion/callback { code }
   ↓
[BACKEND - CALLBACK HANDLER]
   │
   ├─→ 1. Validar code
   │      if (!code) retornar 400
   │
   ├─→ 2. Intercambiar code por access_token
   │      POST https://api.notion.com/v1/oauth/token
   │      {
   │        code,
   │        grant_type: 'authorization_code',
   │        client_id: NOTION_CLIENT_ID,
   │        client_secret: NOTION_CLIENT_SECRET,
   │        redirect_uri: NOTION_REDIRECT_URI
   │      }
   │
   ├─→ 3. Obtener access_token
   │
   ├─→ 4. Encriptar token
   │      encrypted = encrypt(access_token, ENCRYPTION_KEY)
   │
   ├─→ 5. Verificar integración existente
   │      SELECT * FROM integrations
   │      WHERE user_id = ? AND integration_type = 'notion'
   │
   ├─→ 6. Actualizar o insertar
   │      If exists:
   │        UPDATE integrations
   │        SET access_token_encrypted = ?, is_connected = true
   │      Else:
   │        INSERT INTO integrations
   │        { user_id, integration_type: 'notion', access_token_encrypted, ... }
   │
   ├─→ 7. Probar conexión
   │      GET https://api.notion.com/v1/users/me
   │      Con header: Authorization: Bearer <token>
   │      if error: marcar como is_connected = false
   │
   ├─→ 8. Auditar
   │      INSERT INTO audit_logs
   │      { action: 'CREATE', resource_type: 'integration' }
   │
   └─→ 9. Retornar éxito
       { success: true, integration: {...} }
           │
           ↓
       [FRONTEND]
       - Actualiza estado
       - Muestra confirmación
       - Habilita opción de enriquecer


┌─────────────────────────────────────────────────────────────────────────────────┐
│                    USAR INTEGRACIÓN - ENRIQUECER DESDE NOTION                    │
└─────────────────────────────────────────────────────────────────────────────────┘

[USUARIO]
   │
   │ Selecciona enriquecer con Notion
   ├─ URL de página Notion
   │ o ID de página
   ↓
[FRONTEND]
   │ POST /api/tasks/:id/enrich
   │ { source: 'notion', page_id: '...' }
   ↓
[BACKEND - ENRICH HANDLER]
   │
   ├─→ 1. Obtener integración
   │      SELECT * FROM integrations
   │      WHERE user_id = ? AND integration_type = 'notion'
   │      AND is_connected = true
   │      if not found: retornar 400 "No integration"
   │
   ├─→ 2. Desencriptar token
   │      access_token = decrypt(encrypted)
   │
   ├─→ 3. Llamar Notion API
   │      GET https://api.notion.com/v1/pages/{page_id}
   │      Headers: { Authorization: Bearer <token> }
   │
   ├─→ 4. Si error (token expirado):
   │      POST https://api.notion.com/v1/oauth/token
   │      { grant_type: 'refresh_token', ... }
   │      Obtener nuevo token
   │      Actualizar en DB
   │
   ├─→ 5. Parsear respuesta de Notion
   │      - Propiedades
   │      - Contenido (bloques)
   │      - Metadata
   │
   ├─→ 6. Crear snapshot pre-enriquecimiento
   │
   ├─→ 7. Actualizar tarea
   │      UPDATE tasks
   │      SET enrichment_data = {
   │        source: 'notion',
   │        page_id: '...',
   │        properties: {...},
   │        content: '...',
   │        synced_at: NOW()
   │      }
   │
   ├─→ 8. Crear snapshot post-enriquecimiento
   │
   ├─→ 9. Auditar
   │
   └─→ 10. Retornar tarea enriquecida
```

---

## 5. Flujo de Rate Limiting

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            FLUJO DE RATE LIMITING                                │
└─────────────────────────────────────────────────────────────────────────────────┘

[USUARIO]
   │
   │ Hace 101 requests a /api/tasks en 1 hora
   │ (límite = 100 por hora)
   ↓
[BACKEND - HANDLER]
   │
   ├─→ 1. Antes de procesar request
   │      Llamar checkRateLimit(userId, endpoint)
   │
   ├─→ 2. Generar key Redis
   │      key = f"ratelimit:{user_id}:/api/tasks:{hour}"
   │
   ├─→ 3. Incrementar contador
   │      current = INCR key
   │
   ├─→ 4. Si primera vez en ventana
   │      EXPIRE key 3600  (1 hora)
   │
   ├─→ 5. Comparar con límite
   │      if (current > 100):
   │        retornar { allowed: false, resetIn: TTL }
   │      else:
   │        retornar { allowed: true, remaining: 100 - current }
   │
   ├─→ 6. Si no permitido
   │      return Response 429 (Too Many Requests)
   │      Headers:
   │        Retry-After: 3600
   │        X-RateLimit-Limit: 100
   │        X-RateLimit-Remaining: 0
   │        X-RateLimit-Reset: <unix_timestamp>
   │
   │      Body:
   │        { error: { code: 'RATE_LIMIT_EXCEEDED' } }
   │
   └─→ 7. Si permitido
       Continuar con procesamiento normal


CONFIGURACIÓN DE LÍMITES:

┌─────────────────────────────────────────────────┐
│ Endpoint                    │ Límite  │ Ventana │
├─────────────────────────────────────────────────┤
│ /api/auth/login             │ 5       │ 15 min  │
│ /api/auth/signup            │ 3       │ 1 hora  │
│ /api/tasks                  │ 100     │ 1 hora  │
│ /api/tasks/:id/enrich       │ 10      │ 1 hora  │
│ /api/webhooks/*             │ 1000    │ 1 hora  │
│ /api/integrations/:id/test  │ 20      │ 1 hora  │
└─────────────────────────────────────────────────┘
```

---

## 6. Flujo de Auditoría Completa

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE AUDITORÍA COMPLETA                              │
└─────────────────────────────────────────────────────────────────────────────────┘

CUALQUIER ACCIÓN:  LOGIN | CREATE | UPDATE | DELETE | ERROR
   │
   ↓
[AUDIT LOGGER]
   │
   ├─→ 1. Recolectar información
   │      - user_id
   │      - action (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, ERROR)
   │      - resource_type (task, user, integration, auth)
   │      - resource_id
   │      - changes (before/after para UPDATE/DELETE)
   │      - ip_address (from request headers)
   │      - user_agent (from request headers)
   │      - status (success/failure)
   │      - error_message (si error)
   │      - timestamp
   │
   ├─→ 2. Validar datos
   │      - Completitud de campos
   │      - Formatos válidos
   │
   ├─→ 3. Encriptar datos sensibles (si aplica)
   │      - No encriptar IDs ni tipos
   │      - Encriptar contenido sensible en changes
   │
   ├─→ 4. Insertar en audit_logs
   │      INSERT INTO audit_logs
   │      { user_id, action, resource_type, resource_id, changes, ... }
   │      WHERE created_at = NOW()
   │
   ├─→ 5. (Opcional) Enviar a servicio externo
   │      POST https://logging-service/events
   │      { audit_log }
   │
   └─→ 6. Registrar en console (dev)
       console.log(auditEntry)


CONSULTAR AUDITORÍA:

[ADMIN]
   │
   │ GET /api/audit-logs
   │   ?user_id=xxx
   │   &resource_type=task
   │   &action=UPDATE
   │   &from_date=2026-03-01
   │   &to_date=2026-03-16
   │   &limit=50
   │   &offset=0
   ↓
[BACKEND]
   │
   ├─→ 1. Verificar que es Admin
   │      if (role !== 'admin'): retornar 403
   │
   ├─→ 2. Construir query con filtros
   │      SELECT *
   │      FROM audit_logs
   │      WHERE (user_id = ? OR user_id IS NULL)
   │        AND (resource_type = ? OR resource_type IS NULL)
   │        AND (action = ? OR action IS NULL)
   │        AND created_at BETWEEN ? AND ?
   │      ORDER BY created_at DESC
   │      LIMIT 50 OFFSET 0
   │
   ├─→ 3. Ejecutar query
   │
   ├─→ 4. Retornar resultados
   │      { logs: [...], total: N, offset: 0 }
   │
   └─→ 5. (Opcional) Exportar a CSV
       GET /api/audit-logs/export?format=csv
       → archivo CSV descargable


EJEMPLO DE AUDIT LOG:

{
  "id": "audit_12345",
  "user_id": "user_abc",
  "action": "UPDATE",
  "resource_type": "task",
  "resource_id": "task_123",
  "changes": {
    "before": {
      "status": "draft",
      "priority": "medium"
    },
    "after": {
      "status": "ready",
      "priority": "high"
    }
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "status": "success",
  "created_at": "2026-03-16T14:30:45Z"
}
```

---

## 7. Arquitectura General del Sistema

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                          ARQUITECTURA DEL SISTEMA                               │
└────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │  USUARIO/CLIENTE │
                              └────────┬─────────┘
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 │                     │                     │
                 ↓                     ↓                     ↓
            ┌────────────┐      ┌──────────────┐      ┌────────────┐
            │  FRONTEND  │      │  NEXT.JS API │      │  WEBHOOKS  │
            │  (React)   │      │  (Backend)   │      │  (Notion,  │
            └────────────┘      └──────────────┘      │   GitLab)  │
                 │                     │               └────────────┘
                 └─────────────────────┼─────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │ NEXT.JS MIDDLEWARE           │                              │
        │ - Auth verification          │                              │
        │ - CSRF check                 │                              │
        │ - Rate limiting              │                              │
        │ - Request logging            │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ↓                              ↓                              ↓
   ┌──────────┐                 ┌────────────┐            ┌──────────────┐
   │ SUPABASE │                 │ REDIS      │            │ EXTERNAL API │
   │ - Auth   │                 │ - Sessions │            │ - Notion     │
   │ - DB     │                 │ - Cache    │            │ - GitLab     │
   │ - RLS    │                 │ - Rate Limits           │ - Claude     │
   └──────────┘                 └────────────┘            │ - GitHub     │
        │                                                  └──────────────┘
        │                                                       │
        ├─ users                                               │
        ├─ tasks                    ┌────────────────────────┘
        ├─ task_snapshots           │
        ├─ integrations             ↓
        ├─ audit_logs        ┌──────────────┐
        ├─ session_tokens    │ INTEGRATION  │
        └─ rate_limits       │ SERVICES     │
                             │ - Notion SDK │
                             │ - GitLab API │
                             │ - Claude API │
                             └──────────────┘
```

---

## 8. Estados y Transiciones de Tareas

```
                          ┌───────────┐
                          │   DRAFT   │
                          └─────┬─────┘
                                │ (usuario edita/enriquece)
                                ↓
                          ┌───────────┐
                    ┌────▶│  READY    │◀───┐
                    │     └─────┬─────┘     │
                    │           │          │ (cambios)
        (cambios)   │           │ (completa)
                    │           ↓          │
              ┌─────────────────────────────┐
              │      COMPLETED              │
              └─────────────────────────────┘

EVENTOS QUE CREAN SNAPSHOTS:

┌─────────────────────────────────────────────────────────┐
│ EVENTO                      │ SNAPSHOT REASON              │
├─────────────────────────────────────────────────────────┤
│ cambio de status            │ 'status_change'            │
│ cambio de prioridad         │ 'priority_change'          │
│ enriquecimiento completado  │ 'enrichment_completed'     │
│ snapshot manual             │ 'manual'                   │
│ snapshot diario (cron)      │ 'daily_snapshot'           │
│ revert a snapshot anterior  │ 'revert_preparation'       │
└─────────────────────────────────────────────────────────┘

HISTOREO COMPLETO:

Snapshot 1: Task creada
  { title: "Fix API", status: "draft", enrichment_data: null }

Snapshot 2: Enriquecida con Notion
  { title: "Fix API", status: "draft", enrichment_data: {...} }

Snapshot 3: Status cambió a ready
  { title: "Fix API", status: "ready", enrichment_data: {...} }

Snapshot 4: Priority cambió a high
  { title: "Fix API", status: "ready", priority: "high", enrichment_data: {...} }

Snapshot 5: Completada
  { title: "Fix API", status: "completed", priority: "high", enrichment_data: {...} }

Usuario puede:
- Ver todas las versiones
- Ver diferencias (diff)
- Revertir a cualquier versión anterior
- Exportar historia completa
```

---

**Documento creado por:** Backend Expert
**Estado:** Listo para referencia durante implementación
