/* B&A · Lead drawer (ficha + avanzar etapa) → window.LeadDrawer */
(function () {
  const { Icon, Avatar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  const STAGES = ['Nuevos', 'Contactados', 'Propuesta', 'Negociación', 'Reservado'];
  const FUENTE = { meta_ads: 'Meta Ads', organic: 'Orgánico', referral: 'Referido', web: 'Web', directo: 'Directo' };

  function LeadDrawer({ leadId, onClose, toast, nav, openTrip, onMutate }) {
    const lead = BA.leads.find(l => l.id === leadId);
    const [etapa, setEtapa] = useState(lead ? lead.etapa : 'Nuevos');
    const [nota, setNota] = useState('');
    if (!lead) return null;
    const s = BA.salidaById(lead.salida);
    const idx = STAGES.indexOf(etapa);
    function advance() {
      const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
      if (next === etapa) return;
      setEtapa(next); lead.etapa = next;
      toast(lead.nombre + ' → ' + next + (next === 'Reservado' ? ' · ¡reserva! 🎉' : ''));
      onMutate && onMutate();
    }
    const F = ({ label, value, tone }) => React.createElement('div', { style: { padding: '11px 0', borderBottom: '1px solid var(--rule-soft)', display: 'flex', justifyContent: 'space-between', gap: 12 } },
      React.createElement('span', { className: 'eyebrow' }, label),
      React.createElement('span', { style: { fontSize: 13, color: tone || 'var(--text-1)', fontWeight: 600, textAlign: 'right' } }, value));

    return React.createElement('div', null,
      React.createElement('div', { className: 'drawer-overlay', onClick: onClose }),
      React.createElement('div', { className: 'drawer' },
        React.createElement('div', { className: 'drawer-head' },
          React.createElement('span', { className: 'av', style: { width: 42, height: 42, borderRadius: 12, background: 'var(--laurel)', fontSize: 16 } }, lead.nombre[0]),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('h3', null, lead.nombre),
            React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 } }, (lead.empresa !== '—' ? lead.empresa + ' · ' : '') + (s ? s.region : ''))),
          React.createElement('button', { className: 'drawer-close', onClick: onClose }, React.createElement(Icon, { name: 'x' }))
        ),
        React.createElement('div', { className: 'drawer-body' },
          // stage stepper
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, 'Etapa del pipeline'),
          React.createElement('div', { style: { display: 'flex', gap: 5, marginBottom: 12 } },
            STAGES.map((st, i) => React.createElement('div', { key: st, style: { flex: 1 } },
              React.createElement('div', { style: { height: 6, borderRadius: 99, background: i <= idx ? (etapa === 'Reservado' ? 'var(--go)' : 'var(--accent)') : 'var(--surface-sunk)' } }),
              React.createElement('div', { style: { fontSize: 8, marginTop: 5, textAlign: 'center', fontFamily: 'var(--ff-mono)', letterSpacing: '.02em', textTransform: 'uppercase', color: i === idx ? 'var(--text-1)' : 'var(--text-faint)' } }, st.slice(0, 4)))) ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 22 } },
            React.createElement('span', { className: 'badge ' + (etapa === 'Reservado' ? 'go' : 'risk') }, etapa),
            etapa !== 'Reservado'
              ? React.createElement('button', { className: 'btn sm primary', onClick: advance }, React.createElement(Icon, { name: 'au', style: { transform: 'rotate(90deg)' } }), 'Avanzar a ' + STAGES[idx + 1])
              : React.createElement('span', { className: 'tag' }, React.createElement(Icon, { name: 'check' }), 'Cerrado')),
          // datos
          React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: '4px 15px', marginBottom: 18 } },
            React.createElement(F, { label: 'Potencial', value: 'US$ ' + lead.potUSD + 'k', tone: 'var(--accent)' }),
            React.createElement(F, { label: 'Fit score', value: lead.fit + ' / 100' }),
            React.createElement(F, { label: 'Salida', value: s ? s.region + ' · ' + s.fecha : '—' }),
            React.createElement(F, { label: 'Fuente', value: FUENTE[lead.fuente] || lead.fuente }),
            React.createElement(F, { label: 'Sin contacto', value: lead.dias + ' días', tone: lead.dias > 10 ? 'var(--bad)' : 'var(--text-1)' }),
            React.createElement('div', { style: { padding: '11px 0', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' } },
              React.createElement('span', { className: 'eyebrow' }, 'Responsable'),
              React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 7 } }, React.createElement(Avatar, { id: lead.resp, size: 24 }), React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-1)' } }, (BA.operadores.find(o => o.id === lead.resp) || BA.operadores[0]).short)))
          ),
          // próximo paso
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', background: 'var(--curso-bg)', borderRadius: 'var(--radius-sm)', marginBottom: 18 } },
            React.createElement(Icon, { name: 'send', style: { width: 17, height: 17, color: 'var(--curso)' } }),
            React.createElement('div', { style: { flex: 1, fontSize: 13 } }, React.createElement('div', { className: 'eyebrow', style: { marginBottom: 2 } }, 'Próximo paso'), lead.next)),
          // notas
          React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, 'Notas'),
          React.createElement('textarea', { value: nota, onChange: e => setNota(e.target.value), placeholder: 'Agregar una nota…',
            style: { width: '100%', minHeight: 64, padding: 11, borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--text-1)', fontSize: 13, resize: 'vertical', marginBottom: 18 } }),
          // acciones
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 } },
            React.createElement('button', { className: 'btn', onClick: () => { onClose(); nav('bandeja'); } }, React.createElement(Icon, { name: 'mail' }), 'Preparar mail'),
            React.createElement('button', { className: 'btn', onClick: () => toast('Generando propuesta PDF…') }, React.createElement(Icon, { name: 'download' }), 'Propuesta PDF'),
            React.createElement('button', { className: 'btn', onClick: () => toast('Plan de pagos generado') }, React.createElement(Icon, { name: 'coin' }), 'Plan de pagos'),
            s && React.createElement('button', { className: 'btn', onClick: () => { onClose(); openTrip(lead.salida); } }, React.createElement(Icon, { name: 'compass' }), 'Ver salida'))
        )
      )
    );
  }

  window.LeadDrawer = LeadDrawer;
})();
