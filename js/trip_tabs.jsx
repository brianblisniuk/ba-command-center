/* Pasaporte Negro · pestañas del Plano Viaje → window (Itinerario, Ruta, Proveedores, Presupuesto, Reservas, Tareas, AppCliente) */
(function () {
  const { Icon, Donut, Badge, Avatar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  const M = (usd, cur) => BA.money(usd, cur);

  // ============ ITINERARIO (editable, persiste en trips.data) ============
  function Itinerario({ s, cur, toast, openProvider, op }) {
    const [days, setDays] = useState(() => ((BA.tripData(s.id) || {}).itinerario || []));
    const [capa, setCapa] = useState('op'); // op | cliente
    const [open, setOpen] = useState(() => new Set((((BA.tripData(s.id) || {}).itinerario) || []).map(d => d.n)));
    const [expanded, setExpanded] = useState(null); // slot id
    const [busy, setBusy] = useState('');
    const [ed, setEd] = useState(null); // { mode:'new'|'edit', dayId, dia, slotId?, f:{time,end,title,desc,status} }
    const fileRef = React.useRef(null);
    const fileTarget = React.useRef(null); // { dayId, slotId }

    const VERDICTS = ['Confirmado', 'Por confirmar', 'En gestión'];
    const V2RAW = { 'Confirmado': 'ok', 'Por confirmar': 'warn', 'En gestión': 'danger' };
    const vClass = v => v === 'Confirmado' ? 'go' : v === 'Por confirmar' ? 'risk' : 'bad';
    const inSt = { width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 };

    function toggle(n) { setOpen(o => { const x = new Set(o); x.has(n) ? x.delete(n) : x.add(n); return x; }); }
    const allOpen = days.length > 0 && open.size === days.length;

    // ★ highlights (La Editorial) — persisten en content_highlights
    const [hl, setHl] = useState({}); // 'dia|titulo' -> id
    function loadHl() {
      Promise.resolve(BA.source.highlightsList(s.id)).then(rows => {
        const m = {}; (rows || []).forEach(r => { m[r.dia + '|' + r.titulo] = r.id; });
        setHl(m);
      });
    }
    React.useEffect(() => { loadHl(); }, [s.id]);
    function hlKey(day, sl) { return day.n + '|' + sl.title; }
    function toggleHl(day, sl) {
      const k = hlKey(day, sl); const was = !!hl[k];
      setHl(m => { const x = Object.assign({}, m); if (was) delete x[k]; else x[k] = 'tmp'; return x; });
      Promise.resolve(BA.source.highlightToggle(s.id, day.n, sl.title, sl.desc)).then(r => {
        if (!r || !r.ok) { setHl(m => { const x = Object.assign({}, m); if (was) x[k] = true; else delete x[k]; return x; }); toast('No se pudo guardar el highlight'); return; }
        if (r.marked && r.id) setHl(m => Object.assign({}, m, { [k]: r.id }));
        toast(r.marked ? '★ Highlight para La Editorial' : 'Highlight quitado');
      });
    }
    const hlCount = Object.keys(hl).length;

    // ---- persistencia (RPC itinerary_apply) ----
    async function applyOp(opName, payload, okMsg) {
      if (busy) return null;
      setBusy(opName);
      const r = await BA.source.itineraryApply(s.id, opName, payload);
      setBusy('');
      if (r && r.ok) {
        const it = r.itinerario || [];
        setDays(it);
        if (opName === 'day_add' && it.length) setOpen(o => new Set([...o, it[it.length - 1].n]));
        if (okMsg) toast(okMsg);
        loadHl();
        return r;
      }
      toast('No se pudo guardar: ' + ((r && r.error) || 'error'));
      return null;
    }

    function startNew(day) { setEd({ mode: 'new', dayId: day.id, dia: day.n, f: { time: '', end: '', title: '', desc: '', status: 'ok' } }); setOpen(o => new Set([...o, day.n])); }
    function startEdit(day, sl) { setEd({ mode: 'edit', dayId: day.id, dia: day.n, slotId: sl.id, f: { time: sl.time || '', end: sl.end || '', title: sl.title || '', desc: sl.desc || '', status: sl.rawStatus || 'ok' } }); }
    async function saveEd() {
      if (!ed) return;
      const f = ed.f;
      if (!f.title.trim()) { toast('El momento necesita un título'); return; }
      const campos = { title: f.title.trim(), timeStart: f.time.trim(), timeEnd: f.end.trim(), description: f.desc.trim(), status: f.status };
      const r = ed.mode === 'new'
        ? await applyOp('slot_add', { dayId: ed.dayId, slot: campos }, 'Momento agregado')
        : await applyOp('slot_upd', { dayId: ed.dayId, slotId: ed.slotId, patch: campos }, 'Momento actualizado');
      if (r) setEd(null);
    }
    async function delSlot() {
      if (!ed || ed.mode !== 'edit') return;
      if (!window.confirm('¿Eliminar este momento del itinerario?')) return;
      const r = await applyOp('slot_del', { dayId: ed.dayId, slotId: ed.slotId }, 'Momento eliminado');
      if (r) { setEd(null); setExpanded(null); }
    }
    function moveSlot(dir) { if (!ed || ed.mode !== 'edit') return; applyOp('slot_move', { dayId: ed.dayId, slotId: ed.slotId, dir }, null); }
    function cycleVerdict(day, sl) {
      const next = VERDICTS[(VERDICTS.indexOf(sl.verdict) + 1) % 3];
      applyOp('slot_upd', { dayId: day.id, slotId: sl.id, patch: { status: V2RAW[next] } }, 'Veredicto → ' + next);
    }
    function toggleVis(day, sl) {
      applyOp('slot_vis', { dayId: day.id, slotId: sl.id, visible: !sl.clientVisible }, !sl.clientVisible ? 'Visible al cliente' : 'Oculto al cliente');
    }
    function renameDay(day) {
      const t = window.prompt('Título del día', day.title || '');
      if (t == null) return;
      applyOp('day_upd', { dayId: day.id, title: t.trim() }, 'Día actualizado');
    }
    function delDay(day) {
      if (!window.confirm('¿Eliminar el Día ' + day.n + ' completo (' + day.slots.length + ' momentos)? Sus ★ también se quitan.')) return;
      applyOp('day_del', { dayId: day.id }, 'Día eliminado');
    }

    // ---- adjuntos (Storage trip-files) ----
    function pickFile(day, sl) { fileTarget.current = { dayId: day.id, slotId: sl.id }; if (fileRef.current) fileRef.current.click(); }
    async function onFile(e) {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      const tgt = fileTarget.current;
      if (!file || !tgt) return;
      if (file.size > 25 * 1024 * 1024) { toast('Máximo 25 MB por adjunto'); return; }
      setBusy('att');
      const limpio = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-80);
      const path = s.id + '/' + tgt.slotId + '/' + Date.now() + '_' + limpio;
      const up = await BA.source.fileUpload(path, file);
      setBusy('');
      if (!up || !up.ok) { toast('No se pudo subir: ' + ((up && up.error) || 'error')); return; }
      await applyOp('att_add', { dayId: tgt.dayId, slotId: tgt.slotId, att: { name: file.name, path, mime: file.type || '', size: file.size } }, 'Adjunto subido');
    }
    async function openAtt(a) {
      if (!a.path) { toast('Adjunto sin archivo'); return; }
      const url = await BA.source.fileSignedUrl(a.path);
      if (url) window.open(url, '_blank'); else toast('No se pudo abrir el adjunto');
    }
    async function delAtt(day, sl, a) {
      if (!window.confirm('¿Eliminar el adjunto "' + (a.name || 'archivo') + '"?')) return;
      if (a.path) await BA.source.fileRemove(a.path);
      await applyOp('att_del', { dayId: day.id, slotId: sl.id, path: a.path || '' }, 'Adjunto eliminado');
    }

    function editorCard(day) {
      if (!ed || ed.dayId !== day.id) return null;
      const f = ed.f;
      const set = (k, v) => setEd(x => ({ ...x, f: Object.assign({}, x.f, { [k]: v }) }));
      const fld = (label, w, el) => React.createElement('div', { style: { flex: w } },
        React.createElement('label', { className: 'eyebrow', style: { display: 'block', marginBottom: 5 } }, label), el);
      return React.createElement('div', { style: { marginTop: 10, padding: '13px 15px', border: '1px solid var(--brass)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)' } },
        React.createElement('div', { className: 'eyebrow', style: { marginBottom: 9 } }, (ed.mode === 'new' ? 'Nuevo momento' : 'Editando momento') + ' · Día ' + day.n),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
          fld('Desde', '0 1 100px', React.createElement('input', { value: f.time, placeholder: '09:00', onChange: e => set('time', e.target.value), style: inSt })),
          fld('Hasta', '0 1 100px', React.createElement('input', { value: f.end, placeholder: '11:00', onChange: e => set('end', e.target.value), style: inSt })),
          fld('Título', '1 1 220px', React.createElement('input', { value: f.title, placeholder: 'Título del momento', onChange: e => set('title', e.target.value), style: inSt })),
          fld('Estado', '0 1 150px', React.createElement('select', { value: f.status, onChange: e => set('status', e.target.value), style: inSt },
            [['ok', 'Confirmado'], ['warn', 'Por confirmar'], ['danger', 'En gestión']].map(([v, t]) => React.createElement('option', { key: v, value: v }, t))))),
        React.createElement('div', { style: { marginTop: 10 } },
          React.createElement('label', { className: 'eyebrow', style: { display: 'block', marginBottom: 5 } }, 'Descripción'),
          React.createElement('textarea', { value: f.desc, rows: 2, placeholder: 'Descripción (capa operativa)', onChange: e => set('desc', e.target.value), style: Object.assign({}, inSt, { resize: 'vertical', fontFamily: 'inherit' }) })),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 } },
          React.createElement('button', { className: 'btn sm primary', disabled: !!busy, onClick: saveEd }, React.createElement(Icon, { name: 'check' }), busy ? 'Guardando…' : 'Guardar'),
          React.createElement('button', { className: 'btn sm', onClick: () => setEd(null) }, 'Cancelar'),
          ed.mode === 'edit' && React.createElement('button', { className: 'btn sm', disabled: !!busy, title: 'Subir', onClick: () => moveSlot('up') }, React.createElement(Icon, { name: 'au' })),
          ed.mode === 'edit' && React.createElement('button', { className: 'btn sm', disabled: !!busy, title: 'Bajar', onClick: () => moveSlot('down') }, React.createElement(Icon, { name: 'ad' })),
          ed.mode === 'edit' && React.createElement('button', { className: 'btn sm', disabled: !!busy, style: { color: 'var(--bad)' }, onClick: delSlot }, React.createElement(Icon, { name: 'x' }), 'Eliminar')));
    }

    return React.createElement('div', null,
      React.createElement('input', { ref: fileRef, type: 'file', style: { display: 'none' }, onChange: onFile }),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' } },
        React.createElement('div', { className: 'tb-seg' },
          [['op', 'Operativo'], ['cliente', 'Cliente']].map(([k, t]) => React.createElement('button', { key: k, className: capa === k ? 'on' : '', onClick: () => setCapa(k) }, t))),
        React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
          hlCount > 0 && React.createElement('span', { className: 'tag', style: { padding: '5px 10px', color: 'var(--brass)' } },
            React.createElement(Icon, { name: 'star', style: { width: 12, height: 12, fill: 'currentColor' } }), hlCount + (hlCount === 1 ? ' highlight' : ' highlights')),
          React.createElement('button', { className: 'btn sm', onClick: () => setOpen(allOpen ? new Set() : new Set(days.map(d => d.n))) }, React.createElement(Icon, { name: 'layers' }), allOpen ? 'Colapsar' : 'Expandir'),
          React.createElement('button', { className: 'btn sm primary', disabled: !!busy, onClick: () => applyOp('day_add', {}, 'Día agregado') }, React.createElement(Icon, { name: 'plus' }), 'Agregar día'))
      ),
      days.length === 0 && React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)', padding: '34px 20px' } },
        'Sin itinerario todavía. Tocá "Agregar día" para empezar a armarlo.'),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        days.map(day => {
          const isOpen = open.has(day.n);
          const slots = day.slots.filter(sl => capa === 'op' || sl.clientVisible);
          return React.createElement('div', { key: day.id || day.n, className: 'card', style: { overflow: 'hidden' } },
            React.createElement('div', { onClick: () => toggle(day.n), style: { display: 'flex', alignItems: 'center', gap: 13, padding: '14px 18px', cursor: 'pointer' } },
              React.createElement('div', { style: { width: 40, height: 40, borderRadius: 10, background: day.cover, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
                React.createElement('span', { style: { fontSize: 9, opacity: .8, textTransform: 'uppercase', letterSpacing: '.5px' } }, day.dow || 'Día'),
                React.createElement('span', { style: { fontFamily: 'var(--ff-display)', fontSize: 17, lineHeight: 1 } }, day.n)),
              React.createElement('div', { style: { minWidth: 0, flex: 1 } },
                React.createElement('div', { className: 'nm', style: { fontSize: 14.5 } }, day.title),
                React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 3, fontFamily: 'var(--ff-mono)' } },
                  slots.length + (slots.length === 1 ? ' momento' : ' momentos') + (capa === 'op' ? ' · est. ' + M(day.estUSD, cur) : ''))),
              capa === 'op' && React.createElement('button', { className: 'tag', title: 'Renombrar día', style: { padding: '5px 9px' }, onClick: e => { e.stopPropagation(); renameDay(day); } }, '✎'),
              capa === 'op' && React.createElement('button', { className: 'tag', title: 'Eliminar día', style: { padding: '5px 9px' }, onClick: e => { e.stopPropagation(); delDay(day); } }, React.createElement(Icon, { name: 'x', style: { width: 12, height: 12 } })),
              React.createElement(Icon, { name: isOpen ? 'cd' : 'cr', style: { color: 'var(--text-3)' } })),
            isOpen && React.createElement('div', { style: { padding: '0 18px 18px' } },
              slots.map((sl, i) => {
                const st = BA.STYPE[sl.type] || BA.STYPE.service; const v = sl.verdict; const isExp = expanded === sl.id; const showV = sl.clientVisible;
                return React.createElement('div', { key: sl.id || i },
                  React.createElement('div', { className: 'slot' + (sl.conflict && capa === 'op' ? ' conflict' : ''), style: { marginTop: i === 0 ? 6 : 6 } },
                    React.createElement('div', { style: { width: 5, flexShrink: 0, background: st.c } }),
                    React.createElement('div', { className: 'slot-time' },
                      React.createElement('div', { className: 'a' }, sl.time),
                      React.createElement('div', { className: 'b' }, sl.end)),
                    React.createElement('div', { className: 'slot-main', onClick: () => capa === 'op' && setExpanded(isExp ? null : sl.id) },
                      React.createElement('div', { className: 'slot-head' },
                        React.createElement('span', { className: 'slot-glyph', style: { background: st.c } }, st.g),
                        React.createElement('span', { className: 'slot-title' }, capa === 'cliente' ? sl.client.title : sl.title),
                        capa === 'op' && React.createElement('button', {
                          title: hl[hlKey(day, sl)] ? 'Quitar de La Editorial' : 'Marcar como highlight (La Editorial)',
                          onClick: e => { e.stopPropagation(); toggleHl(day, sl); },
                          style: { background: 'none', border: 'none', cursor: 'pointer', padding: 2, lineHeight: 0, flexShrink: 0, color: hl[hlKey(day, sl)] ? 'var(--brass)' : 'var(--text-faint)' }
                        }, React.createElement(Icon, { name: 'star', style: { width: 15, height: 15, fill: hl[hlKey(day, sl)] ? 'currentColor' : 'none' } })),
                        capa === 'op' && sl.access && React.createElement('span', { className: 'badge brass', style: { padding: '2px 7px' } }, React.createElement(Icon, { name: 'key', style: { width: 10, height: 10 } }), 'Acceso'),
                        capa === 'op' && React.createElement('span', { className: 'badge ' + vClass(v), style: { padding: '2px 7px', cursor: 'pointer' }, onClick: e => { e.stopPropagation(); cycleVerdict(day, sl); } }, v),
                        capa === 'op' && React.createElement(Icon, { name: isExp ? 'cd' : 'cr', style: { color: 'var(--text-faint)', width: 16, height: 16 } })),
                      React.createElement('div', { className: 'slot-desc' }, capa === 'cliente' ? sl.client.desc : sl.desc),
                      capa === 'op' && React.createElement('div', { className: 'slot-meta' },
                        React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, st.t),
                        sl.provider !== '—' && React.createElement('span', { className: 'tag', style: { padding: '2px 8px', cursor: 'pointer' }, onClick: e => { e.stopPropagation(); sl.providerId && openProvider ? openProvider(sl.providerId) : toast(sl.provider); } }, React.createElement(Icon, { name: 'users' }), sl.provider),
                        sl.attachments.length > 0 && React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, React.createElement(Icon, { name: 'book' }), sl.attachments.length),
                        React.createElement('span', { className: 'vis-toggle' + (showV ? ' on' : ''), onClick: e => { e.stopPropagation(); toggleVis(day, sl); } }, React.createElement(Icon, { name: 'eye' }), showV ? 'Visible' : 'Oculto')),
                      isExp && capa === 'op' && React.createElement('div', { className: 'slot-expand' },
                        React.createElement('div', { className: 'layer' },
                          React.createElement('div', { className: 'layer-h' }, React.createElement(Icon, { name: 'settings', style: { width: 12, height: 12 } }), 'Operativo (interno)'),
                          React.createElement('div', { className: 'layer-t' }, sl.internal.title),
                          React.createElement('div', { className: 'layer-d' }, sl.internal.desc)),
                        React.createElement('div', { className: 'layer cli' },
                          React.createElement('div', { className: 'layer-h' }, React.createElement(Icon, { name: 'eye', style: { width: 12, height: 12 } }), 'Cliente (narrativa)'),
                          React.createElement('div', { className: 'layer-t' }, sl.client.title),
                          React.createElement('div', { className: 'layer-d' }, sl.client.desc))),
                      isExp && capa === 'op' && sl.attachments.length > 0 && React.createElement('div', { style: { paddingLeft: 35, marginTop: 9, display: 'flex', flexDirection: 'column', gap: 6 } },
                        sl.attachments.map((a, ai) => React.createElement('div', { key: ai, style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 } },
                          React.createElement(Icon, { name: 'download', style: { width: 13, height: 13, color: 'var(--text-3)', flexShrink: 0 } }),
                          React.createElement('span', { style: { color: 'var(--text-1)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 } }, a.name || 'archivo'),
                          a.path && React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); openAtt(a); } }, 'Abrir'),
                          React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); delAtt(day, sl, a); } }, React.createElement(Icon, { name: 'x', style: { width: 12, height: 12 } }))))),
                      isExp && capa === 'op' && React.createElement('div', { className: 'slot-actions' },
                        React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); startEdit(day, sl); } }, React.createElement(Icon, { name: 'list' }), 'Editar'),
                        React.createElement('button', { className: 'btn sm', disabled: busy === 'att', onClick: e => { e.stopPropagation(); pickFile(day, sl); } }, React.createElement(Icon, { name: 'plus' }), busy === 'att' ? 'Subiendo…' : 'Adjuntar'),
                        React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); sl.providerId && openProvider ? openProvider(sl.providerId) : toast('Sin proveedor asignado'); } }, React.createElement(Icon, { name: 'users' }), 'Proveedor')),
                      isExp && capa === 'op' && op && window.CommentsSection && React.createElement('div', { onClick: e => e.stopPropagation(), style: { paddingLeft: 35 } },
                        React.createElement(window.CommentsSection, { ckey: 'slot:' + sl.id, op, toast }))
                    )
                  )
                );
              }),
              editorCard(day),
              capa === 'op' && React.createElement('button', { className: 'btn sm', style: { marginTop: 12, marginLeft: 0 }, disabled: !!busy, onClick: () => startNew(day) }, React.createElement(Icon, { name: 'plus' }), 'Agregar momento')
            )
          );
        })
      )
    );
  }

  // ============ RUTA ============
  function Ruta({ s, cur, toast }) {
    const data = BA.tripData(s.id).itinerario;
    const tc = BA.tripData(s.id).travelCache || {};
    const [dia, setDia] = useState(data[1] ? 2 : 1);
    const [modo, setModo] = useState('dia'); // dia | p2p
    const [sheet, setSheet] = useState(null);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(1);
    const day = data.find(d => d.n === dia) || data[0];
    if (!day) return React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Sin itinerario todavía. Cargalo en la pestaña Itinerario.');
    const stops = day.slots.filter(sl => sl.type !== 'lodging');
    const legBetween = (a, b) => {
      if (!a || !b || a.lat == null || b.lat == null || a.lng == null || b.lng == null) return null;
      const ka = a.lat.toFixed(4) + ',' + a.lng.toFixed(4), kb = b.lat.toFixed(4) + ',' + b.lng.toFixed(4);
      return tc[ka + '->' + kb] || tc[kb + '->' + ka] || null;
    };
    const fmtKm = (km) => (Math.round((Number(km) || 0) * 10) / 10);
    let totKm = 0, totMin = 0, legsKnown = 0;
    for (let i = 0; i < stops.length - 1; i++) { const lg = legBetween(stops[i], stops[i + 1]); if (lg) { totKm += Number(lg.distance_km) || 0; totMin += Number(lg.duration_min) || 0; legsKnown++; } }
    const totLabel = legsKnown > 0 ? (fmtKm(totKm) + ' km \u00b7 ' + totMin + ' min') : null;
    const p2pLeg = (from > 0 && to > 0 && from !== to) ? legBetween(stops[from - 1], stops[to - 1]) : null;
    const mapsSearch = (q) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
    const mapsDir = (pts) => 'https://www.google.com/maps/dir/' + pts.filter(Boolean).map(x => encodeURIComponent(x)).join('/');
    const openMaps = (url) => { try { window.open(url, '_blank', 'noopener'); } catch (e) { toast('No se pudo abrir el mapa'); } };
    const stopQ = (st) => (st && st.address) ? st.address : ((st && st.title ? st.title : '') + (s.region ? ', ' + s.region : ''));
    const base = ('Basecamp' + (s.region ? ' ' + s.region : '')).trim();
    const dayUrl = mapsDir([base, ...stops.map(st => stopQ(st))]);
    const puntos = [base, ...stops.map(st => st.title)];
    const p2pUrl = mapsDir([from === 0 ? base : stopQ(stops[from - 1]), to === 0 ? base : stopQ(stops[to - 1])]);
    const selSt = { width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 };
    const xy = (i, n) => ({ x: 14 + (i * 72) / Math.max(1, n - 1), y: 22 + (i % 2 ? 26 : -4) + 18 });

    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' } },
        React.createElement('div', { className: 'seg-tabs', style: { maxWidth: 240 } },
          [['dia', 'Modo d\u00eda'], ['p2p', 'Punto a punto']].map(([k, t]) => React.createElement('button', { key: k, className: modo === k ? 'on' : '', onClick: () => { setModo(k); setSheet(null); } }, t))),
        React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
          totLabel && React.createElement('span', { className: 'tag', style: { background: 'var(--laurel-soft)', color: 'var(--laurel)', borderColor: 'transparent' } }, React.createElement(Icon, { name: 'route', style: { width: 13, height: 13 } }), totLabel),
          React.createElement('span', { className: 'tag' }, React.createElement(Icon, { name: 'route', style: { width: 13, height: 13 } }), stops.length + (stops.length === 1 ? ' parada' : ' paradas')))
      ),
      modo === 'dia' && React.createElement('div', { className: 'tb-seg', style: { marginBottom: 14, display: 'inline-flex' } },
        data.map(d => React.createElement('button', { key: d.n, className: dia === d.n ? 'on' : '', onClick: () => { setDia(d.n); setSheet(null); } }, 'D\u00eda ' + d.n))),
      modo === 'p2p' && React.createElement('div', { className: 'card pad', style: { marginBottom: 14 } },
        React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' } },
          React.createElement('div', { style: { flex: 1, minWidth: 160 } }, React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, 'Desde'),
            React.createElement('select', { value: from, onChange: e => setFrom(+e.target.value), style: selSt }, puntos.map((pt, i) => React.createElement('option', { key: i, value: i }, pt)))),
          React.createElement(Icon, { name: 'arrowright', style: { width: 18, height: 18, color: 'var(--text-3)', marginBottom: 10 } }),
          React.createElement('div', { style: { flex: 1, minWidth: 160 } }, React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, 'Hasta'),
            React.createElement('select', { value: to, onChange: e => setTo(+e.target.value), style: selSt }, puntos.map((pt, i) => React.createElement('option', { key: i, value: i }, pt)))),
          React.createElement('button', { className: 'btn primary', style: { marginBottom: 2 }, onClick: () => openMaps(p2pUrl) }, React.createElement(Icon, { name: 'route' }), 'Ver ruta en Google Maps')),
        p2pLeg
          ? React.createElement('div', { style: { marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rule-soft)', display: 'flex', alignItems: 'center', gap: 8 } },
              React.createElement(Icon, { name: 'route', style: { width: 15, height: 15, color: 'var(--laurel)' } }),
              React.createElement('span', { className: 'mono', style: { fontSize: 13.5, color: 'var(--text-1)', fontWeight: 700 } }, fmtKm(p2pLeg.distance_km) + ' km \u00b7 ' + p2pLeg.duration_min + ' min'),
              React.createElement('span', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, 'en auto \u00b7 distancia real'))
          : ((from > 0 && to > 0 && from !== to) ? React.createElement('div', { style: { marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rule-soft)', fontSize: 11.5, color: 'var(--text-3)' } }, 'Distancia no cacheada para este tramo \u2014 abr\u00edla en Google Maps.') : null)),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: modo === 'dia' ? day.title : 'Ruta directa', right: React.createElement('button', { className: 'card-link', onClick: () => openMaps(modo === 'dia' ? dayUrl : p2pUrl) }, 'Google Maps', React.createElement(Icon, { name: 'cr' })) }),
        React.createElement('div', { style: { position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface-2)', aspectRatio: '16/10' } },
          React.createElement('svg', { viewBox: '0 0 100 75', preserveAspectRatio: 'none', style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } },
            [15, 30, 45, 60].map(y => React.createElement('line', { key: 'h' + y, x1: 0, x2: 100, y1: y, y2: y, stroke: 'var(--rule-soft)', strokeWidth: 0.3 })),
            [20, 40, 60, 80].map(x => React.createElement('line', { key: 'v' + x, x1: x, x2: x, y1: 0, y2: 75, stroke: 'var(--rule-soft)', strokeWidth: 0.3 })),
            modo === 'dia'
              ? React.createElement('path', { d: stops.map((sl, i) => { const pp = xy(i, stops.length); return (i ? 'L' : 'M') + pp.x + ' ' + pp.y; }).join(' '), fill: 'none', stroke: 'var(--brass)', strokeWidth: 0.7, strokeDasharray: '1.5 1.5' })
              : React.createElement('path', { d: 'M 18 30 Q 50 20 82 50', fill: 'none', stroke: 'var(--brass)', strokeWidth: 0.8, strokeDasharray: '1.5 1.5' })),
          modo === 'dia'
            ? stops.map((sl, i) => { const pp = xy(i, stops.length);
                return React.createElement('div', { key: i, style: { position: 'absolute', left: pp.x + '%', top: pp.y + '%', transform: 'translate(-50%,-50%)', width: 26, height: 26, borderRadius: 9, background: sl.access ? 'var(--brass)' : 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-mono)', fontSize: 12, fontWeight: 700, boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }, title: sl.title, onClick: () => setSheet(sl) }, i + 1); })
            : [['18%', '30%', 'A'], ['82%', '50%', 'B']].map((pp, i) => React.createElement('div', { key: i, style: { position: 'absolute', left: pp[0], top: pp[1], transform: 'translate(-50%,-50%)', width: 28, height: 28, borderRadius: 9, background: i ? 'var(--brass)' : 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-mono)', fontSize: 12, fontWeight: 700, boxShadow: 'var(--shadow-sm)' } }, pp[2])),
          React.createElement('div', { style: { position: 'absolute', left: 8, bottom: 6, fontSize: 9.5, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', background: 'var(--surface)', padding: '2px 6px', borderRadius: 6, opacity: 0.85 } }, 'Esquema de secuencia \u00b7 no a escala'),
          sheet && React.createElement('div', { className: 'sheet' },
            React.createElement('span', { className: 'sheet-grab' }),
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 4 } },
              React.createElement('span', { className: 'slot-glyph', style: { background: (BA.STYPE[sheet.type] || {}).c || 'var(--accent)' } }, (BA.STYPE[sheet.type] || {}).g || '\u25cf'),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 650, color: 'var(--text-1)' } }, sheet.title),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 2 } }, (sheet.time || '') + (sheet.end ? '\u2013' + sheet.end : '') + ' \u00b7 ' + (sheet.provider || '\u2014'))),
              React.createElement('button', { className: 'drawer-close', style: { width: 28, height: 28 }, onClick: () => setSheet(null) }, React.createElement(Icon, { name: 'x' }))),
            React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 12 } },
              React.createElement('button', { className: 'btn sm primary', style: { flex: 1 }, onClick: () => openMaps(sheet.mapUrl || mapsSearch(stopQ(sheet))) }, React.createElement(Icon, { name: 'pin' }), 'Ver en Google Maps')))
        ),
        modo === 'dia' && React.createElement('div', { style: { marginTop: 16 } },
          stops.map((sl, i) => {
            const lg = (i < stops.length - 1) ? legBetween(sl, stops[i + 1]) : null;
            return React.createElement(React.Fragment, { key: i },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0', cursor: 'pointer' }, onClick: () => setSheet(sl) },
                React.createElement('span', { style: { width: 24, height: 24, borderRadius: 8, flexShrink: 0, background: sl.access ? 'var(--brass)' : 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-mono)', fontSize: 11, fontWeight: 700 } }, i + 1),
                React.createElement('span', { style: { flex: 1, fontSize: 13, color: 'var(--text-1)', fontWeight: 600 } }, sl.title),
                (sl.lat != null) && React.createElement(Icon, { name: 'pin', style: { width: 13, height: 13, color: 'var(--text-3)' } }),
                React.createElement(Icon, { name: 'cr', style: { width: 14, height: 14, color: 'var(--text-3)' } })),
              (i < stops.length - 1) && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 0 4px 0' } },
                React.createElement('span', { style: { width: 2, height: 16, background: 'var(--rule)', marginLeft: 11, flexShrink: 0 } }),
                lg
                  ? React.createElement('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)', marginLeft: 4 } }, fmtKm(lg.distance_km) + ' km \u00b7 ' + lg.duration_min + ' min')
                  : React.createElement('span', { style: { fontSize: 11, color: 'var(--text-3)', marginLeft: 4, opacity: 0.5 } }, '\u00b7')));
          }))
      )
    );
  }

  function Presupuesto({ s, cur, toast }) {
    const reload = () => BA.tripData(s.id).presupuesto;
    const [b, setB] = useState(reload);
    const [adding, setAdding] = useState(false);
    const [f, setF] = useState({ cat: '', amount: '', currency: cur || 'USD' });
    const colors = ['var(--laurel)', 'var(--brass)', 'var(--laurel-soft)', 'var(--curso)', 'var(--stone)', 'var(--bad)'];
    const toStore = (arr) => arr.map(x => { const o = { category: x.cat || 'Varios', amount: Number(x.amount) || 0, currency: x.currency || 'USD' }; if (x.dayRef) o.dayRef = x.dayRef; if (x.id && !String(x.id).startsWith('tmp')) o.id = x.id; return o; });
    async function persist(items) { const r = await BA.source.tripDataApply(s.id, 'budget', 'set', { items: toStore(items) }); if (r && r.ok) setB(reload()); else toast((r && r.error) || 'No se pudo guardar'); }
    function addLine() { const amt = Number(f.amount); if (!f.cat.trim() || !amt) { toast('Complete categoría y monto'); return; } setAdding(false); const items = (b.items || []).concat([{ id: 'tmp_' + Date.now(), cat: f.cat.trim(), amount: amt, currency: f.currency, dayRef: '' }]); setF({ cat: '', amount: '', currency: cur || 'USD' }); persist(items); }
    function delLine(id) { persist((b.items || []).filter(x => x.id !== id)); }
    return React.createElement('div', null,
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        [['Costo total', M(b.costoTotal, cur)], ['Costo / pax', M(b.costoPax, cur)], ['Ingreso bruto', M(b.ingreso, cur)], ['Margen', b.margen + '%']].map((c, i) =>
          React.createElement('div', { key: i, className: 'card pad', style: { padding: '16px 18px' } },
            React.createElement('div', { className: 'stat-label', style: { marginBottom: 8 } }, c[0]),
            React.createElement('div', { className: 'figure', style: { fontSize: 26, color: i === 3 ? (b.margen >= 60 ? 'var(--go)' : 'var(--bad)') : 'var(--text-1)' } }, c[1]),
            i === 3 && React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 } }, 'objetivo 60–70%')))
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', alignItems: 'start' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Líneas de costo', right: React.createElement('button', { className: 'btn sm', onClick: () => setAdding(a => !a) }, React.createElement(Icon, { name: 'plus' }), 'Agregar') }),
          adding && React.createElement('div', { style: { display: 'flex', gap: 7, margin: '4px 0 12px', flexWrap: 'wrap' } },
            React.createElement('input', { autoFocus: true, value: f.cat, placeholder: 'Categoría', onChange: e => setF(o => ({ ...o, cat: e.target.value })), style: { flex: '2 1 130px', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }),
            React.createElement('input', { type: 'number', value: f.amount, placeholder: 'Monto', onChange: e => setF(o => ({ ...o, amount: e.target.value })), onKeyDown: e => { if (e.key === 'Enter') addLine(); }, style: { flex: '1 1 90px', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }),
            React.createElement('select', { value: f.currency, onChange: e => setF(o => ({ ...o, currency: e.target.value })), style: { padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }, ['USD', 'EUR', 'ARS'].map(c => React.createElement('option', { key: c, value: c }, c))),
            React.createElement('button', { className: 'btn sm primary', onClick: addLine }, 'Guardar')),
          React.createElement('table', { className: 'tbl' },
            React.createElement('thead', null, React.createElement('tr', null, ['Categoría', 'Monto', '%'].map((h, i) => React.createElement('th', { key: i, style: i ? { textAlign: 'right' } : null }, h)))),
            React.createElement('tbody', null, b.lineas.map((l, i) => React.createElement('tr', { key: i },
              React.createElement('td', null, React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8 } }, React.createElement('i', { style: { width: 9, height: 9, borderRadius: 3, background: colors[i], display: 'inline-block' } }), React.createElement('span', { className: 'nm' }, l.cat))),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, M(l.montoUSD, cur)),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right', color: 'var(--text-3)' } }, Math.round(l.pct * 100) + '%'))))
          )
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Distribución' }),
          React.createElement('div', { className: 'donut-wrap' },
            React.createElement('div', { className: 'donut' },
              React.createElement(Donut, { segments: b.lineas.map((l, i) => ({ v: l.montoUSD, color: colors[i] })), size: 116, thick: 16 }),
              React.createElement('div', { className: 'donut-center' },
                React.createElement('div', { className: 'big', style: { fontSize: 20 } }, b.margen + '%'),
                React.createElement('div', { className: 'sm' }, 'margen'))),
            React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 7 } },
              b.lineas.map((l, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5 } },
                React.createElement('i', { style: { width: 8, height: 8, borderRadius: 2, background: colors[i] } }),
                React.createElement('span', { style: { flex: 1, color: 'var(--text-2)' } }, l.cat),
                React.createElement('span', { className: 'mono', style: { color: 'var(--text-3)' } }, Math.round(l.pct * 100) + '%')))))
        )
      ),
      (b.items && b.items.length) ? React.createElement('div', { className: 'card pad', style: { marginTop: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Detalle de líneas', count: b.items.length }),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } },
          b.items.map(it => React.createElement('div', { key: it.id, className: 'row', style: { gap: 10 } },
            React.createElement('span', { className: 'nm', style: { flex: 1 } }, it.cat),
            React.createElement('span', { className: 'mono', style: { color: 'var(--text-3)' } }, it.amount + ' ' + it.currency),
            React.createElement('span', { className: 'mono', style: { width: 90, textAlign: 'right' } }, M(it.montoUSD, cur)),
            React.createElement('button', { className: 'btn sm', onClick: () => delLine(it.id), title: 'Eliminar' }, '×')))))
        : null
    );
  }

  // ============ RESERVAS ============
  function Reservas({ s, cur, toast, openLead }) {
    const { confirmados, pipeline } = BA.tripData(s.id).reservas;
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, padding: '11px 15px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 12.5, color: 'var(--text-2)', border: '1px solid var(--rule)' } },
        React.createElement(Icon, { name: 'funnel', style: { width: 16, height: 16, color: 'var(--accent)' } }), 'Misma data que Ventas, otra lente: el pipeline central filtrado por esta salida.'),
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Reservas confirmadas', count: confirmados.length }),
        React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null, ['Huésped', 'Pax', 'Cuota', 'Pagado', 'Restricciones', 'Movilidad', ''].map((h, i) => React.createElement('th', { key: i }, h)))),
          React.createElement('tbody', null, confirmados.map((c, i) => React.createElement('tr', { key: i },
            React.createElement('td', null, React.createElement('span', { className: 'nm' }, c.nombre)),
            React.createElement('td', { className: 'mono' }, c.pax),
            React.createElement('td', null, React.createElement('span', { className: 'badge ' + (c.pagado === 100 ? 'go' : (c.pagado == null ? 'ghost' : 'risk')), style: { padding: '2px 7px' } }, c.cuota)),
            React.createElement('td', null, c.pagado == null
              ? React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } }, '—')
              : React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                  React.createElement('div', { className: 'bar', style: { width: 60 } }, React.createElement('span', { style: { width: c.pagado + '%', background: c.pagado === 100 ? 'var(--go)' : 'var(--brass)' } })),
                  React.createElement('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)' } }, c.pagado + '%'))),
            React.createElement('td', { style: { color: c.alergias !== '—' ? 'var(--bad)' : 'var(--text-3)' } }, c.alergias),
            React.createElement('td', null, c.movilidad),
            React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('button', { className: 'btn sm', onClick: () => openLead && c.leadId && openLead(c.leadId) }, 'Perfil')))))
        )
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'En pipeline para esta salida', count: pipeline.length }),
        pipeline.length ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
          pipeline.map((l, i) => React.createElement('div', { key: i, className: 'row' },
            React.createElement(Avatar, { id: l.resp, size: 28 }),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, l.nombre),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, l.etapa + ' · ' + l.next)),
            React.createElement('span', { className: 'mono', style: { fontSize: 12, color: 'var(--accent)', fontWeight: 600 } }, 'US$ ' + l.potUSD + 'k'),
            React.createElement('button', { className: 'btn sm primary', onClick: () => openLead && openLead(l.id) }, 'Abrir lead')))
        ) : React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', padding: '6px 0' } }, 'Sin leads en pipeline para esta salida.')
      )
    );
  }

  // ============ TAREAS ============
  const TT = { reserva: 'Reserva', compra: 'Compra', contacto: 'Contacto', research: 'Research', logística: 'Logística', otro: 'Otro' };
  function AppCliente({ s, toast }) {
    const [code, setCode] = useState(() => (BA.tripData(s.id).accessCode || ''));
    const [busy, setBusy] = useState(false);
    const { confirmados } = BA.tripData(s.id).reservas;
    const link = code ? ('https://expedicionmundial.netlify.app/?code=' + code) : '';
    const copy = (txt, msg) => { try { if (navigator.clipboard) navigator.clipboard.writeText(txt); toast(msg); } catch (e) { toast('No se pudo copiar'); } };
    async function regen() { if (busy) return; setBusy(true); const r = await BA.source.setTripAccessCode(s.id); setBusy(false); if (r && r.ok) { setCode(r.code); toast(code ? 'Código regenerado — el anterior queda inválido' : 'Código generado'); } else toast((r && r.error) || 'No se pudo generar'); }
    return React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'start' } },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--gap)' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Acceso del huésped' }),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 12 } },
            React.createElement('div', null, React.createElement('div', { className: 'eyebrow' }, 'Código de reserva'),
              React.createElement('div', { className: 'mono', style: { fontSize: 20, color: code ? 'var(--text-1)' : 'var(--text-3)', marginTop: 4, letterSpacing: '0.12em' } }, code || 'sin código')),
            React.createElement('button', { className: 'btn sm', disabled: !code, onClick: () => copy(code, 'Código copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar')),
          code && React.createElement('div', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)', wordBreak: 'break-all', marginBottom: 12 } }, link),
          React.createElement('div', { style: { display: 'flex', gap: 9 } },
            React.createElement('button', { className: 'btn', style: { flex: 1 }, disabled: !code, onClick: () => copy(link, 'Link copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar link'),
            React.createElement('button', { className: 'btn', style: { flex: 1 }, disabled: busy, onClick: regen }, React.createElement(Icon, { name: 'refresh' }), code ? 'Regenerar' : 'Generar código')),
          React.createElement('button', { className: 'btn primary', style: { width: '100%', marginTop: 9 }, disabled: !code, onClick: () => copy(link, 'Link de invitación copiado — pegalo en tu mensaje al huésped') }, React.createElement(Icon, { name: 'send' }), 'Invitar huésped')
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Perfiles recibidos', count: confirmados.length }),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
            confirmados.map((c, i) => React.createElement('div', { key: i, className: 'row' },
              React.createElement('span', { className: 'av', style: { background: 'var(--laurel)' } }, c.nombre[0]),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, c.nombre),
                React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, 'Restricciones: ' + c.alergias + ' · Movilidad: ' + c.movilidad)),
              React.createElement('span', { className: 'badge ' + (c.alergias !== '—' ? 'risk' : 'go'), style: { padding: '2px 7px' } }, c.alergias !== '—' ? 'Atención' : 'OK'))))
        )
      ),
      // phone preview (capa narrativa)
      React.createElement('div', { className: 'card pad', style: { display: 'grid', placeItems: 'center' } },
        React.createElement('div', { className: 'eyebrow', style: { alignSelf: 'flex-start', marginBottom: 14 } }, 'Vista del cliente'),
        React.createElement('div', { style: { width: 270, borderRadius: 30, border: '8px solid var(--ink)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'var(--laurel-deep)' } },
          React.createElement('div', { style: { height: 150, background: 'linear-gradient(150deg, var(--laurel-soft), var(--laurel-deep))', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16 } },
            React.createElement('div', { style: { fontFamily: 'var(--ff-mono)', fontSize: 8, letterSpacing: '0.16em', color: 'var(--brass-soft)', textTransform: 'uppercase' } }, 'Pasaporte Negro'),
            React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 20, color: 'var(--bone)', lineHeight: 1.1, marginTop: 4 } }, s.titulo)),
          React.createElement('div', { style: { background: 'var(--surface)', padding: 16 } },
            React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', marginBottom: 8 } }, s.fecha),
            ['Llegada · ' + s.region, 'Día 1 · primeros pasos', 'Día 2 · el corazón del viaje'].map((t, i) =>
              React.createElement('div', { key: i, style: { display: 'flex', gap: 9, padding: '8px 0', borderTop: i ? '1px solid var(--rule-soft)' : 'none' } },
                React.createElement('span', { className: 'mono', style: { fontSize: 10, color: 'var(--brass)' } }, '0' + (i + 1)),
                React.createElement('span', { style: { fontSize: 12, color: 'var(--text-1)' } }, t)))
          )
        )
      )
    );
  }

  // ============ CONFIG DEL VIAJE ============
  function Field({ label, value, wide, mono }) {
    return React.createElement('div', { style: { gridColumn: wide ? '1 / -1' : 'auto' } },
      React.createElement('label', { className: 'eyebrow', style: { display: 'block', marginBottom: 6 } }, label),
      React.createElement('input', { defaultValue: value, style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13, fontFamily: mono ? 'var(--ff-mono)' : 'var(--ff-body)' } }));
  }
  function CfgCard({ title, children, cols }) {
    return React.createElement('div', { className: 'card pad' },
      React.createElement(CardHead, { title }),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(' + (cols || 2) + ', 1fr)', gap: 14 } }, children));
  }
  function ConfigViaje({ s, toast }) {
    const t = BA.tripData(s.id);
    const cfg = t.cfg || { baseCurrency: 'USD', fxToUSD: 1, region: '' };
    const huespedes = t.reservas.confirmados;
    const [code, setCode] = useState(t.accessCode || '');
    const [busy, setBusy] = useState(false);
    const link = code ? ('https://expedicionmundial.netlify.app/?code=' + code) : '';
    const copy = (txt, msg) => { try { if (navigator.clipboard) navigator.clipboard.writeText(txt); toast(msg); } catch (e) { toast('No se pudo copiar'); } };
    async function regen() { if (busy) return; setBusy(true); const r = await BA.source.setTripAccessCode(s.id); setBusy(false); if (r && r.ok) { setCode(r.code); toast(code ? 'Código regenerado — el anterior queda inválido' : 'Código generado'); } else toast((r && r.error) || 'No se pudo generar'); }
    return React.createElement('div', { className: 'grid' },
      React.createElement(CfgCard, { title: 'Identidad' },
        React.createElement(Field, { label: 'Título', value: s.titulo, wide: true }),
        React.createElement(Field, { label: 'Etiqueta corta', value: s.etiqueta || '—', mono: true }),
        React.createElement(Field, { label: 'Categoría', value: s.cat || '—' }),
        React.createElement(Field, { label: 'Región', value: s.region || '—' }),
        React.createElement(Field, { label: 'País', value: s.pais || '—' })
      ),
      React.createElement(CfgCard, { title: 'Fechas y grupo' },
        React.createElement(Field, { label: 'Período', value: s.fecha || '—', wide: true, mono: true }),
        React.createElement(Field, { label: 'Noches', value: (t.noches != null) ? String(t.noches) : '—', mono: true }),
        React.createElement(Field, { label: 'Pax total', value: String(s.conf + s.opcion + s.libres), mono: true }),
        React.createElement(Field, { label: 'Mínimo (break-even)', value: String(s.min), mono: true }),
        React.createElement(Field, { label: 'Precio / pax (USD)', value: s.precioUSD ? String(s.precioUSD) : '—', mono: true })
      ),
      React.createElement(CfgCard, { title: 'Basecamp y monedas' },
        React.createElement(Field, { label: 'Basecamp', value: cfg.region || '—', wide: true }),
        React.createElement(Field, { label: 'Moneda base', value: cfg.baseCurrency, mono: true }),
        React.createElement(Field, { label: 'Cambio ' + cfg.baseCurrency + '→USD', value: cfg.baseCurrency === 'USD' ? '1.00 (base)' : String(cfg.fxToUSD), mono: true })
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Acceso del cliente' }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 15px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 12, flexWrap: 'wrap' } },
          React.createElement('div', null, React.createElement('div', { className: 'eyebrow' }, 'Código de acceso'),
            React.createElement('div', { className: 'mono', style: { fontSize: 19, color: code ? 'var(--text-1)' : 'var(--text-3)', marginTop: 3, letterSpacing: '0.12em' } }, code || 'sin código')),
          React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
            React.createElement('button', { className: 'btn sm', disabled: !code, onClick: () => copy(link, 'Link de invitación copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar invitación'),
            React.createElement('button', { className: 'btn sm', disabled: !code, onClick: () => { try { window.open(link, '_blank', 'noopener'); } catch (e) {} } }, React.createElement(Icon, { name: 'eye' }), 'Ver como cliente'),
            React.createElement('button', { className: 'btn sm primary', disabled: busy, onClick: regen }, React.createElement(Icon, { name: 'refresh' }), code ? 'Regenerar' : 'Generar código'))
        )
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'start' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Operadores' }),
          BA.operadores.map((o, i) => React.createElement('div', { key: i, className: 'row' },
            React.createElement(Avatar, { id: o.id, size: 30 }),
            React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, o.name),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)' } }, o.id === s.resp ? 'Responsable' : 'Operador')),
            o.id === s.resp && React.createElement('span', { className: 'badge go' }, 'Responsable')))
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Huéspedes', count: huespedes.length, right: React.createElement('button', { className: 'btn sm', disabled: !code, onClick: () => copy(link, 'Link para el huésped copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar link') }),
          huespedes.length === 0
            ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', padding: '6px 0' } }, 'Sin huéspedes confirmados todavía.')
            : huespedes.map((h, i) => React.createElement('div', { key: i, className: 'row' },
                React.createElement('span', { className: 'av', style: { background: 'var(--laurel)' } }, h.nombre[0]),
                React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, h.nombre),
                  React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)' } }, h.alergias !== '—' ? 'Restricción: ' + h.alergias : 'Sin restricciones')),
                React.createElement('span', { className: 'badge ' + (h.alergias !== '—' ? 'risk' : 'ghost') }, h.pax + ' pax')))
        )
      )
    );
  }
  Object.assign(window, { Itinerario, Ruta, Presupuesto, Reservas, AppCliente, ConfigViaje });
})();
