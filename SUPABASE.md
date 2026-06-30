# Conectar datos reales (Supabase) detrás del shell

Este prototipo está construido sobre una **capa de datos única** (`window.BA`) que hoy
sirve datos de ejemplo. La UI nunca lee Supabase directamente: lee `BA.*` (sincrónico)
o `BA.source.*` (asincrónico, el *seam* preparado para producción).

Para pasar de prototipo a producción **no hay que tocar los componentes** — solo
reemplazar el cuerpo de cada método de `BA.source` (en `js/data.js`) por el `fetch`
a la RPC / Edge Function / tabla correspondiente, y luego migrar cada vista de la
lectura sincrónica del mock a `await BA.source.x()`.

## Mapa vista → backend (lo que ya existe en `pptldpjwggrnbkvppolu`)

| Vista del shell            | `BA.source` método      | Backend real                                    |
|----------------------------|-------------------------|-------------------------------------------------|
| Hoy · El Puente (cola)     | `puente()`              | Edge fn `daily-brief`                            |
| Viajes / Salidas / GO-NO-GO| `trips()`               | RPC `trips_board` (tabla `trips`)                |
| Ventas (pipeline/funnel)   | `leads()`, `funnel()`   | RPC `leads_crm_list` / `leads_crm_pipeline`      |
| Lead drawer · avanzar etapa| `leadChangeStage()`     | RPC `lead_change_stage` / `lead_assign`          |
| Finanzas (cobranzas/caja)  | `finanzas()`            | RPC `payments_due` + `cashflow_projection`       |
| Finanzas · marcar pagado   | `markPaid()`            | RPC `mark_payment_paid`                          |
| Bandeja (triage IA)        | `bandeja()`             | tabla `emails` (`ai_*` de `email-ai`) + `email-inbound` |
| Bandeja · responder        | —                       | Edge fn `email-send` / `email-dispatch`          |
| Marketing / ROAS           | `marketing()`           | `meta_lead_webhook` + gasto de campaña (a cargar)|
| Cadencias                  | `cadencias()`           | RPC `cadence_render` (tabla `cadence_rules`)     |
| Calendario operativo       | `calendario()`          | composición de `payments_due` + deadlines + `trips_board` |
| Copiloto «Preguntale a Pasaporte Negro»| —                       | `claude_writer` + orquestador sobre las 23 RPCs  |
| Reporte ejecutivo PDF      | —                       | `generate_pdf_3pager` / `generate_pdf_10pager`   |

## Pasos sugeridos

1. **Auth + cliente**: cargar `@supabase/supabase-js`, inicializar con la URL del
   proyecto y la `anon key`, y resolver la sesión del operador (Brian / Federico).
2. **Reemplazar `BA.source`**: por ejemplo
   ```js
   async trips() {
     const { data } = await supabase.rpc('trips_board');
     return data.map(mapTripRow); // adaptar al shape que usa la UI (ver salidas[] en data.js)
   }
   ```
   Mantené los **mismos nombres de campo** que el mock (`estado`, `conf`, `min`,
   `accesosOk`, `readiness`, …) y el resto del shell sigue funcionando igual.
3. **Migrar vistas a async**: cada componente que hoy hace `BA.salidas` pasa a
   `const [data, setData] = useState(null); useEffect(()=>{ BA.source.trips().then(setData) }, [])`
   con un estado de carga (skeleton).
4. **Realtime**: suscribir `supabase.channel(...)` a `postgres_changes` para que la
   cola de El Puente y la Bandeja se actualicen solas (ya hay 5 canales en producción).
5. **Acciones**: cablear los botones que hoy hacen `toast(...)` a sus RPCs
   (`mark_payment_paid`, `lead_change_stage`, `generate_payment_plan`, `email-send`).

> El objetivo del seam es que la migración sea **incremental**: podés conectar una
> vista por vez sin romper el resto, porque todas hablan con `BA.source`.
