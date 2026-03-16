# Guía de Implementación del Backend

**Versión:** 1.0
**Fecha:** 2026-03-16

---

## 1. Estructura de Carpetas Propuesta

```
app/
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   ├── signup/
│   │   │   └── route.ts
│   │   ├── logout/
│   │   │   └── route.ts
│   │   ├── refresh/
│   │   │   └── route.ts
│   │   └── me/
│   │       └── route.ts
│   ├── tasks/
│   │   ├── route.ts              (GET, POST)
│   │   └── [id]/
│   │       ├── route.ts          (GET, PUT, DELETE)
│   │       ├── snapshots/
│   │       │   └── route.ts
│   │       └── enrich/
│   │           └── route.ts
│   ├── integrations/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── audit-logs/
│   │   └── route.ts
│   └── webhooks/
│       ├── notion/
│       │   └── route.ts
│       └── gitlab/
│           └── route.ts
├── lib/
│   ├── auth/
│   │   ├── jwt.ts
│   │   ├── middleware.ts
│   │   └── supabase.ts
│   ├── db/
│   │   ├── client.ts
│   │   └── schemas.ts
│   ├── security/
│   │   ├── csrf.ts
│   │   ├── rateLimit.ts
│   │   ├── validation.ts
│   │   └── crypto.ts
│   ├── integrations/
│   │   ├── notion.ts
│   │   ├── gitlab.ts
│   │   └── claude.ts
│   ├── audit/
│   │   └── logger.ts
│   └── utils/
│       ├── errors.ts
│       └── response.ts
└── middleware.ts
```

---

## 2. Ejemplos de Código

### 2.1 JWT y Autenticación

#### `lib/auth/jwt.ts`
```typescript
import jwt from 'jsonwebtoken';

export interface JWTClaims {
  sub: string;        // user_id
  email: string;
  role: 'admin' | 'tpo' | 'viewer' | 'integration';
  permissions: string[];
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export function createJWT(payload: Omit<JWTClaims, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000);

  const token = jwt.sign(
    {
      ...payload,
      iat: now,
      exp: now + 15 * 60, // 15 minutos
      iss: 'product-owner-api',
      aud: 'product-owner-web',
    },
    process.env.JWT_SECRET!,
    { algorithm: 'HS256' }
  );

  return token;
}

export function verifyJWT(token: string): JWTClaims {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
      { algorithms: ['HS256'] }
    ) as JWTClaims;
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer') {
    return null;
  }

  return token;
}
```

