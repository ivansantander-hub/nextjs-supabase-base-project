# Diseño UX/UI - Plataforma de Enriquecimiento de Tareas TPO

**Documento versión:** 1.0
**Fecha:** 2026-03-16
**Designer:** UX/UI Team
**Estado:** En construcción (Draft)

---

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [User Personas](#user-personas)
3. [User Journeys](#user-journeys)
4. [Design System](#design-system)
5. [Wireframes y Flujos](#wireframes-y-flujos)
6. [Feedback Visual](#feedback-visual)
7. [Accesibilidad (WCAG)](#accesibilidad-wcag)
8. [Micro-interactions](#micro-interactions)
9. [Decisiones de UX](#decisiones-de-ux)

---

## Resumen Ejecutivo

Esta plataforma permite a **Technical Product Owners (TPO)** enriquecer tareas técnicas desde Notion de forma eficiente mediante:

- **Integración con Notion**: Filtrado y visualización de tareas existentes
- **Enriquecimiento automático**: IA genera sugerencias basadas en contexto
- **Chat interactivo**: Ajustes en tiempo real sin abandonar la plataforma
- **Historial y control**: Revisión de cambios antes de sincronizar con Notion

**Objetivo principal**: Reducir tiempo de enriquecimiento de tareas técnicas de 30-45 min a 5-10 min.

---

## User Personas

### Persona Principal: Technical Product Owner (TPO)

| Atributo | Descripción |
|----------|------------|
| **Nombre** | Marco (edad 32-45) |
| **Rol** | Technical Product Owner |
| **Experiencia Tech** | Intermedia a avanzada (desarrollador o PM técnico) |
| **Herramientas que usa** | Notion, GitHub, Jira, Slack |
| **Motivaciones** | Acelerar ciclo de tareas, mejorar calidad de definición |
| **Frustraciones** | Tareas incompletas, enriquecimiento manual tedioso, cambios que no sincroniza |
| **Dispositivos** | Desktop 80%, Tablet 20% |
| **Frecuencia de uso** | 5-10 tareas/día, 3-4 veces por semana |
| **Competencias clave** | Comprende requirements, entiende contexto técnico, valida cambios |

**Necesidades críticas:**
- Entender rápidamente qué necesita hacer
- Ver propuestas de IA sin perder contexto original
- Ajustar sin necesidad de volver a escribir
- Validar antes de guardar en Notion

---

## User Journeys

### Journey 1: Enriquecimiento Rápido de Tarea Única

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOGIN                                                      │
│    - OAuth con GitHub/Google                                │
│    - Validación de acceso a workspace Notion               │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 2. DASHBOARD / HOME                                           │
│    - Vista rápida de tareas pendientes                      │
│    - Filtros: Sprint, Estado, Tags                          │
│    - Búsqueda rápida                                        │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 3. SELECCIONAR TAREA                                          │
│    - Click en tarea de lista                                │
│    - Carga datos de Notion                                  │
│    - Muestra estado: "Cargando..."                          │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 4. VISUALIZAR TAREA BASE                                      │
│    - Título, descripción actual                             │
│    - Acceptance criteria existentes                         │
│    - Status badge (Draft, Ready, In Review)                 │
│    - Metadata: Assignee, Sprint, Tags                       │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 5. GENERACIÓN AUTOMÁTICA (Background)                         │
│    - API llama a Claude con contexto                        │
│    - Muestra: "Generando sugerencias..." (spinner)          │
│    - Tiempo estimado: 3-7 segundos                          │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 6. VISUALIZAR PREVIEW DE CAMBIOS                              │
│    - Lado izquierdo: Original                               │
│    - Lado derecho: Propuesta IA                             │
│    - Diff visual destacado (verde = agregado)               │
│    - Botones: "Aceptar", "Rechazar", "Editar"              │
└──────────────┬──────────────────────────────────────────────┘
               │
        ┌──────┴──────┬──────────────┬──────────┐
        │             │              │          │
    ACEPTAR      RECHAZAR       EDITAR     CHAT
        │             │              │          │
   (6a)│         (6b)│         (6c) │     (6d)│
        │             │              │          │
└──────┬┴────┬───────┴┬──────────┬──┴─────┬────┘
       │ 7a  │ 7b    │ 7c       │ 7d     │
```

#### 7a. Flujo Aceptar

```
┌──────────────────────────────────────────────────────────────┐
│ 7a. ACEPTAR CAMBIOS                                           │
│    - Habilitar checkbox "Sincronizar con Notion"            │
│    - Mostrar preview final                                  │
│    - Botón: "Guardar y Sincronizar"                         │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 8a. SINCRONIZACIÓN                                            │
│    - Progress bar: "Sincronizando... 50%"                   │
│    - Spinner animado                                        │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 9a. SUCCESS                                                   │
│    - Toast: "✓ Tarea actualizada en Notion"                │
│    - Opción: "Ver en Notion" o "Siguiente tarea"           │
│    - Historial registrado                                   │
└──────────────────────────────────────────────────────────────┘
```

#### 7b. Flujo Rechazar

```
┌──────────────────────────────────────────────────────────────┐
│ 7b. RECHAZAR CAMBIOS                                          │
│    - Descarta generación actual                             │
│    - Opción: "Regenerar" o "Volver atrás"                  │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 8b. VOLVER A DASHBOARD                                        │
│    - Estado de tarea sigue siendo el original              │
│    - Se marca en historial como "Rechazada"                │
└──────────────────────────────────────────────────────────────┘
```

#### 7c. Flujo Editar

```
┌──────────────────────────────────────────────────────────────┐
│ 7c. EDITAR PROPUESTA                                          │
│    - Abre editor de texto enriquecido                       │
│    - Mantiene lado derecho editable                         │
│    - Sugiere cambios mientras edita                         │
│    - Botones: "Guardar", "Cancelar"                         │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 8c. REVISAR EDICIÓN                                           │
│    - Muestra cambios hechos por usuario                     │
│    - Opción: "Sincronizar" o "Descartar"                   │
└──────────────────────────────────────────────────────────────┘
```

#### 7d. Flujo Chat

```
┌──────────────────────────────────────────────────────────────┐
│ 7d. CHAT INTERACTIVO                                          │
│    - Abre panel lateral (40% ancho)                         │
│    - Contexto: Tarea original + propuesta IA                │
│    - Campo: "¿Qué cambios deseas?"                          │
│    - Ejemplos: "Agregar criteria de rendimiento"            │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 8d. CHAT LOOP                                                 │
│    - Usuario escribe ajuste                                 │
│    - IA responde en contexto                                │
│    - Propone cambios incrementales                          │
│    - Usuario aprueba cambios                                │
│    - Botón: "Aplicar cambios"                               │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 9d. PREVIEW FINAL                                             │
│    - Muestra tarea final después de ajustes                 │
│    - Botón: "Sincronizar"                                   │
└──────────────────────────────────────────────────────────────┘
```

### Journey 2: Enriquecimiento en Batch

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FILTRAR TAREAS (Sprint/Estado/Tags)                      │
│    - Múltiples selecciones                                  │
│    - Resultado: 5-20 tareas                                 │
│    - Botón: "Enriquecer Todas"                              │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 2. MODO BATCH                                                 │
│    - Progress: "2 de 15 tareas procesadas"                  │
│    - Card actual mostrada prominentemente                   │
│    - Opción: "Aceptar", "Rechazar", "Editar", "Saltar"     │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 3. LOOP BATCH                                                 │
│    - Procesa tarea por tarea                                │
│    - Al terminar cada una: toma siguiente                   │
│    - Puede pausar o cancelar                                │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 4. RESUMEN BATCH                                              │
│    - 12 aceptadas, 2 rechazadas, 1 editada                  │
│    - Tiempo ahorrado: 4.5 horas                             │
│    - Botón: "Sincronizar Todas" o "Revisar Cambios"        │
└──────────────────────────────────────────────────────────────┘
```

### Journey 3: Revisión de Historial

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ACCEDER A HISTORIAL                                       │
│    - Sidebar/Menu: "Historial"                              │
│    - Filtros: Fecha, Tarea, Estado                          │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 2. LISTAR CAMBIOS                                             │
│    - Timestamp, Tarea, Estado (Aceptada/Rechazada)          │
│    - Preview: antes/después                                 │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 3. DETALLES DE CAMBIO                                         │
│    - Diff completo                                          │
│    - Cambios por campo                                      │
│    - Opción: "Revertir" (si aplica)                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Design System

### 1. Paleta de Colores

#### Colores Primarios

| Color | Hex | Uso |
|-------|-----|-----|
| **Azul Principal** | #2563EB | CTAs principales, Enlaces, Acciones positivas |
| **Azul Oscuro** | #1E40AF | Hover/Focus en botones primarios |
| **Gris Neutro** | #6B7280 | Textos secundarios, Borders |
| **Gris Claro** | #F3F4F6 | Backgrounds secundarios, Hover suave |

#### Colores Semánticos

| Estado | Color | Hex | Uso |
|--------|-------|-----|-----|
| **Success** | Verde | #10B981 | Aceptación, Sincronización exitosa, Checks |
| **Warning** | Ámbar | #F59E0B | Caution, Cambios pendientes, Validación |
| **Error** | Rojo | #EF4444 | Errores, Rechazos, Problemas |
| **Info** | Azul Cielo | #0EA5E9 | Información, Tips, Tutoriales |
| **Disabled** | Gris | #9CA3AF | Elementos deshabilitados |

#### Dark Mode (Futuro)

```
Fondo principal:     #0F172A
Fondo secundario:    #1E293B
Texto principal:     #F1F5F9
Texto secundario:    #94A3B8
Border:              #334155
Acento:              #3B82F6
```

### 2. Tipografía

#### Sistema de Fuentes

```
Font Family: 'Inter' (vía next/font)
Fallback:    -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

#### Escala Tipográfica

| Componente | Tamaño | Weight | Line-height | Uso |
|------------|--------|--------|-------------|-----|
| **H1 - Hero** | 32px | 700 | 1.2 | Títulos de página principal |
| **H2 - Section** | 24px | 700 | 1.3 | Títulos de secciones |
| **H3 - Subsection** | 20px | 600 | 1.4 | Subtítulos, Card titles |
| **Body Large** | 16px | 400 | 1.6 | Textos principales, Descripciones |
| **Body Regular** | 14px | 400 | 1.5 | Contenido normal, Etiquetas |
| **Body Small** | 12px | 400 | 1.4 | Meta información, Timestamps |
| **Caption** | 11px | 500 | 1.3 | Iconografía, Hints |

### 3. Spacing System

Basado en escala de 4px:

```
xs:    4px
sm:    8px
md:   12px
lg:   16px
xl:   24px
2xl:  32px
3xl:  48px
4xl:  64px
```

**Aplicaciones:**
- Padding interno de componentes: sm, md
- Margins entre elementos: md, lg, xl
- Gaps en layouts: lg, xl
- Whitespace en cards: lg

### 4. Componentes UI

#### Botones

```
┌─────────────────────────────────────────────────────────────┐
│ PRIMARY (Azul)                                              │
│ [         Guardar y Sincronizar         ]                  │
│ Tamaño: 40px altura, padding: lg                           │
│ Border-radius: 6px                                          │
│ Font-weight: 600                                            │
│ Cursor: pointer                                             │
│ Transition: all 200ms ease-in-out                           │
│                                                              │
│ States:                                                      │
│ - Default:   bg-blue-600, text-white                       │
│ - Hover:     bg-blue-700, shadow-sm                        │
│ - Active:    bg-blue-800, scale-98                         │
│ - Disabled:  bg-gray-300, cursor-not-allowed               │
│ - Loading:   spinner icon + "Guardando..."                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECONDARY (Blanco con borde)                                │
│ [            Cancelar            ]                          │
│ bg: white, border: 1px gray-300                             │
│ text: gray-700                                              │
│ Tamaño: 40px altura                                         │
│ Hover: bg-gray-50                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ GHOST (Transparente)                                        │
│ [  Ver en Notion  ]                                         │
│ bg: transparent, text: blue-600                             │
│ Underline en hover                                          │
│ Útil para acciones secundarias                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ICON BUTTON (Square)                                        │
│ [↗]                                                         │
│ Tamaño: 36px x 36px                                         │
│ Contenido: Icono 20px                                       │
│ Casos: Share, Copy, Edit (inline)                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ BUTTON GROUP (Múltiple selección)                           │
│ [Aceptar] [Rechazar] [Editar] [Chat]                        │
│ - Separados por 8px (sm gap)                                │
│ - En mobile: Stack vertical                                 │
│ - Botones activos: background color                         │
└─────────────────────────────────────────────────────────────┘
```

#### Input Fields

```
┌─────────────────────────────────────────────────────────────┐
│ TEXTO (Text Input)                                          │
│ ┌──────────────────────────────────────────────────┐        │
│ │ Buscar tarea...                                │        │
│ └──────────────────────────────────────────────────┘        │
│                                                              │
│ Altura: 36px (sm) o 40px (regular)                          │
│ Padding: md horizontal, sm vertical                         │
│ Border: 1px gray-300                                        │
│ Border-radius: 4px                                          │
│ Font: Body Regular                                          │
│ Placeholder: color-gray-400                                 │
│ Focus: border-blue-500, shadow: inset blue glow             │
│ Error: border-red-500, helper text rojo                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CHECKBOX (Multi-select)                                     │
│ ☐ Sincronizar con Notion                                   │
│ ☑ Generar en batch                                         │
│                                                              │
│ Icono: 18x18px                                              │
│ Spacing: md entre icono y texto                             │
│ Checked color: blue-600                                     │
│ Hover: fondo gris-100                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SELECT (Dropdown)                                           │
│ ┌──────────────────────────────────────────────┐            │
│ │ Sprint actual              [▼]              │            │
│ └──────────────────────────────────────────────┘            │
│                                                              │
│ Abierto (expanded):                                         │
│ ┌──────────────────────────────────────────────┐            │
│ │ Sprint actual              [▲]              │            │
│ ├──────────────────────────────────────────────┤            │
│ │ > Sprint 1 (6 tareas)                        │            │
│ │ > Sprint 2 (12 tareas)                       │            │
│ │ > Sprint 3 (8 tareas)                        │            │
│ └──────────────────────────────────────────────┘            │
│                                                              │
│ Items: altura 36px, padding md                              │
│ Hover: bg-gray-100                                          │
│ Selected: check icon + blue text                            │
└─────────────────────────────────────────────────────────────┘
```

#### Cards & Containers

```
┌──────────────────────────────────────────────────────────────┐
│ TASK CARD (Lista)                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🔵 [Implementar login OAuth]                  → [→]   │ │
│  │    Sprint 1  •  In Review  •  Assignee: Juan          │ │
│  │    Descripción: Agregar soporte para GitHub y Google  │ │
│  │    Preview: Propuesta de IA: 2/5 acceptance criteria  │ │
│  │    [⚡ Enriquecer]  [👁️ Ver más]                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│ Hover: bg-gray-50, box-shadow elevado                       │
│ Padding: lg                                                  │
│ Border-radius: 8px                                           │
│ Border: 1px gray-200                                         │
│ Cursor: pointer (excepto en botones)                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ DIFF PANEL (Side by side)                                    │
│                                                               │
│ ┌────────────────────────────┬────────────────────────────┐  │
│ │ ORIGINAL                   │ PROPUESTA IA              │  │
│ ├────────────────────────────┼────────────────────────────┤  │
│ │ Título:                    │ Título:                   │  │
│ │ Implementar login          │ ✨ Implementar OAuth 2.0  │  │
│ │                            │    login (GitHub & Google)│  │
│ ├────────────────────────────┼────────────────────────────┤  │
│ │ Descripción:               │ Descripción:              │  │
│ │ Agregar soporte de login   │ Agregar soporte de OAuth  │  │
│ │ con GitHub                 │ 2.0 login con:            │  │
│ │                            │ ✨ + GitHub              │  │
│ │                            │ ✨ + Google              │  │
│ │                            │ - Email/Password (legacy) │  │
│ ├────────────────────────────┼────────────────────────────┤  │
│ │ Acceptance Criteria:       │ Acceptance Criteria:      │  │
│ │ • Login funciona           │ ✨ • OAuth setup working  │  │
│ │ • Tests pass               │ • Tests pass (100% cov.)  │  │
│ │                            │ ✨ • Logout functionality │  │
│ │                            │ ✨ • Session persistence  │  │
│ ├────────────────────────────┼────────────────────────────┤  │
│ │                            │                           │  │
│ │ [Rechazar]  [Editar]       │ [Aceptar]  [Chat]        │  │
│ └────────────────────────────┴────────────────────────────┘  │
│                                                               │
│ Colores:                                                     │
│ - Verde (#10B981, opacity 10%):  líneas nuevas              │
│ - Rojo (#EF4444, opacity 10%):    líneas removidas          │
│ - Gris: líneas sin cambios                                   │
│ - "✨" emoji: cambios destacados IA                          │
└──────────────────────────────────────────────────────────────┘
```

#### Chat Component

```
┌────────────────────────────────────────────────────────────┐
│ CHAT PANEL (Lado derecho, 40% ancho)                      │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Enriquecimiento de Tarea                          [×]│  │
│ ├──────────────────────────────────────────────────────┤  │
│ │                                                      │  │
│ │ Sistema (10:35 AM):                                 │  │
│ │ "Analicé tu tarea. Sugiero agregar 2 acceptance     │  │
│ │  criteria sobre seguridad y 1 sobre performance."   │  │
│ │                                                      │  │
│ │ 👤 Tú (10:36 AM):                                   │  │
│ │ "Añade también criterios sobre testing"             │  │
│ │                                                      │  │
│ │ Sistema (10:36 AM):                                 │  │
│ │ "✓ Actualizando..."                                 │  │
│ │ "✓ Agregué:"                                        │  │
│ │   - Unit tests > 80% coverage                       │  │
│ │   - E2E tests para flujo OAuth                      │  │
│ │                                                      │  │
│ ├──────────────────────────────────────────────────────┤  │
│ │ [Escribir mensaje...                         ]      │  │
│ │                                     [📎] [↵] [⎘]     │  │
│ │ Hint: @ para contextualizar, / para comandos        │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ Mensajes de sistema: bg-blue-50, border-left blue-500     │
│ Mensajes de usuario: bg-blue-600, text-white, aligned-r   │
│ Input: altura 40px, border inferior, focus ring           │
│ Icons: small, toolbar row inferior                        │
└────────────────────────────────────────────────────────────┘
```

#### Status Badges & Progress

```
┌─────────────────────────────────────────────────────────────┐
│ STATUS BADGE (Inline)                                       │
│ 🔵 Draft      🟡 In Review    🟢 Ready    ⚪ Done         │
│                                                              │
│ Altura: 20px, padding: xs sm                                │
│ Border-radius: 12px (píldora)                               │
│ Font: Caption (bold)                                        │
│ Icono emoji + texto                                         │
│ Colores según estado semántico                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PROGRESS BAR (Batch processing)                             │
│ Sincronizando... 50% completo                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │████████████████████░░░░░░░░░░░░░░░░░░░░            │   │
│ └──────────────────────────────────────────────────────┘   │
│ 3 de 6 tareas completadas                                  │
│                                                              │
│ Altura: 8px                                                 │
│ Background: gray-200                                        │
│ Progress fill: blue-600 con gradient                        │
│ Border-radius: 4px                                          │
│ Animation: smooth transition (300ms)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SPINNER (Loading)                                           │
│         ⟳                                                   │
│ "Generando sugerencias..."                                  │
│                                                              │
│ Icono: 24px, animación spin 1s                              │
│ Text: Body Regular, color gray-600                          │
│ Spacing: md entre icono y texto                             │
│ Usado en: Carga inicial, generación IA, sincronización      │
└─────────────────────────────────────────────────────────────┘
```

#### Toasts & Modals

```
┌────────────────────────────────────────────────────────────┐
│ TOAST (Notificación temporal)                             │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ✓ Tarea actualizada en Notion                    [×] │  │
│ └──────────────────────────────────────────────────────┘  │
│ Posición: abajo-derecha, margin 16px                      │
│ Duración: 3s (closeable antes)                             │
│ Altura: 48px, padding: lg                                  │
│ Colores: verde/rojo/azul según tipo                        │
│ Animation: slide-in desde abajo (200ms), fade-out (300ms)  │
│                                                            │
│ Variantes:                                                │
│ ✓ Success (verde): "Cambios guardados"                     │
│ ⚠ Warning (ámbar): "5 tareas fallarán al sincronizar"     │
│ ✕ Error (rojo): "Error de conexión con Notion"            │
│ ℹ Info (azul): "Nueva versión disponible"                  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ MODAL (Dialog importante)                                 │
│         ┌────────────────────────────────────────────┐    │
│         │ Confirmar sincronización              [×]  │    │
│         ├────────────────────────────────────────────┤    │
│         │                                            │    │
│         │ Estás a punto de sincronizar 12 cambios  │    │
│         │ a Notion. ¿Deseas continuar?             │    │
│         │                                            │    │
│         │ Cambios:                                  │    │
│         │  • 8 acceptance criteria añadidas         │    │
│         │  • 3 descripciones mejoradas              │    │
│         │  • 1 tarea rechazada                      │    │
│         │                                            │    │
│         │          [Cancelar]  [Sincronizar]       │    │
│         └────────────────────────────────────────────┘    │
│ Overlay: bg-black opacity-50                              │
│ Width: 500px (responsive < 95vw)                          │
│ Border-radius: 8px                                         │
│ Box-shadow: 0 20px 25px rgba(0,0,0,0.15)                  │
│ Animation: fade + scale-in (200ms)                        │
└────────────────────────────────────────────────────────────┘
```

---

## Wireframes y Flujos

### Pantalla 1: Dashboard / Home

```
┌─────────────────────────────────────────────────────────────┐
│                    TASK ENRICHMENT PLATFORM                │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 👤 Juan     📋 Sprint 1    🔔 2 pending    ⚙️        │   │
│ └──────────────────────────────────────────────────────┘   │
│ ─────────────────────────────────────────────────────────── │
│                                                              │
│ [🔍 Buscar tarea...                                    ]   │
│                                                              │
│ Filtros rápidos:                                           │
│ [Sprint ▼]  [Estado ▼]  [Tags ▼]  [Más filtros ↓]        │
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│                                                              │
│ Tareas pendientes (8)                                      │
│                                                              │
│ 📍 [Implementar login OAuth]        🟡 In Review  [→]      │
│    Sprint 1 • Assignee: Juan • ⚡ Enriquecer              │
│    Preview: Falta 2 acceptance criteria                    │
│                                                              │
│ 📍 [Refactorizar auth middleware]   🔵 Draft     [→]      │
│    Sprint 1 • Assignee: María • ⚡ Enriquecer              │
│    Preview: Listo para enriquecer                          │
│                                                              │
│ 📍 [Fix: Memory leak en cache]       🔵 Draft     [→]      │
│    Sprint 2 • Assignee: Pedro • ⚡ Enriquecer              │
│    Preview: Necesita descripción técnica                   │
│                                                              │
│ [⚡ Enriquecer Todas] [📊 Historial] [⚙️ Configuración]   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Pantalla 2: Task View - Antes de Generación

```
┌────────────────────────────────────────────────────────────────┐
│ < Dashboard                                           [⚙️] [×] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Implementar login OAuth                                        │
│ 🟡 In Review  •  Sprint 1  •  Assigned: Juan Pérez            │
│                                                                 │
│ ─────────────────────────────────────────────────────────────  │
│ DESCRIPCIÓN                                                    │
│ Agregar soporte de login usando GitHub y Google OAuth         │
│                                                                 │
│ ─────────────────────────────────────────────────────────────  │
│ ACCEPTANCE CRITERIA                                           │
│ • Login con GitHub funciona                                   │
│ • Login con Google funciona                                   │
│ • Tests pasan                                                 │
│                                                                 │
│ ─────────────────────────────────────────────────────────────  │
│ METADATA                                                       │
│ Sprint: Sprint 1           Due: 2026-03-20                    │
│ Assignee: Juan Pérez       Labels: auth, feature              │
│ Priority: High             Created: 2026-03-10                │
│                                                                 │
│ ─────────────────────────────────────────────────────────────  │
│                                                                 │
│ [⚡ Generar Mejoras]     [📎 Historial]   [👁️ Ver en Notion] │
│                                                                 │
│                    ⟳ Generando sugerencias...                  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Pantalla 3: Task View - Preview de Cambios (Diff)

```
┌────────────────────────────────────────────────────────────────┐
│ < Dashboard                                           [⚙️] [×] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Implementar login OAuth                                        │
│                                                                 │
│ ┌──────────────────────────┬──────────────────────────────┐   │
│ │ ORIGINAL (Notion)        │ PROPUESTA IA                │   │
│ ├──────────────────────────┼──────────────────────────────┤   │
│ │ DESCRIPCIÓN              │ DESCRIPCIÓN                  │   │
│ │ Agregar soporte de       │ ✨ Agregar soporte de OAuth │   │
│ │ login usando GitHub y    │    2.0 con múltiples         │   │
│ │ Google OAuth             │    proveedores:              │   │
│ │                          │    • GitHub                  │   │
│ │                          │    • Google                  │   │
│ │                          │    Incluir logout y          │   │
│ │                          │    manejo de sesión          │   │
│ │                          │                              │   │
│ ├──────────────────────────┼──────────────────────────────┤   │
│ │ ACCEPTANCE CRITERIA      │ ACCEPTANCE CRITERIA          │   │
│ │ • Login GitHub funciona  │ ✨ • OAuth2 setup completo   │   │
│ │ • Login Google funciona  │ • Tests pass (unit+E2E)      │   │
│ │ • Tests pasan            │ ✨ • Logout funciona         │   │
│ │                          │ ✨ • Session persiste        │   │
│ │                          │ ✨ • Error handling          │   │
│ │                          │ ✨ • Docs generadas          │   │
│ │                          │                              │   │
│ ├──────────────────────────┼──────────────────────────────┤   │
│ │                          │                              │   │
│ │ [Rechazar]  [Editar]     │ [Aceptar]  [Chat]           │   │
│ └──────────────────────────┴──────────────────────────────┘   │
│                                                                 │
│ ☐ Sincronizar con Notion después de aceptar                   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Pantalla 4: Task View - Con Chat Lateral

```
┌──────────────────────────────────────┬────────────────────────┐
│ < Dashboard              [⚙️]         │ Enriquecimiento   [×]  │
├──────────────────────────────────────┼────────────────────────┤
│                                       │                        │
│ Implementar login OAuth               │ Sistema (10:35 AM):    │
│                                       │ "Analicé tu tarea y    │
│ ┌────────────────────────────────┐   │  sugiero agregar:      │
│ │ ORIGINAL  │  PROPUESTA IA      │   │  • Tests E2E           │
│ ├────────────────────────────────┤   │  • Security checks"    │
│ │ DESCRIP   │ DESCRIP (mejorada) │   │                        │
│ │           │ ✨ ...             │   │ 👤 Tú (10:36 AM):      │
│ ├────────────────────────────────┤   │ "Añade también logging" │
│ │ CRITERIA  │ CRITERIA (expand)  │   │                        │
│ │ • Login   │ ✨ • Login         │   │ Sistema (10:36 AM):    │
│ │ • Tests   │ ✨ • Tests         │   │ "✓ Agregado logging"   │
│ │           │ ✨ • Logout        │   │                        │
│ │           │ ✨ • Security      │   │ [Escribe aquí...  ]    │
│ │           │ ✨ • Logging       │   │                 [📎][↵]│
│ └────────────────────────────────┘   │                        │
│                                       │ Hint: usa @ para refs  │
│ [Rechazar]  [Editar]                 │                        │
│ [Aceptar]  [Chat cerrar]             │                        │
│                                       │                        │
└──────────────────────────────────────┴────────────────────────┘
```

### Pantalla 5: Historial de Cambios

```
┌────────────────────────────────────────────────────────────────┐
│ < Dashboard                                           [⚙️] [×] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📊 HISTORIAL DE CAMBIOS                                       │
│                                                                 │
│ [Filtrar por fecha ▼]  [Filtrar por estado ▼]  [Buscar...]   │
│                                                                 │
│ ─────────────────────────────────────────────────────────────  │
│                                                                 │
│ Hoy, 2026-03-16                                               │
│                                                                 │
│ 10:45 - Implementar login OAuth                    ✓ ACEPTADA  │
│        Juan Pérez                                              │
│        [Ver cambios]  [Ver original]  [Revertir]             │
│                                                                 │
│ 10:20 - Refactorizar auth middleware              ✗ RECHAZADA │
│        María García                                             │
│        [Ver cambios]  [Regenerar]                             │
│                                                                 │
│ 09:15 - Fix: Memory leak en cache                  ✓ ACEPTADA  │
│        Pedro López                                              │
│        [Ver cambios]  [Ver original]                           │
│                                                                 │
│ ─────────────────────────────────────────────────────────────  │
│                                                                 │
│ Ayer, 2026-03-15                                              │
│                                                                 │
│ 16:30 - Agregar endpoints de reportes             ✓ ACEPTADA  │
│        Juan Pérez                                              │
│        [Ver cambios]  [Ver original]                           │
│                                                                 │
│ [Cargar más...]                                               │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Pantalla 6: Detalle de Cambio (Historial)

```
┌────────────────────────────────────────────────────────────────┐
│ < Historial                                         [⚙️] [×]   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Implementar login OAuth                                        │
│ Cambio realizado el: 2026-03-16 a las 10:45 AM               │
│ Estado: ✓ ACEPTADA Y SINCRONIZADA                             │
│                                                                 │
│ ─────────────────────────────────────────────────────────────  │
│ CAMBIOS REALIZADOS                                            │
│                                                                 │
│ 📝 DESCRIPCIÓN (modificada)                                    │
│    De: "Agregar soporte de login usando GitHub y Google..."  │
│    A:  "Agregar soporte de OAuth 2.0 con múltiples..."        │
│    ✨ [+27 caracteres]  [Ver diff completo]                   │
│                                                                 │
│ 📝 ACCEPTANCE CRITERIA (expandida de 3 a 6 items)             │
│    ✨ + OAuth2 setup completo                                 │
│    ✨ + Tests pass (unit+E2E)                                 │
│    ✨ + Logout funciona                                       │
│    ✨ + Session persiste                                      │
│    ✨ + Error handling                                        │
│    ✨ + Docs generadas                                        │
│                                                                 │
│ 📌 METADATA (sin cambios)                                      │
│    Sprint: Sprint 1 (sin cambios)                              │
│    Assignee: Juan Pérez (sin cambios)                          │
│                                                                 │
│ ─────────────────────────────────────────────────────────────  │
│                                                                 │
│ [⟲ Revertir cambios]  [👁️ Ver en Notion]  [Duplicar]        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Feedback Visual

### Loading States

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GENERACIÓN INICIAL (3-7 segundos)                        │
│                                                              │
│ "⟳ Generando sugerencias..."                                │
│
│ Spinner: rotating icon, 24px, color: blue-600              │
│ Text: Body Regular, color: gray-700                         │
│ Puede cancelarse con [Cancelar]                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. SINCRONIZACIÓN CON NOTION (2-5 segundos)               │
│                                                              │
│ "Sincronizando con Notion..."                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │████████████████████░░░░░░░░░░░░░░░░░░░░            │   │
│ └──────────────────────────────────────────────────────┘   │
│ 2 de 3 tareas completadas                                  │
│                                                              │
│ Progress bar: animado, suave transición                     │
│ Texto: Body Small, mínimo feedback                          │
│ No bloquea UI (puede cancelarse)                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. RESPUESTA DE CHAT (0.5-2 segundos)                      │
│                                                              │
│ [Usuario escribe]                                           │
│ [Enter]                                                     │
│                                                              │
│ → Mensaje enviado a la derecha (blue-600, white text)      │
│ → Debajo: "⟳ Sistema está pensando..."                      │
│ → Aparece respuesta con fade-in (200ms)                     │
│                                                              │
│ Cursor en input se vuelve disabled mientras procesa        │
└─────────────────────────────────────────────────────────────┘
```

### Success & Error States

```
┌─────────────────────────────────────────────────────────────┐
│ SUCCESS TOAST                                               │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ✓ Tarea sincronizada con éxito                  [×] │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ Icono: ✓ (checkmark), color: green-500                     │
│ Fondo: green-50                                             │
│ Border-left: 4px green-500                                  │
│ Duración: 3s (auto-dismiss)                                 │
│ Acción: Click [×] para cerrar antes                        │
│ Animation: slide-in (200ms ease-out)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ERROR TOAST                                                 │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ✕ Error conectando con Notion. Reintentando...  [×] │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ Icono: ✕ (x), color: red-500                              │
│ Fondo: red-50                                               │
│ Border-left: 4px red-500                                    │
│ Duración: 5s (más tiempo que success)                       │
│ Acción: Click para cerrar o retry                           │
│ Animation: slide-in (200ms ease-out)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WARNING TOAST                                               │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ⚠ Algunos cambios pueden no sincronizar        [×]  │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ Icono: ⚠ (warning), color: amber-500                       │
│ Fondo: amber-50                                             │
│ Border-left: 4px amber-500                                  │
│ Duración: 4s                                                │
│ Acción: Puede click para ver detalles                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INLINE ERROR (Form field)                                   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Título de tarea                            [required]│   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ [Escribe aquí...                                    ]│   │
│ │ ✕ Por favor ingresa un título (min. 10 caracteres)  │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ Input border: red-500                                       │
│ Error text: red-600, Font-size: 12px                        │
│ Icon: ✕ en rojo                                             │
│ Aparece: En tiempo real (onBlur o onChange)                │
└─────────────────────────────────────────────────────────────┘
```

### Empty States & Placeholders

```
┌─────────────────────────────────────────────────────────────┐
│ EMPTY STATE (Sin tareas pendientes)                         │
│                                                              │
│           ✓ ¡Todo hecho por hoy!                           │
│                                                              │
│           No tienes tareas pendientes de enriquecimiento   │
│                                                              │
│           [+ Importar tareas desde Notion]                 │
│                                                              │
│ Icono: Grande (48px), color: gray-300                       │
│ Texto: Body Large, color: gray-600                          │
│ CTA: Botón secondary                                        │
│ Spacing: 3xl vertical                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PLACEHOLDER (Campo vacío)                                   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Selecciona una tarea para ver detalles               │   │
│ │                                                      │   │
│ │ → Haz click en una tarea de la lista izquierda      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ Bg: gray-50                                                 │
│ Border: 2px dashed gray-300                                 │
│ Color: gray-500                                             │
│ Padding: 3xl (generoso whitespace)                          │
└─────────────────────────────────────────────────────────────┘
```

### Hover & Focus States

```
┌─────────────────────────────────────────────────────────────┐
│ BUTTON HOVER (Primary)                                      │
│                                                              │
│ Default:  bg-blue-600                                       │
│ Hover:    bg-blue-700 + shadow-md                           │
│           cursor: pointer                                   │
│           transform: translateY(-2px) [subtle lift]         │
│ Active:   bg-blue-800 + scale(98%)                          │
│ Focus:    ring: 4px blue-300 (focus outline)                │
│ Disabled: bg-gray-300 + cursor: not-allowed                 │
│           opacity: 60%                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CARD HOVER (Task card)                                      │
│                                                              │
│ Default:  border: 1px gray-200, shadow: none                │
│ Hover:    border: 1px blue-300 (subtle)                     │
│           shadow: md (elevate effect)                       │
│           bg: gray-50 (very subtle)                         │
│ Active:   border: 2px blue-500                              │
│           shadow: lg                                        │
│           bg: blue-50                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INPUT FOCUS (Text input)                                    │
│                                                              │
│ Default:  border: 1px gray-300                              │
│ Focus:    border: 2px blue-500 (stronger)                   │
│           ring: 4px blue-100 (subtle glow)                  │
│           box-shadow: inset 0 0 0 3px rgba(37,99,235,0.1)  │
│ Error:    border: 2px red-500                               │
│           ring: 4px red-100                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Accesibilidad (WCAG)

### Niveles de Cumplimiento

**Objetivo: WCAG 2.1 Level AA**

### Contraste de Color

| Elemento | Contraste | Ratio | Nivel |
|----------|-----------|-------|-------|
| **Texto principal sobre fondo** | #6B7280 sobre #FFFFFF | 7:1 | AAA |
| **Texto secundario sobre fondo** | #9CA3AF sobre #FFFFFF | 4.5:1 | AA |
| **Botón primario** | Blanco sobre #2563EB | 8.5:1 | AAA |
| **Status badge** | Verde sobre blanco | 5:1 | AA |
| **Placeholder text** | #D1D5DB sobre blanco | 3:1 | FAIL ⚠️ |

**Acción para placeholder:** Aumentar a #999999 (ratio 6:1) o usar `::placeholder` con `opacity: 0.7`

### Navegación por Teclado

```
Tab Order Global:
1. Logo/Home link
2. Main search input
3. Filter dropdowns (Sprint, Estado, Tags)
4. Task list items (within list: ↓/↑ para navegar)
5. Action buttons en card (Enriquecer, etc)
6. Chat input (si visible)
7. Footer links

Dentro de un Modal:
- Tab navega entre campos/botones
- Escape cierra el modal
- Focus trap: último botón → primera input

Dentro de chat:
- ↑/↓ navega historial de mensajes
- Tab dentro del text area (no lo sale)
- Shift+Enter para salto de línea
- Enter para enviar
```

### Screen Reader Optimization

```
Elementos críticos con aria-labels:

<button aria-label="Aceptar cambios de IA">
  [Aceptar]
</button>

<div aria-live="polite" aria-atomic="true">
  ✓ Tarea actualizada en Notion
</div>

<div role="status" aria-label="Loading">
  ⟳ Generando sugerencias...
</div>

Diff panel:
<div role="region" aria-label="Comparación Original vs Propuesta">
  <div aria-label="Original de Notion">...</div>
  <div aria-label="Propuesta de IA">...</div>
</div>

Status badges:
<span role="status">
  <span aria-label="Estado En Revisión">🟡 In Review</span>
</span>
```

### Estructura Semántica

```
<main role="main">
  <header>
    <h1>Task Enrichment Platform</h1>
    <nav aria-label="Navegación principal">
      <a href="#home">Home</a>
      <a href="#history">Historial</a>
      ...
    </nav>
  </header>

  <section aria-label="Filtros de búsqueda">
    <fieldset>
      <legend>Filtrar tareas por:</legend>
      <select aria-label="Sprint">...</select>
      <select aria-label="Estado">...</select>
      ...
    </fieldset>
  </section>

  <section aria-label="Lista de tareas">
    <article role="listitem" aria-label="Implementar login OAuth">
      <h3>...</h3>
      <p>...</p>
    </article>
  </section>
</main>

<aside role="complementary" aria-label="Chat panel">
  <div role="log" aria-live="polite">
    Mensajes del chat
  </div>
  <input type="text" aria-label="Campo de mensaje" />
</aside>
```

### Focus Management

```
Cuando abres un modal:
- Mueve focus a heading del modal
- Mantén focus dentro del modal (trap)
- Cierra modal (Escape): devuelve focus al botón que lo abrió

Cuando generación termina:
- Mueve focus a primer cambio propuesto (Diff panel)
- Anuncia con aria-live: "Sugerencias disponibles"

Cuando chat aparece:
- Mueve focus al input del chat
- Usuario puede empezar a escribir de inmediato

Lista navegable con ↑/↓:
- Arrow-down: siguiente item
- Arrow-up: item anterior
- Home: primer item
- End: último item
- Enter: abre item
```

### Imágenes y Iconografía

```
Iconos funcionales (clickeables):
<button aria-label="Cerrar panel">×</button>
<button aria-label="Abrir menú">☰</button>
<button aria-label="Copiar al clipboard">📋</button>

Iconos decorativos:
<span aria-hidden="true">✨</span>
<span aria-hidden="true">→</span>

Emojis con significado:
<span role="img" aria-label="Tarea completada">✓</span>
<span role="img" aria-label="Error">✕</span>
<span role="img" aria-label="Advertencia">⚠</span>

No usar solo color para comunicar información:
❌ "Estado [rojo]" (solo color)
✓ "Estado [rojo ✕ rechazada]" (color + texto + icono)
```

### Texto Alt y Descripciones

```
Wireframes / Screenshots en documentación:
<img src="dashboard.png"
     alt="Dashboard mostrando lista de 8 tareas pendientes,
          con filtros para Sprint, Estado y Tags.
          Cada tarea muestra estado badge (Draft/In Review),
          botón Enriquecer y preview de cambios IA." />

Diagrama de flujo en documentación:
<figure>
  <img src="flow.png" alt="User journey diagram mostrando 7 pasos..." />
  <figcaption>Flujo completo de enriquecimiento de tarea única</figcaption>
</figure>
```

### Testing de Accesibilidad

```
Herramientas recomendadas:
- axe DevTools (browser extension)
- Lighthouse (Chrome DevTools)
- NVDA Screen Reader (Windows - free)
- JAWS (premium, pero estándar industria)

Manual testing checklist:
□ Navegación con Tab: ¿funciona orden lógico?
□ Navegación con Shift+Tab: ¿regresa correctamente?
□ Modal: ¿focus trap funciona?
□ Escape: ¿cierra modales?
□ Entrada con teclado: ¿funcionan todos los botones?
□ Screen reader: ¿lee correctamente las etiquetas?
□ Zoom 200%: ¿se ve bien sin scroll horizontal?
□ Contraste: ¿legible con contraste mínimo?
□ Sin colores: ¿se entienden los estados sin solo color?
```

---

## Micro-interactions

### 1. Transición Button Click

```
┌─────────────────────────────────────────────────────────────┐
│ ACEPTAR CAMBIOS                                             │
│                                                              │
│ Antes:   [Aceptar]  (estado normal)                         │
│ Click:   [Aceptar]  (scale: 98%, duración: 50ms)           │
│ Después: [Aceptar]  (scale: 100% nuevamente)                │
│          + Toast arriba: "✓ Cambios aceptados"             │
│                                                              │
│ Feedback: Audio (opcional): "click" suave 80ms             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Animación de Generación

```
┌─────────────────────────────────────────────────────────────┐
│ CUANDO CLICKEA "GENERAR"                                    │
│                                                              │
│ Timeline (0-7s):                                            │
│                                                              │
│ t=0ms:   "⟳ Generando..." (spinner appears, fade-in 200ms) │
│ t=200ms: Spinner inicia rotación (360° cada 800ms)          │
│ t=6000ms: Progress indicator sutil (opacity: 0.5)           │
│ t=6500ms: Fade out spinner (300ms)                          │
│ t=6800ms: Panel de diff aparece (slide-in 400ms desde right)│
│          + "✨" animations en los cambios agregados         │
│                                                              │
│ Si toma > 10s:                                              │
│ - "Esto está tomando más de lo esperado..."                │
│ - Mostrar botón "Cancelar generación"                       │
└─────────────────────────────────────────────────────────────┘
```

### 3. Animación de Diff (Cambios destacados)

```
┌─────────────────────────────────────────────────────────────┐
│ NUEVO CONTENIDO EN DIFF                                     │
│                                                              │
│ Timeline:                                                    │
│                                                              │
│ t=0ms:    Línea nueva aparece (opacity: 0, bg: green-100)  │
│ t=0-200ms: Fade in (opacity: 0 → 1)                         │
│           Slide right (transform: translateX(-20px → 0))   │
│ t=200ms:  Reposo normal (opacity: 1, bg: normal)            │
│ t=500ms:  "✨" emoji destella (scale: 1 → 1.3 → 1)        │
│           duración: 400ms                                   │
│                                                              │
│ Resultado:                                                  │
│ ✨ + OAuth 2.0 setup completo                               │
│     ↑ aparece suave, luego ✨ brilla                        │
└─────────────────────────────────────────────────────────────┘
```

### 4. Chat Message Appearance

```
┌─────────────────────────────────────────────────────────────┐
│ USUARIO ENVÍA MENSAJE                                       │
│                                                              │
│ t=0ms:    Input deshabilitado (opacity: 0.5)                │
│           Mensaje: "Usuario: ..." (fade-in + slide-up 300ms)│
│ t=100ms:  "⟳ Sistema está pensando..." (color: gray)       │
│ t=0-2s:   Cursor parpea en input (animation: blink 1s)      │
│ t=1500ms: Respuesta del sistema comienza (fade-in 400ms)    │
│           Aparece por palabras (stagger effect):            │
│           "System:" + delay 50ms                            │
│           palabra1 + delay 50ms                             │
│           palabra2 + delay 50ms                             │
│           ...                                               │
│ t=final:  Input habilitado nuevamente                       │
│           Placeholder "Escribe aquí..."                     │
│           Cursor visible, usuario puede seguir escribiendo  │
│                                                              │
│ Si respuesta > 5s:                                          │
│ - "Sistema está procesando..." (texto actualizado)          │
└─────────────────────────────────────────────────────────────┘
```

### 5. Toast Notification

```
┌─────────────────────────────────────────────────────────────┐
│ TOAST APARECE & DESAPARECE                                  │
│                                                              │
│ Timeline:                                                    │
│                                                              │
│ t=0ms:    Toast: opacity=0, translateY(+30px) desde abajo   │
│ t=0-200ms: Slide-in + fade-in (suave)                       │
│           opacity: 0 → 1                                    │
│           translateY: 30px → 0                              │
│ t=200-3000ms: Reposo con subtle pulse (si tiene acción)     │
│ t=3000-3200ms: Fade-out (opacity: 1 → 0)                    │
│ t=3200ms: Desaparece del DOM                                │
│                                                              │
│ Si usuario hover:                                           │
│ - Pausa fade-out (no desaparece)                             │
│ - Muestra botón [×] más opaco                               │
│ - Resume fade-out en mouseout                               │
│                                                              │
│ Si usuario clicks [×]:                                      │
│ - Immediate fade-out (no wait)                              │
│ - Desaparece en 200ms                                       │
└─────────────────────────────────────────────────────────────┘
```

### 6. Modal Appearance

```
┌─────────────────────────────────────────────────────────────┐
│ MODAL SE ABRE (Confirmar sincronización)                   │
│                                                              │
│ Timeline:                                                    │
│                                                              │
│ t=0ms:    Overlay (fondo oscuro):                            │
│           opacity: 0 → animate to 1 in 200ms                │
│           backdrop-filter: blur(0px) → blur(4px)            │
│                                                              │
│ t=0ms:    Modal box:                                         │
│           scale: 0.95, opacity: 0                            │
│ t=50-300ms: Scale: 0.95 → 1.0 (ease-out)                    │
│           opacity: 0 → 1                                    │
│                                                              │
│ t=300ms:  Modal está completamente visible                  │
│           Focus mueve a heading                             │
│           o primer campo interactivo                        │
│                                                              │
│ Cierre (click [×] o Escape):                                │
│ t=0-150ms: Reverse animation (scale 1→0.95, opacity 1→0)    │
│ t=150ms:   Modal removido del DOM                           │
│           Focus devuelve al botón que lo abrió              │
│           Overlay fade-out paralelo                         │
└─────────────────────────────────────────────────────────────┘
```

### 7. Skeleton Loading (Futuro)

```
┌─────────────────────────────────────────────────────────────┐
│ MIENTRAS CARGA TAREA DESDE NOTION                          │
│                                                              │
│ Mostrar skeleton en lugar de vacío:                         │
│                                                              │
│ ┌─────────────────────────────────────────────┐            │
│ │ ████████████ (placeholder para título)      │            │
│ │ ████████████████ (placeholder para metadata) │            │
│ │ ████████████████████████████ (desc...)      │            │
│ │ ██████ ██████ ██████ (criteria...)           │            │
│ └─────────────────────────────────────────────┘            │
│                                                              │
│ Cada skeleton:                                              │
│ - bg: gray-200                                              │
│ - border-radius: 4px                                        │
│ - animate: shimmer (left-to-right wave, 1.5s infinite)      │
│ - opacity pulse suave (0.5 → 1 → 0.5)                       │
│                                                              │
│ Cuando datos llegan:                                        │
│ - Fade-out skeleton (300ms)                                 │
│ - Fade-in contenido real (300ms)                            │
└─────────────────────────────────────────────────────────────┘
```

### Librería de Animación Recomendada

```javascript
// En Next.js/React, usar:
// - Framer Motion (recomendado, granular control)
// - React Spring (physics-based)
// - CSS Animations nativas (para performance)

Ejemplo (Framer Motion):
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  ✓ Cambios aceptados
</motion.div>

Curvas de easing estándar:
- easeOut: para apariciones (UI responsive)
- easeIn: para desapariciones
- easeInOut: para movimientos complejos
```

---

## Decisiones de UX

### 1. Por qué Side-by-Side (No Stack)

**Decisión:** Mostrar Original vs Propuesta en columnas lado a lado, NO una encima de la otra.

**Rationale:**
- Desktop: Mejor comprensión visual de cambios (comparación inmediata)
- Accesibilidad: Screen reader puede leer ambas secciones en secuencia
- Performance: Ambas visibles sin scroll horizontal

**Tradeoff:**
- Mobile (< 768px): Stack vertical para mantener legibilidad
- 40% izquierda, 60% derecha en desktop (IA más destacada)

### 2. Chat Lateral vs Modal

**Decisión:** Chat como panel lateral (40% ancho) que puede cerrarse, NO como modal.

**Rationale:**
- El usuario sigue viendo el diff mientras chatea
- Contexto siempre visible
- Menos "intrusivo" que un modal
- Natural para iteraciones (propuesta → feedback → ajuste)

**Tradeoff:**
- Menos espacio para el diff (60% en lugar de 100%)
- En mobile, chat fullscreen (mejor UX que reducir diff)

### 3. Aceptación Inmediata (No Guardar + Sincronizar)

**Decisión:** Click en "Aceptar" → preview final opcional → Sincronizar (2 clics, no 3).

**Rationale:**
- Flujo más corto y rápido
- Menos decisiones antes de action
- Opción: checkbox "Auto-sincronizar" después de aceptar

**Contraste:** ¿Por qué no sincronizar de inmediato?
- Usuario podría querer editarla primero (Chat)
- Querer ver todos los cambios antes de comprometerse
- Control sobre cuándo toca Notion API

### 4. Rechazo = Simplemente Descartar (No Regenerar)

**Decisión:** Click "Rechazar" descarta la generación, botón "Regenerar" es separado.

**Rationale:**
- Dos acciones diferentes = dos clics (claro)
- Si usuario quiere rechazar + regenerar, es intencional (2 clics)
- Evita accidentes de "regenerar sin guardar"

**UX:** Después de "Rechazar", mostrar toast con opción "[Regenerar]" (botón en toast).

### 5. Batch Processing Secuencial (No Paralelo)

**Decisión:** Enriquecer múltiples tareas una a la vez (5s cada una) vs en paralelo (5s + 5s + 5s en paralelo).

**Rationale (Secuencial):**
- API rates más controlables (evita throttling Notion)
- UI más clara: siempre una tarea "actual"
- Usuario puede pausar/cambiar de opinión sin perder contexto
- Historial más clara

**Alternativa (Futuro):** UI de modo "batch inteligente" si la API lo soporta.

### 6. Historial Detallado (No Just Timestamps)

**Decisión:** Historial muestra cambios específicos por campo (diff), NO solo "task updated 2h ago".

**Rationale:**
- TPO necesita saber qué exactamente cambió
- Audit trail importante para compliance
- Poder revertir cambios específicos
- Aprender de los cambios IA

### 7. No Edición Directa en Notion (Only via Platform)

**Decisión:** Cambios **no** se sincronizan de vuelta a Notion automáticamente si usuario edita en Notion después.

**Rationale:**
- Evita conflictos (Notion editó, nuestra plataforma también)
- Control claro del flujo
- Previene sobrescrituras accidentales

**Flujo seguro:**
1. TPO enriquece en plataforma
2. Sincroniza a Notion (readonly desde aquí)
3. Si quiere editar más: hacerlo en Notion, volver a importar a plataforma

### 8. Chat No Tiene Conversación Persistente

**Decisión:** Chat es por-tarea, no cross-tarea. Se limpia cuando cambias de tarea.

**Rationale:**
- Contexto es la tarea actual
- No confundir conversaciones de diferentes tareas
- Historial documentado en "Cambios realizados"

**Contraste:** No es como Slack donde hay un canal persistente.

### 9. IA Sugiere, Humano Aprueba (No Auto-Apply)

**Decisión:** Los cambios de IA **nunca** se aplican sin aprobación explícita.

**Rationale:**
- Responsabilidad clara (TPO es responsable de cambios)
- Legal/compliance: auditable
- Confianza en la IA (usuario revisa siempre)

### 10. Acceso Notion via OAuth (No API Key Manual)

**Decisión:** Conectar a Notion solo vía OAuth, NO pedirle al usuario su API key.

**Rationale:**
- Seguridad (no almacenamos credenciales)
- Mejor UX (login único)
- Scopes explícitos (usuario ve qué permisos pide)

---

## Summary

Este documento define la experiencia completa del usuario para la plataforma de enriquecimiento de tareas TPO. Los principios guía son:

1. **Velocidad**: 30-45 min → 5-10 min
2. **Claridad**: Siempre saber qué está pasando
3. **Control**: Humano aprueba, nunca automático
4. **Accesibilidad**: WCAG 2.1 AA mínimo
5. **Confianza**: Auditable, reversible, seguro

**Próximos pasos:**
- [ ] Validar con TPOs reales (user testing)
- [ ] Crear componentes React basados en Design System
- [ ] Implementar prototipos interactivos
- [ ] Testing de accesibilidad con screen readers
- [ ] Documentación de componentes Storybook

---

**Documento creado:** 2026-03-16
**Último actualizado:** 2026-03-16
**Versión:** 1.0 (Draft)
**Estado:** Pendiente revisión equipo
