# -*- coding: utf-8 -*-
"""pnart — arte de fondo del sistema pasaporte.
Capa 1: telar de la casa (rosetas desde la estrella, bandas de interferencia desde
los meridianos del globo, microtexto MRZ). Capa 2: grabados del destino en trazo
de casa. Los fondos NO se registran en cajas (viven bajo el contenido, a tono bajo);
los sellos de día SÍ (son figura, no fondo)."""
import math
from reportlab.lib.colors import HexColor

# tonos de fondo (siempre claros sobre marfil / apenas visibles sobre negro)
T_LINEA="#DDD6C7"   # telar sobre marfil
T_MOTIVO="#DFD8CA"  # grabados sobre marfil
T_MICRO="#CFC7B6"   # microtexto
T_OSCURO="#242424"  # telar sobre negro

def _stroke(c,color,w):
    c.setStrokeColor(HexColor(color)); c.setLineWidth(w); c.setLineCap(1); c.setLineJoin(1)

# ---------------- CAPA 1 · TELAR ----------------
def rosetta(c,cx,cy,R,color=T_LINEA,sw=0.5,k=8,anillos=6):
    """Roseta guilloché: familias armónicas rotadas, construidas sobre la estrella (k puntas)."""
    _stroke(c,color,sw)
    for j in range(anillos):
        f=j*math.pi/anillos
        p=c.beginPath(); first=True
        steps=180
        for i in range(steps+1):
            t=2*math.pi*i/steps
            r=R*(0.62+0.38*math.cos(k*t+f))*(0.86+0.14*math.cos(2*t-f))
            x=cx+r*math.cos(t); y=cy+r*math.sin(t)
            if first: p.moveTo(x,y); first=False
            else: p.lineTo(x,y)
        c.drawPath(p,stroke=1,fill=0)

def banda_interferencia(c,x0,x1,y,alto,color=T_LINEA,sw=0.45,lineas=6,lam=46):
    """Banda de ondas en fase corrida — los paralelos del globo vueltos textura."""
    _stroke(c,color,sw)
    for j in range(lineas):
        yy=y+alto*j/(lineas-1)
        f=j*math.pi/ (lineas-1)
        A=alto*0.34
        p=c.beginPath(); p.moveTo(x0,yy)
        x=x0
        while x<x1:
            x2=min(x+8,x1)
            p.lineTo(x2, yy + A*math.sin(2*math.pi*(x2-x0)/lam + f)*math.sin(math.pi*j/(lineas-1)))
            x=x2
        c.drawPath(p,stroke=1,fill=0)

def microtexto(c,x0,x1,y,texto="ACCESO, NO EXCESO · ",size=3.4,color=T_MICRO,track=0.5):
    """Línea de microtexto corrido — legible con zoom, textura a simple vista."""
    t=c.beginText(); t.setFont("JostR",size); t.setCharSpace(track)
    t.setFillColor(HexColor(color)); t.setTextOrigin(x0,y)
    unidad=texto
    w1=c.stringWidth(unidad,"JostR",size)+track*len(unidad)
    n=max(1,int((x1-x0)/w1))
    t.textOut((unidad*(n+1))[:int((x1-x0)/(w1/len(unidad)))])
    t.setCharSpace(0); c.drawText(t)

def chevrons(c,x0,x1,y,color=T_MICRO,size=3.6):
    microtexto(c,x0,x1,y,"<<<PASAPORTE<NEGRO<<<",size,color,0.4)

def marco_pasaporte(c,PW,PH,inset=22,color=T_LINEA,dark=False):
    """Marco de página tipo visado: doble filete + banda de interferencia arriba y abajo
    + microtexto de borde. Deja el campo central limpio para el contenido."""
    col = T_OSCURO if dark else color
    micro = "#3A3A3A" if dark else T_MICRO
    _stroke(c,col,0.7); c.rect(inset,inset,PW-2*inset,PH-2*inset,fill=0,stroke=1)
    _stroke(c,col,0.4); c.rect(inset+5,inset+5,PW-2*inset-10,PH-2*inset-10,fill=0,stroke=1)
    banda_interferencia(c,inset+14,PW-inset-14,PH-inset-30,16,col)
    banda_interferencia(c,inset+14,PW-inset-14,inset+14,16,col)
    microtexto(c,inset+16,PW-inset-16,PH-inset-9.5,"ACCESO, NO EXCESO · ",3.4,micro)
    chevrons(c,inset+16,PW-inset-16,inset+6.5,micro)