#### `lib/auth/middleware.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, extractTokenFromHeader } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<Response>,
  options?: {
    requiredRole?: string[];
  }
) {
  return async (request: AuthenticatedRequest) => {
    try {
      // Extraer token
      const authHeader = request.headers.get('Authorization');
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return new NextResponse(
          JSON.stringify({
            error: { code: 'UNAUTHENTICATED', message: 'Missing token' },
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Verificar JWT
      const claims = verifyJWT(token);

      // Validar rol si es requerido
      if (options?.requiredRole && !options.requiredRole.includes(claims.role)) {
        return new NextResponse(
          JSON.stringify({
            error: {
              code: 'INSUFFICIENT_PERMISSIONS',
              message: 'Insufficient permissions',
            },
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Inyectar user en request
      request.user = {
        id: claims.sub,
        email: claims.email,
        role: claims.role,
      };

      return handler(request);
    } catch (error) {
      if (error instanceof Error) {
        return new NextResponse(
          JSON.stringify({
            error: { code: 'INTERNAL_ERROR', message: error.message },
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new NextResponse(
        JSON.stringify({
          error: { code: 'INTERNAL_ERROR', message: 'Unknown error' },
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
```

#### `app/api/auth/login/route.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { createJWT } from '@/lib/auth/jwt';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { validateEmail } from '@/lib/security/validation';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar entrada
    if (!validateEmail(email)) {
      return errorResponse('INVALID_EMAIL', 'Invalid email format', 400);
    }

    if (!password || password.length < 6) {
      return errorResponse('INVALID_PASSWORD', 'Password must be at least 6 characters', 400);
    }

    // Autenticar con Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      return errorResponse(
        'INVALID_CREDENTIALS',
        'Invalid email or password',
        401
      );
    }

    // Obtener usuario de DB
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('supabase_user_id', data.user.id)
      .single();

    if (userError || !user) {
      return errorResponse('USER_NOT_FOUND', 'User not found in database', 401);
    }

    // Generar JWT
    const jwt = createJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: [], // TODO: cargar permisos según rol
    });

    // Actualizar last_login
    await supabase
      .from('users')
      .update({ last_login: new Date() })
      .eq('id', user.id);

    // Auditar login
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'LOGIN',
      resource_type: 'auth',
      status: 'success',
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    });

    // Retornar token en cookie HttpOnly
    const response = successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        access_token: jwt,
      },
      200
    );

    response.cookies.set({
      name: 'access_token',
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutos
    });

    return response;
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 'Server error', 500);
  }
}
```

### 2.2 Rate Limiting

#### `lib/security/rateLimit.ts`
```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export interface RateLimitConfig {
  requests: number;
  window: number; // segundos
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/auth/login': { requests: 5, window: 900 },
  '/api/tasks': { requests: 100, window: 3600 },
  '/api/tasks/:id/enrich': { requests: 10, window: 3600 },
  '/api/webhooks': { requests: 1000, window: 3600 },
};

export async function checkRateLimit(
  userId: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const config = RATE_LIMITS[endpoint] || { requests: 100, window: 3600 };
  const key = `ratelimit:${userId}:${endpoint}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, config.window);
  }

  const ttl = await redis.ttl(key);

  if (current > config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: ttl > 0 ? ttl : 0,
    };
  }

  return {
    allowed: true,
    remaining: config.requests - current,
    resetIn: ttl > 0 ? ttl : 0,
  };
}

export function rateLimitResponse(resetIn: number) {
  return new Response(
    JSON.stringify({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests. Retry after ${resetIn} seconds`,
      },
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(resetIn),
      },
    }
  );
}
```

### 2.3 Validación

#### `lib/security/validation.ts`
```typescript
import { z } from 'zod';

export const emailSchema = z.string().email();

export function validateEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().max(5000).optional(),
  status: z.enum(['draft', 'ready', 'completed']).default('draft'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  source_type: z.enum(['manual', 'notion', 'gitlab']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();

export function validateAndParse<T>(schema: z.ZodSchema, data: unknown): T {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
}

export class ValidationError extends Error {
  constructor(
    public message: string,
    public details: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### 2.4 Auditoría

#### `lib/audit/logger.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AuditEntry {
  user_id?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ERROR';
  resource_type: string;
  resource_id?: string;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failure';
  error_message?: string;
}

export async function logAudit(entry: AuditEntry) {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      ...entry,
      created_at: new Date(),
    });

    if (error) {
      console.error('Failed to log audit:', error);
    }
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}

export async function getAuditLogs(
  userId: string,
  options?: { limit?: number; offset?: number }
) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(options?.offset || 0, (options?.offset || 0) + (options?.limit || 50));

  if (error) throw error;
  return data;
}
```

### 2.5 Respuestas Estandarizadas

#### `lib/utils/response.ts`
```typescript
import { NextResponse } from 'next/server';

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
    },
    { status }
  );
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### 2.6 Crear Snapshot Automático

