/* B&A · generadores de datos del Plano Viaje (por salida) → BA.tripData(id) */
(function () {
  const BA = window.BA;

  // slot/provider type → etiqueta + color
  const STYPE = {
    meal:     { t: 'Gastronomía', c: 'var(--laurel)' },
    wine:     { t: 'Vino',        c: 'var(--brass)' },
    lodging:  { t: 'Alojamiento', c: 'var(--curso)' },
    activity: { t: 'Actividad',   c: 'var(--laurel-soft)' },
    transfer: { t: 'Traslado',    c: 'var(--stone)' },
    culture:  { t: 'Cultura',     c: 'var(--curso)' },
    access:   { t: 'Acceso',      c: 'var(--brass)' },
  };
  BA.STYPE = STYPE;

  // pools de slots por categoría
  const POOLS = {
    Gastro: [
      ['meal', 'Almuerzo en trattoria de pueblo', 'Cocina de mercado, pastas frescas del día'],
      ['wine', 'Cata vertical en bodega histórica', 'Verticales del productor + maridaje'],
      ['access', 'Cena privada con el chef', 'Encuentro a puertas cerradas — pilar Acceso'],
      ['culture', 'Mercado con productor local', 'Recorrido de quesos, embutidos y trufa'],
      ['activity', 'Taller de pasta artesanal', 'Manos a la masa con una nonna'],
    ],
    Vino: [
      ['wine', 'Visita a viñedo de altura', 'Recorrido de parcelas + degustación'],
      ['meal', 'Almuerzo entre las vides', 'Mesa larga con vista al valle'],
      ['access', 'Cata con el enólogo', 'Encuentro privado — pilar Acceso'],
      ['culture', 'Historia de la denominación', 'Charla con un referente de la región'],
    ],
    Cultura: [
      ['culture', 'Recorrido por la ciudad antigua', 'Patios, madrasas y mercados'],
      ['access', 'Té con artesano local', 'Encuentro privado en su taller — Acceso'],
      ['activity', 'Taller de cerámica / textil', 'Práctica con un maestro artesano'],
      ['meal', 'Cena de cocina regional', 'Mesa con anfitrión local'],
    ],
    Naturaleza: [
      ['activity', 'Excursión al amanecer', 'Salida temprana con guía naturalista'],
      ['access', 'Encuentro con guía local', 'Saber ancestral — pilar Acceso'],
      ['lodging', 'Lodge en la reserva', 'Noche bajo el cielo abierto'],
      ['culture', 'Astronomía del desierto', 'Cielos sin contaminación lumínica'],
    ],
    Invierno: [
      ['activity', 'Salida en trineo / esquí', 'Jornada en la nieve con guía'],
      ['access', 'Cena en refugio de montaña', 'Encuentro privado — pilar Acceso'],
      ['lodging', 'Hotel alpino', 'Spa y descanso junto al fuego'],
      ['culture', 'Pueblo de montaña', 'Recorrido a pie y café local'],
    ],
    'A medida': [
      ['activity', 'Día de partido', 'Logística completa y traslados'],
      ['access', 'Acceso a zona VIP del estadio', 'Coordinación a medida — Acceso'],
      ['meal', 'Cena de celebración', 'Restaurante seleccionado del grupo'],
      ['transfer', 'Traslado privado', 'Chofer dedicado puerta a puerta'],
    ],
  };

  function hh(h) { return (h < 10 ? '0' + h : h) + ':00'; }

  function buildItinerario(s) {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const N = ({ uzb: 5, pie: 6, nam: 6, eng: 5, lap: 5, jpn: 6, rud: 6, mun: 5 })[s.id] || 5;
    const pool = POOLS[s.cat] || POOLS.Cultura;
    const out = [];
    for (let d = 0; d < N; d++) {
      const slots = [];
      const isArrival = d === 0;
      if (isArrival) slots.push({ time: hh(15), end: hh(16), type: 'transfer', title: 'Llegada y traslado al basecamp', desc: 'Recepción y check-in', verdict: 'Confirmado', client: true });
      const base = 9 + (isArrival ? 0 : 0);
      const count = isArrival ? 1 : (d === N - 1 ? 2 : 3);
      let hour = isArrival ? 17 : 9;
      for (let i = 0; i < count; i++) {
        const tpl = pool[(d + i) % pool.length];
        const dur = tpl[0] === 'meal' || tpl[0] === 'access' ? 2 : 2;
        const conflict = d === 1 && i === 1; // un conflicto de muestra
        slots.push({
          time: hh(hour), end: hh(hour + dur), type: tpl[0], title: tpl[1], desc: tpl[2],
          verdict: tpl[0] === 'access' ? (s.accesosOk > i ? 'Confirmado' : 'En gestión') : 'Confirmado',
          client: tpl[0] !== 'access' || true, conflict,
          access: tpl[0] === 'access',
        });
        hour += dur + 1;
      }
      const free = Math.max(0, 21 - hour);
      out.push({
        n: d + 1, dow: dias[d % 7], cover: d % 2 ? 'var(--laurel)' : 'var(--laurel-deep)',
        title: isArrival ? 'Llegada · ' + s.region : d === N - 1 ? 'Despedida' : s.region + ' · día ' + (d + 1),
        slots, free, estUSD: Math.round(s.precioUSD * 0.12 / 100) * 100,
      });
    }
    return out;
  }

  const PROV_NAMES = {
    Gastro: [['restaurant', 'Trattoria della Posta'], ['restaurant', 'Osteria del Borgo', 1], ['winery', 'Cascina Adelaide'], ['winery', 'Tenuta dei Langhe'], ['hotel', 'Relais San Maurizio'], ['guide', 'Guía gastronómico local'], ['transfer', 'Transfer Langhe']],
    Vino: [['winery', 'Viñedo de Altura'], ['winery', 'Bodega del Valle'], ['restaurant', 'Mesa entre Vides', 1], ['hotel', 'Hotel Vendimia'], ['guide', 'Sommelier de la casa'], ['transfer', 'Transfer Valle']],
    Cultura: [['hotel', 'Caravanserai Boutique'], ['restaurant', 'Cocina de la Ruta'], ['activity', 'Taller de Rishtan'], ['guide', 'Historiador local'], ['transfer', 'Chofer privado'], ['restaurant', 'Patio de Bujará']],
    Naturaleza: [['lodging', 'Kulala Desert Lodge'], ['activity', 'Globos Namib Sky'], ['guide', 'Guía bosquimano'], ['transfer', '4x4 con chofer'], ['activity', 'Astronomía Kalahari']],
    Invierno: [['hotel', 'Hotel Alpino'], ['activity', 'Escuela de esquí'], ['restaurant', 'Refugio de montaña', 1], ['guide', 'Guía de montaña'], ['transfer', 'Transfer alpino']],
    'A medida': [['hotel', 'Hotel del grupo'], ['transfer', 'Chofer dedicado'], ['activity', 'Coordinación estadio'], ['restaurant', 'Cena de celebración']],
  };
  function buildProveedores(s) {
    const pool = PROV_NAMES[s.cat] || PROV_NAMES.Cultura;
    const states = ['confirmada', 'conversando', 'pendiente'];
    return pool.map((p, i) => ({
      tipo: p[0], nombre: p[1], michelin: p[2] || 0,
      lugar: s.region, precioUSD: [220, 180, 90, 140, 60, 0][i % 6],
      estado: states[i % 3], cierra: ['lun', 'mar', '—', 'mié', '—'][i % 5],
    }));
  }

  function buildPresupuesto(s) {
    const pax = Math.max(s.conf, s.min);
    const cats = [
      { cat: 'Alojamiento', pct: 0.30 }, { cat: 'Gastronomía', pct: 0.22 }, { cat: 'Accesos', pct: 0.14 },
      { cat: 'Transporte', pct: 0.16 }, { cat: 'Guías', pct: 0.10 }, { cat: 'Varios', pct: 0.08 },
    ];
    const ticket = s.precioUSD || 9000;
    const costoPax = ticket * 0.38;
    const lineas = cats.map(c => ({ cat: c.cat, montoUSD: Math.round(costoPax * pax * c.pct), pct: c.pct }));
    const costoTotal = lineas.reduce((a, l) => a + l.montoUSD, 0);
    const ingreso = ticket * pax;
    const margen = ingreso ? Math.round((1 - costoTotal / ingreso) * 100) : 0;
    return { pax, ticket, lineas, costoTotal, ingreso, costoPax: Math.round(costoTotal / pax), margen };
  }

  function buildReservas(s) {
    const pipeline = BA.leads.filter(l => l.salida === s.id);
    const nombres = ['Familia Ríos', 'A. Bestani', 'Grupo Salvi', 'Familia Wong', 'R. Daneri', 'C. Iturbe', 'Familia Soto', 'M. Okamoto'];
    const confirmados = [];
    for (let i = 0; i < s.conf; i++) {
      confirmados.push({
        nombre: nombres[i % nombres.length], pax: 2, pagado: 100 - (i % 3) * 33,
        cuota: ['Pagado', '2/3', 'seña'][i % 3],
        alergias: i % 2 ? 'Sin lácteos' : '—', movilidad: i === 1 ? 'Reducida' : 'OK',
      });
    }
    return { confirmados, pipeline };
  }

  function buildTareas(s) {
    return [
      { p: 'P1', tipo: 'reserva', t: 'Cerrar el acceso pendiente', done: false },
      { p: 'P1', tipo: 'contacto', t: 'Confirmar seña de ' + (s.conf > 0 ? 'la última reserva' : 'primer pax'), done: false },
      { p: 'P2', tipo: 'logística', t: 'Reconfirmar traslados internos', done: false },
      { p: 'P2', tipo: 'compra', t: 'Bloquear habitaciones del basecamp', done: true },
      { p: 'P3', tipo: 'research', t: 'Relevar opción B para la cena del día 3', done: false },
      { p: 'P3', tipo: 'otro', t: 'Cargar fotos de portada del itinerario', done: true },
    ];
  }

  BA.tripData = function (id) {
    const s = BA.salidaById(id);
    if (!s) return null;
    return {
      itinerario: buildItinerario(s),
      proveedores: buildProveedores(s),
      presupuesto: buildPresupuesto(s),
      reservas: buildReservas(s),
      tareas: buildTareas(s),
    };
  };
})();
