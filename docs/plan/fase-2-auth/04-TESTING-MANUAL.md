# 🧪 FASE 2: Autenticación - Testing Manual

**Status**: ✅ **LISTO PARA TESTING** | **Date**: 2026-03-16

---

## 🚀 Inicio Rápido

El servidor ya está corriendo en `http://localhost:3001` (o el puerto disponible).

### 1. Acceder a la Aplicación

Abre tu navegador y ve a:
```
http://localhost:3001
```

Deberías ver redireccionado automáticamente a:
```
http://localhost:3001/es
```

### 2. Página Principal

Verás una página de bienvenida con dos botones:
- **Registrarse** - Crear una nueva cuenta
- **Iniciar Sesión** - Acceder con una cuenta existente

---

## 🧪 Test Case 1: Registrar Nuevo Usuario

### Pasos:
1. Click en **"Registrarse"**
2. Deberías ver el formulario con campos:
   - Nombre completo (opcional)
   - Correo electrónico
   - Contraseña

### Llenar Datos:
```
Nombre: Juan Pérez
Email: juan.perez@example.com
Contraseña: MySecurePassword123
```

### Resultado Esperado:
- ✅ Formulario acepta los datos
- ✅ Click en "Registrarse" (debería mostrar estado "Cargando...")
- ✅ Redirige a `/es/dashboard`
- ✅ Dashboard muestra "¡Bienvenido al Dashboard!"
- ✅ Muestra tu email en el perfil
- ✅ Muestra tu nombre

---

## 🧪 Test Case 2: Dark Mode en Login/Signup

### Pasos:
1. Ve a `/es/auth/signup`
2. Busca un toggle de tema (debería estar en la página)
3. Click para cambiar a dark mode
4. Verifica que:
   - ✅ Fondo cambia a oscuro
   - ✅ Texto cambia a claro
   - ✅ Campos de input son oscuros
   - ✅ Botones son legibles

### Notas:
- Los forms soportan dark mode completamente
- El tema se persiste en el navegador

---

## 🧪 Test Case 3: Cambiar Idioma

### Pasos:
1. Ve a `/es/auth/login`
2. Busca selector de idioma (debería estar disponible)
3. Cambia de "Español" a "English"
4. Deberías ver URL cambiar a `/en/auth/login`

### Resultado Esperado:
- ✅ Todos los textos en inglés:
  - "Sign in to your account"
  - "Email"
  - "Password"
  - "Sign in" button
  - "Don't have an account?" link

---

## 🧪 Test Case 4: Validación de Formularios

### Test 4a: Campo Requerido
1. Ve a `/es/auth/login`
2. Deja los campos vacíos
3. Click en "Iniciar sesión"

**Resultado Esperado**:
- ✅ Muestra mensaje: "Por favor completa todos los campos requeridos"

### Test 4b: Contraseña Corta (Signup)
1. Ve a `/es/auth/signup`
2. Llena:
   - Email: test@example.com
   - Contraseña: "123" (solo 3 caracteres)
3. Click en "Registrarse"

**Resultado Esperado**:
- ✅ Muestra error: "La contraseña debe tener al menos 6 caracteres"

---

## 🧪 Test Case 5: Login Exitoso

### Prerequisito:
- Tienes una cuenta creada (del Test Case 1)

### Pasos:
1. Ve a `/es/auth/login`
2. Ingresa credenciales:
   ```
   Email: juan.perez@example.com
   Contraseña: MySecurePassword123
   ```
3. Click en "Iniciar sesión"

**Resultado Esperado**:
- ✅ Muestra "Cargando..."
- ✅ Redirige a `/es/dashboard`
- ✅ Muestra tu perfil con:
  - Tu email
  - Tu nombre
  - Tema: "auto" (por defecto)
  - Idioma: "es" (por defecto)

---

## 🧪 Test Case 6: Protected Routes

### Test 6a: Sin Autenticación
1. Logout (si estás autenticado):
   - Click en "Cerrar Sesión"
2. Intenta ir a `/es/dashboard` en la URL

**Resultado Esperado**:
- ❌ DEBERÍA redirigir a `/es/auth/login`
- ⚠️ **Nota**: Actualmente el middleware no está completamente protegiendo rutas
  (esto se implementará completamente en la siguiente fase)

