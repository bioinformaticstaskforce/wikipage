import { useState, useMemo, useEffect } from 'react';
import TubeMap from '../components/TubeMap';
import CopyButton from '../components/CopyButton';
import { STATIONS, TOOLS, stepsFor, linesFor } from '../data';
import type { Line, Station } from '../data';

const STEPS = stepsFor('DNA');
const LINES = linesFor('DNA');
const ORDER = STATIONS.map((s) => s.id);

// bioconda package per tool; tools not listed are noted as unmapped in the file
const CONDA: Record<string, string> = {
  fastqc: 'fastqc', fastp: 'fastp', adapterremoval: 'adapterremoval', trimgalore: 'trim-galore',
  bwamem2: 'bwa-mem2', dragmap: 'dragmap', gatk_markduplicates: 'gatk4', gatk_bqsr: 'gatk4',
  mutect2: 'gatk4', gatk_filtermutectcalls: 'gatk4', haplotypecaller: 'gatk4',
  gatk_contamination: 'gatk4', gatk_vqsr: 'gatk4', strelka2: 'strelka', vep: 'ensembl-vep',
  snpeff: 'snpeff', multiqc: 'multiqc', fgbio: 'fgbio', manta: 'manta', cnvkit: 'cnvkit',
  star: 'star', salmon: 'salmon', arriba: 'arriba', starfusion: 'star-fusion',
  fusioncatcher: 'fusioncatcher', deseq2: 'bioconductor-deseq2',
};

function generateEnv(stops: string[]) {
  const ids = [...new Set(stops.map((id) => STATIONS.find((s) => s.id === id)).filter((st): st is Station => !!st && st.stepId !== 'input').map((st) => st.toolId))];
  const pkgs = [...new Set(ids.map((id) => CONDA[id]).filter(Boolean))];
  const unmapped = ids.filter((id) => !CONDA[id]).map((id) => TOOLS[id].name);
  return `# MetrOmics generated environment (versions unpinned: pin them for reproducibility)
name: metromics_custom
channels:
  - conda-forge
  - bioconda
dependencies:
${pkgs.map((p) => `  - ${p}`).join('\n')}
${unmapped.length ? `# No conda package mapped (install via its pipeline/container): ${unmapped.join(', ')}\n` : ''}# Heavy tools (e.g. GATK/Mutect2) need substantial RAM/CPU: check resources first.
`;
}

/* Builds a script from each tool's reference command */
function generateBash(stops: string[], date = new Date().toISOString().split('T')[0]) {
  const tools = stops
    .map((id) => STATIONS.find((s) => s.id === id))
    .filter((st): st is Station => !!st && st.stepId !== 'input')
    .map((st) => TOOLS[st.toolId]);

  const body = tools.map((t, i) => {
    const cmd = t.params
      ? t.params.replace(/ && /g, '\n')
      : `# No standalone command: ${t.name} runs inside its pipeline.\n# See ${t.links[0]?.url ?? 'the tool documentation'}`;
    return `# ── Step ${i + 1}/${tools.length}: ${t.name}\necho "  [${i + 1}/${tools.length}] ${t.name}"\n${cmd}\n`;
  }).join('\n');

  return `#!/bin/bash
# ──────────────────────────────────────────────
# MetrOmics Generated Pipeline
# Generated: ${date}
# Reference commands only: file names are not chained
# between steps, adjust inputs/outputs before running.
# ──────────────────────────────────────────────

set -euo pipefail

SAMPLE_ID="\${1:?Usage: $0 <sample_id>}"
echo "▶ Starting analysis for \${SAMPLE_ID}"

${body}
echo "✓ Pipeline complete for \${SAMPLE_ID}"
`;
}

export default function Sandbox() {
  const [userStops, setUserStops] = useState<string[]>(LINES[0].stops);
  const [selectedStation, setSelectedStation] = useState<{ station: Station; lineIds: string[] } | null>(null);
  const [showExport, setShowExport] = useState(false);

  const activeLines = useMemo(() => {
    const customLine: Line = {
      id: 'l_custom',
      name: 'Custom Pipeline',
      shortName: 'Custom',
      color: '#db2777',
      stops: userStops,
      status: 'experimental',
      scope: 'exploratory',
      omicsCategory: 'DNA',
      supportedVariants: ['SNV', 'Indel']
    };
    return [...LINES, customLine];
  }, [userStops]);

  const toggleStation = (stationId: string) => {
    setUserStops((prev) => prev.includes(stationId)
      ? prev.filter((id) => id !== stationId)
      : [...prev, stationId].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)));
  };

  const handleStationClick = (station: Station, lineIds: string[]) => {
    setSelectedStation({ station, lineIds });
  };

  const script = generateBash(userStops);
  const envYml = generateEnv(userStops);

  // Esc closes whichever modal is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowExport(false); setSelectedStation(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const download = (text: string, name: string) => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            Pipeline Sandbox
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            Toggle tools on or off for each step, then export as a script.
          </p>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.78rem' }}>
            Exports are reference commands, not a runnable chain: adjust file names between steps.
          </p>
        </div>
        <button onClick={() => setShowExport(true)} className="btn btn-primary">
          Export Script
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
        {/* Builder */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <p className="section-label" style={{ marginTop: 0, marginBottom: '1rem' }}>Select tools (click again to remove)</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {STEPS.map((step) => {
              const stepStations = STATIONS.filter((s) => s.stepId === step.id);
              if (stepStations.length === 0) return null;
              return (
                <div key={step.id} style={{ flex: '1 1 120px', minWidth: '120px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {step.label}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {stepStations.map((s) => {
                      const isActive = userStops.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleStation(s.id)}
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
                <span className="legend-dot" style={{ background: line.color }} />
                {line.shortName}
              </div>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', alignSelf: 'center' }}>
              Reference pipelines are faded to highlight your custom path.
            </span>
          </div>
          <div style={{ height: 'clamp(380px, 60vh, 640px)' }}>
            <TubeMap activeLines={activeLines} highlightedLineId="l_custom" onStationClick={handleStationClick} />
          </div>
        </div>
      </div>

      {/* Tool modal */}
      {selectedStation && (
        <div className="modal-backdrop" onClick={() => setSelectedStation(null)}>
          <div className="card" style={{ maxWidth: '480px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
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
          <div className="card" style={{ maxWidth: '720px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Generated Pipeline Script</h2>
              <button onClick={() => setShowExport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <pre style={{
              background: '#0f172a', color: '#e2e8f0', padding: '1.25rem',
              borderRadius: 'var(--radius-md)', overflow: 'auto', flex: '1 1 auto', minHeight: 0, margin: 0, fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)', lineHeight: 1.6
            }}>
              <code>{script}</code>
            </pre>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', width: '100%' }}>
              <div style={{ flex: 1 }}>
                <CopyButton text={script} />
              </div>
              <button onClick={() => download(script, 'custom_pipeline.sh')} className="btn btn-primary" style={{ flex: 1 }}>
                Download .sh
              </button>
              <button onClick={() => download(envYml, 'environment.yml')} className="btn btn-primary" style={{ flex: 1 }}>
                Download environment.yml
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
