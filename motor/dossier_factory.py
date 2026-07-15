# -*- coding: utf-8 -*-
"""dossier_factory — genera el Dossier de Expedición de CUALQUIER viaje desde su public_content.

Uso:  python3 dossier_factory.py <archivo.json>

El JSON de entrada es exactamente lo que devuelve:
  SELECT jsonb_build_object('id',id,'meta',data->'meta','pc',public_content) FROM trips WHERE id='<trip>';

Novedad frente a los scripts a mano: PAGINACIÓN AUTOMÁTICA. Mide la altura real de
cada bloque de día con el motor tipográfico y corta páginas solo. Sirve igual para
7 días (Piemonte), 8 (Engadin) u 11 (Namibia).
"""
import sys, os, json, math
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from pnpdf import *
from pnpdf import _wc
import pnart

# biblioteca de grabados por destino (si el destino no tiene, va solo el telar)
GRABADOS={"piemonte":["colinas","nebbiolo","torre","avellana"]}

TOP_TITULO=146      # y del título de página
BOTTOM_LIMITE=104   # nada de contenido por debajo de esto (MRZ + pie)

def alto_dia(c,d,ancho):
    """Altura real que ocupará el bloque de un día."""
    h=20+20  # etiqueta fecha + título
    palabras=d["narrativa"].split(); linea=""; n=1
    for w in palabras:
        t=(linea+" "+w) if linea else w
        if c.stringWidth(t,"JostR",10.5)<=ancho: linea=t
        else: n+=1; linea=w
    h+=n*15.5
    return h+26  # + separador y aire

def paginar_dias(c,dias,ancho,alto_util):
    """Reparte los días en páginas sin que ninguno quede cortado."""
    paginas=[]; actual=[]; usado=0
    for d in dias:
        a=alto_dia(c,d,ancho)
        if actual and usado+a>alto_util:
            paginas.append(actual); actual=[]; usado=0
        actual.append(d); usado+=a
    if actual: paginas.append(actual)
    return paginas

