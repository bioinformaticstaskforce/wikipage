import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import TubeMap from '../components/TubeMap';
import GlossaryText from '../components/GlossaryText';
import CopyButton from '../components/CopyButton';
import { TOOLS, LINES, STEPS, STATIONS, stepsFor, linesFor, recommendLine } from '../data';
import type { OmicsCategory, Station, VariantType } from '../data';

const VARIANT_FILTERS: Record<string, (VariantType | 'All')[]> = {
  DNA: ['All', 'SNV', 'Indel', 'CNV', 'SV'],
  RNA: ['All', 'Expression', 'RNA Fusion'],
};

const omicsOfStation = (st?: Station) => STEPS.find((s) => s.id === st?.stepId)?.omics;

function getFormatBadgeClass(format: string): string {
  const f = format.toLowerCase();
  if (f.includes('fastq')) return 'file-pill file-pill-fastq';
  if (f.includes('bam') || f.includes('cram') || f.includes('bai')) return 'file-pill file-pill-bam';
  if (f.includes('vcf')) return 'file-pill file-pill-vcf';
  if (f.includes('table') || f.includes('tsv') || f.includes('txt') || f.includes('json')) return 'file-pill file-pill-table';
  if (f.includes('html')) return 'file-pill file-pill-html';
  return 'file-pill file-pill-dir';
}

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const materialParam = searchParams.get('material');
  const toolStation = STATIONS.find((s) => s.toolId === searchParams.get('tool'));
  const lineParam = LINES.find((l) => l.id === searchParams.get('line'));
  const omics: OmicsCategory = (searchParams.get('omics') as OmicsCategory | null)
    ?? lineParam?.omicsCategory ?? omicsOfStation(toolStation) ?? 'DNA';
  const omicsLines = linesFor(omics);
  const [selectedStation, setSelectedStation] = useState<{ station: Station; lineIds: string[] } | null>(null);
  const [activeVariantFilter, setActiveVariantFilter] = useState<VariantType | 'All'>('All');
  const [technologyFilter, setTechnologyFilter] = useState<string>('All');
  const [highlightedLineId, setHighlightedLineId] = useState<string | null>(lineParam?.id ?? null);

  // Recommender State
  const [recommenderGoal, setRecommenderGoal] = useState<string>('');
  const [recommenderMaterial, setRecommenderMaterial] = useState<string>(materialParam || '');

  // Auto-highlight based on recommender goal
  useEffect(() => {
    const rec = recommendLine(recommenderGoal, recommenderMaterial);
    if (rec) setHighlightedLineId(rec);
  }, [recommenderGoal, recommenderMaterial]);

  // Auto-select tool if URL parameter exists
  useEffect(() => {
    if (toolStation) {
      const lineIds = LINES.filter(l => l.stops.includes(toolStation.id)).map(l => l.id);
      setSelectedStation({ station: toolStation, lineIds });
    }
  }, [toolStation]);

  const switchOmics = (o: OmicsCategory) => {
    setSearchParams({ omics: o });
    setSelectedStation(null);
    setHighlightedLineId(null);
    setActiveVariantFilter('All');
  };

  const handleStationClick = (station: Station, lineIds: string[]) => {
    setSelectedStation({ station, lineIds });
  };

  const selectedTool = selectedStation ? TOOLS[selectedStation.station.toolId] : null;
  const selectedStep = selectedStation ? STEPS.find((s) => s.id === selectedStation.station.stepId) : null;
  
  const filteredLines = omicsLines.filter(line => {
    const matchesVariant = activeVariantFilter === 'All' || line.supportedVariants.includes(activeVariantFilter);
    const matchesTech = technologyFilter === 'All' || line.technology === technologyFilter;
    return matchesVariant && matchesTech;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', boxSizing: 'border-box' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', flexShrink: 0, flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            {(['DNA', 'RNA'] as const).map(o => (
              <button key={o} onClick={() => switchOmics(o)} className={omics === o ? 'omics-badge-active' : 'omics-badge-roadmap'} style={{ cursor: 'pointer', border: 'none' }}>
                {o === 'DNA' ? '🧬 DNA / Genomics' : '📝 RNA / Transcriptomics'}
              </button>
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Illumina Short-Read Consensus</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            Interactive Pipeline Map
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            Click any station to view tool rationale, I/O file flow, and parameter recommendations.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          
          {/* Recommender & Platform Dropdowns */}
          {omics === 'DNA' && <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--brand-primary)', boxShadow: '0 0 0 1px rgba(var(--brand-primary-rgb), 0.2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', alignSelf: 'center', marginLeft: '0.25rem' }}>Suggest:</span>
            <select 
              value={recommenderGoal} 
              onChange={(e) => setRecommenderGoal(e.target.value)}
              style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
            >
              <option value="">-- Analysis Goal --</option>
              <option value="somatic">Somatic (Tumor/Normal)</option>
              <option value="germline">Germline (Inherited)</option>
              <option value="comprehensive">Comprehensive (Oncology)</option>
            </select>
            
            <select 
              value={recommenderMaterial} 
              onChange={(e) => setRecommenderMaterial(e.target.value)}
              style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
            >
              <option value="">-- Material --</option>
              <option value="fresh">Fresh Frozen / Blood</option>
              <option value="ffpe">FFPE Tissue</option>
              <option value="cfdna">Liquid Biopsy (cfDNA)</option>
            </select>

            <select 
              value={technologyFilter} 
              onChange={(e) => setTechnologyFilter(e.target.value)}
              style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
              title="Filter by sequencing technology / platform"
            >
              <option value="All">Platform: All</option>
              <option value="Illumina">Illumina (Short-Read)</option>
              <option value="Nanopore" disabled>Nanopore (Roadmap)</option>
              <option value="PacBio" disabled>PacBio HiFi (Roadmap)</option>
            </select>
          </div>}

          {/* Variant Filter */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {VARIANT_FILTERS[omics].map(v => (
              <button
                key={v}
                onClick={() => setActiveVariantFilter(v)}
                style={{
                  background: activeVariantFilter === v ? 'var(--bg-tertiary)' : 'transparent',
                  color: activeVariantFilter === v ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="legend" style={{ marginBottom: 0, gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '0.5rem', alignSelf: 'center' }}>Legend:</span>
            {omicsLines.map((line) => {
              const isFilteredOut = activeVariantFilter !== 'All' && !line.supportedVariants.includes(activeVariantFilter as VariantType);
              const isActive = highlightedLineId === line.id;
              
              return (
                <button 
                  key={line.id} 
                  className="legend-item" 
                  onClick={() => setHighlightedLineId(isActive ? null : line.id)}
                  style={{ 
                    opacity: isFilteredOut ? 0.3 : (highlightedLineId && !isActive) ? 0.4 : 1, 
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                    background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                    border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                  }}
                >
                  <span className="legend-dot" style={{ background: line.color }} />
                  {line.shortName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Split layout */}
      {/* Material Context Warnings */}
      {omics === 'DNA' && recommenderMaterial === 'ffpe' && (
        <div style={{ marginBottom: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <AlertTriangle color="#f59e0b" size={20} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            <strong>FFPE Context:</strong> You selected an FFPE context. Remember that formalin fixation causes C&gt;T deamination. Ensure you enable orientation-bias filtering in tools like Mutect2.
          </div>
        </div>
      )}

      {omics === 'DNA' && recommenderMaterial === 'cfdna' && (
        <div style={{ marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <AlertTriangle color="#3b82f6" size={20} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            <strong>Liquid Biopsy Context:</strong> You selected a cfDNA context. cfDNA requires ultra-deep sequencing and mandatory UMI consensus calling — see the Sarek UMI line (fgbio).
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', gap: selectedStation ? '1.5rem' : '0', transition: 'gap 0.3s ease' }}>
        {/* Map Container */}
        <div style={{ 
          flex: selectedStation ? '0 0 calc(75% - 0.75rem)' : '1', 
          transition: 'flex 0.3s ease',
          height: '100%',
          overflow: 'hidden',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <TubeMap 
            key={omics}
            steps={stepsFor(omics)}
            onStationClick={handleStationClick} 
            activeLines={filteredLines} 
            highlightedLineId={highlightedLineId} 
          />
        </div>

        {/* Sidebar Container */}
        <div style={{ 
          flex: selectedStation ? '0 0 calc(25% - 0.75rem)' : '0 0 0px',
          opacity: selectedStation ? 1 : 0,
          transition: 'flex 0.3s ease, opacity 0.3s ease',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {selectedTool && selectedStep && (
            <div className="card" style={{ height: '100%', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '1.5rem' }}>
              {/* Step badge */}
              <p className="section-label" style={{ marginTop: 0 }}>{selectedStep.label}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
                  {selectedTool.name}
                </h2>
                <button
                  onClick={() => setSelectedStation(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>

              {/* Pipeline tags */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {selectedStation!.lineIds.map((id) => {
                  const line = LINES.find((l) => l.id === id);
                  if (!line) return null;
                  return (
                    <span key={id} className="tag" style={{ background: line.color }}>
                      {line.shortName}
                    </span>
                  );
                })}
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.65, margin: '0 0 1.25rem', fontSize: '0.9rem' }}>
                <GlossaryText text={selectedTool.simple} />
              </p>

              {/* Technical */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p className="section-label">Technical Note</p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  <GlossaryText text={selectedTool.technical} />
                </p>
              </div>

              {/* Data Flow (Input & Output Files) */}
              {((selectedTool.inputFiles && selectedTool.inputFiles.length > 0) || 
                (selectedTool.outputFiles && selectedTool.outputFiles.length > 0)) && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <p className="section-label" style={{ margin: 0 }}>Data Flow & File I/O</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Input → Output</span>
                  </div>

                  <div className="file-io-box">
                    {/* Input Files */}
                    {selectedTool.inputFiles && selectedTool.inputFiles.length > 0 && (
                      <div style={{ marginBottom: selectedTool.outputFiles?.length ? '0.75rem' : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.35rem' }}>
                          <span>📥 Input Files</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {selectedTool.inputFiles.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{f.description}</span>
                              </div>
                              <span className={getFormatBadgeClass(f.format)} style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
                                {f.format}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Output Files */}
                    {selectedTool.outputFiles && selectedTool.outputFiles.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginBottom: '0.35rem' }}>
                          <span>📤 Output Files</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {selectedTool.outputFiles.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{f.description}</span>
                              </div>
                              <span className={getFormatBadgeClass(f.format)} style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
                                {f.format}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommended Parameters */}
              {selectedTool.params && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.25rem' }}>
                    <p className="section-label" style={{ margin: 0 }}>Recommended Parameters</p>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <CopyButton text={selectedTool.params} />
                      <button 
                        onClick={() => {
                          const blob = new Blob([selectedTool.params!], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedStation?.station.toolId}_params.sh`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        Export .sh
                      </button>
                    </div>
                  </div>
                  <pre style={{
                    background: '#0f172a', color: '#e2e8f0', padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)', overflowX: 'auto', fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)', lineHeight: 1.5, margin: 0
                  }}>
                    <code>{selectedTool.params}</code>
                  </pre>
                </div>
              )}

              {/* Pros & Cons side by side */}
              {(selectedTool.pros.length > 0 || selectedTool.cons.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {selectedTool.pros.length > 0 && (
                    <div>
                      <p className="section-label" style={{ color: '#059669' }}>Strengths</p>
                      <ul className="pros-list">
                        {selectedTool.pros.map((p, i) => (
                          <li key={i}><GlossaryText text={p} /></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedTool.cons.length > 0 && (
                    <div>
                      <p className="section-label" style={{ color: '#dc2626' }}>Limitations</p>
                      <ul className="cons-list">
                        {selectedTool.cons.map((c, i) => (
                          <li key={i}><GlossaryText text={c} /></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Quality Criteria */}
              {selectedTool.criteria && (
                <div style={{
                  padding: '0.85rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--brand-primary)', marginBottom: '1.25rem'
                }}>
                  <p className="section-label">Quality Criteria</p>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    <GlossaryText text={selectedTool.criteria} />
                  </p>
                </div>
              )}

              {/* Links */}
              {selectedTool.links.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedTool.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{ justifyContent: 'center', fontSize: '0.8rem' }}
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
