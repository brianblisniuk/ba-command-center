/* ============================================================
   Pasaporte Negro · Command Center — datos de operaciones
   Salidas reales del backup + CRM/finanzas curados (realista)
   ============================================================ */
/* ===== Supabase client · base nueva (onnqcdjkvpvpvtsorpup). Anon key es pública, protegida por RLS. ===== */
window.SB = (window.supabase && window.supabase.createClient)
  ? window.supabase.createClient(
      'https://onnqcdjkvpvpvtsorpup.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ubnFjZGprdnB2cHZ0c29ycHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNzkxNTYsImV4cCI6MjA5NTk1NTE1Nn0.-tEOY2FT4WTL_zOSWnxolA1mEtIZGSd9mzQ5TyoBui0',
      { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'ba-cc-auth' } }
    )
  : null;

window.BA = (function () {
  const brand = {
    name: 'Pasaporte Negro',
    tagline: 'Acceso · Autoría · Afinidad',
    pilares: ['Acceso', 'Autoría', 'Afinidad'],
  };

  const operadores = [
    { id: 'brian', name: 'Brian Blisniuk', short: 'Brian', role: 'Operador', initials: 'BB', color: '#B8945A' },
    { id: 'fede',  name: 'Federico Buenaventura', short: 'Federico', role: 'Operador', initials: 'FB', color: '#3D5A3E' },
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
    cola: [],
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
    { t:'Cargar con IA · texto o foto', s:'Acción · crear lead/proveedor', kind:'action', icon:'spark', act:'capture' },
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

  // ---- Presets por categoría (wizard de nuevo viaje) ----
  const categorias = [
    { id:'Gastro',    glyph:'❖', accent:'var(--laurel)',      tipos:['Restaurante','Bodega','Truffle hunt','Mercado'], desc:'Mesa, producto y cocina de autor.' },
    { id:'Vino',      glyph:'◆', accent:'var(--brass)',       tipos:['Bodega','Viñedo','Cata','Maridaje'],            desc:'Terruño, vendimia y cata con el enólogo.' },
    { id:'Cultura',   glyph:'◇', accent:'var(--curso)',       tipos:['Cultura','Acceso','Taller','Guía'],             desc:'Ciudad antigua, artesanos y encuentros.' },
    { id:'Naturaleza',glyph:'△', accent:'var(--laurel-soft)', tipos:['Lodge','Actividad','Guía','Astronomía'],        desc:'Paisaje, fauna y cielos abiertos.' },
    { id:'Invierno',  glyph:'❄', accent:'var(--curso)',       tipos:['Hotel','Actividad','Refugio','Guía'],           desc:'Nieve, alpes y refugios de montaña.' },
    { id:'A medida',  glyph:'★', accent:'var(--brass)',       tipos:['Hotel','Transfer','Evento','Servicio'],         desc:'Logística a medida para un grupo único.' },
  ];

  // ---- Colaboración: hilos de comentarios por entidad + notificaciones ----
  const comentarios = {
    'slot:s3': [
      { who:'fede', t:'¿Confirmamos la cena del día 3 con Marco? Pidió menú sin lácteos para la esposa.', when:'hace 2 h', mentions:['brian'] },
      { who:'brian', t:'Sí, dale. Ya avisé a cocina. @fede cargá la restricción en el perfil del huésped.', when:'hace 1 h', mentions:['fede'] },
    ],
    'task:0': [
      { who:'brian', t:'Este es el que define si el viaje sale. Prioridad máxima.', when:'ayer', mentions:[] },
    ],
    'prov:p1': [
      { who:'fede', t:'Pidieron seña antes del viernes para sostener el bloqueo de 4 hab.', when:'hace 4 h', mentions:[] },
      { who:'fede', t:'@brian ¿hacemos la transferencia hoy?', when:'hace 3 h', mentions:['brian'] },
    ],
  };

  const notificaciones = [
    { id:'n1', kind:'mention', para:'fede', de:'brian', t:'te mencionó en la cena del día 3 · Piemonte', ctx:'slot:s3', when:'hace 1 h', leido:false },
    { id:'n2', kind:'mention', para:'brian', de:'fede', t:'te mencionó en Castello di Verduno', ctx:'prov:p1', when:'hace 3 h', leido:false },
    { id:'n3', kind:'assign', para:'fede', de:'brian', t:'te asignó: cerrar el acceso pendiente · Uzbekistán', ctx:'task:0', when:'hace 5 h', leido:false },
    { id:'n4', kind:'payment', para:'brian', de:'Sistema', t:'Pago detectado US$ 8.600 · conciliar con Carla Ferro', ctx:'finanzas', when:'ayer', leido:true },
    { id:'n5', kind:'deadline', para:'brian', de:'Sistema', t:'Deadline acceso Kalahari vence hoy 18:00', ctx:'nam', when:'ayer', leido:true },
  ];

  // ---- Snapshots / backup (por viaje) ----
  const snapshots = [
    { id:'sn1', label:'Pre-confirmación accesos', when:'hace 6 días', by:'fede', size:'42 KB', auto:false },
    { id:'sn2', label:'Backup automático nocturno', when:'ayer 03:00', by:'Sistema', size:'44 KB', auto:true },
    { id:'sn3', label:'Antes de cargar presupuesto v2', when:'hace 3 días', by:'brian', size:'41 KB', auto:false },
  ];

  // ---- Propuesta (contenido para el PDF) ----
  const propuesta = {
    paginas3: ['Portada · el viaje en una imagen', 'El itinerario en una página', 'Inversión y próximos pasos'],
    paginas10: ['Portada', 'Carta de bienvenida', 'Filosofía Pasaporte Negro · Acceso·Autoría·Afinidad', 'Mapa del viaje', 'Día por día (I)', 'Día por día (II)', 'Los encuentros de acceso', 'Alojamientos', 'Inversión y plan de pagos', 'Próximos pasos'],
  };

  // ---- Proyección: ingreso por mes (forecast vs comprometido) ----
  const proyeccion = [
    { m:'JUN', forecast:96, comprometido:78 },
    { m:'JUL', forecast:58, comprometido:34 },
    { m:'AGO', forecast:34, comprometido:12 },
    { m:'SEP', forecast:88, comprometido:71 },
    { m:'OCT', forecast:71, comprometido:52 },
    { m:'NOV', forecast:42, comprometido:18 },
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

  // ---- Capa de datos (seam): hoy devuelve el mock; mañana, Supabase ----
  // Cada método mapea a una RPC / Edge Function / tabla real (ver SUPABASE.md).
  // Para ir a producción: cambiar el cuerpo por el fetch correspondiente — la UI no cambia.
  // Mapea una fila de trips_board() al shape de salida que consumen las vistas y SalidaCard
  function mapTrip(r) {
    const goMap = { GO: 'go', EN_RIESGO: 'risk', NO_GO: 'nogo', NOGO: 'nogo', EN_CURSO: 'curso', EN_VIAJE: 'curso', CONFIRMADA: 'curso', EN_EVALUACION: 'opcion', EVALUACION: 'opcion', OPCION: 'opcion' };
    const estado = goMap[(r.go_status || '').toUpperCase()] || 'risk';
    const MES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const MESl = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let fecha = r.start_date || '', mes = '';
    if (r.start_date) { const d = new Date(r.start_date + 'T00:00:00'); fecha = d.getDate() + ' ' + MESl[d.getMonth()] + ' ' + d.getFullYear(); mes = MES[d.getMonth()]; }
    const titulo = ((r.title || '').split('—')[0].trim()) || r.title || r.id;
    const t = ((r.title || '') + ' ' + (r.region_label || '')).toLowerCase();
    const glyph = /jap[oó]n/.test(t) ? '⬡' : /lapon|auror/.test(t) ? '✦' : /namib|duna/.test(t) ? '△' : /engad|navid|alpe/.test(t) ? '❄' : /piemon|langhe/.test(t) ? '❖' : /marru/.test(t) ? '◈' : /alaska/.test(t) ? '❉' : /b[uú]tan|nepal|himalaya/.test(t) ? '⛰' : /croac|dalmac/.test(t) ? '⚓' : '◆';
    return {
      id: r.id, titulo, etiqueta: '', region: r.region_label || '', pais: r.region_label || '',
      cat: '', fecha, mes, precioUSD: r.price || 0, estado, grupo: (estado === 'curso' ? 'confirmada' : estado === 'opcion' ? 'evaluacion' : 'venta'),
      conf: r.confirmed || 0, opcion: r.opt || 0, min: r.min_pax || 0, libres: r.libres || 0,
      breakeven: r.min_pax || 0, accesosOk: r.accesos_cerrados || 0, accesosTot: r.accesos_total || 0,
      readiness: r.readiness_pct || 0, dias: r.days_to_decision || 0,
      forecastUSD: Math.round((r.revenue_forecast || 0) / 1000),
      resp: 'brian', lat: Number(r.lat) || 0, lng: Number(r.lng) || 0, glyph,
      capacity: r.capacity, pipe: r.pipe, leadsActivos: r.leads_activos, decisionDate: r.decision_date,
      daysToDeparture: r.days_to_departure, revenueCommitted: r.revenue_committed, goStatus: r.go_status, startISO: r.start_date || null
    };
  }

  // ---- Modelo de etapas del pipeline (stages reales del CRM) ----
  const STAGES = [
    { key: 'new', label: 'Nuevos', color: '#8B8478' },
    { key: 'contacted', label: 'Contactados', color: '#3F6B78' },
    { key: 'qualified', label: 'Calificados', color: '#6E7F86' },
    { key: 'proposal', label: 'Propuesta', color: '#B8945A' },
    { key: 'negotiating', label: 'Negociación', color: '#4A6A4B' },
    { key: 'booked', label: 'Reservado', color: '#3D5A3E' },
    { key: 'lost', label: 'Perdidos', color: '#A39B8E' }
  ];
  const OP_BY_UID = { '9e11bed5-8e3a-4e7a-b3a0-dccd3b3ce188': 'brian', '1bf337b7-72d7-411b-98e8-c8f29f878778': 'fede' };
  function relTime(iso) {
    if (!iso) return '';
    const d = new Date(iso), ms = Date.now() - d.getTime();
    const mins = Math.round(ms / 60000), hrs = Math.round(ms / 3600000), days = Math.round(ms / 86400000);
    if (mins < 1) return 'recién'; if (mins < 60) return 'hace ' + mins + ' min';
    if (hrs < 24) return 'hace ' + hrs + ' h'; if (days < 30) return 'hace ' + days + ' d';
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
  }
  function mapSnap(r) {
    const auto = r.author === 'system' || r.is_auto === true;
    const by = auto ? 'Automático' : (OP_BY_UID[r.author] || r.author || '—');
    return { id: r.id, label: r.name || 'Snapshot', when: relTime(r.created_at), by: by, auto: auto, created: r.created_at };
  }
  // Mapea una fila de leads_crm_pipeline al shape de lead que consumen Ventas y LeadDetail
  const NEXT_BY_STAGE = { new: 'Primer contacto', contacted: 'Calificar', qualified: 'Enviar propuesta', proposal: 'Seguir propuesta', negotiating: 'Cerrar seña', booked: 'Cobrar cuota', lost: '—' };
  function mapLead(r) {
    const st = STAGES.find(s => s.key === r.stage);
    return {
      id: r.id, nombre: r.full_name || '—', empresa: r.company || '—',
      salida: r.trip_id || '', etapa: r.stage_label || (st ? st.label : r.stage), stageKey: r.stage,
      fuente: r.source || '', resp: OP_BY_UID[r.assigned_to] || 'brian',
      potUSD: Math.round((Number(r.potential_total_usd) || 0) / 1000),
      pax: r.pax_count || 1, fit: 0, dias: r.days_stale || 0, next: NEXT_BY_STAGE[r.stage] || '',
      email: r.email || '', phone: r.phone || '', campaign: r.source_campaign || '',
      assignedName: r.assigned_to_name || '', eventCount: Number(r.event_count) || 0
    };
  }

  const MES_ABBR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  function ymToM(ym) { const mm = parseInt(String(ym || '').slice(5, 7), 10); return MES_ABBR[mm - 1] || ym; }
  function dueEstado(r) { if (r.status === 'paid') return 'pagado'; if (r.status === 'overdue' || r.dias < 0) return 'vencido'; if (r.dias <= 7) return 'proximo'; return 'alcorriente'; }
  function mapDue(r) {
    return { id: r.id, cliente: r.full_name || '—', salida: r.trip_id || '', monto: Number(r.amount) || 0, estado: dueEstado(r), dias: r.dias, cuota: r.label || '', region: r.region_label || '', currency: r.currency || 'USD', vence: r.due_date || null };
  }

  // Compone "El Puente" (cola del día) desde finanzas + leads + salidas ya hidratados
  function composePuente() {
    const out = []; let id = 1;
    (finanzas.cuotas || []).forEach(c => {
      if (c.estado === 'vencido') out.push({ id: id++, _order: 0, tipo: 'cobro', sev: 'bad', icon: 'alert', titulo: 'Cobro vencido · ' + c.cliente, meta: money(c.monto, 'USD') + ' · ' + c.cuota + ' · ' + Math.abs(c.dias) + 'd vencido', salida: c.salida, accion: 'Marcar cobrado', who: 'brian' });
      else if (c.estado === 'proximo') out.push({ id: id++, _order: 2, tipo: 'cobro', sev: 'risk', icon: 'clock', titulo: 'Cobro próximo · ' + c.cliente, meta: money(c.monto, 'USD') + ' · ' + c.cuota + ' · vence en ' + c.dias + 'd', salida: c.salida, accion: 'Enviar recordatorio', who: 'brian' });
    });
    salidas.filter(s => ['risk', 'opcion'].includes(s.estado) && s.dias > 0).sort((a, b) => a.dias - b.dias).slice(0, 3).forEach(s => {
      const beOk = s.conf >= s.breakeven, accOk = s.accesosOk >= 2;
      if (beOk && accOk) return;
      const faltan = []; if (!beOk) faltan.push('break-even ' + s.conf + '/' + s.breakeven); if (!accOk) faltan.push('accesos ' + s.accesosOk + '/' + s.accesosTot);
      out.push({ id: id++, _order: s.dias <= 7 ? 1 : 3, tipo: 'gonogo', sev: s.dias <= 7 ? 'bad' : 'risk', icon: 'flag', titulo: 'Decisión GO/NO-GO · ' + s.region, meta: s.dias + 'd para decidir · falta ' + faltan.join(' + '), salida: s.id, accion: 'Abrir viaje', who: 'brian' });
    });
    leads.filter(l => ['negotiating', 'proposal'].includes(l.stageKey)).sort((a, b) => b.potUSD - a.potUSD).slice(0, 3).forEach(l => {
      const s = salidaById(l.salida);
      out.push({ id: id++, _order: 4, tipo: 'lead', sev: 'go', icon: 'spark', titulo: 'Por cerrar · ' + l.nombre, meta: l.etapa + ' · US$ ' + l.potUSD + 'k' + (s ? ' · ' + s.region : ''), salida: l.salida, accion: 'Abrir lead', who: l.resp });
    });
    leads.filter(l => l.dias > 10 && !['booked', 'lost'].includes(l.stageKey)).sort((a, b) => b.dias - a.dias).slice(0, 3).forEach(l => {
      out.push({ id: id++, _order: 5, tipo: 'cadencia', sev: 'info', icon: 'snow', titulo: 'Se enfría · ' + l.nombre, meta: l.etapa + ' · ' + l.dias + 'd sin contacto · US$ ' + l.potUSD + 'k', salida: l.salida, accion: 'Preparar mail', who: l.resp });
    });
    out.sort((a, b) => a._order - b._order);
    return out.slice(0, 8);
  }

  const source = {
    async trips() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return salidas;                    // demo → mock
      try {
        const { data, error } = await window.SB.rpc('trips_board'); // RPC trips_board (devuelve array JSON)
        if (error || !data) return salidas;
        const arr = Array.isArray(data) ? data : (data.trips_board || (data[0] && data[0].trips_board) || []);
        const list = (arr || []).map(mapTrip);
        return list.length ? list : salidas;
      } catch (e) { return salidas; }
    },
    async hydrateTrips() {
      const list = await this.trips();
      if (Array.isArray(list) && list.length) { salidas.length = 0; list.forEach(x => salidas.push(x)); }
      return salidas;
    },
    async puente() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return puente;                     // demo → mock
      const composed = composePuente();
      return composed.length ? composed : puente;
    },                                                            // compone desde finanzas+leads+salidas (daily-brief)
    async hydratePuente() {
      const list = await this.puente();
      if (Array.isArray(list) && list !== puente) { puente.length = 0; list.forEach(x => puente.push(x)); }
      return puente;
    },
    async estado() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return estado;                     // demo → mock
      const cnt = key => salidas.filter(s => s.estado === key).length;
      const sum = (arr, f) => arr.reduce((a, x) => a + (Number(f(x)) || 0), 0);
      const hot = leads.filter(l => ['qualified', 'proposal', 'negotiating'].includes(l.stageKey));
      const active = salidas.filter(s => s.estado !== 'nogo');
      const F = finanzas.totales || {};
      return {
        caja: { cobrado: Math.round((F.cobradoMes || 0) / 1000), porCobrar: Math.round((F.porCobrar || 0) / 1000), vencido: Math.round((F.vencido || 0) / 1000), prox7: Math.round((F.prox7 || 0) / 1000), unit: 'US$k' },
        butacas: { vendidas: sum(active, s => s.conf), breakeven: sum(active, s => s.breakeven), capacidad: sum(active, s => s.capacity || 0) },
        leadsCalientes: hot.length,
        leadsCalientesPipeUSD: sum(hot, l => l.potUSD),
        forecast: { val: sum(salidas, s => s.forecastUSD), unit: 'US$k', delta: null, spark: null },
        salidasActivas: { go: cnt('go'), risk: cnt('risk'), opcion: cnt('opcion'), curso: cnt('curso') }
      };
    },                                                            // compone desde finanzas+leads+salidas
    async hydrateEstado() {
      const e = await this.estado();
      if (e && e !== estado) { Object.assign(estado, e); }
      return estado;
    },
    async leads() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return leads;                      // demo → mock
      try {
        const { data, error } = await window.SB.rpc('leads_crm_pipeline', { p_search: null, p_assigned_to: null, p_source: null, p_trip_id: null });
        if (error || !Array.isArray(data)) return leads;
        const list = data.map(mapLead);
        return list.length ? list : leads;
      } catch (e) { return leads; }
    },
    async hydrateLeads() {
      const list = await this.leads();
      if (Array.isArray(list) && list.length) { leads.length = 0; list.forEach(x => leads.push(x)); }
      return leads;
    },
    async hydrate() { await this.hydrateTrips(); await this.hydrateAccesos(); await this.hydrateLeads(); await this.hydratePayments(); await this.hydrateFinanzas(); await this.hydrateEstado(); await this.hydratePuente(); await this.hydrateBandeja(); await this.hydrateBiblioteca(); await this.hydrateClientes(); await this.hydrateHistorial(); await this.hydrateFunnel(); await this.hydrateCadencias(); await this.hydrateMarketing(); },
    async funnel() {
      const L = (window.BA && window.BA.leads) || [];
      if (!L.length) return funnel;
      const defs = [ { key:'new', etapa:'Nuevos', color:'#8B8478' }, { key:'contacted', etapa:'Contactados', color:'#3F6B78' }, { key:'qualified', etapa:'Calificado', color:'#6B6258' }, { key:'proposal', etapa:'Propuesta', color:'#B8945A' }, { key:'negotiating', etapa:'Negociaci\u00f3n', color:'#4A6A4B' }, { key:'booked', etapa:'Reservado', color:'#3D5A3E' } ];
      return defs.map(d => { const items = L.filter(l => l.stageKey === d.key); return { etapa: d.etapa, n: items.length, valUSD: items.reduce((sm, l) => sm + (l.potUSD || 0), 0), color: d.color }; });
    },                                                            // derivado de leads reales (leads_crm_pipeline)
    async hydrateFunnel() {
      const list = await this.funnel();
      if (window.BA && Array.isArray(window.BA.funnel)) { window.BA.funnel.length = 0; (list || []).forEach(x => window.BA.funnel.push(x)); }
      return window.BA && window.BA.funnel;
    },
    async cadencias() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return cadencias;
      try {
        const { data, error } = await window.SB.rpc('cadence_board');
        if (error || !data) return cadencias;
        const reglas = (data.reglas || []).map(r => ({ id: r.id, stage: r.stage, stageLabel: r.stage_label || r.stage, step: r.step, offset: r.offset, channel: r.channel, name: r.name, subject: r.subject || '', body: r.body || '' }));
        const cola = (data.cola || []).map(q => ({ leadId: q.lead_id, lead: q.lead, stage: q.stage, stageLabel: q.stage_label || q.stage, email: q.email || '', phone: q.phone || '', tripId: q.trip_id || null, step: q.step, channel: q.channel, name: q.name, subject: q.subject || '', body: q.body || '', offset: q.offset, dueAt: q.due_at, diasEnEtapa: Number(q.days_in_stage) || 0 }));
        return { reglas: reglas.length ? reglas : cadencias.reglas, cola };
      } catch (e) { return cadencias; }
    },                                                            // RPC cadence_board (reglas + cola reales)
    async hydrateCadencias() {
      const r = await this.cadencias();
      if (r && r.reglas) { cadencias.reglas = r.reglas; cadencias.cola = r.cola || []; }
      return cadencias;
    },
    async logCadenceStep({ leadId, channel }) {
      if (!window.SB || !leadId) return { error: 'sin lead' };
      try {
        const { data, error } = await window.SB.rpc('cadence_log_step', { p_lead_id: leadId, p_channel: channel });
        if (error) return { error: error.message };
        await this.hydrateCadencias();
        try { window.dispatchEvent(new Event('cadence:refresh')); } catch (e) {}
        return data || { ok: true };
      } catch (e) { return { error: String(e) }; }
    },                                                            // registra el toque (lead_events) y refresca la cola
    async providersLibrary() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return (window.BA && window.BA.biblioteca) || [];
      try {
        const { data, error } = await window.SB.rpc('providers_library');
        if (error || !Array.isArray(data)) return (window.BA && window.BA.biblioteca) || [];
        const TMAP = { restaurant:'meal', meal:'meal', winery:'wine', wine:'wine', hotel:'lodging', lodging:'lodging', villa:'villa', transfer:'transfer', guide:'experience', activity:'experience', expert:'experience', experience:'experience', culture:'experience', truffle:'experience', nature:'experience', service:'service' };
        const SMAP = { confirmada:'confirmada', confirmed:'confirmada', conversando:'conversando', negotiating:'conversando', pendiente:'pendiente', pending:'pendiente', identificado:'pendiente', '':'pendiente' };
        const slug = n => (n || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'prov';
        return data.map(pr => ({
          id: 'lib-' + slug(pr.name),
          name: pr.name || 'Proveedor',
          type: TMAP[(pr.type || '').toLowerCase()] || 'service',
          michelin: Number(pr.michelin) || 0,
          priceRange: pr.priceRange || '',
          location: pr.location || '',
          salidas: Array.isArray(pr.salidas) ? pr.salidas : [],
          reservationStatus: SMAP[(pr.reservationStatus || '').toLowerCase()] || 'pendiente',
          closingDays: '\u2014',
          web: pr.web || '\u2014',
          email: pr.email || '\u2014',
          phone: pr.phone || '\u2014',
          notes: pr.notes || '',
          comms: [],
          attachments: []
        }));
      } catch (e) { return (window.BA && window.BA.biblioteca) || []; }
    },                                                            // RPC providers_library (agrega proveedores reales de todos los viajes)
    async hydrateBiblioteca() {
      const list = await this.providersLibrary();
      if (Array.isArray(list) && list.length && window.BA && Array.isArray(window.BA.biblioteca)) {
        window.BA.biblioteca.length = 0; list.forEach(x => window.BA.biblioteca.push(x));
        if (window.BA._provCache) { window.BA._provCache = {}; }
      }
      return window.BA && window.BA.biblioteca;
    },
    async clientes() {
      const booked = ((window.BA && window.BA.leads) || []).filter(l => l.stageKey === 'booked');
      return booked.map(l => {
        const s = window.BA.salidaById ? window.BA.salidaById(l.salida) : null;
        return { id: l.id, nombre: l.nombre || '\u2014', email: l.email || '', empresa: l.empresa || '', salida: l.salida,
          ultimo: s ? (s.titulo || s.region) : (l.salida || '\u2014'), ltvUSD: l.potUSD || 0, viajes: 1, trajo: 0, nps: null, estado: 'reservado' };
      });
    },                                                            // cartera real = leads reservados (booked)
    async hydrateClientes() {
      const list = await this.clientes();
      if (window.BA && Array.isArray(window.BA.clientes)) { window.BA.clientes.length = 0; (list || []).forEach(x => window.BA.clientes.push(x)); }
      return window.BA && window.BA.clientes;
    },
    async historial() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return (window.BA && window.BA.changes) || [];
      try {
        const { data, error } = await window.SB.rpc('activity_feed', { p_limit: 40 });
        if (error || !Array.isArray(data)) return (window.BA && window.BA.changes) || [];
        const rw = (iso) => { if (!iso) return ''; const d = new Date(iso), n = new Date(); const sd = d.toDateString() === n.toDateString(); const yd = new Date(n); yd.setDate(n.getDate() - 1); const isy = d.toDateString() === yd.toDateString(); const hm = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }); if (sd) return 'hoy ' + hm; if (isy) return 'ayer ' + hm; return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) + ' ' + hm; };
        return data.map(e => ({ author: e.author || 'Sistema', event_type: e.event_type || 'trip', summary: e.summary || '', trip: e.trip || null, when: rw(e.ts) }));
      } catch (e) { return (window.BA && window.BA.changes) || []; }
    },                                                            // RPC activity_feed (comentarios + leads + cobros reales)
    async hydrateHistorial() {
      const list = await this.historial();
      if (window.BA && Array.isArray(window.BA.changes)) { window.BA.changes.length = 0; (list || []).forEach(x => window.BA.changes.push(x)); }
      return window.BA && window.BA.changes;
    },
    async finanzas() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return finanzas;
      try {
        const [dueR, cashR] = await Promise.all([
          window.SB.rpc('payments_due', { p_days: 365 }),
          window.SB.rpc('cashflow_projection')
        ]);
        const due = Array.isArray(dueR.data) ? dueR.data : [];
        const cash = Array.isArray(cashR.data) ? cashR.data : [];
        const cuotas = due.map(mapDue);
        const caja = cash.map(c => ({ m: ymToM(c.ym), cobrado: Math.round((Number(c.cobrado) || 0) / 1000), porCobrar: Math.round((Number(c.por_cobrar) || 0) / 1000), vencido: Math.round((Number(c.vencido) || 0) / 1000) }));
        const nowYm = new Date().toISOString().slice(0, 7);
        const totales = {
          porCobrar: cash.reduce((s, c) => s + (Number(c.por_cobrar) || 0), 0),
          vencido: cash.reduce((s, c) => s + (Number(c.vencido) || 0), 0),
          prox7: cuotas.filter(c => c.estado !== 'pagado' && c.dias >= 0 && c.dias <= 7).reduce((s, c) => s + c.monto, 0),
          cobradoMes: cash.filter(c => c.ym === nowYm).reduce((s, c) => s + (Number(c.cobrado) || 0), 0),
          nVencidas: cuotas.filter(c => c.estado === 'vencido').length,
          nProx7: cuotas.filter(c => c.estado !== 'pagado' && c.dias >= 0 && c.dias <= 7).length
        };
        return { totales, caja, cuotas, margenes: [] };
      } catch (e) { return finanzas; }
    },                                                            // RPC payments_due + cashflow_projection
    async forecast() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return proyeccion;
      try {
        const { data } = await window.SB.rpc('sales_forecast');
        if (!Array.isArray(data)) return proyeccion;
        return data.map(r => ({ m: ymToM(r.ym), forecast: Math.round((Number(r.ingreso_forecast) || 0) / 1000), comprometido: Math.round((Number(r.ingreso_comprometido) || 0) / 1000) }));
      } catch (e) { return proyeccion; }
    },                                                            // RPC sales_forecast
    async hydrateFinanzas() {
      const f = await this.finanzas();
      if (f && f !== finanzas) { finanzas.totales = f.totales; finanzas.caja = f.caja; finanzas.cuotas = f.cuotas; finanzas.margenes = f.margenes || []; }
      const fc = await this.forecast();
      if (Array.isArray(fc) && fc !== proyeccion) { proyeccion.length = 0; fc.forEach(x => proyeccion.push(x)); }
      return finanzas;
    },
    async bandeja() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return bandeja;
      try {
        const { data, error } = await window.SB.rpc('unified_inbox_list', { p_limit: 100 });
        if (error || !Array.isArray(data)) return bandeja;
        const rel = (iso) => { if (!iso) return ''; const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000); if (mins < 60) return 'hace ' + Math.max(1, mins) + ' min'; const h = Math.floor(mins / 60); if (h < 24) return 'hace ' + h + ' h'; return 'hace ' + Math.floor(h / 24) + ' d'; };
        const ORIGEN = { meta_ads: 'Meta Ads', meta_lead: 'Meta Lead Ads', form: 'Formulario web', formulario: 'Formulario web', web: 'Formulario web', organic: 'Org\u00e1nico', referral: 'Referido' };
        return data.map(e => {
          const isWa = e.channel === 'wa';
          const fromRaw = e.from_addr || '';
          const mm = fromRaw.match(/^\s*"?([^"<]+?)"?\s*</);
          const de = isWa ? ((e.contact_name || e.wa_from || '—')) : (((mm ? mm[1].trim() : fromRaw)) || '—');
          const prio = e.ai_priority || 'Normal';
          const sev = prio === 'Alta' ? 'bad' : prio === 'Media' ? 'risk' : 'info';
          const extra = (e.ai_extracted && typeof e.ai_extracted === 'object' && !Array.isArray(e.ai_extracted)) ? e.ai_extracted : {};
          return {
            id: e.id, fromAddr: fromRaw, de, canal: e.channel || 'email', waFrom: e.wa_from || null, cuenta: isWa ? 'WhatsApp' : ((e.account || 'info') + '@'), asunto: isWa ? (e.contact_name || e.wa_from || 'WhatsApp') : (e.subject || '(sin asunto)'),
            cat: e.ai_category || 'Sin clasificar', sev, prio, idioma: e.ai_language || 'ES',
            hace: rel(e.ts), salida: e.trip_id || null,
            resumen: e.ai_summary || e.snippet || e.body_text || '',
            extra, necesitaResp: e.direction === 'inbound' && e.status !== 'replied' && e.status !== 'archived',
            leido: !!e.is_read || e.status === 'read' || e.status === 'replied',
            borrador: e.ai_suggested_reply || '',
            conciliar: (e.pay_due && typeof e.pay_due === 'object') ? { cuotaId: e.pay_due.id, label: e.pay_due.label || ('Cuota ' + (e.pay_due.n_cuota || '')), monto: Number(e.pay_due.amount) || 0, moneda: e.pay_due.currency || 'USD' } : null,
            cruce: e.lead_id ? { leadId: e.lead_id, lead: e.lead_name || de, origen: ORIGEN[e.lead_source] || e.lead_source || '\u2014', campania: e.lead_campaign || '', adId: e.lead_ad_id || '', score: (e.lead_fit != null ? e.lead_fit : null), tier: e.lead_tier || '', etapa: e.lead_stage || '', telefono: e.lead_phone || '', nlOpens: Number(e.nl_opens) || 0, nlClicks: Number(e.nl_clicks) || 0, suscriptor: !!e.is_subscriber } : null
          };
        });
      } catch (e) { return bandeja; }
    },                                                            // RPC emails_list (triage email-ai cuando exista)
    async hydrateBandeja() {
      const list = await this.bandeja();
      if (Array.isArray(list) && list !== bandeja) { bandeja.length = 0; list.forEach(x => bandeja.push(x)); }
      return bandeja;
    },
    async accesos() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return accesos;
      try {
        const { data, error } = await window.SB.rpc('accesos_board');
        if (error || !Array.isArray(data)) return accesos;
        return data.map(a => ({ id: a.id, salida: a.salida, nombre: a.nombre || 'Acceso', figura: a.figura || '—', etapa: a.etapa || 'identificado', resp: a.resp || 'brian', deadline: a.deadline || '—', planb: '—', region: a.region || '', tripTitle: a.trip_title || '', michelin: a.michelin || 0 }));
      } catch (e) { return accesos; }
    },                                                            // RPC accesos_board (providers type=expert)
    async hydrateAccesos() {
      const list = await this.accesos();
      if (Array.isArray(list) && list !== accesos) { accesos.length = 0; list.forEach(x => accesos.push(x)); }
      return accesos;
    },
    async setAccesoEtapa(tripId, providerId, etapa) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: true, local: true };
      try {
        const { data, error } = await window.SB.rpc('set_acceso_etapa', { p_trip_id: tripId, p_provider_id: providerId, p_etapa: etapa });
        if (error) return { ok: false, error: error.message };
        return { ok: !!(data && data.ok), status: data && data.status };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // RPC set_acceso_etapa (persiste reservationStatus en trips.data)
    async copiloto(question, history) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, respuesta: 'El copiloto necesita una sesión activa.', acciones: [] };
      try {
        const { data, error } = await window.SB.functions.invoke('copiloto', { body: { question, history: history || [] } });
        if (error) {
          let msg = error.message;
          try { const j = await error.context.json(); if (j && (j.respuesta || j.error)) msg = j.respuesta || j.error; } catch (e) {}
          return { ok: false, respuesta: 'No pude procesar eso: ' + msg, acciones: [] };
        }
        return { ok: !!(data && data.ok), respuesta: (data && data.respuesta) || '', acciones: (data && data.acciones) || [] };
      } catch (e) { return { ok: false, respuesta: 'Error: ' + String((e && e.message) || e), acciones: [] }; }
    },                                                            // edge fn copiloto (Claude Sonnet · foto del negocio)
    async iaUsage() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('ia_usage'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // RPC ia_usage (agrega claude_usage)
    async resumenEjecutivo() {
      return this.copiloto('Dame el resumen ejecutivo del día en 4 a 6 líneas: estado general del portafolio (cuántas salidas y en qué situación), lo más urgente entre cobros, decisiones GO/NO-GO y accesos por cerrar, y qué deberías priorizar hoy. Concreto y con las cifras reales. Sumá 3 acciones.');
    },                                                            // resumen ejecutivo vía copiloto
    async briefLatest() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('brief_latest'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // RPC brief_latest (último brief guardado, sin generar)
    async briefSave(respuesta, acciones, source) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false };
      try { const { data, error } = await window.SB.rpc('brief_save', { p_respuesta: respuesta, p_acciones: acciones || [], p_source: source || 'manual', p_model: 'claude-sonnet-4-6' }); if (error) return { ok: false, error: error.message }; return data || { ok: true }; } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // RPC brief_save (persiste el brief)
    async highlightsList(tripId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return [];
      try { const { data, error } = await window.SB.from('content_highlights').select('id,dia,titulo,jerarquia').eq('trip_id', tripId); return error ? [] : (data || []); } catch (e) { return []; }
    },                                                            // highlights ★ de un viaje (La Editorial)
    async highlightToggle(tripId, dia, titulo, descripcion) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false };
      try {
        const { data: ex } = await window.SB.from('content_highlights').select('id').eq('trip_id', tripId).eq('dia', dia).eq('titulo', titulo).maybeSingle();
        if (ex && ex.id) { const { error } = await window.SB.from('content_highlights').delete().eq('id', ex.id); return { ok: !error, marked: false }; }
        const { data, error } = await window.SB.from('content_highlights').insert({ trip_id: tripId, dia: dia, titulo: titulo, descripcion: descripcion || null }).select('id').maybeSingle();
        return { ok: !error, marked: true, id: data && data.id };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // toggle ★ highlight (La Editorial)
    async editorialBoard() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('editorial_board'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // tablero La Editorial (config + ediciones + highlights + piezas)
    async planGenerateWeek(lunes) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('plan_generate_week', { p_lunes: lunes || null });
        if (error) return { ok: false, error: error.message };
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // genera la semana del plan desde la semana tipo
    async editorialGuion(piezaId) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const { data, error } = await window.SB.functions.invoke('editorial-factory', { body: { op: 'guion', pieza_id: piezaId } });
        if (error) {
          let msg = error.message || 'error';
          try { const ctx = await error.context.json(); if (ctx && ctx.error) msg = ctx.error; } catch (e2) {}
          return { ok: false, error: msg };
        }
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // la fábrica escribe el guion de una pieza (La Editorial)
    async highlightsFull() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('highlights_full'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // highlights con enriquecimiento (E4)
    async highlightEnrich(highlightId) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const { data, error } = await window.SB.functions.invoke('editorial-factory', { body: { op: 'highlight', highlight_id: highlightId } });
        if (error) {
          let msg = error.message || 'error';
          try { const ctx = await error.context.json(); if (ctx && ctx.error) msg = ctx.error; } catch (e2) {}
          return { ok: false, error: msg };
        }
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // la fábrica enriquece un highlight (E4)
    async piezaColabs(piezaId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('pieza_colabs', { p_pieza_id: piezaId }); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // figuras y lugares del destino como colab (E4)
    async publicarBoard() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('publicar_board'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // tablero de publicación (E5)

    async labSeries() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('lab_series'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // laboratorio por serie (Fase 4)

    async programarPieza(id, whenIso) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try { const { data, error } = await window.SB.rpc('pieza_set_schedule', { p_id: id, p_when: whenIso }); if (error) return { ok: false, error: error.message }; return data; } catch (e) { return { ok: false, error: String(e) }; }
    },                                                            // programar/desprogramar pieza (Fase 4)
    async blogPublish(piezaId, slug) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const s = (slug || '').trim();
        if (s) {
          const { error: se } = await window.SB.rpc('blog_set_slug', { p_id: piezaId, p_slug: s });
          if (se) return { ok: false, error: 'slug: ' + (se.message || 'error') };
        }
        const { data, error } = await window.SB.functions.invoke('blog-publish', { body: { pieza_id: piezaId } });
        if (error) {
          let msg = error.message || 'error';
          try { const ctx = await error.context.json(); if (ctx && ctx.error) msg = ctx.error; } catch (e2) {}
          return { ok: false, error: msg };
        }
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },
    async newsletterSend(piezaId, mode, testTo) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const { data, error } = await window.SB.functions.invoke('newsletter-send', { body: { pieza_id: piezaId, mode: mode || 'test', test_to: testTo || null } });
        if (error) {
          let msg = error.message || 'error';
          try { const ctx = await error.context.json(); if (ctx && ctx.error) msg = ctx.error; } catch (e2) {}
          return { ok: false, error: msg };
        }
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // envía newsletter por Resend (E5)
    async subscribersBoard() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('subscribers_board'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // lista del Cuaderno (E5)
    async subscriberAdd(email, name) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try { const { data, error } = await window.SB.rpc('subscriber_add', { p_email: email, p_name: name || null }); if (error) return { ok: false, error: error.message }; return data || { ok: false }; } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // sumar suscriptor (E5)
    async subscriberSetStatus(id, status) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try { const { data, error } = await window.SB.rpc('subscriber_set_status', { p_id: id, p_status: status }); if (error) return { ok: false, error: error.message }; return data || { ok: false }; } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // alta/baja suscriptor (E5)
    async subscribersImport(raw) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try { const { data, error } = await window.SB.rpc('subscribers_import', { p_raw: raw }); if (error) return { ok: false, error: error.message }; return data || { ok: false }; } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // importar lista (E5)
    async assetsBoard() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('assets_board'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // biblioteca de assets + cobertura del kit por destino
    async assetAdd(asset) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false };
      try {
        const { data, error } = await window.SB.from('content_assets').insert(asset).select('id').maybeSingle();
        if (error) return { ok: false, error: error.message };
        return { ok: true, id: data && data.id };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // alta de asset (La Editorial)
    async assetDelete(id) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false };
      try { const { error } = await window.SB.from('content_assets').delete().eq('id', id); return { ok: !error, error: error && error.message }; } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // baja de asset (La Editorial)
    async itineraryApply(tripId, op, payload) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('itinerary_apply', { p_trip_id: tripId, p_op: op, p_payload: payload || {} });
        if (error) return { ok: false, error: error.message };
        if (data && data.ok && data.data && window.BA && window.BA._mapTripData) {
          window.BA._tripCache[tripId] = window.BA._mapTripData(tripId, data.data);
          return { ok: true, itinerario: window.BA._tripCache[tripId].itinerario };
        }
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // editor de itinerario: ops sobre trips.data->itinerary
    async tripDataApply(tripId, section, op, payload) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('trip_data_apply', { p_trip_id: tripId, p_section: section, p_op: op, p_payload: payload || {} });
        if (error) return { ok: false, error: error.message };
        if (data && data.ok && data.data && window.BA && window.BA._mapTripData) {
          const prev = window.BA._tripCache[tripId];
          const mapped = window.BA._mapTripData(tripId, data.data);
          if (prev && prev.accessCode) mapped.accessCode = prev.accessCode;
          window.BA._tripCache[tripId] = mapped;
          return { ok: true, data: data.data };
        }
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // CRUD de data.actions / data.budget (Tareas + Presupuesto)
    async getMapsKey() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('get_maps_key'); if (error) return null; return data || null; } catch (e) { return null; }
    },
    async setTripAccessCode(tripId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('set_trip_access_code', { p_trip_id: tripId });
        if (error) return { ok: false, error: error.message };
        const code = data || '';
        if (window.BA._tripCache[tripId]) window.BA._tripCache[tripId].accessCode = code;
        return { ok: true, code };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // genera/persiste el código de acceso del cliente
    async tripSnapshots(tripId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return [];
      try {
        const { data, error } = await window.SB.rpc('trip_snapshots', { p_trip_id: tripId });
        if (error || !Array.isArray(data)) return [];
        return data.map(mapSnap);
      } catch (e) { return []; }
    },
    async saveSnapshot(tripId, name) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('save_trip_snapshot', { p_trip_id: tripId, p_name: name || 'Snapshot manual' });
        if (error) return { ok: false, error: error.message };
        const row = Array.isArray(data) ? data[0] : data;
        return Object.assign({ ok: true }, mapSnap(row || {}));
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },
    async restoreSnapshot(snapId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('restore_trip_snapshot', { p_snapshot_id: snapId });
        if (error) return { ok: false, error: error.message };
        return { ok: true, data: data };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },
    async exportTrip(tripId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try {
        const { data, error } = await window.SB.from('trips').select('data').eq('id', tripId).single();
        if (error || !data) return null;
        return data.data || {};
      } catch (e) { return null; }
    },
    async setTripData(tripId, payload) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('set_trip_data', { p_trip_id: tripId, p_data: payload });
        if (error) return { ok: false, error: error.message };
        return { ok: true, data: data };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },
    async createTrip(payload) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const p = payload || {};
        const slug = (p.id || p.title || 'viaje').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'viaje';
        let id = slug;
        const exists = async (cid) => { const { data } = await window.SB.from('trips').select('id').eq('id', cid).maybeSingle(); return !!data; };
        if (await exists(id)) id = slug + '-' + Math.random().toString(36).slice(2, 6);
        const data = { meta: { region: p.region || '', baseCurrency: p.currency || 'USD', fx: { USD: 1 }, payingPax: p.pax || 0, ticketUSD: p.ticketUSD || 0 }, itinerary: [], providers: [], budget: [], actions: [] };
        const row = { id, title: p.title || 'Viaje sin título', status: p.status || 'planning', data };
        if (p.start_date) row.start_date = p.start_date;
        if (p.end_date) row.end_date = p.end_date;
        if (p.region) row.region_label = p.region;
        if (p.pax) row.pax_count = p.pax;
        if (p.minPax) row.min_pax = p.minPax;
        if (p.go_status) row.go_status = p.go_status;
        if (typeof p.sellable === 'boolean') row.sellable = p.sellable;
        const { error } = await window.SB.from('trips').insert(row);
        if (error) return { ok: false, error: error.message };
        await this.hydrateTrips();
        return { ok: true, id };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // alta de viaje (insert trips, RLS is_any_operator)
    async fileUpload(path, file) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const { error } = await window.SB.storage.from('trip-files').upload(path, file, { upsert: false });
        if (error) return { ok: false, error: error.message };
        return { ok: true, path };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // sube adjunto al bucket trip-files
    async fileSignedUrl(path) {
      if (!window.SB) return null;
      try { const { data, error } = await window.SB.storage.from('trip-files').createSignedUrl(path, 3600); if (error) return null; return data && data.signedUrl; } catch (e) { return null; }
    },                                                            // URL firmada (1 h) para abrir un adjunto
    async fileRemove(path) {
      if (!window.SB) return { ok: false };
      try { const { error } = await window.SB.storage.from('trip-files').remove([path]); return { ok: !error, error: error && error.message }; } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // borra un adjunto del bucket
    async aprobacionCola() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('aprobacion_cola'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // cola de aprobación (E4)
    async piezaReview(piezaId, decision, motivo) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('pieza_review', { p_pieza_id: piezaId, p_decision: decision, p_motivo: motivo || null });
        if (error) return { ok: false, error: error.message };
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // aprobar / rechazar / reabrir pieza
    async feedGrid() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('feed_grid'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // grilla del feed IG (E4)
    async piezaSetCover(piezaId, url) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.rpc('pieza_set_cover', { p_pieza_id: piezaId, p_url: url || null });
        if (error) return { ok: false, error: error.message };
        return data || { ok: false };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // portada de una pieza del feed
    async tandaBoard() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('tanda_board'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // vista Tanda: semanas + colchón (E4)
    async sendEmail({ account, to, subject, html, text, replyToId }) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const { data, error } = await window.SB.functions.invoke('email-send', {
          body: { account: account || 'reservas', to, subject, html: html || null, text: text || null, reply_to_email_id: replyToId || null }
        });
        if (error) {
          let msg = error.message || 'error al enviar';
          try { const ctx = await error.context.json(); if (ctx && ctx.error) msg = ctx.error; } catch (e2) {}
          return { ok: false, error: msg };
        }
        if (data && data.ok) return { ok: true, resendId: data.resend_id, emailId: data.email_id };
        return { ok: false, error: (data && data.error) || 'error desconocido' };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // edge fn email-send (Resend)
    async sendWa({ to, text }) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const { data, error } = await window.SB.functions.invoke('wa-send', { body: { to, text } });
        if (error) {
          let msg = error.message || 'error al enviar';
          try { const ctx = await error.context.json(); if (ctx && (ctx.detail || ctx.error)) msg = ctx.detail || ctx.error; } catch (e2) {}
          return { ok: false, error: msg };
        }
        if (data && data.ok) return { ok: true, wamid: data.wamid, id: data.id };
        return { ok: false, error: (data && (data.detail || data.error)) || 'error desconocido' };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // edge fn wa-send (WhatsApp Cloud API)
    async createTask({ title, detail, priority, emailId, leadId, tripId }) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const row = { title, detail: detail || null, status: 'pendiente', priority: priority || null, source: 'bandeja',
          email_id: emailId || null, lead_id: leadId || null, trip_id: tripId || null };
        const { data, error } = await window.SB.from('tasks').insert(row).select('id').single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, id: data && data.id };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // inserta en tasks (real)
    async archiveInbox({ id, canal }) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const tbl = canal === 'wa' ? 'wa_messages' : 'emails';
        const { error } = await window.SB.from(tbl).update({ status: 'archived' }).eq('id', id);
        if (error) return { ok: false, error: error.message };
        return { ok: true };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // status='archived' (real)
    async linkTripInbox({ id, canal, tripId }) {
      if (!window.SB) return { ok: false, error: 'sin conexión' };
      try {
        const tbl = canal === 'wa' ? 'wa_messages' : 'emails';
        const { error } = await window.SB.from(tbl).update({ trip_id: tripId }).eq('id', id);
        if (error) return { ok: false, error: error.message };
        return { ok: true };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // escribe trip_id (real)
    async marketing() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return marketing;
      try {
        const { data, error } = await window.SB.rpc('marketing_attribution');
        if (error || !data) return marketing;
        const atribucion = (data.fuentes || []).map(f => ({ fuente: f.fuente, source: f.source, leads: f.leads, reservas: f.reservas, conv: f.conv, revUSD: f.revUSD, color: f.color }));
        const camps = (data.campanias || []).map(c => ({ name: c.name, source: c.source, leads: c.leads, reservas: c.reservas, conv: c.conv, revUSD: c.revUSD }));
        return { atribucion: atribucion.length ? atribucion : marketing.atribucion, campañas: camps };
      } catch (e) { return marketing; }
    },                                                            // RPC marketing_attribution (derivado de leads.source)
    async hydrateMarketing() {
      const r = await this.marketing();
      if (r && r.atribucion) { marketing.atribucion = r.atribucion; if (r.campañas) marketing.campañas = r.campañas; }
      return marketing;
    },
    async leadQuality() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('lead_quality_board'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // RPC lead_quality_board (scoring IA)
    async marketingBoard() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('marketing_board'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // RPC marketing_board (Meta + campañas)
    async marketingContentBoard() {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('marketing_content_board'); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // RPC marketing_content_board (piezas)
    async generateContent(tripId, channel, n) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const { data, error } = await window.SB.functions.invoke('mkt-actions', { body: { op: 'generate_content', trip_id: tripId, channel: channel || 'instagram', n: n || 3 } });
        if (error) { let m = error.message; try { const j = await error.context.json(); if (j && j.error) m = j.error; } catch (e2) {} return { ok: false, error: m }; }
        return data || { ok: false, error: 'sin respuesta' };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // edge fn mkt-actions → marketing-content
    async rescoreLeads(leadId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: false, error: 'sin sesión' };
      try {
        const body = leadId ? { op: 'rescore', lead_id: leadId } : { op: 'rescore', limit: 20 };
        const { data, error } = await window.SB.functions.invoke('mkt-actions', { body });
        if (error) { let m = error.message; try { const j = await error.context.json(); if (j && j.error) m = j.error; } catch (e2) {} return { ok: false, error: m }; }
        return data || { ok: false, error: 'sin respuesta' };
      } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
    },                                                            // edge fn mkt-actions → lead-score
    async calendario() { return { mes: calMes, eventos: calEventos }; },
    async leadChangeStage(id, stage) {
      const sess = await this.getSession();
      if (!window.SB || !sess) { const l = leads.find(x => x.id === id); if (l) l.stageKey = stage; return { ok: true }; }
      const { data, error } = await window.SB.rpc('lead_change_stage', { p_lead_id: id, p_new_stage: stage, p_note: null });
      return { data, error: error ? (error.message || 'No se pudo cambiar la etapa.') : null };
    }, // RPC lead_change_stage
    async markPaid(paymentId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: true };
      const { data, error } = await window.SB.rpc('mark_payment_paid', { p_payment_id: paymentId, p_method: null, p_when: null });
      return { data, error: error ? (error.message || 'No se pudo marcar el pago.') : null };
    },                                                            // RPC mark_payment_paid
    async leadFullDetail(id) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;
      try { const { data, error } = await window.SB.rpc('lead_full_detail', { p_lead_id: id }); if (error) return null; return data; } catch (e) { return null; }
    },                                                            // RPC lead_full_detail
    async leadAddNote(id, text) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { ok: true };
      const { data, error } = await window.SB.rpc('lead_add_note', { p_lead_id: id, p_text: text });
      return { data, error: error ? (error.message || 'No se pudo guardar la nota.') : null };
    },                                                            // RPC lead_add_note
    async generatePlan(leadId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return { data: null, error: null };  // demo → el caller usa el plan mock
      const { data, error } = await window.SB.rpc('generate_payment_plan', { p_lead_id: leadId });
      return { data, error: error ? (error.message || 'No se pudo generar el plan.') : null };
    },                                                            // RPC generate_payment_plan
    async leadPayments(tripId) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return [];
      try {
        const { data, error } = await window.SB.rpc('lead_payment_summary', { p_trip_id: tripId || null });
        if (error || !Array.isArray(data)) return [];
        return data;
      } catch (e) { return []; }
    },
    async hydratePayments() {
      const rows = await this.leadPayments(null);
      const byId = {}; (rows || []).forEach(r => { byId[r.lead_id] = r; });
      leads.forEach(l => {
        const r = byId[l.id];
        if (r && Number(r.total) > 0) {
          l.pagadoPct = Math.round((Number(r.paid) / Number(r.total)) * 100);
          l.cuotaLabel = (r.n_paid || 0) + '/' + (r.n_total || 0) + (r.n_total === 1 ? ' cuota' : ' cuotas');
          l.proxCuota = r.next_label || '';
          l.paidUSD = Math.round(Number(r.paid)); l.totalUSD = Math.round(Number(r.total));
        } else { l.pagadoPct = null; l.cuotaLabel = 'sin plan'; l.proxCuota = ''; }
      });
      return leads;
    },
    async getTrip(id) {
      const sess = await this.getSession();
      if (!window.SB || !sess) return null;                        // demo → caller usa el mock
      try {
        const { data, error } = await window.SB.from('trips').select('id,title,status,data,access_code,start_date,end_date').eq('id', id).single();
        if (error || !data) return null;
        const mapped = window.BA._mapTripData(id, data.data || {});
        mapped.accessCode = data.access_code || '';
        mapped.startDate = data.start_date || '';
        mapped.endDate = data.end_date || '';
        mapped.noches = (data.start_date && data.end_date) ? Math.max(0, Math.round((new Date(data.end_date) - new Date(data.start_date)) / 86400000)) : null;
        return mapped;
      } catch (e) { return null; }
    },                                                            // SELECT trips.data (RLS operador)
    async hydrateTrip(id) {
      const mapped = await this.getTrip(id);
      if (mapped) { window.BA._tripCache[id] = mapped; }
      return mapped;
    },
    // ---- Auth real (Supabase) ----
    async signIn(email, password) {
      if (!window.SB) return { error: 'No se pudo conectar.' };
      const { data, error } = await window.SB.auth.signInWithPassword({ email: (email || '').trim(), password });
      return { data, error: error ? (error.message || 'No se pudo ingresar.') : null };
    },
    async signOut() { if (window.SB) { try { await window.SB.auth.signOut(); } catch (e) {} } },
    async getSession() { if (!window.SB) return null; const { data } = await window.SB.auth.getSession(); return data ? data.session : null; },
    async resetPassword(email) { if (!window.SB) return { error: 'No disponible.' }; const { error } = await window.SB.auth.resetPasswordForEmail((email || '').trim()); return { error: error ? error.message : null }; },
  };

  return { brand, operadores, fx, sym, salidas, puente, estado, finanzas,
           funnel, leads, marketing, cadencias, bandeja, accesos, copiloto, cmd, calMes, calEventos, categorias, comentarios, notificaciones, snapshots, propuesta, proyeccion, source, money, salidaById, STAGES };
})();
