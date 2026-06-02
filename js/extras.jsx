/* B&A · Extras: Backup/Snapshots (tab viaje) · Carga IA (modal) · Propuesta PDF (modal) → window */
(function () {
  const { Icon, StatCard, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;

  // ============ BACKUP / AJUSTES (tab viaje) ============
  function Backup({ s, toast }) {
    const [snaps, setSnaps] = useState(() => BA.snapshots.map(x => ({ ...x })));
    function save() { setSnaps(L => [{ id: 'sn' + Date.now(), label: 'Snapshot manual', when: 'ahora', by: 'vos', size: '44 KB', auto: false }, ...L]); toast('Snapshot guardado ✓'); }
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
        React.createElement(Tool, { icon: 'download', t: 'Exportar JSON', d: 'Descargá una copia completa del viaje', onClick: () => toast('Exportando ' + s.etiqueta + '.json…') }),
        React.createElement(Tool, { icon: 'layers', t: 'Importar JSON', d: 'Restaurá desde un archivo exportado', onClick: () => toast('Seleccioná un archivo .json') }),
        React.createElement(Tool, { icon: 'calendar', t: 'Exportar iCal (.ics)', d: 'Sincronizá el itinerario con tu calendario', onClick: () => toast('Generando ' + s.etiqueta + '.ics…') }),
        React.createElement(Tool, { icon: 'download', t: 'Imprimir itinerario', d: 'Versión PDF lista para el cliente', onClick: () => { toast('Abriendo impresión…'); setTimeout(() => window.print(), 250); } })),
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Snapshots', count: snaps.length, right: React.createElement('button', { className: 'btn sm primary', onClick: save }, React.createElement(Icon, { name: 'plus' }), 'Guardar versión') }),
        snaps.map(sn => React.createElement('div', { key: sn.id, className: 'snap' },
          React.createElement('span', { className: 'ic' }, React.createElement(Icon, { name: sn.auto ? 'refresh' : 'layers' })),
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, sn.label),
            React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)' } }, sn.when + ' · ' + (BA.operadores.find(o => o.id === sn.by) || { name: sn.by }).name + ' · ' + sn.size)),
          sn.auto && React.createElement('span', { className: 'badge ghost', style: { padding: '2px 7px' } }, 'Auto'),
          React.createElement('button', { className: 'btn sm', onClick: () => toast('Restaurando «' + sn.label + '»…') }, 'Restaurar'))) ),
      React.createElement('div', { className: 'card pad', style: { borderColor: 'var(--bad-bg)' } },
        React.createElement(CardHead, { title: 'Zona de riesgo' }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' } },
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', maxWidth: 360 } }, 'Reset completo del viaje: borra slots, proveedores y reservas. Esta acción no se puede deshacer.'),
          React.createElement('button', { className: 'btn', style: { color: 'var(--bad)', borderColor: 'var(--bad-bg)' }, onClick: () => toast('Confirmá el reset (acción destructiva)') }, React.createElement(Icon, { name: 'alert' }), 'Reset completo')))
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
