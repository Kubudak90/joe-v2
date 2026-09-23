import { POOLS, TOKENS, formatUsd, type AppView, type Pool } from "../lib/data";

interface PoolsProps {
  onProvide: (poolId: string) => void;
  onNavigate: (view: AppView) => void;
}

export function PoolsView({ onProvide }: PoolsProps) {
  return (
    <div className="stage">
      <div className="stage-head rise">
        <h2>Pools</h2>
        <p>Liquidity Book pairs with discrete bin pricing.</p>
      </div>

      <div className="metrics rise rise-1">
        <div className="metric">
          <span>Total value locked</span>
          <strong>{formatUsd(POOLS.reduce((s, p) => s + p.tvl, 0))}</strong>
        </div>
        <div className="metric">
          <span>24h volume</span>
          <strong>{formatUsd(POOLS.reduce((s, p) => s + p.volume24h, 0))}</strong>
        </div>
        <div className="metric">
          <span>Active pairs</span>
          <strong>{POOLS.length}</strong>
        </div>
      </div>

      <div className="list rise rise-2">
        {POOLS.map((pool) => (
          <PoolRow key={pool.id} pool={pool} onProvide={() => onProvide(pool.id)} />
        ))}
      </div>
    </div>
  );
}

function PoolRow({ pool, onProvide }: { pool: Pool; onProvide: () => void }) {
  return (
    <div className="list-row">
      <div className="pair">
        <div className="pair-orbs">
          <span style={{ background: TOKENS[pool.tokenX].color }} />
          <span style={{ background: TOKENS[pool.tokenY].color }} />
        </div>
        <div>
          {pool.tokenX}/{pool.tokenY}
          <small>bin step {pool.binStep}</small>
        </div>
      </div>
      <div className="cell hide-sm">
        <em>TVL</em>
        {formatUsd(pool.tvl)}
      </div>
      <div className="cell hide-sm">
        <em>Volume</em>
        {formatUsd(pool.volume24h)}
      </div>
      <div className="cell">
        <em>APR</em>
        {pool.apr.toFixed(1)}%
      </div>
      <button type="button" className="btn-fill" onClick={onProvide}>
        Provide
      </button>
    </div>
  );
}
