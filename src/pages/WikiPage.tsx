import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { LINES } from '../data';
import type { PipelineGuide } from '../data';
import CopyButton from '../components/CopyButton';
import GlossaryText from '../components/GlossaryText';

const H2 = { fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem' } as const;
const H3 = { fontSize: '1.05rem', fontWeight: 700, margin: '1.5rem 0 0.5rem' } as const;
const List = ({ items }: { items: string[] }) => (
  <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7 }}>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
);

function GuideCard({ guide: g }: { guide: PipelineGuide }) {
  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h2 style={H2}>Practical Guide</h2>
      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderLeft: '3px solid #f59e0b', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        <strong>Draft, not yet reviewed by the task force.</strong> Values marked "TBD" have to be set by the task force before clinical use.
      </div>

      <h3 style={{ ...H3, marginTop: 0 }}>When to use it</h3>
      <List items={g.whenToUse} />
      <h3 style={H3}>When not to use it</h3>
      <List items={g.whenNotToUse} />

      <h3 style={H3}>Decisions</h3>
      {g.decisions.map((d) => (
        <p key={d.question} style={{ margin: '0 0 0.5rem', lineHeight: 1.6 }}><strong>{d.question}</strong> {d.answer}</p>
      ))}

      <h3 style={H3}>Inputs</h3>
      <div className="markdown-content" style={{ lineHeight: 1.7 }}><ReactMarkdown>{g.inputs}</ReactMarkdown></div>

      <h3 style={H3}>Run</h3>
      <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: '1rem', borderRadius: 'var(--radius-md)', overflow: 'auto', fontSize: '0.82rem', margin: 0 }}><code>{g.run}</code></pre>
      <div style={{ marginTop: '0.5rem' }}><CopyButton text={g.run} /></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{g.resources}</p>

      <h3 style={H3}>Quality checkpoints</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead><tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}><th style={{ padding: '0.4rem' }}>Step</th><th>Check</th><th>Threshold</th></tr></thead>
          <tbody>
            {g.qcGates.map((q) => (
              <tr key={q.step} style={{ borderTop: '1px solid var(--border-subtle)', verticalAlign: 'top' }}>
                <td style={{ padding: '0.5rem 0.4rem', fontWeight: 600 }}>{q.step}</td>
                <td style={{ padding: '0.5rem 0.4rem' }}>{q.check}</td>
                <td style={{ padding: '0.5rem 0.4rem', color: q.threshold.startsWith('TBD') ? 'var(--text-muted)' : 'inherit', fontStyle: q.threshold.startsWith('TBD') ? 'italic' : 'normal' }}>{q.threshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={H3}>Outputs</h3>
      <div className="markdown-content" style={{ lineHeight: 1.7 }}><ReactMarkdown>{g.outputs}</ReactMarkdown></div>

      <h3 style={H3}>Common pitfalls</h3>
      <List items={g.pitfalls} />

      <h3 style={H3}>Provenance</h3>
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        {g.provenance.version} · Reviewed by: {g.provenance.reviewedBy} · Review date: {g.provenance.reviewDate}<br />
        {g.provenance.sources.map((s, i) => (
          <span key={s.url}>{i > 0 && ' · '}<a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-primary)' }}>{s.label} ↗</a></span>
        ))}
      </p>
    </div>
  );
}

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

      {wiki.guide && <GuideCard guide={wiki.guide} />}

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
