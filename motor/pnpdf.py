# -*- coding: utf-8 -*-
"""pnpdf — motor de documentos Pasaporte Negro (extraído del voucher v4, probado).
Roles validados en tiempo de dibujo · registro de cajas de TODOS los elementos ·
solapamiento imposible sin que el build falle · isotipo vectorial nativo."""
import os, math
from reportlab.pdfgen import canvas as rcanvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as RLTTFont
from reportlab.lib.colors import HexColor
from fontTools.ttLib import TTFont as _TT
from fontTools.varLib import instancer as _inst

NEGRO="#0B0B0B"; CARBON="#1A1A1A"; GRAFITO="#2E2E2E"; NIEBLA="#8A8783"
PIEDRA="#E6E2DB"; MARFIL="#F5F2ED"; ACCESO="#5E2129"; LINEA="#DBD5C9"
MRZCOL="#B5AFA3"; CAMPO="#EAE5DA"

# Ruta de fuentes portable: usa PN_FONTS si está, si no la carpeta hermana "fuentes"
F=os.environ.get("PN_FONTS") or os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),"fuentes")
pdfmetrics.registerFont(RLTTFont("JostR", os.path.join(F,"Jost-Regular.ttf")))
for w,nm in [(500,"JostM"),(600,"JostS")]:
    p=f"/tmp/Jost-{w}.ttf"
    if not os.path.exists(p):
        vf=_TT(os.path.join(F,"Jost-VF.ttf")); _inst.instantiateVariableFont(vf,{"wght":w}).save(p)
    pdfmetrics.registerFont(RLTTFont(nm,p))

PW,PH=595.27,841.89
M=60
CW=PW-2*M

class RoleError(Exception): pass

def _role_check(role,font,size,color,dark):
    if font=="JostL": raise RoleError("Jost Light prohibida")
    if role=="display":
        if size<20: raise RoleError(f"display>=20 (got {size})")
        if color not in ({MARFIL} if dark else {NEGRO}): raise RoleError(f"display color {color}")
    elif role=="fuerte":
        if size<10: raise RoleError(f"fuerte>=10 (got {size})")
        if color not in ({MARFIL,PIEDRA,ACCESO} if dark else {NEGRO,CARBON,ACCESO}):
            raise RoleError(f"fuerte color {color} dark={dark}")
    elif role=="etiqueta":
        if not (6.5<=size<=11): raise RoleError(f"etiqueta size {size}")
        if color not in ({PIEDRA,NIEBLA} if dark else {GRAFITO,ACCESO}):
            raise RoleError(f"etiqueta color {color} dark={dark}")
    elif role=="meta":
        if size>12: raise RoleError(f"meta<=12 (got {size})")
        if color not in {NIEBLA,MRZCOL,GRAFITO,PIEDRA}: raise RoleError(f"meta color {color}")
    else: raise RoleError(f"rol {role}")

class Page:
    def __init__(s,c,dark=False): s.c=c; s.dark=dark; s.boxes=[]; s.shrinks=[]
    def reg(s,name,x0,y0,x1,y1): s.boxes.append((name,min(x0,x1),min(y0,y1),max(x0,x1),max(y0,y1)))
    def overlaps(s):
        out=[]
        for i in range(len(s.boxes)):
            for j in range(i+1,len(s.boxes)):
                a,b=s.boxes[i],s.boxes[j]
                ox=min(a[3],b[3])-max(a[1],b[1]); oy=min(a[4],b[4])-max(a[2],b[2])
                if ox>1.0 and oy>1.0: out.append((a[0],b[0],round(ox,1),round(oy,1)))
        return out

def _wc(c,t,f,s,tr): return c.stringWidth(t,f,s)+tr*max(len(t)-1,0)

def caps(pg,s,x,y,size,role,color,track=2.4,align="left",max_w=None,name=None,font="JostR"):
    c=pg.c; s=s.upper()
    _role_check(role,font,size,color,pg.dark)
    if max_w is None:
        max_w = PW-M-x if align=="left" else (x-M if align=="right" else CW)
    sz,tr=float(size),float(track); orig=sz
    while _wc(c,s,font,sz,tr)>max_w and tr>0.5: tr-=0.15
    while _wc(c,s,font,sz,tr)>max_w and sz>5: sz-=0.2
    if sz<orig: pg.shrinks.append((s[:24],orig,sz))
    w=_wc(c,s,font,sz,tr)
    ox=x if align=="left" else (x-w if align=="right" else x-w/2)
    t=c.beginText(); t.setFont(font,sz); t.setCharSpace(tr); t.setTextOrigin(ox,y)
    t.setFillColor(HexColor(color)); t.textOut(s); t.setCharSpace(0); c.drawText(t)
    pg.reg(name or f"caps:{s[:18]}",ox,y-sz*0.22,ox+w,y+sz*0.78)
    return w,sz

def txt(pg,s,x,y,size,role,color,font="JostR",align="left",max_w=None,name=None):
    c=pg.c
    _role_check(role,font,size,color,pg.dark)
    if max_w is None: max_w = PW-M-x if align=="left" else (x-M if align=="right" else CW)
    sz=float(size); orig=sz
    while c.stringWidth(s,font,sz)>max_w and sz>6: sz-=0.3
    if sz<orig: pg.shrinks.append((s[:24],orig,sz))
    w=c.stringWidth(s,font,sz)
    ox=x if align=="left" else (x-w if align=="right" else x-w/2)
    c.setFont(font,sz); c.setFillColor(HexColor(color)); c.drawString(ox,y,s)
    pg.reg(name or f"txt:{s[:18]}",ox,y-sz*0.24,ox+w,y+sz*0.76)
    return w

