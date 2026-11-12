#!/usr/bin/env python3
"""MetrOmics logo: the chosen ring symbol in (colour, mono, reversed) x (symbol, lockup).
Wordmark is converted to outlines (Inter Bold, OFL) so the SVGs need no installed font.
Run from the project root:  python3 branding/make_logos.py"""
import os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONT = os.path.expanduser('~/Library/Fonts/Inter_24pt-Bold.ttf')
OUT = os.path.join(os.path.dirname(__file__))
G, B, R, V, DARK, SLATE = '#059669', '#2563eb', '#dc2626', '#7c3aed', '#0f172a', '#334155'

PALETTES = {  # lines, ink (connectors/station ring), station fill, wordmark parts, preview background
    'color':    dict(lines=[G, B, R, V], ink=SLATE, fill='#ffffff', word=(SLATE, B), bg='#ffffff'),
    'mono':     dict(lines=[DARK]*4,     ink=DARK,  fill='#ffffff', word=(DARK, DARK), bg='#ffffff'),
    'reversed': dict(lines=['#ffffff']*4, ink='#ffffff', fill=DARK,  word=('#ffffff', '#ffffff'), bg=DARK),
}

def st(x, y, p, r=4.5, color=None):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{p["fill"]}" stroke="{color or p["ink"]}" stroke-width="3"/>'

def ring(p):
    c = p['lines']
    return (f'<circle cx="32" cy="32" r="28" fill="none" stroke="{c[1]}" stroke-width="4"/>'
            f'<line x1="21" y1="25" x2="43" y2="25" stroke="{p["ink"]}" stroke-width="2.5"/>'
            f'<line x1="43" y1="25" x2="32" y2="44" stroke="{p["ink"]}" stroke-width="2.5"/>'
            f'<circle cx="21" cy="25" r="6" fill="{c[0]}"/><circle cx="43" cy="25" r="6" fill="{c[1]}"/>'
            f'<circle cx="32" cy="44" r="6" fill="{c[2]}"/>')

SYMBOLS = {'ring': ring}

_font = TTFont(FONT); _gs = _font.getGlyphSet(); _cmap = _font.getBestCmap(); _upm = _font['head'].unitsPerEm
def text_paths(text, size, x, baseline, fills):
    """Outline `text` (kerning ignored); fills = colour per character index."""
    s = size / _upm; out = []; pen_x = x
    for i, ch in enumerate(text):
        g = _gs[_cmap[ord(ch)]]; pen = SVGPathPen(_gs)
        g.draw(TransformPen(pen, (s, 0, 0, -s, pen_x, baseline)))
        out.append(f'<path d="{pen.getCommands()}" fill="{fills[i]}"/>'); pen_x += g.width * s
    return ''.join(out), pen_x

def lockup(sym, p, tag=False):
    word = 'MetrOmics'; fills = [p['word'][0]]*4 + [p['word'][1]]*5
    paths, end = text_paths(word, 50, 84, 49, fills)
    return f'<g>{SYMBOLS[sym](p)}</g><g>{paths}</g>', end + 4

def svg(inner, w, h, bg=None, title='MetrOmics'):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{title}"><title>{title}</title>{rect}{inner}</svg>\n'

sheet = []; y = 0
for vi, sym in enumerate(SYMBOLS):
    for pi, (pn, p) in enumerate(PALETTES.items()):
        sym_inner = SYMBOLS[sym](p)
        reversed_bg = DARK if pn == 'reversed' else None  # reversed files ship transparent; preview adds the background
        open(f'{OUT}/metromics-{sym}-symbol-{pn}.svg', 'w').write(svg(sym_inner, 64, 64))
        inner, w = lockup(sym, p)
        open(f'{OUT}/metromics-{sym}-lockup-{pn}.svg', 'w').write(svg(inner, round(w), 64))
        x = 40 + pi * 700
        sheet.append(f'<rect x="{x-20}" y="{y+10}" width="680" height="150" rx="14" fill="{p["bg"]}" stroke="#e2e8f0"/>'
                     f'<g transform="translate({x},{y+40}) scale(1.2)">{inner}</g>'
                     f'<g transform="translate({x+560},{y+64}) scale(0.5)">{sym_inner}</g>'
                     f'<g transform="translate({x+610},{y+64}) scale(0.25)">{sym_inner}</g>')
    y += 170
open(f'{OUT}/preview.svg', 'w').write(svg(''.join(sheet), 2120, y + 20, bg='#f1f5f9', title='MetrOmics logo drafts'))
print('written', len(os.listdir(OUT)), 'files')
