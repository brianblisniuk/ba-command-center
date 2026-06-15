/* B&A · Configuración del negocio (apariencia · identidad · datos) → window.Configuracion (override) */
(function () {
  const { Icon, Avatar, CardHead } = window;
  const BA = window.BA;

  function Seg({ value, options, onChange }) {
    return React.createElement('div', { className: 'tb-seg' },
      options.map(o => React.createElement('button', { key: o.v, className: value === o.v ? 'on' : '', onClick: () => onChange(o.v) }, o.t)));
  }

  function Configuracion({ cur, op, toast, tweak, setTweak }) {
    const tw = tweak || {};
    const dark = !!tw.dark;
    const density = tw.density || 'regular';
    const accent = tw.accent || 'laurel';
    const set = (which, v) => {
      if (which === 'theme') setTweak('dark', v === 'dark');
      else if (which === 'density') setTweak('density', v);
      else if (which === 'accent') setTweak('accent', v);
      toast('Preferencia guardada');
    };

    const dataSources = [
      { t: 'Salidas · trips_board', ok: true, n: BA.salidas.length + ' viajes' },
      { t: 'Pipeline · leads_crm', ok: true, n: BA.leads.length + ' leads' },
      { t: 'Bandeja · emails + email-ai', ok: true, n: BA.bandeja.length + ' mensajes' },
      { t: 'Biblioteca · providers', ok: false, n: 'datos de ejemplo' },
      { t: 'Cobranzas · payments_due', ok: true, n: (BA.finanzas.cuotas ? BA.finanzas.cuotas.length : 0) + ' cuotas' },
      { t: 'Caja · cashflow_projection', ok: true, n: 'conectado' },
    ];

    function Card({ title, sub, children }) {
      return React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title }),
        sub && React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', marginTop: -8, marginBottom: 14 } }, sub),
        children);
    }
    function Row({ label, control }) {
      return React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '11px 0', borderBottom: '1px solid var(--rule-soft)' } },
        React.createElement('span', { style: { fontSize: 13, color: 'var(--text-1)', fontWeight: 550 } }, label), control);
    }

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Configuración')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Apariencia · identidad · estado de los datos'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'start' } },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--gap)' } },
          React.createElement(Card, { title: 'Apariencia', sub: 'Estos controles también están en el panel de Tweaks.' },
            React.createElement(Row, { label: 'Tema', control: React.createElement(Seg, { value: dark ? 'dark' : 'light', options: [{ v: 'light', t: 'Claro' }, { v: 'dark', t: 'Oscuro' }], onChange: v => set('theme', v) }) }),
            React.createElement(Row, { label: 'Densidad', control: React.createElement(Seg, { value: density, options: [{ v: 'regular', t: 'Cómodo' }, { v: 'compact', t: 'Compacto' }], onChange: v => set('density', v) }) }),
            React.createElement(Row, { label: 'Acento', control: React.createElement(Seg, { value: accent, options: [{ v: 'laurel', t: 'Laurel' }, { v: 'brass', t: 'Brass' }], onChange: v => set('accent', v) }) }),
            React.createElement(Row, { label: 'Moneda', control: React.createElement('span', { className: 'mono', style: { fontSize: 13, color: 'var(--text-2)' } }, cur + ' · cambie en la barra') })),
          React.createElement(Card, { title: 'Identidad', sub: 'Operadores con acceso a la consola.' },
            BA.operadores.map((o, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < BA.operadores.length - 1 ? '1px solid var(--rule-soft)' : 'none' } },
              React.createElement(Avatar, { id: o.id, size: 34 }),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-1)' } }, o.name, o.id === op.id && React.createElement('span', { className: 'badge go', style: { marginLeft: 8, padding: '1px 7px' } }, 'Vos')),
                React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, o.role)),
              React.createElement('span', { className: 'badge ghost' }, 'Activo'))),
            React.createElement('button', { className: 'btn', style: { width: '100%', marginTop: 12 }, onClick: () => toast('Invitar operador') }, React.createElement(Icon, { name: 'plus' }), 'Invitar operador'))
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--gap)' } },
          React.createElement(Card, { title: 'Estado de los datos', sub: 'Qué está conectado a datos reales y qué es de ejemplo.' },
            dataSources.map((d, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderBottom: i < dataSources.length - 1 ? '1px solid var(--rule-soft)' : 'none' } },
              React.createElement('span', { className: 'chk ' + (d.ok ? 'ok' : 'no'), style: { width: 20, height: 20, borderRadius: 7, display: 'grid', placeItems: 'center', flexShrink: 0, background: d.ok ? 'var(--go-bg)' : 'var(--risk-bg)', color: d.ok ? 'var(--go)' : 'var(--brass)' } }, React.createElement(Icon, { name: d.ok ? 'check' : 'clock', style: { width: 12, height: 12 } })),
              React.createElement('span', { className: 'mono', style: { flex: 1, fontSize: 12, color: 'var(--text-1)' } }, d.t),
              React.createElement('span', { style: { fontSize: 11.5, color: d.ok ? 'var(--go)' : 'var(--text-3)' } }, d.n)))),
          React.createElement(Card, { title: 'Marca' },
            React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 18 } }, BA.brand.name),
            React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 3 } }, '“' + BA.brand.tagline + '”'),
            React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' } },
              BA.brand.pilares.map((p, i) => React.createElement('span', { key: i, className: 'badge ' + (i === 0 ? 'go' : 'ghost') }, p))),
            React.createElement('div', { style: { display: 'flex', gap: 6, marginTop: 16 } },
              ['var(--laurel)', 'var(--brass)', 'var(--curso)', 'var(--bad)', 'var(--bone)'].map((c, i) => React.createElement('span', { key: i, style: { width: 34, height: 34, borderRadius: 9, background: c, border: '1px solid var(--rule)' } })))),
          React.createElement(Card, { title: 'Datos' },
            React.createElement('button', { className: 'btn', style: { width: '100%', marginBottom: 9 }, onClick: () => toast('Exportando backup…') }, React.createElement(Icon, { name: 'download' }), 'Exportar backup (JSON)'),
            React.createElement('button', { className: 'btn', style: { width: '100%' }, onClick: async () => { toast('Sincronizando…'); try { await BA.source.hydrate(); toast('Datos actualizados \u2713'); } catch (e) { toast('No se pudo sincronizar'); } } }, React.createElement(Icon, { name: 'refresh' }), 'Sincronizar ahora'))
        )
      )
    );
  }

  window.Configuracion = Configuracion;
})();
