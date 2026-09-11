import type { AppView } from "../lib/data";

interface LandingProps {
  onNavigate: (view: AppView) => void;
}

const HEIGHTS = [28, 36, 44, 52, 68, 78, 92, 100, 86, 74, 60, 48, 40, 34, 30, 38, 50, 66, 84, 96, 88, 70, 55, 42, 33, 29, 37, 49, 63, 80, 94, 90, 72, 58, 46, 35];

export function Landing({ onNavigate }: LandingProps) {
  return (
    <section className="landing">
      <div className="landing-copy animate-rise">
        <h1>
          Liquidity
          <span>Book</span>
        </h1>
        <p className="animate-rise animate-rise-delay-1">
          Trade and provide liquidity across discrete price bins — tighter
          capital, clearer ranges, and fees that follow where the market
          actually trades.
        </p>
        <div className="cta-row animate-rise animate-rise-delay-2">
          <button type="button" className="btn-primary" onClick={() => onNavigate("swap")}>
            Start swapping
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => onNavigate("liquidity")}
          >
            Add liquidity
          </button>
        </div>
      </div>

      <div className="hero-visual animate-rise animate-rise-delay-1" aria-hidden>
        <div className="hero-caption">Active bin distribution</div>
        <div className="bin-skyline">
          {HEIGHTS.map((h, i) => (
            <span
              key={i}
              className={i === 19 ? "active" : undefined}
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.025}s`,
              }}
            />
          ))}
        </div>
        <div className="hero-price">
          <small>AVAX / USDC · bin 8,388,608</small>
          $36.42
        </div>
      </div>
    </section>
  );
}
