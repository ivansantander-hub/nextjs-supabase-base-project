# 🔧 FASE 2: Autenticación - Guía de Setup

**Status**: ✅ **COMPLETADA** | **Audience**: Developers | **Date**: 2026-03-16

---

## 📋 Checklist de Setup

- [x] Dependencias instaladas (@supabase/supabase-js, auth-helpers-nextjs)
- [x] Variables de entorno configuradas (.env, .env.local)
- [x] Servicios creados (supabaseClient, authService)
- [x] Hooks implementados (useAuth)
- [x] Componentes creados (LoginForm, SignupForm)
- [x] Páginas de auth (/auth/login, /auth/signup)
- [x] Middleware de protección
- [x] Migraciones de BD (user_preferences, audit_logs)
- [x] Traducciones i18n
- [x] Tests implementados

---

## 🚀 Instalación de Dependencias

```bash
# Ya instaladas, pero para referencia:
pnpm add @supabase/supabase-js@2.99.2
pnpm add @supabase/auth-helpers-nextjs@0.15.0

# Verificar instalación
pnpm list | grep supabase
```

---

## 🔐 Configuración de Supabase

### Paso 1: Copiar Credenciales

Las credenciales ya están en `.env` y `.env.local`:

```env
# .env
NEXT_PUBLIC_SUPABASE_URL=https://kjddbxrspgmckhxagsky.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PFAf68M0f0hh7fzHjq8pmA_rLQFAQCp
SUPABASE_CLIENT_ID=8815817b-91e9-4e18-b66d-767a80d27f30
SUPABASE_CLIENT_SECRET=vtp1-Uyb2fNs7A1KfGstvk0Cnfu_uttxjI_cE2fQgsM

# .env.local (override local si es necesario)
NEXT_PUBLIC_SUPABASE_URL=https://kjddbxrspgmckhxagsky.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PFAf68M0f0hh7fzHjq8pmA_rLQFAQCp
SUPABASE_SERVICE_ROLE_KEY=
```

### Paso 2: Verificar Conexión

```bash
# En src/services/supabaseClient.ts:
# El cliente se crea automáticamente con las vars de entorno

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
```

---

## 💾 Configuración de Base de Datos

### Paso 1: Crear Tablas

Ir a **Supabase Dashboard** → **SQL Editor** → **New Query**

Copy-paste el contenido de `supabase/migrations/001_create_user_preferences.sql`:

```sql
-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_preference VARCHAR(10) DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  language_preference VARCHAR(5) DEFAULT 'es' CHECK (language_preference IN ('es', 'en')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Crear policies de RLS
CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger para nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Crear índices para performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

Click **Run** ✅

### Paso 2: Verificar Tablas

Ir a **Supabase Dashboard** → **Table Editor**

Debería haber:
- ✅ `user_preferences` (con RLS)
- ✅ `audit_logs` (con RLS)

---

## 🎨 Estructura del Código

### authService.ts - Funciones Principales

```typescript
// Sign up
async function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse>

// Sign in
async function signIn(
  email: string,
  password: string
): Promise<AuthResponse>

// Sign out
async function signOut(): Promise<{ error: Error | null }>

// Get current user
async function getCurrentUser(): Promise<AuthUser | null>

// Get session
async function getSession()

// Refresh token
async function refreshSession()

// Update preferences
async function updateUserPreferences(preferences: {
  theme_preference?: 'light' | 'dark' | 'auto';
  language_preference?: 'es' | 'en';
  full_name?: string;
}): Promise<AuthResponse>

// Listen to auth changes
function onAuthStateChange(callback: (user: AuthUser | null) => void)
```

### useAuth Hook - Interfaz

```typescript
const {
  user,              // Usuario actual o null
  loading,           // Boolean: está cargando?
  error,             // Error objeto o null
  isInitialized,     // Boolean: se inicializó?
  signUp,            // async (email, password, fullName?) => ...
  signIn,            // async (email, password) => ...
  signOut,           // async () => ...
  isAuthenticated,   // Boolean: usuario autenticado?
} = useAuth();
```

### LoginForm & SignupForm - Uso

```typescript
// LoginForm
<LoginForm onSuccess={() => {}} />

