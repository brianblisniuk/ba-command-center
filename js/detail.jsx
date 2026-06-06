/* B&A · Patrón de detalle único (página dedicada, NO drawer): Lead · Proveedor → window */
(function () {
  const { Icon, Avatar, Badge, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  const STAGES = (window.BA.STAGES || []).filter(s => s.key !== 'lost').map(s => s.label);
  const stageKeyOf = lbl => { const f = (window.BA.STAGES || []).find(s => s.label === lbl); return f ? f.key : null; };
  function relWhen(ts) { if (!ts) return ''; const d = new Date(ts), now = new Date(); const days = Math.floor((now - d) / 86400000); if (days <= 0) return 'hoy'; if (days === 1) return 'ayer'; if (days < 30) return 'hace ' + days + ' días'; return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }); }
  function mapEvent(ev) { const kind = ({ stage_change: 'stage', note: 'note', proposal_sent: 'email' })[ev.kind] || (EVENT[ev.kind] ? ev.kind : 'note'); return { kind, who: ev.actor_name || '—', t: ev.summary || ev.body || '—', when: relWhen(ev.occurred_at || ev.created_at) }; }
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
  function LeadDetail({ leadId, cur, toast, back, openTrip, openProvider, openProposal, openCompose }) {
    const lead = BA.leads.find(l => l.id === leadId);
    const [, force] = useState(0);
    const [nota, setNota] = useState('');
    const [events, setEvents] = useState([]);
    React.useEffect(() => {
      let on = true;
      Promise.resolve(BA.source.leadFullDetail(leadId)).then(d => {
        if (!on) return;
        if (d && Array.isArray(d.events)) {
          setEvents(d.events.map(mapEvent).slice().reverse()); // viene newest-first; Timeline invierte
        } else {
          setEvents(BA.leadEventsFor(lead).slice());           // demo / fallback
        }
        if (d && d.lead && d.lead.fit_score != null) { lead.fit = d.lead.fit_score; force(x => x + 1); }
      });
      return () => { on = false; };
    }, [leadId]);
    const [showPlan, setShowPlan] = useState(false);
    const [planData, setPlanData] = useState(null);
    if (!lead) return null;
    const s = BA.salidaById(lead.salida);
    const op = BA.operadores.find(o => o.id === lead.resp);
    const idx = STAGES.indexOf(lead.etapa) >= 0 ? STAGES.indexOf(lead.etapa) : 1;
    const plan = BA.planDePago(lead);

    function addEvent(ev) { setEvents(e => [...e, ev]); }
    function changeStage(to) {
      if (to === lead.etapa) return;
      const from = lead.etapa, fromKey = lead.stageKey;
      lead.etapa = to; lead.stageKey = stageKeyOf(to) || lead.stageKey;
      addEvent({ kind: 'stage', who: op ? op.short : 'Yo', t: from + ' → ' + to, when: 'ahora' });
      toast(lead.nombre + ' → ' + to + (to === 'Reservado' ? ' 🎉' : '')); force(x => x + 1);
      Promise.resolve(BA.source.leadChangeStage(lead.id, lead.stageKey)).then(r => { if (r && r.error) { lead.etapa = from; lead.stageKey = fromKey; force(x => x + 1); toast('No se pudo cambiar: ' + r.error); } });
    }
    function advance() { const next = STAGES[Math.min(idx + 1, STAGES.length - 1)]; if (next !== lead.etapa) changeStage(next); }
    function saveNote() { const t = nota.trim(); if (!t) return; addEvent({ kind: 'note', who: op ? op.short : 'Yo', t, when: 'ahora' }); setNota(''); Promise.resolve(BA.source.leadAddNote(lead.id, t)).then(r => { if (r && r.error) toast('No se pudo guardar: ' + r.error); else toast('Nota agregada'); }); }

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('button', { className: 'backlink', onClick: back }, React.createElement(Icon, { name: 'cl' }), 'Volver a Comercial'),
      React.createElement('div', { className: 'page-head', style: { alignItems: 'center' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
          React.createElement('span', { className: 'av', style: { width: 52, height: 52, borderRadius: 15, background: 'var(--laurel)', fontSize: 19 } }, lead.nombre[0]),
          React.createElement('div', null,
            React.createElement('h1', { style: { fontSize: 27 } }, lead.nombre),
            React.createElement('div', { className: 'page-greet-sub', style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 } },
              React.createElement('span', { className: 'badge ' + (lead.etapa === 'Reservado' ? 'go' : 'risk') }, lead.etapa),
              React.createElement('span', { className: 'mono', style: { fontSize: 12, color: 'var(--accent)', fontWeight: 700 } }, 'US$ ' + lead.potUSD + 'k'),
              lead.empresa !== '—' && React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-3)' } }, lead.empresa)))),
        React.createElement('div', { style: { display: 'flex', gap: 9 } },
          React.createElement('button', { className: 'btn', onClick: () => openCompose ? openCompose({ to: (lead.email && lead.email.indexOf('@') >= 0) ? lead.email : '', account: 'reservas', subject: 'B&A · ' + (lead.nombre || ''), name: lead.nombre }) : toast('Escribir email') }, React.createElement(Icon, { name: 'mail' }), 'Email'),
          lead.etapa !== 'Reservado' && lead.etapa !== 'Perdidos' && React.createElement('button', { className: 'btn primary', onClick: advance }, React.createElement(Icon, { name: 'au', style: { transform: 'rotate(90deg)' } }), 'Avanzar etapa'))
      ),
      // stage stepper
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement('div', { style: { display: 'flex', gap: 5 } },
          STAGES.map((st, i) => React.createElement('button', { key: st, onClick: () => changeStage(st), style: { flex: 1, background: 'none', textAlign: 'left' } },
            React.createElement('div', { style: { height: 6, borderRadius: 99, background: i <= idx ? (lead.etapa === 'Reservado' ? 'var(--go)' : 'var(--accent)') : 'var(--surface-sunk)' } }),
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
          // plan de pago (real → generate_payment_plan)
          React.createElement('div', { className: 'card pad' },
            React.createElement(CardHead, { title: 'Plan de pago', right: React.createElement('span', { className: 'badge ghost' }, plan.politica) }),
            !showPlan
              ? React.createElement('button', { className: 'btn', style: { width: '100%' }, onClick: async () => {
                  if (!lead.salida) { toast('Asigná un viaje al lead primero'); return; }
                  const r = await BA.source.generatePlan(lead.id);
                  if (r && r.error) { toast('No se pudo generar: ' + r.error); return; }
                  if (r && r.data) setPlanData(r.data);
                  setShowPlan(true);
                  const nc = (r && r.data && r.data.cuotas) ? r.data.cuotas.length : (plan.cuotas ? plan.cuotas.length : 0);
                  addEvent({ kind: 'payment', who: op ? op.short : 'Yo', t: 'Plan de pago generado · ' + nc + ' cuotas', when: 'ahora' });
                  toast('Plan de pago generado'); BA.source.hydrateFinanzas();
                } }, React.createElement(Icon, { name: 'coin' }), 'Generar plan de pago')
              : React.createElement('div', null,
                  (planData ? planData.cuotas.map(c => ({ label: c.label, monto: c.amount, due: c.due })) : plan.cuotas).map((c, i) => React.createElement('div', { key: i, className: 'kv' },
                    React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-1)' } }, c.label + (c.due ? ' · ' + c.due : '')),
                    React.createElement('span', { className: 'mono', style: { fontSize: 12.5, color: 'var(--text-1)', fontWeight: 600 } }, BA.money(c.monto, cur)))),
                  planData && React.createElement('div', { className: 'kv', style: { borderTop: '1px solid var(--rule)', marginTop: 4, paddingTop: 8 } },
                    React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-2)', fontWeight: 600 } }, 'Total'),
                    React.createElement('span', { className: 'mono', style: { fontSize: 12.5, color: 'var(--accent)', fontWeight: 700 } }, BA.money(planData.total, cur)))),
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
  const PT = { meal: 'Restaurante', wine: 'Bodega', lodging: 'Alojamiento', experience: 'Experiencia', transfer: 'Transfer', service: 'Servicio', villa: 'Villa', truffle: 'Trufa', access: 'Acceso', activity: 'Experiencia', culture: 'Cultura' };
  const RST = { confirmada: { c: 'go', t: 'Confirmada' }, conversando: { c: 'risk', t: 'Conversando' }, pendiente: { c: 'ghost', t: 'Pendiente' } };

  function ProviderDetail({ providerId, toast, back, openTrip, op, openCompose }) {
    const p = BA.providerById(providerId);
    if (!p) return null;
    const st = RST[p.reservationStatus] || RST.pendiente;
    const glyph = (BA.STYPE && BA.STYPE[p.type]) ? BA.STYPE[p.type] : { c: 'var(--laurel)' };
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('button', { className: 'backlink', onClick: back }, React.createElement(Icon, { name: 'cl' }), 'Volver'),
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
          React.createElement('button', { className: 'btn', onClick: () => openCompose ? openCompose({ to: (p.email && p.email.indexOf('@') >= 0) ? p.email : '', account: 'reservas', subject: 'B&A · ' + p.name, name: p.name }) : toast('Contactar proveedor') }, React.createElement(Icon, { name: 'mail' }), 'Contactar'),
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
            op && window.CommentsSection && React.createElement(window.CommentsSection, { ckey: 'provider:' + p.id, op, toast }))
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
