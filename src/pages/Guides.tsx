export default function Guides() {
  const resources = [
    {
      title: 'nf-core/sarek',
      version: 'v3.11.0',
      desc: 'The Task Force recommends nf-core/sarek as the primary reference pipeline for somatic and germline DNA variant calling. Callers are selected with --tools; UMI consensus calling (liquid biopsy) is enabled with --umi_read_structure.',
      command: 'nextflow run nf-core/sarek -r 3.11.0 -profile docker \\\n  --input samplesheet.csv \\\n  --outdir results \\\n  --genome GATK.GRCh38 \\\n  --tools mutect2,strelka,manta,cnvkit,vep',
      link: 'https://nf-co.re/sarek/3.11.0/',
      linkLabel: 'Sarek Documentation',
    },
    {
      title: 'nf-core/oncoanalyser',
      version: 'v3.0.0',
      desc: 'The Hartwig Medical Foundation cancer toolkit (SAGE, ESVEE, PURPLE, LINX, ORANGE) as an nf-core pipeline. Purity-aware calling of all variant classes from WGS, WTS or targeted panels. Requires the HMF reference bundle.',
      command: 'nextflow run nf-core/oncoanalyser -revision 3.0.0 -profile docker \\\n  -config reference_data.config \\\n  --mode wgts \\\n  --genome GRCh38_hmf \\\n  --input samplesheet.csv \\\n  --outdir output/',
      link: 'https://nf-co.re/oncoanalyser/3.0.0/',
      linkLabel: 'oncoanalyser Documentation',
    },
    {
      title: 'GATK Best Practices',
      version: 'v4.x',
      desc: "The Broad Institute's canonical workflows for data pre-processing, variant discovery (germline & somatic), and callset refinement. Essential reading for understanding BQSR, VQSR, and filtering logic.",
      link: 'https://gatk.broadinstitute.org/hc/en-us/sections/360007226651-Best-Practices-Workflows',
      linkLabel: 'GATK Best Practices',
    },
    {
      title: 'nf-core/rnaseq',
      version: 'v3.27.0',
      desc: 'Bulk RNA-seq from FASTQ to gene/transcript counts with extensive QC. Default route: Trim Galore → STAR → Salmon. Feed the count matrix into nf-core/differentialabundance for DESeq2.',
      command: 'nextflow run nf-core/rnaseq -r 3.27.0 -profile docker \\\n  --input samplesheet.csv \\\n  --outdir results \\\n  --genome GRCh38 \\\n  --aligner star_salmon',
      link: 'https://nf-co.re/rnaseq/3.27.0/',
      linkLabel: 'rnaseq Documentation',
    },
    {
      title: 'nf-core/rnafusion',
      version: 'v4.1.3',
      desc: 'Gene fusion detection with Arriba, STAR-Fusion and FusionCatcher. Build the reference bundle once with --references_only before the first run.',
      command: 'nextflow run nf-core/rnafusion -r 4.1.3 -profile docker \\\n  --tools all \\\n  --input samplesheet.csv \\\n  --genomes_base /path/to/references \\\n  --outdir results',
      link: 'https://nf-co.re/rnafusion/4.1.3/',
      linkLabel: 'rnafusion Documentation',
    },
  ];

  const references = [
    { label: 'Nextflow installation', url: 'https://www.nextflow.io/docs/latest/getstarted.html' },
    { label: 'Docker setup', url: 'https://docs.docker.com/get-docker/' },
    { label: 'Singularity / Apptainer', url: 'https://apptainer.org/docs/user/latest/' },
    { label: 'nf-core tools', url: 'https://nf-co.re/tools' },
    { label: 'MultiQC', url: 'https://multiqc.info/' },
    { label: 'Ensembl VEP cache setup', url: 'https://www.ensembl.org/info/docs/tools/vep/script/vep_cache.html' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
          Guides & Resources
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          Installation instructions, reference pipelines, and external documentation.
        </p>
      </div>

      {/* Pipeline cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
        {resources.map((r) => (
          <div key={r.title} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{r.title}</h2>
              <span className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                {r.version}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 1.25rem', fontSize: '0.9rem' }}>
              {r.desc}
            </p>
            {r.command && (
              <pre style={{
                background: '#0f172a', color: '#e2e8f0', padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)', overflowX: 'auto', fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)', lineHeight: 1.6, marginBottom: '1rem'
              }}>
                <code>{r.command}</code>
              </pre>
            )}
            <a
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: '0.8rem' }}
            >
              {r.linkLabel} ↗
            </a>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem' }}>
          Quick reference links
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
          {references.map((ref) => (
            <a
              key={ref.label}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--brand-primary)', textDecoration: 'none', fontSize: '0.85rem',
                fontWeight: 500, padding: '0.4rem 0',
              }}
            >
              {ref.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
