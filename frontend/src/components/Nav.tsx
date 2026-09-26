import type { AppView } from "../lib/data";

const LINKS: { id: AppView; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "swap", label: "Swap" },
  { id: "pools", label: "Pools" },
  { id: "liquidity", label: "Liquidity" },
  { id: "positions", label: "Positions" },
];

interface NavProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
  connected: boolean;
  address: string | null;
  onConnect: () => void;
  mobile?: boolean;
}

export function BrandGlyph() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="10" y="38" width="7" height="16" rx="2" fill="#FF4D1A" />
      <rect x="22" y="26" width="7" height="28" rx="2" fill="#FF7A45" />
      <rect x="34" y="14" width="7" height="40" rx="2" fill="#18C5B5" />
      <rect x="46" y="22" width="7" height="32" rx="2" fill="#7EE8DC" />
    </svg>
  );
}

export function Nav({
  view,
  onNavigate,
  connected,
  address,
  onConnect,
  mobile = false,
}: NavProps) {
  const links = LINKS.map((link) => (
    <button
      key={link.id}
      type="button"
      className={`nav-link${view === link.id ? " active" : ""}`}
      onClick={() => onNavigate(link.id)}
    >
      {link.label}
    </button>
  ));

  if (mobile) {
    return <nav className="mobile-bar">{links}</nav>;
  }

  return (
    <header className="topbar">
      <button type="button" className="brand-link" onClick={() => onNavigate("home")}>
        <span className="brand-glyph">
          <BrandGlyph />
        </span>
        Liquidity Book
      </button>

      <nav className="nav-links">{links}</nav>

      <button
        type="button"
        className={`wallet${connected ? " live" : ""}`}
        onClick={onConnect}
      >
        {connected && address
          ? `${address.slice(0, 6)}…${address.slice(-4)}`
          : "Connect"}
      </button>
    </header>
  );
}
