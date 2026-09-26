import type { AppView } from "../lib/data";

interface LandingProps {
  onNavigate: (view: AppView) => void;
}

const BINS = [
  22, 28, 34, 40, 48, 58, 70, 82, 94, 100, 88, 76, 64, 52, 42, 36, 30, 38, 50,
  66, 84, 96, 90, 72, 56, 44, 32, 26, 34, 46, 62, 78, 92, 98, 86, 68, 54, 41,
  33, 27, 35, 47, 61, 75, 87, 80, 63, 49,
];

export function Landing({ onNavigate }: LandingProps) {
  return (
    <section className="hero">
      <div className="hero-plane" aria-hidden />
      <div className="hero-bins" aria-hidden>
        {BINS.map((h, i) => (
          <i
            key={i}
            className={i === 21 ? "hot" : undefined}
            style={{
              height: `${h}%`,
              animationDelay: `${(i % 12) * 0.18}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-content rise">
        <h1>
          Liquidity
          <em>Book</em>
        </h1>
        <p className="hero-lede rise rise-1">
          Discrete price bins. Concentrated capital. Fees where the market
          actually trades.
        </p>
        <div className="hero-actions rise rise-2">
          <button type="button" className="btn-ember" onClick={() => onNavigate("swap")}>
            Open swap
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => onNavigate("liquidity")}
          >
            Shape liquidity
          </button>
        </div>
      </div>

      <div className="hero-meta rise rise-3">
        <span>AVAX / USDC · active bin</span>
        <strong>$36.42</strong>
      </div>
    </section>
  );
}
