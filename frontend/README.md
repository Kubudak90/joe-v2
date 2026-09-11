# Liquidity Book UI

Demo frontend for the Joe V2 Liquidity Book contracts in this repo.

## Run

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## What’s included

- Brand landing with bin-distribution hero
- Swap panel (demo rates)
- Pool explorer
- Add-liquidity flow with interactive bin chart (curve / spot / bid-ask / uniform)
- Positions overview with connect-wallet demo state

Data is mocked for UI exploration; wire `LBRouter` / `LBPair` when you point at a live deployment.
