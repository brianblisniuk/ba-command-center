// ============ SISTEMA DE CONTENIDO B&A ============
// NuevaPieza (máquina de guiones) · BibliotecaFotos · CalendarioContenido · CarruselStudio (preview + export PNG)
import ReactDOM from 'react-dom/client';
import { toPng } from 'html-to-image';

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
  function slug(t) { return String(t || 'carrusel').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'carrusel'; }
  function SlideBadge({ layout }) {
    const m = { 'destination-editorial': 'Destino', 'activity-specific': 'Actividad', 'comparison': 'Comparación', 'final-cta': 'CTA', 'story-cover': 'Story' };
    return React.createElement('span', { className: 'tag', style: { fontSize: 10 } }, m[layout] || layout);
  }

  // ============ RENDER DE SLIDES (diseño B&A · feed 1080x1350) ============
  const SLIDE_CSS = `
.ba-sl{position:relative;width:1080px;height:1350px;overflow:hidden;background:#16201c;color:rgba(255,255,255,.96);font-family:'Inter',-apple-system,sans-serif;isolation:isolate}
.ba-sl *{box-sizing:border-box;margin:0}
.ba-sl .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.ba-sl .bgfall{position:absolute;inset:0;z-index:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 32%),linear-gradient(145deg,#28302d,#111817 52%,#070808)}
.ba-sl .ov{position:absolute;inset:0;z-index:2;background:linear-gradient(to bottom,rgba(5,7,8,.18),rgba(5,7,8,.04) 24%,rgba(5,7,8,.5) 100%),linear-gradient(108deg,rgba(17,24,23,.22),rgba(59,52,41,.08) 52%,rgba(2,3,3,.2))}
.ba-sl .z{position:absolute;z-index:8}
.ba-sl .brand{position:absolute;z-index:10;top:72px;left:78px;display:flex;gap:10px;align-items:flex-start;color:#fff}
.ba-sl .brand .bh{font-weight:800;font-size:76px;line-height:.76;letter-spacing:-.08em}
.ba-sl .brand .bw{margin-top:9px;font-size:27px;line-height:.98;font-weight:700;font-style:italic;letter-spacing:-.02em}
.ba-sl .kick{font-size:17px;text-transform:uppercase;letter-spacing:.22em;color:rgba(255,255,255,.82)}
.ba-sl .script{font-family:'Pinyon Script',cursive;font-weight:400;font-size:150px;line-height:.95;color:#fff}
.ba-sl .disp{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:116px;line-height:.88;letter-spacing:-.035em;text-transform:uppercase;color:#fff}
.ba-sl .deck{font-style:italic;font-size:30px;line-height:1.28;color:rgba(255,255,255,.96)}
.ba-sl .meta{display:flex;flex-wrap:wrap;gap:10px}
.ba-sl .pill{display:inline-flex;align-items:center;min-height:38px;padding:8px 16px 9px;border:1px solid rgba(255,255,255,.34);border-radius:999px;font-size:16px;line-height:1;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.85);background:rgba(0,0,0,.12)}
.ba-sl .foot{position:absolute;left:78px;right:78px;bottom:64px;z-index:10;display:flex;justify-content:space-between;align-items:flex-end}
.ba-sl .hand{font-size:27px;font-style:italic;color:rgba(255,255,255,.96)}
.ba-sl .arr{position:relative;width:110px;height:60px;border:4px solid #fff;border-radius:999px}
.ba-sl .arr .ln{position:absolute;top:26px;left:23px;width:47px;height:4px;background:#fff;border-radius:99px}
.ba-sl .arr .hd{position:absolute;top:18px;right:22px;width:20px;height:20px;border-top:4px solid #fff;border-right:4px solid #fff;transform:rotate(45deg)}
.ba-sl .qmark{font-weight:800;font-size:100px;line-height:.55;margin-bottom:10px;color:#fff}
.ba-sl .qtext{font-size:29px;line-height:1.24;font-style:italic;color:rgba(255,255,255,.96)}
.ba-sl .drow{display:grid;grid-template-columns:100px 1fr;gap:14px;padding-top:11px;border-top:1px solid rgba(255,255,255,.34)}
.ba-sl .dlab{font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.82)}
.ba-sl .dval{font-size:22px;font-style:italic;color:rgba(255,255,255,.96)}
.ba-sl .ctitle{font-family:'Cormorant Garamond',serif;font-size:92px;line-height:.94;font-weight:500;letter-spacing:-.04em;text-align:center;text-transform:uppercase;color:#fff}
.ba-sl .panel{padding:24px 24px 20px;border:1px solid rgba(255,255,255,.34);background:rgba(0,0,0,.18)}
.ba-sl .plab{margin-bottom:14px;font-family:'Cormorant Garamond',serif;font-size:34px;line-height:1;letter-spacing:-.02em;color:#fff}
.ba-sl .ptext{font-size:22px;line-height:1.28;font-style:italic;color:rgba(255,255,255,.82)}
.ba-sl .quest{text-align:center;font-size:32px;line-height:1.22;font-style:italic;color:rgba(255,255,255,.96)}
.ba-sl .ctabox{padding:30px 34px 32px;border:1px solid rgba(255,255,255,.34);background:rgba(0,0,0,.2)}
.ba-sl .ctah{margin-bottom:12px;font-family:'Cormorant Garamond',serif;font-size:42px;line-height:1;letter-spacing:-.02em;color:#fff}
.ba-sl .ctat{max-width:660px;font-size:26px;line-height:1.28;font-style:italic;color:rgba(255,255,255,.85)}
`;
  function injectSlideCss() {
    if (document.getElementById('ba-slide-css')) return;
    const st = document.createElement('style');
    st.id = 'ba-slide-css';
    st.textContent = SLIDE_CSS;
    document.head.appendChild(st);
  }

  function SlideRender({ slide, photoUrl }) {
    injectSlideCss();
    const l = slide.layout || 'destination-editorial';
    const E = React.createElement;
    const base = [
      E('div', { key: 'bf', className: 'bgfall' }),
      photoUrl ? E('img', { key: 'bg', className: 'bg', src: photoUrl, crossOrigin: 'anonymous' }) : null,
      E('div', { key: 'ov', className: 'ov' }),
      E('div', { key: 'br', className: 'brand' },
        E('div', { className: 'bh' }, '#'),
        E('div', { className: 'bw' }, E('div', null, 'Cuaderno'), E('div', null, 'B&A'))
      ),
      E('div', { key: 'ft', className: 'foot' },
        E('div', { className: 'hand' }, '@blisniukamanov'),
        E('div', { className: 'arr' }, E('span', { className: 'ln' }), E('span', { className: 'hd' }))
      ),
    ];
    let content = [];
    if (l === 'comparison') {
      content = [
        E('h1', { key: 't', className: 'z ctitle', style: { left: 70, right: 70, top: 360, fontSize: (slide.main || '').length > 26 ? 70 : 92 } }, slide.main || ''),
        E('div', { key: 'q', className: 'z quest', style: { left: 78, right: 78, top: 770 } }, slide.question || ''),
        E('div', { key: 'p', className: 'z', style: { left: 78, right: 78, bottom: 220, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 } },
          E('div', { className: 'panel' }, E('div', { className: 'plab' }, (slide.left || {}).label || ''), E('div', { className: 'ptext' }, (slide.left || {}).text || '')),
          E('div', { className: 'panel' }, E('div', { className: 'plab' }, (slide.right || {}).label || ''), E('div', { className: 'ptext' }, (slide.right || {}).text || ''))
        ),
      ];
    } else if (l === 'activity-specific') {
      content = [
        slide.kicker ? E('div', { key: 'k', className: 'z kick', style: { left: 78, top: 315 } }, slide.kicker) : null,
        E('div', { key: 't', className: 'z', style: { left: 78, right: 78, top: 380 } },
          slide.script_text ? E('div', { className: 'script', style: { fontSize: 140 } }, slide.script_text) : null,
          slide.main ? E('div', { className: 'disp', style: { fontSize: (slide.main || '').length > 16 ? 94 : 124 } }, slide.main) : null
        ),
        slide.body ? E('div', { key: 'q', className: 'z', style: { right: 78, bottom: 190, width: 390 } },
          E('div', { className: 'qmark' }, '\u201C'),
          E('div', { className: 'qtext' }, slide.body)
        ) : null,
        Array.isArray(slide.details) && slide.details.length ? E('div', { key: 'd', className: 'z', style: { left: 78, bottom: 184, width: 380, display: 'grid', gap: 12 } },
          slide.details.slice(0, 3).map((d, i) => E('div', { key: i, className: 'drow' }, E('div', { className: 'dlab' }, d.label || ''), E('div', { className: 'dval' }, d.value || '')))
        ) : null,
      ];
    } else if (l === 'final-cta') {
      content = [
        slide.kicker ? E('div', { key: 'k', className: 'z kick', style: { left: 78, top: 315 } }, slide.kicker) : null,
        E('div', { key: 't', className: 'z', style: { left: 78, right: 78, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          slide.script_text ? E('div', { className: 'script', style: { fontSize: 142 } }, slide.script_text) : null,
          slide.main ? E('div', { className: 'disp', style: { fontSize: (slide.main || '').length > 16 ? 94 : 120 } }, slide.main) : null,
          slide.body ? E('div', { className: 'deck', style: { marginTop: 32, maxWidth: 570 } }, slide.body) : null
        ),
        slide.cta ? E('div', { key: 'c', className: 'z ctabox', style: { left: 78, right: 78, bottom: 182 } },
          E('div', { className: 'ctah' }, (slide.cta || {}).headline || ''),
          E('div', { className: 'ctat' }, (slide.cta || {}).text || '')
        ) : null,
      ];
    } else {
      // destination-editorial y story-cover · bloque en flujo: nunca se superpone
      const mlen = (slide.main || '').length;
      const dsize = mlen > 26 ? 72 : mlen > 16 ? 92 : 116;
      content = [
        slide.kicker ? E('div', { key: 'k', className: 'z kick', style: { left: 78, top: 340 } }, slide.kicker) : null,
        E('div', { key: 't', className: 'z', style: { left: 78, right: 78, top: 405, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          slide.script_text ? E('div', { className: 'script' }, slide.script_text) : null,
          slide.main ? E('div', { className: 'disp', style: { fontSize: dsize } }, slide.main) : null,
          slide.body ? E('div', { className: 'deck', style: { marginTop: 34, maxWidth: 560 } }, slide.body) : null,
          Array.isArray(slide.meta) && slide.meta.length ? E('div', { className: 'meta', style: { marginTop: 30 } },
            slide.meta.slice(0, 4).map((m, i) => E('span', { key: i, className: 'pill' }, m))) : null
        ),
      ];
    }
    return E('div', { className: 'ba-sl' }, base.concat(content));
  }

  function SlidePreview({ slide, photoUrl, w }) {
    const width = w || 380;
    const s = width / 1080;
    return React.createElement('div', { style: { width, height: Math.round(1350 * s), overflow: 'hidden', borderRadius: 10, boxShadow: '0 10px 34px rgba(0,0,0,.28)', flexShrink: 0 } },
      React.createElement('div', { style: { transform: 'scale(' + s + ')', transformOrigin: 'top left', width: 1080, height: 1350 } },
        React.createElement(SlideRender, { slide, photoUrl })
      )
    );
  }

  // ============ PHOTO PICKER ============
  function PhotoPicker({ onPick, onClose, toast }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    useEffect(() => { load(); }, []);
    async function load(d) {
      setLoading(true);
      try {
        const { data, error } = await window.SB.rpc('editorial_assets_list', { p_destino: d || null });
        if (error) throw new Error(error.message);
        const arr = Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []);
        setAssets(arr);
      } catch (e) { toast('Error: ' + e.message); }
      finally { setLoading(false); }
    }
    const destinos = [...new Set(assets.map(a => a.destino_tag).filter(Boolean))].sort();
    return React.createElement('div', {
      style: { position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(10,12,10,.55)', display: 'grid', placeItems: 'center', padding: 20 },
      onClick: e => { if (e.target === e.currentTarget) onClose(); }
    },
      React.createElement('div', { className: 'card', style: { width: 'min(860px, 100%)', maxHeight: '84vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--rule)' } },
          React.createElement('div', { className: 'card-title', style: { flex: 1 } }, 'Elegir foto de la biblioteca'),
          React.createElement('button', { className: 'btn sm', onClick: onClose }, 'Cerrar')
        ),
        React.createElement('div', { style: { display: 'flex', gap: 6, padding: '10px 18px', flexWrap: 'wrap', borderBottom: '1px solid var(--rule)' } },
          React.createElement('button', { className: 'btn sm' + (!filter ? ' primary' : ''), onClick: () => { setFilter(''); load(null); } }, 'Todas'),
          destinos.map(d => React.createElement('button', { key: d, className: 'btn sm' + (filter === d ? ' primary' : ''), onClick: () => { setFilter(d); load(d); } }, d))
        ),
        React.createElement('div', { style: { padding: 18, overflowY: 'auto' } },
          loading
            ? React.createElement('div', { style: { textAlign: 'center', color: 'var(--text-3)', padding: 30 } }, 'Cargando…')
            : assets.length === 0
              ? React.createElement('div', { style: { textAlign: 'center', color: 'var(--text-3)', padding: 30 } }, 'La biblioteca está vacía. Las fotos se cargan en la tab Fotos.')
              : React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 } },
                  assets.map(a => React.createElement('div', {
                    key: a.id, onClick: () => onPick(a),
                    style: { borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color .12s' },
                    onMouseEnter: e => e.currentTarget.style.borderColor = 'var(--accent)',
                    onMouseLeave: e => e.currentTarget.style.borderColor = 'transparent'
                  },
                    a.url
                      ? React.createElement('img', { src: a.url, alt: a.filename, style: { width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }, loading: 'lazy' })
                      : React.createElement('div', { style: { aspectRatio: '4/5', background: 'var(--surface-sunk)' } })
                  ))
                )
        )
      )
    );
  }

  // ============ CARRUSEL STUDIO ============
  function CarruselStudio({ pieza, toast, onClose }) {
    const [slides, setSlides] = useState((pieza.slides || []).map(s => ({ ...s })));
    const [active, setActive] = useState(0);
    const [pickFor, setPickFor] = useState(null);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState('');
    const [dirty, setDirty] = useState(false);
    const allAssigned = slides.length > 0 && slides.every(s => s.photo && s.photo.url);

    function assign(idx, asset) {
      setSlides(arr => arr.map((s, i) => i === idx ? { ...s, photo: { id: asset.id, url: asset.url, storage_path: asset.storage_path } } : s));
      setPickFor(null); setDirty(true);
    }

    async function save(statusOverride) {
      setSaving(true);
      try {
        const newStatus = statusOverride || (allAssigned && (pieza.status === 'copy_approved' || pieza.status === 'draft') ? 'assets_selected' : pieza.status);
        const { error } = await window.SB.rpc('editorial_content_save', { p_data: { id: pieza.id, slides, status: newStatus } });
        if (error) throw new Error(error.message);
        setDirty(false);
        toast('Guardado');
        return true;
      } catch (e) { toast('Error al guardar: ' + e.message); return false; }
      finally { setSaving(false); }
    }

    async function toDataUrl(url) {
      if (!url || url.startsWith('data:')) return url || '';
      try {
        const b = await fetch(url).then(r => r.blob());
        return await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(b); });
      } catch (e) { return url; }
    }

    async function doExport() {
      if (!allAssigned) { toast('Falta asignar una foto a cada slide.'); return; }
      setExporting('Preparando…');
      try { await document.fonts.ready; } catch (e) {}
      const holder = document.createElement('div');
      holder.style.cssText = 'position:fixed;left:-12000px;top:0;width:1080px;height:1350px;z-index:-1;';
      document.body.appendChild(holder);
      const root = ReactDOM.createRoot(holder);
      const base = slug(pieza.titulo || pieza.destino);
      try {
        for (let i = 0; i < slides.length; i++) {
          setExporting('Slide ' + (i + 1) + ' de ' + slides.length + '…');
          const dataUrl = await toDataUrl(slides[i].photo && slides[i].photo.url);
          await new Promise(res => { root.render(React.createElement(SlideRender, { slide: slides[i], photoUrl: dataUrl })); setTimeout(res, 500); });
          const node = holder.querySelector('.ba-sl');
          if (!node) throw new Error('No se pudo montar el slide ' + (i + 1));
          const png = await toPng(node, { width: 1080, height: 1350, pixelRatio: 1 });
          const blob = await fetch(png).then(r => r.blob());
          const burl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = burl; a.download = base + '-0' + (i + 1) + '.png';
          document.body.appendChild(a); a.click(); a.remove();
          await new Promise(r => setTimeout(r, 500));
          URL.revokeObjectURL(burl);
        }
        await save('rendered');
        toast(slides.length + ' PNG exportados (1080×1350)');
      } catch (e) { try { window.__exportErr = String((e && e.stack) || e); } catch (_x) {} toast('Error al exportar: ' + e.message); }
      finally { root.unmount(); holder.remove(); setExporting(''); }
    }

    const act = slides[active] || {};
    return React.createElement('div', { style: { position: 'fixed', inset: 0, zIndex: 500, background: 'var(--bg)', display: 'flex', flexDirection: 'column' } },
      // header
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderBottom: '1px solid var(--rule)', flexShrink: 0 } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 18, color: 'var(--text-1)' } }, pieza.titulo || 'Carrusel'),
          React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, (pieza.destino || '') + ' · ' + slides.length + ' slides · ' + statusLabel(pieza.status))
        ),
        exporting && React.createElement('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-2)' } }, exporting),
        React.createElement('button', { className: 'btn sm', onClick: () => save(), disabled: saving || !dirty }, saving ? 'Guardando…' : 'Guardar'),
        React.createElement('button', { className: 'btn sm primary', onClick: doExport, disabled: !allAssigned || !!exporting }, 'Exportar PNG'),
        React.createElement('button', { className: 'btn sm', onClick: onClose }, 'Cerrar')
      ),
      // body
      React.createElement('div', { style: { flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(300px, 420px) 1fr', gap: 0 } },
        // lista de slides
        React.createElement('div', { style: { overflowY: 'auto', padding: 18, borderRight: '1px solid var(--rule)' } },
          slides.map((s, i) => React.createElement('div', {
            key: i, className: 'card',
            style: { marginBottom: 10, cursor: 'pointer', border: active === i ? '1.5px solid var(--accent)' : undefined },
            onClick: () => setActive(i)
          },
            React.createElement('div', { style: { display: 'flex', gap: 12, padding: 12, alignItems: 'center' } },
              s.photo && s.photo.url
                ? React.createElement('img', { src: s.photo.url, style: { width: 56, height: 70, objectFit: 'cover', borderRadius: 6, flexShrink: 0 } })
                : React.createElement('div', { style: { width: 56, height: 70, borderRadius: 6, background: 'var(--surface-sunk)', display: 'grid', placeItems: 'center', flexShrink: 0, border: '1px dashed var(--rule)' } },
                    React.createElement(Icon, { name: 'layers' })),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 } },
                  React.createElement('span', { className: 'mono', style: { fontSize: 10, color: 'var(--text-3)' } }, '0' + (i + 1)),
                  React.createElement(SlideBadge, { layout: s.layout })
                ),
                React.createElement('div', { style: { fontSize: 13, fontFamily: 'var(--ff-display)', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, s.main || s.script_text || '—')
              ),
              React.createElement('button', {
                className: 'btn sm' + (s.photo ? '' : ' primary'),
                onClick: e => { e.stopPropagation(); setPickFor(i); }
              }, s.photo ? 'Cambiar' : 'Elegir foto')
            )
          )),
          React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.5 } },
            allAssigned ? 'Todas las fotos asignadas. El export genera un PNG de 1080×1350 por slide.' : 'Cada slide necesita una foto de la biblioteca para poder exportar.')
        ),
        // preview
        React.createElement('div', { style: { overflowY: 'auto', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--surface-sunk)' } },
          slides.length
            ? React.createElement(SlidePreview, { slide: act, photoUrl: act.photo && act.photo.url, w: 430 })
            : React.createElement('div', { style: { color: 'var(--text-3)' } }, 'Sin slides.')
        )
      ),
      pickFor !== null && React.createElement(PhotoPicker, { toast, onClose: () => setPickFor(null), onPick: a => assign(pickFor, a) })
    );
  }

  // ============ NUEVA PIEZA (máquina de guiones) ============
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
      if (!brief.destino.trim() || !brief.tema.trim()) { toast('Falta completar el destino y el tema.'); return; }
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
        toast(status === 'copy_approved' ? 'Copy aprobado — el siguiente paso es elegir las fotos en el Calendario' : 'Borrador guardado');
        if (status === 'copy_approved') { setBrief({ destino: '', tema: '', notas: '', num_slides: 4 }); setDraft(null); }
      } catch (e) { toast('Error al guardar: ' + e.message); }
      finally { setSaving(false); }
    }

    return React.createElement('div', { style: { maxWidth: 720 } },
      React.createElement('div', { className: 'card pad' },
        React.createElement('div', { className: 'card-head', style: { marginBottom: 18 } },
          React.createElement('div', { className: 'card-title' }, 'Máquina de guiones'),
          React.createElement('div', { className: 'card-sub' }, 'Brief de la pieza → copy editorial en el tono B&A, para aprobar antes de elegir fotos.')
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
            'Después de aprobar el copy, las fotos se eligen desde el Calendario con "Armar carrusel".'
          )
        )
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
        const { data, error } = await window.SB.rpc('editorial_assets_list', { p_destino: d !== undefined ? (d || null) : (filterDestino || null) });
        if (error) throw new Error(error.message);
        const arr = Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []);
        setAssets(arr);
      } catch (e) { toast('Error al cargar biblioteca: ' + e.message); }
      finally { setLoadingAssets(false); }
    }

    async function handleFiles(files) {
      const arr = Array.from(files).filter(f => f.type.startsWith('image/') || /\.(avif|heic|heif)$/i.test(f.name));
      if (!arr.length) { toast('Solo se aceptan imágenes (JPG, PNG, WEBP, AVIF, HEIC).'); return; }
      if (!destino.trim()) { toast('Falta indicar el destino del batch.'); return; }
      setUploading(true); setTotal(arr.length); setUploadCount(0);
      let ok = 0;
      for (const file of arr) {
        const dslug = destino.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_');
        const fname = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = dslug + '/' + Date.now() + '_' + fname;
        const ctype = file.type || (/\.avif$/i.test(file.name) ? 'image/avif' : 'application/octet-stream');
        try {
          const { error: upErr } = await window.SB.storage.from('editorial-assets').upload(path, file, { upsert: false, contentType: ctype });
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
          React.createElement('div', { className: 'card-sub' }, 'Carga de material en batch. Las fotos quedan disponibles para armar los carruseles.')
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
          React.createElement('input', { ref: inputRef, type: 'file', multiple: true, accept: 'image/*,.heic,.heif,.avif', style: { display: 'none' }, onChange: e => handleFiles(e.target.files) }),
          uploading
            ? React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: 600, marginBottom: 6 } }, 'Subiendo ' + uploadCount + ' de ' + total + '…'),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'No cerrar esta pestaña.')
              )
            : React.createElement('div', null,
                React.createElement(Icon, { name: 'layers', style: { width: 28, height: 28, color: 'var(--text-3)', marginBottom: 8 } }),
                React.createElement('div', { style: { fontWeight: 600, marginBottom: 4 } }, 'Arrastrar las fotos aquí, o hacer clic para seleccionar'),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'JPG, PNG, WEBP, AVIF, HEIC · hasta 50 MB por foto · sin límite de cantidad')
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
              React.createElement('div', { style: { fontSize: 12 } }, 'El primer paso es subir las fotos de Engadín.')
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

  // ============ CALENDARIO DE CONTENIDO ============
  function CalendarioContenido({ toast }) {
    const [pieces, setPieces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openId, setOpenId] = useState(null);
    const [scheduling, setScheduling] = useState({});
    const [studio, setStudio] = useState(null);

    useEffect(() => { load(); }, []);

    async function load() {
      setLoading(true);
      try {
        const { data, error } = await window.SB.rpc('editorial_content_list');
        if (error) throw new Error(error.message);
        const arr = Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []);
        setPieces(arr.filter(p => p.status !== 'deleted'));
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
        toast(status === 'deleted' ? 'Pieza eliminada' : statusLabel(status));
        load();
      } catch (e) { toast('Error: ' + e.message); }
    }

    const order = ['scheduled', 'rendered', 'assets_selected', 'copy_approved', 'draft', 'published'];
    const grouped = {};
    order.forEach(s => { grouped[s] = pieces.filter(p => p.status === s); });

    const sections = [
      { status: 'scheduled', label: 'Programado' },
      { status: 'rendered', label: 'Renderizado — listo para programar' },
      { status: 'assets_selected', label: 'Fotos elegidas — listo para exportar' },
      { status: 'copy_approved', label: 'Copy aprobado — elegir fotos' },
      { status: 'draft', label: 'Borradores' },
      { status: 'published', label: 'Publicado' },
    ].filter(s => (grouped[s.status] || []).length > 0);

    if (loading) return React.createElement('div', { className: 'card pad', style: { textAlign: 'center', color: 'var(--text-3)' } }, 'Cargando…');

    if (pieces.length === 0) return React.createElement('div', { className: 'card pad' },
      React.createElement('div', { style: { textAlign: 'center', color: 'var(--text-3)', padding: '20px 0' } },
        React.createElement('div', { style: { marginBottom: 8, fontWeight: 600 } }, 'Sin piezas todavía.'),
        React.createElement('div', { style: { fontSize: 12 } }, 'El primer carrusel se genera desde "Nueva pieza".')
      )
    );

    const canStudio = p => ['copy_approved', 'assets_selected', 'rendered', 'scheduled'].includes(p.status) && Array.isArray(p.slides) && p.slides.length > 0;

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
                (p.destino || '') + (p.scheduled_at ? ' · ' + fDate(p.scheduled_at) : '') + ' · ' + ((p.slides || []).length) + ' slides'
              )
            ),
            canStudio(p) && React.createElement('button', {
              className: 'btn sm primary',
              onClick: e => { e.stopPropagation(); setStudio(p); }
            }, 'Armar carrusel'),
            React.createElement('div', {
              className: 'badge ' + statusCls(p.status),
              style: { fontSize: 10, padding: '2px 8px' }
            }, statusLabel(p.status)),
            React.createElement(Icon, { name: openId === p.id ? 'chevron-up' : 'chevron-down' })
          ),

          openId === p.id && React.createElement('div', { style: { padding: '0 16px 16px', borderTop: '1px solid var(--rule)' } },
            React.createElement(Sp, { h: 12 }),
            p.caption && [
              React.createElement('div', { key: 'cl', className: 'eyebrow', style: { marginBottom: 4 } }, 'CAPTION'),
              React.createElement('div', { key: 'cv', style: { fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10, whiteSpace: 'pre-wrap' } }, p.caption),
            ],
            Array.isArray(p.hashtags) && p.hashtags.length > 0 && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 } },
              p.hashtags.map((h, i) => React.createElement('span', { key: i, className: 'tag', style: { fontSize: 10 } }, h))
            ),
            Array.isArray(p.slides) && p.slides.length > 0 && React.createElement('div', { style: { marginBottom: 12 } },
              React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, p.slides.length + ' SLIDES · ' + p.slides.filter(s => s.photo && s.photo.url).length + ' CON FOTO'),
              React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
                p.slides.map((s, i) => React.createElement(SlideBadge, { key: i, layout: s.layout }))
              )
            ),
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
            React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
              p.status === 'draft' && React.createElement('button', { className: 'btn sm primary', onClick: () => changeStatus(p.id, 'copy_approved') }, 'Aprobar copy'),
              p.status !== 'published' && React.createElement('button', { className: 'btn sm', onClick: () => changeStatus(p.id, 'published') }, 'Marcar publicada'),
              React.createElement('button', {
                className: 'btn sm', style: { color: 'var(--bad)' },
                onClick: () => { if (confirm('¿Eliminar esta pieza?')) changeStatus(p.id, 'deleted'); }
              }, 'Eliminar')
            )
          )
        ))
      )),
      studio && React.createElement(CarruselStudio, {
        pieza: studio, toast,
        onClose: () => { setStudio(null); load(); }
      })
    );
  }

  window.NuevaPieza = NuevaPieza;
  window.BibliotecaFotos = BibliotecaFotos;
  window.CalendarioContenido = CalendarioContenido;
})();
