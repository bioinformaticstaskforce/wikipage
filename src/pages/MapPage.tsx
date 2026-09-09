import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import TubeMap from '../components/TubeMap';
import GlossaryText from '../components/GlossaryText';
import CopyButton from '../components/CopyButton';
import { TOOLS, LINES, STEPS, STATIONS } from '../data';
import type { Station, VariantType } from '../data';

const COLOR_MAP: Record<string, string> = {
  'var(--line-sarek)': '#059669',
  'var(--line-gatk)': '#2563eb',
  'var(--line-onco)': '#dc2626',
};

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const materialParam = searchParams.get('material');
  const [selectedStation, setSelectedStation] = useState<{ station: Station; lineIds: string[] } | null>(null);
  const [activeVariantFilter, setActiveVariantFilter] = useState<VariantType | 'All'>('All');
  const [highlightedLineId, setHighlightedLineId] = useState<string | null>(null);

  // Recommender State
  const [recommenderGoal, setRecommenderGoal] = useState<string>('');
  const [recommenderMaterial, setRecommenderMaterial] = useState<string>(materialParam || '');

  // Auto-highlight based on recommender goal
  useEffect(() => {
    if (recommenderGoal === 'somatic') setHighlightedLineId('l_sarek');
    else if (recommenderGoal === 'germline') setHighlightedLineId('l_gatk');
    else if (recommenderGoal === 'comprehensive') setHighlightedLineId('l_onco');
  }, [recommenderGoal]);

  // Auto-select tool if URL parameter exists
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    if (toolParam) {
      // Find a station that uses this tool
      const targetStation = STATIONS.find(s => s.toolId === toolParam);
      if (targetStation) {
        // Find lines that stop at this station
        const lineIds = LINES.filter(l => l.stops.includes(targetStation.id)).map(l => l.id);
        setSelectedStation({ station: targetStation, lineIds });
      }
    }
  }, [searchParams]);

  const handleStationClick = (station: Station, lineIds: string[]) => {
    setSelectedStation({ station, lineIds });
  };

  const selectedTool = selectedStation ? TOOLS[selectedStation.station.toolId] : null;
  const selectedStep = selectedStation ? STEPS.find((s) => s.id === selectedStation.station.stepId) : null;
  
  const filteredLines = activeVariantFilter === 'All' 
    ? LINES 
    : LINES.filter(line => line.supportedVariants.includes(activeVariantFilter));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', boxSizing: 'border-box' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', flexShrink: 0, flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
            Interactive Pipeline Map
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            Click any station to view tool details.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          
          {/* Recommender Dropdowns */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--brand-primary)', boxShadow: '0 0 0 1px rgba(var(--brand-primary-rgb), 0.2)' }}>
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
          </div>

          {/* Variant Filter */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {(['All', 'SNV', 'Indel', 'CNV', 'SV', 'RNA Fusion'] as const).map(v => (
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
            {LINES.map((line) => {
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
                  <span className="legend-dot" style={{ background: COLOR_MAP[line.color] || line.color }} />
                  {line.shortName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Split layout */}
      {/* Material Context Warnings */}
      {recommenderMaterial === 'ffpe' && (
        <div style={{ marginBottom: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <AlertTriangle color="#f59e0b" size={20} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            <strong>FFPE Context:</strong> You selected an FFPE context. Remember that formalin fixation causes C&gt;T deamination. Ensure you enable orientation-bias filtering in tools like Mutect2.
          </div>
        </div>
      )}

      {recommenderMaterial === 'cfdna' && (
        <div style={{ marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <AlertTriangle color="#3b82f6" size={20} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            <strong>Liquid Biopsy Context:</strong> You selected a cfDNA context. cfDNA requires ultra-deep sequencing and mandatory UMI deduplication.
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
                    <span key={id} className="tag" style={{ background: COLOR_MAP[line.color] || line.color }}>
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
