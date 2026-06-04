// ============ LA EDITORIAL — motor de contenido (E1) ============
// Plan semanal generado desde la semana tipo + ADN (series, estética, kit) + highlights ★.
(function () {
  const { useState, useEffect } = React;

  const DOW = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const CANAL_IC = { instagram: 'play', stories: 'play', tiktok: 'play', blog: 'book', linkedin: 'globe', newsletter: 'mail', whatsapp: 'chat' };
  function estadoBadge(e) {
    if (e === 'publicada' || e === 'programada') return 'go';
    if (e === 'idea') return 'ghost';
    return 'risk'; // guion / assets / edicion
  }
  function fDia(iso) {
    try { return new Date(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' }); } catch (e) { return iso; }
  }
  function fHora(iso) {
    try { return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  function chip(txt, key, style) {
    return React.createElement('span', { key: key, className: 'tag', style: Object.assign({ padding: '2px 8px' }, style || {}) }, txt);
  }
  function hayGuion(g) { g = g || {}; return !!(g.hook_texto || g.slides || g.secciones || g.cuerpo || g.gancho || g.asunto); }
  function gLbl(t, k) { return React.createElement('div', { key: k, className: 'eyebrow', style: { margin: '10px 0 4px' } }, t); }
  function gPre(t, k, bold) { return React.createElement('div', { key: k, style: { fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontWeight: bold ? 700 : 400 } }, t); }
  function renderGuion(g) {
    const out = [];
    if (g.hook_visual) { out.push(gLbl('Hook visual', 'hvl'), gPre(g.hook_visual, 'hv')); }
    if (g.hook_texto) { out.push(gLbl('Texto en pantalla · hook', 'htl'), React.createElement('div', { key: 'ht', style: { fontSize: 14.5, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.4 } }, g.hook_texto)); }
    if (Array.isArray(g.escenas) && g.escenas.length) {
      out.push(gLbl('Escenas', 'esl'), React.createElement('div', { key: 'es', style: { display: 'flex', flexDirection: 'column', gap: 5 } },
        g.escenas.map((e, i) => React.createElement('div', { key: i, style: { fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 } },
          React.createElement('span', { className: 'mono', style: { color: 'var(--text-3)', marginRight: 6 } }, (i + 1) + '.'),
          e.visual + (e.texto_pantalla ? ' — “' + e.texto_pantalla + '”' : '') + (e.dur_seg ? ' · ' + e.dur_seg + 's' : '')))));
    }
    if (Array.isArray(g.slides) && g.slides.length) {
      out.push(gLbl('Slides', 'sll'), React.createElement('div', { key: 'sl', style: { display: 'flex', flexDirection: 'column', gap: 7 } },
        g.slides.map((s, i) => React.createElement('div', { key: i, style: { fontSize: 12.5, lineHeight: 1.5 } },
          React.createElement('span', { className: 'mono', style: { color: 'var(--text-3)', marginRight: 6 } }, (i + 1) + '.'),
          React.createElement('b', { style: { color: 'var(--text-1)' } }, s.titulo || ''),
          s.texto ? React.createElement('span', { style: { color: 'var(--text-2)' } }, ' — ' + s.texto) : null,
          s.visual ? React.createElement('div', { style: { color: 'var(--text-3)', fontStyle: 'italic', marginLeft: 18 } }, s.visual) : null))));
    }
    if (g.secciones) {
      if (g.titulo) out.push(React.createElement('div', { key: 'bt', style: { fontSize: 15.5, fontWeight: 700, color: 'var(--text-1)', margin: '8px 0 4px', fontFamily: 'var(--ff-display)' } }, g.titulo));
      if (g.bajada) out.push(React.createElement('div', { key: 'bb', style: { fontSize: 13, fontStyle: 'italic', color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 6 } }, g.bajada));
      (g.secciones || []).forEach((s, i) => { out.push(gPre(s.h2 || '', 'bh' + i, true), gPre(s.cuerpo || '', 'bc' + i)); });
      if (g.cierre_cta) out.push(gLbl('Cierre', 'bcl'), gPre(g.cierre_cta, 'bcc'));
    } else if (g.asunto) {
      out.push(gLbl('Asunto', 'nal'), gPre(g.asunto, 'na', true));
      if (g.preheader) out.push(React.createElement('div', { key: 'np', style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 } }, g.preheader));
      if (g.cuerpo) out.push(gLbl('Carta', 'ncl'), gPre(g.cuerpo, 'nc'));
    } else if (g.gancho) {
      out.push(gLbl('Gancho', 'lgl'), gPre(g.gancho, 'lg', true));
      if (g.cuerpo) out.push(gPre(g.cuerpo, 'lc'));
    } else if (g.cuerpo) {
      if (g.titulo) out.push(gPre(g.titulo, 'gt', true));
      out.push(gPre(g.cuerpo, 'gc'));
    }
    if (g.caption) { out.push(gLbl('Caption', 'cpl'), gPre(g.caption, 'cp')); }
    const chips = [];
    if (g.cta && typeof g.cta === 'string') chips.push(chip('CTA · ' + g.cta, 'cta', { borderColor: 'var(--brass)', color: 'var(--brass)' }));
    if (g.audio) chips.push(chip('Audio · ' + g.audio, 'au'));
    if (chips.length) out.push(React.createElement('div', { key: 'chips', style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 } }, chips));
    return out;
  }
  function textoCopiable(g) {
    g = g || {};
    if (g.caption) return g.caption;
    if (g.secciones) return [g.titulo, g.bajada, (g.secciones || []).map(s => (s.h2 ? s.h2 + '\n' : '') + (s.cuerpo || '')).join('\n\n'), g.cierre_cta].filter(Boolean).join('\n\n');
    if (g.asunto) return ['Asunto: ' + g.asunto, g.cuerpo, g.cta].filter(Boolean).join('\n\n');
    if (g.gancho) return [g.gancho, g.cuerpo, g.cta].filter(Boolean).join('\n\n');
    return g.cuerpo || '';
  }

  function Editorial({ cur, op, toast, openTrip, nav }) {
    const [tab, setTab] = useState('plan');
    const [st, setSt] = useState({ loading: true, board: null });
    const [busy, setBusy] = useState(false);
    const [openId, setOpenId] = useState(null);
    const [genBusy, setGenBusy] = useState('');

    async function doGuion(p) {
      if (genBusy) return;
      setGenBusy(p.id);
      const r = await BA.source.editorialGuion(p.id);
      setGenBusy('');
      if (r && r.ok) {
        toast('Guion listo' + (r.advertencias && r.advertencias.length ? ' · ' + r.advertencias.length + ' advertencias a revisar' : ''));
        setSt(s => !s.board ? s : ({ ...s, board: { ...s.board, piezas: { ...s.board.piezas, proximas: (s.board.piezas.proximas || []).map(x => x.id === p.id ? { ...x, guion: r.guion, estado: r.estado } : x) } } }));
      } else { toast('No se pudo generar: ' + ((r && r.error) || 'error')); }
    }
    function copiar(g) {
      const t = textoCopiable(g);
      if (!t) { toast('Nada para copiar'); return; }
      navigator.clipboard.writeText(t).then(() => toast('Copiado al portapapeles')).catch(() => toast('No se pudo copiar'));
    }

    const [aSt, setASt] = useState({ loading: false, data: null });
    const [aOpen, setAOpen] = useState(null);
    const [fa, setFa] = useState({ trip: '', slot: '', tipo: 'foto', proc: 'proveedor', url: '', titulo: '', consent: 'no_aplica' });
    function loadAssets() {
      setASt(s => ({ loading: true, data: s.data }));
      BA.source.assetsBoard().then(d => setASt({ loading: false, data: d })).catch(() => setASt({ loading: false, data: null }));
    }
    useEffect(() => { if (tab === 'assets' && !aSt.data && !aSt.loading) loadAssets(); }, [tab]);
    async function addAsset() {
      if (!fa.trip || !fa.url.trim()) { toast('Elegí viaje y pegá una URL'); return; }
      const r = await BA.source.assetAdd({ trip_id: fa.trip, kit_slot: fa.slot || null, tipo: fa.tipo, procedencia: fa.proc, url: fa.url.trim(), titulo: fa.titulo.trim() || null, consentimiento: fa.consent });
      if (r && r.ok) { toast('Material agregado a la biblioteca'); setFa(f => ({ ...f, url: '', titulo: '' })); setAOpen(fa.trip); loadAssets(); }
      else { toast('No se pudo agregar: ' + ((r && r.error) || 'error')); }
    }
    async function delAsset(id) {
      const r = await BA.source.assetDelete(id);
      if (r && r.ok) { toast('Material eliminado'); loadAssets(); }
      else { toast('No se pudo eliminar: ' + ((r && r.error) || 'error')); }
    }

    function load() {
      setSt(s => ({ ...s, loading: true }));
      BA.source.editorialBoard()
        .then(board => setSt({ loading: false, board }))
        .catch(() => setSt({ loading: false, board: null }));
    }
    useEffect(() => { load(); }, []);

    const B = st.board || {};
    const cfg = B.config || {};
    const series = cfg.series || [];
    const semana = cfg.semana_tipo || {};
    const est = cfg.estetica || {};
    const kit = cfg.kit_captura || [];
    const piezas = B.piezas || {};
    const proximas = piezas.proximas || [];
    const highlights = B.highlights || [];
    const ediciones = B.ediciones || [];
    const hlTotal = highlights.reduce((a, h) => a + (h.total || 0), 0);
    function serieNombre(id) { const s = series.find(x => x.id === id); return s ? s.nombre : (id || ''); }

    async function generarSemana() {
      if (busy) return;
      setBusy(true);
      const r = await BA.source.planGenerateWeek();
      setBusy(false);
      if (r && r.ok) { toast('Semana del ' + r.semana + ' generada · ' + r.creadas + ' piezas'); load(); }
      else if (r && r.motivo === 'ya_generada') { toast('La semana del ' + r.semana + ' ya está generada (' + r.existentes + ' piezas)'); }
      else { toast('No se pudo generar: ' + ((r && r.error) || 'error')); }
    }

    const TABS = [['plan', 'Plan', 'calendar'], ['adn', 'Semana tipo', 'layers'], ['assets', 'Assets', 'grid'], ['highlights', 'Highlights', 'star']];
    const tabbar = React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--gap)' } },
      TABS.map(t => React.createElement('button', { key: t[0], className: 'btn sm' + (tab === t[0] ? ' primary' : ''), onClick: () => setTab(t[0]) },
        React.createElement(Icon, { name: t[2] }), t[1])));

    let bodyInner;
    if (st.loading) {
      bodyInner = React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Cargando La Editorial…');
    } else if (!st.board) {
      bodyInner = React.createElement('div', { className: 'card pad' }, 'No se pudo cargar el tablero editorial.');
    } else if (tab === 'plan') {
      // agrupar próximas piezas por día
      const grupos = [];
      proximas.forEach(p => {
        const key = (p.publicar_el || '').slice(0, 10);
        let g = grupos.find(x => x.key === key);
        if (!g) { g = { key, label: fDia(p.publicar_el), items: [] }; grupos.push(g); }
        g.items.push(p);
      });
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
          React.createElement(StatCard, { icon: 'layers', iconCls: '', label: 'Piezas en el plan', value: piezas.total || 0, sub: 'todas las semanas' }),
          React.createElement(StatCard, { icon: 'calendar', iconCls: 'tint', label: 'Próximos 14 días', value: proximas.length, sub: 'piezas programables' }),
          React.createElement(StatCard, { icon: 'star', iconCls: 'tint-brass', label: 'Highlights ★', value: hlTotal, sub: 'materia prima marcada' }),
          React.createElement(StatCard, { icon: 'flag', iconCls: ediciones.length ? 'tint' : 'tint-bad', label: 'Ediciones activas', value: ediciones.length, sub: ediciones.length ? 'campañas en curso' : 'línea de marca' })),
        !ediciones.length && React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)', borderLeft: '3px solid var(--brass)' } },
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 } },
            React.createElement('b', null, 'Sin ediciones activas.'), ' El plan corre en línea de marca: construir audiencia y lista. Una edición arranca solo con la ventana completa de 6–8 meses por delante (catálogo 2027).')),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Plan semanal', right: React.createElement('button', { className: 'btn sm primary', onClick: generarSemana, disabled: busy },
            React.createElement(Icon, { name: 'plus' }), busy ? 'Generando…' : 'Generar semana') }),
          grupos.length === 0
            ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', padding: '6px 0' } }, 'Sin piezas en los próximos días. Generá la próxima semana desde la semana tipo.')
            : grupos.map(g => React.createElement('div', { key: g.key, style: { marginBottom: 14 } },
              React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6, textTransform: 'capitalize' } }, g.label),
              g.items.map(p => {
                const open = openId === p.id;
                const tiene = hayGuion(p.guion);
                return React.createElement('div', { key: p.id, style: { marginBottom: 6 } },
                  React.createElement('div', { onClick: () => setOpenId(open ? null : p.id), style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: open ? 'var(--radius-sm) var(--radius-sm) 0 0' : 'var(--radius-sm)', cursor: 'pointer' } },
                    React.createElement('span', { style: { flexShrink: 0, color: 'var(--text-3)', display: 'flex' } }, React.createElement(Icon, { name: CANAL_IC[p.canal] || 'send' })),
                    React.createElement('div', { style: { minWidth: 0, flex: 1 } },
                      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, p.titulo),
                      React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 3 } },
                        chip(p.canal, 'c'), chip(p.formato, 'f'), p.serie ? chip(serieNombre(p.serie), 's') : null)),
                    React.createElement('div', { style: { textAlign: 'right', flexShrink: 0 } },
                      React.createElement('div', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)' } }, fHora(p.publicar_el)),
                      React.createElement('span', { className: 'badge ' + estadoBadge(p.estado), style: { marginTop: 3, display: 'inline-block' } }, p.estado))),
                  open && React.createElement('div', { style: { padding: '12px 14px', border: '1px solid var(--line)', borderTop: 'none', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)' } },
                    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                      React.createElement('button', { className: 'btn sm' + (tiene ? '' : ' primary'), disabled: genBusy === p.id, onClick: () => doGuion(p) },
                        React.createElement(Icon, { name: tiene ? 'refresh' : 'spark' }), genBusy === p.id ? 'Escribiendo…' : (tiene ? 'Regenerar' : 'Generar guion')),
                      tiene && React.createElement('button', { className: 'btn sm', onClick: () => copiar(p.guion) }, React.createElement(Icon, { name: 'copy' }), 'Copiar'),
                      (p.guion && p.guion.advertencias || []).map((a, i) => chip('✕ ' + a, 'adv' + i, { borderColor: '#C0563A', color: '#C0563A' }))),
                    tiene
                      ? React.createElement('div', null, renderGuion(p.guion))
                      : React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 9, lineHeight: 1.5 } }, 'Sin guion todavía. La fábrica lo escribe con el destino, la serie, los ★ y la voz B&A — validado contra los prohibidos.')));
              })))) 
      );
    } else if (tab === 'adn') {
      const slots = (semana.slots || []).slice().sort((a, b) => (a.dow - b.dow));
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
          React.createElement(CardHead, { title: 'Tesis estética' }),
          React.createElement('div', { style: { fontSize: 13.5, color: 'var(--text-1)', lineHeight: 1.6, marginBottom: 12, fontStyle: 'italic' } }, est.tesis || '—'),
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 5 } }, 'Permitido'),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 } },
            (est.permitido || []).map((x, i) => chip(x, 'p' + i, { borderColor: '#4A6A4B', color: '#4A6A4B' }))),
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 5 } }, 'Prohibido · garantizado por el sistema'),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } },
            (est.prohibido || []).map((x, i) => chip('✕ ' + x, 'x' + i, { borderColor: '#C0563A', color: '#C0563A' })))),
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
          React.createElement(CardHead, { title: 'El molde semanal', right: React.createElement('span', { className: 'eyebrow' }, 'semana tipo') }),
          slots.map((s, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < slots.length - 1 ? '1px solid var(--line)' : 'none' } },
            React.createElement('span', { style: { width: 86, fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)' } }, DOW[s.dow] || ''),
            React.createElement('span', { style: { flexShrink: 0, color: 'var(--text-3)', display: 'flex' } }, React.createElement(Icon, { name: CANAL_IC[s.canal] || 'send' })),
            React.createElement('span', { style: { flex: 1, fontSize: 13, color: 'var(--text-1)' } }, s.serie ? serieNombre(s.serie) : ({ blog: 'Blog semanal (pieza madre escrita)', linkedin: 'LinkedIn · derivado del blog', newsletter: 'Carta semanal · Cuaderno B&A' }[s.canal] || s.canal)),
            chip(s.canal, 'c'), chip(s.formato, 'f'))),
          React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 10, lineHeight: 1.5 } },
            'Rotación: ' + ((semana.rotacion || []).map(serieNombre).join(' · ') || '—') + ' según material y destino. Comunidad: ' + (semana.comunidad || '—') + '.')),
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
          React.createElement(CardHead, { title: 'Series', count: series.length, right: React.createElement('span', { className: 'eyebrow' }, 'hipótesis · se matan o duplican con datos') }),
          React.createElement('div', { className: 'grid', style: { gridTemplateColumns: '1fr 1fr' } },
            series.map(s => React.createElement('div', { key: s.id, style: { padding: '11px 13px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 } },
                React.createElement('span', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)' } }, s.nombre),
                chip(s.formato, 'f')),
              React.createElement('div', { style: { fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 } }, s.descripcion))))),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Kit de captura universal', count: kit.length, right: React.createElement('span', { className: 'eyebrow' }, 'cobertura por destino → E3') }),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } },
            kit.map((k, i) => chip(k, 'k' + i)))));
    } else if (tab === 'assets') {
      const A = aSt.data || {};
      const kitArr = A.kit || [];
      const viajes = A.viajes || [];
      const inSt = { width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 };
      function fld(label, el) {
        return React.createElement('div', { style: { flex: '1 1 170px', minWidth: 150 } },
          React.createElement('label', { className: 'eyebrow', style: { display: 'block', marginBottom: 5 } }, label), el);
      }
      function barColor(pct) { return pct >= 0.7 ? '#4A6A4B' : pct >= 0.35 ? '#B07D3A' : '#9A938A'; }
      if (aSt.loading && !aSt.data) {
        bodyInner = React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Cargando biblioteca…');
      } else if (!aSt.data) {
        bodyInner = React.createElement('div', { className: 'card pad' }, 'No se pudo cargar la biblioteca de assets.');
      } else {
        bodyInner = React.createElement(React.Fragment, null,
          React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
            React.createElement(CardHead, { title: 'Agregar material', right: React.createElement('span', { className: 'eyebrow' }, 'real: propio · proveedor · stock') }),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' } },
              fld('Viaje', React.createElement('select', { value: fa.trip, onChange: e => setFa(f => ({ ...f, trip: e.target.value })), style: inSt },
                React.createElement('option', { value: '' }, '— elegir —'),
                viajes.map(v => React.createElement('option', { key: v.trip_id, value: v.trip_id }, v.viaje || v.trip_id)))),
              fld('Toma del kit', React.createElement('select', { value: fa.slot, onChange: e => setFa(f => ({ ...f, slot: e.target.value })), style: inSt },
                React.createElement('option', { value: '' }, '— sin asignar —'),
                kitArr.map((k, i) => React.createElement('option', { key: i, value: k }, k)))),
              fld('Tipo', React.createElement('select', { value: fa.tipo, onChange: e => setFa(f => ({ ...f, tipo: e.target.value })), style: inSt },
                ['foto', 'clip'].map(t => React.createElement('option', { key: t, value: t }, t)))),
              fld('Procedencia', React.createElement('select', { value: fa.proc, onChange: e => setFa(f => ({ ...f, proc: e.target.value })), style: inSt },
                ['propio', 'proveedor', 'pexels', 'wikimedia', 'otro'].map(t => React.createElement('option', { key: t, value: t }, t)))),
              fld('Consentimiento', React.createElement('select', { value: fa.consent, onChange: e => setFa(f => ({ ...f, consent: e.target.value })), style: inSt },
                ['no_aplica', 'pendiente', 'obtenido'].map(t => React.createElement('option', { key: t, value: t }, t))))),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end', marginTop: 10 } },
              fld('URL del material', React.createElement('input', { value: fa.url, placeholder: 'https://… (Drive, CDN del proveedor, stock)', onChange: e => setFa(f => ({ ...f, url: e.target.value })), style: inSt })),
              fld('Título (opcional)', React.createElement('input', { value: fa.titulo, placeholder: 'Macro de trufa blanca…', onChange: e => setFa(f => ({ ...f, titulo: e.target.value })), style: inSt })),
              React.createElement('button', { className: 'btn sm primary', style: { flexShrink: 0 }, onClick: addAsset }, React.createElement(Icon, { name: 'plus' }), 'Agregar'))),
          viajes.map(v => {
            const pct = kitArr.length ? (v.cubiertos / kitArr.length) : 0;
            const open = aOpen === v.trip_id;
            return React.createElement('div', { key: v.trip_id, className: 'card pad', style: { marginBottom: 10 } },
              React.createElement('div', { onClick: () => setAOpen(open ? null : v.trip_id), style: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' } },
                React.createElement('div', { style: { minWidth: 0, flex: '0 1 240px' } },
                  React.createElement('div', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, v.viaje || v.trip_id),
                  React.createElement('div', { className: 'sub', style: { marginTop: 2 } }, v.total + (v.total === 1 ? ' material' : ' materiales'))),
                React.createElement('div', { style: { flex: 1, height: 22, borderRadius: 7, background: 'var(--surface-2)', overflow: 'hidden' } },
                  React.createElement('div', { style: { width: Math.max(pct * 100, 2) + '%', height: '100%', background: barColor(pct), borderRadius: 7 } })),
                React.createElement('span', { className: 'mono', style: { fontSize: 11.5, color: 'var(--text-2)', flexShrink: 0 } }, 'kit ' + v.cubiertos + '/' + kitArr.length)),
              open && React.createElement('div', { style: { marginTop: 12 } },
                (v.faltantes || []).length > 0 && React.createElement(React.Fragment, null,
                  React.createElement('div', { className: 'eyebrow', style: { marginBottom: 5 } }, 'Shotlist · faltan ' + v.faltantes.length),
                  React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 } },
                    v.faltantes.map((k, i) => chip(k, 'fk' + i, { borderColor: '#B07D3A', color: '#B07D3A' })))),
                (v.assets || []).length === 0
                  ? React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'Sin material cargado para este destino.')
                  : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
                    v.assets.map(a => React.createElement('div', { key: a.id, style: { display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' } },
                      React.createElement('span', { style: { flexShrink: 0, color: 'var(--text-3)', display: 'flex' } }, React.createElement(Icon, { name: a.tipo === 'clip' ? 'play' : 'eye' })),
                      React.createElement('div', { style: { minWidth: 0, flex: 1 } },
                        React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, a.titulo || a.url),
                        React.createElement('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 3 } },
                          a.kit_slot ? chip(a.kit_slot, 'ks') : null, chip(a.procedencia, 'pr'),
                          a.consentimiento === 'pendiente' ? chip('consentimiento pendiente', 'cp', { borderColor: '#C0563A', color: '#C0563A' }) : null)),
                      React.createElement('a', { href: a.url, target: '_blank', rel: 'noopener', className: 'btn sm', style: { flexShrink: 0, textDecoration: 'none' } }, 'Abrir'),
                      React.createElement('button', { className: 'btn sm', style: { flexShrink: 0 }, onClick: () => delAsset(a.id) }, React.createElement(Icon, { name: 'x' })))))));
          }));
      }
    } else {
      // highlights
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)', borderLeft: '3px solid var(--brass)' } },
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 } },
            'Los ★ marcados en el itinerario de cada viaje son la materia prima de las piezas. Marcá los momentos con potencial de contenido y la fábrica los convierte en guiones (E2).')),
        highlights.length === 0
          ? React.createElement('div', { className: 'card pad' }, 'Sin highlights todavía. Abrí un viaje → Itinerario → marcá ★.')
          : highlights.map(h => React.createElement('div', { key: h.trip_id, className: 'card pad', style: { marginBottom: 10 } },
            React.createElement(CardHead, { title: h.viaje, count: h.total, right: openTrip && React.createElement('button', { className: 'btn sm', onClick: () => openTrip(h.trip_id) }, React.createElement(Icon, { name: 'route' }), 'Itinerario') }),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
              (h.items || []).map(it => React.createElement('div', { key: it.id, style: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5 } },
                React.createElement('span', { style: { color: 'var(--brass)', flexShrink: 0 } }, '★'),
                React.createElement('span', { className: 'mono', style: { color: 'var(--text-3)', flexShrink: 0, fontSize: 11 } }, 'Día ' + it.dia),
                React.createElement('span', { style: { color: 'var(--text-1)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, it.titulo),
                it.jerarquia ? chip(it.jerarquia, 'j') : null))))));
    }

    return React.createElement('div', null, tabbar, bodyInner);
  }

  window.Editorial = Editorial;
})();
