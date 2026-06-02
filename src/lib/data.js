/* ============================================================
   B&A · Command Center — datos de operaciones
   Salidas reales del backup + CRM/finanzas curados (realista)
   ============================================================ */
window.BA = (function () {
  const brand = {
    name: 'Blisniuk & Amanov',
    tagline: 'Luxury as access, never excess',
    pilares: ['Acceso', 'Autoría', 'Afinidad'],
  };

  const operadores = [
    { id: 'brian', name: 'Brian Blisniuk', short: 'Brian', role: 'Operador', initials: 'BB', color: '#B8945A' },
    { id: 'fede',  name: 'Federico Amanov', short: 'Federico', role: 'Operador', initials: 'FA', color: '#3D5A3E' },
  ];

  const fx = { EUR: 1, USD: 1.08, ARS: 1180 };
  const sym = { EUR: '€', USD: 'US$', ARS: '$' };

  // ---- Salidas (entidad Salida) — reales del backup, métricas curadas ----
  // estado: go | risk | nogo | curso | opcion(evaluación) ; coords para mapamundi
  const salidas = [
    { id:'uzb', titulo:'Uzbekistán · Ruta de la Seda', etiqueta:'UZB·26', region:'Samarcanda', pais:'Uzbekistán', cat:'Cultura',
      fecha:'12–22 Sep 2026', mes:'SEP', precioUSD:9800, estado:'risk', grupo:'venta',
      conf:4, opcion:2, min:5, libres:2, breakeven:4, accesosOk:2, accesosTot:4, readiness:62, dias:14, forecastUSD:58,
      resp:'fede', lat:39.6, lng:66.9, glyph:'◆' },
    { id:'pie', titulo:'Piemonte · Le Langhe', etiqueta:'PIE·26', region:'Le Langhe', pais:'Italia', cat:'Gastro',
      fecha:'19–25 Oct 2026', mes:'OCT', precioUSD:7495, estado:'go', grupo:'venta',
      conf:7, opcion:1, min:6, libres:0, breakeven:5, accesosOk:3, accesosTot:3, readiness:88, dias:41, forecastUSD:71,
      resp:'fede', lat:44.7, lng:8.0, glyph:'❖' },
    { id:'nam', titulo:'Namibia · Dunas', etiqueta:'NAM·26', region:'Sossusvlei', pais:'Namibia', cat:'Naturaleza',
      fecha:'7–17 Nov 2026', mes:'NOV', precioUSD:10800, estado:'risk', grupo:'venta',
      conf:3, opcion:1, min:5, libres:2, breakeven:4, accesosOk:1, accesosTot:3, readiness:54, dias:60, forecastUSD:42,
      resp:'brian', lat:-24.7, lng:15.3, glyph:'△' },
    { id:'eng', titulo:'Engadin · Navidad en los Alpes', etiqueta:'ENG·26', region:'Engadin', pais:'Suiza', cat:'Invierno',
      fecha:'19–26 Dic 2026', mes:'DIC', precioUSD:8695, estado:'opcion', grupo:'evaluacion',
      conf:2, opcion:3, min:6, libres:4, breakeven:5, accesosOk:1, accesosTot:3, readiness:38, dias:102, forecastUSD:24,
      resp:'brian', lat:46.5, lng:9.8, glyph:'❄' },
    { id:'lap', titulo:'Laponia · Auroras', etiqueta:'LAP·27', region:'Finlandia', pais:'Finlandia', cat:'Invierno',
      fecha:'8–17 Ene 2027', mes:'ENE', precioUSD:10800, estado:'opcion', grupo:'evaluacion',
      conf:1, opcion:2, min:5, libres:4, breakeven:4, accesosOk:0, accesosTot:3, readiness:22, dias:120, forecastUSD:0,
      resp:'fede', lat:68.4, lng:27.4, glyph:'✦' },
    { id:'jpn', titulo:'Japón · Mono No Aware', etiqueta:'JPN·27', region:'Kioto', pais:'Japón', cat:'Cultura',
      fecha:'22 Mar–2 Abr 2027', mes:'MAR', precioUSD:11000, estado:'go', grupo:'venta',
      conf:6, opcion:1, min:5, libres:1, breakeven:5, accesosOk:4, accesosTot:5, readiness:79, dias:160, forecastUSD:66,
      resp:'brian', lat:35.0, lng:135.7, glyph:'⬡' },
    { id:'rud', titulo:'Expedición Mundial · Familia Rudoni', etiqueta:'RUD·26', region:'Texas', pais:'EE.UU.', cat:'A medida',
      fecha:'19 Jun–1 Jul 2026', mes:'JUN', precioUSD:0, estado:'curso', grupo:'confirmada',
      conf:4, opcion:0, min:4, libres:0, breakeven:4, accesosOk:3, accesosTot:3, readiness:96, dias:0, forecastUSD:0,
      resp:'brian', lat:29.7, lng:-95.3, glyph:'★' },
    { id:'mun', titulo:'Argentina al Mundial 2026', etiqueta:'MUN·26', region:'Miami → Kansas City', pais:'EE.UU.', cat:'A medida',
      fecha:'8 Jun–22 Jul 2026', mes:'JUN', precioUSD:0, estado:'curso', grupo:'confirmada',
      conf:2, opcion:0, min:2, libres:0, breakeven:2, accesosOk:2, accesosTot:2, readiness:92, dias:7, forecastUSD:0,
      resp:'fede', lat:25.7, lng:-80.2, glyph:'★' },
  ];

  // ---- El Puente · cola del día (cada ítem accionable) ----
  const puente = [
    { id:1, tipo:'cobro',   sev:'bad',  icon:'alert', titulo:'Cobro vencido · Familia Mehta', meta:'US$ 9.200 · cuota 2/3 · 6 días vencido', salida:'uzb', accion:'Enviar recordatorio', who:'fede' },
    { id:2, tipo:'gonogo',  sev:'bad',  icon:'flag',  titulo:'Decisión GO/NO-GO · Uzbekistán', meta:'14 días para decidir · falta break-even (4/5) + 2 accesos', salida:'uzb', accion:'Abrir tablero', who:'fede' },
    { id:3, tipo:'mail',    sev:'risk', icon:'mail',  titulo:'+24 h sin responder · Marco Pirelli', meta:'Cliente · «confirmación cena día 3» · borrador IA listo', salida:'pie', accion:'Responder con borrador', who:'fede' },
    { id:4, tipo:'acceso',  sev:'risk', icon:'key',   titulo:'Deadline de acceso · Astrónomo del Kalahari', meta:'Confirma el encuentro privado antes de hoy 18:00', salida:'nam', accion:'Ver acceso', who:'brian' },
    { id:5, tipo:'cadencia',sev:'info', icon:'snow',  titulo:'Cadencia hoy · Juan Méndez', meta:'Paso 3 · reactivación · 11 días sin contacto · US$ 22k', salida:'jpn', accion:'Preparar mail', who:'brian' },
    { id:6, tipo:'lead',    sev:'go',   icon:'spark', titulo:'Por cerrar · Carla Ferro', meta:'En negociación · seña pendiente · US$ 18k', salida:'pie', accion:'Avanzar a reservado', who:'fede' },
  ];

  // ---- Línea de estado del negocio (KPIs cabecera) ----
  const estado = {
    caja: { cobrado: 186, porCobrar: 248, vencido: 18.4, prox7: 32, unit:'US$k' },
    butacas: { vendidas: 27, breakeven: 24, capacidad: 41 },
    leadsCalientes: 5,
    forecast: { val: 261, unit:'US$k', delta: 12, spark:[182,196,188,210,224,219,242,261] },
    salidasActivas: { go: 3, risk: 2, opcion: 2, curso: 2 },
  };

  // ---- Finanzas ----
  const finanzas = {
    totales: { porCobrar: 248000, vencido: 18400, prox7: 32000, cobradoMes: 186000, margenObj: 65, margenReal: 62 },
    caja: [ // por mes: cobrado / por cobrar / vencido (US$k)
      { m:'MAR', cobrado:48, porCobrar:6, vencido:0 },
      { m:'ABR', cobrado:62, porCobrar:9, vencido:2 },
      { m:'MAY', cobrado:76, porCobrar:14, vencido:4 },
      { m:'JUN', cobrado:38, porCobrar:41, vencido:12 },
      { m:'JUL', cobrado:0,  porCobrar:58, vencido:0 },
      { m:'AGO', cobrado:0,  porCobrar:34, vencido:0 },
    ],
    cuotas: [
      { cliente:'Familia Mehta',  salida:'uzb', monto:9200,  estado:'vencido',    dias:-6, cuota:'2/3' },
      { cliente:'Marco Pirelli',  salida:'pie', monto:12400, estado:'vencido',    dias:-2, cuota:'1/2' },
      { cliente:'Grupo Salvi',    salida:'jpn', monto:14800, estado:'proximo',    dias:3,  cuota:'2/3' },
      { cliente:'Carla Ferro',    salida:'pie', monto:8600,  estado:'proximo',    dias:6,  cuota:'seña' },
      { cliente:'A. Bestani',     salida:'pie', monto:9100,  estado:'proximo',    dias:7,  cuota:'3/3' },
      { cliente:'Familia Wong',   salida:'nam', monto:6700,  estado:'alcorriente',dias:18, cuota:'1/2' },
      { cliente:'R. Daneri',      salida:'jpn', monto:11200, estado:'alcorriente',dias:24, cuota:'1/3' },
    ],
    margenes: [ // por salida
      { salida:'pie', margen:68 }, { salida:'jpn', margen:64 }, { salida:'uzb', margen:59 },
      { salida:'nam', margen:61 }, { salida:'eng', margen:57 },
    ],
  };

  // ---- Ventas (CRM cross-trip) ----
  const funnel = [
    { etapa:'Nuevos',      n:12, valUSD:168, color:'#8B8478' },
    { etapa:'Contactados', n:8,  valUSD:132, color:'#3F6B78' },
    { etapa:'Propuesta',   n:5,  valUSD:96,  color:'#B8945A' },
    { etapa:'Negociación', n:3,  valUSD:58,  color:'#4A6A4B' },
    { etapa:'Reservado',   n:6,  valUSD:124, color:'#3D5A3E' },
  ];
  const leads = [
    { id:'l1', nombre:'Carla Ferro',     empresa:'—',           salida:'pie', etapa:'Negociación', fuente:'referral', resp:'fede',  potUSD:18, fit:92, dias:1,  next:'Enviar plan de pagos' },
    { id:'l2', nombre:'Juan Méndez',     empresa:'Méndez & Co', salida:'jpn', etapa:'Propuesta',   fuente:'meta_ads', resp:'brian', potUSD:22, fit:74, dias:11, next:'Reactivar (cadencia 3)' },
    { id:'l3', nombre:'Sofía Lin',       empresa:'—',           salida:'pie', etapa:'Contactados', fuente:'organic',  resp:'fede',  potUSD:16, fit:68, dias:12, next:'Llamada de descubrimiento' },
    { id:'l4', nombre:'Familia Ortega',  empresa:'—',           salida:'nam', etapa:'Nuevos',      fuente:'meta_ads', resp:'brian', potUSD:31, fit:81, dias:0,  next:'Primer contacto' },
    { id:'l5', nombre:'Lautaro Gómez',   empresa:'Suramerica',  salida:'jpn', etapa:'Propuesta',   fuente:'referral', resp:'brian', potUSD:24, fit:88, dias:3,  next:'Seguimiento propuesta' },
    { id:'l6', nombre:'María Pérez',     empresa:'—',           salida:'uzb', etapa:'Negociación', fuente:'meta_ads', resp:'fede',  potUSD:19, fit:77, dias:2,  next:'Cerrar seña' },
    { id:'l7', nombre:'Grupo Vega',      empresa:'Vega Holding',salida:'nam', etapa:'Contactados', fuente:'web',      resp:'brian', potUSD:28, fit:71, dias:18, next:'Enviar itinerario base' },
    { id:'l8', nombre:'R. Daneri',       empresa:'—',           salida:'pie', etapa:'Reservado',   fuente:'referral', resp:'fede',  potUSD:21, fit:90, dias:5,  next:'Cobrar cuota 2' },
  ];

  // ---- Marketing (ROAS) ----
  const marketing = {
    campañas: [
      { name:'Piemonte · Gastro IT', salida:'pie', gastoUSD:2400, leads:18, reservas:4, cpl:133, cpr:600, roas:5.0 },
      { name:'Namibia · Naturaleza', salida:'nam', gastoUSD:3100, leads:21, reservas:2, cpl:148, cpr:1550, roas:3.5 },
      { name:'Japón · Cultura',      salida:'jpn', gastoUSD:1900, leads:14, reservas:3, cpl:136, cpr:633, roas:6.1 },
    ],
    atribucion: [
      { fuente:'Meta Ads', leads:38, reservas:9, revUSD:142, conv:24, color:'#3F6B78' },
      { fuente:'Referidos',leads:14, reservas:7, revUSD:121, conv:50, color:'#3D5A3E' },
      { fuente:'Web',      leads:21, reservas:4, revUSD:64,  conv:19, color:'#B8945A' },
      { fuente:'Directo',  leads:9,  reservas:3, revUSD:51,  conv:33, color:'#8B8478' },
    ],
  };

  // ---- Cadencias (pasos por etapa · canal · offset) ----
  const cadencias = {
    reglas: [
      { stage:'Nuevos',      step:1, offset:0, channel:'mail',     subject:'Bienvenida + primera respuesta' },
      { stage:'Nuevos',      step:2, offset:2, channel:'whatsapp', subject:'Seguimiento si no respondió' },
      { stage:'Contactados', step:1, offset:1, channel:'mail',     subject:'Enviar propuesta base' },
      { stage:'Contactados', step:2, offset:4, channel:'whatsapp', subject:'Recordatorio de propuesta' },
      { stage:'Propuesta',   step:1, offset:2, channel:'mail',     subject:'Resolver dudas + plan de pagos' },
      { stage:'Propuesta',   step:2, offset:5, channel:'guion',    subject:'Llamada de cierre (guion)' },
      { stage:'Negociación', step:1, offset:1, channel:'whatsapp', subject:'Confirmar seña' },
      { stage:'Negociación', step:2, offset:3, channel:'mail',     subject:'Reenviar datos + urgencia por cupos' },
    ],
  };

  // ---- Bandeja · triage IA (campos espejan email-ai del backend) ----
  const bandeja = [
    { id:'m1', de:'Marco Pirelli', cuenta:'reservas@', asunto:'Re: confirmación cena día 3',
      cat:'Cliente', sev:'risk', prio:'Alta', idioma:'IT', hace:'hace 26 h', salida:'pie',
      resumen:'Marco pide confirmar la cena del día 3 en Le Langhe y consulta si hay opción de menú sin lácteos para su esposa.',
      extra:{ proveedor:'Castello di Verduno', fecha:'día 3 · 20:30' },
      necesitaResp:true, leido:false,
      borrador:'Hola Marco, ¿cómo va? Te confirmo la cena del día 3 en el Castello di Verduno a las 20:30. Ya avisamos en cocina sobre la restricción de lácteos para tu señora — preparan una alternativa para cada paso del menú. Cualquier cosa, contame. Un abrazo.' },
    { id:'m2', de:'Castello di Verduno', cuenta:'reservas@', asunto:'Disponibilità 4 camere ottobre',
      cat:'Proveedor', sev:'risk', prio:'Alta', idioma:'IT', hace:'hace 4 h', salida:'pie',
      resumen:'Confirman 4 habitaciones para octubre pero piden seña antes de hoy 18:00 para sostener el bloqueo.',
      extra:{ proveedor:'Castello di Verduno', monto:'€ 2.400' },
      necesitaResp:true, leido:false,
      borrador:'Buongiorno, confirmamos las 4 habitaciones. Realizamos la seña hoy mismo y les reenvío el comprobante. Grazie mille.' },
    { id:'m3', de:'Banco · transferencia', cuenta:'info@', asunto:'Acreditación recibida',
      cat:'Pago', sev:'go', prio:'Media', idioma:'ES', hace:'hace 1 h', salida:'pie',
      resumen:'Acreditación de US$ 8.600 detectada. Coincide con la seña esperada de Carla Ferro (Piemonte).',
      extra:{ monto:'US$ 8.600', match:'Carla Ferro · seña' },
      necesitaResp:false, conciliar:true, leido:false, borrador:'' },
    { id:'m4', de:'Juan Méndez', cuenta:'info@', asunto:'Consulta Japón marzo',
      cat:'Cliente', sev:'info', prio:'Media', idioma:'ES', hace:'hace 2 d', salida:'jpn',
      resumen:'Pregunta por disponibilidad en la salida de Japón y rango de fechas. Lead sin contacto hace 11 días.',
      extra:{ potencial:'US$ 22k' },
      necesitaResp:true, leido:true,
      borrador:'Hola Juan, gracias por escribir. La salida de Japón es del 22 de marzo al 2 de abril, todavía con lugares. Te paso la propuesta con el detalle día por día así la vemos juntos. ¿Te queda bien una llamada esta semana?' },
    { id:'m5', de:'Namib Sky · globos', cuenta:'reservas@', asunto:'Encuentro privado · confirmación',
      cat:'Proveedor', sev:'risk', prio:'Alta', idioma:'EN', hace:'hace 5 h', salida:'nam',
      resumen:'Piden confirmar el encuentro privado con el astrónomo del Kalahari antes de hoy 18:00 o liberan el horario.',
      extra:{ proveedor:'Astrónomo del Kalahari', fecha:'hoy 18:00' },
      necesitaResp:true, leido:false,
      borrador:'Hi, confirmamos el encuentro privado con el astrónomo para la noche prevista. Quedamos atentos al horario propuesto. Thank you.' },
    { id:'m6', de:'Familia Ortega', cuenta:'wa', asunto:'Hola! Vimos lo de Namibia',
      cat:'Cliente', sev:'go', prio:'Media', idioma:'ES', hace:'hace 35 min', salida:'nam',
      resumen:'Familia interesada en Namibia desde un anuncio de Meta. Consultan fechas y si hay lugar para 4 personas.',
      extra:{ potencial:'US$ 31k', canal:'WhatsApp' },
      necesitaResp:true, leido:false,
      borrador:'¡Hola! Qué bueno que escriban. Namibia · Dunas sale del 7 al 17 de noviembre y todavía tenemos lugar para 4. Les armo una propuesta con el día a día y se las mando por acá. ¿Les viene bien?',
      hilo:[
        { from:'them', t:'Hola! Vimos el viaje a Namibia en Instagram 🙌', time:'10:58', ch:'wa' },
        { from:'them', t:'Somos 4. ¿Quedan lugares para noviembre?', time:'10:59', ch:'wa' },
      ] },
    { id:'m7', de:'Carla Ferro', cuenta:'wa', asunto:'Seña Piemonte',
      cat:'Cliente', sev:'risk', prio:'Alta', idioma:'ES', hace:'hace 3 h', salida:'pie',
      resumen:'Cliente en negociación por Piemonte. Confirma que transfiere la seña esta semana y pide los datos bancarios. Cierre inminente.',
      extra:{ potencial:'US$ 18k', canal:'WhatsApp', etapa:'Negociación' },
      necesitaResp:true, leido:false,
      borrador:'¡Genial, Carla! Te paso los datos para la seña por acá. En cuanto se acredite te reservo el lugar en Piemonte y arrancamos con el plan de pagos. Gracias!',
      hilo:[
        { from:'us',   t:'Carla, te dejé la propuesta de Piemonte en el mail 🙂', time:'ayer', ch:'email' },
        { from:'them', t:'La vi, me encantó 😍', time:'08:40', ch:'wa' },
        { from:'them', t:'Esta semana hago la seña. ¿Me pasás los datos?', time:'08:41', ch:'wa' },
      ] },
  ];

  // ---- Accesos (entidad propia — pilar #1). Fuente única: salida.accesosOk/Tot se derivan de acá. ----
  const accesos = [
    // Piemonte · 3/3 (GO)
    { id:'a1', nombre:'Cena privada · Castello di Verduno', salida:'pie', etapa:'confirmado',  resp:'fede',  deadline:'—',         planb:'Trattoria della Posta', figura:'Chef R. Costardi' },
    { id:'a2', nombre:'Cata vertical · Tenuta dei Langhe',  salida:'pie', etapa:'confirmado',  resp:'fede',  deadline:'—',         planb:'Cascina Adelaide',      figura:'Enólogo G. Rivetti' },
    { id:'a3', nombre:'Almuerzo con cazador de trufa · Alba', salida:'pie', etapa:'confirmado', resp:'fede', deadline:'—',         planb:'—',                     figura:'N. Ponzio' },
    // Uzbekistán · 1/4 (EN RIESGO — falta cerrar accesos)
    { id:'a4', nombre:'Té con artesano de Samarcanda',      salida:'uzb', etapa:'negociando',  resp:'fede',  deadline:'en 4 días', planb:'—',                     figura:'U. Karimov' },
    { id:'a5', nombre:'Cena en madrasa restaurada',         salida:'uzb', etapa:'confirmado',  resp:'fede',  deadline:'—',         planb:'Patio de Bujará',       figura:'Anfitrión D. Yusupov' },
    { id:'a6', nombre:'Taller de cerámica de Rishtan',      salida:'uzb', etapa:'contactado',  resp:'brian', deadline:'en 9 días', planb:'—',                     figura:'Maestro Nazirov' },
    { id:'a7', nombre:'Ruta de la Seda con historiador',    salida:'uzb', etapa:'identificado',resp:'fede',  deadline:'en 12 días',planb:'—',                     figura:'Prof. R. Alimov' },
    // Namibia · 1/3 (EN RIESGO)
    { id:'a8', nombre:'Astrónomo privado · cielos del Kalahari', salida:'nam', etapa:'negociando', resp:'brian', deadline:'hoy 18:00', planb:'—',               figura:'Dr. N. Khoza' },
    { id:'a9', nombre:'Cena con guía bosquimano (San)',     salida:'nam', etapa:'contactado',  resp:'brian', deadline:'en 9 días', planb:'—',                     figura:'Guía /Ui' },
    { id:'a10', nombre:'Globo al amanecer sobre Sossusvlei',salida:'nam', etapa:'confirmado',  resp:'brian', deadline:'—',         planb:'4x4 al alba',           figura:'Namib Sky' },
    // Japón · 4/5 (GO)
    { id:'a11', nombre:'Ceremonia del té · Kioto',          salida:'jpn', etapa:'identificado',resp:'brian', deadline:'en 3 días', planb:'Casa de té alterna',    figura:'Maestra Tanaka' },
    { id:'a12', nombre:'Cena kaiseki con maestro',          salida:'jpn', etapa:'confirmado',  resp:'brian', deadline:'—',         planb:'—',                     figura:'Chef Yoshida' },
    { id:'a13', nombre:'Taller del forjador de espadas',    salida:'jpn', etapa:'confirmado',  resp:'brian', deadline:'—',         planb:'—',                     figura:'Maestro Amada' },
    { id:'a14', nombre:'Meditación con monje · templo',     salida:'jpn', etapa:'confirmado',  resp:'fede',  deadline:'—',         planb:'—',                     figura:'Monje Ryōkan' },
    { id:'a15', nombre:'Mercado de Nishiki con chef',       salida:'jpn', etapa:'confirmado',  resp:'fede',  deadline:'—',         planb:'—',                     figura:'Chef Inoue' },
  ];

  // ---- Copiloto · respuestas canned ----
  const copiloto = [
    { q:'¿Cuánto tengo por cobrar este mes?', a:'Este mes tenés **US$ 248.000** por cobrar. De eso, **US$ 18.400 están vencidos** (Familia Mehta y Marco Pirelli) y **US$ 32.000 vencen en los próximos 7 días**. La salida con más caja pendiente es Japón (US$ 96k).', chips:['Ir a Finanzas','Enviar recordatorios'] },
    { q:'¿Qué leads no toqué en 10 días?', a:'Hay **3 leads enfriándose**: Juan Méndez (11 días, US$ 22k), Sofía Lin (12 días, US$ 16k) y el Grupo Vega (18 días, US$ 28k). Te dejo los borradores de reactivación listos para revisar.', chips:['Preparar 3 mails','Ir a Ventas'] },
    { q:'Escribí el mail para Marco confirmando la cena del día 3', a:'Listo, redacté el mail en voseo confirmando la cena del día 3 en el Castello di Verduno (20:30) y aclarando la restricción de lácteos. Lo tenés en la Bandeja como borrador para revisar.', chips:['Abrir borrador','Enviar ahora'] },
    { q:'¿Cuál es el estado de Uzbekistán?', a:'Uzbekistán está **EN RIESGO**. Faltan **14 días** para la decisión GO/NO-GO. Tenés 4 reservas confirmadas (break-even es 5) y **1 de 4 accesos** cerrados. La regla de los dos encuentros todavía no se cumple. Sugerencia: acelerar el té con el artesano de Samarcanda.', chips:['Abrir salida','Ver accesos'] },
  ];

  // ---- Command palette ----
  const cmd = [
    { t:'Hoy · El Puente',  s:'Inicio',       view:'puente',   kind:'nav', icon:'home' },
    { t:'Ventas',           s:'Dominio',      view:'ventas',   kind:'nav', icon:'funnel' },
    { t:'Bandeja',          s:'Dominio',      view:'bandeja',  kind:'nav', icon:'mail' },
    { t:'Finanzas',         s:'Dominio',      view:'finanzas', kind:'nav', icon:'coin' },
    { t:'Calendario operativo', s:'Dominio',  view:'calendario', kind:'nav', icon:'calendar' },
    { t:'Viajes',           s:'Dominio',      view:'viajes',   kind:'nav', icon:'compass' },
    { t:'Piemonte · Le Langhe', s:'Salida · Oct 2026', kind:'trip', tripId:'pie' },
    { t:'Uzbekistán · Ruta de la Seda', s:'Salida · Sep 2026', kind:'trip', tripId:'uzb' },
    { t:'Namibia · Dunas',  s:'Salida · Nov 2026', kind:'trip', tripId:'nam' },
    { t:'Carla Ferro',      s:'Lead · Piemonte', kind:'lead', leadId:'l1' },
    { t:'Familia Mehta',    s:'Cliente · cobro vencido', kind:'lead' },
    { t:'Marcar cobro pagado · Familia Mehta', s:'Acción · Finanzas', kind:'action', icon:'coin', act:'pay' },
    { t:'Preparar recordatorios de cobro', s:'Acción · Finanzas', kind:'action', icon:'send', act:'remind' },
    { t:'Responder pendientes con IA', s:'Acción · Bandeja', kind:'action', icon:'spark', act:'reply' },
    { t:'Nueva salida',     s:'Acción',       kind:'action', icon:'plus', act:'newtrip' },
  ];

  // ---- Calendario operativo unificado (junio 2026) ----
  const calMes = { nombre: 'Junio 2026', dias: 30, inicioDow: 0, hoy: 1 }; // 1 jun = lunes (dow 0 lun)
  const calEventos = [
    { day:1,  tipo:'acceso',   label:'Deadline · Astrónomo del Kalahari', salida:'nam' },
    { day:1,  tipo:'cadencia', label:'Reactivar a Juan Méndez', salida:'jpn' },
    { day:4,  tipo:'cobro',    label:'Cobro · Grupo Salvi · US$ 14,8k', salida:'jpn' },
    { day:4,  tipo:'acceso',   label:'Ceremonia del té · Kioto', salida:'jpn' },
    { day:5,  tipo:'acceso',   label:'Té con artesano · Samarcanda', salida:'uzb' },
    { day:7,  tipo:'cobro',    label:'Seña · Carla Ferro', salida:'pie' },
    { day:8,  tipo:'salida',   label:'Sale · Argentina al Mundial', salida:'mun' },
    { day:8,  tipo:'cobro',    label:'Cuota 3/3 · A. Bestani', salida:'pie' },
    { day:10, tipo:'acceso',   label:'Cena con guía bosquimano', salida:'nam' },
    { day:13, tipo:'acceso',   label:'Ruta de la Seda · historiador', salida:'uzb' },
    { day:15, tipo:'decision', label:'Decisión GO/NO-GO · Uzbekistán', salida:'uzb' },
    { day:18, tipo:'cobro',    label:'Cuota 1/2 · Familia Wong', salida:'nam' },
    { day:19, tipo:'salida',   label:'Sale · Expedición Mundial (Rudoni)', salida:'rud' },
    { day:24, tipo:'cobro',    label:'Cuota 1/3 · R. Daneri', salida:'jpn' },
    { day:26, tipo:'cadencia', label:'Seguimiento propuesta · Lautaro', salida:'jpn' },
  ];

  // helpers
  function money(usd, cur) {
    const v = usd * (fx[cur] / fx.USD);
    if (cur === 'ARS') return sym.ARS + ' ' + Math.round(v).toLocaleString('es-AR');
    return sym[cur] + ' ' + Math.round(v).toLocaleString('es-AR');
  }
  function salidaById(id){ return salidas.find(s=>s.id===id); }

  // Derivar accesosOk/accesosTot de la lista de accesos (fuente única) para las salidas que tienen entradas
  salidas.forEach(s => {
    const list = accesos.filter(a => a.salida === s.id);
    if (list.length) {
      s.accesosTot = list.length;
      s.accesosOk = list.filter(a => a.etapa === 'confirmado').length;
    }
  });

  // ============================================================
  //  Conexion Supabase (real) - proyecto pptldpjwggrnbkvppolu
  //  Default = demo (mock). Si hay sesion de operador -> hidrata en vivo.
  // ============================================================
  const SB_URL = 'https://pptldpjwggrnbkvppolu.supabase.co';
  const SB_KEY = 'sb_publishable_6Xs9DoveG6nvB8FK1q_RAw_apQCmTr_';
  const live = { mode: 'demo', operator: null }; // 'demo' | 'connecting' | 'live'

  let _sb = null;
  function sb() {
    if (_sb) return _sb;
    const lib = (typeof window !== 'undefined') && window.supabase;
    if (!lib || !lib.createClient) return null;
    _sb = lib.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
    return _sb;
  }

  // ---- mapas RPC -> shape del shell (mismos nombres de campo que el mock) ----
  const MES_ABBR = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const MES_LARGO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  function fmtFecha(iso) {
    if (!iso) return '';
    const d = new Date((iso.length <= 10 ? iso + 'T00:00:00' : iso));
    if (isNaN(d)) return iso;
    return d.getUTCDate() + ' ' + MES_LARGO[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  }
  function estadoFromGo(go) {
    const g = (go || '').toUpperCase();
    if (g === 'GO' || g === 'LISTO') return 'go';
    if (g === 'EN_RIESGO' || g === 'RIESGO' || g === 'RISK') return 'risk';
    if (g === 'NO_GO' || g === 'NOGO') return 'nogo';
    if (g === 'EN_CURSO' || g === 'CURSO') return 'curso';
    return 'opcion';
  }
  // coords + pais/categoria aproximados por palabra clave (el RPC no los trae)
  const GEO = [
    [/piemonte|langhe|alba|barolo/i, 44.7, 8.0, 'Italia', 'Gastro', '\u2756'],
    [/toscana|umbr/i, 43.4, 11.2, 'Italia', 'Gastro', '\u2756'],
    [/amalfi|capri|n[a\u00e1]poli/i, 40.6, 14.5, 'Italia', 'Gastro', '\u2756'],
    [/cerde[\u00f1n]a|sardinia|c[o\u00f3]rcega|corsica/i, 41.0, 9.0, 'Italia', 'Naturaleza', '\u25b3'],
    [/argentina|mendoza|buenos aires|patagonia/i, -32.9, -68.8, 'Argentina', 'Vino', '\u2756'],
    [/atacama|uyuni/i, -23.6, -67.9, 'Chile', 'Naturaleza', '\u25b3'],
    [/jap[o\u00f3]|japan|kioto|kyoto|tokio/i, 35.0, 135.7, 'Jap\u00f3n', 'Cultura', '\u2b21'],
    [/bhut[\u00e1a]n/i, 27.5, 90.4, 'But\u00e1n', 'Cultura', '\u2b21'],
    [/uzbek|samarc/i, 39.6, 66.9, 'Uzbekist\u00e1n', 'Cultura', '\u25c6'],
    [/laponia|finland|lapland/i, 68.4, 27.4, 'Finlandia', 'Invierno', '\u2726'],
    [/island|iceland/i, 64.1, -21.9, 'Islandia', 'Naturaleza', '\u25b3'],
    [/engadin|alpes|suiza|switzerland/i, 46.5, 9.8, 'Suiza', 'Invierno', '\u2744'],
    [/namib|sossus|kalahari/i, -24.7, 15.3, 'Namibia', 'Naturaleza', '\u25b3'],
    [/kenia|kenya|safari|masai/i, -1.4, 35.1, 'Kenia', 'Naturaleza', '\u25b3'],
    [/marruecos|morocco|marrakech/i, 31.6, -8.0, 'Marruecos', 'Cultura', '\u25c6'],
    [/grecia|greece|santorini/i, 37.4, 25.4, 'Grecia', 'Naturaleza', '\u25b3'],
    [/per[u\u00fa]|cusco|machu/i, -13.2, -72.5, 'Per\u00fa', 'Cultura', '\u2b21'],
    [/alaska/i, 61.2, -149.9, 'EE.UU.', 'Naturaleza', '\u25b3'],
    [/maldiv/i, 3.2, 73.2, 'Maldivas', 'Naturaleza', '\u25b3'],
    [/texas|mundial|world cup|miami|kansas/i, 29.7, -95.3, 'EE.UU.', 'A medida', '\u2605'],
  ];
  function geoFor(text) {
    for (const g of GEO) if (g[0].test(text || '')) return { lat: g[1], lng: g[2], pais: g[3], cat: g[4], glyph: g[5] };
    return { lat: undefined, lng: undefined, pais: '', cat: 'Cultura', glyph: '\u25c6' };
  }
  function mapTrip(r) {
    const estado = estadoFromGo(r.go_status);
    const g = geoFor((r.region_label || '') + ' ' + (r.title || ''));
    const grupo = estado === 'opcion' ? 'evaluacion' : estado === 'curso' ? 'confirmada' : 'venta';
    const start = new Date((r.start_date || '') + 'T00:00:00');
    return {
      id: r.id, titulo: r.title || r.id, etiqueta: (r.id || '').slice(0, 12).toUpperCase(),
      region: r.region_label || r.title || '', pais: g.pais, cat: g.cat, glyph: g.glyph,
      fecha: fmtFecha(r.start_date), mes: isNaN(start) ? '' : MES_ABBR[start.getUTCMonth()],
      precioUSD: +r.price || 0, estado, grupo,
      conf: +r.confirmed || 0, opcion: +r.opt || 0, min: +r.min_pax || 0, libres: +r.libres || 0,
      breakeven: +r.min_pax || 0, accesosOk: +r.accesos_cerrados || 0, accesosTot: +r.accesos_total || 0,
      readiness: +r.readiness_pct || 0,
      dias: (r.days_to_decision != null ? +r.days_to_decision : +r.days_to_departure) || 0,
      forecastUSD: Math.round((+r.revenue_forecast || 0) / 1000), resp: 'brian',
      lat: g.lat, lng: g.lng,
    };
  }
  const FUENTE_KEY = { meta_ads:'meta_ads', referral:'referral', organic:'organic', web:'web', direct:'directo', directo:'directo' };
  const STAGE_ES = { new:'Nuevos', contacted:'Contactados', qualified:'Calificados', proposal:'Propuesta', negotiating:'Negociaci\u00f3n', booked:'Reservado', lost:'Perdidos' };
  function mapLead(r) {
    return {
      id: r.id, nombre: r.full_name || '\u2014', empresa: r.company || '\u2014',
      salida: r.trip_id || '', etapa: r.stage_label || STAGE_ES[r.stage] || 'Nuevos',
      fuente: FUENTE_KEY[r.source] || r.source || 'directo', resp: 'brian',
      potUSD: Math.round((+r.potential_total_usd || 0) / 1000), fit: 70,
      dias: +r.days_stale || 0, next: 'Pr\u00f3ximo contacto',
    };
  }
  const FUNNEL_META = {
    new:        { etapa:'Nuevos',      color:'#8B8478', ord:1 },
    contacted:  { etapa:'Contactados', color:'#3F6B78', ord:2 },
    qualified:  { etapa:'Calificados', color:'#6B6258', ord:3 },
    proposal:   { etapa:'Propuesta',   color:'#B8945A', ord:4 },
    negotiating:{ etapa:'Negociaci\u00f3n', color:'#4A6A4B', ord:5 },
    booked:     { etapa:'Reservado',   color:'#3D5A3E', ord:6 },
    lost:       { etapa:'Perdidos',    color:'#9A5A3A', ord:7 },
  };
  function mapFunnel(rows) {
    return rows.map(function (r) {
      const m = FUNNEL_META[r.stage] || { etapa: r.stage, color:'#8B8478', ord:99 };
      return { etapa: m.etapa, n: +r.lead_count || 0, valUSD: Math.round((+r.total_potential_usd || 0) / 1000), color: m.color, ord: m.ord };
    }).sort(function (a, b) { return a.ord - b.ord; });
  }

  // reemplazo in-place: conserva la referencia del array que leen las vistas
  function replaceArr(target, arr) { target.length = 0; arr.forEach(function (x) { target.push(x); }); }
  function recomputeEstado() {
    const c = { go: 0, risk: 0, opcion: 0, curso: 0 };
    salidas.forEach(function (s) { if (c[s.estado] != null) c[s.estado]++; });
    estado.salidasActivas = c;
  }

  async function hydrate() {
    const c = sb();
    if (!c) { live.mode = 'demo'; return false; }
    try {
      const sessRes = await c.auth.getSession();
      const session = sessRes && sessRes.data && sessRes.data.session;
      if (!session) { live.mode = 'demo'; live.operator = null; return false; }
      const res = await Promise.all([
        c.rpc('trips_board'),
        c.rpc('leads_crm_pipeline', { p_search: null, p_assigned_to: null, p_source: null, p_trip_id: null }),
        c.rpc('lead_funnel_summary'),
      ]);
      const tb = res[0], lp = res[1], fs = res[2];
      if (tb && tb.data && tb.data.length) replaceArr(salidas, tb.data.map(mapTrip));
      if (lp && lp.data && lp.data.length) replaceArr(leads, lp.data.map(mapLead));
      if (fs && fs.data && fs.data.length) replaceArr(funnel, mapFunnel(fs.data));
      recomputeEstado();
      live.mode = 'live';
      live.operator = (session.user && (session.user.email || session.user.id)) || 'operador';
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ba:datachanged'));
      return true;
    } catch (e) {
      console.warn('[BA] hidratacion en vivo fallo - uso demo:', e && e.message);
      live.mode = 'demo';
      return false;
    }
  }
  async function connect(email, password) {
    const c = sb();
    if (!c) return { ok: false, error: 'Cliente Supabase no disponible' };
    live.mode = 'connecting';
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ba:datachanged'));
    try {
      const r = await c.auth.signInWithPassword({ email: (email || '').trim(), password: password || '' });
      if (r && r.error) { live.mode = 'demo'; return { ok: false, error: r.error.message }; }
      const ok = await hydrate();
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ba:datachanged'));
      return { ok: ok };
    } catch (e) {
      live.mode = 'demo';
      return { ok: false, error: (e && e.message) || 'Error de conexion' };
    }
  }
  async function disconnect() {
    const c = sb();
    try { if (c) await c.auth.signOut(); } catch (e) {}
    live.mode = 'demo'; live.operator = null;
    if (typeof window !== 'undefined') window.location.reload();
  }

  // ---- Capa de datos (seam) - contra las RPC reales (contratos verificados) ----
  const source = {
    async trips()  { const c = sb(); if (!c) return salidas; const r = await c.rpc('trips_board'); return (r.data && r.data.length) ? r.data.map(mapTrip) : salidas; },
    async leads()  { const c = sb(); if (!c) return leads;   const r = await c.rpc('leads_crm_pipeline', { p_search:null, p_assigned_to:null, p_source:null, p_trip_id:null }); return (r.data && r.data.length) ? r.data.map(mapLead) : leads; },
    async funnel() { const c = sb(); if (!c) return funnel;  const r = await c.rpc('lead_funnel_summary'); return (r.data && r.data.length) ? mapFunnel(r.data) : funnel; },
    // Verificadas contra el proyecto; data real hoy vacia -> quedan en demo hasta cargar backend:
    async finanzas()   { return finanzas; },   // payments_due(p_days) + cashflow_projection()
    async marketing()  { return marketing; },  // sales_attribution() -> {fuente,leads,booked,revenue,conv_pct}
    async bandeja()    { return bandeja; },     // tabla emails (triage email-ai) + bandeja_stats()
    async accesos()    { return accesos; },
    async cadencias()  { return cadencias; },   // cadence_rules + cadence_render(p_lead_id,p_rule_id)
    async puente()     { return puente; },      // run_daily_brief()
    async calendario() { return { mes: calMes, eventos: calEventos }; },
    async leadChangeStage(id, stage) {
      const c = sb();
      if (c) { try { await c.rpc('lead_change_stage', { p_lead_id: id, p_new_stage: stage, p_note: null }); } catch (e) {} }
      const l = leads.find(function (x) { return x.id === id; }); if (l) l.etapa = stage; return l;
    },
    async markPaid(paymentId) {
      const c = sb();
      if (c) { try { const r = await c.rpc('mark_payment_paid', { p_payment_id: paymentId, p_method: 'transfer', p_when: new Date().toISOString().slice(0,10) }); return r.data || { ok:true }; } catch (e) {} }
      return { ok: true };
    },
  };

  // arranque: si ya hay sesion de operador, hidrata en vivo (si no, queda en demo)
  if (typeof window !== 'undefined') { try { if (sb()) hydrate(); } catch (e) {} }

  return { brand, operadores, fx, sym, salidas, puente, estado, finanzas,
           funnel, leads, marketing, cadencias, bandeja, accesos, copiloto, cmd, calMes, calEventos,
           source, money, salidaById, live, hydrate, connect, disconnect, SB_URL, SB_KEY };
})();
