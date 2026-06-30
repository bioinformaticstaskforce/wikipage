# MutaMetro

A "tube map" style reference for bioinformatics workflows, built for the Task Force Computazionale Bioinfo.
Pilot scope: DNA mutational analysis.

## Status

**Draft.** The public reference lines (Sarek, GATK Best Practices) reflect real documentation.
The "TaskForce Line" is a placeholder — its stops are randomly chosen for now, intersecting with
the reference lines just to test the interaction model (hover hints, click-through detail, shared
"interchange" stations). Replace it with the actual lab pipeline in `assets/js/tubemap-data.js`.

## Structure

- `index.html` — landing page
- `tubemap.html` — the interactive tube map (hover = hint, click = detail modal, Simple/Technical toggle)
- `guides.html` — install guides, external links, practical tips
- `assets/js/tubemap-data.js` — **edit this file** to change steps, tools, lines, and tool detail content
- `assets/js/tubemap.js` — rendering engine (shouldn't need changes for content updates)
- `assets/css/style.css` — design system

## Editing the map

Everything content-related lives in `assets/js/tubemap-data.js`:

- `STEPS` — the columns (macro-steps) of the pipeline, left to right
- `STATIONS` — every selectable tool at a given step; multiple stations per step = alternative tools
- `TOOLS` — the hover hint, simple/technical descriptions, pros/cons, and links shown for each tool
- `LINES` — a pipeline = an ordered list of station ids. Two lines sharing a station at the same
  step automatically render as a shared "interchange" node (thicker ring).

No build step — it's plain HTML/CSS/JS, so it's directly compatible with GitHub Pages.

## Deploying to GitHub Pages

1. Push this folder's contents to a GitHub repo (root, or a `/docs` folder).
2. In the repo settings → Pages, set the source branch (and `/docs` folder if used).
3. The site will be live at `https://<user>.github.io/<repo>/`.
