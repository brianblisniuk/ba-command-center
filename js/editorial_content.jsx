// ============ SISTEMA DE CONTENIDO B&A ============
// NuevaPieza (máquina de guiones) · BibliotecaFotos · EditorCarrusel (preview + export) · CalendarioContenido
(function () {
  const { useState, useEffect, useRef } = React;
  const e = React.createElement;

  // ---- helpers ----
  function Sp({ h = 16 }) { return e('div', { style: { height: h } }); }
  function Lbl({ t }) { return e('div', { className: 'eyebrow', style: { marginBottom: 6 } }, t); }
  function Cap({ v, onChange, rows }) {
    return e('textarea', {
      value: v, rows: rows || 3, onChange: ev => onChange(ev.target.value),
      style: { width: '100%', resize: 'vertical', fontSize: 13, fontFamily: 'var(--ff-body)', padding: '10px 12px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)', lineHeight: 1.55 }
    });
  }
  function Inp({ v, onChange, placeholder }) {
    return e('input', {
      type: 'text', value: v, placeholder: placeholder || '', onChange: ev => onChange(ev.target.value),
      style: { width: '100%', fontSize: 13, padding: '9px 12px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)' }
    });
  }
  function statusLabel(s) {
    const m = { draft: 'Borrador', copy_approved: 'Copy aprobado', assets_selected: 'Fotos elegidas', rendered: 'Carrusel armado', scheduled: 'Programado', published: 'Publicado' };
    return m[s] || s;
  }
  function statusCls(s) {
    if (s === 'published' || s === 'scheduled') return 'go';
    if (s === 'copy_approved' || s === 'assets_selected' || s === 'rendered') return 'risk';
    return '';
  }
  function fDate(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (er) { return iso; }
  }
  function SlideBadge({ layout }) {
    const m = { 'destination-editorial': 'Destino', 'activity-specific': 'Actividad', 'comparison': 'Comparación', 'final-cta': 'CTA', 'story-cover': 'Story' };
    return e('span', { className: 'tag', style: { fontSize: 10 } }, m[layout] || layout);
  }
  function asArr(d) { return Array.isArray(d) ? d : (typeof d === 'string' ? (function () { try { return JSON.parse(d); } catch (x) { return []; } })() : []); }

  // ============ PREVIEW VISUAL DEL CARRUSEL ============
  function layoutContent(slide) {
    const l = slide.layout || 'destination-editorial';
    if (l === 'activity-specific') {
      return e('section', { className: 'ba-layout ba-l-act' },
        slide.kicker && e('div', { className: 'ba-kicker' }, slide.kicker),
        e('div', { className: 'ba-hero' },
          slide.script_text && e('div', { className: 'ba-script' }, slide.script_text),
          slide.main && e('div', { className: 'ba-display' }, slide.main)),
        slide.body && e('div', { className: 'ba-quote' }, e('div', { className: 'qm' }, '\u201C'), e('p', null, slide.body)),
        Array.isArray(slide.details) && slide.details.length > 0 && e('div', { className: 'ba-details' },
          slide.details.map((d, i) => e('div', { key: i, className: 'ba-drow' },
            e('div', { className: 'ba-dl' }, d.label), e('div', { className: 'ba-dv' }, d.value)))));
    }
    if (l === 'comparison') {
      return e('section', { className: 'ba-layout ba-l-cmp' },
        e('h1', { className: 'ba-cmp-title' }, slide.main || ''),
        e('div', { className: 'ba-panels' },
          e('div', { className: 'ba-panel' }, e('div', { className: 'ba-pl' }, slide.left && slide.left.label), e('p', null, slide.left && slide.left.text)),
          e('div', { className: 'ba-panel' }, e('div', { className: 'ba-pl' }, slide.right && slide.right.label), e('p', null, slide.right && slide.right.text))),
        slide.question && e('p', { className: 'ba-question' }, slide.question));
    }
    if (l === 'final-cta') {
      return e('section', { className: 'ba-layout ba-l-cta' },
        slide.kicker && e('div', { className: 'ba-kicker' }, slide.kicker),
        e('div', { className: 'ba-hero' },
          slide.script_text && e('div', { className: 'ba-script' }, slide.script_text),
          slide.main && e('div', { className: 'ba-display' }, slide.main)),
        slide.body && e('p', { className: 'ba-deck' }, slide.body),
        slide.cta && e('div', { className: 'ba-ctabox' }, e('div', { className: 'ba-ctah' }, slide.cta.headline), e('p', { className: 'ba-ctat' }, slide.cta.text)));
    }
    if (l === 'story-cover') {
      return e('section', { className: 'ba-layout ba-l-story' },
        slide.kicker && e('div', { className: 'ba-kicker' }, slide.kicker),
        e('div', { className: 'ba-hero' },
          slide.script_text && e('div', { className: 'ba-script' }, slide.script_text),
          slide.main && e('div', { className: 'ba-display' }, slide.main)),
        slide.body && e('p', { className: 'ba-deck' }, slide.body),
        Array.isArray(slide.meta) && e('div', { className: 'ba-meta' }, slide.meta.map((m, i) => e('span', { key: i, className: 'ba-pill' }, m))));
    }
    // destination-editorial (default)
    return e('section', { className: 'ba-layout ba-l-dest' },
      slide.kicker && e('div', { className: 'ba-kicker' }, slide.kicker),
      e('div', { className: 'ba-hero' },
        slide.script_text && e('div', { className: 'ba-script' }, slide.script_text),
        slide.main && e('div', { className: 'ba-display' }, slide.main)),
      slide.body && e('p', { className: 'ba-deck' }, slide.body),
      Array.isArray(slide.meta) && e('div', { className: 'ba-meta' }, slide.meta.map((m, i) => e('span', { key: i, className: 'ba-pill' }, m))));
  }

  function SlidePreview({ slide, photoUrl, tema, format, scale, slideRef }) {
    const l = slide.layout || 'destination-editorial';
    const fmt = format || 'feed';
    const w = 1080, h = fmt === 'story' ? 1920 : 1350;
    const sc = scale || 0.34;
    return e('div', { className: 'ba-frame', style: { width: Math.round(w * sc), height: Math.round(h * sc) } },
      e('div', {
        ref: slideRef, className: 'ba-slide', 'data-layout': l, 'data-theme': tema || 'alpine-dark', 'data-format': fmt,
        style: { transform: 'scale(' + sc + ')', transformOrigin: 'top left' }
      },
        photoUrl
          ? e('img', { className: 'ba-bg', src: photoUrl, crossOrigin: 'anonymous', alt: '' })
          : e('div', { className: 'ba-fallback' }),
        e('div', { className: 'ba-overlay' }),
        e('div', { className: 'ba-grain' }),
        e('div', { className: 'ba-brand' },
          e('div', { className: 'ba-hash' }, '#'),
          e('div', { className: 'ba-words' }, e('div', null, 'Cuaderno'), e('div', null, 'B&A'))),
        layoutContent(slide),
        e('div', { className: 'ba-footer' },
          e('div', { className: 'ba-handle' }, '@blisniukamanov'),
          e('div', { className: 'ba-arrow' }))
      )
    );
  }

  // ---- SlideCard: muestra el copy de un slide (en NuevaPieza) ----
  function SlideCard({ slide, idx }) {
    const [open, setOpen] = useState(idx === 0);
    const l = slide.layout || '';
    return e('div', { className: 'card', style: { marginBottom: 10 } },
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer' }, onClick: () => setOpen(o => !o) },
        e('span', { className: 'mono', style: { color: 'var(--text-3)', fontSize: 11 } }, '0' + (idx + 1)),
        e(SlideBadge, { layout: l }),
        slide.main && e('span', { style: { fontFamily: 'var(--ff-display)', fontSize: 15, color: 'var(--text-1)', flex: 1 } }, slide.main),
        e(Icon, { name: open ? 'chevron-up' : 'chevron-down' })),
      open && e('div', { style: { padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 } },
        slide.kicker && e('div', null, e('span', { className: 'eyebrow' }, 'KICKER  '), e('span', { style: { fontSize: 12, color: 'var(--text-2)' } }, slide.kicker)),
        slide.script_text && e('div', null, e('span', { className: 'eyebrow' }, 'SCRIPT  '), e('span', { style: { fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' } }, slide.script_text)),
        slide.main && e('div', null, e('span', { className: 'eyebrow' }, 'DISPLAY  '), e('span', { style: { fontSize: 13, fontFamily: 'var(--ff-display)', color: 'var(--text-1)', fontWeight: 600 } }, slide.main)),
        slide.body && e('div', null, e('span', { className: 'eyebrow' }, 'BODY  '), e('span', { style: { fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.55, fontStyle: 'italic' } }, slide.body)),
        slide.question && e('div', null, e('span', { className: 'eyebrow' }, 'PREGUNTA  '), e('span', { style: { fontSize: 12.5, color: 'var(--text-2)' } }, slide.question)),
        slide.left && e('div', { style: { display: 'flex', gap: 10 } },
          e('div', { style: { flex: 1, padding: '8px 10px', border: '1px solid var(--rule)', borderRadius: 6 } }, e('div', { style: { fontSize: 11, fontWeight: 700, marginBottom: 3 } }, slide.left.label), e('div', { style: { fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' } }, slide.left.text)),
          e('div', { style: { flex: 1, padding: '8px 10px', border: '1px solid var(--rule)', borderRadius: 6 } }, e('div', { style: { fontSize: 11, fontWeight: 700, marginBottom: 3 } }, slide.right && slide.right.label), e('div', { style: { fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' } }, slide.right && slide.right.text))),
        slide.cta && e('div', { style: { padding: '10px 12px', border: '1px solid var(--rule)', borderRadius: 6, background: 'var(--surface-2)' } }, e('div', { style: { fontSize: 13, fontFamily: 'var(--ff-display)', marginBottom: 4 } }, slide.cta.headline), e('div', { style: { fontSize: 12, color: 'var(--text-2)' } }, slide.cta.text)),
        Array.isArray(slide.meta) && slide.meta.length > 0 && e('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } }, slide.meta.map((m, i) => e('span', { key: i, className: 'tag', style: { fontSize: 10 } }, m))),
        Array.isArray(slide.details) && slide.details.length > 0 && e('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, slide.details.map((d, i) => e('div', { key: i, style: { display: 'flex', gap: 8, fontSize: 12 } }, e('span', { style: { color: 'var(--text-3)', minWidth: 70, textTransform: 'uppercase', fontSize: 10 } }, d.label), e('span', { style: { color: 'var(--text-1)' } }, d.value))))
      )
    );
  }

  // ============ NUEVA PIEZA (máquina de guiones) ============
  function NuevaPieza({ toast }) {
    const [brief, setBrief] = useState({ destino: '', tema: '', notas: '', num_slides: 4 });
    const [loading, setLoading] = useState(false);
    const [draft, setDraft] = useState(null);
    const [caption, setCaption] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(null);
    function upd(k, v) { setBrief(b => ({ ...b, [k]: v })); }

    async function generate() {
      if (!brief.destino.trim() || !brief.tema.trim()) { toast('Complete el destino y el tema antes de continuar.'); return; }
      setLoading(true); setDraft(null); setSaved(null);
      try {
        const { data, error } = await window.SB.functions.invoke('content-draft', { body: { destino: brief.destino, tema: brief.tema, notas: brief.notas, num_slides: brief.num_slides } });
        if (error) throw new Error(error.message);
        if (!data || !data.ok) throw new Error((data && data.error) || 'Error al generar');
        setDraft(data.draft);
        setCaption(data.draft.caption || '');
        setHashtags((data.draft.hashtags || []).join(' '));
      } catch (er) { toast('Error: ' + er.message); }
      finally { setLoading(false); }
    }

    async function save(status) {
      if (!draft) return;
      setSaving(true);
      try {
        const p_data = { tipo: 'carousel_feed', destino: brief.destino, titulo: draft.titulo || brief.tema.slice(0, 60), brief: brief.tema + (brief.notas ? ' · ' + brief.notas : ''), slides: draft.slides, caption: caption, hashtags: hashtags.split(/[\s,]+/).filter(Boolean), status: status };
        const { data, error } = await window.SB.rpc('editorial_content_save', { p_data });
        if (error) throw new Error(error.message);
        setSaved({ status: status, id: data && data.id });
        toast(status === 'copy_approved' ? 'Copy aprobado — ya aparece en el Calendario' : 'Borrador guardado');
        if (status === 'copy_approved') { setBrief({ destino: '', tema: '', notas: '', num_slides: 4 }); setDraft(null); }
      } catch (er) { toast('Error al guardar: ' + er.message); }
      finally { setSaving(false); }
    }

    return e('div', { style: { maxWidth: 720 } },
      e('div', { className: 'card pad' },
        e('div', { className: 'card-head', style: { marginBottom: 18 } },
          e('div', { className: 'card-title' }, 'Máquina de guiones'),
          e('div', { className: 'card-sub' }, 'Complete el brief y el sistema genera el copy en el tono editorial B&A.')),
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
          e('div', null, e(Lbl, { t: 'Destino' }), e(Inp, { v: brief.destino, onChange: v => upd('destino', v), placeholder: 'Ej: Engadín, Suiza' })),
          e('div', null, e(Lbl, { t: 'Slides' }), e('select', { value: brief.num_slides, onChange: ev => upd('num_slides', parseInt(ev.target.value)), style: { width: '100%', padding: '9px 12px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)', fontSize: 13 } }, [2, 3, 4, 5, 6].map(n => e('option', { key: n, value: n }, n + ' slides'))))),
        e(Sp, { h: 12 }),
        e(Lbl, { t: 'Tema o ángulo del carrusel' }),
        e(Cap, { v: brief.tema, onChange: v => upd('tema', v), rows: 3 }),
        e('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 } }, 'Ej: Zuoz vs St. Moritz — el silencio que los insiders eligen · diciembre 2026'),
        e(Sp, { h: 12 }),
        e(Lbl, { t: 'Notas adicionales (opcional)' }),
        e(Cap, { v: brief.notas, onChange: v => upd('notas', v), rows: 2 }),
        e('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 } }, 'Cupos, fechas, accesos, tono específico, CTA deseado.'),
        e(Sp, { h: 16 }),
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          e('button', { className: 'btn primary', onClick: generate, disabled: loading || !brief.destino.trim() || !brief.tema.trim(), style: { display: 'flex', alignItems: 'center', gap: 8 } },
            loading ? e('span', { className: 'mono', style: { fontSize: 11 } }, 'Generando copy…') : [e(Icon, { key: 'i', name: 'spark' }), 'Generar copy']),
          saved && e('span', { style: { fontSize: 12, color: 'var(--text-3)' } }, saved.status === 'copy_approved' ? '✓ Copy aprobado' : '✓ Borrador guardado'))),

      draft && [
        e(Sp, { key: 's1', h: 20 }),
        e('div', { key: 'slides' }, e('div', { className: 'eyebrow', style: { marginBottom: 12 } }, 'COPY GENERADO · ' + (draft.slides || []).length + ' SLIDES'), (draft.slides || []).map((s, i) => e(SlideCard, { key: i, slide: s, idx: i }))),
        e(Sp, { key: 's2', h: 12 }),
        e('div', { key: 'cap', className: 'card pad' },
          e(Lbl, { t: 'Caption Instagram' }), e(Cap, { v: caption, onChange: setCaption, rows: 5 }),
          e(Sp, { h: 12 }), e(Lbl, { t: 'Hashtags (separados por espacio)' }), e(Cap, { v: hashtags, onChange: setHashtags, rows: 2 }),
          e(Sp, { h: 16 }),
          e('div', { style: { display: 'flex', gap: 10 } },
            e('button', { className: 'btn primary', onClick: () => save('copy_approved'), disabled: saving }, saving ? 'Guardando…' : [e(Icon, { key: 'i', name: 'check' }), 'Aprobar copy']),
            e('button', { className: 'btn', onClick: () => save('draft'), disabled: saving }, 'Guardar borrador'),
            e('button', { className: 'btn', onClick: () => { setDraft(null); setSaved(null); } }, 'Descartar')),
          e(Sp, { h: 6 }),
          e('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, 'El siguiente paso, tras aprobar el copy, es armar el carrusel con las fotos en el Calendario.'))
      ]
    );
  }

  // ============ BIBLIOTECA DE FOTOS ============
  function BibliotecaFotos({ toast }) {
    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadCount, setUploadCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [destino, setDestino] = useState('');
    const [filterDestino, setFilterDestino] = useState('');
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { load(); }, []);
    async function load(d) {
      setLoadingAssets(true);
      try {
        const { data, error } = await window.SB.rpc('editorial_assets_list', { p_destino: d || filterDestino || null });
        if (error) throw new Error(error.message);
        setAssets(asArr(data));
      } catch (er) { toast('Error al cargar la biblioteca: ' + er.message); }
      finally { setLoadingAssets(false); }
    }

    function isImg(f) { return f.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|heic|heif|avif)$/i.test(f.name); }

    async function handleFiles(files) {
      const arr = Array.from(files).filter(isImg);
      if (!arr.length) { toast('Solo se aceptan imágenes (JPG, PNG, WEBP, AVIF, HEIC).'); return; }
      if (!destino.trim()) { toast('Indique el destino de las fotos antes de subir.'); return; }
      setUploading(true); setTotal(arr.length); setUploadCount(0);
      let ok = 0;
      for (const file of arr) {
        const slug = destino.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        const fname = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = slug + '/' + Date.now() + '_' + Math.random().toString(36).slice(2, 7) + '_' + fname;
        try {
          const { error: upErr } = await window.SB.storage.from('editorial-assets').upload(path, file, { upsert: false, contentType: file.type || 'image/jpeg' });
          if (upErr) { toast('Error subiendo ' + file.name + ': ' + upErr.message); setUploadCount(c => c + 1); continue; }
          const { data: signed } = await window.SB.storage.from('editorial-assets').createSignedUrl(path, 86400 * 30);
          await window.SB.rpc('editorial_asset_register', { p_data: { storage_path: path, filename: file.name, destino_tag: destino.trim(), size_bytes: file.size, url: (signed && signed.signedUrl) || '' } });
          ok++;
        } catch (er) { toast('Error: ' + er.message); }
        setUploadCount(c => c + 1);
      }
      setUploading(false);
      toast(ok + ' de ' + arr.length + ' foto(s) subidas correctamente.');
      load();
    }

    function onDrop(ev) { ev.preventDefault(); setDragging(false); handleFiles(ev.dataTransfer.files); }
    function onDragOver(ev) { ev.preventDefault(); setDragging(true); }
    function onDragLeave() { setDragging(false); }
    const destinos = [...new Set(assets.map(a => a.destino_tag).filter(Boolean))].sort();

    return e('div', null,
      e('div', { className: 'card pad', style: { maxWidth: 680 } },
        e('div', { className: 'card-head', style: { marginBottom: 14 } },
          e('div', { className: 'card-title' }, 'Biblioteca de fotos'),
          e('div', { className: 'card-sub' }, 'Cargue el material en batch. Las fotos quedan disponibles para armar los carruseles.')),
        e('div', { style: { marginBottom: 12 } }, e(Lbl, { t: 'Destino de este batch (obligatorio)' }), e(Inp, { v: destino, onChange: setDestino, placeholder: 'Ej: Engadín, Namibia, Piemonte...' })),
        e('div', {
          onClick: () => !uploading && inputRef.current && inputRef.current.click(), onDrop: onDrop, onDragOver: onDragOver, onDragLeave: onDragLeave,
          style: { border: '2px dashed ' + (dragging ? 'var(--accent)' : 'var(--rule)'), borderRadius: 12, padding: '32px 24px', textAlign: 'center', cursor: uploading ? 'default' : 'pointer', background: dragging ? 'var(--go-bg)' : 'var(--surface)', transition: 'all .15s' }
        },
          e('input', { ref: inputRef, type: 'file', multiple: true, accept: 'image/*,.heic,.heif,.avif', style: { display: 'none' }, onChange: ev => handleFiles(ev.target.files) }),
          uploading
            ? e('div', null, e('div', { style: { fontWeight: 600, marginBottom: 6 } }, 'Subiendo ' + uploadCount + ' de ' + total + '…'), e('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'No cierre esta pestaña.'))
            : e('div', null,
                e(Icon, { name: 'layers', style: { width: 28, height: 28, color: 'var(--text-3)', marginBottom: 8 } }),
                e('div', { style: { fontWeight: 600, marginBottom: 4 } }, 'Arrastre las fotos aquí o haga clic para seleccionar'),
                e('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'JPG, PNG, WEBP, AVIF, HEIC · hasta 50 MB por foto · sin límite de cantidad')))),

      e(Sp, { h: 20 }),
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' } },
        e('div', { className: 'eyebrow' }, assets.length + ' FOTOS'),
        e('button', { className: 'btn sm' + (!filterDestino ? ' primary' : ''), onClick: () => { setFilterDestino(''); load(''); } }, 'Todas'),
        destinos.map(d => e('button', { key: d, className: 'btn sm' + (filterDestino === d ? ' primary' : ''), onClick: () => { setFilterDestino(d); load(d); } }, d))),

      loadingAssets
        ? e('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Cargando biblioteca…')
        : assets.length === 0
          ? e('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, e('div', { style: { fontSize: 14, marginBottom: 6 } }, 'La biblioteca está vacía.'), e('div', { style: { fontSize: 12 } }, 'Suba las fotos de Engadín para empezar.'))
          : e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 } },
              assets.map(a => e('div', { key: a.id, style: { borderRadius: 10, overflow: 'hidden', background: 'var(--surface-2)', border: '1px solid var(--rule)' } },
                a.url ? e('img', { src: a.url, alt: a.filename, style: { width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }, loading: 'lazy' }) : e('div', { style: { aspectRatio: '4/5', background: 'var(--surface-sunk)', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, e(Icon, { name: 'layers' })),
                e('div', { style: { padding: '6px 8px' } }, e('div', { style: { fontSize: 10, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, a.filename), a.destino_tag && e('span', { className: 'tag', style: { fontSize: 9, marginTop: 3 } }, a.destino_tag)))))
    );
  }

  // ============ EDITOR DE CARRUSEL (preview + fotos + export) ============
  const TEMAS = [['alpine-dark', 'Alpine'], ['noir-city', 'Noir'], ['warm-editorial', 'Cálido']];

  function EditorCarrusel({ pieza, onClose, onSaved, toast }) {
    const slides = pieza.slides || [];
    const [tema, setTema] = useState(pieza.tema_visual || 'alpine-dark');
    const [assigns, setAssigns] = useState({});      // idx -> { id, url(dataURL) }
    const [assets, setAssets] = useState([]);
    const [loadingA, setLoadingA] = useState(false);
    const [pickerFor, setPickerFor] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [busyPhoto, setBusyPhoto] = useState(false);
    const slideRefs = useRef([]);

    useEffect(() => { loadAssets(); }, []);
    async function loadAssets() {
      setLoadingA(true);
      try {
        // primero las del destino, si no hay trae todas
        let r = await window.SB.rpc('editorial_assets_list', { p_destino: pieza.destino || null });
        let arr = asArr(r.data);
        if (!arr.length) { r = await window.SB.rpc('editorial_assets_list', { p_destino: null }); arr = asArr(r.data); }
        setAssets(arr);
        // pre-cargar fotos ya asignadas a cada slide (carrusel reabierto)
        const init = {};
        slides.forEach((s, i) => {
          if (s && s.asset_id) {
            const a = arr.find(x => x.id === s.asset_id);
            if (a && a.url) init[i] = { id: a.id, url: a.url };
          }
        });
        if (Object.keys(init).length) setAssigns(prev => (Object.keys(prev).length ? prev : init));
      } catch (er) { toast('Error al cargar fotos: ' + er.message); }
      finally { setLoadingA(false); }
    }

    async function pickPhoto(idx, asset) {
      setBusyPhoto(true);
      let url = asset.url;
      try {
        const resp = await fetch(asset.url);
        const blob = await resp.blob();
        url = await new Promise(res => { const rd = new FileReader(); rd.onload = () => res(rd.result); rd.readAsDataURL(blob); });
      } catch (er) { /* fallback a signed url */ }
      setAssigns(a => ({ ...a, [idx]: { id: asset.id, url: url } }));
      setBusyPhoto(false); setPickerFor(null);
    }

    async function exportAll() {
      if (!window.htmlToImage) { toast('Falta la librería de exportación.'); return; }
      setExporting(true);
      try {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        await new Promise(r => setTimeout(r, 400));
        for (let i = 0; i < slides.length; i++) {
          const node = slideRefs.current[i];
          if (!node) continue;
          const dataUrl = await window.htmlToImage.toPng(node, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true, style: { transform: 'none', transformOrigin: 'top left' } });
          const a = document.createElement('a');
          const base = (pieza.destino || 'carrusel').toLowerCase().replace(/[^a-z0-9]/g, '_');
          a.href = dataUrl; a.download = base + '_slide' + (i + 1) + '.png'; document.body.appendChild(a); a.click(); a.remove();
          await new Promise(r => setTimeout(r, 350));
        }
        toast('PNGs exportados (' + slides.length + ' slides)');
      } catch (er) { toast('Error al exportar: ' + er.message); }
      finally { setExporting(false); }
    }

    async function saveCarrusel() {
      try {
        const asset_ids = slides.map((_, i) => assigns[i] && assigns[i].id).filter(Boolean);
        const enriched = slides.map((s, i) => Object.assign({}, s, { asset_id: assigns[i] ? assigns[i].id : null }));
        const { error } = await window.SB.rpc('editorial_content_save', { p_data: { id: pieza.id, status: 'rendered', asset_ids: asset_ids, slides: enriched, tema_visual: tema } });
        if (error) throw new Error(error.message);
        toast('Carrusel armado y guardado');
        onSaved && onSaved();
      } catch (er) { toast('Error al guardar: ' + er.message); }
    }

    const assignedCount = slides.filter((_, i) => assigns[i]).length;

    return e('div', { style: { position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(20,18,15,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowY: 'auto', padding: '24px 16px' } },
      e('div', { className: 'card', style: { maxWidth: 1080, width: '100%', background: 'var(--bg)', padding: 0 } },
        // header
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 } },
          e('div', { style: { flex: 1 } },
            e('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 18 } }, 'Armar carrusel'),
            e('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, (pieza.titulo || pieza.destino || '') + ' · ' + assignedCount + ' de ' + slides.length + ' slides con foto')),
          e('button', { className: 'btn sm', onClick: onClose }, 'Cerrar')),

        e('div', { style: { padding: '18px 20px' } },
          // tema selector
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 } },
            e('span', { className: 'eyebrow' }, 'TEMA VISUAL'),
            TEMAS.map(t => e('button', { key: t[0], className: 'btn sm' + (tema === t[0] ? ' primary' : ''), onClick: () => setTema(t[0]) }, t[1]))),

          // slides grid
          e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 } },
            slides.map((s, i) => e('div', { key: i, style: { display: 'flex', flexDirection: 'column', gap: 10 } },
              e('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, e('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)' } }, '0' + (i + 1)), e(SlideBadge, { layout: s.layout })),
              e(SlidePreview, { slide: s, photoUrl: assigns[i] && assigns[i].url, tema: tema, format: 'feed', scale: 0.30, slideRef: el => { slideRefs.current[i] = el; } }),
              e('button', { className: 'btn sm' + (assigns[i] ? '' : ' primary'), onClick: () => setPickerFor(i), style: { width: 324 } }, assigns[i] ? 'Cambiar foto' : 'Elegir foto')))),

          e(Sp, { h: 22 }),
          // acciones
          e('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap', borderTop: '1px solid var(--rule)', paddingTop: 18 } },
            e('button', { className: 'btn primary', onClick: exportAll, disabled: exporting || assignedCount === 0 }, exporting ? 'Exportando…' : [e(Icon, { key: 'i', name: 'eye' }), 'Exportar PNGs']),
            e('button', { className: 'btn', onClick: saveCarrusel, disabled: assignedCount === 0 }, 'Guardar carrusel'),
            assignedCount === 0 && e('span', { style: { fontSize: 12, color: 'var(--text-3)', alignSelf: 'center' } }, 'Asigná una foto a cada slide para exportar.'))
        ),

        // picker de fotos
        pickerFor !== null && e('div', { style: { position: 'fixed', inset: 0, zIndex: 210, background: 'rgba(20,18,15,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowY: 'auto', padding: '24px 16px' } },
          e('div', { className: 'card', style: { maxWidth: 720, width: '100%', background: 'var(--bg)' } },
            e('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--rule)' } },
              e('div', { style: { flex: 1, fontWeight: 600 } }, 'Elegí la foto para el slide ' + (pickerFor + 1)),
              busyPhoto && e('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)' } }, 'Procesando…'),
              e('button', { className: 'btn sm', onClick: () => setPickerFor(null) }, 'Cancelar')),
            e('div', { style: { padding: 16 } },
              loadingA
                ? e('div', { style: { textAlign: 'center', color: 'var(--text-3)', padding: 20 } }, 'Cargando fotos…')
                : assets.length === 0
                  ? e('div', { style: { textAlign: 'center', color: 'var(--text-3)', padding: 20 } }, 'No hay fotos en la biblioteca. Subilas primero en la tab Fotos.')
                  : e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 } },
                      assets.map(a => e('div', { key: a.id, onClick: () => !busyPhoto && pickPhoto(pickerFor, a), style: { borderRadius: 8, overflow: 'hidden', cursor: busyPhoto ? 'default' : 'pointer', border: '1px solid var(--rule)', opacity: busyPhoto ? 0.6 : 1 } },
                        a.url ? e('img', { src: a.url, alt: a.filename, style: { width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }, loading: 'lazy' }) : e('div', { style: { aspectRatio: '4/5', background: 'var(--surface-sunk)' } })))))
          ))
      )
    );
  }

  // ============ EDITOR DE COPY (corregir texto de los slides) ============
  function FieldRow({ label, children }) {
    return e('div', { style: { marginBottom: 9 } },
      e('div', { className: 'eyebrow', style: { marginBottom: 4 } }, label),
      children);
  }
  function MiniInp({ v, onChange, mono }) {
    return e('input', { type: 'text', value: v || '', onChange: ev => onChange(ev.target.value),
      style: { width: '100%', fontSize: 12.5, padding: '7px 10px', border: '1px solid var(--rule)', borderRadius: 7, background: 'var(--surface)', color: 'var(--text-1)', fontFamily: mono ? 'var(--ff-display)' : 'var(--ff-body)' } });
  }

  function EditorCopy({ pieza, onClose, onSaved, toast }) {
    const [titulo, setTitulo] = useState(pieza.titulo || '');
    const [slides, setSlides] = useState(JSON.parse(JSON.stringify(pieza.slides || [])));
    const [caption, setCaption] = useState(pieza.caption || '');
    const [hashtags, setHashtags] = useState((pieza.hashtags || []).join(' '));
    const [saving, setSaving] = useState(false);

    function updF(idx, field, val) { setSlides(s => s.map((sl, i) => i === idx ? Object.assign({}, sl, { [field]: val }) : sl)); }
    function updMeta(idx, mi, val) { setSlides(s => s.map((sl, i) => { if (i !== idx) return sl; const meta = (sl.meta || []).slice(); meta[mi] = val; return Object.assign({}, sl, { meta }); })); }
    function updDet(idx, di, field, val) { setSlides(s => s.map((sl, i) => { if (i !== idx) return sl; const details = (sl.details || []).map((d, j) => j === di ? Object.assign({}, d, { [field]: val }) : d); return Object.assign({}, sl, { details }); })); }
    function updNest(idx, parent, field, val) { setSlides(s => s.map((sl, i) => i === idx ? Object.assign({}, sl, { [parent]: Object.assign({}, sl[parent] || {}, { [field]: val }) }) : sl)); }

    async function save() {
      setSaving(true);
      try {
        const { error } = await window.SB.rpc('editorial_content_save', { p_data: { id: pieza.id, titulo: titulo, slides: slides, caption: caption, hashtags: hashtags.split(/[\s,]+/).filter(Boolean) } });
        if (error) throw new Error(error.message);
        toast('Copy actualizado');
        onSaved && onSaved();
      } catch (er) { toast('Error al guardar: ' + er.message); }
      finally { setSaving(false); }
    }

    function slideFields(s, i) {
      const rows = [];
      if ('kicker' in s) rows.push(e(FieldRow, { key: 'k', label: 'Kicker' }, e(MiniInp, { v: s.kicker, onChange: v => updF(i, 'kicker', v) })));
      if ('script_text' in s) rows.push(e(FieldRow, { key: 'sc', label: 'Script (caligráfico)' }, e(MiniInp, { v: s.script_text, onChange: v => updF(i, 'script_text', v) })));
      if ('main' in s) rows.push(e(FieldRow, { key: 'm', label: 'Display (título grande)' }, e(MiniInp, { v: s.main, onChange: v => updF(i, 'main', v), mono: true })));
      if ('body' in s) rows.push(e(FieldRow, { key: 'b', label: 'Body' }, e(Cap, { v: s.body || '', onChange: v => updF(i, 'body', v), rows: 3 })));
      if ('question' in s) rows.push(e(FieldRow, { key: 'q', label: 'Pregunta' }, e(Cap, { v: s.question || '', onChange: v => updF(i, 'question', v), rows: 2 })));
      if (Array.isArray(s.meta)) rows.push(e(FieldRow, { key: 'mt', label: 'Etiquetas' },
        e('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, s.meta.map((m, mi) => e(MiniInp, { key: mi, v: m, onChange: v => updMeta(i, mi, v) })))));
      if (Array.isArray(s.details)) rows.push(e(FieldRow, { key: 'dt', label: 'Datos' },
        e('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, s.details.map((d, di) => e('div', { key: di, style: { display: 'flex', gap: 6 } },
          e('div', { style: { width: 120 } }, e(MiniInp, { v: d.label, onChange: v => updDet(i, di, 'label', v) })),
          e('div', { style: { flex: 1 } }, e(MiniInp, { v: d.value, onChange: v => updDet(i, di, 'value', v) })))))));
      if (s.left) rows.push(e(FieldRow, { key: 'l', label: 'Panel izquierdo' },
        e('div', { style: { display: 'flex', gap: 6 } },
          e('div', { style: { width: 120 } }, e(MiniInp, { v: s.left.label, onChange: v => updNest(i, 'left', 'label', v) })),
          e('div', { style: { flex: 1 } }, e(MiniInp, { v: s.left.text, onChange: v => updNest(i, 'left', 'text', v) })))));
      if (s.right) rows.push(e(FieldRow, { key: 'r', label: 'Panel derecho' },
        e('div', { style: { display: 'flex', gap: 6 } },
          e('div', { style: { width: 120 } }, e(MiniInp, { v: s.right.label, onChange: v => updNest(i, 'right', 'label', v) })),
          e('div', { style: { flex: 1 } }, e(MiniInp, { v: s.right.text, onChange: v => updNest(i, 'right', 'text', v) })))));
      if (s.cta) rows.push(e(FieldRow, { key: 'c', label: 'Llamado a la acción' },
        e('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
          e(MiniInp, { v: s.cta.headline, onChange: v => updNest(i, 'cta', 'headline', v), mono: true }),
          e(MiniInp, { v: s.cta.text, onChange: v => updNest(i, 'cta', 'text', v) }))));
      return rows;
    }

    return e('div', { style: { position: 'fixed', inset: 0, zIndex: 205, background: 'rgba(20,18,15,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowY: 'auto', padding: '24px 16px' } },
      e('div', { className: 'card', style: { maxWidth: 720, width: '100%', background: 'var(--bg)', padding: 0 } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 } },
          e('div', { style: { flex: 1 } },
            e('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 18 } }, 'Editar copy'),
            e('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, pieza.destino || '')),
          e('button', { className: 'btn sm', onClick: onClose }, 'Cancelar')),

        e('div', { style: { padding: '18px 20px' } },
          e(FieldRow, { label: 'Título (interno)' }, e(MiniInp, { v: titulo, onChange: setTitulo })),
          e(Sp, { h: 8 }),
          slides.map((s, i) => e('div', { key: i, className: 'card', style: { marginBottom: 14, padding: '14px 16px' } },
            e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 } },
              e('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)' } }, '0' + (i + 1)),
              e(SlideBadge, { layout: s.layout })),
            slideFields(s, i))),
          e('div', { className: 'card', style: { padding: '14px 16px', marginBottom: 14 } },
            e(FieldRow, { label: 'Caption Instagram' }, e(Cap, { v: caption, onChange: setCaption, rows: 5 })),
            e(FieldRow, { label: 'Hashtags' }, e(Cap, { v: hashtags, onChange: setHashtags, rows: 2 }))),
          e('div', { style: { display: 'flex', gap: 10, borderTop: '1px solid var(--rule)', paddingTop: 16 } },
            e('button', { className: 'btn primary', onClick: save, disabled: saving }, saving ? 'Guardando…' : [e(Icon, { key: 'i', name: 'check' }), 'Guardar cambios']),
            e('button', { className: 'btn', onClick: onClose }, 'Cancelar'))
        )
      )
    );
  }

  // ============ CALENDARIO DE CONTENIDO ============
  function CalendarioContenido({ toast }) {
    const [pieces, setPieces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openId, setOpenId] = useState(null);
    const [scheduling, setScheduling] = useState({});
    const [editorPieza, setEditorPieza] = useState(null);
    const [editorCopyPieza, setEditorCopyPieza] = useState(null);

    useEffect(() => { load(); }, []);
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await window.SB.rpc('editorial_content_list');
        if (error) throw new Error(error.message);
        setPieces(asArr(data).filter(p => p.status !== 'deleted'));
      } catch (er) { toast('Error: ' + er.message); }
      finally { setLoading(false); }
    }
    async function setDate(id, dateVal) {
      try {
        const { error } = await window.SB.rpc('editorial_content_save', { p_data: { id: id, status: 'scheduled', scheduled_at: dateVal ? new Date(dateVal).toISOString() : null } });
        if (error) throw new Error(error.message);
        setScheduling(s => ({ ...s, [id]: undefined })); toast('Fecha programada'); load();
      } catch (er) { toast('Error: ' + er.message); }
    }
    async function changeStatus(id, status) {
      try {
        const { error } = await window.SB.rpc('editorial_content_save', { p_data: { id: id, status: status } });
        if (error) throw new Error(error.message);
        toast(status === 'deleted' ? 'Pieza eliminada' : statusLabel(status)); load();
      } catch (er) { toast('Error: ' + er.message); }
    }

    const grouped = {};
    ['scheduled', 'rendered', 'assets_selected', 'copy_approved', 'draft', 'published'].forEach(s => { grouped[s] = pieces.filter(p => p.status === s); });
    const sections = [
      { status: 'scheduled', label: 'Programado' },
      { status: 'rendered', label: 'Carrusel armado — listo para programar' },
      { status: 'copy_approved', label: 'Copy aprobado — armar carrusel' },
      { status: 'assets_selected', label: 'Fotos elegidas' },
      { status: 'draft', label: 'Borradores' },
      { status: 'published', label: 'Publicado' },
    ].filter(s => (grouped[s.status] || []).length > 0);

    if (loading) return e('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Cargando…');
    if (pieces.length === 0) return e('div', { className: 'card pad' }, e('div', { style: { textAlign: 'center', color: 'var(--text-3)', padding: '20px 0' } }, e('div', { style: { marginBottom: 8, fontWeight: 600 } }, 'Sin piezas todavía.'), e('div', { style: { fontSize: 12 } }, 'Genere el primer carrusel en "Nueva pieza".')));

    return e('div', null,
      editorPieza && e(EditorCarrusel, { pieza: editorPieza, onClose: () => setEditorPieza(null), onSaved: () => { setEditorPieza(null); load(); }, toast: toast }),
      editorCopyPieza && e(EditorCopy, { pieza: editorCopyPieza, onClose: () => setEditorCopyPieza(null), onSaved: () => { setEditorCopyPieza(null); load(); }, toast: toast }),
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 } },
        e('div', { className: 'eyebrow' }, pieces.length + ' PIEZAS'),
        e('button', { className: 'btn sm', onClick: load }, e(Icon, { name: 'refresh' }))),

      sections.map(sec => e('div', { key: sec.status, style: { marginBottom: 24 } },
        e('div', { className: 'eyebrow', style: { marginBottom: 10 } }, sec.label.toUpperCase()),
        grouped[sec.status].map(p => e('div', { key: p.id, className: 'card', style: { marginBottom: 10, border: openId === p.id ? '1.5px solid var(--accent)' : undefined } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer' }, onClick: () => setOpenId(id => id === p.id ? null : p.id) },
            e('div', { style: { flex: 1, minWidth: 0 } },
              e('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 15, color: 'var(--text-1)', marginBottom: 2 } }, p.titulo || p.destino || 'Sin título'),
              e('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, (p.destino || '') + (p.scheduled_at ? ' · ' + fDate(p.scheduled_at) : '') + (Array.isArray(p.slides) ? ' · ' + p.slides.length + ' slides' : ''))),
            e('div', { className: 'badge ' + statusCls(p.status), style: { fontSize: 10, padding: '2px 8px' } }, statusLabel(p.status)),
            e(Icon, { name: openId === p.id ? 'chevron-up' : 'chevron-down' })),

          openId === p.id && e('div', { style: { padding: '0 16px 16px', borderTop: '1px solid var(--rule)' } },
            e(Sp, { h: 12 }),
            // botón armar carrusel (destacado para copy_approved / assets_selected / rendered)
            Array.isArray(p.slides) && p.slides.length > 0 && e('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 } },
              e('button', { className: 'btn primary', onClick: () => setEditorPieza(p), style: { display: 'flex', alignItems: 'center', gap: 8 } }, e(Icon, { name: 'layers' }), p.status === 'rendered' ? 'Editar carrusel' : 'Armar carrusel con fotos'),
              e('button', { className: 'btn', onClick: () => setEditorCopyPieza(p), style: { display: 'flex', alignItems: 'center', gap: 8 } }, e(Icon, { name: 'list' }), 'Editar copy')),

            p.caption && [e('div', { key: 'cl', className: 'eyebrow', style: { marginBottom: 4 } }, 'CAPTION'), e('div', { key: 'cv', style: { fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10, whiteSpace: 'pre-wrap' } }, p.caption)],
            Array.isArray(p.hashtags) && p.hashtags.length > 0 && e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 } }, p.hashtags.map((h, i) => e('span', { key: i, className: 'tag', style: { fontSize: 10 } }, h))),

            // programar
            p.status !== 'published' && e('div', { style: { marginBottom: 12 } },
              e('div', { className: 'eyebrow', style: { marginBottom: 6 } }, 'PROGRAMAR PUBLICACIÓN'),
              e('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
                e('input', { type: 'datetime-local', defaultValue: p.scheduled_at ? p.scheduled_at.slice(0, 16) : '', onChange: ev => setScheduling(s => ({ ...s, [p.id]: ev.target.value })), style: { fontSize: 12, padding: '7px 10px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)' } }),
                e('button', { className: 'btn sm primary', onClick: () => setDate(p.id, scheduling[p.id] || (p.scheduled_at ? p.scheduled_at.slice(0, 16) : null)), disabled: !scheduling[p.id] && !p.scheduled_at }, 'Programar'))),

            // acciones de estado
            e('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
              p.status !== 'published' && e('button', { className: 'btn sm', onClick: () => changeStatus(p.id, 'published') }, 'Marcar publicada'),
              e('button', { className: 'btn sm', style: { color: 'var(--bad)' }, onClick: () => { if (confirm('¿Eliminar esta pieza?')) changeStatus(p.id, 'deleted'); } }, 'Eliminar')))
        )))
      )
    );
  }

  window.NuevaPieza = NuevaPieza;
  window.BibliotecaFotos = BibliotecaFotos;
  window.CalendarioContenido = CalendarioContenido;
  window.SlidePreview = SlidePreview;
  window.EditorCarrusel = EditorCarrusel;
})();
