# Resumen Ejecutivo - Backend Architecture

**Versión:** 1.0
**Fecha:** 2026-03-16
**Responsable:** Backend Expert

---

## 📋 Visión General

Sistema backend completo basado en **Next.js 16** + **Supabase** con autenticación JWT, auditoría completa y soporte para integraciones externas (Notion, GitLab, Claude API).

---

## 🎯 Puntos Clave

### 1. **Autenticación (Auth)**
- Supabase Auth + JWT interno (15 min)
- Refresh tokens (7 días)
- HttpOnly cookies para seguridad
- Rate limiting en login (5 intentos / 15 min)

### 2. **Autorización (Roles)**
```
Admin       → Acceso total + auditoría
TPO         → Crear/editar tareas + integraciones
Viewer      → Solo lectura
Integration → Acceso por API para bots
```

### 3. **Endpoints Principales**
```
POST   /api/auth/login              - Login
GET    /api/tasks                   - Listar tareas
POST   /api/tasks                   - Crear tarea
PUT    /api/tasks/:id               - Editar tarea
POST   /api/tasks/:id/enrich        - Enriquecer con datos externos
GET    /api/tasks/:id/snapshots     - Ver versiones anteriores
GET    /api/integrations            - Integraciones configuradas
POST   /api/integrations/:id/test   - Probar conexión
```

### 4. **Base de Datos**
7 tablas principales:
- `users` - Usuarios del sistema
- `tasks` - Tareas técnicas
- `task_snapshots` - Versionado de tareas
- `integrations` - OAuth tokens encriptados
- `audit_logs` - Registro completo de cambios
- `session_tokens` - Control de sesiones
- `rate_limits` - Control de límites

### 5. **Seguridad**
✅ CSRF tokens
✅ Rate limiting por endpoint/usuario
✅ Input validation con Zod
✅ Encriptación de tokens sensibles
✅ Headers de seguridad (CSP, HSTS, etc.)
✅ RLS (Row Level Security) en Supabase

### 6. **Auditoría**
- Cada acción registrada: CREATE, UPDATE, DELETE, LOGIN, ERROR
- Cambios guardados (before/after)
- IP address + User Agent
- Filtrable por usuario/recurso/fecha
- Exportable a CSV/JSON

### 7. **Snapshots (Versionado)**
- Auto-snapshot en cambios importantes
- Manual snapshot cuando quiera el usuario
- Revertir a versión anterior
- Historial completo visible

---

## 📊 Matriz de Responsabilidades

| Feature | Next.js | Supabase | Redis |
|---------|---------|----------|-------|
| **Auth** | JWT generation | Supabase Auth | - |
| **Rate Limiting** | Check before handler | - | Key-Value store |
| **Database** | Queries | PostgreSQL | - |
| **Encryption** | Token encrypt/decrypt | - | - |
| **Sessions** | Cookie management | Session storage | Caching |
| **Audit** | Trigger logging | Audit logs storage | - |

---

## 🔄 Flujos Críticos

### Autenticación
```
1. User login → Supabase Auth
2. Get access_token (Supabase)
3. Generate JWT (Backend)
4. Return HttpOnly cookie + token
5. Future requests validate JWT
```

### Enriquecimiento
```
1. User selects source (Notion/GitLab/Claude)
2. Fetch integration token (encrypted)
3. Create pre-enrich snapshot
4. Call external API
5. Update task with data
6. Create post-enrich snapshot
7. Log audit entry
```

### Rate Limiting
```
1. Before each request
2. Check Redis: ratelimit:user_id:endpoint
3. If exceeded → 429 Too Many Requests
4. Else → increment counter
```

---

## 🛠️ Stack Propuesto

```yaml
Frontend:
  - Next.js 16 (API Routes)
  - React 19
  - TypeScript
  - Zod (validation)
  - TailwindCSS

Backend:
  - Next.js 16 (API Routes)
  - jsonwebtoken
  - @supabase/supabase-js
  - @upstash/redis
  - node-crypto

Database:
  - PostgreSQL (Supabase)
  - JWT tokens
  - Audit logging

External:
  - Supabase Auth
  - Redis (Upstash)
  - Notion API
  - GitLab API
  - Claude API
  - OpenAI API
```

---

## 📝 Environment Variables (Min)

```bash
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
ENCRYPTION_KEY
REDIS_URL
REDIS_TOKEN
NOTION_OAUTH_CLIENT_ID
NOTION_OAUTH_CLIENT_SECRET
GITLAB_OAUTH_CLIENT_ID
GITLAB_OAUTH_CLIENT_SECRET
CLAUDE_API_KEY
NODE_ENV
```

---

## ✅ Checklist Implementación Rápida

### Fase 1 (Week 1)
- [ ] Setup Supabase + PostgreSQL
- [ ] Crear tablas (SQL)
- [ ] Implementar JWT
- [ ] Auth endpoints (login, signup)
- [ ] Rate limiting middleware

### Fase 2 (Week 2)
- [ ] Task CRUD endpoints
- [ ] Snapshots functionality
- [ ] Audit logging
- [ ] Error handling

### Fase 3 (Week 3)
- [ ] Notion OAuth
- [ ] GitLab OAuth
- [ ] Data enrichment APIs
- [ ] Webhooks

### Fase 4 (Week 4+)
- [ ] Tests unitarios
- [ ] Integration tests
- [ ] Security review
- [ ] CI/CD pipeline
- [ ] Documentation

---

## 🚨 Decisiones Críticas Tomadas

1. **JWT + Cookies**: Seguridad sin vulnerabilidades de CORS
2. **Supabase**: Solución integrada (Auth + DB + RLS)
3. **Redis**: Rate limiting en memoria (rápido)
4. **Snapshots automáticos**: No perder información de cambios
5. **Auditoría completa**: Compliance y debugging
6. **Encriptación de tokens**: Cumplimiento de seguridad

---

## 📚 Documentos Relacionados

1. **BACKEND_ARCHITECTURE.md** - Diseño detallado
2. **BACKEND_IMPLEMENTATION.md** - Código de ejemplo
3. **BACKEND_FLOWS.md** - Diagramas de flujos

---

## 🤝 Próximos Pasos

1. **Team Lead**: Revisar y aprobar diseño
2. **Frontend Expert**: Revisar endpoints e integración
3. **Backend Expert**: Comenzar implementación (Phase 1)
4. **QA**: Preparar plan de testing

---

## 📞 Preguntas Frecuentes

**¿Por qué Supabase en lugar de Firebase?**
- PostgreSQL > Firestore para relaciones complejas
- RLS integrado
- Mejor control de datos
- Open source option

**¿Por qué JWT local en lugar de solo Supabase?**
- Control granular de roles/permisos
- Refresh automático sin llamadas
- Compatible con middleware
- Mejor para auditoría

**¿Cuánto almacenamiento para snapshots?**
- ~1-5KB por snapshot típicamente
- 100 tareas × 10 snapshots × 2KB = 2MB
- Escalable sin problemas

**¿Cómo manejar tokens expirados en integraciones?**
- Usar refresh_token de OAuth
- Ejecutar en background
- Reintentar transparente
- Notificar si no se puede

---

**Documento actualizado:** 2026-03-16
**Estado:** ✅ APROBADO PARA IMPLEMENTACIÓN
