import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { LINES } from '../data';
import GlossaryText from '../components/GlossaryText';

export default function WikiPage() {
  const { pipelineId } = useParams<{ pipelineId: string }>();
  const line = LINES.find(l => l.id === pipelineId);

  if (!line || !line.wiki) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Wiki content not found</h2>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    );
  }

  const { wiki } = line;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem', borderBottom: `4px solid ${line.color}`, paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
          {line.name} <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>Wiki</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
          Theoretical concepts, examples, and key literature.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem' }}>Theoretical Concepts</h2>
        <div className="markdown-content" style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
          <ReactMarkdown>{wiki.theory}</ReactMarkdown>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem' }}>Key Publications</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {wiki.publications.map((pub, i) => (
            <div key={i} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{pub.title}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
                {pub.authors} — <em>{pub.journal}</em>
              </p>
              <a href={pub.url} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                DOI: {pub.doi} ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      {wiki.examples.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem' }}>Examples & Resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {wiki.examples.map((ex, i) => (
              <div key={i} style={{ padding: '1rem', borderLeft: `3px solid ${line.color}`, background: 'var(--bg-tertiary)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{ex.title}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                  <GlossaryText text={ex.desc} />
                </p>
                {ex.url && (
                  <a href={ex.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', color: 'var(--brand-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                    View Resource ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
