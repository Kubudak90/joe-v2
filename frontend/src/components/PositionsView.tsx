import { POSITIONS, formatNum, formatUsd } from "../lib/data";

interface PositionsProps {
  connected: boolean;
  onConnect: () => void;
}

export function PositionsView({ connected, onConnect }: PositionsProps) {
  const total = POSITIONS.reduce((s, p) => s + p.value, 0);
  const fees = POSITIONS.reduce((s, p) => s + p.fees, 0);

  return (
    <div className="stage">
      <div className="stage-head rise">
        <h2>Positions</h2>
        <p>Your Liquidity Book ranges and unclaimed fees.</p>
      </div>

      <div className="metrics rise rise-1">
        <div className="metric">
          <span>Portfolio</span>
          <strong>{connected ? formatUsd(total) : "—"}</strong>
        </div>
        <div className="metric">
          <span>Unclaimed fees</span>
          <strong>{connected ? formatUsd(fees) : "—"}</strong>
        </div>
        <div className="metric">
          <span>Open</span>
          <strong>{connected ? POSITIONS.length : 0}</strong>
        </div>
      </div>

      {!connected ? (
        <div className="empty surface rise rise-2">
          <p>Connect a wallet to load demo LBPair positions.</p>
          <button type="button" className="btn-ember" onClick={onConnect}>
            Connect wallet
          </button>
        </div>
      ) : (
        <div className="list rise rise-2">
          {POSITIONS.map((pos) => (
            <div
              key={pos.id}
              className="list-row"
              style={{ gridTemplateColumns: "1.4fr 0.9fr 1fr 0.8fr auto" }}
            >
              <div className="pair">
                <div>
                  {pos.tokenX}/{pos.tokenY}
                  <div style={{ marginTop: 6 }}>
                    <span className={`status ${pos.inRange ? "on" : "off"}`}>
                      {pos.inRange ? "In range" : "Out of range"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cell">
                <em>Value</em>
                {formatUsd(pos.value)}
              </div>
              <div className="cell hide-sm">
                <em>Range</em>
                ${formatNum(pos.minPrice, 4)} – ${formatNum(pos.maxPrice, 4)}
              </div>
              <div className="cell">
                <em>Fees</em>
                {formatUsd(pos.fees)}
              </div>
              <div className="row-actions">
                <button type="button" className="btn-line">
                  Claim
                </button>
                <button type="button" className="btn-fill">
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
