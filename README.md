# betting-calculators

Free, dependency-free JavaScript utilities for common sports-betting math —
odds conversion, parlays/accumulators, hedging, market hold and expected value.

No frameworks, no build step, ~3 KB. Works in the browser and in Node.

**Live demo & full tool suite:** https://correctbetting.com/betting-calculators/

---

## What's included

| Function | What it does |
|----------|--------------|
| `americanToDecimal` / `fractionalToDecimal` | Convert odds to decimal |
| `decimalToAmerican` | Convert decimal odds back to American |
| `toDecimal(value, format)` | Convert any supported format to decimal |
| `impliedProbability` | Decimal odds → implied win probability |
| `singleBet` | Payout & profit for one selection |
| `parlay` | Combined odds, payout & profit for an accumulator |
| `hedge` | Stake needed to lock in a guaranteed result |
| `hold` | Bookmaker margin (overround) of a market |
| `value` | Expected value & edge of a bet |

## Install

Just drop the file in:

```html
<script src="src/betting-calculators.js"></script>
```

Or in Node:

```js
const BettingCalc = require("./src/betting-calculators.js");
```

## Usage

```js
// Convert American odds to decimal
BettingCalc.americanToDecimal(150);      // 2.5
BettingCalc.americanToDecimal(-200);     // 1.5

// 3-leg parlay on a $10 stake
BettingCalc.parlay(10, [2.0, 1.8, 2.5]);
// { combinedOdds: 9, payout: 90, profit: 80, impliedProbability: 0.111... }

// Bookmaker hold on a two-way market priced 1.91 / 1.91
BettingCalc.hold([1.91, 1.91]).toFixed(2); // "4.71" (percent)

// Is +100 a value bet if you think it's a 55% shot?
BettingCalc.value(0.55, 2.0, 10);
// { expectedValue: 1, edgePercent: 10, fairOdds: 1.81..., isValueBet: true }
```

## Demo

Open [`demo/index.html`](demo/index.html) in any browser for a working parlay
calculator built on top of the library. A polished version of every tool
(parlay, odds converter, hedge, hold and value) is hosted at
[correctbetting.com/betting-calculators](https://correctbetting.com/betting-calculators/).

## Odds formats

- **Decimal** — `2.50`
- **American** — `+150`, `-200`
- **Fractional** — `3/2`

## License

MIT — free to use, modify and ship.
