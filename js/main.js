/* ProNux: animaciones e interacción compartidas por todas las páginas.
   Cada bloque se activa solo si su sección existe en la página. */
(function(){
  var $=function(id){return document.getElementById(id)};
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt=function(v){return "$"+Math.round(v).toLocaleString("es-AR")};

  /* barra de progreso de lectura */
  var prog=$("progress");
  if(prog)addEventListener("scroll",function(){var h=document.documentElement;prog.style.transform="scaleX("+(h.scrollTop/((h.scrollHeight-h.clientHeight)||1))+")"},{passive:true});

  /* marca la página actual en el menú */
  var page=(location.pathname.split("/").pop()||"index.html").replace(".html","")||"index";
  document.querySelectorAll(".nav-links a").forEach(function(a){if(a.getAttribute("href").replace(".html","")===page)a.classList.add("active")});

  document.querySelectorAll(".mnav a:not(.btn)").forEach(function(a){if(a.getAttribute("href").replace(".html","")===page)a.classList.add("active")});

  /* menú del celular */
  var burger=$("burger"),mnav=$("mnav");
  if(burger&&mnav)burger.addEventListener("click",function(){var open=burger.getAttribute("aria-expanded")!=="true";burger.setAttribute("aria-expanded",String(open));burger.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú");mnav.hidden=!open});

  /* escritura rotativa del inicio */
  var tEl=$("typed");
  if(tEl&&!reduce){
    var words=["comercios","ferreterías","restaurantes","tiendas de ropa","fábricas","estudios profesionales","centros de estética","pymes de todo el país"];
    var wi=0,ci=words[0].length,del=true;
    var typeTick=function(){
      if(del){ci--;if(ci<=0){del=false;wi=(wi+1)%words.length;ci=0}}
      else{ci++;if(ci>=words[wi].length){del=true;tEl.textContent=words[wi];return setTimeout(typeTick,1600)}}
      tEl.textContent=words[wi].slice(0,ci);
      setTimeout(typeTick,del?45:80);
    };
    setTimeout(typeTick,1800);
  }

  /* demo del panel */
  var demo=$("demo");
  if(demo){
    var RUBROS=[
      {url:"ferreteriaelsol.com.ar",cats:["Herramientas","Pinturas","Electricidad"],items:[
        {n:"Taladro percutor 650 W",c:0,p:89900,e:"🔧"},{n:"Juego de llaves combinadas",c:0,p:32500,e:"🔩"},{n:"Látex interior 20 L",c:1,p:74900,e:"🎨"},{n:"Esmalte sintético 4 L",c:1,p:41200,e:"🖌️"},{n:"Cable unipolar 2,5 mm x 100 m",c:2,p:58700,e:"🔌"}]},
      {url:"modalucia.com.ar",cats:["Remeras","Jeans","Abrigos"],items:[
        {n:"Remera algodón peinado",c:0,p:18900,e:"👕"},{n:"Musculosa básica",c:0,p:12500,e:"🎽"},{n:"Jean mom tiro alto",c:1,p:46900,e:"👖"},{n:"Jean recto clásico",c:1,p:42500,e:"👖"},{n:"Campera inflable",c:2,p:98000,e:"🧥"}]},
      {url:"labodegadetito.com.ar",cats:["Platos","Bebidas","Postres"],items:[
        {n:"Milanesa napolitana con papas",c:0,p:16500,e:"🍽️"},{n:"Ravioles de ricota",c:0,p:13900,e:"🍝"},{n:"Limonada con menta 1 L",c:1,p:6800,e:"🍋"},{n:"Agua sin gas 500 ml",c:1,p:2900,e:"💧"},{n:"Flan casero con dulce",c:2,p:5900,e:"🍮"}]},
      {url:"casaolmo.com.ar",cats:["Living","Comedor","Dormitorio"],items:[
        {n:"Sillón nórdico 3 cuerpos",c:0,p:489000,e:"🛋️"},{n:"Mesa ratona de roble",c:0,p:156000,e:"🪵"},{n:"Mesa de comedor 6 personas",c:1,p:612000,e:"🍽️"},{n:"Silla tapizada",c:1,p:74500,e:"🪑"},{n:"Cama box 2 plazas",c:2,p:398000,e:"🛏️"}]}
    ];
    var r=0,cat=-1,pct=0,published=[];
    var rowsEl=$("rows"),miniEl=$("miniCards"),segEl=$("seg"),range=$("pct"),out=$("pctOut"),pubBtn=$("publish");
    var round=function(v){return v>=20000?Math.round(v/100)*100:Math.round(v/10)*10};
    var applies=function(it){return cat===-1||it.c===cat};
    var newP=function(it){return applies(it)?round(it.p*(1+pct/100)):it.p};
    var setStep=function(n){["s1","s2","s3"].forEach(function(id,i){$(id).classList.toggle("on",i<n)})};
    var renderSeg=function(){var R=RUBROS[r];segEl.innerHTML='<button type="button" data-c="-1" aria-pressed="'+(cat===-1)+'">Todos</button>'+R.cats.map(function(c,i){return '<button type="button" data-c="'+i+'" aria-pressed="'+(cat===i)+'">'+c+'</button>'}).join("")};
    var renderRows=function(){var R=RUBROS[r];rowsEl.innerHTML=R.items.map(function(it){var on=applies(it),np=newP(it),ch=on&&np!==it.p;return '<div class="row'+(on?'':' dim')+'"><span class="em">'+it.e+'</span><span class="nm"><b>'+it.n+'</b><small>'+R.cats[it.c].toUpperCase()+'</small></span><span class="pr">'+(ch?'<s>'+fmt(it.p)+'</s>':'')+'<b>'+fmt(np)+'</b></span></div>'}).join("")};
    var renderMini=function(anim){var R=RUBROS[r];$("miniUrl").textContent=R.url;miniEl.innerHTML=[0,2,4].map(function(i){var it=R.items[i];return '<div class="mini-card"><span class="em">'+it.e+'</span><div><b>'+it.n+'</b><span class="'+(anim?'pop':'')+'">'+fmt(published[i])+'</span></div></div>'}).join("")};
    var setFill=function(){range.style.setProperty("--fill",((range.value-range.min)/(range.max-range.min)*100)+"%")};
    var update=function(){pct=+range.value;out.textContent=(pct>0?"+":"")+pct+"%";out.classList.toggle("up",pct!==0);setFill();renderRows();pubBtn.classList.remove("done");pubBtn.textContent="Publicar cambios"};
    var loadRubro=function(i){r=i;cat=-1;range.value=0;published=RUBROS[r].items.map(function(it){return it.p});
      document.querySelectorAll(".rubros button").forEach(function(b){b.setAttribute("aria-pressed",String(+b.dataset.r===r))});
      renderSeg();update();renderMini(false);setStep(0)};
    var toast=$("toast"),tt;
    var publish=function(showToast){var n=0;published=RUBROS[r].items.map(function(it){var v=newP(it);if(v!==it.p)n++;return v});
      renderMini(true);pubBtn.classList.add("done");pubBtn.textContent="✓ Publicado";setStep(3);
      if(showToast&&toast){$("toastTxt").textContent=n?("Listo: "+n+" precio"+(n>1?"s":"")+" actualizado"+(n>1?"s":"")+" en la web"):"No hubo cambios de precio";toast.classList.add("show");clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove("show")},2600)}};
    var auto=true,timers=[];
    var later=function(fn,ms){timers.push(setTimeout(fn,ms))};
    var stopAuto=function(){if(!auto)return;auto=false;timers.forEach(clearTimeout)};
    var play=function(){if(!auto)return;
      later(function(){cat=0;renderSeg();renderRows();setStep(1)},700);
      later(function(){var v=0;(function step(){if(!auto)return;v++;range.value=v;update();setStep(2);if(v<15)timers.push(setTimeout(step,55))})()},1500);
      later(function(){pubBtn.classList.add("press");setTimeout(function(){pubBtn.classList.remove("press")},150);publish(false)},3200);
      later(function(){loadRubro((r+1)%RUBROS.length)},6200);
      later(play,6400)};
    ["pointerdown","keydown"].forEach(function(ev){demo.addEventListener(ev,stopAuto,{capture:true})});
    range.addEventListener("input",function(){update();setStep(2)});
    segEl.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;cat=+b.dataset.c;renderSeg();update();setStep(1)});
    document.querySelectorAll(".rubros button").forEach(function(b){b.addEventListener("click",function(){loadRubro(+b.dataset.r)})});
    pubBtn.addEventListener("click",function(){publish(true)});
    loadRubro(0);
    if(!reduce)play();
  }

  /* precio que cambia en el celular del panel */
  var ph=$("phPrice");
  if(ph&&!reduce){var phv=[24900,27400,24900,26900],phi=0;setInterval(function(){phi=(phi+1)%phv.length;ph.textContent=fmt(phv[phi])},1500)}

  /* todo lo que hacemos */
  var capEl=$("cap"),capStart=null;
  if(capEl){
    var ICON={
      web:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>',
      tool:'<svg viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>',
      panel:'<svg viewBox="0 0 24 24"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>',
      google:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
      chart:'<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
      grow:'<svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 7H6"/></svg>'
    };
    var CAP=[
      {k:"web",t:"Diseño y desarrollo web",s:"La base",intro:"Una web de varias páginas, programada a medida y pensada primero para el celular.",items:[
        ["Web de varias páginas","Cada sección con su propia página y dirección."],["Diseño para celular y compu","Se ve y funciona bien en cualquier pantalla."],["Sección Quiénes somos","Para contar tu historia: la gente quiere saber a quién le compra."],["Galería de trabajos con filtros","Tus clientes encuentran rápido lo que buscan."],["Catálogo con buscador","Productos ordenados por categoría, con fotos y precios."],["Preguntas frecuentes","Responde las dudas antes de que escriban."],["Formularios de presupuesto","Cada pedido te llega al WhatsApp o al mail."],["WhatsApp y mapa integrados","Botón de contacto en toda la web y mapa de Google en contacto."]]},
      {k:"tool",t:"Herramientas interactivas",s:"Lo que sorprende",intro:"Herramientas que hacen que la gente se quede en tu web y te escriba con la decisión tomada.",items:[
        ["Configuradores 3D","El cliente arma su producto y lo gira en pantalla."],["Colores y materiales en vivo","Ve cómo queda antes de comprar."],["Cotizadores al instante","Precio estimado según lo que elige."],["Calculadoras","De medidas, de talle, de espacio o de costo de envío por zona."],["Comparadores","Productos lado a lado para decidir rápido."],["Asistente para elegir","Unas preguntas y le recomienda el producto ideal."],["Chat con inteligencia artificial","Responde consultas a cualquier hora."]]},
      {k:"panel",t:"Panel de administración (CMS)",s:"Tu control",intro:"Tu web la manejás vos, desde el celular o la compu, sin esperar a nadie.",items:[
        ["Precios, fotos y textos","Los cambiás cuando quieras."],["Aumentos por porcentaje","A todos los productos o a una categoría, de una vez."],["Producto por producto","Buscás por nombre o código y lo editás."],["Redondeo automático","Nada de precios con centavos raros."],["Trabajos nuevos en segundos","Sacás la foto y la publicás."],["2 cambios por mes incluidos","Los hacemos nosotros sobre las secciones existentes."],["Capacitación","Te enseñamos a usarlo en una reunión."]]},
      {k:"google",t:"Google y presencia",s:"Que te encuentren",intro:"Todo lo necesario para que Google entienda tu negocio y te muestre bien.",items:[
        ["Posicionamiento en Google (SEO)","Textos y estructura pensados para las búsquedas."],["Ficha de Google Maps","Para que te encuentren en la zona."],["Sitemap","El mapa que le muestra a Google todas tus páginas."],["Datos estructurados","Google sabe qué hacés, dónde estás y cuándo atendés."],["Search Console","Ves qué busca la gente para llegar a vos."],["Vista previa al compartir","Tu link sale con imagen y título en WhatsApp y redes."],["Certificado de seguridad","El candado https que da confianza."]]},
      {k:"chart",t:"Medición e informes",s:"Saber qué pasa",intro:"Datos reales sobre tu web, explicados en palabras simples.",items:[
        ["Google Analytics","Cuánta gente entra, desde dónde y qué mira."],["Microsoft Clarity","Grabaciones anónimas de cómo navegan tus visitas."],["Mapas de calor","Dónde hacen clic y hasta dónde bajan."],["Informe mensual","Visitas, lo más visto y consultas recibidas, sin tecnicismos."],["Origen de las consultas","Sabés qué canal te trae clientes."]]},
      {k:"grow",t:"Ventas y crecimiento",s:"Cuando lo necesites",intro:"Lo que tu negocio puede sumar más adelante, sin rehacer la web.",ex:true,items:[
        ["Tienda online","Carrito, Mercado Pago o el medio de cobro que elijas, y envíos."],["CRM de consultas","Cada consulta con su seguimiento: presupuestada, vendida o perdida."],["Email marketing","Envíos y automatizaciones a tus clientes."],["Contenido para redes","Reels y piezas para mostrar tu negocio."],["Presupuestos en PDF","Documentos con tu marca, generados automáticamente."]]}
    ];
    var total=CAP.reduce(function(a,c){return a+c.items.length},0);
    if($("cTotal"))$("cTotal").dataset.to=total;
    var tabs=$("capTabs"),panelEl=$("capPanel"),cur=0,capTimer;
    tabs.innerHTML=CAP.map(function(c,i){return '<button type="button" role="tab" id="tab'+i+'" aria-selected="'+(i===0)+'" aria-controls="capPanel"><span class="ic">'+ICON[c.k]+'</span><span><b>'+c.t+'</b><small>'+c.items.length+' funciones</small></span><span class="bar2"></span></button>'}).join("");
    var showCap=function(i){cur=i;var c=CAP[i];
      tabs.querySelectorAll("button").forEach(function(b,j){b.setAttribute("aria-selected",String(j===i))});
      panelEl.setAttribute("aria-labelledby","tab"+i);
      panelEl.innerHTML='<span class="eyebrow">'+c.s+'</span><h3>'+c.t+'</h3><p class="intro">'+c.intro+'</p><ul class="cap-items">'+c.items.map(function(it,j){return '<li class="'+(c.ex?'ex':'')+'" style="animation-delay:'+(j*60)+'ms"><em>'+String(j+1).padStart(2,"0")+'</em><div><b>'+it[0]+'</b><span>'+it[1]+'</span></div></li>'}).join("")+'</ul>'+(c.ex?'<p class="cap-note"><i></i>Se cotiza aparte, cuando lo necesites.</p>':'');
      if(window.innerWidth<=900){var tb=tabs.children[i];tabs.scrollTo({left:tb.offsetLeft-20,behavior:reduce?"auto":"smooth"})}};
    var autoCap=function(){clearTimeout(capTimer);if(reduce||!capEl.classList.contains("run"))return;capTimer=setTimeout(function(){showCap((cur+1)%CAP.length);autoCap()},7000)};
    capStart=function(){capEl.classList.add("run");autoCap()};
    tabs.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;capEl.classList.remove("run");clearTimeout(capTimer);showCap([].indexOf.call(tabs.children,b))});
    showCap(0);
  }

  var countUp=function(el){var to=+el.dataset.to,t0=null;if(reduce){el.textContent=to;return}
    (function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(performance.now())};

  /* carrera de velocidad */
  var race=null;
  if($("race")){
    var raceRunning=false;
    var runLane=function(dev,timer,ms){var ld=dev.querySelector(".ld"),t0=performance.now();dev.classList.remove("ready");ld.style.transition="none";ld.style.width="0";ld.style.opacity="1";
      requestAnimationFrame(function(){requestAnimationFrame(function(){ld.style.transition="width "+ms+"ms cubic-bezier(.3,.6,.4,1)";ld.style.width="100%"})});
      (function f(t){var e=Math.min(t-t0,ms);timer.textContent=(e/1000).toFixed(1)+" s";if(e<ms)requestAnimationFrame(f);else{dev.classList.add("ready");ld.style.opacity="0"}})(t0)};
    race=function(){if(raceRunning)return;raceRunning=true;runLane($("devF"),$("tF"),1100);runLane($("devS"),$("tS"),4800);setTimeout(function(){raceRunning=false},5000)};
    $("replay").addEventListener("click",race);
    if(reduce){$("devF").classList.add("ready");$("devS").classList.add("ready");$("tF").textContent="1.1 s";$("tS").textContent="4.8 s"}
  }

  /* aparición al bajar y disparadores */
  var watch=["counter","race","steps","mapTile","cap"].map($).filter(Boolean);
  if("IntersectionObserver" in window){
    var vh=innerHeight;
    var io=new IntersectionObserver(function(ents){ents.forEach(function(en){if(!en.isIntersecting)return;var el=en.target;
      el.classList.remove("rv-pre");el.classList.add("in");
      if(el.id==="counter")el.querySelectorAll("[data-to]").forEach(countUp);
      if(el.id==="race"&&race&&!reduce)race();
      if(el.id==="cap"&&capStart)capStart();
      io.unobserve(el)})},{threshold:.2});
    document.querySelectorAll(".rv").forEach(function(el,i){if(!reduce&&el.getBoundingClientRect().top>vh){el.classList.add("rv-pre");el.style.transitionDelay=((i%3)*90)+"ms"}io.observe(el)});
    watch.forEach(function(el){io.observe(el)});
  } else {
    document.querySelectorAll("[data-to]").forEach(countUp);
    watch.forEach(function(el){el.classList.add("in")});
  }

  /* planes: se enciende el que señalás */
  var plans=[].slice.call(document.querySelectorAll(".plan"));
  plans.forEach(function(p){["mouseenter","focusin","click"].forEach(function(ev){p.addEventListener(ev,function(){plans.forEach(function(q){q.classList.toggle("lit",q===p)})})})});

  /* preguntas: una sola abierta */
  var dets=[].slice.call(document.querySelectorAll(".faq details"));
  dets.forEach(function(d){d.addEventListener("toggle",function(){if(d.open)dets.forEach(function(o){if(o!==d)o.open=false})})});

  /* luz que sigue al mouse, inclinación 3D, imán y onda en botones */
  var fine=window.matchMedia&&matchMedia("(pointer:fine)").matches;
  document.querySelectorAll(".spot").forEach(function(el){el.addEventListener("pointermove",function(e){var b=el.getBoundingClientRect();el.style.setProperty("--mx",(e.clientX-b.left)+"px");el.style.setProperty("--my",(e.clientY-b.top)+"px")})});
  if(fine&&!reduce){
    document.querySelectorAll(".tilt").forEach(function(el){
      el.addEventListener("pointermove",function(e){var b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;el.style.transform="perspective(900px) rotateY("+(x*7)+"deg) rotateX("+(-y*7)+"deg) translateY(-4px)"});
      el.addEventListener("pointerleave",function(){el.style.transform=""})});
    document.querySelectorAll(".mag").forEach(function(el){
      el.addEventListener("pointermove",function(e){var b=el.getBoundingClientRect();el.style.transform="translate("+((e.clientX-b.left-b.width/2)*.18)+"px,"+((e.clientY-b.top-b.height/2)*.28)+"px)"});
      el.addEventListener("pointerleave",function(){el.style.transform=""})});
  }
  document.querySelectorAll(".btn").forEach(function(el){el.addEventListener("pointerdown",function(e){var b=el.getBoundingClientRect(),s=Math.max(b.width,b.height),sp=document.createElement("span");sp.className="ripple";sp.style.width=sp.style.height=s+"px";sp.style.left=(e.clientX-b.left-s/2)+"px";sp.style.top=(e.clientY-b.top-s/2)+"px";el.appendChild(sp);setTimeout(function(){sp.remove()},650)})});
})();
