# Rhix — frontend

UI para revisar los Recibos por Honorarios (XML/UBL de SUNAT) que el
[backend de Rhix](https://github.com/JOSRANDOM/Rhix-RaphCorp) ingiere
automáticamente desde un buzón de correo dedicado.

Vite + React 19 + TypeScript + Tailwind v4. Todavía sin pantallas reales —
solo el placeholder que deja el scaffold.

## Requisitos

- Node.js
- El [backend de Rhix](https://github.com/JOSRANDOM/Rhix-RaphCorp) corriendo
  (`cmd/api`), para consumir `GET /api/receipts`.

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
- [ ] Pantalla de listado de recibos (consumiendo `GET /api/receipts` del backend)
- [ ] Exportación a `.xlsx` (cuando el backend tenga el endpoint de Fase 4)
