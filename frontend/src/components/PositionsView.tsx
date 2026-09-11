import { POSITIONS, formatNum, formatUsd } from "../lib/data";

interface PositionsProps {
  connected: boolean;
  onConnect: () => void;
}

export function PositionsView({ connected, onConnect }: PositionsProps) {
  const total = POSITIONS.reduce((s, p) => s + p.value, 0);
  const fees = POSITIONS.reduce((s, p) => s + p.fees, 0);

  return (
    <div className="page">
      <div className="page-header animate-rise">
        <div>
          <h2>Positions</h2>
          <p>Your Liquidity Book ranges and unclaimed fees.</p>
        </div>
        {!connected ? (
          <button type="button" className="btn-primary" onClick={onConnect}>
            Connect wallet
          </button>
        ) : null}
      </div>

      <div className="stat-strip animate-rise animate-rise-delay-1">
        <div className="panel panel-pad stat">
          <span>Portfolio value</span>
          <strong>{connected ? formatUsd(total) : "—"}</strong>
        </div>
        <div className="panel panel-pad stat">
          <span>Unclaimed fees</span>
          <strong>{connected ? formatUsd(fees) : "—"}</strong>
        </div>
        <div className="panel panel-pad stat">
          <span>Open positions</span>
          <strong>{connected ? POSITIONS.length : 0}</strong>
        </div>
      </div>

      {!connected ? (
        <div className="panel panel-pad animate-rise animate-rise-delay-2" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", margin: "0.5rem 0 1rem" }}>
            Connect a wallet to load demo positions backed by Joe V2 LBPair shares.
          </p>
          <button type="button" className="btn-primary" onClick={onConnect}>
            Connect wallet
          </button>
        </div>
      ) : (
        <div className="panel grid-pools animate-rise animate-rise-delay-2">
          {POSITIONS.map((pos) => (
            <div key={pos.id} className="pool-row" style={{ gridTemplateColumns: "1.3fr 0.9fr 0.9fr 0.8fr auto" }}>
              <div className="pool-pair">
                <div>
                  {pos.tokenX}/{pos.tokenY}
                  <div style={{ marginTop: 6 }}>
                    <span className={`chip ${pos.inRange ? "in-range" : "out-range"}`}>
                      {pos.inRange ? "In range" : "Out of range"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pool-metric">
                <small>Value</small>
                {formatUsd(pos.value)}
              </div>
              <div className="pool-metric hide-sm">
                <small>Range</small>
                ${formatNum(pos.minPrice, 4)} – ${formatNum(pos.maxPrice, 4)}
              </div>
              <div className="pool-metric">
                <small>Fees</small>
                {formatUsd(pos.fees)}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="btn-sm">
                  Claim
                </button>
                <button type="button" className="btn-sm accent">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
