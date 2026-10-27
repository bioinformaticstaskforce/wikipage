import { useState, useMemo } from 'react';
import TubeMap from '../components/TubeMap';
import CopyButton from '../components/CopyButton';
import { STEPS, STATIONS, TOOLS, LINES } from '../data';
import type { Line, Station } from '../data';

export default function Sandbox() {
  const [userStops, setUserStops] = useState<string[]>(LINES[0].stops);
  const [selectedStation, setSelectedStation] = useState<{ station: Station; lineIds: string[] } | null>(null);
  const [showExport, setShowExport] = useState(false);

  const activeLines = useMemo(() => {
    const customLine: Line = {
      id: 'l_custom',
      name: 'Custom Pipeline',
      shortName: 'Custom',
      color: '#f59e0b',
      stops: userStops,
      status: 'experimental',
      scope: 'exploratory',
      omicsCategory: 'DNA',
      supportedVariants: ['SNV', 'Indel']
    };
    return [...LINES, customLine];
  }, [userStops]);

  const handleStationSelect = (stepIndex: number, stationId: string) => {
    const newStops = [...userStops];
    newStops[stepIndex] = stationId;
    setUserStops(newStops);
  };

  const handleStationClick = (station: Station, lineIds: string[]) => {
    setSelectedStation({ station, lineIds });
  };

  const generateBash = () => {
    const tools = userStops.map((id) => {
      const st = STATIONS.find((s) => s.id === id);
      return st ? TOOLS[st.toolId].name : '';
    }).filter(Boolean);

    return `#!/bin/bash
# ──────────────────────────────────────────────
# MetrOmics Generated Pipeline
# Generated: ${new Date().toISOString().split('T')[0]}
# ──────────────────────────────────────────────

set -euo pipefail

SAMPLE_ID="\${1:?Usage: $0 <sample_id>}"
REF="GRCh38.fa"
THREADS=8

echo "▶ Starting analysis for \${SAMPLE_ID}"

${tools.map((t, i) => `# Step ${i + 1}: ${t}
echo "  [${i + 1}/${tools.length}] Running ${t}..."
# TODO: Insert ${t} command here
`).join('\n')}
echo "✓ Pipeline complete for \${SAMPLE_ID}"
`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            Pipeline Sandbox
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            Build a custom pipeline by selecting tools for each step, then export as a script.
          </p>
        </div>
        <button onClick={() => setShowExport(true)} className="btn btn-primary">
          Export Script
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
        {/* Builder */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <p className="section-label" style={{ marginTop: 0, marginBottom: '1rem' }}>Select a tool for each step</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {STEPS.map((step, i) => {
              const stepStations = STATIONS.filter((s) => s.stepId === step.id);
              if (stepStations.length === 0) return null;
              return (
                <div key={step.id} style={{ flex: '1 1 120px', minWidth: '120px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {step.label}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {stepStations.map((s) => {
                      const isActive = userStops[i] === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleStationSelect(i, s.id)}
                          style={{
                            textAlign: 'left',
                            padding: '0.4rem 0.7rem',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                            background: isActive ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                            color: isActive ? 'white' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-sans)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {TOOLS[s.toolId].name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="legend" style={{ marginBottom: 0, padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '0.5rem', alignSelf: 'center' }}>Legend:</span>
            {activeLines.map((line) => (
              <div key={line.id} className="legend-item" style={{ opacity: line.id === 'l_custom' ? 1 : 0.4 }}>
                <span className="legend-dot" style={{ background: line.color.startsWith('var') ? (line.color === 'var(--line-sarek)' ? '#059669' : line.color === 'var(--line-gatk)' ? '#2563eb' : '#dc2626') : line.color }} />
                {line.shortName}
              </div>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', alignSelf: 'center' }}>
              Reference pipelines are faded to highlight your custom path.
            </span>
          </div>
          <TubeMap activeLines={activeLines} highlightedLineId="l_custom" onStationClick={handleStationClick} />
        </div>
      </div>

      {/* Tool modal */}
      {selectedStation && (
        <div className="modal-backdrop" onClick={() => setSelectedStation(null)}>
          <div className="card" style={{ maxWidth: '480px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem' }}>
              {TOOLS[selectedStation.station.toolId].name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.9rem' }}>
              {TOOLS[selectedStation.station.toolId].simple}
            </p>
            <button onClick={() => setSelectedStation(null)} className="btn btn-primary" style={{ marginTop: '1.25rem', width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Export modal */}
      {showExport && (
        <div className="modal-backdrop" onClick={() => setShowExport(false)}>
          <div className="card" style={{ maxWidth: '720px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Generated Pipeline Script</h2>
              <button onClick={() => setShowExport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <pre style={{
              background: '#0f172a', color: '#e2e8f0', padding: '1.25rem',
              borderRadius: 'var(--radius-md)', overflowX: 'auto', fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)', lineHeight: 1.6
            }}>
              <code>{generateBash()}</code>
            </pre>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', width: '100%' }}>
              <div style={{ flex: 1 }}>
                <CopyButton text={generateBash()} />
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([generateBash()], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `custom_pipeline.sh`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Download .sh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
