import { useMemo, useState } from "react";
import { TOKENS, formatNum, type TokenSymbol } from "../lib/data";

const RATES: Record<string, number> = {
  "AVAX-USDC": 36.42,
  "USDC-AVAX": 1 / 36.42,
  "WETH-USDC": 3248.2,
  "USDC-WETH": 1 / 3248.2,
  "JOE-AVAX": 0.0184,
  "AVAX-JOE": 1 / 0.0184,
  "AVAX-WETH": 0.0112,
  "WETH-AVAX": 1 / 0.0112,
  "JOE-USDC": 0.67,
  "USDC-JOE": 1 / 0.67,
};

function rate(from: TokenSymbol, to: TokenSymbol): number {
  if (from === to) return 1;
  return RATES[`${from}-${to}`] ?? 1;
}

interface SwapProps {
  connected: boolean;
  onConnect: () => void;
}

export function SwapPanel({ connected, onConnect }: SwapProps) {
  const [from, setFrom] = useState<TokenSymbol>("AVAX");
  const [to, setTo] = useState<TokenSymbol>("USDC");
  const [amount, setAmount] = useState("1.5");
  const [toast, setToast] = useState<string | null>(null);

  const out = useMemo(() => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return n * rate(from, to);
  }, [amount, from, to]);

  const flip = () => {
    setFrom(to);
    setTo(from);
    setAmount(out > 0 ? formatNum(out, 6) : "");
  };

  const submit = () => {
    if (!connected) {
      onConnect();
      return;
    }
    setToast(`Swapped ${amount || "0"} ${from} → ${formatNum(out, 4)} ${to}`);
    window.setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="stage">
      <div className="stage-head rise">
        <h2>Swap</h2>
        <p>Route through Liquidity Book bins for precise pricing.</p>
      </div>

      <div className="swap-stage rise rise-1">
        <div className="swap-board">
          <div className="swap-leg">
            <div className="swap-leg-top">
              <span>You pay</span>
              <span>
                {formatNum(TOKENS[from].balance, 2)} {from}
              </span>
            </div>
            <div className="swap-leg-row">
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.0"
                aria-label="Amount to swap"
              />
              <TokenPicker value={from} exclude={to} onChange={setFrom} />
            </div>
          </div>

          <button type="button" className="swap-switch" onClick={flip} aria-label="Flip tokens">
            ↕
          </button>

          <div className="swap-leg">
            <div className="swap-leg-top">
              <span>You receive</span>
              <span>
                {formatNum(TOKENS[to].balance, 2)} {to}
              </span>
            </div>
            <div className="swap-leg-row">
              <input readOnly value={out ? formatNum(out, 4) : ""} placeholder="0.0" />
              <TokenPicker value={to} exclude={from} onChange={setTo} />
            </div>
          </div>

          <div className="swap-facts">
            <div>
              <span>Rate</span>
              <span>
                1 {from} = {formatNum(rate(from, to), 4)} {to}
              </span>
            </div>
            <div>
              <span>Impact</span>
              <span>~0.08%</span>
            </div>
            <div>
              <span>Route</span>
              <span>LBPair · step 20</span>
            </div>
          </div>

          <button
            type="button"
            className={`action-wide${connected ? " ember" : ""}`}
            onClick={submit}
            disabled={!amount || Number(amount) <= 0}
          >
            {connected ? "Swap" : "Connect to swap"}
          </button>

          {toast ? <div className="notice">{toast}</div> : null}
        </div>
      </div>
    </div>
  );
}

function TokenPicker({
  value,
  exclude,
  onChange,
}: {
  value: TokenSymbol;
  exclude: TokenSymbol;
  onChange: (s: TokenSymbol) => void;
}) {
  return (
    <label className="token-pill">
      <span className="token-orb" style={{ background: TOKENS[value].color }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TokenSymbol)}
        aria-label="Select token"
      >
        {(Object.keys(TOKENS) as TokenSymbol[])
          .filter((s) => s !== exclude)
          .map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
      </select>
    </label>
  );
}
