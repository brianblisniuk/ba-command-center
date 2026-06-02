/* B&A · datos extendidos (V2): eventos de lead, biblioteca de proveedores,
   bitácora de cambios, cuerpos de cadencia, clientes. Se acoplan a window.BA. */
(function () {
  const BA = window.BA;

  // ---- Timeline de eventos por lead (lead_full_detail.events[]) ----
  // kind: created|stage|note|email|whatsapp|call|payment|task
  BA.leadEvents = {
    l1: [ // Carla Ferro · Negociación
      { kind:'created', who:'Sistema', t:'Lead capturado desde referido (R. Daneri)', when:'hace 9 días' },
      { kind:'email',   who:'Federico', t:'Envío de propuesta Piemonte · Le Langhe', when:'hace 8 días' },
      { kind:'stage',   who:'Federico', t:'Contactados → Propuesta', when:'hace 7 días' },
      { kind:'call',    who:'Federico', t:'Llamada de 22 min · le encantó el itinerario', when:'hace 4 días' },
      { kind:'stage',   who:'Federico', t:'Propuesta → Negociación', when:'hace 3 días' },
      { kind:'whatsapp',who:'Carla',    t:'«Esta semana hago la seña, ¿me pasás los datos?»', when:'hace 3 h' },
      { kind:'note',    who:'Federico', t:'Pide arrancar plan de pagos 50+3. Cierre inminente.', when:'hace 2 h' },
    ],
    l2: [
      { kind:'created', who:'Meta Ads', t:'Lead desde campaña «Japón · Cultura»', when:'hace 14 días' },
      { kind:'email',   who:'Brian',    t:'Primer contacto + brochure', when:'hace 13 días' },
      { kind:'stage',   who:'Brian',    t:'Contactados → Propuesta', when:'hace 11 días' },
      { kind:'note',    who:'Brian',    t:'Sin respuesta hace 11 días. Entró en cadencia de reactivación.', when:'hace 1 día' },
    ],
    l4: [
      { kind:'created', who:'Meta Ads', t:'Lead desde campaña «Namibia · Naturaleza»', when:'hoy 10:58' },
      { kind:'whatsapp',who:'Familia Ortega', t:'«Somos 4, ¿quedan lugares para noviembre?»', when:'hoy 10:59' },
    ],
    l7: [
      { kind:'created', who:'Web',      t:'Formulario de contacto · Namibia', when:'hace 19 días' },
      { kind:'email',   who:'Brian',    t:'Respuesta inicial + fechas', when:'hace 18 días' },
      { kind:'stage',   who:'Brian',    t:'Nuevos → Contactados', when:'hace 18 días' },
      { kind:'note',    who:'Brian',    t:'Grupo grande (Vega Holding). 18 días sin tocar — enfriándose.', when:'hace 2 días' },
    ],
  };
  // fallback genérico para leads sin timeline propio
  BA.leadEventsFor = function (lead) {
    if (BA.leadEvents[lead.id]) return BA.leadEvents[lead.id];
    return [
      { kind:'created', who: lead.fuente === 'referral' ? 'Referido' : lead.fuente === 'meta_ads' ? 'Meta Ads' : 'Web', t:'Lead capturado', when:'hace ' + (lead.dias + 4) + ' días' },
      { kind:'email',   who: BA.operadores.find(o=>o.id===lead.resp).short, t:'Primer contacto enviado', when:'hace ' + (lead.dias + 2) + ' días' },
      { kind:'stage',   who: BA.operadores.find(o=>o.id===lead.resp).short, t:'Avanzó a ' + lead.etapa, when:'hace ' + Math.max(1, lead.dias - 1) + ' días' },
      { kind:'note',    who: BA.operadores.find(o=>o.id===lead.resp).short, t: lead.next, when:'hace ' + lead.dias + ' días' },
    ];
  };

  // ---- Plan de pagos por política B&A (según meses a la salida) ----
  BA.planDePago = function (lead) {
    const s = BA.salidaById(lead.salida);
    const total = lead.potUSD * 1000;
    // política: 100% (<3m), 50+50 (3–6m), 50 + 3 cuotas (6–18m). Todo ≥30 días antes.
    const meses = s ? Math.max(1, Math.round((s.dias || 30) / 30)) : 4;
    if (meses < 3) return { politica: '100% por adelantado', cuotas: [{ label: 'Pago único', pct: 100, monto: total }] };
    if (meses <= 6) return { politica: '50 + 50', cuotas: [{ label: 'Seña 50%', pct: 50, monto: total/2 }, { label: 'Saldo 50% (≥30d antes)', pct: 50, monto: total/2 }] };
    return { politica: '50 + 3 cuotas', cuotas: [
      { label: 'Seña 50%', pct: 50, monto: total*0.5 },
      { label: 'Cuota 1', pct: 16.7, monto: total*0.167 },
      { label: 'Cuota 2', pct: 16.7, monto: total*0.167 },
      { label: 'Cuota 3 (≥30d antes)', pct: 16.6, monto: total*0.166 },
    ] };
  };

  // ---- Cuerpos de cadencia (cadence_render) ----
  BA.cadenceBody = {
    'Nuevos|1': 'Hola {nombre}, ¡gracias por escribir! Soy {operador} de Blisniuk & Amanov. Vi que te interesa {salida}. Te cuento en dos líneas cómo trabajamos y te paso fechas y disponibilidad. ¿Cómo preferís que sigamos, por acá o una llamada corta?',
    'Nuevos|2': 'Hola {nombre}, te escribo de nuevo por las dudas se haya traspapelado. {salida} tiene lugares todavía. Si querés te mando la propuesta con el día a día. ¿Te viene bien?',
    'Contactados|1': 'Hola {nombre}, te dejo la propuesta de {salida} con el itinerario día por día y los encuentros de acceso ya marcados. Cualquier duda la vemos juntos. ¿La pudiste ver?',
    'Contactados|2': '{nombre}, ¿pudiste mirar la propuesta de {salida}? Quedan {libres} lugares y se está moviendo. Si querés reservás el lugar con la seña y después ajustamos detalles.',
    'Propuesta|1': 'Hola {nombre}, ¿te quedó alguna duda de la propuesta? Te puedo armar el plan de pagos según la fecha de salida así lo ves con números concretos.',
    'Propuesta|2': '[Guion de llamada] Abrir con el encuentro de acceso que más le entusiasmó. Confirmar pax y fechas. Cerrar con: «¿Reservamos el lugar con la seña esta semana?»',
    'Negociación|1': '¡Genial {nombre}! Te paso los datos para la seña. En cuanto se acredite te reservo el lugar en {salida} y arrancamos con el plan de pagos.',
    'Negociación|2': '{nombre}, te reenvío los datos para la seña. Te aviso que quedan {libres} lugares en {salida} y hay otra familia consultando las mismas fechas. Cualquier cosa estoy por acá.',
  };
  BA.renderCadence = function (lead, key) {
    const s = BA.salidaById(lead.salida);
    const op = BA.operadores.find(o => o.id === lead.resp);
    const tpl = BA.cadenceBody[key] || '';
    return tpl
      .replace(/{nombre}/g, lead.nombre.split(' ')[0])
      .replace(/{operador}/g, op ? op.short : 'el equipo')
      .replace(/{salida}/g, s ? s.titulo : 'la salida')
      .replace(/{libres}/g, s ? s.libres : 'algunos');
  };

  // ---- Biblioteca de proveedores reutilizables (providers_library) ----
  // reservationStatus: confirmada|conversando|pendiente
  BA.biblioteca = [
    { id:'p1', name:'Castello di Verduno', type:'meal', michelin:1, priceRange:'€€€', location:'Verduno, Piemonte', salidas:['pie'],
      reservationStatus:'confirmada', closingDays:'Lun', web:'castellodiverduno.it', email:'eventi@castelloverduno.it', phone:'+39 0172 470125',
      notes:'Cena privada a puertas cerradas. Chef R. Costardi. Pidieron seña para sostener el bloqueo.',
      comms:[ {dir:'out', t:'Confirmación de 4 habitaciones', when:'hace 4 días'}, {dir:'in', t:'Piden seña antes del viernes', when:'hace 4 h'} ],
      attachments:['Menú degustación.pdf', 'Contrato evento.pdf'] },
    { id:'p2', name:'Tenuta dei Langhe', type:'wine', michelin:0, priceRange:'€€', location:'Barolo, Piemonte', salidas:['pie'],
      reservationStatus:'confirmada', closingDays:'Dom', web:'tenutadeilanghe.it', email:'visite@tenutadeilanghe.it', phone:'+39 0173 56012',
      notes:'Cata vertical con el enólogo G. Rivetti. Excelente para el pilar Acceso.',
      comms:[ {dir:'out', t:'Reserva cata vertical · 8 pax', when:'hace 6 días'}, {dir:'in', t:'Confirmado, traer documento', when:'hace 5 días'} ],
      attachments:['Lista de vinos.pdf'] },
    { id:'p3', name:'Kulala Desert Lodge', type:'lodging', michelin:0, priceRange:'€€€€', location:'Sossusvlei, Namibia', salidas:['nam'],
      reservationStatus:'conversando', closingDays:'—', web:'wilderness.com', email:'res@kulala.com', phone:'+264 61 274500',
      notes:'Lodge dentro de la reserva. Acceso privado a las dunas al amanecer.',
      comms:[ {dir:'out', t:'Consulta disponibilidad noviembre', when:'hace 8 días'}, {dir:'in', t:'3 chalets disponibles, falta 1', when:'hace 6 días'} ],
      attachments:[] },
    { id:'p4', name:'Astrónomo del Kalahari', type:'experience', michelin:0, priceRange:'€€', location:'Kalahari, Namibia', salidas:['nam'],
      reservationStatus:'pendiente', closingDays:'—', web:'—', email:'nkhoza@desert-sky.na', phone:'+264 81 5512200',
      notes:'Dr. N. Khoza. Sesión privada de astronomía. DEADLINE: confirmar antes de hoy 18:00 o libera el horario.',
      comms:[ {dir:'in', t:'«Confirmen antes de las 18:00»', when:'hace 5 h'} ],
      attachments:[] },
    { id:'p5', name:'Ceremonia del té · Kioto', type:'experience', michelin:0, priceRange:'€€', location:'Kioto, Japón', salidas:['jpn'],
      reservationStatus:'pendiente', closingDays:'Mié', web:'—', email:'tanaka@chado-kyoto.jp', phone:'+81 75 0000000',
      notes:'Maestra Tanaka. Identificada, falta primer contacto formal.',
      comms:[], attachments:[] },
    { id:'p6', name:'Tenuta San Guido', type:'wine', michelin:0, priceRange:'€€€', location:'Bolgheri, Toscana', salidas:[],
      reservationStatus:'confirmada', closingDays:'Dom', web:'tenutasanguido.com', email:'visite@sanguido.it', phone:'+39 0565 762003',
      notes:'Reutilizable para futuras salidas a Toscana. Visita + degustación Sassicaia.',
      comms:[ {dir:'in', t:'Confirman visita para el grupo', when:'hace 3 días'} ],
      attachments:['Ficha técnica.pdf'] },
  ];
  BA.providerById = function (id) { return BA.biblioteca.find(p => p.id === id); };

  // ---- Clientes (clients_list) — los que ya viajaron ----
  BA.clientes = [
    { id:'c1', nombre:'Familia Rudoni', email:'rudoni@email.com', viajes:3, ltvUSD:142, nps:10, ref:'—', trajo:2, ultimo:'Expedición Mundial 2026', estado:'viajando' },
    { id:'c2', nombre:'A. Bestani', email:'bestani@email.com', viajes:2, ltvUSD:64, nps:9, ref:'Rudoni', trajo:1, ultimo:'Piemonte 2025', estado:'activo' },
    { id:'c3', nombre:'Grupo Salvi', email:'salvi@email.com', viajes:2, ltvUSD:71, nps:9, ref:'—', trajo:0, ultimo:'Japón 2025', estado:'activo' },
    { id:'c4', nombre:'Familia Wong', email:'wong@email.com', viajes:1, ltvUSD:38, nps:8, ref:'Bestani', trajo:1, ultimo:'Namibia 2025', estado:'activo' },
  ];

  // ---- Bitácora de cambios (tabla changes) ----
  // event_type: trip|lead|payment|provider|access|email
  BA.changes = [
    { author:'Federico', event_type:'access', summary:'Cena Castello di Verduno marcada CONFIRMADA', trip:'pie', when:'hoy 09:12' },
    { author:'Sistema',  event_type:'email',  summary:'Triage IA: 2 correos clasificados como «Alta prioridad»', trip:null, when:'hoy 08:40' },
    { author:'Brian',    event_type:'lead',   summary:'Familia Ortega: Nuevos → primer contacto por WhatsApp', trip:'nam', when:'hoy 08:05' },
    { author:'Sistema',  event_type:'payment',summary:'Acreditación detectada US$ 8.600 · conciliada con Carla Ferro', trip:'pie', when:'ayer 19:30' },
    { author:'Federico', event_type:'trip',   summary:'Uzbekistán: readiness recalculado 54% → 62%', trip:'uzb', when:'ayer 17:14' },
    { author:'Brian',    event_type:'provider',summary:'Kalahari: estado de reserva pendiente → conversando', trip:'nam', when:'ayer 15:02' },
    { author:'Federico', event_type:'lead',   summary:'Grupo Vega marcado como enfriándose (18 días)', trip:'nam', when:'ayer 11:48' },
    { author:'Brian',    event_type:'trip',   summary:'Japón: 6.º pax confirmado · break-even alcanzado', trip:'jpn', when:'hace 2 días' },
  ];
})();
