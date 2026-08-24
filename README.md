# Account Explorer — Professional Readiness Sprint

Repositorio individual que reúne **dos implementaciones** del mismo caso de uso —
un directorio de cuentas corporativas con búsqueda, filtro por industria y
ordenamiento— construidas sobre plataformas distintas:

1. **Salesforce (LWC + Apex)** — El componente `accountExplorer` consume datos
   reales de la org vía un controlador Apex (`AccountController`) que ejecuta una
   consulta SOQL sobre el objeto `Account`.
2. **React local (`react-account-explorer`)** — Una SPA construida con Vite que
   replica la misma experiencia de usuario, pero se alimenta de un archivo de
   datos estático (`Account_Sample_Data.json`), **sin llamadas a APIs externas**.

El objetivo del sprint es demostrar dominio del stack de desarrollo de Salesforce
(Salesforce DX, LWC, Apex, SOQL) y del desarrollo front-end moderno (React, Vite),
manteniendo paridad funcional entre ambas soluciones.

---

## Requisitos Previos

Instala las siguientes herramientas antes de comenzar. Las versiones indicadas son
las recomendadas y validadas para este proyecto.

| Herramienta | Versión recomendada | Notas |
|-------------|---------------------|-------|
| **Node.js** | `>= 20 LTS` | Requerido por Vite 8 y las herramientas de LWC. |
| **npm** | `>= 10` | Se instala junto con Node.js. |
| **Salesforce CLI (`sf`)** | `>= 2.x` (última estable) | Descarga: [developer.salesforce.com/tools/salesforcecli](https://developer.salesforce.com/tools/salesforcecli). Verifica con `sf --version`. |
| **VS Code** | Última estable | Con el **Salesforce Extension Pack** (incluye Agentforce Vibes). |
| **Org de Salesforce** | Developer Edition o Sandbox | [Regístrate gratis](https://developer.salesforce.com/signup) si no cuentas con una. |

> El proyecto usa **API version `67.0`** (definida en `sfdx-project.json` y en el
> `.js-meta.xml` del LWC). Asegúrate de que tu org soporte esta versión.

---

## Estructura del Repositorio

El repositorio separa claramente ambos proyectos: el código de Salesforce vive en
`/force-app`, mientras que la aplicación React es autónoma en
`/react-account-explorer`.

```
AccountExplorer/
├── force-app/                          # ── Proyecto Salesforce DX ──
│   └── main/default/
│       ├── classes/
│       │   ├── AccountController.cls           # Controlador Apex (SOQL)
│       │   ├── AccountController.cls-meta.xml
│       │   ├── AccountControllerTest.cls       # Pruebas unitarias Apex
│       │   └── AccountControllerTest.cls-meta.xml
│       └── lwc/
│           └── accountExplorer/                # Lightning Web Component
│               ├── accountExplorer.js
│               ├── accountExplorer.html
│               ├── accountExplorer.css
│               └── accountExplorer.js-meta.xml
│
├── react-account-explorer/             # ── Aplicación React (Vite) ──
│   ├── src/
│   │   ├── App.jsx                             # Componente raíz + lógica de filtro
│   │   ├── AccountCard.jsx                     # Tarjeta de cuenta individual
│   │   ├── Account_Sample_Data.json            # Datos estáticos (sin API)
│   │   ├── App.css / index.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── config/                             # Definiciones de scratch org
├── manifest/                           # package.xml para despliegues selectivos
├── scripts/                            # Scripts Apex y SOQL de apoyo
├── sfdx-project.json                   # Manifiesto del proyecto Salesforce DX
└── package.json                        # Tooling raíz (lint, prettier, jest)
```

---

## Guía de Instalación y Ejecución — Salesforce

### 1. Autenticar la org

Autoriza tu org de desarrollo o sandbox mediante el flujo web. Se abrirá el
navegador para que inicies sesión.

```bash
sf org login web --alias AccountExplorerOrg --set-default
```

- `--alias` asigna un nombre corto reutilizable a la conexión.
- `--set-default` la establece como la org por defecto del proyecto.

### 2. Desplegar el código fuente a la org

Despliega todo el contenido de `force-app` (Apex + LWC) a la org autenticada.

```bash
sf project deploy start --source-dir force-app
```

> Para desplegar todo el proyecto por defecto, basta con `sf project deploy start`.

### 3. Verificar la consulta SOQL de Cuentas

El componente se alimenta de la misma consulta que ejecuta `AccountController`.
Puedes validar que la org devuelve datos ejecutando la SOQL directamente desde la
CLI:

```bash
sf data query --query "SELECT Id, Name, Industry, Phone FROM Account ORDER BY Name"
```

Si tu org no tiene cuentas, importa datos de ejemplo o crea algunas cuentas de
prueba antes de abrir el componente.

### 4. Agregar el LWC a una Lightning Page

El componente `accountExplorer` está expuesto (`isExposed = true`) para
`AppPage`, `HomePage` y `RecordPage`. Para colocarlo en una página:

1. En tu org, ve a **Setup → Lightning App Builder** (o edita cualquier página
   Lightning existente con el ícono de engranaje → *Edit Page*).
2. Crea o abre una página de tipo **App Page**, **Home Page** o **Record Page**.
3. En el panel de componentes de la izquierda, busca **"Account Explorer"** bajo
   la sección de componentes personalizados (Custom).
4. **Arrastra y suelta** el componente en la región deseada del lienzo.
5. Haz clic en **Save** y luego en **Activate** para asignar la página a una app,
   perfil o como página por defecto.

---

## Guía de Instalación y Ejecución — React

La aplicación React es completamente independiente de Salesforce.

### 1. Navegar e instalar dependencias

```bash
cd react-account-explorer
pnpm install
```

### 2. Ejecutar el servidor de desarrollo local

```bash
pnpm run dev
```

Vite levantará el servidor (por defecto en `http://localhost:5173`). Abre esa URL
en el navegador para ver la aplicación con recarga en caliente (HMR).

Otros comandos disponibles:

| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Servidor de desarrollo con HMR. |
| `pnpm run build` | Compila la versión de producción en `dist/`. |
| `pnpm run preview` | Sirve localmente el build de producción. |
| `pnpm run lint` | Analiza el código con **oxlint**. |

### 3. Consumo de datos estáticos (sin APIs externas)

A diferencia de la versión LWC —que consulta la org vía Apex/SOQL— la aplicación
React **no realiza ninguna llamada de red**. En su lugar:

- El archivo `src/Account_Sample_Data.json` contiene un arreglo de cuentas con la
  misma forma que devuelve la SOQL: `Id`, `Name`, `Industry` y `Phone`.
- `App.jsx` **importa el JSON directamente** como un módulo
  (`import accountsData from './Account_Sample_Data.json'`), por lo que Vite lo
  empaqueta en tiempo de compilación.
- Toda la lógica de búsqueda, filtrado por industria y ordenamiento se ejecuta en
  memoria en el cliente mediante hooks (`useMemo`, `useState`).

Esto hace que la app sea totalmente portátil y ejecutable sin conexión ni
credenciales, ideal para demostraciones offline.

---

## Autoría y Licencia / Aviso

- **Estudiante:** _[Escribe aquí tu nombre completo]_
- **Pod de soporte:** _[Escribe aquí tu pod / cohorte]_
- **Programa:** Professional Readiness Sprint — Account Explorer

> Este repositorio se entrega con fines educativos como parte del sprint de
> preparación profesional. El uso de asistentes de IA durante su desarrollo está
> documentado de forma transparente en [`AI_WORK_LOG.md`](./AI_WORK_LOG.md).
