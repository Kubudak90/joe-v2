import { POOLS, TOKENS, formatUsd, type AppView, type Pool } from "../lib/data";

interface PoolsProps {
  onProvide: (poolId: string) => void;
  onNavigate: (view: AppView) => void;
}

export function PoolsView({ onProvide }: PoolsProps) {
  return (
    <div className="page">
      <div className="page-header animate-rise">
        <div>
          <h2>Pools</h2>
          <p>Liquidity Book pairs with discrete bin pricing.</p>
        </div>
      </div>

      <div className="stat-strip animate-rise animate-rise-delay-1">
        <div className="panel panel-pad stat">
          <span>Total value locked</span>
          <strong>{formatUsd(POOLS.reduce((s, p) => s + p.tvl, 0))}</strong>
        </div>
        <div className="panel panel-pad stat">
          <span>24h volume</span>
          <strong>{formatUsd(POOLS.reduce((s, p) => s + p.volume24h, 0))}</strong>
        </div>
        <div className="panel panel-pad stat">
          <span>Active pairs</span>
          <strong>{POOLS.length}</strong>
        </div>
      </div>

      <div className="panel grid-pools animate-rise animate-rise-delay-2">
        {POOLS.map((pool) => (
          <PoolRow key={pool.id} pool={pool} onProvide={() => onProvide(pool.id)} />
        ))}
      </div>
    </div>
  );
}

function PoolRow({ pool, onProvide }: { pool: Pool; onProvide: () => void }) {
  return (
    <div className="pool-row">
      <div className="pool-pair">
        <div className="pair-icons">
          <span style={{ background: TOKENS[pool.tokenX].color }} />
          <span style={{ background: TOKENS[pool.tokenY].color }} />
        </div>
        <div>
          {pool.tokenX}/{pool.tokenY}
          <div className="chip" style={{ marginTop: 4 }}>
            bin step {pool.binStep}
          </div>
        </div>
      </div>
      <div className="pool-metric hide-sm">
        <small>TVL</small>
        {formatUsd(pool.tvl)}
      </div>
      <div className="pool-metric hide-sm">
        <small>24h volume</small>
        {formatUsd(pool.volume24h)}
      </div>
      <div className="pool-metric">
        <small>APR</small>
        {pool.apr.toFixed(1)}%
      </div>
      <button type="button" className="btn-sm accent" onClick={onProvide}>
        Provide
      </button>
    </div>
  );
}
