/*!
 * betting-calculators.js
 * Free, dependency-free betting math utilities.
 * Live demo & full tools: https://correctbetting.com/betting-calculators/
 * License: MIT
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BettingCalc = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ----- Odds conversion -----------------------------------------------------

  // American (+150 / -200) -> decimal (2.50 / 1.50)
  function americanToDecimal(american) {
    var n = parseFloat(american);
    if (!isFinite(n) || n === 0) return null;
    return n > 0 ? 1 + n / 100 : 1 + 100 / Math.abs(n);
  }

  // Fractional ("3/2") -> decimal (2.50)
  function fractionalToDecimal(fraction) {
    var parts = String(fraction).split("/");
    if (parts.length !== 2) return null;
    var num = parseFloat(parts[0]);
    var den = parseFloat(parts[1]);
    if (!isFinite(num) || !isFinite(den) || den === 0) return null;
    return 1 + num / den;
  }

  // Any supported format -> decimal
  function toDecimal(value, format) {
    if (format === "decimal") {
      var d = parseFloat(value);
      return isFinite(d) && d > 1 ? d : null;
    }
    if (format === "american") return americanToDecimal(value);
    if (format === "fractional") return fractionalToDecimal(value);
    return null;
  }

  // Decimal -> American
  function decimalToAmerican(decimal) {
    var d = parseFloat(decimal);
    if (!isFinite(d) || d <= 1) return null;
    return d >= 2 ? Math.round((d - 1) * 100) : Math.round(-100 / (d - 1));
  }

  // Decimal -> implied probability (0-1)
  function impliedProbability(decimal) {
    var d = parseFloat(decimal);
    if (!isFinite(d) || d <= 1) return null;
    return 1 / d;
  }

  // ----- Single bet ----------------------------------------------------------

  function singleBet(stake, decimalOdds) {
    var s = parseFloat(stake);
    var o = parseFloat(decimalOdds);
    if (!isFinite(s) || !isFinite(o) || s < 0 || o <= 1) return null;
    var payout = s * o;
    return { payout: payout, profit: payout - s };
  }

  // ----- Parlay / accumulator ------------------------------------------------

  // legs: array of decimal odds; returns combined odds, payout, profit
  function parlay(stake, decimalLegs) {
    var s = parseFloat(stake);
    if (!isFinite(s) || s < 0 || !Array.isArray(decimalLegs) || !decimalLegs.length) {
      return null;
    }
    var combined = 1;
    for (var i = 0; i < decimalLegs.length; i++) {
      var leg = parseFloat(decimalLegs[i]);
      if (!isFinite(leg) || leg <= 1) return null;
      combined *= leg;
    }
    var payout = s * combined;
    return {
      combinedOdds: combined,
      payout: payout,
      profit: payout - s,
      impliedProbability: 1 / combined
    };
  }

  // ----- Hedge ---------------------------------------------------------------

  // Stake to place on opposite side to equalise outcome.
  function hedge(originalStake, originalDecimal, hedgeDecimal) {
    var os = parseFloat(originalStake);
    var oo = parseFloat(originalDecimal);
    var ho = parseFloat(hedgeDecimal);
    if (!isFinite(os) || !isFinite(oo) || !isFinite(ho) || oo <= 1 || ho <= 1) {
      return null;
    }
    var originalPayout = os * oo;
    var hedgeStake = originalPayout / ho;
    var guaranteed = originalPayout - (os + hedgeStake);
    return {
      hedgeStake: hedgeStake,
      guaranteedProfit: guaranteed,
      totalStaked: os + hedgeStake,
      roi: (guaranteed / (os + hedgeStake)) * 100
    };
  }

  // ----- Hold / market margin ------------------------------------------------

  // decimalOdds: array of all outcomes in a market. Hold = overround as %.
  function hold(decimalOdds) {
    if (!Array.isArray(decimalOdds) || !decimalOdds.length) return null;
    var sum = 0;
    for (var i = 0; i < decimalOdds.length; i++) {
      var d = parseFloat(decimalOdds[i]);
      if (!isFinite(d) || d <= 1) return null;
      sum += 1 / d;
    }
    return (sum - 1) * 100; // percentage hold
  }

  // ----- Value / expected value ----------------------------------------------

  // yourProb: your estimated win probability (0-1)
  function value(yourProb, decimalOdds, stake) {
    var p = parseFloat(yourProb);
    var o = parseFloat(decimalOdds);
    var s = parseFloat(stake);
    if (!isFinite(p) || !isFinite(o) || p < 0 || p > 1 || o <= 1) return null;
    if (!isFinite(s)) s = 1;
    var ev = p * (o - 1) * s - (1 - p) * s;
    var fairOdds = p > 0 ? 1 / p : null;
    return {
      expectedValue: ev,
      edgePercent: (p * o - 1) * 100,
      fairOdds: fairOdds,
      isValueBet: p * o > 1
    };
  }

  return {
    americanToDecimal: americanToDecimal,
    fractionalToDecimal: fractionalToDecimal,
    toDecimal: toDecimal,
    decimalToAmerican: decimalToAmerican,
    impliedProbability: impliedProbability,
    singleBet: singleBet,
    parlay: parlay,
    hedge: hedge,
    hold: hold,
    value: value
  };
});
