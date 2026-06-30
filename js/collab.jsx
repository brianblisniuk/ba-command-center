/* Pasaporte Negro · Colaboración: comentarios (Supabase + Realtime) + centro de notificaciones → window */
(function () {
  const { Icon, Avatar } = window;
  const { useState, useRef, useEffect } = React;
  const BA = window.BA;

  const UID_BY_SHORT = { brian: '9e11bed5-8e3a-4e7a-b3a0-dccd3b3ce188', fede: '1bf337b7-72d7-411b-98e8-c8f29f878778' };
  const SHORT_BY_UID = { '9e11bed5-8e3a-4e7a-b3a0-dccd3b3ce188': 'Brian', '1bf337b7-72d7-411b-98e8-c8f29f878778': 'Federico' };
  if (BA) { BA._uidByShort = UID_BY_SHORT; BA._notifsUnread = BA._notifsUnread || 0; }

  function rel(iso) {
    if (!iso) return 'ahora';
    const d = new Date(iso), ms = Date.now() - d.getTime();
    const mn = Math.round(ms / 60000), h = Math.round(ms / 3600000), dd = Math.round(ms / 86400000);
    if (mn < 1) return 'recién'; if (mn < 60) return 'hace ' + mn + ' min';
    if (h < 24) return 'hace ' + h + ' h'; if (dd < 30) return 'hace ' + dd + ' d';
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
  }
  function opByAuthor(a) {
    return (BA.operadores || []).find(o => o.short === a || o.name === a || o.id === a)
      || { initials: ((a && a[0]) || '?').toUpperCase(), name: a, color: 'var(--stone)' };
  }
  function renderText(t) {
    return String(t).split(/(@\w+)/g).map((p, i) => p.startsWith('@')
      ? React.createElement('span', { key: i, className: 'mention' }, p) : p);
  }

  // ============ COMMENTS (reutilizable por entidad, persistido + en vivo) ============
  function Comments({ ckey, op, toast }) {
    const [list, setList] = useState([]);
    const [val, setVal] = useState('');
    const [menu, setMenu] = useState(false);
    const taRef = useRef(null);
    const mapRow = r => ({ id: r.id, author: r.author || '', t: r.text || '', when: rel(r.created_at), mentions: r.mentions || [] });

    useEffect(() => {
      let active = true, ch = null;
      (async () => {
        if (!window.SB) return;
        try {
          const { data } = await window.SB.from('comments').select('*').eq('ckey', ckey).order('created_at', { ascending: true });
          if (active && Array.isArray(data)) setList(data.map(mapRow));
        } catch (e) {}
        try {
          ch = window.SB.channel('cmt-' + ckey)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: 'ckey=eq.' + ckey }, payload => {
              const r = payload.new; setList(L => L.some(x => x.id === r.id) ? L : [...L, mapRow(r)]);
            }).subscribe();
        } catch (e) {}
      })();
      return () => { active = false; try { ch && window.SB.removeChannel(ch); } catch (e) {} };
    }, [ckey]);

    async function send() {
      if (!val.trim() || !window.SB) return;
      const mentions = (val.match(/@(\w+)/g) || []).map(m => m.slice(1).toLowerCase());
      const body = val.trim(); setVal(''); setMenu(false);
      const i = ckey.indexOf(':'); const it = ckey.slice(0, i), iid = ckey.slice(i + 1);
      try {
        const { data, error } = await window.SB.from('comments')
          .insert({ item_type: it, item_id: iid, text: body, author: op.short, mentions }).select().single();
        if (error) { toast('No se pudo enviar el comentario'); setVal(body); return; }
        if (data) setList(L => L.some(x => x.id === data.id) ? L : [...L, mapRow(data)]);
        if (mentions.length) toast('Mención enviada');
      } catch (e) { toast('Error al enviar'); setVal(body); }
    }
    function addMention(o) { setVal(v => (v.replace(/@\w*$/, '') + '@' + o.short.toLowerCase() + ' ')); setMenu(false); taRef.current && taRef.current.focus(); }
    function onChange(e) { setVal(e.target.value); setMenu(/@\w*$/.test(e.target.value)); }

    return React.createElement('div', null,
      list.length === 0
        ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', padding: '4px 0 14px' } }, 'Sin comentarios todavía. Arrancá la conversación o mencioná con @.')
        : React.createElement('div', { className: 'cmts', style: { marginBottom: 14 } },
            list.map(c => { const o = opByAuthor(c.author);
              return React.createElement('div', { key: c.id, className: 'cmt' },
                React.createElement('span', { className: 'av', style: { width: 30, height: 30, borderRadius: 9, background: o.color || 'var(--laurel)', flexShrink: 0 } }, o.initials),
                React.createElement('div', { className: 'bub' },
                  React.createElement('div', { className: 'bub-h' },
                    React.createElement('span', { className: 'nm' }, o.name ? o.name.split(' ')[0] : c.author),
                    React.createElement('span', { className: 'wh' }, c.when)),
                  React.createElement('div', { className: 'bub-t' }, renderText(c.t))));
            })),
      React.createElement('div', { className: 'cmt-box' },
        React.createElement('span', { className: 'av', style: { width: 30, height: 30, borderRadius: 9, background: op.color, flexShrink: 0 } }, op.initials),
        React.createElement('textarea', { ref: taRef, value: val, placeholder: 'Escribir un comentario… usar @ para mencionar', onChange,
          onKeyDown: e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); } }),
        React.createElement('button', { className: 'btn primary', style: { flexShrink: 0, height: 40 }, onClick: send }, React.createElement(Icon, { name: 'send' })),
        menu && React.createElement('div', { className: 'mention-menu' },
          (BA.operadores || []).map(o => React.createElement('button', { key: o.id, onClick: () => addMention(o) },
            React.createElement(Avatar, { id: o.id, size: 22 }), o.name)))
      )
    );
  }

  function CommentsSection({ ckey, op, toast }) {
    return React.createElement('div', { style: { marginTop: 18 } },
      React.createElement('div', { className: 'eyebrow', style: { marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement(Icon, { name: 'chat', style: { width: 12, height: 12 } }), 'Comentarios'),
      React.createElement(Comments, { ckey, op, toast }));
  }

  // ============ NOTIFICATION CENTER (persistido + en vivo) ============
  const NIC = {
    mention: { ic: 'chat', c: 'var(--curso)' },
    assign:  { ic: 'check', c: 'var(--brass)' },
    payment: { ic: 'coin', c: 'var(--go)' },
    deadline:{ ic: 'clock', c: 'var(--bad)' },
  };
  function NotifCenter({ op, onClose, onGo, toast }) {
    const opUid = UID_BY_SHORT[op.id] || op.id;
    const [items, setItems] = useState([]);
    const mapN = r => ({ id: r.id, kind: r.kind || 'mention', de: r.actor_label || SHORT_BY_UID[r.actor_uid] || 'Sistema', t: r.body || '', when: rel(r.created_at), leido: !!r.read, ctx: r.ctx });

    useEffect(() => {
      let active = true, ch = null;
      (async () => {
        if (!window.SB) return;
        try {
          const { data } = await window.SB.from('notifications').select('*').eq('recipient_uid', opUid).order('created_at', { ascending: false }).limit(50);
          if (active && Array.isArray(data)) setItems(data.map(mapN));
        } catch (e) {}
        try {
          ch = window.SB.channel('notif-' + opUid)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: 'recipient_uid=eq.' + opUid }, payload => {
              setItems(L => L.some(x => x.id === payload.new.id) ? L : [mapN(payload.new), ...L]);
            }).subscribe();
        } catch (e) {}
      })();
      return () => { active = false; try { ch && window.SB.removeChannel(ch); } catch (e) {} };
    }, [opUid]);

    async function markAll() {
      setItems(L => L.map(n => ({ ...n, leido: true })));
      try { await window.SB.from('notifications').update({ read: true }).eq('recipient_uid', opUid).eq('read', false); } catch (e) {}
      if (window.BA) { window.BA._notifsUnread = 0; window.dispatchEvent(new CustomEvent('notifschange')); }
      toast('Todas marcadas como leídas');
    }
    async function open(n) {
      setItems(L => L.map(x => x.id === n.id ? { ...x, leido: true } : x));
      if (!n.leido && window.BA) { window.BA._notifsUnread = Math.max(0, (window.BA._notifsUnread || 1) - 1); window.dispatchEvent(new CustomEvent('notifschange')); }
      try { await window.SB.from('notifications').update({ read: true }).eq('id', n.id); } catch (e) {}
      onClose(); onGo(n);
    }
    return React.createElement('div', null,
      React.createElement('div', { style: { position: 'fixed', inset: 0, zIndex: 55 }, onClick: onClose }),
      React.createElement('div', { className: 'notif-pop' },
        React.createElement('div', { className: 'notif-h' },
          React.createElement('h3', null, 'Notificaciones'),
          React.createElement('button', { className: 'card-link', onClick: markAll }, 'Marcar todo leído')),
        React.createElement('div', { className: 'notif-list' },
          items.length === 0
            ? React.createElement('div', { className: 'notif-empty' }, 'Sin novedades. Estás al día. 👌')
            : items.map(n => { const m = NIC[n.kind] || NIC.mention;
                return React.createElement('div', { key: n.id, className: 'notif-it' + (n.leido ? '' : ' unread'), onClick: () => open(n) },
                  React.createElement('span', { className: 'notif-ic', style: { background: 'color-mix(in oklab,' + m.c + ' 15%, transparent)', color: m.c } }, React.createElement(Icon, { name: m.ic })),
                  React.createElement('div', { className: 'tx' },
                    React.createElement('div', { className: 'a' }, React.createElement('b', null, n.de), ' ', n.t),
                    React.createElement('div', { className: 'w' }, n.when)),
                  !n.leido && React.createElement('span', { className: 'udot' }));
              }))
      )
    );
  }

  // ---- badge en vivo (cache + Realtime global) ----
  let _badgeCh = null;
  window.unreadNotifs = function () { return (window.BA && window.BA._notifsUnread) || 0; };
  if (BA) BA.loadNotifs = async function (opUid) {
    if (!window.SB || !opUid) return;
    try {
      const { count } = await window.SB.from('notifications').select('id', { count: 'exact', head: true }).eq('recipient_uid', opUid).eq('read', false);
      window.BA._notifsUnread = count || 0; window.dispatchEvent(new CustomEvent('notifschange'));
    } catch (e) {}
    try {
      if (_badgeCh) window.SB.removeChannel(_badgeCh);
      _badgeCh = window.SB.channel('notif-badge-' + opUid)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: 'recipient_uid=eq.' + opUid }, () => {
          window.BA._notifsUnread = (window.BA._notifsUnread || 0) + 1; window.dispatchEvent(new CustomEvent('notifschange'));
        }).subscribe();
    } catch (e) {}
  };

  window.Comments = Comments;
  window.CommentsSection = CommentsSection;
  window.NotifCenter = NotifCenter;
})();
