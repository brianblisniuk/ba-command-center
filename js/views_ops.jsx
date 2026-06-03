/* B&A · dominios de operaciones: Viajes · Bandeja · Finanzas → window */
(function () {
  const { Icon, BarChart, Donut, StatCard, Badge, Avatar, SalidaCard, CardHead, estadoMeta } = window;
  const { useState } = React;
  const BA = window.BA;
  function k(v, cur) { return BA.sym[cur] + ' ' + Math.round(v * (BA.fx[cur] / BA.fx.USD)) + 'k'; }

  // ============ VIAJES (portafolio) ============
  function Viajes({ cur, openTrip, openWizard }) {
    const groups = [
      { key: 'venta', label: 'En venta' },
      { key: 'confirmada', label: 'Confirmadas' },
      { key: 'evaluacion', label: 'En evaluación' },
    ];
    const st = (function () { const c = { go: 0, risk: 0, curso: 0, opcion: 0 }; BA.salidas.forEach(s => { if (c[s.estado] != null) c[s.estado]++; }); return c; })();
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' },
        React.createElement('div', null,
          React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Viajes')),
          React.createElement('div', { className: 'page-greet-sub' }, 'Portafolio de salidas · entrá a producir')),
        React.createElement('button', { className: 'btn primary', onClick: () => openWizard && openWizard() }, React.createElement(Icon, { name: 'plus' }), 'Nueva salida')
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'flag', iconCls: 'tint', label: 'GO', value: st.go, sub: 'listas para salir' }),
        React.createElement(StatCard, { icon: 'alert', iconCls: 'tint-brass', label: 'En riesgo', value: st.risk, sub: 'requieren acción' }),
        React.createElement(StatCard, { icon: 'compass', iconCls: 'tint-curso', label: 'En curso', value: st.curso, sub: 'grupos viajando' }),
        React.createElement(StatCard, { icon: 'layers', iconCls: 'tint', label: 'En evaluación', value: st.opcion, sub: 'sin definir' })
      ),
      groups.map(g => {
        const list = BA.salidas.filter(s => s.grupo === g.key);
        if (!list.length) return null;
        return React.createElement('div', { key: g.key, style: { marginBottom: 28 } },
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 12 } }, g.label + ' · ' + list.length),
          React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' } },
            list.map(s => React.createElement(SalidaCard, { key: s.id, s, cur, onOpen: () => openTrip(s.id) })))
        );
      })
    );
  }

  // ============ BANDEJA (triage IA) ============
  const FILTERS = [
    { k: 'all', t: 'Todos' }, { k: 'unread', t: 'Sin leer' }, { k: 'resp', t: 'A responder' },
    { k: 'pay', t: 'Cobros' }, { k: 'wa', t: 'WhatsApp' },
  ];
  const SEVCAT = { Cliente: 'curso', Proveedor: 'risk', Pago: 'go', Reserva: 'go' };

  function Bandeja({ toast }) {
    const [filter, setFilter] = useState('all');
    const [sel, setSel] = useState((BA.bandeja[0] || {}).id);
    const [sent, setSent] = useState({});
    const [draft, setDraft] = useState('');
    const list = BA.bandeja.filter(m => filter === 'all' ? true
      : filter === 'unread' ? !m.leido
      : filter === 'resp' ? m.necesitaResp
      : filter === 'pay' ? m.cat === 'Pago'
      : filter === 'wa' ? m.cuenta === 'wa' : true);
    const cur = BA.bandeja.find(m => m.id === sel) || list[0];

    React.useEffect(() => { if (cur) setDraft(cur.borrador); }, [sel]);

    async function send() {
      if (!cur) return;
      const fromRaw = cur.fromAddr || '';
      const mm = fromRaw.match(/<([^>]+)>/);
      const to = (mm ? mm[1] : fromRaw).trim();
      if (!to || to.indexOf('@') < 0) { toast('No hay dirección de respuesta válida'); return; }
      const account = (cur.cuenta || 'reservas@').replace('@', '');
      const subject = /^re:/i.test(cur.asunto) ? cur.asunto : ('Re: ' + cur.asunto);
      toast('Enviando…');
      const res = await BA.source.sendEmail({ account, to, subject, text: draft, replyToId: cur.id });
      if (res.ok) { setSent(s => ({ ...s, [cur.id]: true })); toast('Mail enviado a ' + cur.de + ' ✓'); }
      else { toast('No se pudo enviar: ' + res.error); }
    }

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' },
        React.createElement('div', null,
          React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Bandeja')),
          React.createElement('div', { className: 'page-greet-sub' }, 'Email + WhatsApp unificados · triage por ', React.createElement('b', null, 'IA (Claude Haiku)'))),
        React.createElement('div', { className: 'tag' }, React.createElement(Icon, { name: 'spark' }), 'email-ai · activo')
      ),
      React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' } },
        FILTERS.map(f => React.createElement('button', { key: f.k, className: 'badge ' + (filter === f.k ? 'go' : 'ghost'),
          style: { cursor: 'pointer', padding: '6px 12px' }, onClick: () => setFilter(f.k) }, f.t))
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', alignItems: 'start' } },
        // list
        React.createElement('div', { className: 'card', style: { overflow: 'hidden' } },
          list.length === 0 ? React.createElement('div', { className: 'stub', style: { padding: '44px 20px' } },
            React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: 'mail' })),
            React.createElement('h3', { style: { fontSize: 16 } }, 'Sin mensajes'),
            React.createElement('p', null, 'No hay correos ni chats en este filtro.')) :
          list.map((m, i) => React.createElement('div', { key: m.id, onClick: () => setSel(m.id),
            style: { display: 'flex', gap: 11, padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid var(--rule-soft)',
              background: sel === m.id ? 'var(--surface-2)' : 'transparent', borderLeft: '3px solid ' + (sel === m.id ? 'var(--accent)' : 'transparent') } },
            React.createElement('div', { className: 'q-ic ' + m.sev, style: { width: 34, height: 34, borderRadius: 10, flexShrink: 0 } },
              React.createElement(Icon, { name: m.cuenta === 'wa' ? 'chat' : (m.cat === 'Pago' ? 'coin' : 'mail') })),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 8 } },
                React.createElement('span', { style: { fontSize: 13, fontWeight: m.leido ? 500 : 700, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, m.de),
                React.createElement('span', { style: { fontSize: 10, color: 'var(--text-faint)', whiteSpace: 'nowrap', fontFamily: 'var(--ff-mono)' } }, m.hace)),
              React.createElement('div', { style: { fontSize: 12, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '2px 0 5px' } }, m.asunto),
              React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
                m.cuenta === 'wa' && React.createElement('span', { className: 'ch-pill wa', style: { padding: '2px 6px' } }, React.createElement(Icon, { name: 'chat' }), 'WA'),
                React.createElement('span', { className: 'badge ' + (SEVCAT[m.cat] || 'ghost'), style: { padding: '2px 6px' } }, m.cat),
                m.prio === 'Alta' && React.createElement('span', { className: 'badge bad', style: { padding: '2px 6px' } }, 'Alta'),
                sent[m.id] && React.createElement('span', { className: 'tag', style: { padding: '2px 7px' } }, React.createElement(Icon, { name: 'check' }), 'Resp.'))
            )
          ))
        ),
        // detail + AI panel
        cur && React.createElement('div', { className: 'card pad' },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 } },
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('h3', { style: { fontSize: 19, marginBottom: 5 } }, cur.cuenta === 'wa' ? cur.de : cur.asunto),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
                React.createElement('span', { className: 'ch-pill ' + (cur.cuenta === 'wa' ? 'wa' : 'email') }, React.createElement(Icon, { name: cur.cuenta === 'wa' ? 'chat' : 'mail' }), cur.cuenta === 'wa' ? 'WhatsApp' : cur.cuenta),
                React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } }, cur.hace))),
            React.createElement('div', { style: { display: 'flex', gap: 6 } },
              React.createElement('span', { className: 'badge ' + (SEVCAT[cur.cat] || 'ghost') }, cur.cat),
              React.createElement('span', { className: 'badge ' + (cur.prio === 'Alta' ? 'bad' : 'risk') }, cur.prio),
              React.createElement('span', { className: 'badge ghost' }, cur.idioma))
          ),
          // AI summary block
          React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: 15, marginBottom: 14 } },
            React.createElement('div', { className: 'eyebrow', style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--accent)' } },
              React.createElement(Icon, { name: 'spark', style: { width: 13, height: 13 } }), 'Resumen IA'),
            React.createElement('div', { style: { fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-1)' } }, cur.resumen),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 } },
              Object.entries(cur.extra).map(([key, val]) => React.createElement('span', { key, className: 'tag' },
                React.createElement('span', { style: { color: 'var(--text-faint)', textTransform: 'capitalize' } }, key + ':'), val)))
          ),
          // conciliar pago
          cur.conciliar && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', background: 'var(--go-bg)', borderRadius: 'var(--radius-sm)', marginBottom: 14 } },
            React.createElement(Icon, { name: 'coin', style: { width: 20, height: 20, color: 'var(--go)' } }),
            React.createElement('div', { style: { flex: 1, fontSize: 13 } }, 'Pago detectado — coincide con ', React.createElement('b', null, cur.extra.match)),
            React.createElement('button', { className: 'btn sm primary', onClick: () => toast('Cuota marcada como pagada ✓') }, 'Conciliar')),
          // hilo (WhatsApp / unificado por contraparte)
          cur.hilo && React.createElement('div', null,
            React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, 'Conversación · ' + cur.de),
            React.createElement('div', { className: 'wa-thread' },
              cur.hilo.map((b, i) => React.createElement('div', { key: i, className: 'wa-b ' + b.from },
                React.createElement('div', null, b.t),
                React.createElement('div', { className: 'meta' },
                  React.createElement('span', { className: 'ch ' + b.ch }, b.ch === 'wa' ? 'WhatsApp' : 'Email'),
                  React.createElement('span', { className: 'tm' }, b.time)))),
              sent[cur.id] && React.createElement('div', { className: 'wa-b us' },
                React.createElement('div', null, cur.borrador),
                React.createElement('div', { className: 'meta' }, React.createElement('span', { className: 'ch wa' }, 'WhatsApp'), React.createElement('span', { className: 'tm' }, 'ahora ✓✓'))))
          ),
          // draft
          cur.necesitaResp ? React.createElement('div', null,
            React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, 'Borrador IA · voseo · editable'),
            !sent[cur.id] && React.createElement('textarea', { value: draft, onChange: e => setDraft(e.target.value),
              style: { width: '100%', minHeight: cur.hilo ? 70 : 110, padding: 13, borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--text-1)', fontSize: 13.5, lineHeight: 1.6, resize: 'vertical' } }),
            React.createElement('div', { style: { display: 'flex', gap: 9, marginTop: 12, flexWrap: 'wrap' } },
              sent[cur.id]
                ? React.createElement('span', { className: 'tag', style: { padding: '7px 12px' } }, React.createElement(Icon, { name: 'check' }), cur.cuenta === 'wa' ? 'Respondido por WhatsApp' : 'Enviado')
                : React.createElement('button', { className: 'btn primary', onClick: send }, React.createElement(Icon, { name: 'send' }), cur.cuenta === 'wa' ? 'Responder por WhatsApp' : 'Responder con este borrador'),
              React.createElement('button', { className: 'btn', onClick: () => toast('Vinculado a ' + (BA.salidaById(cur.salida) ? BA.salidaById(cur.salida).region : 'salida')) }, React.createElement(Icon, { name: 'compass' }), 'Auto-vincular salida'),
              React.createElement('button', { className: 'btn', onClick: () => toast('Tarea creada') }, React.createElement(Icon, { name: 'plus' }), 'Crear tarea'))
          ) : React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', padding: '8px 0' } }, 'No requiere respuesta. ',
              React.createElement('button', { className: 'btn sm', style: { marginLeft: 8 }, onClick: () => toast('Archivado') }, 'Archivar'))
        )
      )
    );
  }

  // ============ FINANZAS ============
  function Finanzas({ cur, toast }) {
    const f = BA.finanzas;
    const [paid, setPaid] = useState({});
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' },
        React.createElement('div', null,
          React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Finanzas')),
          React.createElement('div', { className: 'page-greet-sub' }, 'Cobranzas · caja · márgenes — consolidado'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'wallet', iconCls: '', label: 'Por cobrar', value: k(f.totales.porCobrar / 1000, cur), sub: 'total abierto' }),
        React.createElement(StatCard, { icon: 'alert', iconCls: 'tint-bad', label: 'Vencido', value: k(f.totales.vencido / 1000, cur), sub: (f.totales.nVencidas || 0) + ' cuotas' }),
        React.createElement(StatCard, { icon: 'clock', iconCls: 'tint-brass', label: 'Vence ≤ 7 días', value: k(f.totales.prox7 / 1000, cur), sub: (f.totales.nProx7 || 0) + ' cuotas' }),
        React.createElement(StatCard, { icon: 'check', iconCls: 'tint', label: 'Cobrado (mes)', value: k(f.totales.cobradoMes / 1000, cur), sub: 'este mes' })
      ),
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Caja por mes', right: React.createElement('span', { className: 'eyebrow' }, 'US$ miles') }),
        React.createElement(BarChart, { data: f.caja, keys: ['cobrado', 'porCobrar', 'vencido'], colors: ['var(--go)', 'var(--brass)', 'var(--bad)'], h: 170 }),
        React.createElement('div', { className: 'chart-legend' },
          [['Cobrado', 'var(--go)'], ['Por cobrar', 'var(--brass)'], ['Vencido', 'var(--bad)']].map((l, i) =>
            React.createElement('span', { key: i, className: 'lg' }, React.createElement('i', { style: { background: l[1] } }), l[0])))
      ),
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Proyección · ingreso por mes', right: React.createElement('span', { className: 'eyebrow' }, 'forecast vs comprometido · US$ miles') }),
        React.createElement(BarChart, { data: BA.proyeccion, keys: ['forecast', 'comprometido'], colors: ['var(--brass)', 'var(--go)'], h: 170 }),
        React.createElement('div', { className: 'chart-legend' },
          [['Forecast', 'var(--brass)'], ['Comprometido', 'var(--go)']].map((l, i) =>
            React.createElement('span', { key: i, className: 'lg' }, React.createElement('i', { style: { background: l[1] } }), l[0])))
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Cuotas', count: f.cuotas.length }),
        React.createElement('div', { style: { overflowX: 'auto' } },
          React.createElement('table', { className: 'tbl' },
            React.createElement('thead', null, React.createElement('tr', null,
              ['Cliente', 'Salida', 'Cuota', 'Monto', 'Estado', ''].map((h, i) => React.createElement('th', { key: i, style: i >= 3 ? { textAlign: 'right' } : null }, h)))),
            React.createElement('tbody', null,
              f.cuotas.length ? f.cuotas.map((c, i) => { const s = BA.salidaById(c.salida); const isPaid = paid[c.id] || c.estado === 'pagado';
                const stt = isPaid ? { c: 'go', t: 'Pagado' } : c.estado === 'vencido' ? { c: 'bad', t: Math.abs(c.dias) + 'd vencido' } : c.estado === 'proximo' ? { c: 'risk', t: 'en ' + c.dias + 'd' } : { c: 'ghost', t: 'al corriente' };
                return React.createElement('tr', { key: c.id || i },
                  React.createElement('td', null, React.createElement('span', { className: 'nm' }, c.cliente)),
                  React.createElement('td', null, s ? s.region : (c.region || c.salida)),
                  React.createElement('td', { className: 'mono' }, c.cuota),
                  React.createElement('td', { className: 'mono', style: { textAlign: 'right', color: 'var(--text-1)', fontWeight: 600 } }, k(c.monto / 1000, cur)),
                  React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('span', { className: 'badge ' + stt.c }, stt.t)),
                  React.createElement('td', { style: { textAlign: 'right', whiteSpace: 'nowrap' } },
                    isPaid ? React.createElement('span', { className: 'tag' }, React.createElement(Icon, { name: 'check' }), 'OK')
                      : React.createElement('span', { style: { display: 'inline-flex', gap: 6 } },
                        React.createElement('button', { className: 'btn sm', onClick: () => toast('Recordatorio enviado a ' + c.cliente) }, 'Recordar'),
                        React.createElement('button', { className: 'btn sm primary', onClick: () => { setPaid(p => ({ ...p, [c.id]: true })); Promise.resolve(BA.source.markPaid(c.id)).then(r => { if (r && r.error) { setPaid(p => { const q = { ...p }; delete q[c.id]; return q; }); toast('No se pudo marcar: ' + r.error); } else { toast(c.cliente + ' · cobrado ✓'); } }); } }, 'Pagado'))));
              }) : React.createElement('tr', null, React.createElement('td', { colSpan: 6, style: { textAlign: 'center', color: 'var(--text-3)', padding: '20px' } }, 'Sin cuotas por cobrar.')))
          ))
      )
    );
  }

  window.Viajes = Viajes;
  window.Bandeja = Bandeja;
  window.Finanzas = Finanzas;
})();
