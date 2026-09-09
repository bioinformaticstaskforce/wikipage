#!/usr/bin/env python3
"""MutaMetro Presentation Generator"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

W, H = 13.33, 7.5

# ── Palette (from index.css) ──────────────────────────────────
DARK   = RGBColor(0x0f,0x17,0x2a); MED    = RGBColor(0x1e,0x29,0x3b)
LIGHT  = RGBColor(0xf8,0xfa,0xfc); WHITE  = RGBColor(0xff,0xff,0xff)
TERT   = RGBColor(0xf1,0xf5,0xf9); TX     = RGBColor(0x0f,0x17,0x2a)
TX2    = RGBColor(0x64,0x74,0x8b); TX3    = RGBColor(0x94,0xa3,0xb8)
TXL    = RGBColor(0xf8,0xfa,0xfc); BRAND  = RGBColor(0x25,0x63,0xeb)
ACCENT = RGBColor(0x7c,0x3a,0xed); BORDER = RGBColor(0xe2,0xe8,0xf0)
SAREK  = RGBColor(0x05,0x96,0x69); GATK   = RGBColor(0x25,0x63,0xeb)
ONCO   = RGBColor(0xdc,0x26,0x26); AMBER  = RGBColor(0xf5,0x9e,0x0b)
DKBRD  = RGBColor(0x33,0x41,0x55)

SITE_TAGLINE = 'Consolidated pipeline recommendations for DNA Mutational Analysis'

prs = Presentation()
prs.slide_width  = Inches(W)
prs.slide_height = Inches(H)
BLANK = prs.slide_layouts[6]

# ── Primitive helpers ─────────────────────────────────────────

def new_slide():
    return prs.slides.add_slide(BLANK)

def bg(slide, color):
    f = slide.background.fill
    f.solid()
    f.fore_color.rgb = color

def rect(slide, l, t, w, h, fill=None, lc=None, lw=Pt(0.75), rounded=False):
    s = slide.shapes.add_shape(
        5 if rounded else 1,
        Inches(l), Inches(t), Inches(w), Inches(h)
    )
    if fill:
        s.fill.solid(); s.fill.fore_color.rgb = fill
    else:
        s.fill.background()
    if lc:
        s.line.color.rgb = lc; s.line.width = lw
    else:
        s.line.fill.background()
    if rounded:
        s.adjustments[0] = 0.08
    return s

def oval(slide, l, t, w, h, fill=None, lc=None, lw=Pt(2)):
    s = slide.shapes.add_shape(9, Inches(l), Inches(t), Inches(w), Inches(h))
    if fill:
        s.fill.solid(); s.fill.fore_color.rgb = fill
    else:
        s.fill.background()
    if lc:
        s.line.color.rgb = lc; s.line.width = lw
    else:
        s.line.fill.background()
    return s

def hline(slide, x1, y1, x2, y2, color, w=Pt(4)):
    c = slide.shapes.add_connector(1, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = color; c.line.width = w
    return c

def txt(slide, text, l, t, w, h, size=11, bold=False, color=TX,
        align=PP_ALIGN.LEFT, italic=False, wrap=True):
    tb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = wrap
    p  = tf.paragraphs[0]; p.alignment = align
    r  = p.add_run(); r.text = text
    r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
    r.font.color.rgb = color; r.font.name = 'Inter'
    return tb

def badge(slide, label, l, t, color, text_color=WHITE, w=1.1, h=0.28):
    rect(slide, l, t, w, h, fill=color, rounded=True)
    txt(slide, label, l+0.06, t+0.02, w-0.1, h-0.04,
        size=7.5, bold=True, color=text_color, align=PP_ALIGN.CENTER)

def section_header(slide, title, subtitle='', accent=BRAND, dark=False):
    rect(slide, 0, 0, W, 1.38, fill=DARK if dark else WHITE)
    rect(slide, 0, 1.32, W, 0.06, fill=accent)
    txt(slide, title, 0.55, 0.24, 12, 0.68,
        size=22, bold=True, color=TXL if dark else TX)
    if subtitle:
        txt(slide, subtitle, 0.55, 0.84, 12, 0.42,
            size=10, color=TX3, italic=False)

def card(slide, l, t, w, h, title='', body='', accent_color=None, body_size=9.5):
    rect(slide, l, t, w, h, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
    if accent_color:
        rect(slide, l, t, w, 0.048, fill=accent_color, rounded=True)
    yo = 0.22 if accent_color else 0.16
    if title:
        txt(slide, title, l+0.18, t+yo, w-0.36, 0.38, size=10.5, bold=True, color=TX)
        yo += 0.40
    if body:
        txt(slide, body, l+0.18, t+yo, w-0.36, h-yo-0.12,
            size=body_size, color=TX2, wrap=True)


# ═══════════════════════════════════════════════════════════════
# SLIDE 1 — COVER
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, DARK)
rect(sl, 0, 0, W*0.55, H, fill=MED)
rect(sl, 0, 5.9, W, 1.6, fill=RGBColor(0x09,0x0f,0x1d))
rect(sl, 0, 5.85, W, 0.06, fill=BRAND)

# Logo — three dots mirroring Layout.tsx SVG
oval(sl, 1.22, 2.50, 0.34, 0.34, fill=SAREK)
oval(sl, 1.75, 2.50, 0.34, 0.34, fill=BRAND)
oval(sl, 1.48, 2.98, 0.34, 0.34, fill=ONCO)
hline(sl, 1.39, 2.67, 1.92, 2.67, DKBRD, w=Pt(1.5))
hline(sl, 1.92, 2.67, 1.65, 3.15, DKBRD, w=Pt(1.5))

txt(sl, 'MutaMetro', 1.9, 2.28, 9, 1.0,
    size=52, bold=True, color=TXL)

txt(sl, 'Consolidated pipeline recommendations for',
    1.9, 3.32, 9.5, 0.45, size=14, color=TX3)
txt(sl, 'DNA Mutational Analysis',
    1.9, 3.72, 9.5, 0.52, size=14, bold=True, color=TXL)

for i, (label, col) in enumerate([
    ('Sarek  v3.8.1', SAREK),
    ('GATK Best Practices', GATK),
    ('OncoAnalyzer  v2.3.0', ONCO),
]):
    rect(sl, 1.9 + i*3.1, 4.45, 2.85, 0.38, fill=col, rounded=True)
    txt(sl, label, 1.94+i*3.1, 4.49, 2.77, 0.3,
        size=9.5, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

txt(sl, 'Task Force Computazionale Bioinfo  ·  September 2025',
    1.9, 5.18, 9, 0.35, size=9, color=TX3)


# ═══════════════════════════════════════════════════════════════
# SLIDE 2 — TABLE OF CONTENTS
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'Contents', 'What this presentation covers')

items = [
    (BRAND,  '01', 'Project Overview',       'What MutaMetro is and why it was built'),
    (BRAND,  '02', 'App Structure',           '5 sections — Home, Map, Wiki, Sandbox, Guides'),
    (SAREK,  '03', 'Pipeline Map',            'The subway-map metaphor and 8-step workflow'),
    (SAREK,  '04', 'The Three Pipelines',     'Sarek  ·  GATK Best Practices  ·  OncoAnalyzer'),
    (GATK,   '05', 'Tool Directory',          'Key bioinformatics tools at every step'),
    (ONCO,   '06', 'Clinical Profiles',       'Specimen, coverage, LOD, TAT comparison'),
    (ACCENT, '07', 'Further Directions',      'Proposed next features and integrations'),
]

for i, (col, num, title, sub) in enumerate(items):
    ci = i % 2; ri = i // 2
    lx = 0.5 + ci*6.45
    ly = 1.55 + ri*1.38
    if i == 6:  # last one centred
        lx = 3.62; ly = 1.55 + 3*1.38
    rect(sl, lx, ly, 6.1, 1.22, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
    rect(sl, lx, ly, 0.56, 1.22, fill=col, rounded=True)
    txt(sl, num, lx+0.04, ly+0.36, 0.48, 0.42, size=13, bold=True,
        color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, title, lx+0.7, ly+0.12, 5.2, 0.44, size=11.5, bold=True, color=TX)
    txt(sl, sub,   lx+0.7, ly+0.58, 5.2, 0.5,  size=9, color=TX2)


# ═══════════════════════════════════════════════════════════════
# SLIDE 3 — PROJECT OVERVIEW
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'Project Overview', 'MutaMetro — what it is and why it exists')

rect(sl, 0.5, 1.55, 12.33, 1.08,
     fill=RGBColor(0xeb,0xf3,0xff), lc=BRAND, lw=Pt(1), rounded=True)
rect(sl, 0.5, 1.55, 0.07, 1.08, fill=BRAND, rounded=True)
txt(sl, '"Standardized, evidence-based workflow recommendations for DNA mutational analysis '
       '— visualised as an interactive subway map that makes consensus steps and divergence '
       'points immediately legible."',
    0.74, 1.66, 11.9, 0.84, size=11.5, italic=True, color=TX)

cols_data = [
    (SAREK,  'The Problem',
     'Clinical and research labs run inconsistent bioinformatics pipelines. '
     'Different tool choices, parameters and QC thresholds lead to non-reproducible '
     'variant calls that are hard to compare across institutions.'),
    (BRAND, 'The Solution',
     'MutaMetro maps three community-validated pipelines onto a shared subway-map metaphor, '
     'making it immediately clear which tools are consensus standards and where pipelines diverge.'),
    (ONCO,  'The Audience',
     'Computational pathologists, clinical bioinformaticians and wet-lab scientists who need '
     'to select or validate a pipeline — without reading hundreds of pages of documentation.'),
]
for i, (col, title, body) in enumerate(cols_data):
    x = 0.5 + i*4.28
    card(sl, x, 2.82, 4.05, 4.38, title=title, body=body,
         accent_color=col, body_size=9.5)


# ═══════════════════════════════════════════════════════════════
# SLIDE 4 — APP STRUCTURE
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'App Structure', 'React 18  ·  TypeScript  ·  Vite 6  ·  React Router  ·  5 navigable sections')

pages = [
    ('Home',         BRAND,  '/',         'Landing page. Tagline, pipeline selector quiz, clinical profile cards, and subway-map legend explainer.'),
    ('Pipeline Map', SAREK,  '/map',      'Full-screen interactive tube map. Click any station to open a side-panel with tool details, pros/cons, CLI params and quality criteria.'),
    ('Wiki Hub',     ACCENT, '/wiki',     'Per-pipeline deep-dive pages: architecture theory, key publications and worked examples — rendered from Markdown with inline glossary tooltips.'),
    ('Sandbox',      AMBER,  '/sandbox',  'Build a custom pipeline by picking one tool per step. Live tube-map preview in amber + one-click Bash script export.'),
    ('Guides',       GATK,   '/guides',   'Quick-start commands for Sarek, OncoAnalyzer and GATK BP. External links for Nextflow, Docker, VEP cache and MultiQC.'),
]

for i, (name, col, route, desc) in enumerate(pages):
    ci = i % 3; ri = i // 3
    x  = 0.5 + ci*4.28 if ri == 0 else 2.36 + (i-3)*4.55
    y  = 1.58 if ri == 0 else 4.52
    bw = 4.05 if ri == 0 else 4.3
    rect(sl, x, y, bw, 2.68, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
    rect(sl, x, y, bw, 0.048, fill=col, rounded=True)
    rect(sl, x+0.15, y+0.18, 0.62, 0.26, fill=col, rounded=True)
    txt(sl, route, x+0.15, y+0.19, 0.62, 0.24,
        size=7.5, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, name,  x+0.88, y+0.16, bw-1.05, 0.34, size=11.5, bold=True, color=TX)
    txt(sl, desc,  x+0.18, y+0.60, bw-0.36, 1.9,  size=9, color=TX2, wrap=True)


# ═══════════════════════════════════════════════════════════════
# SLIDE 5 — THE SUBWAY MAP CONCEPT
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, DARK)
section_header(sl, 'The Subway Map Metaphor',
               'Three design concepts that carry the whole system', accent=ACCENT, dark=True)

concepts = [
    ('→', 'Pipeline Lines', SAREK,
     'Each coloured path traces a validated community-standard workflow from raw reads to '
     'annotated variants — like a subway route through analysis steps.'),
    ('◉', 'Tool Stations',  BRAND,
     'Every node is a specific software tool. Click any station to see its description, '
     'pros/cons, quality criteria and recommended CLI parameters.'),
    ('⊕', 'Consensus Hubs', ACCENT,
     'Thick interchange rings mark tools where multiple pipelines converge — indicating '
     'broad community consensus (e.g. BWA-MEM2, MarkDuplicates).'),
]
for i, (icon, title, col, desc) in enumerate(concepts):
    x = 0.5 + i*4.28
    rect(sl, x, 1.65, 4.05, 4.88, fill=MED, lc=DKBRD, lw=Pt(0.5), rounded=True)
    oval(sl, x+0.2, 1.9, 0.74, 0.74, fill=col)
    txt(sl, icon, x+0.2, 1.9, 0.74, 0.74, size=22, bold=True,
        color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, title, x+0.2, 2.84, 3.68, 0.46, size=13, bold=True, color=TXL)
    txt(sl, desc,  x+0.2, 3.38, 3.68, 2.9,  size=10, color=TX3, wrap=True)

# Decorative mini tube map at bottom
bx, by = 3.25, 6.58
for j, (col, stops) in enumerate([
    (SAREK, [0,1,2,3,4,5,6,7]),
    (GATK,  [0,1,2,3,4,5]),
    (ONCO,  [0,1,2,3,4,6,7]),
]):
    yj = by + j*0.24
    hline(sl, bx, yj, bx+7.0, yj, col, w=Pt(2.5))
    for s in stops:
        ox = bx + s*1.0 - 0.09
        oval(sl, ox, yj-0.09, 0.18, 0.18, fill=col)


# ═══════════════════════════════════════════════════════════════
# SLIDE 6 — 8-STEP PIPELINE OVERVIEW
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, '8-Step Pipeline Overview',
               'From raw sequencing reads to clinically reportable variants')

steps = [
    ('Input',           'FASTQ files\nfrom sequencer',     BRAND),
    ('QC & Trim',       'FastQC / fastp\nAdapter removal', RGBColor(0x06,0x82,0x7f)),
    ('Alignment',       'BWA-MEM2 /\nDRAGMAP',             SAREK),
    ('Post-\nprocess',  'MarkDuplicates\nBQSR',            ACCENT),
    ('Variant\nCalling','Mutect2 /\nStrelka2',             ONCO),
    ('Filtering',       'FilterMutect\nCalls',             RGBColor(0xc0,0x39,0x2b)),
    ('Annotation',      'Ensembl VEP\nClinVar / COSMIC',   AMBER),
    ('Reporting',       'MultiQC\nHTML dashboard',         TX2),
]

sw = (W - 1.0) / len(steps)
AR = RGBColor(0xc0,0xc8,0xd8)
for i, (name, desc, col) in enumerate(steps):
    x  = 0.5 + i*sw
    bw = sw*0.78; bh = 3.0
    bx = x + sw*0.02; by = H/2 - bh/2 - 0.1
    if i < len(steps)-1:
        hline(sl, x+sw*0.82, H/2-0.1, x+sw*0.98, H/2-0.1, AR, w=Pt(1.5))
    rect(sl, bx, by, bw, bh, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
    rect(sl, bx, by, bw, 0.06, fill=col, rounded=True)
    oval(sl, bx+bw/2-0.23, by+0.12, 0.46, 0.46, fill=col)
    txt(sl, str(i+1), bx+bw/2-0.23, by+0.12, 0.46, 0.46,
        size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, name, bx+0.05, by+0.68, bw-0.1, 0.66,
        size=9, bold=True, color=TX, align=PP_ALIGN.CENTER)
    txt(sl, desc, bx+0.05, by+1.40, bw-0.1, 1.42,
        size=7.5, color=TX2, align=PP_ALIGN.CENTER, wrap=True)

txt(sl, '◎  Consensus hubs (used by ≥ 2 pipelines): BWA-MEM2 · MarkDuplicates',
    0.5, 6.88, 12, 0.36, size=8.5, color=TX3)


# ═══════════════════════════════════════════════════════════════
# SLIDE 7 — PIPELINE MAP (drawn tube diagram)
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'Interactive Pipeline Map',
               'Click any station to open tool details  ·  Filter by variant type  ·  Toggle individual lines')

STEP_LABELS = ['Input','QC & Trim','Alignment','Post-\nprocess',
               'Variant\nCalling','Filtering','Annotation','Reporting']
LX, RX = 0.65, 12.75
step_xs = [LX + i*(RX-LX)/7 for i in range(8)]

# Column guides + step labels
for i, (lbl, sx) in enumerate(zip(STEP_LABELS, step_xs)):
    rect(sl, sx-0.55, 1.42, 1.1, 0.54, fill=TERT, rounded=True)
    txt(sl, lbl, sx-0.5, 1.43, 1.0, 0.52, size=7.5, bold=True,
        color=TX2, align=PP_ALIGN.CENTER, wrap=True)
    hline(sl, sx, 1.97, sx, 6.5, AR, w=Pt(0.5))

# Pipeline Y positions
SY, GY, OY = 3.3, 4.5, 5.7

# stop-index sets (step index 0-7)
# Sarek:  qc(1) align(2) postproc(3) calling(4) filtering(5) annotation(6) reporting(7)
# GATK:   qc(1) align(2) postproc(3) calling(4) filtering(5)
# Onco:   qc(1) align(2) postproc(3) calling(4) annotation(6) reporting(7)
pipelines = [
    ('Sarek',        SAREK, SY, {1,2,3,4,5,6,7}),
    ('GATK BP',      GATK,  GY, {1,2,3,4,5}),
    ('OncoAnalyzer', ONCO,  OY, {1,2,3,4,6,7}),
]
HUB = {2, 3}   # align + postproc: all 3 share them

tool_labels = {
    ('sarek',1):'FastQC\n+ fastp', ('sarek',2):'BWA-MEM2', ('sarek',3):'MarkDup\n+ BQSR',
    ('sarek',4):'Mutect2', ('sarek',5):'FilterMutect', ('sarek',6):'VEP', ('sarek',7):'MultiQC',
    ('gatk', 1):'FastQC',   ('gatk', 2):'BWA-MEM2',   ('gatk', 3):'MarkDup\n+ BQSR',
    ('gatk', 4):'Mutect2',  ('gatk', 5):'FilterMutect',
    ('onco', 1):'fastp',    ('onco', 2):'BWA-MEM2',   ('onco', 3):'MarkDup',
    ('onco', 4):'Strelka2', ('onco', 6):'VEP',        ('onco', 7):'MultiQC',
}

for pid_i, (pname, col, py, stops) in enumerate(pipelines):
    # Draw the line
    xs_sorted = sorted(stops)
    hline(sl, step_xs[xs_sorted[0]], py, step_xs[xs_sorted[-1]], py, col, w=Pt(5))

    for si in stops:
        sx = step_xs[si]
        key = (['sarek','gatk','onco'])[pid_i]
        is_hub = si in HUB
        R = 0.16 if is_hub else 0.115

        if is_hub:
            oval(sl, sx-R-0.07, py-R-0.07, (R+0.07)*2, (R+0.07)*2,
                 fill=WHITE, lc=col, lw=Pt(2.5))
            oval(sl, sx-R, py-R, R*2, R*2, fill=col)
        else:
            oval(sl, sx-R, py-R, R*2, R*2, fill=WHITE, lc=col, lw=Pt(2.5))

        label = tool_labels.get((key, si), '')
        # Label above sarek, below onco, above gatk
        if pid_i == 0:
            ly_lbl = py - 0.62
        elif pid_i == 1:
            ly_lbl = py + 0.25
        else:
            ly_lbl = py + 0.25
        txt(sl, label, sx-0.65, ly_lbl, 1.3, 0.45,
            size=6.8, color=col, align=PP_ALIGN.CENTER, wrap=True)

# Legend row
for i, (name, col) in enumerate([
    ('Sarek v3.8.1', SAREK),
    ('GATK Best Practices', GATK),
    ('OncoAnalyzer v2.3.0', ONCO),
]):
    rect(sl, 0.5+i*3.85, 6.88, 3.6, 0.34, fill=col, rounded=True)
    txt(sl, name, 0.55+i*3.85, 6.9, 3.5, 0.28, size=9, bold=True, color=WHITE)

rect(sl, 12.1, 6.88, 1.1, 0.34, fill=DKBRD, rounded=True)
txt(sl, '◎  Hub', 12.12, 6.9, 1.06, 0.28, size=8.5, bold=True,
    color=WHITE, align=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════════════════════
# SLIDE 8 — SAREK
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'NF-Core Sarek  v3.8.1',
               'Primary recommendation  ·  Somatic & germline  ·  Stable', accent=SAREK)
rect(sl, 0, 0, 0.12, H, fill=SAREK)

badge(sl, 'STABLE', 0.55, 1.55, SAREK, w=0.85, h=0.3)
badge(sl, 'SNV · Indel · CNV · SV', 1.5, 1.55,
      RGBColor(0x16,0x85,0x5f), w=2.1, h=0.3)

left_cards = [
    ('Architecture',
     'Nextflow-based workflow implementing GATK Best Practices. Modular: swap aligners '
     '(BWA-MEM2 vs DRAGMAP), callers (Mutect2, Strelka2, FreeBayes), SV tools (Manta, '
     'TIDDIT) and CNV tools (ASCAT, Control-FREEC).'),
    ('Reproducibility',
     'nf-core standards guarantee bit-for-bit reproducibility across Docker, Singularity, '
     'Conda, AWS Batch and GCP. A single samplesheet.csv drives the entire run.'),
    ('CLI Quickstart',
     'nextflow run nf-core/sarek -profile docker \\\n'
     '  --input samplesheet.csv \\\n'
     '  --outdir results \\\n'
     '  --genome GRCh38'),
]
for i, (t, b) in enumerate(left_cards):
    card(sl, 0.55, 1.95+i*1.74, 6.2, 1.6, title=t, body=b, accent_color=SAREK)

# Clinical profile
rect(sl, 7.05, 1.55, 5.9, 5.7, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
rect(sl, 7.05, 1.55, 5.9, 0.052, fill=SAREK, rounded=True)
txt(sl, 'Clinical Profile', 7.2, 1.65, 5.6, 0.38, size=11, bold=True, color=TX)
clinical = [
    ('Specimen',        'Fresh-frozen tissue, FFPE (with artifact filtering)'),
    ('Min DNA Input',   '≥ 50 ng  (200 ng recommended for WGS)'),
    ('Target Coverage', '≥ 60× tumor,  ≥ 30× normal  (WGS)'),
    ('Limit of Det.',   '~5% VAF at 60× coverage'),
    ('Report Range',    'SNVs, small indels (≤ 50 bp)'),
    ('Turnaround',      '6–10 h per sample pair on 32-core node'),
    ('Accreditation',   'Widely used in ISO 15189-compliant labs'),
]
for j, (k, v) in enumerate(clinical):
    y = 2.14 + j*0.73
    rect(sl, 7.15, y, 5.7, 0.66, fill=TERT if j%2==0 else WHITE, rounded=True)
    txt(sl, k, 7.28, y+0.1, 1.9, 0.46, size=8.5, bold=True, color=TX2)
    txt(sl, v, 9.28, y+0.1, 3.4, 0.46, size=8.5, color=TX)


# ═══════════════════════════════════════════════════════════════
# SLIDE 9 — GATK BEST PRACTICES
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'GATK Best Practices  v4.x',
               'Broad Institute reference  ·  Germline & somatic  ·  Stable', accent=GATK)
rect(sl, 0, 0, 0.12, H, fill=GATK)

badge(sl, 'STABLE', 0.55, 1.55, GATK, w=0.85, h=0.3)
badge(sl, 'SNV · Indel · CNV', 1.5, 1.55,
      RGBColor(0x1a,0x52,0xcc), w=1.7, h=0.3)

left_cards = [
    ('Core Philosophy',
     'Two major phases: (1) Data Pre-processing — MarkDuplicates + BQSR to achieve maximum '
     'base quality accuracy. (2) Variant Discovery — HaplotypeCaller (germline) or Mutect2 '
     '(somatic) via local de novo haplotype assembly.'),
    ('Quality Control',
     'FilterMutectCalls applies orientation-bias artifact models, contamination estimates '
     'and panel-of-normals filtering. VQSR uses Gaussian Mixture Models for germline '
     'callset refinement.'),
    ('CLI Quickstart',
     'gatk Mutect2 -R ref.fa \\\n'
     '  -I tumor.bam -I normal.bam \\\n'
     '  -normal normal_sample \\\n'
     '  --germline-resource af-only-gnomad.vcf \\\n'
     '  --panel-of-normals pon.vcf -O somatic.vcf.gz'),
]
for i, (t, b) in enumerate(left_cards):
    card(sl, 0.55, 1.95+i*1.74, 6.2, 1.6, title=t, body=b, accent_color=GATK)

rect(sl, 7.05, 1.55, 5.9, 5.7, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
rect(sl, 7.05, 1.55, 5.9, 0.052, fill=GATK, rounded=True)
txt(sl, 'Clinical Profile', 7.2, 1.65, 5.6, 0.38, size=11, bold=True, color=TX)
clinical = [
    ('Specimen',        'Fresh-frozen tissue, FFPE, blood (germline)'),
    ('Min DNA Input',   '≥ 100 ng (WES),  ≥ 1 µg (WGS)'),
    ('Target Coverage', '≥ 100× target (WES),  ≥ 30× (WGS)'),
    ('Limit of Det.',   '~5–10% VAF depending on coverage and mode'),
    ('Report Range',    'SNVs, small indels — germline & somatic'),
    ('Turnaround',      '4–8 h per sample (WES) on 16-core node'),
    ('Accreditation',   'Broad Institute reference — basis for most clinical validations'),
]
for j, (k, v) in enumerate(clinical):
    y = 2.14 + j*0.73
    rect(sl, 7.15, y, 5.7, 0.66, fill=TERT if j%2==0 else WHITE, rounded=True)
    txt(sl, k, 7.28, y+0.1, 1.9, 0.46, size=8.5, bold=True, color=TX2)
    txt(sl, v, 9.28, y+0.1, 3.4, 0.46, size=8.5, color=TX)


# ═══════════════════════════════════════════════════════════════
# SLIDE 10 — ONCOANALYZER
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'NF-Core OncoAnalyzer  v2.3.0',
               'Comprehensive oncology  ·  DNA + RNA  ·  Under review', accent=ONCO)
rect(sl, 0, 0, 0.12, H, fill=ONCO)

badge(sl, 'REVIEW', 0.55, 1.55, AMBER, w=0.85, h=0.3)
badge(sl, 'SNV · Indel · CNV · SV · RNA Fusion', 1.5, 1.55, ONCO, w=2.9, h=0.3)

left_cards = [
    ('Key Differentiators',
     'Speed: Strelka2 over Mutect2 for 10-100× faster turnaround. '
     'Purity & Ploidy: PURPLE integration for accurate tumour fraction estimation. '
     'RNA: Arriba + STAR-Fusion for gene fusion detection alongside somatic calling.'),
    ('Multi-omic Integration',
     'Designed to merge DNA (WGS/WES/Panel) and RNA (transcriptome) in a single workflow. '
     'Mutational signatures are extracted as part of the standard output — no extra steps.'),
    ('CLI Quickstart',
     'nextflow run nf-core/oncoanalyser \\\n'
     '  -profile docker \\\n'
     '  --input samplesheet.csv \\\n'
     '  --outdir results'),
]
for i, (t, b) in enumerate(left_cards):
    card(sl, 0.55, 1.95+i*1.74, 6.2, 1.6, title=t, body=b, accent_color=ONCO)

rect(sl, 7.05, 1.55, 5.9, 5.7, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
rect(sl, 7.05, 1.55, 5.9, 0.052, fill=ONCO, rounded=True)
txt(sl, 'Clinical Profile', 7.2, 1.65, 5.6, 0.38, size=11, bold=True, color=TX)
clinical = [
    ('Specimen',        'Fresh-frozen tissue, FFPE'),
    ('Min DNA Input',   '≥ 50 ng'),
    ('Target Coverage', '≥ 80× tumor,  ≥ 40× normal'),
    ('Limit of Det.',   '~3% VAF  (Strelka2 higher indel sensitivity)'),
    ('Report Range',    'SNVs, indels, structural variants (with Manta)'),
    ('Turnaround',      '4–6 h per sample pair on 32-core node'),
    ('Accreditation',   'Under review — not yet in ISO 15189 validations'),
]
for j, (k, v) in enumerate(clinical):
    y = 2.14 + j*0.73
    rect(sl, 7.15, y, 5.7, 0.66, fill=TERT if j%2==0 else WHITE, rounded=True)
    txt(sl, k, 7.28, y+0.1, 1.9, 0.46, size=8.5, bold=True, color=TX2)
    txt(sl, v, 9.28, y+0.1, 3.4, 0.46, size=8.5, color=TX)


# ═══════════════════════════════════════════════════════════════
# SLIDE 11 — TOOL DIRECTORY
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'Tool Directory', 'Key software at every step — hub tools are consensus across ≥ 2 pipelines')

tools = [
    ('FastQC',         'QC & Trim',     RGBColor(0x06,0x82,0x7f), 'GATK · Sarek',
     'Scans raw FASTQ and flags quality problems. De facto standard — zero-config, universally understood reports.'),
    ('fastp',          'QC & Trim',     RGBColor(0x06,0x82,0x7f), 'Sarek · OncoAnalyzer',
     'All-in-one QC + adapter trimming. Single C++ binary; supports polyG/X trimming for NovaSeq chemistry.'),
    ('BWA-MEM2',       'Alignment',     SAREK,  'All 3 pipelines  ◎',
     '2-3× faster than BWA-MEM with identical output. Industry-standard short-read aligner. Consensus hub.'),
    ('MarkDuplicates', 'Post-process',  ACCENT, 'All 3 pipelines  ◎',
     'Flags PCR/optical duplicate reads so variant callers do not double-count them. Consensus hub.'),
    ('BQSR',           'Post-process',  ACCENT, 'GATK · Sarek',
     'Corrects systematic sequencer biases in base quality scores using known-variant reference sites (dbSNP, Mills).'),
    ('Mutect2',        'Variant Calling',ONCO,  'GATK · Sarek',
     'Broad Institute somatic SNV/indel caller via local de novo haplotype assembly. Supports panel of normals.'),
    ('Strelka2',       'Variant Calling',ONCO,  'OncoAnalyzer',
     '10-100× faster than Mutect2. Mixture-model approach with high indel accuracy. Useful as consensus filter.'),
    ('Ensembl VEP',    'Annotation',    AMBER,  'Sarek · OncoAnalyzer',
     'Predicts functional consequences. Cross-references ClinVar, COSMIC, gnomAD. Requires ≥ 15 GB local cache.'),
    ('MultiQC',        'Reporting',     TX2,    'Sarek · OncoAnalyzer',
     'Aggregates logs from every tool into a single interactive HTML dashboard. Supports 100+ tools.'),
]

for i, (name, step, col, pipelines, desc) in enumerate(tools):
    ri = i // 3; ci = i % 3
    x = 0.5 + ci*4.28; y = 1.55 + ri*1.9
    rect(sl, x, y, 4.05, 1.76, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
    rect(sl, x, y, 4.05, 0.048, fill=col, rounded=True)
    txt(sl, name, x+0.15, y+0.1, 2.1, 0.38, size=11, bold=True, color=TX)
    badge(sl, step, x+2.38, y+0.1, col, w=1.52, h=0.28)
    txt(sl, f'Used by: {pipelines}', x+0.15, y+0.54, 3.75, 0.28,
        size=7.5, italic=True, color=col)
    txt(sl, desc, x+0.15, y+0.86, 3.75, 0.82, size=8.5, color=TX2, wrap=True)


# ═══════════════════════════════════════════════════════════════
# SLIDE 12 — WIKI HUB + SANDBOX
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'Wiki Hub  &  Pipeline Sandbox',
               'Depth and interactivity built into the same interface')

# Wiki Hub
rect(sl, 0.5, 1.55, 5.9, 5.7, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
rect(sl, 0.5, 1.55, 5.9, 0.052, fill=ACCENT, rounded=True)
txt(sl, 'Wiki Hub  /wiki', 0.65, 1.67, 5.6, 0.42, size=13, bold=True, color=TX)
txt(sl, 'Each pipeline gets a deep-dive page with:',
    0.65, 2.2, 5.6, 0.36, size=10, color=TX2)

wiki_items = [
    (BRAND,  'Theory',         'Architecture walk-through with Markdown + inline code blocks'),
    (SAREK,  'Publications',   'Key papers with DOI, authors and journal metadata'),
    (ACCENT, 'Examples',       'Worked use-cases from reference institutions'),
    (AMBER,  'Glossary Links', 'Inline hover tooltips for VAF, BQSR, LOD, FFPE…'),
]
for j, (col, title, desc) in enumerate(wiki_items):
    y = 2.72 + j*0.98
    oval(sl, 0.68, y+0.08, 0.28, 0.28, fill=col)
    txt(sl, title, 1.1, y+0.05, 1.55, 0.32, size=9.5, bold=True, color=TX)
    txt(sl, desc,  1.1, y+0.38, 4.85, 0.48, size=9,   color=TX2)

rect(sl, 0.65, 6.68, 5.6, 0.38, fill=TERT, rounded=True)
txt(sl, 'Route: /wiki/:lineId  →  e.g.  /wiki/l_sarek',
    0.8, 6.7, 5.3, 0.34, size=8.5, color=TX2)

# Sandbox
rect(sl, 6.9, 1.55, 6.0, 5.7, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
rect(sl, 6.9, 1.55, 6.0, 0.052, fill=AMBER, rounded=True)
txt(sl, 'Pipeline Sandbox  /sandbox', 7.05, 1.67, 5.7, 0.42, size=13, bold=True, color=TX)
txt(sl, 'Interactive custom pipeline builder:',
    7.05, 2.2, 5.7, 0.36, size=10, color=TX2)

sandbox_items = [
    (AMBER, 'Step Selectors', 'Per-step dropdowns listing all available tools for that stage'),
    (SAREK, 'Live Preview',   'Custom pipeline renders on the tube map in amber — reference pipelines faded'),
    (BRAND, 'Bash Export',    'One-click export of a skeleton bash script with selected tools pre-filled'),
    (ONCO,  'Modal Details',  'Click any station to read tool details without leaving the sandbox'),
]
for j, (col, title, desc) in enumerate(sandbox_items):
    y = 2.72 + j*0.98
    oval(sl, 7.08, y+0.08, 0.28, 0.28, fill=col)
    txt(sl, title, 7.5,  y+0.05, 1.8,  0.32, size=9.5, bold=True, color=TX)
    txt(sl, desc,  7.5,  y+0.38, 5.15, 0.48, size=9,   color=TX2)

rect(sl, 7.05, 6.68, 5.7, 0.38, fill=TERT, rounded=True)
txt(sl, 'Generated script uses  set -euo pipefail  ·  parameterised by SAMPLE_ID',
    7.2, 6.7, 5.4, 0.34, size=8.5, color=TX2)


# ═══════════════════════════════════════════════════════════════
# SLIDE 13 — CLINICAL COMPARISON TABLE
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'Clinical Profiles — Side-by-Side',
               'Analytical specifications for choosing the right pipeline')

COL_X = [0.45, 3.65, 6.85, 10.05]
COL_W = [3.15, 3.15, 3.15, 3.15]
headers = ['', 'NF-Core Sarek\nv3.8.1', 'GATK Best Practices\nv4.x', 'NF-Core OncoAnalyzer\nv2.3.0']
hcols   = [TX2, SAREK, GATK, ONCO]

for ci, (hdr, hcol, cx, cw) in enumerate(zip(headers, hcols, COL_X, COL_W)):
    fill = TERT if ci == 0 else hcol
    rect(sl, cx, 1.52, cw-0.06, 0.6, fill=fill, rounded=True)
    txt(sl, hdr, cx+0.08, 1.54, cw-0.18, 0.56,
        size=9, bold=True, color=TX if ci==0 else WHITE,
        align=PP_ALIGN.CENTER, wrap=True)

rows = [
    ('Specimen',        'Fresh-frozen, FFPE',       'Fresh-frozen, FFPE, blood', 'Fresh-frozen, FFPE'),
    ('Min DNA Input',   '≥ 50 ng',                  '≥ 100 ng (WES)',            '≥ 50 ng'),
    ('Coverage',        '≥ 60× tumor / 30× normal', '≥ 100× target (WES)',       '≥ 80× tumor / 40× normal'),
    ('Limit of Det.',   '~5% VAF',                  '~5–10% VAF',                '~3% VAF'),
    ('Variant Types',   'SNV, Indel, CNV, SV',      'SNV, Indel, CNV',           'SNV, Indel, CNV, SV, Fusion'),
    ('Turnaround',      '6–10 h / pair',             '4–8 h / sample (WES)',      '4–6 h / pair'),
    ('Status',          'Stable ✓',                  'Stable ✓',                  'Under Review ⚠'),
]
for ri, (label, *vals) in enumerate(rows):
    y = 2.2 + ri*0.72
    for ci, (val, cx, cw) in enumerate(zip([label]+list(vals), COL_X, COL_W)):
        bg_fill = TERT if ri%2==0 else WHITE
        fill = RGBColor(0xe8,0xed,0xf5) if ci==0 else bg_fill
        rect(sl, cx, y, cw-0.06, 0.66, fill=fill, rounded=True)
        txt(sl, val, cx+0.1, y+0.1, cw-0.2, 0.48,
            size=8.5, bold=(ci==0), color=TX2 if ci==0 else TX,
            align=PP_ALIGN.LEFT if ci==0 else PP_ALIGN.CENTER, wrap=True)


# ═══════════════════════════════════════════════════════════════
# SLIDE 14 — GLOSSARY
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, LIGHT)
section_header(sl, 'Glossary',
               'Key terms — shown as inline hover tooltips throughout the app via GlossaryText')

terms = [
    ('VAF',  'Variant Allele Frequency',
     'Proportion of reads supporting the variant allele. Key metric for low-fraction somatic mutation detection.'),
    ('BQSR', 'Base Quality Score Recalibration',
     'GATK process correcting systematic biases in base quality scores assigned by the sequencer.'),
    ('PoN',  'Panel of Normals',
     'Collection of normal samples used to filter recurrent technical artifacts in somatic calling.'),
    ('LOD',  'Limit of Detection',
     'Minimum VAF a pipeline can reliably detect. Depends on coverage, sample quality and caller model.'),
    ('FFPE', 'Formalin-Fixed Paraffin-Embedded',
     'Common tissue preservation method introducing DNA artifacts that require specific pipeline handling.'),
    ('cfDNA','Cell-free DNA',
     'Fragmented DNA circulating in the bloodstream. Used in liquid biopsy — very low VAF detection required.'),
    ('UMI',  'Unique Molecular Identifiers',
     'Short random sequences added during library prep for true duplicate removal and error correction.'),
    ('TAT',  'Turnaround Time',
     'Time from sample receipt to report delivery. Clinically critical for urgent diagnostics.'),
    ('WES',  'Whole Exome Sequencing',
     'Targeted sequencing of protein-coding regions (~1-2% of genome). Cost-effective for known gene panels.'),
    ('WGS',  'Whole Genome Sequencing',
     'Sequencing of the entire genome at 30-60× coverage. Detects SVs, CNVs and regulatory variants.'),
]

for i, (abbr, full, defn) in enumerate(terms):
    ci = i % 2; ri = i // 2
    x = 0.5 + ci*6.45; y = 1.55 + ri*1.15
    rect(sl, x, y, 6.1, 1.05, fill=WHITE, lc=BORDER, lw=Pt(0.5), rounded=True)
    rect(sl, x, y, 0.74, 1.05, fill=BRAND, rounded=True)
    txt(sl, abbr, x, y+0.28, 0.74, 0.48,
        size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, full, x+0.82, y+0.06, 1.9, 0.42, size=8, bold=True, color=TX)
    txt(sl, defn, x+0.82, y+0.52, 5.12, 0.45, size=8.5, color=TX2, wrap=True)


# ═══════════════════════════════════════════════════════════════
# SLIDE 15 — FURTHER DIRECTIONS
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, DARK)
section_header(sl, 'Further Directions',
               'Proposed next features and research integrations', accent=ACCENT, dark=True)

directions = [
    (SAREK,  '🧬', 'Long Read Support',
     'Add ONT/PacBio pipelines — Clair3 for SNVs/indels, Sniffles2 for large structural variants. '
     'Extend TubeMap with a long-read-specific step layer.'),
    (BRAND,  '🤖', 'AI/ML Variant Filtering',
     'Integrate DeepVariant or GATK CNN-based scoring as an alternative filtering station. '
     'Expose model confidence thresholds in the sandbox selector.'),
    (ONCO,   '🔬', 'Multi-omic Extension',
     'Extend beyond DNA to RNA-seq (DESeq2, salmon), ChIP-seq, ATAC-seq and methylation. '
     'Add a "data-type" filter dimension to the tube map.'),
    (ACCENT, '☁️', 'Cloud Deployment Profiles',
     'One-click deployment guides for AWS Batch, GCP Life Sciences and Azure Genomics. '
     'Embed cost-per-sample estimates from public cloud pricing APIs.'),
    (AMBER,  '🏥', 'Lab-specific Profiles',
     'Allow institutions to submit validated custom pipeline configurations. '
     'Version-control community submissions via GitHub pull requests.'),
    (TX2,    '📊', 'VCF Sandbox Upload',
     'Let users upload a real VCF to visualise filtering decisions at each pipeline step in-browser. '
     'Highlight which filters each tool would apply and why.'),
]

for i, (col, icon, title, body) in enumerate(directions):
    ri = i // 2; ci = i % 2
    x = 0.5 + ci*6.45; y = 1.58 + ri*1.92
    rect(sl, x, y, 6.1, 1.78, fill=MED, lc=DKBRD, lw=Pt(0.5), rounded=True)
    rect(sl, x, y, 0.06, 1.78, fill=col, rounded=True)
    txt(sl, icon+' '+title, x+0.22, y+0.14, 5.7, 0.42,
        size=11.5, bold=True, color=TXL)
    txt(sl, body, x+0.22, y+0.60, 5.7, 1.06, size=9, color=TX3, wrap=True)


# ═══════════════════════════════════════════════════════════════
# SLIDE 16 — CLOSE
# ═══════════════════════════════════════════════════════════════
sl = new_slide(); bg(sl, DARK)
rect(sl, 0, 0, W, H, fill=DARK)
rect(sl, 0, 3.55, W, 0.07, fill=BRAND)

# Logo
oval(sl, 5.72, 1.02, 0.36, 0.36, fill=SAREK)
oval(sl, 6.48, 1.02, 0.36, 0.36, fill=BRAND)
oval(sl, 6.10, 1.60, 0.36, 0.36, fill=ONCO)
hline(sl, 5.90, 1.20, 6.66, 1.20, DKBRD, w=Pt(1.5))
hline(sl, 6.66, 1.20, 6.28, 1.78, DKBRD, w=Pt(1.5))

txt(sl, 'MutaMetro', 0, 2.22, W, 0.9,
    size=44, bold=True, color=TXL, align=PP_ALIGN.CENTER)
txt(sl, SITE_TAGLINE, 0, 3.18, W, 0.44,
    size=11.5, color=TX3, align=PP_ALIGN.CENTER)
txt(sl, 'Task Force Computazionale Bioinfo  ·  September 2025',
    0, 3.82, W, 0.38, size=10, color=TX3, align=PP_ALIGN.CENTER)

for i, (lbl, col) in enumerate([
    ('Sarek v3.8.1', SAREK),
    ('GATK BP', GATK),
    ('OncoAnalyzer v2.3.0', ONCO),
]):
    rect(sl, 3.52+i*2.12, 4.48, 1.96, 0.38, fill=col, rounded=True)
    txt(sl, lbl, 3.54+i*2.12, 4.50, 1.92, 0.34,
        size=9, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

txt(sl, 'Questions & Discussion', 0, 5.22, W, 0.46,
    size=16, bold=True, color=TXL, align=PP_ALIGN.CENTER)


# ── Save ─────────────────────────────────────────────────────
OUT = ('/Users/niccolovono/Library/Mobile Documents/'
       'com~apple~CloudDocs/Lab/bioinfo_tf/MutaMetro_Presentation.pptx')
prs.save(OUT)
print(f'Saved  →  {OUT}')
print(f'Slides: {len(prs.slides)}')
