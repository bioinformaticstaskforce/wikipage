import { Link } from 'react-router-dom';
import { LINES, TOOLS, GLOSSARY } from '../data';
import GlossaryText from '../components/GlossaryText';
import GlossaryTooltip from '../components/GlossaryTooltip';

const COLOR_MAP: Record<string, string> = {
  'var(--line-sarek)': '#059669',
  'var(--line-gatk)': '#2563eb',
  'var(--line-onco)': '#dc2626',
};

export default function WikiIndex() {
  const toolsList = Object.entries(TOOLS).map(([id, tool]) => ({ id, ...tool }));

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
          MetrOmics <span style={{ color: 'var(--brand-primary)' }}>Wiki Hub</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
          The central repository for pipeline documentation, tool references, and theoretical concepts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1rem' }}>1</span>
            Workflows (Pipelines)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {LINES.map(line => (
              <div key={line.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: COLOR_MAP[line.color] || line.color }} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{line.name}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flex: 1 }}>
                  {line.wiki?.theory ? (
                    <GlossaryText text={line.wiki.theory.substring(0, 120) + '...'} />
                  ) : (
                    'Standard pipeline documentation and references.'
                  )}
                </p>
                <Link to={`/wiki/${line.id}`} className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center', background: COLOR_MAP[line.color] || line.color }}>
                  Explore {line.shortName} Wiki
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1rem' }}>2</span>
            Key Tools
          </h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {toolsList.slice(0, 8).map((tool, index) => (
              <div key={tool.id} style={{ padding: '1.25rem 1.5rem', borderBottom: index < 7 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <GlossaryTooltip key={tool.id} term={tool.name}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '0.2rem 0.6rem', borderRadius: '1rem', border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-primary)' }} />
                    {tool.name}
                  </span>
                </GlossaryTooltip>
              </div>
            ))}
            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
              <Link to="/map" style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>
                View all tools on the Map ↗
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1rem' }}>3</span>
            Theoretical Concepts
          </h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {GLOSSARY.map((term, index) => (
              <div key={term.term} style={{ padding: '1.25rem 1.5rem', borderBottom: index < GLOSSARY.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{term.term}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {term.definition}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
