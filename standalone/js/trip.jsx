/* B&A · Plano Viaje (workspace de una salida) → window.Trip */
(function () {
  const { Icon, Ring, StatCard, Badge, Avatar, OccBar, CardHead, estadoMeta } = window;
  const { useState } = React;
  const BA = window.BA;

  const TABS = ['Resumen', 'Accesos', 'Itinerario', 'Ruta', 'Proveedores', 'Presupuesto', 'Reservas', 'Tareas', 'App cliente', 'Config'];
  const STAGES = ['identificado', 'contactado', 'negociando', 'confirmado'];
  const STAGE_LBL = { identificado: 'Identificado', contactado: 'Contactado', negociando: 'Negociando', confirmado: 'Confirmado' };

  function Mini({ label, value, unit, tone }) {
    return React.createElement('div', { className: 'card pad', style: { padding: '16px 18px' } },
      React.createElement('div', { className: 'stat-label', style: { marginBottom: 8 } }, label),
      React.createElement('div', { className: 'figure', style: { fontSize: 26, color: tone || 'var(--text-1)' } }, value,
        unit && React.createElement('span', { style: { fontSize: 13, color: 'var(--text-3)', marginLeft: 4, fontFamily: 'var(--ff-body)', fontWeight: 600 } }, unit)));
  }

  function Resumen({ s, cur, toast }) {
    const beOk = s.conf >= s.breakeven, accOk = s.accesosOk >= 2;
    const ready = beOk && accOk;
    const verdict = s.estado === 'curso' ? { t: 'En viaje', c: 'var(--curso)' } : ready ? { t: 'Sugerencia: GO', c: 'var(--go)' } : { t: s.dias <= 7 ? 'Riesgo: evaluar NO-GO' : 'Sostener — falta cerrar', c: s.dias <= 7 ? 'var(--bad)' : 'var(--brass)' };
    const col = verdict.c;
    return React.createElement('div', null,
      // GO/NO-GO
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Motor GO / NO-GO', right: React.createElement('span', { className: 'badge', style: { background: 'color-mix(in oklab,' + col + ' 14%, transparent)', color: col } }, verdict.t) }),
        React.createElement('div', { style: { display: 'flex', gap: 26, alignItems: 'center', flexWrap: 'wrap' } },
          React.createElement('div', { style: { position: 'relative', flexShrink: 0 } },
            React.createElement(Ring, { pct: s.readiness, size: 116, thick: 11, color: col }),
            React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' } },
              React.createElement('div', null,
                React.createElement('div', { className: 'figure', style: { fontSize: 30 } }, s.readiness),
                React.createElement('div', { className: 'eyebrow' }, 'readiness')))),
          React.createElement('div', { style: { flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 10 } },
            [[beOk, 'Break-even', s.conf + ' / ' + s.breakeven + ' confirmadas'],
             [accOk, 'Regla de los dos accesos', s.accesosOk + ' / ' + s.accesosTot + ' cerrados'],
             [s.dias > 7 || s.estado === 'curso', 'Margen de decisión', s.dias > 0 ? s.dias + ' días' : 'en curso']
            ].map((r, i) => React.createElement('div', { key: i, className: 'gng-reason', style: { fontSize: 13.5 } },
              React.createElement('span', { className: 'chk ' + (r[0] ? 'ok' : 'no') }, React.createElement(Icon, { name: r[0] ? 'check' : 'x' })),
              React.createElement('span', null, React.createElement('b', { style: { color: 'var(--text-1)' } }, r[1]), ' · ', r[2]))))
        )
      ),
      // KPIs
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(Mini, { label: 'Ocupación', value: s.conf, unit: '/ ' + s.min }),
        React.createElement(Mini, { label: 'Margen', value: '62%', tone: 'var(--go)' }),
        React.createElement(Mini, { label: 'Costo / pax', value: BA.money(s.precioUSD * 0.38, cur).replace(/\.\d+/, '') }),
        React.createElement(Mini, { label: 'Proveedores', value: s.accesosOk + 4, unit: 'conf' }),
        React.createElement(Mini, { label: 'P1 pendientes', value: 3, tone: 'var(--bad)' })
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'start' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Lo que sigue' }),
          React.createElement('div', { className: 'qitem', style: { marginBottom: 10 } },
            React.createElement('div', { className: 'q-ic risk' }, React.createElement(Icon, { name: 'key' })),
            React.createElement('div', { className: 'q-body' },
              React.createElement('div', { className: 'q-title' }, 'Cerrar el ' + (s.accesosTot - s.accesosOk) + '.º acceso'),
              React.createElement('div', { className: 'q-meta' }, 'Define si el viaje existe')),
            React.createElement('button', { className: 'btn sm primary', onClick: () => toast('Abriendo accesos…') }, 'Ver')),
          React.createElement('div', { className: 'qitem' },
            React.createElement('div', { className: 'q-ic info' }, React.createElement(Icon, { name: 'users' })),
            React.createElement('div', { className: 'q-body' },
              React.createElement('div', { className: 'q-title' }, 'Cerrar ' + Math.max(0, s.breakeven - s.conf) + ' reservas para break-even'),
              React.createElement('div', { className: 'q-meta' }, s.opcion + ' en opción · ' + s.libres + ' libres')),
            React.createElement('button', { className: 'btn sm', onClick: () => toast('Abriendo reservas…') }, 'Reservas'))
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Acceso del cliente' }),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' } },
              React.createElement('div', null, React.createElement('div', { className: 'eyebrow' }, 'Código de acceso'),
                React.createElement('div', { className: 'mono', style: { fontSize: 18, color: 'var(--text-1)', marginTop: 3, letterSpacing: '0.1em' } }, s.etiqueta.replace('·', '-'))),
              React.createElement('button', { className: 'btn sm', onClick: () => toast('Código copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar')),
            React.createElement('div', { style: { display: 'flex', gap: 9 } },
              React.createElement('button', { className: 'btn', style: { flex: 1 }, onClick: () => toast('Abriendo vista de cliente') }, React.createElement(Icon, { name: 'eye' }), 'Ver como cliente'),
              React.createElement('button', { className: 'btn', style: { flex: 1 }, onClick: () => toast('Link copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar link')))
        )
      )
    );
  }

  function Accesos({ s, toast }) {
    const [list, setList] = useState(BA.accesos.filter(a => a.salida === s.id).map(a => ({ ...a })));
    function advance(id) {
      setList(L => L.map(a => {
        if (a.id !== id) return a;
        const idx = STAGES.indexOf(a.etapa);
        const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
        if (next === 'confirmado' && a.etapa !== 'confirmado') toast(a.nombre.split('·')[0].trim() + ' · CONFIRMADO ✓');
        return { ...a, etapa: next };
      }));
    }
    const closed = list.filter(a => a.etapa === 'confirmado').length;
    return React.createElement('div', null,
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' } },
        React.createElement('div', { className: 'stat-ic brass', style: { width: 52, height: 52 } }, React.createElement(Icon, { name: 'key' })),
        React.createElement('div', { style: { flex: 1, minWidth: 200 } },
          React.createElement('div', { className: 'figure', style: { fontSize: 28 } }, closed, ' / ', list.length, ' accesos cerrados'),
          React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', marginTop: 4 } }, 'Sin dos encuentros, el viaje no sale. ', React.createElement('b', { style: { color: closed >= 2 ? 'var(--go)' : 'var(--bad)' } }, closed >= 2 ? 'Regla cumplida.' : 'Falta cerrar ' + (2 - closed) + '.'))),
        React.createElement('button', { className: 'btn', onClick: () => toast('Traer acceso desde Biblioteca') }, React.createElement(Icon, { name: 'book' }), 'Traer de Biblioteca')
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' } },
        list.map(a => {
          const idx = STAGES.indexOf(a.etapa);
          const conf = a.etapa === 'confirmado';
          return React.createElement('div', { key: a.id, className: 'card pad rise' },
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 14 } },
              React.createElement('div', { className: 'q-ic ' + (conf ? 'go' : 'risk'), style: { borderRadius: 11 } }, React.createElement(Icon, { name: 'key' })),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 650, color: 'var(--text-1)', lineHeight: 1.3 } }, a.nombre),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 2 } }, a.figura)),
              React.createElement(Avatar, { id: a.resp, size: 26 })),
            // stepper
            React.createElement('div', { style: { display: 'flex', gap: 5, marginBottom: 14 } },
              STAGES.map((st, i) => React.createElement('div', { key: st, style: { flex: 1 } },
                React.createElement('div', { style: { height: 5, borderRadius: 99, background: i <= idx ? (conf ? 'var(--go)' : 'var(--brass)') : 'var(--surface-sunk)' } }),
                React.createElement('div', { style: { fontSize: 8.5, marginTop: 5, textAlign: 'center', fontFamily: 'var(--ff-mono)', letterSpacing: '.03em', color: i === idx ? 'var(--text-1)' : 'var(--text-faint)', textTransform: 'uppercase' } }, STAGE_LBL[st].slice(0, 4))))),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 } },
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } },
                React.createElement('span', { style: { color: a.deadline.includes('hoy') ? 'var(--bad)' : 'var(--text-3)' } }, '⏱ ' + a.deadline),
                a.planb !== '—' && React.createElement('span', null, ' · plan B: ' + a.planb)),
              conf ? React.createElement('span', { className: 'badge go' }, React.createElement(Icon, { name: 'check', style: { width: 11, height: 11 } }), 'Confirmado')
                : React.createElement('button', { className: 'btn sm primary', onClick: () => advance(a.id) }, 'Avanzar'))
          );
        })
      )
    );
  }

  function Trip({ tripId, cur, toast, back, tab, setTab }) {
    const s = BA.salidaById(tripId);
    if (!s) return null;
    const accCount = BA.accesos.filter(a => a.salida === s.id).length;
    const brass = ['Gastro', 'Vino', 'A medida'].includes(s.cat);
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('button', { className: 'backlink', onClick: back }, React.createElement(Icon, { name: 'cl' }), 'Volver a Negocio'),
      React.createElement('div', { className: 'page-head', style: { alignItems: 'center' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
          React.createElement('div', { className: 'salida-glyph' + (brass ? ' brass' : ''), style: { width: 54, height: 54, fontSize: 24, borderRadius: 15 } }, s.glyph),
          React.createElement('div', null,
            React.createElement('h1', { style: { fontSize: 27 } }, s.titulo),
            React.createElement('div', { className: 'page-greet-sub', style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 } },
              React.createElement(Badge, { estado: s.estado }),
              React.createElement('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)' } }, s.fecha + ' · ' + s.pais),
              React.createElement(Avatar, { id: s.resp, size: 22 })))),
        React.createElement('div', { style: { display: 'flex', gap: 9 } },
          React.createElement('button', { className: 'btn', onClick: () => toast('Vista de cliente') }, React.createElement(Icon, { name: 'eye' }), 'Ver como cliente'))
      ),
      React.createElement('div', { className: 'tabs', style: { marginBottom: 'var(--gap)' } },
        TABS.map(t => React.createElement('button', { key: t, className: tab === t ? 'on' : '', onClick: () => setTab(t) },
          t, t === 'Accesos' && React.createElement('span', { className: 'b' }, s.accesosOk + '/' + accCount)))),
      tab === 'Resumen' ? React.createElement(Resumen, { s, cur, toast })
        : tab === 'Accesos' ? React.createElement(Accesos, { s, toast })
        : tab === 'Itinerario' ? React.createElement(window.Itinerario, { s, cur, toast })
        : tab === 'Ruta' ? React.createElement(window.Ruta, { s, cur, toast })
        : tab === 'Proveedores' ? React.createElement(window.Proveedores, { s, cur, toast })
        : tab === 'Presupuesto' ? React.createElement(window.Presupuesto, { s, cur, toast })
        : tab === 'Reservas' ? React.createElement(window.Reservas, { s, cur, toast })
        : tab === 'Tareas' ? React.createElement(window.Tareas, { s, toast })
        : tab === 'App cliente' ? React.createElement(window.AppCliente, { s, toast })
        : tab === 'Config' ? React.createElement(window.ConfigViaje, { s, toast })
        : React.createElement('div', { className: 'card' }, React.createElement('div', { className: 'stub' },
            React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: 'settings' })),
            React.createElement('h3', null, tab),
            React.createElement('p', null, 'Identidad, fechas, pax, basecamp, monedas y acceso del cliente — el meta editor del viaje.')))
    );
  }

  window.Trip = Trip;
})();
