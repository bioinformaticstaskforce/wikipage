import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, AlertTriangle, X } from 'lucide-react';
import GlossaryText from '../components/GlossaryText';
import Badge from '../components/Badge';
import CompareTable from '../components/CompareTable';
import TubeMap from '../components/TubeMap';
import { LINES, SITE_TAGLINE } from '../data';

const COLOR_MAP: Record<string, string> = {
  'var(--line-sarek)': '#059669',
  'var(--line-gatk)': '#2563eb',
  'var(--line-onco)': '#dc2626',
};

export default function Home() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [variantType, setVariantType] = useState<string>('');
  const [material, setMaterial] = useState<string>('');
  const [showMapModal, setShowMapModal] = useState(false);

  const handleRestart = () => {
    setStep(1);
    setVariantType('');
    setMaterial('');
  };

  const getRecommendation = () => {
    if (variantType === 'somatic') return 'l_sarek';
    if (variantType === 'germline') return 'l_gatk';
    if (variantType === 'comprehensive') return 'l_onco';
    return '';
  };

  const recommendation = getRecommendation();

  useEffect(() => {
    if (showMapModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showMapModal]);

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--brand-glow)', padding: '0.35rem 1rem', borderRadius: '2rem',
          fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '1.5rem'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)' }} />
          Task Force Computazionale Bioinfo
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          Standardized workflows for<br />
          <span style={{ backgroundImage: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DNA Mutational Analysis
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          {SITE_TAGLINE}. We visualize established workflows like <strong style={{ color: 'var(--text-primary)' }}>GATK Best Practices</strong>,{' '}
          <strong style={{ color: 'var(--text-primary)' }}>Sarek</strong>, and{' '}
          <strong style={{ color: 'var(--text-primary)' }}>OncoAnalyzer</strong> — highlighting consensus tools on the path from raw FASTQ to annotated variants.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/map" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}>
            Open Pipeline Map →
          </Link>
          <Link to="/guides" className="btn btn-outline" style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}>
            Browse Guidelines
          </Link>
        </div>
      </section>

      {/* Start Here Selector */}
      <section style={{ maxWidth: '800px', margin: '0 auto 5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2.5rem', background: 'var(--bg-tertiary)', position: 'relative', minHeight: '350px' }}>
          
          {step > 1 && (
            <button 
              onClick={handleRestart}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Start Over
            </button>
          )}

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem' }}>Find your pipeline</h2>
          
          {/* Step Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= 1 ? 'var(--brand-primary)' : 'var(--border-color)' }} />
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= 2 ? 'var(--brand-primary)' : 'var(--border-color)' }} />
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= 3 ? 'var(--brand-primary)' : 'var(--border-color)' }} />
          </div>

          {/* Step 1: Variant Type */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Step 1: What type of variants are you analyzing?</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { id: 'somatic', label: 'Somatic', desc: 'Tumor / Normal pairs or Tumor-only' },
                  { id: 'germline', label: 'Germline', desc: 'Inherited variants / Rare diseases' },
                  { id: 'comprehensive', label: 'Comprehensive', desc: 'DNA + RNA Profiling (Oncology)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setVariantType(opt.id); setStep(2); }}
                    style={{
                      padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left',
                      border: '2px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                      cursor: 'pointer', transition: 'all 0.2s ease', flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{opt.label}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Material */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Step 2: What is the primary starting material?</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { id: 'fresh', label: 'Fresh Frozen / Blood', desc: 'High quality intact DNA' },
                  { id: 'ffpe', label: 'FFPE Tissue', desc: 'Formalin-fixed paraffin-embedded' },
                  { id: 'cfdna', label: 'Liquid Biopsy', desc: 'cfDNA / ctDNA (Requires UMIs)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setMaterial(opt.id); setStep(3); }}
                    style={{
                      padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left',
                      border: '2px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                      cursor: 'pointer', transition: 'all 0.2s ease', flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{opt.label}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && recommendation && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem' }}>Recommended Workflow:</p>
              
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                  <span className="legend-dot" style={{ background: COLOR_MAP[LINES.find(l => l.id === recommendation)?.color || ''] }} />
                  <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>{LINES.find(l => l.id === recommendation)?.name}</span>
                </div>

                {material === 'ffpe' && (
                  <div style={{ maxWidth: '500px', marginTop: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <AlertTriangle color="#f59e0b" size={20} style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <strong>FFPE Artifacts:</strong> Formalin fixation causes C&gt;T deamination artifacts. Ensure you enable <code>--orientation_bias_artifact</code> filtering in Mutect2, or use specialized artifact filtration tools during preprocessing.
                    </div>
                  </div>
                )}

                {material === 'cfdna' && (
                  <div style={{ maxWidth: '500px', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <AlertTriangle color="#3b82f6" size={20} style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <strong>Liquid Biopsy:</strong> cfDNA requires ultra-deep sequencing to detect low VAFs. You must enable UMI deduplication (e.g., using fgbio) and tune the variant caller for extreme sensitivity (e.g., Mutect2 low-AF mode).
                    </div>
                  </div>
                )}

                <button onClick={() => setShowMapModal(true)} className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer' }}>
                  View Pipeline on Map <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Map Modal */}
      {showMapModal && recommendation && (
        <div className="modal-backdrop" onClick={() => setShowMapModal(false)}>
          <div className="card" style={{ width: '95%', height: '90%', padding: '1rem', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{LINES.find(l => l.id === recommendation)?.name} Pipeline</h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Interactive view of the suggested workflow</p>
              </div>
              <button onClick={() => setShowMapModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ flex: 1, position: 'relative', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <TubeMap 
                activeLines={LINES}
                highlightedLineId={recommendation} 
                onStationClick={(station) => navigate(`/map?tool=${station.toolId}&material=${material}`)}
              />
            </div>
            
            <div style={{ padding: '1rem', textAlign: 'right' }}>
              <Link to={`/map?tool=${LINES.find(l => l.id === recommendation)?.stops[0]}&material=${material}`} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center' }}>
                Open Full Map Experience
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Summary Cards */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Pipeline Profiles</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Clinical and analytical specifications for each workflow.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {LINES.map(line => (
            <div key={line.id} className="card" style={{ borderTop: `4px solid ${COLOR_MAP[line.color] || line.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{line.name}</h3>
                <Badge 
                    label={line.status.toUpperCase()} 
                    variant={line.status === 'stable' ? 'success' : line.status === 'review' ? 'warning' : 'info'} 
                  />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1.5rem', flex: 1 }}>
                {line.wiki?.theory ? line.wiki.theory.substring(0, 100) + '...' : ''}
              </p>
              
              {line.clinical && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Specimen', value: line.clinical.specimen },
                    { label: 'Min DNA Input', value: line.clinical.minDNA },
                    { label: 'Target Coverage', value: line.clinical.coverage },
                    { label: 'Limit of Detection', value: line.clinical.lod },
                    { label: 'Reportable Range', value: line.clinical.reportableRange },
                    { label: 'Turnaround Time', value: line.clinical.tat },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.label}</span>
                      <span style={{ fontWeight: 500, fontSize: '0.85rem', textAlign: 'right', maxWidth: '60%' }}>
                        <GlossaryText text={item.value} />
                      </span>
                    </div>
                  ))}
                  {line.clinical.accreditation && (
                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Note:</strong> <GlossaryText text={line.clinical.accreditation} />
                    </div>
                  )}
                  {line.wiki && (
                    <Link to={`/wiki/${line.id}`} className="btn btn-outline" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', borderColor: COLOR_MAP[line.color] || line.color, color: COLOR_MAP[line.color] || line.color }}>
                      View {line.shortName} Wiki ↗
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <CompareTable />
      </section>

      {/* Feature Cards */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>How to read the map</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Three core design concepts carry the whole system.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[
            {
              icon: '→',
              title: 'Pipeline Lines',
              desc: 'Each coloured path traces a validated, community-standard workflow from raw reads to annotated variants — like a subway route through analysis steps.'
            },
            {
              icon: '◉',
              title: 'Tool Stations',
              desc: 'Every node is a specific software tool. Click any station to see its description, pros/cons, quality criteria, and links to documentation.'
            },
            {
              icon: '⊕',
              title: 'Consensus Hubs',
              desc: 'Thick interchange rings mark tools where multiple pipelines converge — indicating broad community consensus on that methodology.'
            }
          ].map((item) => (
            <div key={item.title} className="card card-hover">
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--brand-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--brand-primary)'
              }}>
                {item.icon}
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, fontSize: '0.9rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy callout */}
      <section style={{
        maxWidth: '800px', margin: '0 auto 5rem',
        background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xl)', padding: '2.5rem',
        border: '1px solid var(--border-subtle)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 0, marginBottom: '0.75rem' }}>
          Our approach: shared recommendations, not rigid standards
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
          The Task Force provides flexible, evidence-based recommendations rather than mandatory pipelines.
          Each lab can adapt the workflows to their specific context, as long as quality, sensitivity, and
          specificity criteria are met. The map visualizes our recommended paths — not the only paths.
        </p>
      </section>
    </div>
  );
}
