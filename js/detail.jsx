/* B&A · Patrón de detalle único (página dedicada, NO drawer): Lead · Proveedor → window */
(function () {
  const { Icon, Avatar, Badge, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  const STAGES = ['Nuevos', 'Contactados', 'Calificados', 'Propuesta', 'Negociación', 'Reservados'];
  const FUENTE = { meta_ads: 'Meta Ads', organic: 'Orgánico', referral: 'Referido', web: 'Web', directo: 'Directo' };
  const EVENT = {
    created:  { ic: 'spark', cls: '' },
    stage:    { ic: 'au',    cls: 'go' },
    note:     { ic: 'list',  cls: '' },
    email:    { ic: 'mail',  cls: 'curso' },
    whatsapp: { ic: 'chat',  cls: 'go' },
    call:     { ic: 'phone', cls: 'curso' },
    payment:  { ic: 'coin',  cls: 'go' },
    task:     { ic: 'check', cls: 'brass' },
  };

  function Timeline({ events }) {
    return React.createElement('div', { className: 'tl' },
      events.slice().reverse().map((e, i) => {
        const m = EVENT[e.kind] || EVENT.note;
        return React.createElement('div', { key: i, className: 'tl-item' },
          React.createElement('div', { className: 'tl-dot ' + m.cls }, React.createElement(Icon, { name: m.ic })),
          React.createElement('div', { className: 'tl-t' }, e.t),
          React.createElement('div', { className: 'tl-meta' }, React.createElement('b', null, e.who), ' · ', e.when));
      })
    );
  }

  function KV({ k, v, tone }) {
    return React.createElement('div', { className: 'kv' },
      React.createElement('span', { className: 'k' }, k),
      React.createElement('span', { className: 'v', style: tone ? { color: tone } : null }, v));
  }

  // ============ LEAD DETAIL (dedicated page) ============
  function LeadDetail({ leadId, cur, toast, back, openTrip, openProvider, openProposal }) {
    const lead = BA.leads.find(l => l.id === leadId);
    const [, force] = useState(0);
    const [nota, setNota] = useState('');
    const [events, setEvents] = useState(() => BA.leadEventsFor(lead).slice());
    const [showPlan, setShowPlan] = useState(false);
    if (!lead) return null;
    const s = BA.salidaById(lead.salida);
    const op = BA.operadores.find(o => o.id === lead.resp);
    const idx = STAGES.indexOf(lead.etapa) >= 0 ? STAGES.indexOf(lead.etapa) : 1;
    const plan = BA.planDePago(lead);

    function addEvent(ev) { setEvents(e => [...e, ev]); }
    function changeStage(to) {
      lead.etapa = to;
      addEvent({ kind: 'stage', who: op.short, t: 'Etapa → ' + to, when: 'ahora' });
      toast(lead.nombre + ' → ' + to + (to === 'Reservados' ? ' 🎉' : '')); force(x => x + 1);
    }
    function advance() { const next = STAGES[Math.min(idx + 1, STAGES.length - 1)]; if (next !== lead.etapa) changeStage(next); }
    function saveNote() { if (!nota.trim()) return; addEvent({ kind: 'note', who: op.short, t: nota.trim(), when: 'ahora' }); setNota(''); toast('Nota agregada'); }

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('button', { className: 'backlink', onClick: back }, React.createElement(Icon, { name: 'cl' }), 'Volver a Comercial'),
      React.createElement('div', { className: 'page-head', style: { alignItems: 'center' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
          React.createElement('span', { className: 'av', style: { width: 52, height: 52, borderRadius: 15, background: 'var(--laurel)', fontSize: 19 } }, lead.nombre[0]),
          React.createElement('div', null,
            React.createElement('h1', { style: { fontSize: 27 } }, lead.nombre),
            React.createElement('div', { className: 'page-greet-sub', style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 } },
              React.createElement('span', { className: 'badge ' + (lead.etapa === 'Reservados' ? 'go' : 'risk') }, lead.etapa),
              React.createElement('span', { className: 'mono', style: { fontSize: 12, color: 'var(--accent)', fontWeight: 700 } }, 'US$ ' + lead.potUSD + 'k'),
              lead.empresa !== '—' && React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-3)' } }, lead.empresa)))),
        React.createElement('div', { style: { display: 'flex', gap: 9 } },
          lead.etapa !== 'Reservados' && React.createElement('button', { className: 'btn primary', onClick: advance }, React.createElement(Icon, { name: 'au', style: { transform: 'rotate(90deg)' } }), 'Avanzar etapa'))
      ),
      // stage stepper
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement('div', { style: { display: 'flex', gap: 5 } },
          STAGES.map((st, i) => React.createElement('button', { key: st, onClick: () => changeStage(st), style: { flex: 1, background: 'none', textAlign: 'left' } },
            React.createElement('div', { style: { height: 6, borderRadius: 99, background: i <= idx ? (lead.etapa === 'Reservados' ? 'var(--go)' : 'var(--accent)') : 'var(--surface-sunk)' } }),
            React.createElement('div', { style: { fontSize: 9, marginTop: 6, fontFamily: 'var(--ff-mono)', letterSpacing: '.02em', textTransform: 'uppercase', color: i === idx ? 'var(--text-1)' : 'var(--text-faint)' } }, st)))) ),
      React.createElement('div', { className: 'detail-grid' },
        // left: timeline + nota
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Actividad', count: events.length }),
          React.createElement('div', { style: { display: 'flex', gap: 9, marginBottom: 18 } },
            React.createElement('input', { value: nota, onChange: e => setNota(e.target.value), placeholder: 'Agregar una nota…', onKeyDown: e => { if (e.key === 'Enter') saveNote(); },
              style: { flex: 1, padding: '9px 13px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }),
            React.createElement('button', { className: 'btn primary', onClick: saveNote }, React.createElement(Icon, { name: 'plus' }), 'Nota')),
          React.createElement(Timeline, { events })
        ),
        // right: datos + acciones
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--gap)' } },
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Ficha' }),
            React.createElement(KV, { k: 'Potencial', v: 'US$ ' + lead.potUSD + 'k', tone: 'var(--accent)' }),
            React.createElement(KV, { k: 'Fit score', v: lead.fit + ' / 100' }),
            React.createElement(KV, { k: 'Salida', v: s ? s.region : '—' }),
            React.createElement(KV, { k: 'Fuente', v: FUENTE[lead.fuente] || lead.fuente }),
            React.createElement(KV, { k: 'Sin contacto', v: lead.dias + ' días', tone: lead.dias > 10 ? 'var(--bad)' : null }),
            React.createElement('div', { className: 'kv' },
              React.createElement('span', { className: 'k' }, 'Responsable'),
              React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 7 } }, React.createElement(Avatar, { id: lead.resp, size: 22 }), React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-1)' } }, op.short)))
          ),
          // plan de pago
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Plan de pago', right: React.createElement('span', { className: 'badge ghost' }, plan.politica) }),
            !showPlan
              ? React.createElement('button', { className: 'btn', style: { width: '100%' }, onClick: () => { setShowPlan(true); toast('Plan de pago generado'); addEvent({ kind:'payment', who: op.short, t:'Plan de pago generado · ' + plan.politica, when:'ahora' }); } }, React.createElement(Icon, { name: 'coin' }), 'Generar plan de pago')
              : React.createElement('div', null,
                  plan.cuotas.map((c, i) => React.createElement('div', { key: i, className: 'kv' },
                    React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-1)' } }, c.label),
                    React.createElement('span', { className: 'mono', style: { fontSize: 12.5, color: 'var(--text-1)', fontWeight: 600 } }, BA.money(c.monto, cur))))),
          ),
          // acciones
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Acciones' }),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 } },
              React.createElement('button', { className: 'btn', onClick: () => { addEvent({ kind:'email', who: op.short, t:'Mail de seguimiento enviado', when:'ahora' }); toast('Borrador en Bandeja'); } }, React.createElement(Icon, { name: 'mail' }), 'Preparar mail'),
              React.createElement('button', { className: 'btn', onClick: () => { addEvent({ kind:'whatsapp', who: op.short, t:'WhatsApp enviado', when:'ahora' }); toast('WhatsApp listo'); } }, React.createElement(Icon, { name: 'chat' }), 'WhatsApp'),
              React.createElement('button', { className: 'btn', onClick: () => toast('Reasignar lead') }, React.createElement(Icon, { name: 'users' }), 'Asignar'),
              React.createElement('button', { className: 'btn', onClick: () => openProposal && openProposal(lead) }, React.createElement(Icon, { name: 'download' }), 'Propuesta PDF'),
              s && React.createElement('button', { className: 'btn', onClick: () => openTrip(lead.salida) }, React.createElement(Icon, { name: 'compass' }), 'Ver salida'))
          )
        )
      )
    );
  }

  // ============ PROVIDER DETAIL (ficha, mismo patrón) ============
  const PT = { meal: 'Restaurante', wine: 'Bodega', lodging: 'Alojamiento', experience: 'Experiencia', transfer: 'Transfer', service: 'Servicio', villa: 'Villa' };
  const RST = { confirmada: { c: 'go', t: 'Confirmada' }, conversando: { c: 'risk', t: 'Conversando' }, pendiente: { c: 'ghost', t: 'Pendiente' } };

  function ProviderDetail({ providerId, toast, back, openTrip, op }) {
    const p = BA.providerById(providerId);
    if (!p) return null;
    const st = RST[p.reservationStatus] || RST.pendiente;
    const glyph = (BA.STYPE && BA.STYPE[p.type]) ? BA.STYPE[p.type] : { c: 'var(--laurel)' };
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('button', { className: 'backlink', onClick: back }, React.createElement(Icon, { name: 'cl' }), 'Volver a Biblioteca'),
      React.createElement('div', { className: 'page-head', style: { alignItems: 'center' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
          React.createElement('span', { className: 'salida-glyph', style: { width: 52, height: 52, borderRadius: 15, fontSize: 22, background: 'linear-gradient(145deg, var(--laurel-soft), var(--laurel-deep))' } }, (BA.STYPE && BA.STYPE[p.type] && BA.STYPE[p.type].t) ? p.name[0] : p.name[0]),
          React.createElement('div', null,
            React.createElement('h1', { style: { fontSize: 26 } }, p.name),
            React.createElement('div', { className: 'page-greet-sub', style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 } },
              React.createElement('span', { className: 'badge ' + st.c }, st.t),
              React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-3)' } }, PT[p.type] + ' · ' + p.location),
              p.michelin > 0 && React.createElement('span', { style: { color: 'var(--brass)', fontSize: 13 } }, '★'.repeat(p.michelin))))),
        React.createElement('div', { style: { display: 'flex', gap: 9 } },
          React.createElement('button', { className: 'btn', onClick: () => toast('Buscando en Google Maps… campos autocompletados ✓') }, React.createElement(Icon, { name: 'pin' }), 'Buscar en Google Maps'),
          React.createElement('button', { className: 'btn', onClick: () => toast('Contactar proveedor') }, React.createElement(Icon, { name: 'mail' }), 'Contactar'),
          React.createElement('button', { className: 'btn primary', onClick: () => toast('Estado de reserva actualizado') }, React.createElement(Icon, { name: 'check' }), 'Marcar confirmada'))
      ),
      React.createElement('div', { className: 'detail-grid' },
        // left: comms + notes + attachments
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--gap)' } },
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Comunicaciones', count: p.comms.length }),
            p.comms.length === 0
              ? React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', padding: '8px 0' } }, 'Sin comunicaciones todavía. Cuando escribas o recibas un correo, queda registrado acá.')
              : p.comms.map((c, i) => React.createElement('div', { key: i, className: 'comm' },
                  React.createElement('span', { className: 'dir ' + c.dir }, React.createElement(Icon, { name: c.dir === 'out' ? 'send' : 'mail' })),
                  React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontSize: 13, color: 'var(--text-1)' } }, c.t),
                    React.createElement('div', { className: 'tl-meta' }, (c.dir === 'out' ? 'Enviado' : 'Recibido') + ' · ' + c.when)))) ),
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Notas' }),
            React.createElement('div', { style: { fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 } }, p.notes),
            op && window.CommentsSection && React.createElement(window.CommentsSection, { ckey: 'prov:' + p.id, op, toast }))
        ),
        // right: contacto + adjuntos + salidas
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--gap)' } },
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Contacto' }),
            React.createElement(KV, { k: 'Rango', v: p.priceRange }),
            React.createElement(KV, { k: 'Cierra', v: p.closingDays }),
            p.web !== '—' && React.createElement(KV, { k: 'Web', v: p.web }),
            React.createElement(KV, { k: 'Email', v: p.email }),
            React.createElement(KV, { k: 'Teléfono', v: p.phone })
          ),
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Adjuntos', count: p.attachments.length }),
            p.attachments.length === 0
              ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)' } }, 'Sin archivos. Sumá menús, contratos o fichas técnicas.')
              : React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
                  p.attachments.map((a, i) => React.createElement('span', { key: i, className: 'att', onClick: () => toast('Abrir ' + a) }, React.createElement(Icon, { name: 'book' }), a)))),
          p.salidas.length > 0 && React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Usado en' }),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
              p.salidas.map(sid => { const s = BA.salidaById(sid); return s && React.createElement('button', { key: sid, className: 'tag', onClick: () => openTrip(sid) }, React.createElement(Icon, { name: 'compass' }), s.region); })))
        )
      )
    );
  }

  window.LeadDetail = LeadDetail;
  window.ProviderDetail = ProviderDetail;
})();
