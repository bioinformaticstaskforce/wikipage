import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/map', label: 'Interactive Map' },
    { path: '/sandbox', label: 'Sandbox' },
    { path: '/guides', label: 'Clinical Guides' },
    { path: '/wiki', label: 'Wiki Hub' },
    { path: '/forum', label: 'Discussions' }
  ];

  const isMapRoute = location.pathname === '/map' || location.pathname === '/sandbox';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      height: isMapRoute ? '100vh' : 'auto', 
      width: '100vw', 
      overflow: isMapRoute ? 'hidden' : 'auto' 
    }}>
      <header className="header" style={{ flexShrink: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <svg viewBox="0 0 28 28" style={{ width: '28px', height: '28px' }}>
            <circle cx="14" cy="14" r="12" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx="9" cy="11" r="3" fill="#059669" />
            <circle cx="18" cy="11" r="3" fill="#2563eb" />
            <circle cx="14" cy="19" r="3" fill="#dc2626" />
            <line x1="9" y1="11" x2="18" y2="11" stroke="#334155" strokeWidth="1.5" />
            <line x1="18" y1="11" x2="14" y2="19" stroke="#334155" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>MutaMetro</span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SearchBar />
          <nav className="nav-links">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          
          <button 
            onClick={() => {
              const newIsDark = !isDark;
              setIsDark(newIsDark);
              if (newIsDark) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
              } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
              }
            }}
            style={{ 
              background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer',
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-primary)', transition: 'all 0.2s'
            }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-nav" style={{
          position: 'absolute', top: '64px', left: 0, right: 0, bottom: 0,
          background: 'var(--bg-primary)', zIndex: 40, padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          <SearchBar />
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                style={{ padding: '0.75rem', fontSize: '1.1rem', background: location.pathname === link.path ? 'var(--brand-glow)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main style={{ flex: 1, padding: isMapRoute ? '0' : '1.5rem 2rem 2rem', overflow: isMapRoute ? 'hidden' : 'visible', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: isMapRoute ? 'none' : '1600px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </main>

      {!isMapRoute && (
        <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
          <p style={{ margin: 0 }}>MutaMetro — Working Draft · Task Force Computazionale Bioinfo · September 2025</p>
        </footer>
      )}
    </div>
  );
}
