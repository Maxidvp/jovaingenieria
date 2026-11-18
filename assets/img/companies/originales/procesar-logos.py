"""Convierte los logos de clientes en siluetas blancas uniformes (PNG con transparencia).

Todos salen en un lienzo de 400 x 160 px (se muestran a la mitad, 2x para pantallas retina),
recortados y escalados para que tengan un peso visual parecido. Requiere Pillow.

Uso, desde la raíz del sitio:
  python assets/img/companies/originales/procesar-logos.py assets/img/companies/originales assets/img/companies assets/fonts/barlow-condensed-latin-700-normal.woff2 [hoja_preview.png]

Para sumar un logo: dejar el original en esta carpeta, agregarlo a LOGOS y volver a correr.
"""
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont

SRC, OUT, FONT = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
PREVIEW = Path(sys.argv[4]) if len(sys.argv) > 4 else None

# Lienzo 2x (se muestra a 200 x 80 px)
CW, CH = 400, 160
HS = 118        # altura de un logo cuadrado
P = 0.45        # 0.5 = misma área para todos; menos = los anchos quedan un poco más grandes
MAX_H, MAX_W = 140, 372

# archivo de salida: (original, opciones)
LOGOS = {
    "exar":          ("exar.webp",               {"crop": (0, 0, 1061, 445), "scale": 0.86}),       # sin el lema
    "orocobre":      ("orocobre.jpg",            {}),
    "eramine":       ("eramine.jpg",             {"scale": 1.12}),
    "zijin":         ("zijin.jpg",               {"erase": [(325, 212, 1008, 304)], "scale": 0.95}),  # sin "Serbia Zijin Mining"
    "lithium-south": ("lithium south.jpg",       {"scale": 1.04}),
    "aquatech":      ("aquatech.png",            {}),
    "howe-baker":    ("howe baker engineers.png", {"scale": 1.06}),
    "excelerate":    ("excelerate energy.png",   {"scale": 0.88}),
    "mcdermott":     ("mc dermott.jpg",          {"text": ["J. RAY", "McDERMOTT"]}),
    "hanover":       ("hanover.gif",             {}),
    "tecpetrol":     ("tecpetrol.jpg",           {"scale": 0.96}),
    "echelon":       ("echelon.jpg",             {"scale": 0.94}),
}


def load_rgb(path):
    im = Image.open(path)
    im.seek(0)
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        return Image.alpha_composite(bg, im).convert("RGB")
    return im.convert("RGB")


def ink_mask(rgb, lo=34, hi=110):
    """Opacidad = cuánto se aleja el píxel del blanco (255 - min(R,G,B)), con umbral suave."""
    r, g, b = rgb.split()
    ink = ImageChops.invert(ImageChops.darker(ImageChops.darker(r, g), b))
    return ink.point(lambda v: 0 if v <= lo else 255 if v >= hi else round((v - lo) * 255 / (hi - lo)))


def trim(mask):
    box = mask.point(lambda v: 255 if v > 60 else 0).getbbox()
    return mask.crop(box)


def add_wordmark(mark, lines):
    """Pone el nombre a la derecha del emblema, en dos líneas, como el lockup de Excelerate."""
    h = mark.height
    block_h = round(h * 0.56)
    size = 200
    font = ImageFont.truetype(FONT, size)
    asc = font.getbbox("JM")[1]
    cap = font.getbbox("JM")[3] - asc
    lead = round(cap * 0.38)
    # escala para que el bloque de dos líneas mida block_h
    k = block_h / (cap * len(lines) + lead * (len(lines) - 1))
    font = ImageFont.truetype(FONT, round(size * k))
    bb = font.getbbox("JM")
    cap, asc = bb[3] - bb[1], bb[1]
    lead = round(cap * 0.38)
    widths = [font.getbbox(t)[2] for t in lines]
    gap = round(h * 0.16)
    W = mark.width + gap + max(widths)
    out = Image.new("L", (W, h), 0)
    out.paste(mark, (0, 0))
    d = ImageDraw.Draw(out)
    y = (h - block_h) // 2 - asc
    for t in lines:
        d.text((mark.width + gap, y), t, font=font, fill=255)
        y += cap + lead
    return out


def build(name, file, opt):
    rgb = load_rgb(SRC / file)
    if "crop" in opt:
        rgb = rgb.crop(opt["crop"])
    for box in opt.get("erase", []):
        ImageDraw.Draw(rgb).rectangle(box, fill=(255, 255, 255))
    mask = trim(ink_mask(rgb))
    if "text" in opt:
        mask = trim(add_wordmark(mask, opt["text"]))
    a = mask.width / mask.height
    h = HS * a ** -P * opt.get("scale", 1.0)
    w = h * a
    k = min(1.0, MAX_H / h, MAX_W / w)
    w, h = round(w * k), round(h * k)
    small = mask.resize((w, h), Image.LANCZOS)
    alpha = Image.new("L", (CW, CH), 0)
    alpha.paste(small, ((CW - w) // 2, (CH - h) // 2))
    out = Image.merge("LA", (Image.new("L", (CW, CH), 255), alpha))
    out.save(OUT / f"{name}.png", optimize=True)
    return out, (w, h, a)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    built = []
    for name, (file, opt) in LOGOS.items():
        im, (w, h, a) = build(name, file, opt)
        print(f"{name:14s} aspecto {a:4.2f}  {w}x{h}  -> {name}.png  {(OUT / (name + '.png')).stat().st_size // 1024} KB")
        built.append(im)
    if PREVIEW:
        cols, pad = 6, 8
        rows = -(-len(built) // cols)
        sheet = Image.new("RGB", (cols * (CW + pad) + pad, rows * (CH + pad) + pad), (14, 23, 38))
        d = ImageDraw.Draw(sheet)
        for i, im in enumerate(built):
            x, y = pad + (i % cols) * (CW + pad), pad + (i // cols) * (CH + pad)
            d.rectangle((x, y, x + CW - 1, y + CH - 1), outline=(40, 52, 72))
            rgba = im.convert("RGBA")
            sheet.paste(rgba, (x, y), rgba)
        sheet.save(PREVIEW)


main()
