/* B&A · Colaboración: panel de comentarios (hilos + @mención + adjuntos) + centro de notificaciones → window */
(function () {
  const { Icon, Avatar } = window;
  const { useState, useRef } = React;
  const BA = window.BA;

  function renderText(t) {
    // resalta @nombre
    const parts = t.split(/(@\w+)/g);
    return parts.map((p, i) => p.startsWith('@')
      ? React.createElement('span', { key: i, className: 'mention' }, p)
      : p);
  }

  // ============ COMMENTS (reutilizable por entidad) ============
  function Comments({ ckey, op, toast, compact }) {
    const [list, setList] = useState(() => (BA.comentarios[ckey] || []).slice());
    const [val, setVal] = useState('');
    const [menu, setMenu] = useState(false);
    const taRef = useRef(null);

    function send() {
      if (!val.trim()) return;
      const mentions = (val.match(/@(\w+)/g) || []).map(m => m.slice(1));
      setList(L => [...L, { who: op.id, t: val.trim(), when: 'ahora', mentions }]);
      if (mentions.length) toast('Mención enviada a ' + mentions.join(', '));
      setVal('');
    }
    function addMention(o) {
      setVal(v => (v.replace(/@\w*$/, '') + '@' + o.short.toLowerCase() + ' '));
      setMenu(false); taRef.current && taRef.current.focus();
    }
    function onChange(e) {
      setVal(e.target.value);
      setMenu(/@\w*$/.test(e.target.value));
    }

    return React.createElement('div', null,
      list.length === 0
        ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', padding: '4px 0 14px' } }, 'Sin comentarios todavía. Arrancá la conversación o mencioná con @.')
        : React.createElement('div', { className: 'cmts', style: { marginBottom: 14 } },
            list.map((c, i) => {
              const o = BA.operadores.find(x => x.id === c.who) || { initials: (c.who[0] || '?').toUpperCase(), name: c.who, color: 'var(--stone)' };
              return React.createElement('div', { key: i, className: 'cmt' },
                React.createElement('span', { className: 'av', style: { width: 30, height: 30, borderRadius: 9, background: o.color || 'var(--laurel)', flexShrink: 0 } }, o.initials),
                React.createElement('div', { className: 'bub' },
                  React.createElement('div', { className: 'bub-h' },
                    React.createElement('span', { className: 'nm' }, o.name ? o.name.split(' ')[0] : c.who),
                    React.createElement('span', { className: 'wh' }, c.when)),
                  React.createElement('div', { className: 'bub-t' }, renderText(c.t))));
            })),
      React.createElement('div', { className: 'cmt-box' },
        React.createElement('span', { className: 'av', style: { width: 30, height: 30, borderRadius: 9, background: op.color, flexShrink: 0 } }, op.initials),
        React.createElement('textarea', { ref: taRef, value: val, placeholder: 'Escribí un comentario… usá @ para mencionar', onChange,
          onKeyDown: e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); } }),
        React.createElement('button', { className: 'tb-icon', title: 'Adjuntar', style: { width: 40, height: 40, flexShrink: 0 }, onClick: () => toast('Adjuntar archivo') }, React.createElement(Icon, { name: 'plus' })),
        React.createElement('button', { className: 'btn primary', style: { flexShrink: 0, height: 40 }, onClick: send }, React.createElement(Icon, { name: 'send' })),
        menu && React.createElement('div', { className: 'mention-menu' },
          BA.operadores.map(o => React.createElement('button', { key: o.id, onClick: () => addMention(o) },
            React.createElement(Avatar, { id: o.id, size: 22 }), o.name)))
      )
    );
  }

  // sección lista para insertar en drawers/detalles
  function CommentsSection({ ckey, op, toast }) {
    const n = (BA.comentarios[ckey] || []).length;
    return React.createElement('div', { style: { marginTop: 18 } },
      React.createElement('div', { className: 'eyebrow', style: { marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement(Icon, { name: 'chat', style: { width: 12, height: 12 } }), 'Comentarios' + (n ? ' · ' + n : '')),
      React.createElement(Comments, { ckey, op, toast }));
  }

  // ============ NOTIFICATION CENTER ============
  const NIC = {
    mention: { ic: 'chat', c: 'var(--curso)' },
    assign:  { ic: 'check', c: 'var(--brass)' },
    payment: { ic: 'coin', c: 'var(--go)' },
    deadline:{ ic: 'clock', c: 'var(--bad)' },
  };
  function NotifCenter({ op, onClose, onGo, toast }) {
    const [items, setItems] = useState(() => BA.notificaciones.filter(n => n.para === op.id).map(n => ({ ...n })));
    function markAll() { setItems(L => L.map(n => ({ ...n, leido: true }))); BA.notificaciones.forEach(n => { if (n.para === op.id) n.leido = true; }); toast('Todas marcadas como leídas'); }
    function open(n) { n.leido = true; setItems(L => L.map(x => x.id === n.id ? { ...x, leido: true } : x)); onClose(); onGo(n); }
    return React.createElement('div', null,
      React.createElement('div', { style: { position: 'fixed', inset: 0, zIndex: 55 }, onClick: onClose }),
      React.createElement('div', { className: 'notif-pop' },
        React.createElement('div', { className: 'notif-h' },
          React.createElement('h3', null, 'Notificaciones'),
          React.createElement('button', { className: 'card-link', onClick: markAll }, 'Marcar todo leído')),
        React.createElement('div', { className: 'notif-list' },
          items.length === 0
            ? React.createElement('div', { className: 'notif-empty' }, 'Sin novedades. Estás al día. 👌')
            : items.map(n => { const m = NIC[n.kind] || NIC.mention; const de = BA.operadores.find(o => o.id === n.de);
                return React.createElement('div', { key: n.id, className: 'notif-it' + (n.leido ? '' : ' unread'), onClick: () => open(n) },
                  React.createElement('span', { className: 'notif-ic', style: { background: 'color-mix(in oklab,' + m.c + ' 15%, transparent)', color: m.c } }, React.createElement(Icon, { name: m.ic })),
                  React.createElement('div', { className: 'tx' },
                    React.createElement('div', { className: 'a' }, React.createElement('b', null, de ? de.short : n.de), ' ', n.t),
                    React.createElement('div', { className: 'w' }, n.when)),
                  !n.leido && React.createElement('span', { className: 'udot' }));
              }))
      )
    );
  }

  window.Comments = Comments;
  window.CommentsSection = CommentsSection;
  window.NotifCenter = NotifCenter;
  window.unreadNotifs = function (opId) { return BA.notificaciones.filter(n => n.para === opId && !n.leido).length; };
})();
