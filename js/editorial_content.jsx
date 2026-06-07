// ============ SISTEMA DE CONTENIDO B&A ============
// NuevaPieza (máquina de guiones), BibliotecaFotos, CalendarioContenido
(function () {
  const { useState, useEffect, useRef } = React;

  // ---- helpers ----
  function Sp({ h = 16 }) { return React.createElement('div', { style: { height: h } }); }
  function Lbl({ t }) { return React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, t); }
  function Cap({ v, onChange, rows }) {
    return React.createElement('textarea', {
      value: v, rows: rows || 3, onChange: e => onChange(e.target.value),
      style: { width: '100%', resize: 'vertical', fontSize: 13, fontFamily: 'var(--ff-body)', padding: '10px 12px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)', lineHeight: 1.55 }
    });
  }
  function Inp({ v, onChange, placeholder }) {
    return React.createElement('input', {
      type: 'text', value: v, placeholder: placeholder || '', onChange: e => onChange(e.target.value),
      style: { width: '100%', fontSize: 13, padding: '9px 12px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)' }
    });
  }
  function statusLabel(s) {
    const m = { draft: 'Borrador', copy_approved: 'Copy aprobado', assets_selected: 'Fotos elegidas', rendered: 'Renderizado', scheduled: 'Programado', published: 'Publicado' };
    return m[s] || s;
  }
  function statusCls(s) {
    if (s === 'published' || s === 'scheduled') return 'go';
    if (s === 'copy_approved' || s === 'assets_selected' || s === 'rendered') return 'risk';
    return '';
  }
  function fDate(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; }
  }
  function SlideBadge({ layout }) {
    const m = { 'destination-editorial': 'Destino', 'activity-specific': 'Actividad', 'comparison': 'Comparación', 'final-cta': 'CTA', 'story-cover': 'Story' };
    return React.createElement('span', { className: 'tag', style: { fontSize: 10 } }, m[layout] || layout);
  }

  // ---- SlideCard: muestra un slide del draft ----
  function SlideCard({ slide, idx }) {
    const [open, setOpen] = useState(idx === 0);
    const l = slide.layout || '';
    return React.createElement('div', { className: 'card', style: { marginBottom: 10 } },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer' },
        onClick: () => setOpen(o => !o)
      },
        React.createElement('span', { className: 'mono', style: { color: 'var(--text-3)', fontSize: 11 } }, '0' + (idx + 1)),
        React.createElement(SlideBadge, { layout: l }),
        slide.main && React.createElement('span', { style: { fontFamily: 'var(--ff-display)', fontSize: 15, color: 'var(--text-1)', flex: 1 } }, slide.main),
        React.createElement(Icon, { name: open ? 'chevron-up' : 'chevron-down' })
      ),
      open && React.createElement('div', { style: { padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 } },
        slide.kicker && React.createElement('div', null, React.createElement('span', { className: 'eyebrow' }, 'KICKER  '), React.createElement('span', { style: { fontSize: 12, color: 'var(--text-2)' } }, slide.kicker)),
        slide.script_text && React.createElement('div', null, React.createElement('span', { className: 'eyebrow' }, 'SCRIPT  '), React.createElement('span', { style: { fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' } }, slide.script_text)),
        slide.main && React.createElement('div', null, React.createElement('span', { className: 'eyebrow' }, 'DISPLAY  '), React.createElement('span', { style: { fontSize: 13, fontFamily: 'var(--ff-display)', color: 'var(--text-1)', fontWeight: 600 } }, slide.main)),
        slide.body && React.createElement('div', null, React.createElement('span', { className: 'eyebrow' }, 'BODY  '), React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.55, fontStyle: 'italic' } }, slide.body)),
        slide.question && React.createElement('div', null, React.createElement('span', { className: 'eyebrow' }, 'PREGUNTA  '), React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-2)' } }, slide.question)),
        slide.left && React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement('div', { style: { flex: 1, padding: '8px 10px', border: '1px solid var(--rule)', borderRadius: 6 } },
            React.createElement('div', { style: { fontSize: 11, fontWeight: 700, marginBottom: 3 } }, slide.left.label),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' } }, slide.left.text)
          ),
          React.createElement('div', { style: { flex: 1, padding: '8px 10px', border: '1px solid var(--rule)', borderRadius: 6 } },
            React.createElement('div', { style: { fontSize: 11, fontWeight: 700, marginBottom: 3 } }, slide.right && slide.right.label),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' } }, slide.right && slide.right.text)
          )
        ),
        slide.cta && React.createElement('div', { style: { padding: '10px 12px', border: '1px solid var(--rule)', borderRadius: 6, background: 'var(--surface-2)' } },
          React.createElement('div', { style: { fontSize: 13, fontFamily: 'var(--ff-display)', marginBottom: 4 } }, slide.cta.headline),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--text-2)' } }, slide.cta.text)
        ),
        Array.isArray(slide.meta) && slide.meta.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
          slide.meta.map((m, i) => React.createElement('span', { key: i, className: 'tag', style: { fontSize: 10 } }, m))
        ),
        Array.isArray(slide.details) && slide.details.length > 0 && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          slide.details.map((d, i) => React.createElement('div', { key: i, style: { display: 'flex', gap: 8, fontSize: 12 } },
            React.createElement('span', { style: { color: 'var(--text-3)', minWidth: 70, textTransform: 'uppercase', fontSize: 10 } }, d.label),
            React.createElement('span', { style: { color: 'var(--text-1)' } }, d.value)
          ))
        )
      )
    );
  }

  // ---- NuevaPieza ----
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
      if (!brief.destino.trim() || !brief.tema.trim()) { toast('Completá el destino y el tema antes de generar.'); return; }
      setLoading(true); setDraft(null); setSaved(null);
      try {
        const { data, error } = await window.SB.functions.invoke('content-draft', {
          body: { destino: brief.destino, tema: brief.tema, notas: brief.notas, num_slides: brief.num_slides }
        });
        if (error) throw new Error(error.message);
        if (!data?.ok) throw new Error(data?.error || 'Error al generar');
        setDraft(data.draft);
        setCaption(data.draft.caption || '');
        setHashtags((data.draft.hashtags || []).join(' '));
      } catch (e) { toast('Error: ' + e.message); }
      finally { setLoading(false); }
    }

    async function save(status) {
      if (!draft) return;
      setSaving(true);
      try {
        const p_data = {
          tipo: 'carousel_feed',
          destino: brief.destino,
          titulo: draft.titulo || brief.tema.slice(0, 60),
          brief: brief.tema + (brief.notas ? ' · ' + brief.notas : ''),
          slides: draft.slides,
          caption: caption,
          hashtags: hashtags.split(/[\s,]+/).filter(Boolean),
          status: status
        };
        const { data, error } = await window.SB.rpc('editorial_content_save', { p_data });
        if (error) throw new Error(error.message);
        setSaved({ status, id: data?.id });
        toast(status === 'copy_approved' ? 'Copy aprobado — ya aparece en el Calendario' : 'Borrador guardado');
        if (status === 'copy_approved') { setBrief({ destino: '', tema: '', notas: '', num_slides: 4 }); setDraft(null); }
      } catch (e) { toast('Error al guardar: ' + e.message); }
      finally { setSaving(false); }
    }

    return React.createElement('div', { style: { maxWidth: 720 } },
      React.createElement('div', { className: 'card pad' },
        React.createElement('div', { className: 'card-head', style: { marginBottom: 18 } },
          React.createElement('div', { className: 'card-title' }, 'Máquina de guiones'),
          React.createElement('div', { className: 'card-sub' }, 'Describí la pieza y generá el copy editorial en el tono B&A.')
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
          React.createElement('div', null,
            React.createElement(Lbl, { t: 'Destino' }),
            React.createElement(Inp, { v: brief.destino, onChange: v => upd('destino', v), placeholder: 'Ej: Engadín, Suiza' })
          ),
          React.createElement('div', null,
            React.createElement(Lbl, { t: 'Slides' }),
            React.createElement('select', {
              value: brief.num_slides,
              onChange: e => upd('num_slides', parseInt(e.target.value)),
              style: { width: '100%', padding: '9px 12px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)', fontSize: 13 }
            },
              [2, 3, 4, 5, 6].map(n => React.createElement('option', { key: n, value: n }, n + ' slides'))
            )
          )
        ),
        React.createElement(Sp, { h: 12 }),
        React.createElement(Lbl, { t: 'Tema o ángulo del carrusel' }),
        React.createElement(Cap, { v: brief.tema, onChange: v => upd('tema', v), rows: 3 }),
        React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 } }, 'Ej: Zuoz vs St. Moritz — el silencio que los insiders eligen · diciembre 2026'),
        React.createElement(Sp, { h: 12 }),
        React.createElement(Lbl, { t: 'Notas adicionales (opcional)' }),
        React.createElement(Cap, { v: brief.notas, onChange: v => upd('notas', v), rows: 2 }),
        React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 } }, 'Cupos, fechas, accesos, tono específico, CTA deseado.'),
        React.createElement(Sp, { h: 16 }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('button', {
            className: 'btn primary', onClick: generate,
            disabled: loading || !brief.destino.trim() || !brief.tema.trim(),
            style: { display: 'flex', alignItems: 'center', gap: 8 }
          },
            loading
              ? React.createElement('span', { className: 'mono', style: { fontSize: 11 } }, 'Generando copy…')
              : [React.createElement(Icon, { key: 'i', name: 'spark' }), 'Generar copy']
          ),
          saved && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } },
            saved.status === 'copy_approved' ? '✓ Copy aprobado' : '✓ Borrador guardado'
          )
        )
      ),

      draft && [
        React.createElement(Sp, { key: 's1', h: 20 }),
        React.createElement('div', { key: 'slides' },
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 12 } }, 'COPY GENERADO · ' + (draft.slides || []).length + ' SLIDES'),
          (draft.slides || []).map((s, i) => React.createElement(SlideCard, { key: i, slide: s, idx: i }))
        ),
        React.createElement(Sp, { key: 's2', h: 12 }),
        React.createElement('div', { key: 'cap', className: 'card pad' },
          React.createElement(Lbl, { t: 'Caption Instagram' }),
          React.createElement(Cap, { v: caption, onChange: setCaption, rows: 5 }),
          React.createElement(Sp, { h: 12 }),
          React.createElement(Lbl, { t: 'Hashtags (separados por espacio)' }),
          React.createElement(Cap, { v: hashtags, onChange: setHashtags, rows: 2 }),
          React.createElement(Sp, { h: 16 }),
          React.createElement('div', { style: { display: 'flex', gap: 10 } },
            React.createElement('button', {
              className: 'btn primary', onClick: () => save('copy_approved'), disabled: saving
            }, saving ? 'Guardando…' : [React.createElement(Icon, { key: 'i', name: 'check' }), 'Aprobar copy']),
            React.createElement('button', {
              className: 'btn', onClick: () => save('draft'), disabled: saving
            }, 'Guardar borrador'),
            React.createElement('button', {
              className: 'btn', onClick: () => { setDraft(null); setSaved(null); }
            }, 'Descartar')
          ),
          React.createElement(Sp, { h: 6 }),
          React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } },
            'El siguiente paso después de aprobar el copy es seleccionar las fotos de la Biblioteca.'
          )
        )
      ]
    );
  }

  // ---- BibliotecaFotos ----
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
        const arr = Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []);
        setAssets(arr);
      } catch (e) { toast('Error al cargar biblioteca: ' + e.message); }
      finally { setLoadingAssets(false); }
    }

    async function handleFiles(files) {
      const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (!arr.length) { toast('Solo se aceptan imágenes (JPG, PNG, WEBP, HEIC).'); return; }
      if (!destino.trim()) { toast('Indicá el destino de las fotos antes de subir.'); return; }
      setUploading(true); setTotal(arr.length); setUploadCount(0);
      let ok = 0;
      for (const file of arr) {
        const slug = destino.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        const fname = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = slug + '/' + Date.now() + '_' + fname;
        try {
          const { error: upErr } = await window.SB.storage.from('editorial-assets').upload(path, file, { upsert: false, contentType: file.type });
          if (upErr) { toast('Error subiendo ' + file.name + ': ' + upErr.message); setUploadCount(c => c + 1); continue; }
          const { data: signed } = await window.SB.storage.from('editorial-assets').createSignedUrl(path, 86400 * 30);
          await window.SB.rpc('editorial_asset_register', {
            p_data: { storage_path: path, filename: file.name, destino_tag: destino.trim(), size_bytes: file.size, url: signed?.signedUrl || '' }
          });
          ok++;
        } catch (e) { toast('Error: ' + e.message); }
        setUploadCount(c => c + 1);
      }
      setUploading(false);
      toast(ok + ' de ' + arr.length + ' foto(s) subidas correctamente.');
      load();
    }

    function onDrop(e) { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }
    function onDragOver(e) { e.preventDefault(); setDragging(true); }
    function onDragLeave() { setDragging(false); }

    const destinos = [...new Set(assets.map(a => a.destino_tag).filter(Boolean))].sort();

    return React.createElement('div', null,
      React.createElement('div', { className: 'card pad', style: { maxWidth: 680 } },
        React.createElement('div', { className: 'card-head', style: { marginBottom: 14 } },
          React.createElement('div', { className: 'card-title' }, 'Biblioteca de fotos'),
          React.createElement('div', { className: 'card-sub' }, 'Subí tu material en batch. Las fotos quedan disponibles para armar los carruseles.')
        ),
        React.createElement('div', { style: { marginBottom: 12 } },
          React.createElement(Lbl, { t: 'Destino de este batch (obligatorio)' }),
          React.createElement(Inp, { v: destino, onChange: setDestino, placeholder: 'Ej: Engadín, Namibia, Piemonte...' })
        ),
        React.createElement('div', {
          onClick: () => !uploading && inputRef.current && inputRef.current.click(),
          onDrop, onDragOver, onDragLeave,
          style: {
            border: '2px dashed ' + (dragging ? 'var(--accent)' : 'var(--rule)'),
            borderRadius: 12, padding: '32px 24px', textAlign: 'center',
            cursor: uploading ? 'default' : 'pointer',
            background: dragging ? 'var(--go-bg)' : 'var(--surface)',
            transition: 'all .15s'
          }
        },
          React.createElement('input', { ref: inputRef, type: 'file', multiple: true, accept: 'image/*,.heic,.heif', style: { display: 'none' }, onChange: e => handleFiles(e.target.files) }),
          uploading
            ? React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: 600, marginBottom: 6 } }, 'Subiendo ' + uploadCount + ' de ' + total + '…'),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'No cierres esta pestaña.')
              )
            : React.createElement('div', null,
                React.createElement(Icon, { name: 'layers', style: { width: 28, height: 28, color: 'var(--text-3)', marginBottom: 8 } }),
                React.createElement('div', { style: { fontWeight: 600, marginBottom: 4 } }, 'Arrastrá las fotos acá o hacé clic para seleccionar'),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'JPG, PNG, WEBP, HEIC · hasta 50 MB por foto · sin límite de cantidad')
              )
        )
      ),

      React.createElement(Sp, { h: 20 }),

      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' } },
        React.createElement('div', { className: 'eyebrow' }, assets.length + ' FOTOS'),
        React.createElement('button', { className: 'btn sm' + (!filterDestino ? ' primary' : ''), onClick: () => { setFilterDestino(''); load(''); } }, 'Todas'),
        destinos.map(d => React.createElement('button', {
          key: d, className: 'btn sm' + (filterDestino === d ? ' primary' : ''),
          onClick: () => { setFilterDestino(d); load(d); }
        }, d))
      ),

      loadingAssets
        ? React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Cargando biblioteca…')
        : assets.length === 0
          ? React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } },
              React.createElement('div', { style: { fontSize: 14, marginBottom: 6 } }, 'La biblioteca está vacía.'),
              React.createElement('div', { style: { fontSize: 12 } }, 'Subí las fotos de Engadín para empezar.')
            )
          : React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 } },
              assets.map(a => React.createElement('div', {
                key: a.id,
                style: { borderRadius: 10, overflow: 'hidden', background: 'var(--surface-2)', border: '1px solid var(--rule)', position: 'relative' }
              },
                a.url
                  ? React.createElement('img', { src: a.url, alt: a.filename, style: { width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }, loading: 'lazy' })
                  : React.createElement('div', { style: { aspectRatio: '4/5', background: 'var(--surface-sunk)', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                      React.createElement(Icon, { name: 'layers' })
                    ),
                React.createElement('div', { style: { padding: '6px 8px' } },
                  React.createElement('div', { style: { fontSize: 10, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, a.filename),
                  a.destino_tag && React.createElement('span', { className: 'tag', style: { fontSize: 9, marginTop: 3 } }, a.destino_tag)
                )
              ))
            )
    );
  }

  // ---- CalendarioContenido ----
  function CalendarioContenido({ toast }) {
    const [pieces, setPieces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openId, setOpenId] = useState(null);
    const [scheduling, setScheduling] = useState({});

    useEffect(() => { load(); }, []);

    async function load() {
      setLoading(true);
      try {
        const { data, error } = await window.SB.rpc('editorial_content_list');
        if (error) throw new Error(error.message);
        const arr = Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []);
        setPieces(arr);
      } catch (e) { toast('Error: ' + e.message); }
      finally { setLoading(false); }
    }

    async function setDate(id, dateVal) {
      try {
        const { error } = await window.SB.rpc('editorial_content_save', {
          p_data: { id, status: 'scheduled', scheduled_at: dateVal ? new Date(dateVal).toISOString() : null }
        });
        if (error) throw new Error(error.message);
        setScheduling(s => ({ ...s, [id]: undefined }));
        toast('Fecha programada');
        load();
      } catch (e) { toast('Error: ' + e.message); }
    }

    async function changeStatus(id, status) {
      try {
        const { error } = await window.SB.rpc('editorial_content_save', { p_data: { id, status } });
        if (error) throw new Error(error.message);
        toast(statusLabel(status));
        load();
      } catch (e) { toast('Error: ' + e.message); }
    }

    const order = ['scheduled', 'copy_approved', 'assets_selected', 'rendered', 'draft', 'published'];
    const grouped = {};
    order.forEach(s => { grouped[s] = pieces.filter(p => p.status === s); });

    const sections = [
      { status: 'scheduled', label: 'Programado' },
      { status: 'copy_approved', label: 'Copy aprobado — elegir fotos' },
      { status: 'assets_selected', label: 'Fotos elegidas — listo para renderizar' },
      { status: 'draft', label: 'Borradores' },
      { status: 'published', label: 'Publicado' },
    ].filter(s => (grouped[s.status] || []).length > 0);

    if (loading) return React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Cargando…');

    if (pieces.length === 0) return React.createElement('div', { className: 'card pad' },
      React.createElement('div', { style: { textAlign: 'center', color: 'var(--text-3)', padding: '20px 0' } },
        React.createElement('div', { style: { marginBottom: 8, fontWeight: 600 } }, 'Sin piezas todavía.'),
        React.createElement('div', { style: { fontSize: 12 } }, 'Generá el primer carrusel en "Nueva pieza".')
      )
    );

    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 } },
        React.createElement('div', { className: 'eyebrow' }, pieces.length + ' PIEZAS'),
        React.createElement('button', { className: 'btn sm', onClick: load }, React.createElement(Icon, { name: 'refresh' }))
      ),
      sections.map(sec => React.createElement('div', { key: sec.status, style: { marginBottom: 24 } },
        React.createElement('div', { className: 'eyebrow', style: { marginBottom: 10 } }, sec.label.toUpperCase()),
        grouped[sec.status].map(p => React.createElement('div', {
          key: p.id, className: 'card',
          style: { marginBottom: 10, border: openId === p.id ? '1.5px solid var(--accent)' : undefined }
        },
          React.createElement('div', {
            style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer' },
            onClick: () => setOpenId(id => id === p.id ? null : p.id)
          },
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 15, color: 'var(--text-1)', marginBottom: 2 } }, p.titulo || p.destino || 'Sin título'),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } },
                (p.destino || '') + (p.scheduled_at ? ' · ' + fDate(p.scheduled_at) : '') + (p.tipo ? ' · ' + p.tipo : '')
              )
            ),
            React.createElement('div', {
              className: 'badge ' + statusCls(p.status),
              style: { fontSize: 10, padding: '2px 8px' }
            }, statusLabel(p.status)),
            React.createElement(Icon, { name: openId === p.id ? 'chevron-up' : 'chevron-down' })
          ),

          openId === p.id && React.createElement('div', { style: { padding: '0 16px 16px', borderTop: '1px solid var(--rule)' } },
            React.createElement(Sp, { h: 12 }),

            // caption
            p.caption && [
              React.createElement('div', { key: 'cl', className: 'eyebrow', style: { marginBottom: 4 } }, 'CAPTION'),
              React.createElement('div', { key: 'cv', style: { fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10, whiteSpace: 'pre-wrap' } }, p.caption),
            ],

            // hashtags
            Array.isArray(p.hashtags) && p.hashtags.length > 0 && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 } },
              p.hashtags.map((h, i) => React.createElement('span', { key: i, className: 'tag', style: { fontSize: 10 } }, h))
            ),

            // slides summary
            Array.isArray(p.slides) && p.slides.length > 0 && React.createElement('div', { style: { marginBottom: 12 } },
              React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, p.slides.length + ' SLIDES'),
              React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
                p.slides.map((s, i) => React.createElement(SlideBadge, { key: i, layout: s.layout }))
              )
            ),

            // programar
            p.status !== 'published' && React.createElement('div', { style: { marginBottom: 10 } },
              React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, 'PROGRAMAR PUBLICACIÓN'),
              React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
                React.createElement('input', {
                  type: 'datetime-local',
                  defaultValue: p.scheduled_at ? p.scheduled_at.slice(0, 16) : '',
                  onChange: e => setScheduling(s => ({ ...s, [p.id]: e.target.value })),
                  style: { fontSize: 12, padding: '7px 10px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)' }
                }),
                React.createElement('button', {
                  className: 'btn sm primary',
                  onClick: () => setDate(p.id, scheduling[p.id] || (p.scheduled_at ? p.scheduled_at.slice(0, 16) : null)),
                  disabled: !scheduling[p.id] && !p.scheduled_at
                }, 'Programar')
              )
            ),

            // acciones
            React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
              p.status === 'draft' && React.createElement('button', { className: 'btn sm primary', onClick: () => changeStatus(p.id, 'copy_approved') }, 'Aprobar copy'),
              p.status === 'copy_approved' && React.createElement('button', { className: 'btn sm primary', onClick: () => changeStatus(p.id, 'assets_selected') }, 'Confirmar fotos'),
              p.status !== 'published' && React.createElement('button', { className: 'btn sm', onClick: () => changeStatus(p.id, 'published') }, 'Marcar publicada'),
              React.createElement('button', {
                className: 'btn sm', style: { color: 'var(--bad)' },
                onClick: () => { if (confirm('¿Eliminar esta pieza?')) changeStatus(p.id, 'deleted'); }
              }, 'Eliminar')
            )
          )
        ))
      ))
    );
  }

  window.NuevaPieza = NuevaPieza;
  window.BibliotecaFotos = BibliotecaFotos;
  window.CalendarioContenido = CalendarioContenido;
})();
