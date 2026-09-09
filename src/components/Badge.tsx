interface Props {
  label: string;
  variant?: 'success' | 'warning' | 'info' | 'default';
}

export default function Badge({ label, variant = 'default' }: Props) {
  let bgColor = 'var(--bg-tertiary)';
  let textColor = 'var(--text-secondary)';
  let borderColor = 'var(--border-color)';

  if (variant === 'success') {
    bgColor = 'rgba(5, 150, 105, 0.1)';
    textColor = '#059669';
    borderColor = 'rgba(5, 150, 105, 0.2)';
  } else if (variant === 'warning') {
    bgColor = 'rgba(217, 119, 6, 0.1)';
    textColor = '#d97706';
    borderColor = 'rgba(217, 119, 6, 0.2)';
  } else if (variant === 'info') {
    bgColor = 'rgba(37, 99, 235, 0.1)';
    textColor = '#2563eb';
    borderColor = 'rgba(37, 99, 235, 0.2)';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.15rem 0.5rem',
      borderRadius: '1rem',
      fontSize: '0.7rem',
      fontWeight: 600,
      background: bgColor,
      color: textColor,
      border: `1px solid ${borderColor}`,
      whiteSpace: 'nowrap'
    }}>
      {label}
    </span>
  );
}