def para(pg,text,x,y,size,role,color,max_w,leading=None,font="JostR",name="para"):
    """Párrafo con word-wrap. Devuelve la y del renglón SIGUIENTE al último."""
    c=pg.c; leading=leading or size*1.52
    words=text.split(); line=""; k=0
    for wd in words:
        t=(line+" "+wd) if line else wd
        if c.stringWidth(t,font,size)<=max_w: line=t
        else:
            txt(pg,line,x,y,size,role,color,font,max_w=max_w,name=f"{name}:{k}"); k+=1
            y-=leading; line=wd
    if line:
        txt(pg,line,x,y,size,role,color,font,max_w=max_w,name=f"{name}:{k}")
        y-=leading
    return y

def rule(pg,y,x0=M,x1=None,color=LINEA,w=0.7,name="rule"):
    if x1 is None: x1=PW-M
    c=pg.c; c.setStrokeColor(HexColor(color)); c.setLineWidth(w); c.line(x0,y,x1,y)
    pg.reg(name,x0,y-0.5,x1,y+0.5)

def vline(pg,x,y0,y1,color=LINEA,w=0.7,name="vline"):
    c=pg.c; c.setStrokeColor(HexColor(color)); c.setLineWidth(w); c.line(x,y0,x,y1)
    pg.reg(name,x-0.5,y0,x+0.5,y1)

def star(pg,cx,cy,s,color,name="star"):
    c=pg.c; r=s*0.22
    c.saveState(); c.setFillColor(HexColor(color))
    p=c.beginPath(); p.moveTo(cx,cy+s)
    p.curveTo(cx+r,cy+r,cx+r,cy+r,cx+s,cy); p.curveTo(cx+r,cy-r,cx+r,cy-r,cx,cy-s)
    p.curveTo(cx-r,cy-r,cx-r,cy-r,cx-s,cy); p.curveTo(cx-r,cy+r,cx-r,cy+r,cx,cy+s)
    p.close(); c.drawPath(p,stroke=0,fill=1); c.restoreState()
    pg.reg(name,cx-s,cy-s,cx+s,cy+s)

def isotipo(pg,x,y_top,w,color,name="isotipo"):
    c=pg.c; VW,VH=168.0,232.0; s=w/VW; h=VH*s
    c.saveState(); c.translate(x,y_top-h); c.scale(s,s); c.translate(0,VH); c.scale(1,-1)
    col=HexColor(color); c.setStrokeColor(col); c.setFillColor(col)
    c.setLineWidth(7.0); c.setLineCap(1); c.setLineJoin(1)
    c.roundRect(9,9,150,214,27,stroke=1,fill=0)
    r=13.5*0.22; p=c.beginPath(); p.moveTo(84,56-13.5)
    p.curveTo(84+r,56-r,84+r,56-r,84+13.5,56); p.curveTo(84+r,56+r,84+r,56+r,84,56+13.5)
    p.curveTo(84-r,56+r,84-r,56+r,84-13.5,56); p.curveTo(84-r,56-r,84-r,56-r,84,56-13.5)
    p.close(); c.drawPath(p,stroke=0,fill=1)
    c.circle(84,118,41,stroke=1,fill=0)
    c.ellipse(84-18.86,77,84+18.86,159,stroke=1,fill=0)
    c.line(84,77,84,159)
    for dy in (-16.5,16.5):
        half=41*math.cos(math.asin(abs(dy)/41))*0.985; yy=118+dy
        p=c.beginPath(); p.moveTo(84-half,yy)
        p.curveTo(84,yy+(7 if dy>0 else -7),84,yy+(7 if dy>0 else -7),84+half,yy)
        c.drawPath(p,stroke=1,fill=0)
    for yy in (183,199): c.line(84-42,yy,84+42,yy)
    c.restoreState()
    pg.reg(name,x,y_top-h,x+w,y_top)
    return h

def sello_estado(pg,x_right,y,texto,confirmado=False,name="sello"):
    """Sello de estado de acceso — oxblood, exclusivo de los accesos.
    outline = en confirmación · filled = confirmado."""
    c=pg.c
    w=_wc(c,texto.upper(),"JostR",7.5,2.2)+22; h=20; x=x_right-w
    if confirmado:
        c.setFillColor(HexColor(ACCESO)); c.roundRect(x,y,w,h,2,stroke=0,fill=1)
        col=MARFIL
    else:
        c.setStrokeColor(HexColor(ACCESO)); c.setLineWidth(1.4); c.roundRect(x,y,w,h,2,stroke=1,fill=0)
        col=ACCESO
    pg.reg(name,x,y,x+w,y+h)
    t=c.beginText(); t.setFont("JostR",7.5); t.setCharSpace(2.2)
    t.setTextOrigin(x+11,y+6.5); t.setFillColor(HexColor(col)); t.textOut(texto.upper())
    t.setCharSpace(0); c.drawText(t)
    return w

def make_canvas(path,title):
    c=rcanvas.Canvas(path,pagesize=(PW,PH))
    c.setTitle(title); c.setAuthor("Pasaporte Negro")
    return c

REPORT={"pages":[]}
def close_page(pg,label):
    ov=pg.overlaps()
    REPORT["pages"].append((label,len(pg.boxes),ov,list(pg.shrinks)))
    if ov: raise SystemExit(f"SOLAPAMIENTO en {label}: {ov[:6]}")
    pg.c.showPage()

def print_report():
    print("=== PÁGINAS: cajas / solapamientos / shrinks ===")
    for label,nb,ov,sh in REPORT["pages"]:
        print(f"  {label}: {nb} cajas · {len(ov)} solap · shrinks={sh if sh else 'ninguno'}")
