# MetrOmics

A "tube map" reference for bioinformatics workflows, built for the Task Force Computazionale Bioinfo.
Each pipeline is a coloured line, each tool is a station, and stations shared by several pipelines
show where the community agrees.

**Modules:** DNA (somatic, germline, liquid biopsy, SV/CNV) and RNA (expression, differential
expression, fusions). Methylation, proteomics and fragmentomics are on the roadmap.

**Status: draft.** The reference lines follow the public documentation of nf-core/sarek,
nf-core/oncoanalyser, GATK Best Practices, nf-core/rnaseq, nf-core/differentialabundance and
nf-core/rnafusion. The task force's own pipeline is not on the map yet. Clinical figures marked
"Not yet assessed by the task force" still need review.

## Running locally

```bash
npm install
npm run dev        # live-reload server: http://localhost:5173/wikipage/
npm run build      # checks the data, type-checks, builds into dist/
npm run preview    # serves dist/: http://localhost:4173/wikipage/
```

## Pages

| Route | What it is |
|---|---|
| `/` | Home: omics selector, pipeline recommender wizard, pipeline profiles |
| `/map` | Interactive map with DNA/RNA switch, filters and tool details (`?omics=RNA`, `?line=<id>`, `?tool=<id>`) |
| `/sandbox` | Build a custom DNA pipeline and export a script of reference commands |
| `/guides` | Install commands and external resources |
| `/wiki`, `/wiki/<line id>` | Background, publications and examples per pipeline |

Discussions live on [GitHub Discussions](https://github.com/bioinformaticstaskforce/wikipage/discussions).

## Editing content

All content is in **`src/data.ts`**. You don't need to touch the components to add tools or pipelines.

- `STEPS`: the columns of each map, left to right, tagged with their omics (`DNA` or `RNA`).
- `TOOLS`: the tool cards: hint, simple/technical text, pros/cons, recommended command (`params`),
  input/output files and links.
- `STATIONS`: places a tool in a step. Each step has at most one `hub` (drawn on the centre row).
  The others are `branch` stations with a `row` (`-2`, `-1`, `1`, `2`; negative is above the centre).
  The same tool can appear in several omics through separate stations (e.g. FastQC).
- `LINES`: a pipeline is an ordered list of station ids plus metadata (status, supported variants,
  optional clinical profile and wiki content). Stations used by several lines become interchanges.

### Adding the TaskForce line

1. Add any missing tools to `TOOLS` and place them with `STATIONS`.
2. Add a `Line` to `LINES` with its stops in order, a distinct `color` (hex) and `status: "experimental"`.
3. Optionally point the wizard to it in `recommendLine()`.
4. Run `npm run check:data`. It fails on unknown stations or tools, stops from the wrong omics,
   two hubs in one step, or two stations on the same row.

## Deploying

Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

One-time setup in the repository settings:
- **Pages → Source:** GitHub Actions.
- **General → Features:** enable Discussions.

The site is served from `/wikipage/`. If the repository is renamed, update `base` in `vite.config.ts`.