def romano_mes(fecha_iso):
    return {1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII",8:"VIII",9:"IX",10:"X",11:"XI",12:"XII"}[int(fecha_iso[5:7])]

MESES={"01":"enero","02":"febrero","03":"marzo","04":"abril","05":"mayo","06":"junio",
       "07":"julio","08":"agosto","09":"septiembre","10":"octubre","11":"noviembre","12":"diciembre"}
NUM={6:"Seis",7:"Siete",8:"Ocho",9:"Nueve",10:"Diez",11:"Once",12:"Doce",13:"Trece"}

def build(data, out_path):
    tid=data["id"]; meta=data.get("meta") or {}; pc=data["pc"]
    destino=(meta.get("region") or meta.get("tripShortLabel") or tid).strip()
    # subtítulo: lo que va después de la barra en tripName ("Piemonte / Le Langhe — Oct 2026")
    tn=meta.get("tripName") or ""
    subt=""
    if "/" in tn:
        subt=tn.split("/",1)[1].split("—")[0].strip()
    precio=meta.get("ticketUSD")
    ini=meta["startDate"]; fin=meta["endDate"]
    pax=int(meta.get("payingPax") or 8)
    noches=meta.get("nights") or ((int(fin[8:10])-int(ini[8:10])) if ini[5:7]==fin[5:7] else None)
    dias=pc["dias"]; accesos=pc.get("accesos",[])
    grab=GRABADOS.get(tid.split("-")[0].lower(),[])

    c=make_canvas(out_path,f"Pasaporte Negro — Dossier · {destino}")

    def encabezado(pg,label):
        isotipo(pg,M,PH-70,20,NEGRO)
        caps(pg,"PASAPORTE NEGRO",M+32,PH-63,10,"fuerte",CARBON,2.8)
        caps(pg,label,PW-M,PH-63,7.5,"etiqueta",GRAFITO,2.4,align="right")
    def pie(pg,n):
        caps(pg,"PASAPORTE NEGRO · "+destino.upper(),M,66,7,"etiqueta",GRAFITO,2.2,max_w=CW-60)
        caps(pg,str(n),PW-M,66,7.5,"etiqueta",GRAFITO,2.0,align="right")
    def fondo_claro(pg):
        c.setFillColor(HexColor(MARFIL)); c.rect(0,0,PW,PH,fill=1,stroke=0)
        pnart.marco_pasaporte(c,PW,PH,inset=26)

    npag=1
    # ---------- TAPA ----------
    pg=Page(c,dark=True)
    c.setFillColor(HexColor(NEGRO)); c.rect(0,0,PW,PH,fill=1,stroke=0)
    pnart.marco_pasaporte(c,PW,PH,inset=26,dark=True)
    cur=PH-146
    ih=isotipo(pg,PW/2-54,cur,108,MARFIL); cur-=ih+46
    caps(pg,"PASAPORTE NEGRO",PW/2,cur,17,"fuerte",MARFIL,5.2,align="center"); cur-=26
    caps(pg,"TURISMO DE LUJO",PW/2,cur,9,"etiqueta",PIEDRA,4.8,align="center"); cur-=118
    caps(pg,destino,PW/2,cur,38,"display",MARFIL,7.0,align="center"); cur-=28
    ok=f"{MESES[ini[5:7]].upper()} DE {ini[:4]}"
    caps(pg,(subt+" · " if subt else "")+ok,PW/2,cur,10,"fuerte",PIEDRA,3.4,align="center")
    caps(pg,f"{NUM.get(pax,str(pax)).upper()} LUGARES",PW/2,206,8.5,"etiqueta",PIEDRA,3.4,align="center")
    caps(pg,"DOSSIER DE EXPEDICIÓN",PW/2,182,7.5,"etiqueta",NIEBLA,3.0,align="center")
    star(pg,PW/2,110,5,MARFIL,name="chip")
    close_page(pg,f"{tid}:tapa")

    # ---------- FICHA DEL VIAJERO ----------
    npag+=1
    pg=Page(c,dark=False); fondo_claro(pg)
    pnart.rosetta(c,PW-M-58,PH-196,44,color="#E6E0D3",k=8,anillos=5)
    encabezado(pg,"FICHA DEL VIAJERO")
    cur=TOP_TITULO
    cur=PH-TOP_TITULO
    caps(pg,"FICHA DEL VIAJERO",M,cur,22,"display",NEGRO,4.6); cur-=44
    def campo(label,valor,x,y,w,filled):
        caps(pg,label,x,y,7,"etiqueta",GRAFITO,2.0,max_w=w,name=f"l:{label}")
        if filled: txt(pg,valor,x,y-17,11.5,"fuerte",NEGRO,"JostM",max_w=w,name=f"v:{label}")
        else: rule(pg,y-17,x,x+w-14,color="#C9C2B2",w=0.8,name=f"r:{label}")
        return y-42
    colW=(CW-30)/2; xR=M+colW+30
    yL=cur; yR=cur
    for lab in ("APELLIDOS","NOMBRES","NACIONALIDAD","FIRMA DEL VIAJERO"):
        yL=campo(lab,"",M,yL,colW,False)
    val=f"{int(ini[8:10])} — {int(fin[8:10])} de {MESES[fin[5:7]]} de {fin[:4]}"
    yR=campo("EXPEDICIÓN",destino,xR,yR,colW,True)
    yR=campo("VALIDEZ",val,xR,yR,colW,True)
    yR=campo("Nº DE LUGAR",f"— de {NUM.get(pax,str(pax)).lower()}",xR,yR,colW,True)
    yR=campo("AUTORIDAD","Pasaporte Negro · Buenos Aires",xR,yR,colW,True)
    cur=min(yL,yR)-6
    para(pg,"La casa emite este documento a nombre de cada viajero al confirmar su lugar.",
         M,cur,10.5,"fuerte",CARBON,CW,leading=16,name="emision")
    mrz=f"PN<{destino.upper().replace(' ','<')}<EXPEDICION"
    for j,ln in enumerate((mrz+"<"*(44-len(mrz)), "PN<"+"<"*41)):
        t=c.beginText(); t.setFont("JostR",9); t.setFillColor(HexColor(MRZCOL))
        t.setCharSpace(2.0); t.setTextOrigin(M,88+(14 if j==0 else 0)); t.textOut(ln[:48]); c.drawText(t)
        pg.reg(f"mrz{j}",M,88+(14 if j==0 else 0)-2,M+_wc(c,ln[:48],"JostR",9,2.0),88+(14 if j==0 else 0)+8)
    pie(pg,npag); close_page(pg,f"{tid}:ficha")

    # ---------- VISA ----------
    npag+=1
    pg=Page(c,dark=False); fondo_claro(pg)
    if "colinas" in grab: pnart.motivo(c,"colinas",M+26,96,CW-52)
    encabezado(pg,"VISA DE EXPEDICIÓN")
    cur=PH-TOP_TITULO
    caps(pg,"LA EXPEDICIÓN",M,cur,22,"display",NEGRO,4.6); cur-=26
    caps(pg,"«ACCESO, NO EXCESO.»",M,cur,9.5,"etiqueta",ACCESO,3.0); cur-=32
    cur=para(pg,pc["intro"],M,cur,11.5,"fuerte",CARBON,CW,leading=18.5,name="intro")
    cur-=20; rule(pg,cur+8); cur-=20
    base=(meta.get("basecamp") or {}).get("shortName") or ""
    ficha=[("FECHAS",f"Del {int(ini[8:10])} al {int(fin[8:10])} de {MESES[fin[5:7]]} de {fin[:4]}"),
           ("NOCHES",NUM.get(noches,str(noches)) if noches else str(meta.get("nights","—"))),
           ("GRUPO",f"{NUM.get(pax,str(pax))} viajeros")]
    if base: ficha.append(("BASE",base))
    if precio: ficha.append(("PRECIO",f"USD {int(precio):,}".replace(",",".")+" por persona"))
    ficha.append(("SALIDA","Con los dos accesos confirmados por escrito"))
    for lab,val in ficha:
        caps(pg,lab,M,cur,7.5,"etiqueta",GRAFITO,2.2,max_w=140,name=f"f:{lab}")
        txt(pg,val,M+140,cur,11.5,"fuerte",NEGRO,"JostM",max_w=CW-140,name=f"fv:{lab}")
        cur-=26
    pie(pg,npag); close_page(pg,f"{tid}:visa")

    # ---------- ACCESOS ----------
    npag+=1
    pg=Page(c,dark=False); fondo_claro(pg)
    if "nebbiolo" in grab: pnart.motivo(c,"nebbiolo",PW-M-150,104,130)
    encabezado(pg,"PÁGINA DE SELLOS")
    cur=PH-TOP_TITULO
    caps(pg,"LOS ACCESOS",M,cur,22,"display",NEGRO,4.6); cur-=34
    cur=para(pg,"Ninguna expedición de la casa sale a la venta sin dos accesos confirmados por escrito: "
             "puertas que no se compran con una entrada.",M,cur,11,"fuerte",CARBON,CW,leading=17.5,name="doctrina")
    cur-=14
    ROM=["ACCESO I","ACCESO II","ACCESO III"]
    for i,a in enumerate(accesos):
        rule(pg,cur+8); cur-=22
        caps(pg,ROM[i],M,cur,8,"etiqueta",ACCESO,3.0,name=f"a{i}:n")
        conf = a.get("estado")=="confirmado"
        sello_estado(pg,PW-M,cur-6,"CONFIRMADO" if conf else "EN CONFIRMACIÓN",confirmado=conf,name=f"a{i}:s")
        cur-=26
        txt(pg,a["titulo"],M,cur,15.5,"fuerte",NEGRO,"JostM",max_w=CW-170,name=f"a{i}:t")
        cur-=23
        cur=para(pg,a["descripcion"],M,cur,11,"fuerte",CARBON,CW-46,leading=17,name=f"a{i}:d")
        cur-=20
    pie(pg,npag); close_page(pg,f"{tid}:accesos")

    # ---------- ITINERARIO (paginado automático) ----------
    alto_util=(PH-TOP_TITULO-42)-BOTTOM_LIMITE
    grupos=paginar_dias(c,dias,CW-70,alto_util)
    motivos_it=[g for g in grab if g in ("torre","avellana")] or [None]
    for gi,grupo in enumerate(grupos):
        npag+=1
        pg=Page(c,dark=False); fondo_claro(pg)
        mv=motivos_it[gi%len(motivos_it)]
        if mv=="torre": pnart.motivo(c,"torre",PW-M-118,86,110)
        elif mv=="avellana": pnart.motivo(c,"avellana",PW-M-130,84,112)
        encabezado(pg,"PÁGINA DE SELLOS")
        cur=PH-TOP_TITULO
        rom="I II III IV".split()[gi] if len(grupos)>1 else ""
        caps(pg,"EL ITINERARIO"+(f" · {rom}" if rom else ""),M,cur,22,"display",NEGRO,4.6); cur-=42
        for i,d in enumerate(grupo):
            fecha=d["fecha"]
            pnart.sello_dia(pg,PW-M-26,cur-8,19,fecha.split("·")[0].strip(),fecha.split("·")[-1].strip())
            caps(pg,fecha,M,cur,8,"etiqueta",GRAFITO,2.6,max_w=CW-70,name=f"g{gi}d{i}:f")
            cur-=20
            txt(pg,d["titulo"],M,cur,13.5,"fuerte",NEGRO,"JostM",max_w=CW-70,name=f"g{gi}d{i}:t")
            cur-=20
            cur=para(pg,d["narrativa"],M,cur,10.5,"fuerte",CARBON,CW-70,leading=15.5,name=f"g{gi}d{i}:n")
            cur-=6
            if i<len(grupo)-1: rule(pg,cur+5,color="#E8E2D6",name=f"g{gi}d{i}:r")
            cur-=20
        pie(pg,npag); close_page(pg,f"{tid}:itinerario{gi+1}")

    # ---------- OBSERVACIONES ----------
    npag+=1
    pg=Page(c,dark=False); fondo_claro(pg)
    encabezado(pg,"OBSERVACIONES")
    cur=PH-TOP_TITULO
    caps(pg,"OBSERVACIONES",M,cur,22,"display",NEGRO,4.6); cur-=40
    colL=M; colR=PW/2+18; cw2=PW/2-18-M
    caps(pg,"EL VIAJE INCLUYE",colL,cur,8.5,"etiqueta",GRAFITO,2.8)
    caps(pg,"NO INCLUYE",colR,cur,8.5,"etiqueta",GRAFITO,2.8)
    top=cur+12; cur-=24; curL=cur; curR=cur
    for it in pc.get("incluye",[]): curL=para(pg,it,colL,curL,10.5,"fuerte",CARBON,cw2,leading=15,name="inc")-6
    for it in pc.get("no_incluye",[]): curR=para(pg,it,colR,curR,10.5,"fuerte",CARBON,cw2,leading=15,name="ninc")-6
    vline(pg,PW/2,min(curL,curR)+12,top,name="div")
    cur=min(curL,curR)-16
    rule(pg,cur+8); cur-=18
    caps(pg,"LAS REGLAS DE LA CASA",M,cur,8.5,"etiqueta",GRAFITO,2.8); cur-=22
    for it in pc.get("condiciones",[]): cur=para(pg,it,M,cur,10.5,"fuerte",CARBON,CW,leading=15,name="cond")-6
    BF=126
    c.setFillColor(HexColor(NEGRO)); c.rect(0,0,PW,BF,fill=1,stroke=0)
    pg.dark=True
    isotipo(pg,M,BF-22,24,MARFIL)
    caps(pg,"PASAPORTE NEGRO",M+36,BF-40,10,"fuerte",MARFIL,3.2)
    caps(pg,"TURISMO DE LUJO",M+36,BF-56,7,"etiqueta",PIEDRA,3.0)
    txt(pg,"pasaportenegro.com",PW-M,BF-44,12,"fuerte",MARFIL,"JostM",align="right",name="dom")
    caps(pg,"BUENOS AIRES · MMXXVI",PW-M,BF-60,7,"etiqueta",PIEDRA,2.6,align="right")
    close_page(pg,f"{tid}:observaciones")

    c.save()
    return npag

if __name__=="__main__":
    data=json.load(open(sys.argv[1]))
    out=os.environ.get("PN_OUT") or f"PN-Dossier-{data['id']}.pdf"
    n=build(data,out)
    print(f"{data['id']}: {n} páginas -> {out}")
    print_report()
