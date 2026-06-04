// ============ LA EDITORIAL — motor de contenido (E1) ============
// Plan semanal generado desde la semana tipo + ADN (series, estética, kit) + highlights ★.
(function () {
  const { useState, useEffect } = React;

  const DOW = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const CANAL_IC = { instagram: 'play', stories: 'play', tiktok: 'play', blog: 'book', linkedin: 'globe', newsletter: 'mail', whatsapp: 'chat' };
  function estadoBadge(e) {
    if (e === 'aprobada' || e === 'publicada' || e === 'programada') return 'go';
    if (e === 'rechazada') return 'bad';
    if (e === 'guion') return 'risk';
    return '';
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

    // ---- Aprobación (E4): nada sale sin el visto de Brian ----
    const [qSt, setQSt] = useState({ loading: false, data: null });
    const [qOpen, setQOpen] = useState(null);
    const [rejId, setRejId] = useState(null);
    const [rejMotivo, setRejMotivo] = useState('');
    const [revBusy, setRevBusy] = useState('');
    function loadCola() {
      setQSt(s => ({ loading: true, data: s.data }));
      BA.source.aprobacionCola().then(d => setQSt({ loading: false, data: d })).catch(() => setQSt({ loading: false, data: null }));
    }
    useEffect(() => { loadCola(); }, []);
    async function review(id, decision, motivo) {
      if (revBusy) return;
      setRevBusy(id + decision);
      const r = await BA.source.piezaReview(id, decision, motivo);
      setRevBusy('');
      if (r && r.ok) {
        toast(decision === 'aprobar' ? '✓ Aprobada — lista para programar' : decision === 'rechazar' ? 'Rechazada — vuelve a la fábrica' : 'Reabierta — vuelve a la cola');
        setRejId(null); setRejMotivo('');
        loadCola(); load();
      } else { toast('No se pudo: ' + ((r && r.error) || 'error')); }
    }
    const Q = qSt.data || {};
    const qPend = (Q.pendientes || []).length;

    // ---- Feed IG (E4): preview de la grilla + portadas ----
    const [fSt, setFSt] = useState({ loading: false, data: null });
    const [fSel, setFSel] = useState(null);
    const [fUrl, setFUrl] = useState('');
    const [fBusy, setFBusy] = useState(false);
    function loadFeed() {
      setFSt(s => ({ loading: true, data: s.data }));
      BA.source.feedGrid().then(d => setFSt({ loading: false, data: d })).catch(() => setFSt({ loading: false, data: null }));
    }
    useEffect(() => { if (tab === 'feed') { if (!fSt.data && !fSt.loading) loadFeed(); if (!aSt.data && !aSt.loading) loadAssets(); } }, [tab]);
    async function setCover(pieza, url) {
      if (fBusy) return;
      setFBusy(true);
      const r = await BA.source.piezaSetCover(pieza.id, url);
      setFBusy(false);
      if (r && r.ok) { toast(url ? 'Portada asignada' : 'Portada quitada'); setFSel(null); setFUrl(''); loadFeed(); }
      else { toast('No se pudo: ' + ((r && r.error) || 'error')); }
    }

    // ---- Tanda (E4): semanas de producción + colchón ----
    const [tSt, setTSt] = useState({ loading: false, data: null });
    const [tOpen, setTOpen] = useState(null);
    function loadTanda() {
      setTSt(s => ({ loading: true, data: s.data }));
      BA.source.tandaBoard().then(d => setTSt({ loading: false, data: d })).catch(() => setTSt({ loading: false, data: null }));
    }
    useEffect(() => { if (tab === 'tanda' && !tSt.data && !tSt.loading) loadTanda(); }, [tab]);

    // ---- Highlights enriquecidos (E4) ----
    const [hfSt, setHfSt] = useState({ loading: false, data: null });
    const [hfOpen, setHfOpen] = useState(null);
    const [hlBusy, setHlBusy] = useState('');
    function loadHF() {
      setHfSt(s => ({ loading: true, data: s.data }));
      BA.source.highlightsFull().then(d => setHfSt({ loading: false, data: d })).catch(() => setHfSt({ loading: false, data: null }));
    }
    useEffect(() => { if (tab === 'highlights' && !hfSt.data && !hfSt.loading) loadHF(); }, [tab]);
    async function enrich(it) {
      if (hlBusy) return;
      setHlBusy(it.id);
      const r = await BA.source.highlightEnrich(it.id);
      setHlBusy('');
      if (r && r.ok) { toast('★ enriquecido' + (r.advertencias && r.advertencias.length ? ' · ' + r.advertencias.length + ' a revisar' : '')); setHfOpen(it.id); loadHF(); }
      else { toast('No se pudo enriquecer: ' + ((r && r.error) || 'error')); }
    }

    // ---- Colabs por pieza desde Proveedores (E4) ----
    const [cMap, setCMap] = useState({});
    const [cOpen, setCOpen] = useState(null);
    function toggleColabs(id) {
      if (cOpen === id) { setCOpen(null); return; }
      setCOpen(id);
      if (!cMap[id]) {
        setCMap(m => ({ ...m, [id]: { loading: true } }));
        BA.source.piezaColabs(id).then(d => setCMap(m => ({ ...m, [id]: { loading: false, data: d } }))).catch(() => setCMap(m => ({ ...m, [id]: { loading: false, data: null } })));
      }
    }
    function renderColabs(id) {
      const c = cMap[id];
      if (!c || c.loading) return React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'Buscando colabs del destino…');
      const grupos = (c.data || {}).grupos || [];
      if (grupos.length === 0) return React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'Esta pieza no tiene un destino con proveedores cargados.');
      return React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginBottom: 9, lineHeight: 1.5 } }, 'Figuras y lugares del destino para sumar como colaboración: etiquetar, co-crear, repost. Distribución sin cara.'),
        grupos.map(g => React.createElement('div', { key: g.tipo, style: { marginBottom: 11 } },
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 5 } }, g.label + ' · ' + (g.items || []).length),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 5 } },
            (g.items || []).map((it, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 12.5 } },
              React.createElement('span', { style: { color: 'var(--text-1)', fontWeight: 600, flexShrink: 0 } }, it.name),
              it.michelin > 0 ? React.createElement('span', { title: it.michelin + ' Michelin', style: { color: '#9A5A3A', fontSize: 11, flexShrink: 0 } }, '★'.repeat(it.michelin)) : null,
              it.location ? React.createElement('span', { style: { color: 'var(--text-3)', fontSize: 11, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, it.location) : null,
              it.web ? React.createElement('a', { href: (it.web.indexOf('http') === 0 ? it.web : 'https://' + it.web), target: '_blank', rel: 'noopener', style: { color: 'var(--brass)', fontSize: 11, marginLeft: 'auto', flexShrink: 0, textDecoration: 'none', whiteSpace: 'nowrap' } }, 'web ↗') : null))))));
    }

    // ---- Publicar (E5): newsletter por Resend ----
    const [pbSt, setPbSt] = useState({ loading: false, data: null });
    const [pbBusy, setPbBusy] = useState('');
    const [pbOpen, setPbOpen] = useState(null);
    function loadPB() {
      setPbSt(s => ({ loading: true, data: s.data }));
      BA.source.publicarBoard().then(d => setPbSt({ loading: false, data: d })).catch(() => setPbSt({ loading: false, data: null }));
    }
    useEffect(() => { if (tab === 'publicar' && !pbSt.data && !pbSt.loading) loadPB(); }, [tab]);
    async function enviarPrueba(p2) {
      if (pbBusy) return;
      setPbBusy(p2.id + ':test');
      const r = await BA.source.newsletterSend(p2.id, 'test');
      setPbBusy('');
      if (r && r.ok) { toast('Prueba enviada a ' + (r.to || 'tu correo')); loadPB(); }
      else { toast('No se pudo enviar: ' + ((r && r.error) || 'error')); }
    }
    async function enviarLista(p2, n) {
      if (pbBusy) return;
      if (!window.confirm('Enviar esta carta a ' + n + ' suscriptor' + (n === 1 ? '' : 'es') + ' de la lista. ¿Confirmás?')) return;
      setPbBusy(p2.id + ':live');
      const r = await BA.source.newsletterSend(p2.id, 'live');
      setPbBusy('');
      if (r && r.ok) { toast('Enviada a ' + r.enviados + '/' + r.total + ' · pieza publicada'); loadPB(); }
      else { toast('No se pudo enviar: ' + ((r && r.error) || 'error')); }
    }

    // ---- Suscriptores del Cuaderno (E5) ----
    const [subSt, setSubSt] = useState({ loading: false, data: null });
    const [subEmail, setSubEmail] = useState('');
    const [subName, setSubName] = useState('');
    const [subBusy, setSubBusy] = useState(false);
    const [subImpOpen, setSubImpOpen] = useState(false);
    const [subImp, setSubImp] = useState('');
    const [subActB, setSubActB] = useState('');
    function loadSubs() {
      setSubSt(s => ({ loading: true, data: s.data }));
      BA.source.subscribersBoard().then(d => setSubSt({ loading: false, data: d })).catch(() => setSubSt({ loading: false, data: null }));
    }
    useEffect(() => { if (tab === 'subs' && !subSt.data && !subSt.loading) loadSubs(); }, [tab]);
    async function addSub() {
      const em = subEmail.trim(); if (!em || subBusy) return;
      setSubBusy(true);
      const r = await BA.source.subscriberAdd(em, subName.trim());
      setSubBusy(false);
      if (r && r.ok) { toast(r.estado === 'existente' ? 'Ya estaba en la lista' : r.estado === 'reactivado' ? 'Reactivado' : 'Sumado'); setSubEmail(''); setSubName(''); loadSubs(); }
      else { toast('No se pudo: ' + ((r && r.error) || 'error')); }
    }
    async function importSubs() {
      const raw = subImp.trim(); if (!raw || subBusy) return;
      setSubBusy(true);
      const r = await BA.source.subscribersImport(raw);
      setSubBusy(false);
      if (r && r.ok) { toast(r.agregados + ' agregados · ' + r.saltados + ' repetidos' + (r.invalidos ? ' · ' + r.invalidos + ' inválidos' : '')); setSubImp(''); setSubImpOpen(false); loadSubs(); }
      else { toast('No se pudo importar: ' + ((r && r.error) || 'error')); }
    }
    async function toggleSub(s) {
      if (subActB) return;
      const next = s.status === 'subscribed' ? 'unsubscribed' : 'subscribed';
      setSubActB(s.id);
      const r = await BA.source.subscriberSetStatus(s.id, next);
      setSubActB('');
      if (r && r.ok) { loadSubs(); } else { toast('No se pudo: ' + ((r && r.error) || 'error')); }
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

    const TABS = [['plan', 'Plan', 'calendar'], ['aprobar', 'Aprobar', 'check'], ['feed', 'Feed', 'eye'], ['tanda', 'Tanda', 'list'], ['publicar', 'Publicar', 'send'], ['subs', 'Suscriptores', 'users'], ['adn', 'Semana tipo', 'layers'], ['assets', 'Assets', 'grid'], ['highlights', 'Highlights', 'star']];
    const tabbar = React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--gap)' } },
      TABS.map(t => React.createElement('button', { key: t[0], className: 'btn sm' + (tab === t[0] ? ' primary' : ''), onClick: () => setTab(t[0]) },
        React.createElement(Icon, { name: t[2] }), t[1] + (t[0] === 'aprobar' && qPend > 0 ? ' · ' + qPend : ''))));

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
    } else if (tab === 'aprobar') {
      const pend = Q.pendientes || [];
      const rech = Q.rechazadas || [];
      const aprob = Q.aprobadas || [];
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
          React.createElement(CardHead, { title: 'Cola de aprobación', count: pend.length, right: React.createElement('button', { className: 'btn sm', onClick: loadCola, disabled: qSt.loading }, React.createElement(Icon, { name: 'refresh' }), qSt.loading ? 'Cargando…' : 'Actualizar') }),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginBottom: 12, lineHeight: 1.5 } }, 'Nada se publica sin tu visto. Aprobá o rechazá cada pieza con guion; las rechazadas vuelven a la fábrica con tu motivo.'),
          pend.length === 0
            ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', padding: '6px 0' } }, 'Nada pendiente. Las piezas llegan acá cuando la fábrica escribe el guion.')
            : pend.map(p => {
              const open = qOpen === p.id;
              const dest = (p.guion && p.guion.destino) || '';
              const advs = (p.guion && p.guion.advertencias) || [];
              const hook = p.hook || (p.guion && (p.guion.hook_texto || p.guion.gancho || p.guion.asunto || p.guion.titulo)) || '';
              return React.createElement('div', { key: p.id, style: { marginBottom: 12, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' } },
                React.createElement('div', { style: { padding: '12px 14px', background: 'var(--surface-2)' } },
                  React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } },
                    React.createElement('span', { style: { flexShrink: 0, color: 'var(--text-3)', display: 'flex', marginTop: 2 } }, React.createElement(Icon, { name: CANAL_IC[p.canal] || 'send' })),
                    React.createElement('div', { style: { minWidth: 0, flex: 1 } },
                      React.createElement('div', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.35 } }, p.titulo),
                      React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 } },
                        chip(p.canal, 'c'), p.serie ? chip(serieNombre(p.serie), 's') : null, dest ? chip(dest, 'd') : null,
                        chip(fDia(p.publicar_el) + ' · ' + fHora(p.publicar_el), 't')))),
                  hook && React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)', fontStyle: 'italic', marginTop: 8, lineHeight: 1.5 } }, '\u201c' + hook + '\u201d'),
                  advs.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } },
                    advs.map((a2, i) => chip('✕ ' + a2, 'adv' + i, { borderColor: '#C0563A', color: '#C0563A' }))),
                  React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 11 } },
                    React.createElement('button', { className: 'btn primary', style: { padding: '9px 18px' }, disabled: !!revBusy, onClick: () => review(p.id, 'aprobar') }, React.createElement(Icon, { name: 'check' }), 'Aprobar'),
                    React.createElement('button', { className: 'btn', style: { padding: '9px 14px', color: '#C0563A' }, disabled: !!revBusy, onClick: () => { setRejId(rejId === p.id ? null : p.id); setRejMotivo(''); } }, React.createElement(Icon, { name: 'x' }), 'Rechazar'),
                    React.createElement('button', { className: 'btn sm', onClick: () => copiar(p.guion) }, React.createElement(Icon, { name: 'copy' }), 'Copiar'),
                    React.createElement('button', { className: 'btn sm', onClick: () => setQOpen(open ? null : p.id) }, React.createElement(Icon, { name: open ? 'cd' : 'cr' }), open ? 'Ocultar guion' : 'Ver guion'),
                    React.createElement('button', { className: 'btn sm', onClick: () => toggleColabs(p.id) }, React.createElement(Icon, { name: 'users' }), cOpen === p.id ? 'Ocultar colabs' : 'Colabs')),
                  rejId === p.id && React.createElement('div', { style: { marginTop: 10 } },
                    React.createElement('textarea', { value: rejMotivo, rows: 2, placeholder: 'Motivo (opcional) — le sirve al laboratorio', onChange: e => setRejMotivo(e.target.value), style: { width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--text-1)', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' } }),
                    React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8 } },
                      React.createElement('button', { className: 'btn sm', style: { borderColor: '#C0563A', color: '#C0563A' }, disabled: !!revBusy, onClick: () => review(p.id, 'rechazar', rejMotivo) }, 'Confirmar rechazo'),
                      React.createElement('button', { className: 'btn sm', onClick: () => { setRejId(null); setRejMotivo(''); } }, 'Cancelar')))),
                open && React.createElement('div', { style: { padding: '4px 14px 14px', borderTop: '1px solid var(--line)' } }, renderGuion(p.guion)),
                cOpen === p.id && React.createElement('div', { style: { padding: '10px 14px 14px', borderTop: '1px solid var(--line)' } }, renderColabs(p.id)));
            })),
        rech.length > 0 && React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
          React.createElement(CardHead, { title: 'Rechazadas', count: rech.length, right: React.createElement('span', { className: 'eyebrow' }, 'vuelven a la fábrica') }),
          rech.map(p => React.createElement('div', { key: p.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--line)' } },
            React.createElement('span', { style: { flexShrink: 0, color: '#C0563A', display: 'flex' } }, React.createElement(Icon, { name: 'x', style: { width: 13, height: 13 } })),
            React.createElement('div', { style: { minWidth: 0, flex: 1 } },
              React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, p.titulo),
              p.review_motivo && React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 2 } }, p.review_motivo)),
            React.createElement('button', { className: 'btn sm', disabled: !!revBusy, onClick: () => review(p.id, 'reabrir') }, 'Reabrir')))),
        aprob.length > 0 && React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Aprobadas', count: aprob.length, right: React.createElement('span', { className: 'eyebrow' }, 'listas para programar') }),
          aprob.map(p => React.createElement('div', { key: p.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--line)' } },
            React.createElement('span', { style: { flexShrink: 0, color: '#4A6A4B', display: 'flex' } }, React.createElement(Icon, { name: 'check', style: { width: 13, height: 13 } })),
            React.createElement('div', { style: { minWidth: 0, flex: 1 } },
              React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, p.titulo),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 } }, (p.canal || '') + ' · sale ' + fDia(p.publicar_el))),
            React.createElement('button', { className: 'btn sm', disabled: !!revBusy, onClick: () => review(p.id, 'reabrir') }, 'Reabrir')))));
    } else if (tab === 'feed') {
      const FP = (fSt.data || {}).piezas || [];
      const SERIE_COLOR = { desde_arriba: '#3D5A3E', tres_datos: '#9A5A3A', el_criterio: '#6B6258', la_mesa: '#7A4533', la_textura: '#A8987F', fauna: '#4E6B50' };
      const DOT = { idea: '#9A938A', guion: '#B07D3A', aprobada: '#4A6A4B', programada: '#2F5D8A', publicada: '#3D5A3E' };
      const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      function fCorta(iso) { if (!iso) return ''; const d = new Date(iso); return d.getDate() + ' ' + MESES[d.getMonth()]; }
      const glyph = f => f === 'reel' ? '▶' : f === 'carrusel' ? '⧉' : '✦';
      const viajesA = (aSt.data || {}).viajes || [];
      const grupoA = fSel ? viajesA.find(v => v.trip_id === fSel.destino) : null;
      const fotosA = grupoA ? (grupoA.assets || []).filter(a2 => a2.tipo === 'foto' && a2.url) : [];
      bodyInner = React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Grilla del feed', count: FP.length, right: React.createElement('button', { className: 'btn sm', onClick: loadFeed, disabled: fSt.loading }, React.createElement(Icon, { name: 'refresh' }), fSt.loading ? 'Cargando…' : 'Actualizar') }),
        React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginBottom: 12, lineHeight: 1.5 } }, 'Así se ve el perfil: lo más nuevo arriba a la izquierda. Tocá una pieza para asignarle portada desde la biblioteca.'),
        fSel && React.createElement('div', { style: { marginBottom: 12, padding: '12px 14px', border: '1px solid var(--brass)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 } },
            React.createElement('div', { style: { minWidth: 0, flex: 1 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-1)' } }, fSel.titulo),
              React.createElement('div', { className: 'eyebrow', style: { marginTop: 3 } }, 'Portada · ' + (fSel.cover_url ? 'asignada' : 'sin asignar'))),
            React.createElement('button', { className: 'btn sm', onClick: () => { setFSel(null); setFUrl(''); } }, React.createElement(Icon, { name: 'x' }))),
          fotosA.length > 0
            ? React.createElement('div', { style: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 9 } },
              fotosA.map(a2 => React.createElement('img', { key: a2.id, src: a2.url, title: a2.titulo || '', onClick: () => setCover(fSel, a2.url), style: { width: 64, height: 80, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', flexShrink: 0, border: fSel.cover_url === a2.url ? '2px solid var(--brass)' : '2px solid transparent' } })))
            : React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginBottom: 9 } }, 'Sin fotos en la biblioteca para este destino — cargalas en Assets o pegá una URL.'),
          React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
            React.createElement('input', { value: fUrl, placeholder: 'https://… (URL de la imagen)', onChange: e => setFUrl(e.target.value), style: { flex: '1 1 220px', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--text-1)', fontSize: 13 } }),
            React.createElement('button', { className: 'btn sm primary', disabled: fBusy || !fUrl.trim(), onClick: () => setCover(fSel, fUrl.trim()) }, 'Usar URL'),
            fSel.cover_url && React.createElement('button', { className: 'btn sm', disabled: fBusy, onClick: () => setCover(fSel, '') }, 'Quitar portada'))),
        FP.length === 0
          ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', padding: '6px 0' } }, 'Sin piezas de Instagram en el plan todavía.')
          : React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, maxWidth: 560, margin: '0 auto' } },
            FP.map(p2 => {
              const col = SERIE_COLOR[p2.serie] || '#6B6258';
              return React.createElement('div', { key: p2.id, onClick: () => { setFSel(p2); setFUrl(''); }, style: { position: 'relative', aspectRatio: '3 / 4', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', background: col, outline: fSel && fSel.id === p2.id ? '2px solid var(--brass)' : 'none' } },
                p2.cover_url
                  ? React.createElement('img', { src: p2.cover_url, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } })
                  : React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10px 10px 26px' } },
                    React.createElement('div', { style: { fontSize: 8.5, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(245,241,234,.75)', marginBottom: 4, fontFamily: 'var(--ff-mono)' } }, (p2.serie || '').replace(/_/g, ' ')),
                    React.createElement('div', { style: { fontSize: 11.5, lineHeight: 1.35, color: '#F5F1EA', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' } }, p2.hook || p2.titulo || '')),
                React.createElement('span', { style: { position: 'absolute', top: 6, right: 7, fontSize: 12, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,.55)' } }, glyph(p2.formato)),
                React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 7px', background: 'linear-gradient(transparent, rgba(26,26,26,.55))' } },
                  React.createElement('span', { style: { fontSize: 9.5, color: 'rgba(245,241,234,.9)', fontFamily: 'var(--ff-mono)' } }, fCorta(p2.publicar_el)),
                  React.createElement('span', { title: p2.estado, style: { width: 8, height: 8, borderRadius: 99, background: DOT[p2.estado] || '#9A938A', boxShadow: '0 0 0 1.5px rgba(245,241,234,.6)' } })));
            })));
    } else if (tab === 'tanda') {
      const TB = tSt.data || {};
      const tandas = TB.tandas || [];
      const ESTC = { idea: '#9A938A', guion: '#B07D3A', aprobada: '#4A6A4B', programada: '#2F5D8A', publicada: '#3D5A3E' };
      const MES2 = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const MESL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      function monday(s) { const x = new Date(s + 'T00:00:00'); const dow = (x.getDay() + 6) % 7; x.setDate(x.getDate() - dow); x.setHours(0, 0, 0, 0); return x; }
      const hoyM = monday(TB.hoy || new Date().toISOString().slice(0, 10));
      function relLabel(s) { const wk = Math.round((monday(s) - hoyM) / 6048e5); return wk === 0 ? 'esta semana' : wk === 1 ? 'próxima' : wk > 1 ? 'en ' + wk + ' sem' : wk === -1 ? 'pasada' : 'hace ' + (-wk) + ' sem'; }
      function fSemana(s) { const d = new Date(s + 'T00:00:00'); return 'Semana del ' + d.getDate() + ' ' + MES2[d.getMonth()]; }
      const listas = tandas.filter(t => monday(t.tanda) > hoyM && t.lista).length;
      const bufCol = listas >= 2 ? '#4A6A4B' : listas === 1 ? '#B07D3A' : '#C0563A';
      const meses = [];
      tandas.forEach(t => {
        const d = new Date(t.tanda + 'T00:00:00'); const key = d.getFullYear() + '-' + d.getMonth();
        let g = meses.find(x => x.key === key);
        if (!g) { g = { key, label: MESL[d.getMonth()] + ' ' + d.getFullYear(), items: [] }; meses.push(g); }
        g.items.push(t);
      });
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)', borderLeft: '3px solid ' + bufCol } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 38, lineHeight: 1, color: bufCol } }, listas),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-1)' } }, listas === 1 ? 'semana lista por delante' : 'semanas listas por delante'),
              React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.5 } }, 'Colchón de producción · objetivo ≥2. Una semana está lista cuando no le queda nada en idea ni en guion.')),
            React.createElement('button', { className: 'btn sm', onClick: loadTanda, disabled: tSt.loading }, React.createElement(Icon, { name: 'refresh' }), tSt.loading ? '…' : 'Actualizar'))),
        tandas.length === 0
          ? React.createElement('div', { className: 'card pad', style: { fontSize: 12.5, color: 'var(--text-3)' } }, 'Sin tandas todavía. Generá una semana en el Plan.')
          : meses.map(m => React.createElement('div', { key: m.key, style: { marginBottom: 'var(--gap)' } },
            React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, m.label + ' · Tanda Mayor'),
            React.createElement('div', { className: 'card pad' },
              m.items.map((t, ti) => {
                const open = tOpen === t.tanda;
                const segs = ['publicada', 'programada', 'aprobada', 'guion', 'idea'].filter(k => (t.por_estado[k] || 0) > 0);
                return React.createElement('div', { key: t.tanda, style: { borderTop: ti > 0 ? '1px solid var(--line)' : 'none', paddingTop: ti > 0 ? 12 : 0, marginTop: ti > 0 ? 12 : 0 } },
                  React.createElement('div', { onClick: () => setTOpen(open ? null : t.tanda), style: { cursor: 'pointer' } },
                    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
                      React.createElement('span', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)' } }, fSemana(t.tanda)),
                      React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, relLabel(t.tanda)),
                      React.createElement('span', { className: 'badge ' + (t.lista ? 'go' : 'risk'), style: { padding: '2px 8px' } }, t.lista ? '✓ Lista' : '⚠ Pendiente'),
                      React.createElement('span', { style: { marginLeft: 'auto', fontSize: 11.5, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' } }, t.listos + '/' + t.total + ' listas'),
                      React.createElement(Icon, { name: open ? 'cd' : 'cr', style: { color: 'var(--text-faint)', width: 16, height: 16 } })),
                    React.createElement('div', { style: { display: 'flex', height: 7, borderRadius: 4, overflow: 'hidden', margin: '8px 0 6px', background: 'var(--surface-2)' } },
                      segs.map(k => React.createElement('div', { key: k, title: k + ': ' + t.por_estado[k], style: { flexGrow: t.por_estado[k], background: ESTC[k] } }))),
                    React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)' } }, 'Canales: ' + ((t.canales || []).join(' · ') || '—'))),
                  open && React.createElement('div', { style: { marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 } },
                    (t.piezas || []).map(p3 => React.createElement('div', { key: p3.id, style: { display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' } },
                      React.createElement('span', { style: { flexShrink: 0, color: 'var(--text-3)', display: 'flex' } }, React.createElement(Icon, { name: CANAL_IC[p3.canal] || 'send' })),
                      React.createElement('div', { style: { minWidth: 0, flex: 1 } },
                        React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, p3.titulo),
                        p3.hook && React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 } }, p3.hook)),
                      React.createElement('span', { title: p3.estado, style: { flexShrink: 0, width: 8, height: 8, borderRadius: 99, background: ESTC[p3.estado] || '#9A938A' } })))));
              })))));
    } else if (tab === 'publicar') {
      const PB = pbSt.data || {};
      const piezasPB = PB.piezas || [];
      const nSubs = PB.subscribers_activos || 0;
      const news = piezasPB.filter(x => x.canal === 'newsletter');
      const otras = piezasPB.filter(x => x.canal !== 'newsletter');
      const fFecha = iso => { if (!iso) return ''; const d = new Date(iso); return d.getDate() + ' ' + ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][d.getMonth()]; };
      const estChip = e => e === 'publicada' ? chip('publicada', 'e', { borderColor: '#3D5A3E', color: '#3D5A3E' }) : e === 'programada' ? chip('programada', 'e', { borderColor: '#2F5D8A', color: '#2F5D8A' }) : chip('aprobada', 'e', { borderColor: '#4A6A4B', color: '#4A6A4B' });
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)', borderLeft: '3px solid var(--brass)', display: 'flex', alignItems: 'center', gap: 12 } },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-1)' } }, 'Cuaderno B&A · lista de correo'),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.5 } }, nSubs + ' suscriptor' + (nSubs === 1 ? '' : 'es') + ' activo' + (nSubs === 1 ? '' : 's') + '. Sale desde newsletter@blisniukamanov.com. Probá a tu correo antes de mandar a la lista.')),
          React.createElement('button', { className: 'btn sm', onClick: loadPB, disabled: pbSt.loading }, React.createElement(Icon, { name: 'refresh' }), pbSt.loading ? '…' : 'Actualizar')),
        React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, 'Newsletter · ' + news.length),
        news.length === 0
          ? React.createElement('div', { className: 'card pad', style: { fontSize: 12.5, color: 'var(--text-3)', marginBottom: 'var(--gap)' } }, 'Sin cartas aprobadas. Cuando aprobés una pieza de newsletter, aparece acá para enviar.')
          : news.map(p2 => {
            const open = pbOpen === p2.id;
            const pub = p2.publicado || {};
            const prueba = pub.ultima_prueba;
            return React.createElement('div', { key: p2.id, className: 'card pad', style: { marginBottom: 10 } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } },
                React.createElement('span', { style: { flexShrink: 0, color: 'var(--text-3)', display: 'flex', marginTop: 2 } }, React.createElement(Icon, { name: 'mail' })),
                React.createElement('div', { style: { minWidth: 0, flex: 1 } },
                  React.createElement('div', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.35 } }, p2.asunto || p2.titulo),
                  p2.preheader ? React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 3, fontStyle: 'italic' } }, p2.preheader) : null,
                  React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 } },
                    estChip(p2.estado), p2.publicar_el ? chip('sale ' + fFecha(p2.publicar_el), 'f') : null,
                    p2.estado === 'publicada' && pub.enviados ? chip('enviada a ' + pub.enviados, 'env', { borderColor: '#3D5A3E', color: '#3D5A3E' }) : null))),
              prueba ? React.createElement('div', { style: { fontSize: 11, color: 'var(--text-faint)', marginTop: 8 } }, 'Última prueba: ' + prueba.to) : null,
              React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 11 } },
                React.createElement('button', { className: 'btn sm primary', disabled: pbBusy === p2.id + ':test', onClick: () => enviarPrueba(p2) }, React.createElement(Icon, { name: 'send' }), pbBusy === p2.id + ':test' ? 'Enviando…' : 'Enviar prueba'),
                React.createElement('button', { className: 'btn sm', disabled: nSubs === 0 || pbBusy === p2.id + ':live', onClick: () => enviarLista(p2, nSubs) }, React.createElement(Icon, { name: 'mail' }), pbBusy === p2.id + ':live' ? 'Enviando…' : 'A la lista (' + nSubs + ')'),
                React.createElement('button', { className: 'btn sm', onClick: () => setPbOpen(open ? null : p2.id) }, React.createElement(Icon, { name: open ? 'cd' : 'cr' }), open ? 'Ocultar' : 'Ver carta')),
              open ? React.createElement('div', { style: { marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--text-1)', lineHeight: 1.65, whiteSpace: 'pre-wrap' } }, p2.cuerpo || '(sin cuerpo en el guion)') : null);
          }),
        otras.length > 0 ? React.createElement('div', { className: 'eyebrow', style: { margin: '4px 0 8px' } }, 'En cola para su canal · ' + otras.length) : null,
        otras.length > 0 ? React.createElement('div', { className: 'card pad' },
          React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.5 } }, 'Piezas aprobadas de otros canales. El envío a blog (WordPress) y redes llega en los próximos pasos.'),
          otras.map((p2, i) => React.createElement('div', { key: p2.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none' } },
            React.createElement('span', { style: { flexShrink: 0, color: 'var(--text-3)', display: 'flex' } }, React.createElement(Icon, { name: CANAL_IC[p2.canal] || 'send' })),
            React.createElement('div', { style: { minWidth: 0, flex: 1 } },
              React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, p2.titulo),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', marginTop: 2 } }, p2.canal + (p2.publicar_el ? ' · sale ' + fFecha(p2.publicar_el) : ''))),
            estChip(p2.estado)))) : null);
    } else if (tab === 'subs') {
      const SB2 = subSt.data || {};
      const lista = SB2.lista || [];
      const inpSt = { padding: '9px 10px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 };
      const fF = iso => { if (!iso) return ''; const d = new Date(iso); return d.getDate() + ' ' + ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][d.getMonth()]; };
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)', borderLeft: '3px solid var(--brass)', display: 'flex', alignItems: 'center', gap: 16 } },
          React.createElement('div', { style: { textAlign: 'center', flexShrink: 0 } },
            React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 34, lineHeight: 1, color: '#3D5A3E' } }, SB2.activos || 0),
            React.createElement('div', { className: 'eyebrow', style: { marginTop: 3 } }, 'activos')),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-1)' } }, 'Lista del Cuaderno B&A'),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.5 } }, 'Es aparte de los leads: el lead es prospecto de venta; el suscriptor pidió recibir el contenido. Si un lead se suscribe, se linkean.'),
            React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-faint)', marginTop: 5, fontFamily: 'var(--ff-mono)' } }, (SB2.total || 0) + ' en total · ' + (SB2.baja || 0) + ' de baja')),
          React.createElement('button', { className: 'btn sm', onClick: loadSubs, disabled: subSt.loading }, React.createElement(Icon, { name: 'refresh' }), subSt.loading ? '…' : 'Actualizar')),
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, 'Sumar suscriptor'),
          React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' } },
            React.createElement('input', { value: subEmail, placeholder: 'email', onChange: e => setSubEmail(e.target.value), onKeyDown: e => { if (e.key === 'Enter') addSub(); }, style: { ...inpSt, flex: '2 1 200px' } }),
            React.createElement('input', { value: subName, placeholder: 'nombre (opcional)', onChange: e => setSubName(e.target.value), onKeyDown: e => { if (e.key === 'Enter') addSub(); }, style: { ...inpSt, flex: '1 1 140px' } }),
            React.createElement('button', { className: 'btn sm primary', disabled: subBusy || !subEmail.trim(), onClick: addSub }, React.createElement(Icon, { name: 'plus' }), 'Sumar'),
            React.createElement('button', { className: 'btn sm', onClick: () => setSubImpOpen(!subImpOpen) }, React.createElement(Icon, { name: 'download' }), 'Importar')),
          subImpOpen ? React.createElement('div', { style: { marginTop: 12 } },
            React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginBottom: 6 } }, 'Pegá emails, uno por línea (puede incluir el nombre: "Ana Pérez ana@mail.com").'),
            React.createElement('textarea', { value: subImp, onChange: e => setSubImp(e.target.value), rows: 5, placeholder: 'ana@mail.com\njuan@mail.com', style: { ...inpSt, width: '100%', resize: 'vertical', fontFamily: 'var(--ff-mono)' } }),
            React.createElement('div', { style: { marginTop: 8 } },
              React.createElement('button', { className: 'btn sm primary', disabled: subBusy || !subImp.trim(), onClick: importSubs }, React.createElement(Icon, { name: 'check' }), subBusy ? 'Importando…' : 'Importar lista'))) : null),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'En la lista', count: lista.length }),
          lista.length === 0
            ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', padding: '4px 0' } }, 'Lista vacía. Sumá el primer suscriptor o importá una lista. La forma sana de llenarla es un formulario de alta en el sitio.')
            : React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } },
              lista.map((s, i) => React.createElement('div', { key: s.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none' } },
                React.createElement('span', { title: s.status, style: { flexShrink: 0, width: 8, height: 8, borderRadius: 99, background: s.status === 'subscribed' ? '#4A6A4B' : '#B0A89C' } }),
                React.createElement('div', { style: { minWidth: 0, flex: 1 } },
                  React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, s.email),
                  React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, (s.name ? s.name + ' · ' : '') + (s.source || '') + (s.subscribed_at ? ' · ' + fF(s.subscribed_at) : ''))),
                s.lead_id ? chip('desde lead', 'l', { borderColor: '#6B6258', color: '#6B6258' }) : null,
                React.createElement('button', { className: 'btn sm', disabled: subActB === s.id, onClick: () => toggleSub(s) }, s.status === 'subscribed' ? 'Dar de baja' : 'Reactivar'))))));
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
      // highlights enriquecidos
      const HV = (hfSt.data || {}).viajes || [];
      function serieN(id) { const s = series.find(x => x.id === id); return s ? s.nombre : id; }
      function detalle(e) {
        if (!e) return null;
        const sec = (label, arr, gl) => (Array.isArray(arr) && arr.length) ? React.createElement('div', { style: { marginTop: 8 } },
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 4 } }, label),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 3 } },
            arr.map((x, i) => React.createElement('div', { key: i, style: { fontSize: 12, color: 'var(--text-1)', lineHeight: 1.5, display: 'flex', gap: 6 } },
              gl ? React.createElement('span', { style: { color: 'var(--text-faint)', flexShrink: 0 } }, gl) : null, x)))) : null;
        const chipRow = (label, arr, mapper) => (Array.isArray(arr) && arr.length) ? React.createElement('div', { style: { marginTop: 8 } },
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 4 } }, label),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, arr.map((x, i) => chip(mapper ? mapper(x) : x, 'c' + i)))) : null;
        return React.createElement('div', { style: { marginTop: 8, paddingTop: 10, borderTop: '1px solid var(--line)' } },
          e.sintesis ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-1)', fontStyle: 'italic', lineHeight: 1.55 } }, e.sintesis) : null,
          sec('Ángulos', e.angulos),
          chipRow('Series que encajan', e.series, serieN),
          chipRow('Formatos', e.formatos),
          sec('Tomas a conseguir', e.capturas, '◦'),
          e.gancho ? React.createElement('div', { style: { marginTop: 8 } },
            React.createElement('div', { className: 'eyebrow', style: { marginBottom: 4 } }, 'Gancho'),
            React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)', fontStyle: 'italic' } }, '“' + e.gancho + '”')) : null,
          (e.advertencias && e.advertencias.length) ? React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 } },
            e.advertencias.map((a2, i) => chip('✕ ' + a2, 'adv' + i, { borderColor: '#C0563A', color: '#C0563A' }))) : null);
      }
      bodyInner = React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)', borderLeft: '3px solid var(--brass)', display: 'flex', alignItems: 'center', gap: 12 } },
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55, flex: 1 } },
            'Los ★ del itinerario son la materia prima. Enriquecé cada uno y la IA te da el criterio: por qué importa, qué ángulos da, qué series y formatos encajan, y qué tomas reales conseguir.'),
          React.createElement('button', { className: 'btn sm', onClick: loadHF, disabled: hfSt.loading }, React.createElement(Icon, { name: 'refresh' }), hfSt.loading ? '…' : 'Actualizar')),
        HV.length === 0
          ? React.createElement('div', { className: 'card pad' }, 'Sin highlights todavía. Abrí un viaje → Itinerario → marcá ★.')
          : HV.map(h => React.createElement('div', { key: h.trip_id, className: 'card pad', style: { marginBottom: 10 } },
            React.createElement(CardHead, { title: h.viaje, count: h.total, right: openTrip && React.createElement('button', { className: 'btn sm', onClick: () => openTrip(h.trip_id) }, React.createElement(Icon, { name: 'route' }), 'Itinerario') }),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
              (h.items || []).map(it => {
                const open = hfOpen === it.id; const enr = it.enriquecido;
                return React.createElement('div', { key: it.id, style: { padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' } },
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' } },
                    React.createElement('span', { style: { color: 'var(--brass)', flexShrink: 0 } }, '★'),
                    React.createElement('span', { className: 'mono', style: { color: 'var(--text-3)', flexShrink: 0, fontSize: 11 } }, 'Día ' + it.dia),
                    React.createElement('span', { style: { color: 'var(--text-1)', minWidth: 120, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, fontSize: 12.5 } }, it.titulo),
                    it.jerarquia ? chip(it.jerarquia, 'j', it.jerarquia === 'alta' ? { borderColor: '#4A6A4B', color: '#4A6A4B' } : it.jerarquia === 'media' ? { borderColor: '#B07D3A', color: '#B07D3A' } : null) : null,
                    enr ? React.createElement('button', { className: 'btn sm', onClick: () => setHfOpen(open ? null : it.id) }, React.createElement(Icon, { name: open ? 'cd' : 'cr' })) : null,
                    React.createElement('button', { className: 'btn sm' + (enr ? '' : ' primary'), disabled: hlBusy === it.id, onClick: () => enrich(it) }, React.createElement(Icon, { name: enr ? 'refresh' : 'spark' }), hlBusy === it.id ? 'Pensando…' : (enr ? 'Regenerar' : 'Enriquecer'))),
                  enr && open ? detalle(enr) : null);
              })))));
    }

    return React.createElement('div', null, tabbar, bodyInner);
  }

  window.Editorial = Editorial;
})();
