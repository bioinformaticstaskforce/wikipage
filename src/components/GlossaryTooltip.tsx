import { useState, useRef } from 'react';
import { GLOSSARY } from '../data';

interface Props {
  term: string;
  children: React.ReactNode;
}

export default function GlossaryTooltip({ term, children }: Props) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<number | null>(null);

  const entry = GLOSSARY.find(g => g.term.toLowerCase() === term.toLowerCase());

  if (!entry) return <>{children}</>;

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShow(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = window.setTimeout(() => setShow(false), 200);
  };

  return (
    <span 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        borderBottom: '1px dashed var(--text-muted)',
        cursor: 'help'
      }}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          width: 'max-content',
          maxWidth: '250px',
          padding: '0.75rem',
          background: 'var(--text-primary)',
          color: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.8rem',
          lineHeight: '1.4',
          zIndex: 100,
          pointerEvents: 'none',
          animation: 'fadeIn 0.2s ease',
          textAlign: 'left'
        }}>
          <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--brand-primary)' }}>
            {entry.term}
          </strong>
          {entry.definition}
          {/* Tooltip triangle */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: 'var(--text-primary) transparent transparent transparent'
          }} />
        </div>
      )}
    </span>
  );
}
