# AI Work Log — Bitácora de Uso de IA

Este documento registra, de forma transparente y responsable, el uso de
herramientas de inteligencia artificial durante el desarrollo del proyecto
**Account Explorer**. Cada entrada describe la herramienta utilizada, la fase o
prompt clave, el problema o desafío detectado en la salida de la IA, y la
verificación o corrección manual realizada para garantizar el funcionamiento
correcto del código.

> **Política de uso:** La IA se empleó como asistente de generación y depuración.
> Todo el código generado fue revisado, probado y validado manualmente antes de
> su integración. Ninguna credencial ni dato sensible se compartió con las
> herramientas de IA.

| Herramienta de IA | Prompt Clave / Fase | Problema / Desafío Detectado | Verificación / Corrección Manual Realizada |
|-------------------|---------------------|------------------------------|--------------------------------------------|
| **Agentforce Vibes (Claude)** | Generación del controlador Apex `AccountController` con consulta SOQL de cuentas. | La primera versión no aplicaba seguridad a nivel de campo/objeto ni manejaba excepciones, exponiendo mensajes internos al cliente. | Se agregó `WITH USER_MODE` a la SOQL para respetar permisos del usuario, se envolvió la consulta en `try/catch` y se devolvió un `AuraHandledException` con mensaje genérico. Validado desplegando a la org y ejecutando `sf data query`. |
| **Agentforce Vibes (Claude)** | Generación de pruebas unitarias `AccountControllerTest`. | Las pruebas iniciales no creaban datos de prueba y asumían cuentas existentes en la org, provocando fallos de cobertura. | Se añadió `@testSetup` con inserción de cuentas de prueba y aserciones sobre el tamaño y orden del resultado. Ejecutado con `sf apex run test` verificando cobertura > 75%. |
| **ChatGPT** | Creación del Lightning Web Component `accountExplorer` (JS + HTML). | El adaptador `@wire` no reflejaba cambios de estado de carga y el manejo de errores devolvía `[object Object]` en lugar de un mensaje legible. | Se implementó el flag `isLoading`, y una función `reduceError` que aplana el arreglo `error.body` en un mensaje de texto. Probado en la org con y sin registros. |
| **ChatGPT** | Configuración del archivo `accountExplorer.js-meta.xml`. | Faltaban los atributos `isExposed` y `targets`, por lo que el componente no aparecía en Lightning App Builder. | Se agregó `<isExposed>true</isExposed>` y los `<target>` para `AppPage`, `HomePage` y `RecordPage`. Verificado arrastrando el componente en App Builder. |
| **Claude** | Componente React `App.jsx` con lógica de filtro, búsqueda y ordenamiento. | Los filtros se recalculaban en cada render causando parpadeo, y el `import` del JSON estaba roto (ruta incorrecta). | Se envolvió la lógica derivada en `useMemo` con dependencias correctas y se corrigió la ruta de importación a `./Account_Sample_Data.json`. Verificado en `npm run dev`. |
| **Claude** | Componente `AccountCard.jsx` y datos estáticos `Account_Sample_Data.json`. | El enlace telefónico (`tel:`) incluía espacios que rompían el formato, y faltaba un ícono de respaldo para industrias no mapeadas. | Se aplicó `Phone.replace(/\s+/g, '')` al `href` y se agregó el operador `??` con un ícono por defecto (`🏢`). Validado haciendo clic en los enlaces en el navegador. |
| **Agentforce Vibes (Claude)** | Redacción del `README.md` unificado (Salesforce + React). | La documentación generada asumía comandos y versiones de API que no coincidían con `sfdx-project.json` ni con el `package.json` de React. | Se contrastó cada comando y versión (`sf`, Node, API 67.0, scripts de Vite) contra los archivos reales del repositorio y se corrigieron las discrepancias. |

---

## Resumen de Verificación

- **Salesforce:** Desplegado con `sf project deploy start`; SOQL validada con
  `sf data query`; pruebas Apex ejecutadas con `sf apex run test`; componente
  colocado y verificado en Lightning App Builder.
- **React:** Dependencias instaladas con `npm install`; app ejecutada con
  `npm run dev` y verificada manualmente en el navegador (búsqueda, filtro,
  ordenamiento y estado vacío).
- **Calidad:** Linting con ESLint (Salesforce) y oxlint (React); formato con
  Prettier.
