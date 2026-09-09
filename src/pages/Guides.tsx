export default function Guides() {
  const resources = [
    {
      title: 'NF-Core Sarek',
      version: 'v3.8.1',
      desc: 'The Task Force recommends nf-core/sarek as the primary reference pipeline for somatic and germline variant calling. Supports BWA-MEM2, Mutect2, Strelka2, and VEP out of the box.',
      command: 'nextflow run nf-core/sarek -profile docker \\\n  --input samplesheet.csv \\\n  --outdir results \\\n  --genome GRCh38',
      link: 'https://nf-co.re/sarek/3.8.1/',
      linkLabel: 'Sarek Documentation',
    },
    {
      title: 'NF-Core OncoAnalyzer',
      version: 'v2.3.0',
      desc: 'Integrates DNA and RNA analysis with support for ultra-low-pass genomics. Useful for comprehensive tumor profiling beyond standard variant calling.',
      command: 'nextflow run nf-core/oncoanalyser -profile docker \\\n  --input samplesheet.csv \\\n  --outdir results',
      link: 'https://nf-co.re/oncoanalyser/2.3.0/',
      linkLabel: 'OncoAnalyzer Documentation',
    },
    {
      title: 'GATK Best Practices',
      version: 'v4.x',
      desc: "The Broad Institute's canonical workflows for data pre-processing, variant discovery (germline & somatic), and callset refinement. Essential reading for understanding BQSR, VQSR, and filtering logic.",
      link: 'https://gatk.broadinstitute.org/hc/en-us/sections/360007226651-Best-Practices-Workflows',
      linkLabel: 'GATK Best Practices',
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