# ---------------- CAPA 2 · GRABADOS DEL DESTINO (Piemonte) ----------------
def motivo_colinas(c,x,y,w,h,color=T_MOTIVO,sw=0.6,capas=6):
    """Las Langhe: curvas de nivel apiladas."""
    _stroke(c,color,sw)
    import random; rnd=random.Random(19)
    for j in range(capas):
        yy=y+h*j/capas
        p=c.beginPath(); p.moveTo(x,yy)
        segs=5
        for s in range(segs):
            x1=x+w*(s+0.5)/segs; x2=x+w*(s+1)/segs
            amp=h*0.16*(1-j/(capas+1))
            p.curveTo(x1,yy+amp*rnd.uniform(0.4,1.0),x1,yy+amp*rnd.uniform(0.4,1.0),x2,yy+ (amp*0.3*rnd.uniform(-1,1)))
        c.drawPath(p,stroke=1,fill=0)
        # hileras de viña sugeridas en la ladera más cercana
        if j==capas-1:
            for vx in range(int(x+w*0.12),int(x+w*0.88),11):
                c.line(vx,y-4,vx+5,yy-2)

def motivo_nebbiolo(c,cx,cy,s,color=T_MOTIVO,sw=0.6):
    """Hoja de nebbiolo: cinco lóbulos y nervadura."""
    _stroke(c,color,sw)
    p=c.beginPath(); p.moveTo(cx,cy-s)
    lob=[(0.55,-0.55),(0.95,0.05),(0.55,0.75),(0,1.0)]
    pts=[(cx+dx*s,cy+dy*s) for dx,dy in lob]
    p.curveTo(cx+0.25*s,cy-0.95*s,pts[0][0]+0.1*s,pts[0][1]-0.3*s,*pts[0])
    p.curveTo(pts[0][0]+0.25*s,pts[0][1]+0.15*s,pts[1][0]+0.12*s,pts[1][1]-0.28*s,*pts[1])
    p.curveTo(pts[1][0]-0.02*s,pts[1][1]+0.3*s,pts[2][0]+0.22*s,pts[2][1]-0.05*s,*pts[2])
    p.curveTo(pts[2][0]-0.1*s,pts[2][1]+0.28*s,pts[3][0]+0.3*s,pts[3][1]+0.02*s,*pts[3])
    for dx,dy in [(-x,y) for x,y in lob][::-1]:
        pass
    c.drawPath(p,stroke=1,fill=0)
    # espejo izquierdo
    p=c.beginPath(); p.moveTo(cx,cy-s)
    p.curveTo(cx-0.25*s,cy-0.95*s,cx-0.55*s+0. -0.1*s,cy-0.55*s-0.3*s,cx-0.55*s,cy-0.55*s)
    p.curveTo(cx-0.8*s,cy-0.4*s,cx-1.07*s,cy+0.05*s-0.28*s,cx-0.95*s,cy+0.05*s)
    p.curveTo(cx-0.93*s,cy+0.35*s,cx-0.77*s,cy+0.7*s,cx-0.55*s,cy+0.75*s)
    p.curveTo(cx-0.45*s,cy+1.03*s,cx-0.3*s,cy+1.02*s,cx,cy+1.0*s)
    c.drawPath(p,stroke=1,fill=0)
    # nervaduras
    c.line(cx,cy-s*0.9,cx,cy+s*0.95)
    for dx,dy in [(0.5,-0.45),(-0.5,-0.45),(0.8,0.05),(-0.8,0.05),(0.45,0.6),(-0.45,0.6)]:
        c.line(cx,cy+ dy*s*0.25, cx+dx*s*0.82, cy+dy*s)

