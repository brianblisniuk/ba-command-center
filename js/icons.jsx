/* Pasaporte Negro · icon set (lucide-style) + chart primitives → window */
(function () {
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    funnel: '<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    coin: '<ellipse cx="12" cy="6" rx="8" ry="3.2"/><path d="M4 6v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6"/><path d="M4 12v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-6"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M17.5 14c2.5.5 4.5 2.6 4.5 5"/>',
    book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 4v13a3 3 0 0 0 3 3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    megaphone: '<path d="M3 11v2a2 2 0 0 0 2 2h1l8 4V5L6 9H5a2 2 0 0 0-2 2Z"/><path d="M14 7a4 4 0 0 1 0 10"/>',
    key: '<circle cx="8" cy="14" r="4.5"/><path d="m11 11 9-9"/><path d="m17 5 2.5 2.5M14 8l2.5 2.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10.5 21a2 2 0 0 0 3 0"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    cr: '<path d="m9 5 7 7-7 7"/>',
    cl: '<path d="m15 5-7 7 7 7"/>',
    cd: '<path d="m6 9 6 6 6-6"/>',
    au: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    ad: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 9v5M12 17.5v.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M6 16.5V11a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 14h2"/>',
    trending: '<path d="M3 17 9 11l4 4 8-8"/><path d="M21 7v5h-5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 20l1-6.1L3.2 9.5l6.1-.9z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    play: '<path d="M6 4l14 8-14 8z"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    download: '<path d="M12 3v12M7 11l5 5 5-5"/><path d="M5 21h14"/>',
    phone: '<path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    chat: '<path d="M4 5h16v11H9l-4 3v-3H4z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    arrowright: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="13" cy="18" r="2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  };

  function Icon({ name, style, className }) {
    const d = P[name] || P.more;
    return React.createElement('svg', {
      viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', width: '1em', height: '1em',
      strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
      style, className, dangerouslySetInnerHTML: { __html: d },
    });
  }

  // ---------- charts ----------
  function Spark({ data, color, w = 120, h = 38, fill = true }) {
    const max = Math.max(...data), min = Math.min(...data);
    const rng = max - min || 1;
    const pts = data.map((v, i) => [ (i / (data.length - 1)) * w, h - 4 - ((v - min) / rng) * (h - 8) ]);
    const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = line + ` L${w} ${h} L0 ${h} Z`;
    const id = 'sg' + Math.random().toString(36).slice(2, 7);
    return React.createElement('svg', { className: 'spark', viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'none' },
      React.createElement('defs', null,
        React.createElement('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 },
          React.createElement('stop', { offset: '0%', stopColor: color, stopOpacity: 0.25 }),
          React.createElement('stop', { offset: '100%', stopColor: color, stopOpacity: 0 }))),
      fill && React.createElement('path', { d: area, fill: `url(#${id})` }),
      React.createElement('path', { d: line, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' })
    );
  }

  // grouped/stacked bar chart (caja por mes / proyección)
  function BarChart({ data, keys, colors, h = 150, max }) {
    const W = 320, pad = 18, n = data.length;
    const vals = data.flatMap(d => keys.map(k => Number(d[k]) || 0));
    const top = max || Math.max(1, ...vals);
    const slot = (W - pad * 2) / n;
    const bw = Math.min(26, slot * 0.5);
    return React.createElement('svg', { className: 'barchart', viewBox: `0 0 ${W} ${h}`, preserveAspectRatio: 'none' },
      [0.25, 0.5, 0.75, 1].map((g, i) =>
        React.createElement('line', { key: 'g' + i, x1: pad, x2: W - pad, y1: (h - 22) * (1 - g) + 4, y2: (h - 22) * (1 - g) + 4, stroke: 'var(--rule-soft)', strokeWidth: 1 })),
      data.map((d, i) => {
        const cx = pad + slot * i + slot / 2;
        let yAcc = h - 22;
        return React.createElement('g', { key: i },
          keys.map((k, ki) => {
            const val = Number(d[k]) || 0; const bh = (val / top) * (h - 26);
            yAcc -= bh;
            return React.createElement('rect', { key: ki, x: cx - bw / 2, y: yAcc, width: bw, height: Math.max(0, bh), rx: 3, fill: colors[ki] });
          }),
          React.createElement('text', { x: cx, y: h - 6, textAnchor: 'middle', fontSize: 8.5, fill: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }, d.m)
        );
      })
    );
  }

  function Donut({ segments, size = 116, thick = 16 }) {
    const total = segments.reduce((s, x) => s + x.v, 0) || 1;
    const r = (size - thick) / 2, c = size / 2, circ = 2 * Math.PI * r;
    let off = 0;
    return React.createElement('svg', { width: size, height: size, viewBox: `0 0 ${size} ${size}`, style: { transform: 'rotate(-90deg)' } },
      React.createElement('circle', { cx: c, cy: c, r, fill: 'none', stroke: 'var(--surface-sunk)', strokeWidth: thick }),
      segments.map((s, i) => {
        const len = (s.v / total) * circ;
        const el = React.createElement('circle', { key: i, cx: c, cy: c, r, fill: 'none', stroke: s.color, strokeWidth: thick,
          strokeDasharray: `${len} ${circ - len}`, strokeDashoffset: -off, strokeLinecap: 'butt' });
        off += len; return el;
      })
    );
  }

  // progress ring (readiness / gonogo)
  function Ring({ pct, size = 64, thick = 7, color }) {
    const r = (size - thick) / 2, c = size / 2, circ = 2 * Math.PI * r;
    const len = (pct / 100) * circ;
    return React.createElement('svg', { width: size, height: size, viewBox: `0 0 ${size} ${size}`, style: { transform: 'rotate(-90deg)' } },
      React.createElement('circle', { cx: c, cy: c, r, fill: 'none', stroke: 'var(--surface-sunk)', strokeWidth: thick }),
      React.createElement('circle', { cx: c, cy: c, r, fill: 'none', stroke: color || 'var(--accent)', strokeWidth: thick,
        strokeDasharray: `${len} ${circ}`, strokeLinecap: 'round' })
    );
  }

  window.Icon = Icon;
  window.Spark = Spark;
  window.BarChart = BarChart;
  window.Donut = Donut;
  window.Ring = Ring;
})();
