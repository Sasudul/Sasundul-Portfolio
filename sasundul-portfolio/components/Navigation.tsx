import { Sun, Moon } from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onNavigate: (section: string) => void;
}

export default function Navigation({ isOpen, onToggle, theme, onThemeToggle, onNavigate }: NavigationProps) {
  const navItems = [
    { label: 'Home', section: 'hero' },
    { label: 'What I Make', section: 'work' },
    { label: "Let's Talk", section: 'contact' },
  ];

  return (
    <div data-nav-open={isOpen ? 'true' : 'false'}>
      {/* Dark overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[998] bg-black/30 transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Panel background (scales from toggle position) */}
      <div className="nav__panel-bg" />

      {/* Panel content */}
      <div className="nav__panel">
        <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>Menu</p>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.section}>
              <button
                onClick={() => { onNavigate(item.section); onToggle(); }}
                className="flex items-center justify-between w-full group"
              >
                <span 
                  className="text-xl font-display font-semibold uppercase tracking-wide transition-opacity hover:opacity-60"
                  style={{ color: 'var(--text)' }}
                >
                  {item.label}
                </span>
                <span className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-25 transition-opacity" style={{ background: 'var(--text)' }} />
              </button>
            </li>
          ))}
          <li className="pt-2">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-full transition-colors"
              style={{ color: 'var(--text)' }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </li>
        </ul>
      </div>

      {/* Toggle button */}
      <button className="nav__toggle" onClick={onToggle} aria-label="Toggle menu">
        <span className="nav__toggle-bar" />
        <span className="nav__toggle-bar" />
      </button>
    </div>
  );
}
