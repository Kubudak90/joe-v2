import { useEffect, useRef, useState, type CSSProperties } from "react";
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

const FLIGHT_MS = 1680;

function rate(from: TokenSymbol, to: TokenSymbol): number {
  if (from === to) return 1;
  return RATES[`${from}-${to}`] ?? 1;
}

interface Flight {
  id: number;
  from: TokenSymbol;
  to: TokenSymbol;
  amount: string;
  outLabel: string;
  fromY: number;
  toY: number;
}

interface SwapProps {
  connected: boolean;
  onConnect: () => void;
}

export function SwapPanel({ connected, onConnect }: SwapProps) {
  const [from, setFrom] = useState<TokenSymbol>("WETH");
  const [to, setTo] = useState<TokenSymbol>("USDC");
  const [amount, setAmount] = useState("0.25");
  const [toast, setToast] = useState<string | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const payRef = useRef<HTMLDivElement>(null);
  const recvRef = useRef<HTMLDivElement>(null);

  const n = Number(amount);
  const out = Number.isFinite(n) && n > 0 ? n * rate(from, to) : 0;

  useEffect(() => {
    if (!flight) return;
    const timer = window.setTimeout(() => {
      setToast(
        `Swapped ${flight.amount} ${TOKENS[flight.from].face} → ${flight.outLabel} ${TOKENS[flight.to].face}`,
      );
      setFlight(null);
    }, FLIGHT_MS);
    return () => window.clearTimeout(timer);
  }, [flight]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const flip = () => {
    if (flight) return;
    setFrom(to);
    setTo(from);
    setAmount(out > 0 ? formatNum(out, 6) : "");
  };

  const submit = () => {
    if (!amount || out <= 0 || flight) return;
    if (!connected) onConnect();
    const board = boardRef.current?.getBoundingClientRect();
    const pay = payRef.current?.getBoundingClientRect();
    const recv = recvRef.current?.getBoundingClientRect();
    if (!board || !pay || !recv) return;
    setToast(null);
    setFlight({
      id: Date.now(),
      from,
      to,
      amount,
      outLabel: formatNum(out, 4),
      fromY: pay.top - board.top + pay.height / 2 - 46,
      toY: recv.top - board.top + recv.height / 2 - 46,
    });
  };

  return (
    <div className="stage">
      <div className="stage-head rise">
        <h2>Swap</h2>
        <p>Route through Liquidity Book bins for precise pricing.</p>
      </div>

      <div className="swap-stage rise rise-1">
        <div className={`swap-board${flight ? " in-flight" : ""}`} ref={boardRef}>
          {flight ? (
            <>
              <span
                className="route-line"
                style={
                  {
                    "--from": TOKENS[flight.from].color,
                    "--to": TOKENS[flight.to].color,
                    top: flight.fromY + 46,
                    height: Math.max(24, flight.toY - flight.fromY),
                  } as CSSProperties
                }
              />
              <div
                className="packet"
                key={flight.id}
                style={
                  {
                    "--from": TOKENS[flight.from].color,
                    "--to": TOKENS[flight.to].color,
                    "--from-y": `${flight.fromY}px`,
                    "--to-y": `${flight.toY}px`,
                  } as CSSProperties
                }
              >
                <span className="packet-seal" />
                <span className="packet-face from">{TOKENS[flight.from].face}</span>
                <span className="packet-face to">{TOKENS[flight.to].face}</span>
                <span className="packet-amt from">{flight.amount}</span>
                <span className="packet-amt to">{flight.outLabel}</span>
              </div>
            </>
          ) : null}

          <div className={`swap-leg${flight ? " sending" : ""}`} ref={payRef}>
            <div className="swap-leg-top">
              <span>You pay</span>
              <span>
                {formatNum(TOKENS[from].balance, 2)} {TOKENS[from].face}
              </span>
            </div>
            <div className="swap-leg-row">
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.0"
                aria-label="Amount to swap"
                disabled={!!flight}
              />
              <TokenPicker value={from} exclude={to} onChange={setFrom} disabled={!!flight} />
            </div>
          </div>

          <button
            type="button"
            className="swap-switch"
            onClick={flip}
            aria-label="Flip tokens"
            disabled={!!flight}
          >
            ↕
          </button>

          <div className={`swap-leg${flight ? " receiving" : ""}`} ref={recvRef}>
            <div className="swap-leg-top">
              <span>You receive</span>
              <span>
                {formatNum(TOKENS[to].balance, 2)} {TOKENS[to].face}
              </span>
            </div>
            <div className="swap-leg-row">
              <input readOnly value={out ? formatNum(out, 4) : ""} placeholder="0.0" />
              <TokenPicker value={to} exclude={from} onChange={setTo} disabled={!!flight} />
            </div>
          </div>

          <div className="swap-facts">
            <div>
              <span>Rate</span>
              <span>
                1 {TOKENS[from].face} = {formatNum(rate(from, to), 4)} {TOKENS[to].face}
              </span>
            </div>
            <div>
              <span>Impact</span>
              <span>~0.08%</span>
            </div>
            <div>
              <span>Route</span>
              <span>LBPair · step 10</span>
            </div>
          </div>

          <button
            type="button"
            className={`action-wide${connected || flight ? " ember" : ""}`}
            onClick={submit}
            disabled={!amount || out <= 0 || !!flight}
          >
            {flight ? "Routing…" : connected ? "Swap" : "Connect to swap"}
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
  disabled,
}: {
  value: TokenSymbol;
  exclude: TokenSymbol;
  onChange: (s: TokenSymbol) => void;
  disabled?: boolean;
}) {
  return (
    <label className="token-pill">
      <span className="token-orb" style={{ background: TOKENS[value].color }} />
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as TokenSymbol)}
        aria-label="Select token"
      >
        {(Object.keys(TOKENS) as TokenSymbol[])
          .filter((s) => s !== exclude)
          .map((s) => (
            <option key={s} value={s}>
              {TOKENS[s].face}
            </option>
          ))}
      </select>
    </label>
  );
}
