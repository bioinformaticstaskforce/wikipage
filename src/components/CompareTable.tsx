import { LINES } from '../data';
import Badge from './Badge';

export default function CompareTable() {
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', marginTop: '3rem' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Pipeline Benchmarks</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Comparative performance and clinical parameters on standard 32-core cloud instances.</p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Pipeline</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Supported Variants</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Turnaround Time (WGS)</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Avg. Compute Cost</th>
            </tr>
          </thead>
          <tbody>
            {LINES.map((line, index) => (
              <tr key={line.id} style={{ borderBottom: index < LINES.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{line.name}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <Badge 
                    label={line.status.toUpperCase()} 
                    variant={line.status === 'stable' ? 'success' : line.status === 'review' ? 'warning' : 'info'} 
                  />
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {line.supportedVariants.map(v => (
                      <span key={v} style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{v}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{line.clinical?.tat || 'N/A'}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                  {line.id === 'l_sarek' ? '~$12.50' : line.id === 'l_gatk' ? '~$15.00' : '~$10.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
