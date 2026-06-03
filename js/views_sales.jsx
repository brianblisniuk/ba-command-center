/* B&A · dominios: Ventas · Marketing · Clientes · Biblioteca · Config → window */
(function () {
  const { Icon, Donut, StatCard, Badge, Avatar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  function k(v, cur) { return BA.sym[cur] + ' ' + Math.round(v * (BA.fx[cur] / BA.fx.USD)) + 'k'; }
  function stub(title, sub, icon) {
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, title)),
        React.createElement('div', { className: 'page-greet-sub' }, sub))),
      React.createElement('div', { className: 'card' }, React.createElement('div', { className: 'stub' },
        React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: icon })),
        React.createElement('h3', null, title),
        React.createElement('p', null, sub + ' — vista incluida en el shell; la diseñamos en detalle en la próxima iteración.')))
    );
  }

  // ============ VENTAS ============
  function Ventas({ cur, toast, openTrip, openLead }) {
    const [drag, setDrag] = useState(null);
    const [, force] = useState(0);
    const STAGES = BA.STAGES;
    const fn = STAGES.map(st => { const ls = BA.leads.filter(l => l.stageKey === st.key); return { key: st.key, etapa: st.label, color: st.color, n: ls.length, valUSD: Math.round(ls.reduce((a, l) => a + (l.potUSD || 0), 0)) }; });
    const maxN = Math.max(1, ...fn.map(f => f.n));
    const totalPot = BA.leads.reduce((s, l) => s + (l.potUSD || 0), 0);
    const enfriando = BA.leads.filter(l => l.dias > 10 && l.stageKey !== 'booked' && l.stageKey !== 'lost').length;
    function onDrop(stageKey) {
      const id = drag; setDrag(null);
      if (!id) return;
      const l = BA.leads.find(x => x.id === id);
      if (!l || l.stageKey === stageKey) return;
      const prevK = l.stageKey, prevL = l.etapa, st = STAGES.find(s => s.key === stageKey);
      l.stageKey = stageKey; l.etapa = st ? st.label : l.etapa; force(x => x + 1);
      Promise.resolve(BA.source.leadChangeStage(id, stageKey)).then(r => {
        if (r && r.error) { l.stageKey = prevK; l.etapa = prevL; force(x => x + 1); toast('No se pudo mover: ' + r.error); }
        else { toast(l.nombre + ' → ' + (st ? st.label : stageKey)); }
      });
    }
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Ventas')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Pipeline completo · todas las salidas · una sola data, varias lentes'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'funnel', iconCls: '', label: 'Leads activos', value: BA.leads.length, sub: 'en pipeline', delta: 8 }),
        React.createElement(StatCard, { icon: 'coin', iconCls: 'tint', label: 'Potencial', value: k(totalPot, cur), sub: 'valor del pipeline' }),
        React.createElement(StatCard, { icon: 'target', iconCls: 'tint-brass', label: 'Conversión', value: '26%', sub: 'lead → reserva', delta: 3 }),
        React.createElement(StatCard, { icon: 'snow', iconCls: 'tint-bad', label: 'Enfriándose', value: enfriando, sub: '+10 días sin tocar' })
      ),
      // funnel
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Embudo', right: React.createElement('span', { className: 'eyebrow' }, 'n · valor US$k') }),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 9 } },
          fn.map((f, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 14 } },
            React.createElement('span', { style: { width: 100, fontSize: 12.5, color: 'var(--text-2)', fontWeight: 600 } }, f.etapa),
            React.createElement('div', { style: { flex: 1, height: 30, borderRadius: 8, background: 'var(--surface-2)', overflow: 'hidden' } },
              React.createElement('div', { style: { width: (f.n / maxN * 100) + '%', height: '100%', background: f.color, borderRadius: 8, display: 'flex', alignItems: 'center', paddingLeft: 12 } },
                React.createElement('span', { className: 'mono', style: { color: '#fff', fontSize: 11, fontWeight: 700 } }, f.n))),
            React.createElement('span', { className: 'mono', style: { width: 56, textAlign: 'right', fontSize: 12, color: 'var(--text-3)' } }, 'US$ ' + f.valUSD + 'k')
          )))
      ),
      // kanban (drag-and-drop real → lead_change_stage)
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Pipeline', right: React.createElement('span', { className: 'eyebrow' }, 'arrastrá entre etapas') }),
        React.createElement('div', { className: 'kanban' },
          fn.map(col => {
            const cards = BA.leads.filter(l => l.stageKey === col.key);
            return React.createElement('div', { key: col.key, className: 'kcol',
                onDragOver: e => { e.preventDefault(); }, onDrop: e => { e.preventDefault(); onDrop(col.key); } },
              React.createElement('div', { className: 'kcol-head' },
                React.createElement('span', { className: 'nm' }, React.createElement('i', { style: { background: col.color } }), col.etapa),
                React.createElement('span', { className: 'ct' }, cards.length)),
              cards.map(l => { const s = BA.salidaById(l.salida);
                return React.createElement('div', { key: l.id, className: 'kcard', draggable: true,
                    onDragStart: () => setDrag(l.id), onDragEnd: () => setDrag(null),
                    onClick: () => openLead ? openLead(l.id) : toast('Lead · ' + l.nombre) },
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 8 } },
                    React.createElement('span', { className: 'nm' }, l.nombre),
                    React.createElement(Avatar, { id: l.resp, size: 22 })),
                  React.createElement('div', { className: 'sub' }, (s ? s.region : (l.salida ? l.salida : 'Sin viaje')) + ' · ', React.createElement('span', { style: { color: l.dias > 10 ? 'var(--bad)' : 'var(--text-3)' } }, l.dias + 'd')),
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 } },
                    React.createElement('span', { className: 'pot' }, 'US$ ' + l.potUSD + 'k'),
                    React.createElement('span', { className: 'tag', style: { padding: '2px 7px' } }, l.pax + ' pax')));
              }));
          }))
      )
    );
  }

  // ============ MARKETING ============
  function Marketing({ cur, op, toast, openLead, openTrip, nav }) {
    const [tab, setTab] = useState('calidad');
    const [st, setSt] = useState({ loading: true, quality: null, board: null, content: null });
    const [busy, setBusy] = useState('');
    const firstTrip = (BA.salidas[0] && BA.salidas[0].id) || '';
    const [genTrip, setGenTrip] = useState(firstTrip);
    const [genChannel, setGenChannel] = useState('instagram');
    const [genN, setGenN] = useState(3);
    const [q, setQ] = useState('');
    const [ans, setAns] = useState(null);
    const [thinking, setThinking] = useState(false);

    function load() {
      setSt(s => ({ ...s, loading: true }));
      Promise.all([BA.source.leadQuality(), BA.source.marketingBoard(), BA.source.marketingContentBoard()])
        .then(([quality, board, content]) => setSt({ loading: false, quality, board, content }))
        .catch(() => setSt(s => ({ ...s, loading: false })));
    }
    React.useEffect(() => { load(); }, []);

    function tierColor(t) { return t === 'caliente' ? '#4A6A4B' : t === 'tibio' ? '#B07D3A' : '#9A938A'; }
    function tierBadge(t) { return t === 'caliente' ? 'go' : t === 'tibio' ? 'risk' : 'ghost'; }
    function chip(txt) { return React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, txt); }
    function num(v) { return (typeof v === 'number') ? v.toLocaleString('es-AR') : '—'; }
    function bullets(label, arr, color) {
      if (!arr || !arr.length) return null;
      return React.createElement('div', { style: { flex: '1 1 230px', minWidth: 200 } },
        React.createElement('div', { className: 'eyebrow', style: { marginBottom: 4 } }, label),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          arr.map((s, i) => React.createElement('div', { key: i, style: { display: 'flex', gap: 7, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 } },
            React.createElement('span', { style: { color: color, flexShrink: 0, marginTop: 1 } }, '\u2022'),
            React.createElement('span', null, s)))));
    }

    async function doGenerate() {
      if (busy || !genTrip) return;
      setBusy('gen');
      const r = await BA.source.generateContent(genTrip, genChannel, genN);
      setBusy('');
      if (r && r.ok) { toast((r.guardadas || 0) + ' piezas generadas para ' + (r.trip || 'el viaje')); load(); }
      else { toast('No se pudo generar: ' + ((r && r.error) || 'error')); }
    }
    async function doRescore(id) {
      if (busy) return;
      setBusy('rs-' + id);
      const r = await BA.source.rescoreLeads(id);
      setBusy('');
      if (r && r.ok) { toast('Lead re-scoreado'); load(); }
      else { toast('No se pudo re-scorear: ' + ((r && r.error) || 'error')); }
    }
    async function ask(question) {
      const Q = (question || q).trim();
      if (!Q || thinking) return;
      setQ(Q); setThinking(true); setAns(null);
      const r = await BA.source.copiloto(Q, []);
      setThinking(false);
      setAns(r || { ok: false, respuesta: 'Sin respuesta.', acciones: [] });
    }
    function runAccion(a) {
      if (!a) return;
      if (a.tipo === 'navegar' && a.ref && nav) nav(a.ref);
      else if (a.tipo === 'lead' && a.ref && openLead) openLead(a.ref);
      else if (a.tipo === 'viaje' && a.ref && openTrip) openTrip(a.ref);
      else toast(a.label || 'Acción');
    }

    const TABS = [['calidad', 'Calidad de leads', 'spark'], ['adquisicion', 'Adquisición', 'megaphone'], ['contenido', 'Contenido', 'book'], ['copiloto', 'Copiloto', 'chat']];
    const tabbar = React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--gap)' } },
      TABS.map(t => React.createElement('button', { key: t[0], className: 'btn sm' + (tab === t[0] ? ' primary' : ''), onClick: () => setTab(t[0]) },
        React.createElement(Icon, { name: t[2] }), t[1])));

    let bodyInner;
    if (st.loading) {
      bodyInner = React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Cargando inteligencia de marketing…');
    } else if (tab === 'calidad') {
      const Qd = st.quality;
      if (!Qd || !Qd.resumen) bodyInner = React.createElement('div', { className: 'card pad' }, 'Sin datos de calidad de leads todavía.');
      else {
        const r = Qd.resumen;
        bodyInner = React.createElement(React.Fragment, null,
          React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
            React.createElement(StatCard, { icon: 'target', iconCls: '', label: 'Leads scoreados', value: r.scoreados + '/' + r.total, sub: 'analizados por IA' }),
            React.createElement(StatCard, { icon: 'trending', iconCls: 'tint', label: 'Score promedio', value: r.score_promedio, unit: '/100', sub: 'calidad del pipeline' }),
            React.createElement(StatCard, { icon: 'spark', iconCls: 'tint-brass', label: 'Calientes', value: r.calientes, sub: r.tibios + ' tibios' }),
            React.createElement(StatCard, { icon: 'snow', iconCls: 'tint-bad', label: 'Fríos', value: r.frios, sub: 'a reactivar o descartar' })),
          React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
            React.createElement(CardHead, { title: 'Calidad por fuente', right: React.createElement('span', { className: 'eyebrow' }, 'score promedio /100') }),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
              (Qd.por_fuente || []).map((f, i) => {
                const col = f.score_promedio >= 65 ? '#4A6A4B' : f.score_promedio >= 50 ? '#B07D3A' : '#9A938A';
                return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12 } },
                  React.createElement('span', { style: { width: 96, fontSize: 12.5, color: 'var(--text-2)', fontWeight: 600 } }, f.fuente),
                  React.createElement('span', { className: 'mono', style: { width: 56, fontSize: 11, color: 'var(--text-3)' } }, f.leads + (f.leads === 1 ? ' lead' : ' leads')),
                  React.createElement('div', { style: { flex: 1, height: 24, borderRadius: 7, background: 'var(--surface-2)', overflow: 'hidden' } },
                    React.createElement('div', { style: { width: f.score_promedio + '%', height: '100%', background: col, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 } },
                      React.createElement('span', { className: 'mono', style: { color: '#fff', fontSize: 11, fontWeight: 700 } }, f.score_promedio))));
              }))),
          (Qd.leads || []).map(l => React.createElement('div', { key: l.lead_id, className: 'card pad', style: { marginBottom: 10 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 } },
              React.createElement('div', { style: { minWidth: 0 } },
                React.createElement('div', { className: 'nm', style: { fontSize: 14.5 } }, l.nombre),
                React.createElement('div', { className: 'sub', style: { marginTop: 3 } }, l.trip_fit || 'Sin viaje asignado')),
              React.createElement('div', { style: { textAlign: 'right', flexShrink: 0 } },
                React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 28, lineHeight: 1, color: tierColor(l.tier) } }, l.score),
                React.createElement('span', { className: 'badge ' + tierBadge(l.tier), style: { marginTop: 4, display: 'inline-block' } }, l.tier))),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' } },
              chip(l.etapa), chip(l.fuente + (l.campania ? ' · ' + l.campania : '')), chip(l.personas + ' pax'), chip('US$ ' + num(l.presupuesto_pp) + ' pp')),
            l.reasons && React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 10 } }, l.reasons),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 4 } },
              bullets('Señales', l.intent_signals, '#4A6A4B'),
              bullets('Riesgos', l.risk_flags, '#C0563A')),
            l.suggested_next && React.createElement('div', { style: { marginTop: 12, padding: '11px 13px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--brass)' } },
              React.createElement('div', { className: 'eyebrow', style: { marginBottom: 5 } }, 'Próximo paso sugerido'),
              React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.5 } }, l.suggested_next)),
            React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 12 } },
              openLead && React.createElement('button', { className: 'btn sm', onClick: () => openLead(l.lead_id) }, React.createElement(Icon, { name: 'eye' }), 'Ver lead'),
              React.createElement('button', { className: 'btn sm', onClick: () => doRescore(l.lead_id), disabled: busy === 'rs-' + l.lead_id }, React.createElement(Icon, { name: 'refresh' }), busy === 'rs-' + l.lead_id ? 'Scoreando…' : 'Re-score')))));
      }
    } else if (tab === 'adquisicion') {
      const B = st.board;
      if (!B || !B.meta) bodyInner = React.createElement('div', { className: 'card pad' }, 'Sin datos de adquisición.');
      else {
        const meta = B.meta, tot = B.totales || {};
        const conectado = meta.status === 'conectado';
        bodyInner = React.createElement(React.Fragment, null,
          !conectado && React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)', borderLeft: '3px solid var(--brass)' } },
            React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'flex-start' } },
              React.createElement('div', { className: 'stat-ic tint-brass', style: { flexShrink: 0 } }, React.createElement(Icon, { name: 'megaphone' })),
              React.createElement('div', null,
                React.createElement('div', { className: 'nm', style: { fontSize: 15, marginBottom: 4 } }, 'Meta Ads · sin conectar'),
                React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 } },
                  'El presupuesto ya está fijado en ', React.createElement('b', null, 'US$ ' + num(meta.presupuesto_mensual_usd) + '/mes'), '. Cuando conectes la cuenta, este tablero sincroniza gasto, leads y CPL por campaña, y se activa el loop que manda el presupuesto a los leads que reservan (CAPI).'),
                React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.5 } },
                  'Para activar: ', React.createElement('span', { className: 'mono' }, 'ad_account_id'), ' + permisos ', React.createElement('span', { className: 'mono' }, 'ads_read · ads_management · leads_retrieval'), '.')))),
          React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
            React.createElement(StatCard, { icon: 'wallet', iconCls: '', label: 'Presupuesto', value: 'US$ ' + num(meta.presupuesto_mensual_usd), sub: 'por mes (fijado)' }),
            React.createElement(StatCard, { icon: 'coin', iconCls: 'tint', label: 'Gasto', value: 'US$ ' + num(tot.gasto || 0), sub: conectado ? 'este mes' : 'sin conectar' }),
            React.createElement(StatCard, { icon: 'funnel', iconCls: 'tint-brass', label: 'Leads', value: tot.leads || 0, sub: 'desde anuncios' }),
            React.createElement(StatCard, { icon: 'target', iconCls: 'tint-bad', label: 'CPL', value: tot.cpl != null ? ('US$ ' + num(tot.cpl)) : '—', sub: 'costo por lead' })),
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Campañas', count: (B.campanias || []).length }),
            (B.campanias && B.campanias.length)
              ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)' } }, B.campanias.length + ' campañas activas')
              : React.createElement('div', { className: 'sub', style: { padding: '6px 0' } }, 'Sin campañas activas todavía.')));
      }
    } else if (tab === 'contenido') {
      const C = st.content;
      const res = (C && C.resumen) || { total: 0, ideas: 0, programadas: 0, publicadas: 0 };
      const piezas = (C && C.piezas) || [];
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
          React.createElement(StatCard, { icon: 'book', iconCls: '', label: 'Piezas', value: res.total, sub: 'en biblioteca' }),
          React.createElement(StatCard, { icon: 'spark', iconCls: 'tint', label: 'Ideas', value: res.ideas, sub: 'sin programar' }),
          React.createElement(StatCard, { icon: 'calendar', iconCls: 'tint-brass', label: 'Programadas', value: res.programadas, sub: 'en cola' }),
          React.createElement(StatCard, { icon: 'check', iconCls: 'tint', label: 'Publicadas', value: res.publicadas, sub: 'ya salieron' })),
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
          React.createElement(CardHead, { title: 'Generar contenido', right: React.createElement('span', { className: 'eyebrow', style: { color: 'var(--brass)' } }, 'IA · anclado en accesos reales') }),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' } },
            React.createElement('div', { style: { flex: '1 1 220px' } },
              React.createElement('label', { className: 'eyebrow', style: { display: 'block', marginBottom: 5 } }, 'Viaje'),
              React.createElement('select', { value: genTrip, onChange: e => setGenTrip(e.target.value), style: { width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } },
                BA.salidas.map(s => React.createElement('option', { key: s.id, value: s.id }, s.titulo || s.region || s.id)))),
            React.createElement('div', { style: { flex: '0 1 160px' } },
              React.createElement('label', { className: 'eyebrow', style: { display: 'block', marginBottom: 5 } }, 'Canal'),
              React.createElement('select', { value: genChannel, onChange: e => setGenChannel(e.target.value), style: { width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } },
                [['instagram', 'Instagram'], ['newsletter', 'Newsletter'], ['blog', 'Blog']].map(c => React.createElement('option', { key: c[0], value: c[0] }, c[1])))),
            React.createElement('div', { style: { flex: '0 1 90px' } },
              React.createElement('label', { className: 'eyebrow', style: { display: 'block', marginBottom: 5 } }, 'Piezas'),
              React.createElement('select', { value: genN, onChange: e => setGenN(+e.target.value), style: { width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } },
                [2, 3, 4, 5].map(nn => React.createElement('option', { key: nn, value: nn }, nn)))),
            React.createElement('button', { className: 'btn primary', onClick: doGenerate, disabled: busy === 'gen' || !genTrip },
              React.createElement(Icon, { name: busy === 'gen' ? 'refresh' : 'spark' }), busy === 'gen' ? 'Generando…' : 'Generar'))),
        piezas.length
          ? piezas.map(p => React.createElement('div', { key: p.id, className: 'card pad', style: { marginBottom: 10 } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 } },
                React.createElement('div', { className: 'nm', style: { fontSize: 14.5 } }, p.titulo || '(sin título)'),
                React.createElement('div', { style: { display: 'flex', gap: 5, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' } },
                  React.createElement('span', { className: 'badge info' }, p.canal),
                  p.formato && React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, p.formato),
                  React.createElement('span', { className: 'badge ' + (p.estado === 'publicada' ? 'go' : p.estado === 'programada' ? 'curso' : 'ghost') }, p.estado))),
              p.hook && React.createElement('div', { style: { fontStyle: 'italic', color: 'var(--text-2)', fontSize: 13, margin: '8px 0', paddingLeft: 10, borderLeft: '2px solid var(--rule)' } }, '\u201C' + p.hook + '\u201D'),
              React.createElement('div', { style: { whiteSpace: 'pre-wrap', fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.55, margin: '8px 0' } }, p.cuerpo || ''),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--rule)' } },
                React.createElement('span', { className: 'sub' }, (p.viaje || '') + ' · ' + (p.creado_por === 'ia' ? 'IA' : (p.creado_por || '—'))),
                React.createElement('button', { className: 'btn sm', onClick: () => { try { navigator.clipboard.writeText(p.cuerpo || ''); toast('Copiado al portapapeles'); } catch (e) { toast('No se pudo copiar'); } } }, React.createElement(Icon, { name: 'copy' }), 'Copiar'))))
          : React.createElement('div', { className: 'card pad' }, React.createElement('div', { className: 'sub' }, 'Todavía no hay piezas. Generá las primeras arriba.')));
    } else {
      const prompts = [
        '¿Qué canal me trae mejores leads y dónde conviene poner los US$200 de Meta?',
        '¿Qué lead caliente priorizo hoy y por qué?',
        'Dame 3 ideas de contenido para el próximo viaje a confirmar.',
        '¿Qué leads están fríos y cómo los reactivo?'
      ];
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
          React.createElement(CardHead, { title: 'Copiloto de marketing', right: React.createElement('span', { className: 'eyebrow', style: { color: 'var(--brass)' } }, 'Claude Sonnet · ve tus leads y campañas') }),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 } },
            prompts.map((p, i) => React.createElement('button', { key: i, className: 'btn sm', onClick: () => ask(p), disabled: thinking }, p))),
          React.createElement('textarea', { value: q, onChange: e => setQ(e.target.value), placeholder: 'Preguntá sobre adquisición, calidad de leads o contenido…', rows: 3, style: { width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13.5, lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' } }),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 10 } },
            React.createElement('button', { className: 'btn primary', onClick: () => ask(), disabled: thinking || !q.trim() }, React.createElement(Icon, { name: 'send' }), thinking ? 'Pensando…' : 'Preguntar'))),
        thinking && React.createElement('div', { className: 'card pad', style: { color: 'var(--text-3)', textAlign: 'center' } }, 'El copiloto está mirando tus datos…'),
        ans && React.createElement('div', { className: 'card pad' },
          React.createElement('div', { style: { whiteSpace: 'pre-wrap', fontSize: 13.5, color: 'var(--text-1)', lineHeight: 1.6 } }, ans.respuesta || 'Sin respuesta.'),
          (ans.acciones && ans.acciones.length) ? React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rule)' } },
            ans.acciones.map((a, i) => React.createElement('button', { key: i, className: 'btn sm', onClick: () => runAccion(a) }, React.createElement(Icon, { name: 'arrowright' }), a.label || 'Acción'))) : null));
    }

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' },
        React.createElement('div', null,
          React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Marketing')),
          React.createElement('div', { className: 'page-greet-sub' }, 'Motor de demanda · calidad de leads · adquisición · contenido')),
        React.createElement('button', { className: 'btn sm', onClick: load, disabled: st.loading }, React.createElement(Icon, { name: 'refresh' }), 'Actualizar')),
      tabbar,
      bodyInner
    );
  }

  // ============ CLIENTES (los que ya viajaron) ============
  const clientes = [
    { nombre: 'Familia Rudoni', viajes: 3, ltv: 142, nps: 10, ref: '—', trajo: 2 },
    { nombre: 'A. Bestani', viajes: 2, ltv: 64, nps: 9, ref: 'Rudoni', trajo: 1 },
    { nombre: 'Grupo Salvi', viajes: 2, ltv: 71, nps: 9, ref: '—', trajo: 0 },
    { nombre: 'Familia Wong', viajes: 1, ltv: 38, nps: 8, ref: 'Bestani', trajo: 1 },
  ];
  function Clientes({ cur, toast }) {
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Clientes')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Los que ya viajaron · LTV · NPS · referidos'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'users', iconCls: '', label: 'Clientes', value: clientes.length, sub: 'histórico' }),
        React.createElement(StatCard, { icon: 'coin', iconCls: 'tint', label: 'LTV total', value: k(clientes.reduce((s, c) => s + c.ltv, 0), cur), sub: 'pagado acumulado' }),
        React.createElement(StatCard, { icon: 'star', iconCls: 'tint-brass', label: 'NPS', value: 9.0, sub: 'promedio' }),
        React.createElement(StatCard, { icon: 'spark', iconCls: 'tint', label: 'Referidos', value: clientes.reduce((s, c) => s + c.trajo, 0), sub: 'traídos por clientes' })
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Cartera' }),
        React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null,
            ['Cliente', 'Viajes', 'LTV', 'NPS', 'Referido por', 'Trajo', ''].map((h, i) => React.createElement('th', { key: i, style: i && i < 6 ? { textAlign: 'right' } : null }, h)))),
          React.createElement('tbody', null, clientes.map((c, i) => React.createElement('tr', { key: i, className: 'click', onClick: () => toast('Ficha · ' + c.nombre) },
            React.createElement('td', null, React.createElement('span', { className: 'nm' }, c.nombre)),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, c.viajes),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right', color: 'var(--text-1)', fontWeight: 600 } }, k(c.ltv, cur)),
            React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('span', { className: 'badge go' }, c.nps)),
            React.createElement('td', { style: { textAlign: 'right' } }, c.ref),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, c.trajo),
            React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); toast('Invitación a próxima salida'); } }, 'Invitar')))))
        )
      )
    );
  }

  // ============ BIBLIOTECA (proveedores + accesos) ============
  const ETAPA = { identificado: { c: 'ghost', t: 'Identificado' }, contactado: { c: 'curso', t: 'Contactado' }, negociando: { c: 'risk', t: 'Negociando' }, confirmado: { c: 'go', t: 'Confirmado' } };
  function Biblioteca({ toast }) {
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Biblioteca')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Activos reutilizables · acá viven los ', React.createElement('b', null, 'Accesos')))),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Accesos', count: BA.accesos.length, right: React.createElement('span', { className: 'eyebrow', style: { color: 'var(--brass)' } }, 'pilar · Acceso') }),
        React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null,
            ['Encuentro', 'Figura', 'Salida', 'Responsable', 'Estado', 'Deadline'].map((h, i) => React.createElement('th', { key: i }, h)))),
          React.createElement('tbody', null, BA.accesos.map((a, i) => { const s = BA.salidaById(a.salida); const e = ETAPA[a.etapa];
            return React.createElement('tr', { key: i, className: 'click', onClick: () => toast('Acceso · ' + a.nombre) },
              React.createElement('td', null, React.createElement('span', { className: 'nm' }, a.nombre)),
              React.createElement('td', null, a.figura),
              React.createElement('td', null, s ? s.region : a.salida),
              React.createElement('td', null, React.createElement(Avatar, { id: a.resp, size: 24 })),
              React.createElement('td', null, React.createElement('span', { className: 'badge ' + e.c }, e.t)),
              React.createElement('td', { className: 'mono', style: { color: a.deadline.includes('hoy') ? 'var(--bad)' : 'var(--text-3)' } }, a.deadline));
          }))
        )
      )
    );
  }

  window.Ventas = Ventas;
  window.Marketing = Marketing;
  window.Clientes = Clientes;
  window.Biblioteca = Biblioteca;
  window.Configuracion = () => stub('Configuración', 'Operadores · cuentas de correo · Meta/WhatsApp · política de pagos · marca', 'settings');
})();