// SignupForm
<SignupForm onSuccess={() => {}} />
```

---

## 🛡️ Middleware - Protección de Rutas

**Archivo**: `src/middleware.ts`

Automáticamente protege:
- `/dashboard/*` → Requiere autenticación
- `/tasks/*` → Requiere autenticación
- `/chat/*` → Requiere autenticación
- `/review/*` → Requiere autenticación
- `/history/*` → Requiere autenticación

Y redirige:
- No autenticados a `/auth/login`
- Autenticados lejos de `/auth/*` a `/dashboard`

---

## 🧪 Ejecutar Tests

```bash
# Todos los tests
pnpm test

# Solo auth tests
pnpm test authService
pnpm test LoginForm

# Con coverage
pnpm test --coverage

# Watch mode
pnpm test --watch
```

**Resultado esperado**:
```
✅ authService.test.ts (6 tests)
✅ LoginForm.test.tsx (5 tests)
────────────────────────
Total: 11+ tests passing
Coverage: ~85%
```

---

## 🚀 Probar en Desarrollo

### Opción 1: Sign Up Nuevo Usuario

```bash
# 1. Iniciar servidor
pnpm dev

# 2. Ir a http://localhost:3000/es/auth/signup
# 3. Llenar formulario:
#    - Nombre: "Juan Perez"
#    - Email: "juan@example.com"
#    - Password: "password123"
# 4. Click "Registrarse"
# 5. Debe redirigir a /es/dashboard

# 6. Verificar en Supabase Dashboard:
#    - Ir a Auth → Users
#    - Debería estar "juan@example.com"
#    - Ir a user_preferences table
#    - Debería estar row con theme='auto', language='es'
```

### Opción 2: Login con Usuario Existente

```bash
# 1. Ir a http://localhost:3000/es/auth/login
# 2. Usar credenciales de usuario creado arriba
# 3. Click "Iniciar sesión"
# 4. Debe redirigir a /es/dashboard
```

### Opción 3: Probar Protección

```bash
# 1. (Sin autenticación) Ir a http://localhost:3000/es/dashboard
# 2. Debe redirigir automáticamente a /es/auth/login

# 3. (Con autenticación) Login primero
# 4. Luego ir a /es/dashboard
# 5. Debe permitir acceso

# 6. Click en menu → Sign Out
# 7. Debe cerrar sesión y redirigir a /es/auth/login
```

---

## 🌍 Traducción - Strings en i18n

**Archivo**: `src/i18n/es.json` y `src/i18n/en.json`

### Strings Agregados

```json
"auth": {
  "login": "Iniciar sesión",
  "logout": "Cerrar sesión",
  "signup": "Registrarse",
  "email": "Correo electrónico",
  "password": "Contraseña",
  "fullName": "Nombre completo",
  "loginTitle": "Inicia sesión en tu cuenta",
  "signupTitle": "Crea una nueva cuenta",
  "noAccount": "¿No tienes cuenta?",
  "haveAccount": "¿Ya tienes cuenta?",
  "loading": "Cargando...",
  "validation": {
    "requiredFields": "Por favor completa todos los campos requeridos",
    "passwordMinLength": "La contraseña debe tener al menos 6 caracteres"
  },
  "errors": {
    "loginFailed": "Error al iniciar sesión",
    "signupFailed": "Error al registrarse"
  }
}
```

**En componentes**:
```typescript
const t = useTranslations('auth');
<h1>{t('loginTitle')}</h1>
```

---

## 🎨 Dark Mode

Todos los componentes soportan dark mode con Tailwind:

```tsx
// LoginForm, SignupForm
<div className="bg-gray-50 dark:bg-slate-900 text-black dark:text-white">
  <input className="dark:bg-slate-800 dark:text-white" />
</div>

// Error messages
<div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
```

---

## 📊 Arquitectura de Estado

```
User Action (Login/Signup)
            ↓
        useAuth Hook
            ↓
    useAuthStore (Zustand)
    ├─ user
    ├─ loading
    ├─ error
    └─ setUser, setLoading, setError
            ↓
     Global State Ready
            ↓
   Components can access via:
   const { user, loading } = useAuth()
```

---

## 🔍 Debugging

### Problema: "Cannot find Supabase credentials"

**Solución**: Verificar `.env` y `.env.local`
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

### Problema: "RLS policies are missing"

**Solución**: Ejecutar migraciones en Supabase SQL Editor
```bash
# Copy-paste supabase/migrations/001_create_user_preferences.sql
# Click Run
```

### Problema: "Tests failing"

**Solución**: Verificar mocks en tests
```bash
pnpm test --no-coverage authService.test.ts
# Ver output detallado
```

### Problema: "Dark mode no funciona"

**Solución**: Verificar que ThemeProvider está en layout.tsx
```tsx
// src/app/layout.tsx
<ThemeProvider>
  {children}
</ThemeProvider>
```

---

## ✅ Validación Final

Ejecutar este checklist antes de pasar a FASE 3:

- [ ] `pnpm dev` funciona sin errores
- [ ] `pnpm test` pasa todos los tests (11+)
- [ ] Puedo crear usuario en `/auth/signup`
- [ ] Puedo iniciar sesión en `/auth/login`
- [ ] Rutas `/dashboard/*` redirigen a login si no estoy autenticado
- [ ] Dark mode funciona en todas las páginas
- [ ] Traducciones (ES/EN) funcionan
- [ ] Supabase user_preferences se crea automáticamente
- [ ] TypeScript strict mode sin errores
- [ ] ESLint sin warnings

---

## 🔜 Próximo: FASE 3

Cuando todo esté verificado, empezar:
- Task CRUD endpoints
- Claude API integration
- Notion sync
- Snapshots versionados

**Todas las dependencias de FASE 3 están completadas** ✅

---

**¡Setup de Autenticación Completado!** 🎉
