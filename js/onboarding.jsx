/* B&A · Onboarding: Login / crear cuenta / reset · selector de identidad · wizard de nuevo viaje → window */
(function () {
  const { Icon, Avatar } = window;
  const { useState } = React;
  const BA = window.BA;

  // Hoisted field — identidad estable entre renders → el input NO se desmonta y mantiene el foco.
  function Field({ label, value, onChange, type, ph, onEnter }) {
    return React.createElement('div', { className: 'field' },
      React.createElement('label', null, label),
      React.createElement('input', { type: type || 'text', value: value, placeholder: ph, onChange: e => onChange(e.target.value), onKeyDown: e => { if (e.key === 'Enter' && onEnter) onEnter(); } }));
  }

  // Hoisted wizard field — mismo motivo; API value/onChange.
  function WizField({ label, value, onChange, ph, type, wide }) {
    return React.createElement('div', { className: 'field', style: { gridColumn: wide ? '1 / -1' : 'auto', marginBottom: 0 } },
      React.createElement('label', null, label),
      React.createElement('input', { type: type || 'text', value: value, placeholder: ph, onChange: e => onChange(type === 'number' ? +e.target.value : e.target.value) }));
  }

  // ============ AUTH (login / signup / reset / pick identity) ============
  function Auth({ onEnter }) {
    const [mode, setMode] = useState('login'); // login | signup | reset | identity
    const [email, setEmail] = useState('brianblisniuk@gmail.com');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [err, setErr] = useState('');
    const [busy, setBusy] = useState(false);

    const art = React.createElement('div', { className: 'auth-art' },
      React.createElement('div', { className: 'auth-mk' }, 'B'),
      React.createElement('div', { className: 'auth-quote' },
        React.createElement('h2', null, 'Acceso, ', React.createElement('em', null, 'autoría'), ', afinidad.'),
        React.createElement('p', null, 'Blisniuk & Amanov · Command Center')),
      React.createElement('div', { className: 'auth-meta' },
        React.createElement('div', { className: 'm' }, React.createElement('div', { className: 'v' }, BA.salidas.length), React.createElement('div', { className: 'k' }, 'Salidas')),
        React.createElement('div', { className: 'm' }, React.createElement('div', { className: 'v' }, BA.leads.length), React.createElement('div', { className: 'k' }, 'Leads activos')),
        React.createElement('div', { className: 'm' }, React.createElement('div', { className: 'v' }, 'US$ 261k'), React.createElement('div', { className: 'k' }, 'Forecast')))
    );

    async function go() {
      if (busy) return;
      setErr('');
      if (mode === 'login') {
        setBusy(true);
        const r = await BA.source.signIn(email, pass);
        setBusy(false);
        if (r && r.error) { setErr(r.error); return; }
        setMode('identity');
      } else if (mode === 'signup') {
        setMode('identity');
      } else if (mode === 'reset') {
        setBusy(true);
        const r = await BA.source.resetPassword(email);
        setBusy(false);
        setErr(r && r.error ? r.error : 'Si la cuenta existe, te llega un link para restablecer.');
      }
    }

    let card;
    if (mode === 'identity') {
      card = React.createElement('div', { className: 'auth-card' },
        React.createElement('h1', null, '¿Quién entra?'),
        React.createElement('div', { className: 'auth-sub' }, 'Elegí tu identidad de operador para esta sesión.'),
        React.createElement('div', { className: 'id-pick' },
          BA.operadores.map(o => React.createElement('button', { key: o.id, className: 'id-opt', onClick: () => onEnter(o.id) },
            React.createElement('span', { className: 'av', style: { background: 'linear-gradient(150deg,' + o.color + ',#1F2E20)' } }, o.initials),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { className: 'nm' }, o.name),
              React.createElement('div', { className: 'rl' }, o.role)),
            React.createElement(Icon, { name: 'cr', style: { color: 'var(--text-3)' } })))),
        React.createElement('div', { className: 'auth-alt' }, React.createElement('span', { className: 'auth-link', onClick: () => setMode('login') }, 'Volver')));
    } else {
      const titles = { login: ['Bienvenido de nuevo', 'Ingresá a tu centro de operaciones.'], signup: ['Crear cuenta', 'Sumate a la consola de B&A.'], reset: ['Recuperar acceso', 'Te mandamos un link para restablecer la contraseña.'] };
      card = React.createElement('div', { className: 'auth-card' },
        React.createElement('h1', null, titles[mode][0]),
        React.createElement('div', { className: 'auth-sub' }, titles[mode][1]),
        mode === 'signup' && React.createElement(Field, { label: 'Nombre', value: name, onChange: setName, ph: 'Tu nombre', onEnter: go }),
        React.createElement(Field, { label: 'Email', value: email, onChange: setEmail, type: 'email', onEnter: go }),
        mode !== 'reset' && React.createElement(Field, { label: 'Contraseña', value: pass, onChange: setPass, type: 'password', onEnter: go }),
        mode === 'login' && React.createElement('div', { className: 'auth-row' },
          React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-3)', textTransform: 'none', letterSpacing: 0 } },
            React.createElement('input', { type: 'checkbox', defaultChecked: true, style: { width: 'auto' } }), 'Recordarme'),
          React.createElement('span', { className: 'auth-link', onClick: () => setMode('reset') }, '¿Olvidaste tu contraseña?')),
        err && React.createElement('div', { style: { color: '#C0563A', fontSize: 12.5, margin: '2px 0 6px', lineHeight: 1.35 } }, err),
        React.createElement('button', { className: 'btn primary', style: { width: '100%', padding: '11px', fontSize: 14, marginTop: mode === 'reset' ? 8 : 0, opacity: busy ? .7 : 1 }, onClick: go, disabled: busy },
          busy ? (mode === 'reset' ? 'Enviando…' : 'Ingresando…') : (mode === 'login' ? 'Ingresar' : mode === 'signup' ? 'Crear cuenta' : 'Enviar link')),
        mode === 'reset'
          ? React.createElement('div', { className: 'auth-alt' }, React.createElement('span', { className: 'auth-link', onClick: () => setMode('login') }, 'Volver a ingresar'))
          : React.createElement(React.Fragment, null,
              React.createElement('div', { className: 'auth-divider' }, 'O'),
              React.createElement('div', { className: 'auth-alt' },
                mode === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? ',
                React.createElement('span', { className: 'auth-link', onClick: () => setMode(mode === 'login' ? 'signup' : 'login') }, mode === 'login' ? 'Crear una' : 'Ingresá'))));
    }
    return React.createElement('div', { className: 'auth' }, art, React.createElement('div', { className: 'auth-form' }, card));
  }

  // ============ WIZARD de nuevo viaje (6 pasos) ============
  const PASOS = ['Categoría', 'Identidad', 'Fechas', 'Grupo', 'Acceso', 'Revisar'];
  function NewTripWizard({ onClose, toast, op }) {
    const [step, setStep] = useState(0);
    const [d, setD] = useState({ cat: null, titulo: '', etiqueta: '', region: '', pais: '', inicio: '', noches: 6, pax: 6, min: 5, ticket: 9000, resp: op.id });
    const cat = BA.categorias.find(c => c.id === d.cat);
    const set = (k, v) => setD(s => ({ ...s, [k]: v }));
    const canNext = step === 0 ? !!d.cat : step === 1 ? d.titulo.trim().length > 2 : true;

    let body;
    if (step === 0) body = React.createElement('div', null,
      React.createElement('h2', null, '¿Qué tipo de viaje?'),
      React.createElement('div', { className: 'lead' }, 'La categoría define la paleta y los tipos de proveedor sugeridos.'),
      React.createElement('div', { className: 'wz-cats' },
        BA.categorias.map(c => React.createElement('div', { key: c.id, className: 'wz-cat' + (d.cat === c.id ? ' on' : ''), onClick: () => { set('cat', c.id); set('etiqueta', c.id.slice(0, 3).toUpperCase() + '·26'); } },
          React.createElement('div', { className: 'g', style: { background: c.accent } }, c.glyph),
          React.createElement('div', { className: 't' }, c.id),
          React.createElement('div', { className: 'd' }, c.desc),
          React.createElement('div', { className: 'chips' }, c.tipos.slice(0, 3).map((t, i) => React.createElement('span', { key: i, className: 'tag', style: { padding: '2px 7px' } }, t)))))));
    else if (step === 1) body = React.createElement('div', null,
      React.createElement('h2', null, 'Identidad del viaje'),
      React.createElement('div', { className: 'lead' }, 'Nombre, etiqueta corta y geografía.'),
      React.createElement('div', { className: 'wz-grid' },
        React.createElement(WizField, { label: 'Título', value: d.titulo, onChange: v => set('titulo', v), ph: cat ? cat.id + ' · ...' : 'Título del viaje', wide: true }),
        React.createElement(WizField, { label: 'Etiqueta corta', value: d.etiqueta, onChange: v => set('etiqueta', v), ph: 'PIE·26' }),
        React.createElement('div', { className: 'field', style: { marginBottom: 0 } }, React.createElement('label', null, 'Categoría'), React.createElement('input', { value: d.cat || '', disabled: true })),
        React.createElement(WizField, { label: 'Región', value: d.region, onChange: v => set('region', v), ph: 'Le Langhe' }),
        React.createElement(WizField, { label: 'País', value: d.pais, onChange: v => set('pais', v), ph: 'Italia' })));
    else if (step === 2) body = React.createElement('div', null,
      React.createElement('h2', null, 'Fechas'),
      React.createElement('div', { className: 'lead' }, 'Cuándo sale y cuántas noches.'),
      React.createElement('div', { className: 'wz-grid' },
        React.createElement(WizField, { label: 'Fecha de inicio', value: d.inicio, onChange: v => set('inicio', v), type: 'date' }),
        React.createElement(WizField, { label: 'Noches', value: d.noches, onChange: v => set('noches', v), type: 'number' })));
    else if (step === 3) body = React.createElement('div', null,
      React.createElement('h2', null, 'Grupo y precio'),
      React.createElement('div', { className: 'lead' }, 'Tamaño del grupo, mínimo para break-even y ticket por pax.'),
      React.createElement('div', { className: 'wz-grid' },
        React.createElement(WizField, { label: 'Pax total', value: d.pax, onChange: v => set('pax', v), type: 'number' }),
        React.createElement(WizField, { label: 'Mínimo (break-even)', value: d.min, onChange: v => set('min', v), type: 'number' }),
        React.createElement(WizField, { label: 'Ticket US$ / pax', value: d.ticket, onChange: v => set('ticket', v), type: 'number', wide: true })));
    else if (step === 4) body = React.createElement('div', null,
      React.createElement('h2', null, 'Responsable'),
      React.createElement('div', { className: 'lead' }, 'Quién lidera esta salida. La regla de los dos accesos se activa al crearla.'),
      React.createElement('div', { className: 'id-pick' },
        BA.operadores.map(o => React.createElement('button', { key: o.id, className: 'id-opt', style: d.resp === o.id ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--go-bg)' } : null, onClick: () => set('resp', o.id) },
          React.createElement(Avatar, { id: o.id, size: 40 }),
          React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { className: 'nm' }, o.name), React.createElement('div', { className: 'rl' }, o.role)),
          d.resp === o.id && React.createElement(Icon, { name: 'check', style: { color: 'var(--go)' } })))),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, padding: '12px 14px', background: 'var(--risk-bg)', borderRadius: 'var(--radius-sm)' } },
        React.createElement(Icon, { name: 'key', style: { width: 17, height: 17, color: 'var(--brass)' } }),
        React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-2)' } }, 'Se crearán ', React.createElement('b', null, '2 slots de Acceso'), ' por defecto — sin dos encuentros confirmados, el viaje no sale.')));
    else body = React.createElement('div', null,
      React.createElement('h2', null, 'Revisá y creá'),
      React.createElement('div', { className: 'lead' }, 'Todo listo para empezar a producir.'),
      React.createElement('div', { className: 'wz-review' },
        [['Categoría', d.cat], ['Título', d.titulo || '—'], ['Etiqueta', d.etiqueta || '—'], ['Destino', (d.region || '—') + (d.pais ? ' · ' + d.pais : '')], ['Inicio', d.inicio || '—'], ['Noches', d.noches], ['Grupo', d.pax + ' pax · mín ' + d.min], ['Ticket', 'US$ ' + d.ticket + ' / pax'], ['Responsable', BA.operadores.find(o => o.id === d.resp).name]]
          .map((r, i) => React.createElement('div', { key: i, className: 'kv' }, React.createElement('span', { className: 'k' }, r[0]), React.createElement('span', { className: 'v' }, r[1])))));

    function next() { if (step < PASOS.length - 1) setStep(step + 1); else { toast('Viaje «' + (d.titulo || d.cat) + '» creado ✓'); onClose(); } }

    return React.createElement('div', { className: 'wz-overlay', onClick: onClose },
      React.createElement('div', { className: 'wz', onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'wz-head' },
          React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 17, whiteSpace: 'nowrap' } }, 'Nueva salida'),
          React.createElement('div', { className: 'wz-steps' },
            PASOS.map((p, i) => React.createElement('div', { key: i, className: 'wz-step' + (i < step ? ' done' : i === step ? ' now' : '') }))),
          React.createElement('button', { className: 'drawer-close', onClick: onClose }, React.createElement(Icon, { name: 'x' }))),
        React.createElement('div', { className: 'wz-body' }, body),
        React.createElement('div', { className: 'wz-foot' },
          React.createElement('span', { className: 'eyebrow' }, 'Paso ' + (step + 1) + ' de ' + PASOS.length + ' · ' + PASOS[step]),
          React.createElement('div', { style: { display: 'flex', gap: 9 } },
            step > 0 && React.createElement('button', { className: 'btn', onClick: () => setStep(step - 1) }, React.createElement(Icon, { name: 'cl' }), 'Atrás'),
            React.createElement('button', { className: 'btn primary', disabled: !canNext, style: canNext ? null : { opacity: .5, pointerEvents: 'none' }, onClick: next },
              step === PASOS.length - 1 ? 'Crear viaje' : 'Siguiente', React.createElement(Icon, { name: step === PASOS.length - 1 ? 'check' : 'cr' }))))
      )
    );
  }

  window.Auth = Auth;
  window.NewTripWizard = NewTripWizard;
})();
