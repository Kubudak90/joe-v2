import { useEffect, useState } from "react";
import { Landing } from "./components/Landing";
import { LiquidityView } from "./components/LiquidityView";
import { Nav } from "./components/Nav";
import { PoolsView } from "./components/PoolsView";
import { PositionsView } from "./components/PositionsView";
import { SwapPanel } from "./components/SwapPanel";
import type { AppView } from "./lib/data";

const DEMO_ADDRESS = "0x7a3F9c2B8e1D4A6C905E2f7b4D8A1C3E6F9B2D5A";
const VIEWS: AppView[] = ["home", "swap", "pools", "liquidity", "positions"];

function viewFromHash(): AppView {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return VIEWS.includes(raw as AppView) ? (raw as AppView) : "home";
}

export default function App() {
  const [view, setView] = useState<AppView>(() =>
    typeof window === "undefined" ? "home" : viewFromHash(),
  );
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [poolId, setPoolId] = useState("avax-usdc-20");

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (next: AppView) => {
    setView(next);
    const hash = next === "home" ? "#/" : `#/${next}`;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  };

  const connect = () => {
    setConnected(true);
    setAddress(DEMO_ADDRESS);
  };

  const onConnectToggle = () => {
    if (connected) {
      setConnected(false);
      setAddress(null);
      return;
    }
    connect();
  };

  const goProvide = (id: string) => {
    setPoolId(id);
    navigate("liquidity");
  };

  return (
    <div className="app-shell">
      <Nav
        view={view}
        onNavigate={navigate}
        connected={connected}
        address={address}
        onConnect={onConnectToggle}
      />

      {view === "home" ? <Landing onNavigate={navigate} /> : null}
      {view === "swap" ? (
        <SwapPanel connected={connected} onConnect={connect} />
      ) : null}
      {view === "pools" ? (
        <PoolsView onProvide={goProvide} onNavigate={navigate} />
      ) : null}
      {view === "liquidity" ? (
        <LiquidityView
          poolId={poolId}
          connected={connected}
          onConnect={connect}
          onPoolChange={setPoolId}
        />
      ) : null}
      {view === "positions" ? (
        <PositionsView connected={connected} onConnect={connect} />
      ) : null}

      <p className="footer-note">
        Demo UI for Joe V2 Liquidity Book contracts · mock balances & pools
      </p>

      <Nav
        view={view}
        onNavigate={navigate}
        connected={connected}
        address={address}
        onConnect={onConnectToggle}
        mobile
      />
    </div>
  );
}
