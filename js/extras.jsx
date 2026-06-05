/* B&A · Extras: Backup/Snapshots (tab viaje) · Carga IA (modal) · Propuesta PDF (modal) → window */
(function () {
  const { Icon, StatCard, CardHead } = window;
  const { useState, useEffect } = React;
  const BA = window.BA;

  // ============ BACKUP / AJUSTES (tab viaje) ============
  function Backup({ s, toast }) {
    const [snaps, setSnaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    async function loadSnaps() { setLoading(true); const l = await BA.source.tripSnapshots(s.id); setSnaps(Array.isArray(l) ? l : []); setLoading(false); }
    useEffect(() => { loadSnaps(); }, [s.id]);
    const fname = (s.etiqueta || s.id || 'viaje').replace(/[^\w.-]+/g, '_');
    function dl(content, filename, mime) {
      try { const blob = new Blob([content], { type: mime }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); return true; } catch (e) { return false; }
    }
    async function exportJson() {
      if (busy) return; setBusy(true); const data = await BA.source.exportTrip(s.id); setBusy(false);
      if (!data) { toast('No se pudo exportar'); return; }
      dl(JSON.stringify(data, null, 2), fname + '.json', 'application/json') ? toast('JSON descargado ✓') : toast('No se pudo descargar');
    }
    function importJson() {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json,.json';
      inp.onchange = async () => {
        const f = inp.files && inp.files[0]; if (!f) return;
        let obj; try { obj = JSON.parse(await f.text()); } catch (e) { toast('Archivo JSON inválido'); return; }
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { toast('Ese JSON no tiene formato de viaje'); return; }
        if (!window.confirm('Importar reemplaza TODO el contenido del viaje con el archivo. Se guarda un snapshot antes. ¿Continuar?')) return;
        await BA.source.saveSnapshot(s.id, 'Pre-importación');
        const r = await BA.source.setTripData(s.id, obj);
        if (r && r.ok) { toast('Viaje importado ✓'); setTimeout(() => location.reload(), 700); } else toast((r && r.error) || 'No se pudo importar');
      };
      inp.click();
    }
    function exportIcal() {
      const t = BA.tripData(s.id); const days = (t.itinerario || []); const sd = t.startDate ? new Date(t.startDate + 'T00:00:00Z') : null;
      if (!days.length) { toast('No hay itinerario para exportar'); return; }
      if (!sd || isNaN(sd.getTime())) { toast('Cargá las fechas del viaje (Config) para exportar el calendario'); return; }
      const p2 = n => String(n).padStart(2, '0');
      const dD = d => d.getUTCFullYear() + p2(d.getUTCMonth() + 1) + p2(d.getUTCDate());
      const dT = d => dD(d) + 'T' + p2(d.getUTCHours()) + p2(d.getUTCMinutes()) + '00Z';
      const esc = x => String(x || '').replace(/[,;\\]/g, ' ').replace(/\n/g, ' ');
      let L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Blisniuk & Amanov//Itinerario//ES', 'CALSCALE:GREGORIAN'];
      days.forEach(day => {
        const base = new Date(sd.getTime() + (Math.max(1, day.n) - 1) * 86400000);
        const slots = (day.slots || []).filter(sl => sl.type !== 'lodging');
        if (slots.length && slots.some(sl => sl.time)) {
          slots.forEach((sl, i) => {
            L.push('BEGIN:VEVENT', 'UID:' + s.id + '-' + day.n + '-' + i + '@bamanov');
            if (sl.time) { const t1 = String(sl.time).split(':'); const a = new Date(base); a.setUTCHours(+t1[0] || 0, +t1[1] || 0, 0, 0); L.push('DTSTART:' + dT(a)); if (sl.end) { const t2 = String(sl.end).split(':'); const b = new Date(base); b.setUTCHours(+t2[0] || 0, +t2[1] || 0, 0, 0); L.push('DTEND:' + dT(b)); } }
            else L.push('DTSTART;VALUE=DATE:' + dD(base));
            L.push('SUMMARY:' + esc(sl.title || 'Actividad')); if (sl.provider) L.push('DESCRIPTION:' + esc(sl.provider)); L.push('END:VEVENT');
          });
        } else {
          L.push('BEGIN:VEVENT', 'UID:' + s.id + '-' + day.n + '@bamanov', 'DTSTART;VALUE=DATE:' + dD(base), 'SUMMARY:' + esc('Día ' + day.n + ' · ' + (day.title || '')), 'END:VEVENT');
        }
      });
      L.push('END:VCALENDAR');
      dl(L.join('\r\n'), fname + '.ics', 'text/calendar') ? toast('iCal descargado ✓') : toast('No se pudo descargar');
    }
    async function save() { if (busy) return; setBusy(true); const r = await BA.source.saveSnapshot(s.id, 'Snapshot manual'); setBusy(false); if (r && r.ok) { toast('Snapshot guardado ✓'); loadSnaps(); } else toast((r && r.error) || 'No se pudo guardar'); }
    async function restore(sn) { if (!window.confirm('Restaurar «' + sn.label + '» (' + sn.when + ')? Reemplaza el estado actual del viaje.')) return; const r = await BA.source.restoreSnapshot(sn.id); if (r && r.ok) { toast('Restaurado ✓'); setTimeout(() => location.reload(), 700); } else toast((r && r.error) || 'No se pudo restaurar'); }
    async function reset() {
      if (!window.confirm('RESET COMPLETO: borra itinerario, proveedores, presupuesto y tareas de este viaje. Se guarda un snapshot antes. ¿Continuar?')) return;
      await BA.source.saveSnapshot(s.id, 'Pre-reset');
      const cur = (await BA.source.exportTrip(s.id)) || {}; const meta = cur.meta || {};
      const r = await BA.source.setTripData(s.id, { meta: meta, itinerary: [], providers: [], budget: [], actions: [] });
      if (r && r.ok) { toast('Viaje reseteado ✓'); setTimeout(() => location.reload(), 700); } else toast((r && r.error) || 'No se pudo resetear');
    }
    function Tool({ icon, t, d, onClick, danger }) {
      return React.createElement('button', { className: 'card pad', style: { textAlign: 'left', display: 'flex', gap: 13, alignItems: 'center', cursor: 'pointer', width: '100%' }, onClick },
        React.createElement('span', { className: 'stat-ic ' + (danger ? 'tint-bad' : 'tint'), style: { width: 40, height: 40 } }, React.createElement(Icon, { name: icon })),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 13.5, fontWeight: 650, color: danger ? 'var(--bad)' : 'var(--text-1)' } }, t),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 2 } }, d)),
        React.createElement(Icon, { name: 'cr', style: { color: 'var(--text-faint)' } }));
    }
    return React.createElement('div', null,
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: '1fr 1fr', marginBottom: 'var(--gap)' } },
        React.createElement(Tool, { icon: 'download', t: 'Exportar JSON', d: 'Descargá una copia completa del viaje', onClick: exportJson }),
        React.createElement(Tool, { icon: 'layers', t: 'Importar JSON', d: 'Reemplazá el contenido desde un archivo exportado', onClick: importJson }),
        React.createElement(Tool, { icon: 'calendar', t: 'Exportar iCal (.ics)', d: 'El itinerario para tu calendario', onClick: exportIcal }),
        React.createElement(Tool, { icon: 'download', t: 'Imprimir itinerario', d: 'Versión PDF lista para el cliente', onClick: () => { toast('Abriendo impresión…'); setTimeout(() => window.print(), 250); } })),
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Snapshots', count: snaps.length, right: React.createElement('button', { className: 'btn sm primary', disabled: busy, onClick: save }, React.createElement(Icon, { name: 'plus' }), 'Guardar versión') }),
        React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginBottom: 8 } }, 'Backup automático diario · se conservan 30 días.'),
        loading
          ? React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', padding: '8px 0' } }, 'Cargando…')
          : snaps.length === 0
            ? React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', padding: '8px 0' } }, 'Sin snapshots todavía.')
            : snaps.map(sn => React.createElement('div', { key: sn.id, className: 'snap' },
                React.createElement('span', { className: 'ic' }, React.createElement(Icon, { name: sn.auto ? 'refresh' : 'layers' })),
                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                  React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, sn.label),
                  React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)' } }, sn.when + ' · ' + sn.by)),
                sn.auto && React.createElement('span', { className: 'badge ghost', style: { padding: '2px 7px' } }, 'Auto'),
                React.createElement('button', { className: 'btn sm', onClick: () => restore(sn) }, 'Restaurar')))),
      React.createElement('div', { className: 'card pad', style: { borderColor: 'var(--bad-bg)' } },
        React.createElement(CardHead, { title: 'Zona de riesgo' }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' } },
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', maxWidth: 380 } }, 'Reset completo del viaje: borra itinerario, proveedores, presupuesto y tareas. Se guarda un snapshot antes de borrar.'),
          React.createElement('button', { className: 'btn', style: { color: 'var(--bad)', borderColor: 'var(--bad-bg)' }, onClick: reset }, React.createElement(Icon, { name: 'alert' }), 'Reset completo')))
    );
  }
  // ============ CARGA POR IA (modal) ============
  function AICapture({ onClose, toast, nav }) {
    const [tab, setTab] = useState('texto'); // texto | foto
    const [text, setText] = useState('');
    const [stage, setStage] = useState('input'); // input | analizando | result
    const [kind, setKind] = useState('proveedor');
    const sample = {
      proveedor: [['Nombre', 'Castello di Verduno', 98], ['Tipo', 'Restaurante', 95], ['Lugar', 'Verduno, Piemonte', 99], ['Teléfono', '+39 0172 470125', 92], ['Email', 'eventi@castelloverduno.it', 90]],
      lead: [['Nombre', 'Marco Pirelli', 97], ['Email', 'marco@pirelli.it', 95], ['Salida', 'Piemonte · Le Langhe', 88], ['Potencial', 'US$ 18k', 70], ['Fuente', 'Referido', 82]],
    };
    function analizar() { setStage('analizando'); setTimeout(() => setStage('result'), 1300); }
    return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
      React.createElement('div', { className: 'modal', onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'modal-head' },
          React.createElement('span', { className: 'ic' }, React.createElement(Icon, { name: 'spark' })),
          React.createElement('h3', null, 'Cargar con IA'),
          React.createElement('button', { className: 'drawer-close', onClick: onClose }, React.createElement(Icon, { name: 'x' }))),
        React.createElement('div', { className: 'modal-body' },
          stage === 'input' && React.createElement('div', null,
            React.createElement('div', { className: 'seg-tabs', style: { marginBottom: 16, maxWidth: 260 } },
              [['texto', 'Pegar texto'], ['foto', 'Foto / PDF']].map(([k, t]) => React.createElement('button', { key: k, className: tab === k ? 'on' : '', onClick: () => setTab(k) }, t))),
            tab === 'texto'
              ? React.createElement('textarea', { value: text, onChange: e => setText(e.target.value), placeholder: 'Pegá un email, un mensaje o los datos de una tarjeta…\n\nEj: «Castello di Verduno, Verduno. Tel +39 0172 470125. Cena privada, piden seña.»', style: { width: '100%', minHeight: 150, padding: 13, borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13, lineHeight: 1.5, resize: 'vertical' } })
              : React.createElement('div', { className: 'dropzone', onClick: () => { setText('(imagen cargada)'); toast('Imagen lista para analizar'); } },
                  React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: 'download' })),
                  React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-1)' } }, 'Arrastrá una foto o PDF'),
                  React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 4 } }, 'Tarjeta, factura, captura de email — la IA extrae los datos')),
            React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 16 } },
              React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)', alignSelf: 'center', marginRight: 4 } }, 'Crear:'),
              [['proveedor', 'Proveedor'], ['lead', 'Lead']].map(([k, t]) => React.createElement('button', { key: k, className: 'badge ' + (kind === k ? 'go' : 'ghost'), style: { cursor: 'pointer', padding: '6px 12px' }, onClick: () => setKind(k) }, t)))),
          stage === 'analizando' && React.createElement('div', { style: { textAlign: 'center', padding: '40px 20px' } },
            React.createElement('div', { className: 'stat-ic', style: { width: 52, height: 52, margin: '0 auto 16px', animation: 'bp 1.2s ease-in-out infinite' } }, React.createElement(Icon, { name: 'spark' })),
            React.createElement('div', { style: { fontSize: 14, color: 'var(--text-1)', fontWeight: 600 } }, 'Analizando con Claude…'),
            React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', marginTop: 4 } }, 'Extrayendo campos y normalizando datos')),
          stage === 'result' && React.createElement('div', null,
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 12.5, color: 'var(--go)' } },
              React.createElement(Icon, { name: 'check', style: { width: 16, height: 16 } }), 'Datos extraídos · revisá y confirmá'),
            sample[kind].map((r, i) => React.createElement('div', { key: i, className: 'xrow' },
              React.createElement('span', { className: 'k' }, r[0]),
              React.createElement('input', { defaultValue: r[1] }),
              React.createElement('span', { className: 'conf' }, r[2] + '%'))))
        ),
        React.createElement('div', { className: 'modal-foot' },
          React.createElement('button', { className: 'btn', onClick: onClose }, 'Cancelar'),
          stage === 'input' && React.createElement('button', { className: 'btn primary', disabled: !text.trim(), style: text.trim() ? null : { opacity: .5, pointerEvents: 'none' }, onClick: analizar }, React.createElement(Icon, { name: 'spark' }), 'Analizar'),
          stage === 'result' && React.createElement('button', { className: 'btn primary', onClick: () => { toast(kind === 'lead' ? 'Lead creado ✓' : 'Proveedor creado ✓'); onClose(); nav && nav(kind === 'lead' ? 'ventas' : 'biblioteca'); } }, React.createElement(Icon, { name: 'check' }), 'Crear ' + kind))
      )
    );
  }

  // ============ PROPUESTA PDF (modal preview) ============
  function Propuesta({ lead, onClose, toast }) {
    const [fmt, setFmt] = useState('3'); // 3 | 10
    const s = lead ? BA.salidaById(lead.salida) : BA.salidas[0];
    const pags = fmt === '3' ? BA.propuesta.paginas3 : BA.propuesta.paginas10;
    return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
      React.createElement('div', { className: 'modal', style: { width: 'min(820px, 100%)' }, onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'modal-head' },
          React.createElement('span', { className: 'ic' }, React.createElement(Icon, { name: 'download' })),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('h3', null, 'Propuesta · ' + (s ? s.titulo : '')),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 2 } }, lead ? 'Para ' + lead.nombre : 'Vista previa')),
          React.createElement('button', { className: 'drawer-close', onClick: onClose }, React.createElement(Icon, { name: 'x' }))),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'seg-tabs', style: { marginBottom: 18, maxWidth: 300 } },
            [['3', '3 páginas · resumen'], ['10', '10 páginas · completa']].map(([k, t]) => React.createElement('button', { key: k, className: fmt === k ? 'on' : '', onClick: () => setFmt(k) }, t))),
          React.createElement('div', { className: 'prop-pages' },
            pags.map((p, i) => React.createElement('div', { key: i, className: 'prop-page' + (i === 0 ? ' cover' : '') },
              React.createElement('div', { className: 'pg-body' },
                i === 0
                  ? React.createElement('div', null,
                      React.createElement('div', { style: { fontFamily: 'var(--ff-mono)', fontSize: 7, letterSpacing: '0.16em', color: 'var(--brass-soft)', textTransform: 'uppercase', marginBottom: 8 } }, 'Blisniuk & Amanov'),
                      React.createElement('div', { className: 'pg-ttl' }, s ? s.titulo : 'Propuesta'))
                  : React.createElement('div', null,
                      React.createElement('div', { className: 'pg-ttl' }, p),
                      React.createElement('div', { className: 'prop-thumb-line' }), React.createElement('div', { className: 'prop-thumb-line s' }), React.createElement('div', { className: 'prop-thumb-line' }))),
              React.createElement('span', { className: 'pg-n' }, (i + 1) + '/' + pags.length))))),
        React.createElement('div', { className: 'modal-foot' },
          React.createElement('button', { className: 'btn', onClick: () => { toast('Descargando PDF…'); setTimeout(() => window.print(), 250); } }, React.createElement(Icon, { name: 'download' }), 'Descargar PDF'),
          React.createElement('button', { className: 'btn primary', onClick: () => { toast('Propuesta enviada por mail ✓'); onClose(); } }, React.createElement(Icon, { name: 'send' }), 'Generar y enviar'))
      )
    );
  }

  window.Backup = Backup;
  window.AICapture = AICapture;
  window.Propuesta = Propuesta;
})();
