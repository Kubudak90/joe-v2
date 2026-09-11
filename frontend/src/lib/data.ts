export type TokenSymbol = "AVAX" | "USDC" | "WETH" | "JOE";

export interface Token {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
  color: string;
  balance: number;
}

export interface Pool {
  id: string;
  tokenX: TokenSymbol;
  tokenY: TokenSymbol;
  binStep: number;
  tvl: number;
  volume24h: number;
  fee: number;
  price: number;
  activeBin: number;
  apr: number;
}

export interface Position {
  id: string;
  poolId: string;
  tokenX: TokenSymbol;
  tokenY: TokenSymbol;
  value: number;
  amountX: number;
  amountY: number;
  minPrice: number;
  maxPrice: number;
  inRange: boolean;
  fees: number;
  apr: number;
}

export interface BinPoint {
  binId: number;
  price: number;
  liquidity: number;
  user: number;
  isActive: boolean;
}

export type AppView = "home" | "swap" | "pools" | "liquidity" | "positions";
export type DistShape = "spot" | "curve" | "bidask" | "uniform";

export const TOKENS: Record<TokenSymbol, Token> = {
  AVAX: {
    symbol: "AVAX",
    name: "Avalanche",
    decimals: 18,
    color: "#E84142",
    balance: 12.48,
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    color: "#2775CA",
    balance: 8420.55,
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    color: "#627EEA",
    balance: 1.82,
  },
  JOE: {
    symbol: "JOE",
    name: "JoeToken",
    decimals: 18,
    color: "#FF5A1F",
    balance: 1250,
  },
};

export const POOLS: Pool[] = [
  {
    id: "avax-usdc-20",
    tokenX: "AVAX",
    tokenY: "USDC",
    binStep: 20,
    tvl: 4_820_000,
    volume24h: 1_240_000,
    fee: 0.2,
    price: 36.42,
    activeBin: 8388608,
    apr: 18.4,
  },
  {
    id: "weth-usdc-10",
    tokenX: "WETH",
    tokenY: "USDC",
    binStep: 10,
    tvl: 8_150_000,
    volume24h: 3_620_000,
    fee: 0.1,
    price: 3248.2,
    activeBin: 8388612,
    apr: 12.1,
  },
  {
    id: "joe-avax-25",
    tokenX: "JOE",
    tokenY: "AVAX",
    binStep: 25,
    tvl: 960_000,
    volume24h: 210_000,
    fee: 0.25,
    price: 0.0184,
    activeBin: 8388599,
    apr: 42.7,
  },
  {
    id: "avax-weth-15",
    tokenX: "AVAX",
    tokenY: "WETH",
    binStep: 15,
    tvl: 2_340_000,
    volume24h: 540_000,
    fee: 0.15,
    price: 0.0112,
    activeBin: 8388605,
    apr: 15.8,
  },
];

export const POSITIONS: Position[] = [
  {
    id: "pos-1",
    poolId: "avax-usdc-20",
    tokenX: "AVAX",
    tokenY: "USDC",
    value: 12480,
    amountX: 180.2,
    amountY: 5920,
    minPrice: 34.1,
    maxPrice: 39.8,
    inRange: true,
    fees: 42.18,
    apr: 21.3,
  },
  {
    id: "pos-2",
    poolId: "weth-usdc-10",
    tokenX: "WETH",
    tokenY: "USDC",
    value: 8200,
    amountX: 1.12,
    amountY: 4560,
    minPrice: 3100,
    maxPrice: 3400,
    inRange: true,
    fees: 18.4,
    apr: 9.6,
  },
  {
    id: "pos-3",
    poolId: "joe-avax-25",
    tokenX: "JOE",
    tokenY: "AVAX",
    value: 2150,
    amountX: 82000,
    amountY: 28.4,
    minPrice: 0.014,
    maxPrice: 0.016,
    inRange: false,
    fees: 6.2,
    apr: 0,
  },
];

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  }).format(n);
}

export function formatNum(n: number, digits = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(n);
}

export function generateBins(
  activeBin: number,
  price: number,
  binStep: number,
  shape: DistShape = "curve",
  count = 48,
): BinPoint[] {
  const half = Math.floor(count / 2);
  const stepPct = binStep / 10000;
  const points: BinPoint[] = [];

  for (let i = -half; i <= half; i++) {
    const distance = Math.abs(i);
    let liquidity = 0;

    switch (shape) {
      case "spot":
        liquidity = distance <= 2 ? 100 - distance * 18 : 8 + Math.random() * 6;
        break;
      case "bidask":
        liquidity =
          distance < 4
            ? 20
            : 70 * Math.exp(-((distance - 10) ** 2) / 40) + Math.random() * 8;
        break;
      case "uniform":
        liquidity = 45 + Math.random() * 12;
        break;
      default:
        liquidity = 95 * Math.exp(-(distance ** 2) / 90) + Math.random() * 8;
    }

    const binPrice = price * (1 + i * stepPct);
    points.push({
      binId: activeBin + i,
      price: binPrice,
      liquidity,
      user: distance < 8 ? liquidity * 0.12 : 0,
      isActive: i === 0,
    });
  }

  return points;
}
