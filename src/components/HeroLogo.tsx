/* Ring logo (same geometry as branding/): stations pop in on load, ring turns brand-gradient and spins on hover. */
export default function HeroLogo() {
  return (
    <svg className="hero-logo" viewBox="0 0 64 64" role="img" aria-label="MetrOmics">
      <defs>
        <linearGradient id="hl-grad" gradientUnits="userSpaceOnUse" x1="4" y1="32" x2="60" y2="32">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="none" stroke="#2563eb" strokeWidth="4" />
      <circle className="ring-grad" cx="32" cy="32" r="28" fill="none" stroke="url(#hl-grad)" strokeWidth="4" />
      <line className="link" style={{ '--d': '0.2s' } as React.CSSProperties} x1="21" y1="25" x2="43" y2="25" />
      <line className="link" style={{ '--d': '0.35s' } as React.CSSProperties} x1="43" y1="25" x2="32" y2="44" />
      <circle className="dot" style={{ '--d': '0.1s' } as React.CSSProperties} cx="21" cy="25" r="6" fill="#059669" />
      <circle className="dot" style={{ '--d': '0.25s' } as React.CSSProperties} cx="43" cy="25" r="6" fill="#2563eb" />
      <circle className="dot" style={{ '--d': '0.4s' } as React.CSSProperties} cx="32" cy="44" r="6" fill="#dc2626" />
    </svg>
  );
}