#### `lib/db/snapshots.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { logAudit } from '@/lib/audit/logger';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createTaskSnapshot(
  taskId: string,
  reason: string,
  userId: string
) {
  try {
    // 1. Obtener tarea actual
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      throw new Error('Task not found');
    }

    // 2. Contar snapshots existentes
    const { count } = await supabase
      .from('task_snapshots')
      .select('*', { count: 'exact' })
      .eq('task_id', taskId);

    // 3. Insertar nuevo snapshot
    const { data: snapshot, error: insertError } = await supabase
      .from('task_snapshots')
      .insert({
        task_id: taskId,
        snapshot_number: (count || 0) + 1,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        enrichment_data: task.enrichment_data,
        change_reason: reason,
        created_by: userId,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // 4. Auditar
    await logAudit({
      user_id: userId,
      action: 'CREATE',
      resource_type: 'snapshot',
      resource_id: snapshot.id,
      status: 'success',
    });

    return snapshot;
  } catch (error) {
    await logAudit({
      user_id: userId,
      action: 'CREATE',
      resource_type: 'snapshot',
      resource_id: taskId,
      status: 'failure',
      error_message: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}

export async function getTaskSnapshots(taskId: string) {
  const { data, error } = await supabase
    .from('task_snapshots')
    .select('*')
    .eq('task_id', taskId)
    .order('snapshot_number', { ascending: true });

  if (error) throw error;
  return data;
}

export async function revertToSnapshot(
  taskId: string,
  snapshotId: string,
  userId: string
) {
  try {
    // 1. Crear snapshot del estado actual (antes de revertir)
    await createTaskSnapshot(taskId, 'revert_preparation', userId);

    // 2. Obtener snapshot a restaurar
    const { data: snapshot, error: getError } = await supabase
      .from('task_snapshots')
      .select('*')
      .eq('id', snapshotId)
      .single();

    if (getError || !snapshot) {
      throw new Error('Snapshot not found');
    }

    // 3. Actualizar tarea
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        title: snapshot.title,
        description: snapshot.description,
        status: snapshot.status,
        priority: snapshot.priority,
        enrichment_data: snapshot.enrichment_data,
      })
      .eq('id', taskId);

    if (updateError) {
      throw updateError;
    }

    // 4. Auditar
    await logAudit({
      user_id: userId,
      action: 'UPDATE',
      resource_type: 'task',
      resource_id: taskId,
      changes: {
        before: { action: 'revert_to_snapshot' },
        after: { snapshot_number: snapshot.snapshot_number },
      },
      status: 'success',
    });

    return snapshot;
  } catch (error) {
    await logAudit({
      user_id: userId,
      action: 'UPDATE',
      resource_type: 'task',
      resource_id: taskId,
      status: 'failure',
      error_message: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}
```

### 2.7 Tasks CRUD

#### `app/api/tasks/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '@/lib/auth/middleware';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';
import { validateAndParse, createTaskSchema } from '@/lib/security/validation';
import { logAudit } from '@/lib/audit/logger';
import { successResponse, errorResponse } from '@/lib/utils/response';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handleGET(request: NextRequest & { user?: any }) {
  if (!request.user) {
    return errorResponse('UNAUTHENTICATED', 'Not authenticated', 401);
  }

  // Rate limit
  const { allowed, resetIn } = await checkRateLimit(
    request.user.id,
    '/api/tasks'
  );
  if (!allowed) {
    return rateLimitResponse(resetIn);
  }

  // Query parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const status = searchParams.get('status');

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', request.user.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return successResponse({
      tasks: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return errorResponse(
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}

async function handlePOST(request: NextRequest & { user?: any }) {
  if (!request.user) {
    return errorResponse('UNAUTHENTICATED', 'Not authenticated', 401);
  }

  // Rate limit
  const { allowed, resetIn } = await checkRateLimit(
    request.user.id,
    '/api/tasks'
  );
  if (!allowed) {
    return rateLimitResponse(resetIn);
  }

  try {
    const body = await request.json();

    // Validar
    const validated = validateAndParse(createTaskSchema, body);

    // Insertar
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: request.user.id,
        ...validated,
      })
      .select()
      .single();

    if (error) throw error;

    // Auditar
    await logAudit({
      user_id: request.user.id,
      action: 'CREATE',
      resource_type: 'task',
      resource_id: task.id,
      changes: { after: task },
      status: 'success',
    });

    return successResponse(task, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse('INVALID_INPUT', error.message, 400);
    }

    await logAudit({
      user_id: request.user.id,
      action: 'CREATE',
      resource_type: 'task',
      status: 'failure',
      error_message: error instanceof Error ? error.message : 'Unknown error',
    });

    return errorResponse(
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}

export const GET = withAuth(handleGET);
export const POST = withAuth(handlePOST, { requiredRole: ['tpo', 'admin'] });
```

---

## 3. Configuración Inicial de Supabase

### SQL para crear tablas

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'viewer',
  status VARCHAR(50) DEFAULT 'active',
  supabase_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  priority VARCHAR(50) DEFAULT 'medium',
  source_type VARCHAR(50),
  source_id VARCHAR(255),
  source_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  enrichment_data JSONB,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Task Snapshots
CREATE TABLE task_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  snapshot_number INT NOT NULL,
  title VARCHAR(500),
  description TEXT,
  status VARCHAR(50),
  priority VARCHAR(50),
  enrichment_data JSONB,
  change_reason VARCHAR(255),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(task_id, snapshot_number)
);

CREATE INDEX idx_snapshots_task_id ON task_snapshots(task_id);

-- Integrations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  integration_type VARCHAR(50) NOT NULL,
  name VARCHAR(255),
  is_connected BOOLEAN DEFAULT FALSE,
  access_token_encrypted VARCHAR(500),
  refresh_token_encrypted VARCHAR(500),
  metadata JSONB,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integrations_user_id ON integrations(user_id);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = supabase_user_id::text);

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid()::text = user_id::text);
```

---

## 4. Environment Variables

```bash
# .env.local
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

REDIS_URL=redis://xxxxx:xxxxx@xxxxx:6379
REDIS_TOKEN=xxxxx

# Notion
NOTION_OAUTH_CLIENT_ID=xxxxx
NOTION_OAUTH_CLIENT_SECRET=xxxxx
NOTION_REDIRECT_URI=http://localhost:3000/callback/notion

# GitLab
GITLAB_OAUTH_CLIENT_ID=xxxxx
GITLAB_OAUTH_CLIENT_SECRET=xxxxx
GITLAB_REDIRECT_URI=http://localhost:3000/callback/gitlab

# Claude API
CLAUDE_API_KEY=xxxxx

NODE_ENV=development
```

---

**Documento creado por:** Backend Expert
**Estado:** Listo para implementación
