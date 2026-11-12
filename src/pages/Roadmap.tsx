const ITEMS = [
  { tag: 'Priority', title: 'Conda environments', body: 'From the chosen pipeline to a ready environment, with resource warnings for heavy tools (e.g. GATK/Mutect2).' },
  { tag: 'Priority', title: 'Reference files', body: 'Genome, GTF, aligner indices and bisulfite references: where to get them and how to prepare them.' },
  { tag: 'Priority', title: 'Automated updates', body: 'Periodic checks of tool and reference versions, with backup of key resources on the platform.' },
  { tag: 'Planned', title: 'New omics', body: 'Methylation, proteomics and fragmentomics alongside DNA and RNA.' },
  { tag: 'Planned', title: 'Training', body: 'Workshops per omics to build a community that uses the pipelines correctly.' },
  { tag: 'Long term', title: 'National PMMP infrastructure', body: 'Upload data, request an analysis, run it on a central server/HPC, receive results.' },
];

export default function Roadmap() {
  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Roadmap</h1>
      <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
        Where MetrOmics is heading. Status: draft. Clinical figures marked "Not yet assessed" are pending task force review.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {ITEMS.map((i) => (
          <div key={i.title} className="card" style={{ padding: '1.25rem' }}>
            <p className="section-label" style={{ marginTop: 0 }}>{i.tag}</p>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem' }}>{i.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{i.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
