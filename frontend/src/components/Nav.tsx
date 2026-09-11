import type { AppView } from "../lib/data";

const TABS: { id: AppView; label: string }[] = [
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

export function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="12" y="36" width="6" height="16" rx="2" fill="#FF5A1F" />
      <rect x="22" y="28" width="6" height="24" rx="2" fill="#FF8A4C" />
      <rect x="32" y="18" width="6" height="34" rx="2" fill="#1FA7A0" />
      <rect x="42" y="24" width="6" height="28" rx="2" fill="#7ED4CE" />
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
  const tabs = (
    <>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-tab${view === tab.id ? " active" : ""}`}
          onClick={() => onNavigate(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </>
  );

  if (mobile) {
    return <nav className="mobile-nav">{tabs}</nav>;
  }

  return (
    <header className="top-nav">
      <button type="button" className="brand" onClick={() => onNavigate("home")}>
        <span className="brand-mark">
          <BrandMark />
        </span>
        Liquidity Book
      </button>

      <nav className="nav-tabs">{tabs}</nav>

      <button
        type="button"
        className={`wallet-btn${connected ? " connected" : ""}`}
        onClick={onConnect}
      >
        {connected && address
          ? `${address.slice(0, 6)}…${address.slice(-4)}`
          : "Connect wallet"}
      </button>
    </header>
  );
}