def motivo_torre(c,x,y,w,h,color=T_MOTIVO,sw=0.6):
    """La torre de Barbaresco."""
    _stroke(c,color,sw)
    c.rect(x,y,w,h,fill=0,stroke=1)
    # almenas
    n=4; aw=w/ (n*2-1)
    for i in range(n):
        c.rect(x+i*2*aw,y+h,aw,aw*1.1,fill=0,stroke=1)
    # aspilleras
    for fy in (0.28,0.55,0.8):
        c.roundRect(x+w/2-w*0.07,y+h*fy,w*0.14,h*0.09,w*0.06,fill=0,stroke=1)
    # base
    c.line(x-w*0.18,y,x+w*1.18,y)

def motivo_avellana(c,cx,cy,s,color=T_MOTIVO,sw=0.6):
    """La avellana de las Langhe."""
    _stroke(c,color,sw)
    c.circle(cx,cy,s*0.72,fill=0,stroke=1)
    # capuchón
    p=c.beginPath(); p.moveTo(cx-s*0.72,cy+s*0.1)
    p.curveTo(cx-s*0.4,cy+s*0.86,cx+s*0.4,cy+s*0.86,cx+s*0.72,cy+s*0.1)
    c.drawPath(p,stroke=1,fill=0)
    for i in range(-2,3):
        c.line(cx+i*s*0.26,cy+s*0.66-abs(i)*s*0.09, cx+i*s*0.30, cy+s*0.16)
    c.line(cx,cy-s*0.72,cx,cy-s*0.95)

MOTIVOS_PIEMONTE=["colinas","nebbiolo","torre","avellana"]

def motivo(c,nombre,x,y,w,color=T_MOTIVO):
    if nombre=="colinas": motivo_colinas(c,x,y,w,w*0.42,color)
    elif nombre=="nebbiolo": motivo_nebbiolo(c,x+w/2,y+w*0.45,w*0.42,color)
    elif nombre=="torre": motivo_torre(c,x+w*0.36,y,w*0.28,w*0.9,color)
    elif nombre=="avellana": motivo_avellana(c,x+w/2,y+w*0.5,w*0.5,color)

# ---------------- SELLO DE DÍA (figura: se registra) ----------------
def sello_dia(pg,cx,cy,r,linea1,linea2,color="#4A463F"):
    """Sello de entrada circular: doble aro, fecha y estrella. Es figura — registra caja."""
    c=pg.c
    _stroke(c,color,0.9); c.circle(cx,cy,r,fill=0,stroke=1)
    _stroke(c,color,0.5); c.circle(cx,cy,r-3.2,fill=0,stroke=1)
    # marcas horarias
    for i in range(12):
        a=i*math.pi/6
        c.line(cx+(r-1.2)*math.cos(a),cy+(r-1.2)*math.sin(a),cx+r*math.cos(a),cy+r*math.sin(a))
    c.setFillColor(HexColor(color))
    c.setFont("JostS",6.6); c.drawCentredString(cx,cy+1.6,linea1)
    c.setFont("JostR",4.6); c.drawCentredString(cx,cy-5.4,linea2)
    # estrella mínima arriba
    s=2.2; rr=s*0.22
    p=c.beginPath(); p.moveTo(cx,cy+r-7+s)
    p.curveTo(cx+rr,cy+r-7+rr,cx+rr,cy+r-7+rr,cx+s,cy+r-7)
    p.curveTo(cx+rr,cy+r-7-rr,cx+rr,cy+r-7-rr,cx,cy+r-7-s)
    p.curveTo(cx-rr,cy+r-7-rr,cx-rr,cy+r-7-rr,cx-s,cy+r-7)
    p.curveTo(cx-rr,cy+r-7+rr,cx-rr,cy+r-7+rr,cx,cy+r-7+s)
    p.close(); c.drawPath(p,stroke=0,fill=1)
    pg.reg(f"sello_dia:{linea1}",cx-r,cy-r,cx+r,cy+r)
