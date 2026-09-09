import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { TOOLS, LINES, GLOSSARY } from '../data';

interface SearchResult {
  id: string;
  title: string;
  type: 'Tool' | 'Pipeline' | 'Concept';
  desc: string;
  url: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const newResults: SearchResult[] = [];

    // Search Tools
    Object.entries(TOOLS).forEach(([id, tool]) => {
      if (tool.name.toLowerCase().includes(q) || tool.simple.toLowerCase().includes(q)) {
        newResults.push({
          id,
          title: tool.name,
          type: 'Tool',
          desc: tool.simple.substring(0, 60) + '...',
          url: `/map?tool=${id}`
        });
      }
    });

    // Search Pipelines
    LINES.forEach(line => {
      if (line.name.toLowerCase().includes(q) || line.shortName.toLowerCase().includes(q)) {
        newResults.push({
          id: line.id,
          title: line.name,
          type: 'Pipeline',
          desc: line.wiki?.theory?.substring(0, 60) + '...' || '',
          url: `/wiki/${line.id}`
        });
      }
    });

    // Search Glossary (Concepts)
    GLOSSARY.forEach(term => {
      if (term.term.toLowerCase().includes(q) || term.definition.toLowerCase().includes(q)) {
        newResults.push({
          id: term.term,
          title: term.term,
          type: 'Concept',
          desc: term.definition.substring(0, 60) + '...',
          url: `/wiki#concept-${term.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        });
      }
    });

    setResults(newResults.slice(0, 6)); // limit to top 6 results
  }, [query]);

  const handleSelect = (url: string) => {
    navigate(url);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '240px', zIndex: 100 }}>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search tools, terms..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          style={{
            width: '100%', padding: '0.45rem 0.5rem 0.45rem 2.2rem',
            borderRadius: '1rem', border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)', color: 'var(--text-primary)',
            fontSize: '0.85rem', outline: 'none', transition: 'all 0.2s'
          }}
        />
      </div>

      {isOpen && query.trim() && (
        <div style={{
          position: 'absolute', top: '110%', left: 0, right: 0,
          background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden', zIndex: 101
        }}>
          {results.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {results.map(res => (
                <div
                  key={res.type + res.id}
                  onClick={() => handleSelect(res.url)}
                  style={{
                    padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer', transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{res.title}</strong>
                    <span style={{ fontSize: '0.65rem', color: 'var(--brand-primary)', fontWeight: 600, background: 'var(--brand-glow)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {res.type}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {res.desc}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
