import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  POOLS,
  TOKENS,
  formatNum,
  formatUsd,
  generateBins,
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

  const submit = () => {
    if (!connected) {
      onConnect();
      return;
    }
    setToast(
      `Demo mint across bins ${visible[0].binId}–${visible[visible.length - 1].binId}`,
    );
    window.setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="page">
      <div className="page-header animate-rise">
        <div>
          <h2>Add liquidity</h2>
          <p>Shape capital across price bins around the active market.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel panel-pad animate-rise animate-rise-delay-1">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
              alignItems: "center",
            }}
          >
            <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem" }}>
              {pool.tokenX}/{pool.tokenY}
            </strong>
            <span className="chip">Active ${formatNum(pool.price, 4)}</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visible} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,31,42,0.08)" vertical={false} />
                <XAxis
                  dataKey="price"
                  tickFormatter={(v) => formatNum(Number(v), pool.price < 1 ? 4 : 2)}
                  tick={{ fontSize: 11, fill: "rgba(11,31,42,0.55)" }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={28}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(31,167,160,0.08)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(11,31,42,0.12)",
                    fontSize: 13,
                  }}
                  formatter={(value: number) => [formatNum(value, 1), "Liquidity"]}
                  labelFormatter={(label) => `Price $${formatNum(Number(label), 4)}`}
                />
                <ReferenceLine
                  x={pool.price}
                  stroke="#FF5A1F"
                  strokeDasharray="4 4"
                />
                <Bar dataKey="liquidity" radius={[6, 6, 2, 2]}>
                  {visible.map((entry) => (
                    <Cell
                      key={entry.binId}
                      fill={entry.isActive ? "#FF5A1F" : "#1FA7A0"}
                      fillOpacity={entry.isActive ? 1 : 0.75}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="range-readout" style={{ marginTop: "0.75rem" }}>
            <span>Min ${formatNum(minPrice, 4)}</span>
            <span>Width ±{range} bins</span>
            <span>Max ${formatNum(maxPrice, 4)}</span>
          </div>
        </div>

        <div className="panel panel-pad form-stack animate-rise animate-rise-delay-2">
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
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
              Distribution
            </label>
            <div className="shape-row" style={{ marginTop: 6 }}>
              {SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`shape-btn${shape === s.id ? " active" : ""}`}
                  onClick={() => setShape(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="range">Price range (bins from active)</label>
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
              {pool.tokenX} amount · bal {formatNum(TOKENS[pool.tokenX].balance)}
            </label>
            <input
              id="amountX"
              value={amountX}
              onChange={(e) => setAmountX(e.target.value.replace(/[^0-9.]/g, ""))}
            />
          </div>

          <div className="field">
            <label htmlFor="amountY">
              {pool.tokenY} amount · bal {formatNum(TOKENS[pool.tokenY].balance)}
            </label>
            <input
              id="amountY"
              value={amountY}
              onChange={(e) => setAmountY(e.target.value.replace(/[^0-9.]/g, ""))}
            />
          </div>

          <div className="swap-meta" style={{ margin: 0 }}>
            <div>
              <span>Est. position</span>
              <span>
                {formatUsd(
                  Number(amountX || 0) *
                    (pool.tokenY === "USDC" ? pool.price : 1) +
                    Number(amountY || 0) *
                    (pool.tokenY === "USDC" ? 1 : pool.price),
                )}
              </span>
            </div>
            <div>
              <span>Fee tier</span>
              <span>{pool.fee}%</span>
            </div>
          </div>

          <button type="button" className="swap-submit" onClick={submit}>
            {connected ? "Add liquidity" : "Connect to provide"}
          </button>
          {toast ? <div className="toast">{toast}</div> : null}
        </div>
      </div>
    </div>
  );
}
