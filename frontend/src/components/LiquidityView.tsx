import { useMemo, useState, type CSSProperties } from "react";
import {
  POOLS,
  TOKENS,
  formatNum,
  formatUsd,
  generateBins,
  type BinPoint,
  type DistShape,
} from "../lib/data";

interface LiquidityProps {
  poolId: string;
  connected: boolean;
  onConnect: () => void;
  onPoolChange: (id: string) => void;
}

const SHAPES: { id: DistShape; label: string }[] = [
  { id: "curve", label: "Curve" },
  { id: "spot", label: "Spot" },
  { id: "bidask", label: "Bid-Ask" },
  { id: "uniform", label: "Uniform" },
];

export function LiquidityView({
  poolId,
  connected,
  onConnect,
  onPoolChange,
}: LiquidityProps) {
  const pool = POOLS.find((p) => p.id === poolId) ?? POOLS[0];
  const [shape, setShape] = useState<DistShape>("curve");
  const [amountX, setAmountX] = useState("50");
  const [amountY, setAmountY] = useState("1800");
  const [range, setRange] = useState(12);
  const [toast, setToast] = useState<string | null>(null);

  const bins = useMemo(
    () => generateBins(pool.activeBin, pool.price, pool.binStep, shape, 40),
    [pool, shape],
  );

  const visible = bins.filter(
    (b) => Math.abs(b.binId - pool.activeBin) <= range,
  );

  const minPrice = visible[0]?.price ?? pool.price;
  const maxPrice = visible[visible.length - 1]?.price ?? pool.price;

  const estValue =
    Number(amountX || 0) * (pool.tokenY === "USDC" ? pool.price : 1) +
    Number(amountY || 0) * (pool.tokenY === "USDC" ? 1 : pool.price);

  const submit = () => {
    if (!connected) {
      onConnect();
      return;
    }
    setToast(
      `Minted across bins ${visible[0].binId}–${visible[visible.length - 1].binId}`,
    );
    window.setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="stage">
      <div className="stage-head rise">
        <h2>Add liquidity</h2>
        <p>Shape capital across price bins around the active market.</p>
      </div>

      <div className="split">
        <div className="surface surface-pad rise rise-1">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "0.85rem",
            }}
          >
            <strong
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.15rem",
                letterSpacing: "-0.03em",
              }}
            >
              {pool.tokenX}/{pool.tokenY}
            </strong>
            <span style={{ fontWeight: 600, color: "rgba(7,16,24,0.55)", fontSize: "0.9rem" }}>
              Active ${formatNum(pool.price, 4)}
            </span>
          </div>
          <BinStage
            bins={visible}
            shape={shape}
            priceDigits={pool.price < 1 ? 4 : 2}
          />
          <div className="range-line">
            <span>Min ${formatNum(minPrice, 4)}</span>
            <span>±{range} bins</span>
            <span>Max ${formatNum(maxPrice, 4)}</span>
          </div>
        </div>

        <div className="surface surface-pad form-grid rise rise-2">
          <div className="field">
            <label htmlFor="pool">Pool</label>
            <select
              id="pool"
              value={pool.id}
              onChange={(e) => onPoolChange(e.target.value)}
            >
              {POOLS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.tokenX}/{p.tokenY} · step {p.binStep}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "rgba(7,16,24,0.5)",
                marginBottom: "0.4rem",
              }}
            >
              Distribution
            </label>
            <div className="shapes">
              {SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`shape${shape === s.id ? " on" : ""}`}
                  onClick={() => setShape(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="range">Range width</label>
            <input
              id="range"
              type="range"
              min={4}
              max={20}
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="amountX">
              {pool.tokenX} · bal {formatNum(TOKENS[pool.tokenX].balance)}
            </label>
            <input
              id="amountX"
              value={amountX}
              onChange={(e) => setAmountX(e.target.value.replace(/[^0-9.]/g, ""))}
            />
          </div>

          <div className="field">
            <label htmlFor="amountY">
              {pool.tokenY} · bal {formatNum(TOKENS[pool.tokenY].balance)}
            </label>
            <input
              id="amountY"
              value={amountY}
              onChange={(e) => setAmountY(e.target.value.replace(/[^0-9.]/g, ""))}
            />
          </div>

          <div className="swap-facts" style={{ margin: 0 }}>
            <div>
              <span>Est. position</span>
              <span>{formatUsd(estValue)}</span>
            </div>
            <div>
              <span>Fee tier</span>
              <span>{pool.fee}%</span>
            </div>
          </div>

          <button
            type="button"
            className={`action-wide${connected ? " ember" : ""}`}
            onClick={submit}
          >
            {connected ? "Add liquidity" : "Connect to provide"}
          </button>
          {toast ? <div className="notice">{toast}</div> : null}
        </div>
      </div>
    </div>
  );
}

function BinStage({
  bins,
  shape,
  priceDigits,
}: {
  bins: BinPoint[];
  shape: DistShape;
  priceDigits: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...bins.map((b) => b.liquidity), 1);
  const mid = Math.floor(bins.length / 2);
  const active = bins.find((b) => b.isActive) ?? bins[mid];
  const tip = hover != null ? bins.find((b) => b.binId === hover) : active;

  return (
    <div className="bin-stage" key={shape}>
      <div className="bin-sweep" aria-hidden />
      {tip ? (
        <div className="bin-tip">
          ${formatNum(tip.price, 4)}
          <small>{tip.isActive ? "active bin" : "liquidity"}</small>
        </div>
      ) : null}
      <div className="bin-sky" role="img" aria-label="Liquidity distribution">
        {bins.map((bin, i) => (
          <button
            key={bin.binId}
            type="button"
            className={`bin-col${bin.isActive ? " hot" : ""}${hover === bin.binId ? " on" : ""}`}
            style={{ "--d": `${Math.abs(i - mid) * 26}ms` } as CSSProperties}
            onMouseEnter={() => setHover(bin.binId)}
            onFocus={() => setHover(bin.binId)}
            onMouseLeave={() => setHover(null)}
            onBlur={() => setHover(null)}
            aria-label={`Bin ${bin.binId} at $${formatNum(bin.price, priceDigits)}`}
          >
            <span
              className="bin-bar"
              style={{ "--h": `${Math.max(8, (bin.liquidity / max) * 100)}%` } as CSSProperties}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
