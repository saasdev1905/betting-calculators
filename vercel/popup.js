"use strict";

// ---- Tab switching --------------------------------------------------------
document.querySelectorAll("nav button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll("nav button").forEach(function (b) { b.classList.remove("active"); });
    document.querySelectorAll(".panel").forEach(function (p) { p.classList.remove("active"); });
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

function fmt(n, d) { return Number(n).toFixed(d === undefined ? 2 : d); }
function show(id) { document.getElementById(id).classList.add("show"); }

// ---- Parlay ---------------------------------------------------------------
document.getElementById("p-add").addEventListener("click", function () {
  var box = document.getElementById("p-legs");
  var i = document.createElement("input");
  i.type = "text";
  i.placeholder = "Leg " + (box.children.length + 1);
  box.appendChild(i);
});

document.getElementById("p-calc").addEventListener("click", function () {
  var format = document.getElementById("p-fmt").value;
  var stake = document.getElementById("p-stake").value;
  var decimals = [];
  var inputs = document.querySelectorAll("#p-legs input");
  for (var i = 0; i < inputs.length; i++) {
    var v = inputs[i].value.trim();
    if (!v) continue;
    var d = BettingCalc.toDecimal(v, format);
    if (d === null) { alert("Invalid odds in leg " + (i + 1)); return; }
    decimals.push(d);
  }
  var r = BettingCalc.parlay(stake, decimals);
  if (!r) { alert("Check your stake and legs."); return; }
  document.getElementById("p-odds").textContent = fmt(r.combinedOdds);
  document.getElementById("p-pay").textContent = fmt(r.payout);
  document.getElementById("p-prof").textContent = fmt(r.profit);
  document.getElementById("p-prob").textContent = fmt(r.impliedProbability * 100) + "%";
  show("p-out");
});

// ---- Odds converter -------------------------------------------------------
document.getElementById("c-calc").addEventListener("click", function () {
  var format = document.getElementById("c-fmt").value;
  var val = document.getElementById("c-val").value.trim();
  var dec = BettingCalc.toDecimal(val, format);
  if (dec === null) { alert("Invalid odds value."); return; }
  var am = BettingCalc.decimalToAmerican(dec);
  document.getElementById("c-dec").textContent = fmt(dec);
  document.getElementById("c-am").textContent = (am > 0 ? "+" : "") + am;
  document.getElementById("c-prob").textContent = fmt(BettingCalc.impliedProbability(dec) * 100) + "%";
  show("c-out");
});

// ---- Hedge ----------------------------------------------------------------
document.getElementById("h-calc").addEventListener("click", function () {
  var s = document.getElementById("h-stake").value;
  var o = document.getElementById("h-odds").value;
  var ho = document.getElementById("h-hodds").value;
  var r = BettingCalc.hedge(s, o, ho);
  if (!r) { alert("Check your inputs (odds must be above 1)."); return; }
  document.getElementById("h-hstake").textContent = fmt(r.hedgeStake);
  document.getElementById("h-total").textContent = fmt(r.totalStaked);
  var prof = document.getElementById("h-prof");
  prof.textContent = fmt(r.guaranteedProfit);
  prof.className = r.guaranteedProfit >= 0 ? "good" : "bad";
  document.getElementById("h-roi").textContent = fmt(r.roi) + "%";
  show("h-out");
});

// ---- Hold -----------------------------------------------------------------
document.getElementById("o-add").addEventListener("click", function () {
  var box = document.getElementById("o-legs");
  var i = document.createElement("input");
  i.type = "text";
  i.placeholder = "Outcome " + (box.children.length + 1);
  box.appendChild(i);
});

document.getElementById("o-calc").addEventListener("click", function () {
  var decimals = [];
  var inputs = document.querySelectorAll("#o-legs input");
  for (var i = 0; i < inputs.length; i++) {
    var v = inputs[i].value.trim();
    if (!v) continue;
    var d = parseFloat(v);
    if (!isFinite(d) || d <= 1) { alert("Invalid odds in outcome " + (i + 1)); return; }
    decimals.push(d);
  }
  var h = BettingCalc.hold(decimals);
  if (h === null) { alert("Add at least one valid outcome."); return; }
  var totalProb = 0;
  decimals.forEach(function (d) { totalProb += 1 / d; });
  document.getElementById("o-hold").textContent = fmt(h) + "%";
  document.getElementById("o-tot").textContent = fmt(totalProb * 100) + "%";
  show("o-out");
});

// ---- Value / EV -----------------------------------------------------------
document.getElementById("v-calc").addEventListener("click", function () {
  var prob = parseFloat(document.getElementById("v-prob").value) / 100;
  var odds = document.getElementById("v-odds").value;
  var stake = document.getElementById("v-stake").value;
  var r = BettingCalc.value(prob, odds, stake);
  if (!r) { alert("Check your inputs (probability 0–100, odds above 1)."); return; }
  var ev = document.getElementById("v-ev");
  ev.textContent = fmt(r.expectedValue);
  ev.className = r.expectedValue >= 0 ? "good" : "bad";
  document.getElementById("v-edge").textContent = fmt(r.edgePercent) + "%";
  document.getElementById("v-fair").textContent = r.fairOdds ? fmt(r.fairOdds) : "—";
  var verdict = document.getElementById("v-verdict");
  verdict.textContent = r.isValueBet ? "Value bet ✓" : "No value";
  verdict.className = r.isValueBet ? "good" : "bad";
  show("v-out");
});
