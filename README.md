# Rhix — frontend

UI para revisar los Recibos por Honorarios (XML/UBL de SUNAT) que el
[backend de Rhix](https://github.com/JOSRANDOM/Rhix-RaphCorp) ingiere
automáticamente desde un buzón de correo dedicado.

Vite + React 19 + TypeScript + Tailwind v4.

## Pantallas

Navegación lateral (colapsable, se expande al pasar el cursor) con 3 secciones:

- **Bandeja de entrada** — listado de recibos procesados. Clic en una fila
  abre el correo original completo (de/para/copia/asunto/cuerpo) y los
  archivos que llegaron en ese correo, descargables desde ahí.
- **Archivos** — los XML recibidos, agrupados en carpetas por fecha de
  recepción, con vista previa y descarga.
- **Reportes** — exportación de todos los recibos a `.xlsx`.

## Requisitos

- Node.js
- El [backend de Rhix](https://github.com/JOSRANDOM/Rhix-RaphCorp) corriendo
  (`cmd/api`), para consumir sus endpoints.

## Desarrollo

```bash
npm install
npm run dev       # servidor de desarrollo con HMR
npm run build     # type-check (tsc -b) + build de producción
npm run lint      # oxlint
npm run preview   # sirve el build de producción en local
```

## Estado actual

- [x] Scaffold (Vite + React + TS + Tailwind v4)
- [x] Bandeja de entrada, Archivos y Reportes conectados al backend real
