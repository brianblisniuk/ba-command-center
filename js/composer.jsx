/* B&A · Redactor de correo → window.Composer (usa BA.source.sendEmail → edge fn email-send) */
(function () {
  const { useState } = React;
  const { Icon } = window;
  const inpStyle = { width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--text-1)', fontSize: 14, fontFamily: 'inherit' };

  function Composer({ initial, onClose, toast }) {
    initial = initial || {};
    const [para, setPara] = useState(initial.to || '');
    const [cuenta, setCuenta] = useState(initial.account || 'reservas');
    const [asunto, setAsunto] = useState(initial.subject || '');
    const [cuerpo, setCuerpo] = useState(initial.body || '');
    const [sending, setSending] = useState(false);

    async function enviar() {
      const to = (para || '').trim();
      if (!to || to.indexOf('@') < 0) { toast('Falta un destinatario válido'); return; }
      if (!asunto.trim()) { toast('Falta el asunto'); return; }
      setSending(true); toast('Enviando…');
      const res = await BA.source.sendEmail({ account: cuenta, to: to, subject: asunto, text: cuerpo });
      setSending(false);
      if (res && res.ok) {
        toast('Mail enviado a ' + to + ' ✓');
        if (initial.cadenceLeadId && BA.source.logCadenceStep) { try { await BA.source.logCadenceStep({ leadId: initial.cadenceLeadId, channel: 'email' }); } catch (e) {} }
        onClose();
      }
      else { toast('No se pudo enviar: ' + (res ? res.error : 'error')); }
    }

    return React.createElement('div', { className: 'wz-overlay', onClick: onClose },
      React.createElement('div', { className: 'modal', onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'modal-head' },
          React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: 'mail' })),
          React.createElement('h3', null, initial.name ? ('Escribir a ' + initial.name) : 'Nuevo correo'),
          React.createElement('button', { className: 'tb-icon', onClick: onClose }, React.createElement(Icon, { name: 'cl' }))),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'field' },
            React.createElement('label', null, 'Desde'),
            React.createElement('select', { value: cuenta, onChange: e => setCuenta(e.target.value), style: inpStyle },
              React.createElement('option', { value: 'reservas' }, 'reservas@blisniukamanov.com'),
              React.createElement('option', { value: 'info' }, 'info@blisniukamanov.com'))),
          React.createElement('div', { className: 'field' },
            React.createElement('label', null, 'Para'),
            React.createElement('input', { type: 'email', value: para, placeholder: 'destinatario@email.com', onChange: e => setPara(e.target.value) })),
          React.createElement('div', { className: 'field' },
            React.createElement('label', null, 'Asunto'),
            React.createElement('input', { type: 'text', value: asunto, onChange: e => setAsunto(e.target.value) })),
          React.createElement('div', { className: 'field', style: { marginBottom: 0 } },
            React.createElement('label', null, 'Mensaje'),
            React.createElement('textarea', { value: cuerpo, rows: 9, onChange: e => setCuerpo(e.target.value), style: Object.assign({}, inpStyle, { resize: 'vertical', lineHeight: 1.5 }) }))),
        React.createElement('div', { className: 'modal-foot' },
          React.createElement('button', { className: 'btn ghost', onClick: onClose }, 'Cancelar'),
          React.createElement('button', { className: 'btn primary', disabled: sending, style: sending ? { opacity: .7 } : null, onClick: enviar },
            React.createElement(Icon, { name: 'send' }), sending ? 'Enviando…' : 'Enviar'))));
  }
  window.Composer = Composer;
})();
