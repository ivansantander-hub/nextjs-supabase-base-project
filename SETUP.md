# Setup Guía - Next.js + Supabase Boilerplate

Sigue estos pasos para configurar el boilerplate en tu máquina local.

## 1️⃣ Clonar Repositorio

```bash
git clone <your-repo-url>
cd nextjs-supabase-boilerplate
pnpm install
```

## 2️⃣ Crear Proyecto Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. Espera a que se inicialice (2-3 minutos)
4. Ve a **Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 3️⃣ Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local e insertar tus credenciales de Supabase
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
# SUPABASE_SERVICE_ROLE_KEY=your-key
```

## 4️⃣ Configurar Autenticación en Supabase

En el dashboard de Supabase:

### Email/Password
1. Ve a **Authentication → Providers**
2. Habilita **Email Provider** (por defecto está activo)
3. (Opcional) Ve a **Email Templates** y personaliza mensajes

### Social Login (Opcional)
1. Ve a **Authentication → Providers**
2. Habilita Google, GitHub, etc.
3. Añade credenciales de OAuth de cada proveedor

### Configurar URLs de Redireccionamiento
1. Ve a **Authentication → URL Configuration**
2. Añade tu URL local:
   - `Site URL`: http://localhost:3000
   - `Redirect URLs`:
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/dashboard
     ```

Para producción:
- `Site URL`: https://tu-dominio.com
- Redirect URLs con tu dominio real

## 5️⃣ Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 6️⃣ Probar Autenticación

1. **Sign Up**: Ve a `/auth/signup` y crea una cuenta
2. **Login**: Ve a `/auth/login` e inicia sesión
3. **Dashboard**: Accede a `/dashboard` (requiere estar autenticado)

## 🔐 Configuración Seguridad (Recomendado)

### Row Level Security (RLS)

En Supabase SQL Editor, ejecuta:

```sql
-- Tabla de perfiles de usuarios
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: cada usuario solo ve su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: cada usuario puede actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

## 🌍 Internacionalización

El boilerplate soporta:
- **Español** (es)
- **Inglés** (en)

Para cambiar idioma:
1. Edita `src/i18n/config.ts`
2. Las rutas automáticamente incluyen el locale: `/es/`, `/en/`

## 🎨 Personalizar Branding

1. **Logo**: Reemplaza `public/logo.svg`
2. **Colores**: Edita variables en `src/app/globals.css`
3. **Tipografía**: Modifica imports en `src/app/layout.tsx`
4. **Textos**: Actualiza traducciones en `src/i18n/`

## 🚀 Deploy a Producción

### Con Vercel (Recomendado)

```bash
# Instalar CLI de Vercel
pnpm install -g vercel

# Deploy
vercel --prod
```

O conecta tu repositorio GitHub directamente en vercel.com

### Variables de Entorno en Vercel

En Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
```

**⚠️ Importante**: `NEXT_PUBLIC_*` variables son públicas. Usa `SUPABASE_SERVICE_ROLE_KEY` solo en variables privadas del servidor.

## ❓ Troubleshooting

### Error: "Cannot find module '@supabase/...'"

```bash
pnpm install
```

### Error: "Invalid Supabase URL"

Verifica que `NEXT_PUBLIC_SUPABASE_URL` esté correctamente configurado en `.env.local`.

### Error: "Unauthorized" en login

1. Verifica que Email Provider esté habilitado en Supabase
2. Checa que la URL de callback esté configurada correctamente
3. Revisa los logs en Supabase Dashboard → Authentication

### Dark mode no funciona

Asegúrate que `next-themes` está instalado y que `ThemeProvider` está en `layout.tsx`.

## 📚 Recursos Útiles

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)

## 🎯 Próximos Pasos

1. Personaliza el boilerplate para tu caso de uso
2. Crea nuevas rutas en `src/app/[locale]/`
3. Añade tablas a Supabase según necesites
4. Implementa lógica de negocio en componentes
5. Deploya a producción cuando esté listo

---

¡Listo para empezar! 🚀