### Test 6b: Con Autenticación
1. Login con credenciales válidas
2. Vé a `/es/dashboard`

**Resultado Esperado**:
- ✅ Acceso permitido
- ✅ Vés tu perfil y botón de logout

---

## 🧪 Test Case 7: Logout

### Pasos:
1. Estando en `/es/dashboard`
2. Click en botón "Cerrar Sesión"

**Resultado Esperado**:
- ✅ Sesión cierra
- ✅ Redirige a `/es/auth/login`
- ✅ Cookies de sesión se limpian

---

## 🧪 Test Case 8: Traducción Completa

### Pasos:
1. Cambia de `/es` a `/en`
2. Visita cada página:
   - Homepage
   - Signup
   - Login
   - Dashboard

**Resultado Esperado**:
- ✅ Todos los textos están en inglés
- ✅ URLs reflejan el locale (`/en/...`)
- ✅ Sin mezcla de idiomas

---

## 🧪 Test Case 9: Responsive Design

### Pasos:
Prueba en 3 tamaños de pantalla:

#### Mobile (375px)
```
F12 → Device Toolbar → iPhone SE (375x667)
```
- ✅ Formularios se adaptan
- ✅ Botones son clickeables
- ✅ Sin scroll horizontal
- ✅ Texto legible

#### Tablet (768px)
```
Device Toolbar → iPad (768x1024)
```
- ✅ Layout se expande un poco
- ✅ Campos son cómodos
- ✅ Espaciado adecuado

#### Desktop (1440px)
```
F12 → Device Toolbar → Disable
```
- ✅ Layout centrado
- ✅ Máximo ancho respetado
- ✅ Aspecto profesional

---

## 📋 Problemas Conocidos

### 🔴 Protected Routes No Funcionan Completamente
**Problema**: Rutas como `/dashboard` no redirigen a login si no estás autenticado
**Solución**: Se implementará completamente en FASE 3
**Workaround**: Manually test by clicking links

### 🟡 Supabase RLS No Testeable Sin Backend
**Problema**: RLS policies en Supabase no se pueden testear desde el frontend
**Solución**: Se validarán en FASE 3 cuando hagamos API routes

---

## ✅ Checklist de Testing

- [ ] Homepage carga en `/es`
- [ ] Signup form carga en `/es/auth/signup`
- [ ] Login form carga en `/es/auth/login`
- [ ] Puedo crear nueva cuenta
- [ ] Puedo loguearte con cuenta existente
- [ ] Formularios validan requeridos
- [ ] Formularios validan longitud de password
- [ ] Dark mode funciona en todos los forms
- [ ] Cambio de idioma a English funciona
- [ ] Todos los textos están en inglés cuando cambio a EN
- [ ] Dashboard carga después de signup/login
- [ ] Perfil muestra email y nombre correctamente
- [ ] Logout funciona
- [ ] Responsive en mobile/tablet/desktop

---

## 🐛 Reportar Problemas

Si encuentras un error:

1. **Anota el pasos exactos** para reproducir
2. **Screenshot/video** si es posible
3. **Abre issue** con detalles:
   - URL donde ocurre
   - Error en consola (F12)
   - Comportamiento esperado vs actual
   - Browser y OS

---

## 📊 Resumen de Tests

```
Test Case 1: Signup        ✅ Manual testing required
Test Case 2: Dark Mode     ✅ Manual testing required
Test Case 3: Idioma        ✅ Manual testing required
Test Case 4: Validación    ✅ Manual testing required
Test Case 5: Login         ✅ Manual testing required
Test Case 6: Protected     ⚠️  Parcial (FASE 3)
Test Case 7: Logout        ✅ Manual testing required
Test Case 8: Traducción    ✅ Manual testing required
Test Case 9: Responsive    ✅ Manual testing required

Unit Tests: ✅ 11+ tests passing
Integration: ⚠️ Próxima fase
E2E: ⚠️ Próxima fase
```

---

## 🎯 Objetivos para Próxima Fase (FASE 3)

- [ ] Protección completa de rutas con middleware + Supabase
- [ ] Tests E2E con Playwright
- [ ] API routes para task management
- [ ] Integración con Claude API para enriquecimiento

---

**¡FASE 2 LISTA PARA TESTING MANUAL!** 🚀

Ve a http://localhost:3001 y prueba el signup/login.

