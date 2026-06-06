/* B&A · Reporte ejecutivo mensual (imprimible / PDF) → window.Reporte */
(function () {
  const { Icon, Badge, estadoMeta } = window;
  const BA = window.BA;

  function Reporte({ cur, toast }) {
    const e = BA.estado, f = BA.finanzas, fx = BA.fx, sym = BA.sym;
    const k = v => sym[cur] + ' ' + Math.round(v * (fx[cur] / fx.USD)) + 'k';
    const activas = e.salidasActivas.go + e.salidasActivas.risk + e.salidasActivas.opcion + e.salidasActivas.curso;
    const sal = BA.salidas.filter(s => s.grupo !== 'confirmada' || s.estado === 'curso');

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'report-toolbar no-print' },
        React.createElement('div', null,
          React.createElement('h1', { style: { fontSize: 26 } }, React.createElement('span', { className: 'lt' }, 'Reporte ejecutivo')),
          React.createElement('div', { className: 'page-greet-sub' }, 'Estado del negocio · para vos, el board o el futuro co-fundador')),
        React.createElement('button', { className: 'btn primary', onClick: () => { toast('Abriendo diálogo de impresión…'); setTimeout(() => window.print(), 250); } },
          React.createElement(Icon, { name: 'download' }), 'Imprimir / Guardar PDF')
      ),
      React.createElement('div', { className: 'report-sheet' },
        // header
        React.createElement('div', { className: 'rep-h' },
          React.createElement('div', null,
            React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 26, letterSpacing: '-0.01em' } }, 'Blisniuk ', React.createElement('em', { style: { fontStyle: 'italic', color: 'var(--brass)' } }, '& '), 'Amanov'),
            React.createElement('div', { className: 'eyebrow', style: { marginTop: 5 } }, BA.brand.tagline)),
          React.createElement('div', { style: { textAlign: 'right' } },
            React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 19 } }, 'Reporte ejecutivo'),
            React.createElement('div', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)', marginTop: 4 } }, BA.calMes.nombre))
        ),
        // estado del negocio
        React.createElement('div', { className: 'rep-sec' },
          React.createElement('span', { className: 'eyebrow' }, '01 · Estado del negocio'),
          React.createElement('div', { className: 'rep-kpis' },
            [[activas + ' salidas', 'Activas', e.salidasActivas.go + ' GO · ' + e.salidasActivas.risk + ' en riesgo'],
             [e.butacas.vendidas + ' / ' + e.butacas.breakeven, 'Butacas vs break-even', 'capacidad ' + e.butacas.capacidad],
             [k(e.forecast.val), 'Forecast', 'sobre ' + activas + ' salidas activas'],
             [String(e.leadsCalientes), 'Leads calientes', 'pipeline ' + k(e.leadsCalientesPipeUSD)]
            ].map((c, i) => React.createElement('div', { key: i, className: 'rep-kpi' },
              React.createElement('div', { className: 'v' }, c[0]),
              React.createElement('div', { className: 'l' }, c[1]),
              React.createElement('div', { className: 's' }, c[2]))))
        ),
        // caja
        React.createElement('div', { className: 'rep-sec' },
          React.createElement('span', { className: 'eyebrow' }, '02 · Caja del mes'),
          React.createElement('div', { className: 'rep-kpis', style: { gridTemplateColumns: 'repeat(3,1fr)' } },
            [[k(f.totales.cobradoMes / 1000), 'Cobrado', 'var(--go)'], [k(f.totales.porCobrar / 1000), 'Por cobrar', 'var(--brass)'], [k(f.totales.vencido / 1000), 'Vencido', 'var(--bad)']]
              .map((c, i) => React.createElement('div', { key: i, className: 'rep-kpi' },
                React.createElement('div', { className: 'v', style: { color: c[2] } }, c[0]),
                React.createElement('div', { className: 'l' }, c[1]))))
        ),
        // salidas
        React.createElement('div', { className: 'rep-sec' },
          React.createElement('span', { className: 'eyebrow' }, '03 · Salidas'),
          React.createElement('table', { className: 'tbl' },
            React.createElement('thead', null, React.createElement('tr', null, ['Salida', 'Fecha', 'Estado', 'Ocup.', 'Accesos', 'Readiness', 'Forecast'].map((h, i) => React.createElement('th', { key: i, style: i > 2 ? { textAlign: 'right' } : null }, h)))),
            React.createElement('tbody', null, sal.map((s, i) => React.createElement('tr', { key: i },
              React.createElement('td', null, React.createElement('span', { className: 'nm' }, s.region)),
              React.createElement('td', { className: 'mono', style: { fontSize: 11 } }, s.fecha),
              React.createElement('td', null, React.createElement(Badge, { estado: s.estado })),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, s.conf + '/' + s.min),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, s.accesosOk + '/' + s.accesosTot),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, s.readiness + '%'),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, s.forecastUSD ? k(s.forecastUSD) : '—'))))
          )
        ),
        // pipeline + atribución
        React.createElement('div', { className: 'rep-sec', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 } },
          React.createElement('div', null,
            React.createElement('span', { className: 'eyebrow' }, '04 · Pipeline'),
            BA.funnel.map((fn, i) => React.createElement('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--rule-soft)', fontSize: 13 } },
              React.createElement('span', { style: { color: 'var(--text-2)' } }, fn.etapa),
              React.createElement('span', { className: 'mono', style: { color: 'var(--text-1)' } }, fn.n + ' · US$ ' + fn.valUSD + 'k')))),
          React.createElement('div', null,
            React.createElement('span', { className: 'eyebrow' }, '05 · Atribución'),
            BA.marketing.atribucion.map((a, i) => React.createElement('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--rule-soft)', fontSize: 13 } },
              React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--text-2)' } }, React.createElement('i', { style: { width: 8, height: 8, borderRadius: 2, background: a.color } }), a.fuente),
              React.createElement('span', { className: 'mono', style: { color: 'var(--text-1)' } }, a.conv + '% · US$ ' + a.revUSD + 'k'))))
        ),
        React.createElement('div', { style: { borderTop: '1px solid var(--rule)', marginTop: 26, paddingTop: 14, fontSize: 10.5, color: 'var(--text-faint)', fontFamily: 'var(--ff-mono)', display: 'flex', justifyContent: 'space-between' } },
          React.createElement('span', null, 'Generado por el Command Center · ' + BA.calMes.nombre),
          React.createElement('span', null, 'Confidencial'))
      )
    );
  }

  window.Reporte = Reporte;
})();
