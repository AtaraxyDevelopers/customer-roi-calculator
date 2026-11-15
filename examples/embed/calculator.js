const form = document.getElementById("calculator");
function calculate() {
  const data = Object.fromEntries(
    [...new FormData(form)].map(([k, v]) => [k, Number(v)]),
  );
  if (Object.values(data).some((v) => !Number.isFinite(v))) return;
  const benefit = data.hours * data.rate + data.profit,
    net = benefit - data.monthly,
    cost = data.setup + data.monthly * data.months,
    total = net * data.months - data.setup;
  document.getElementById("result").textContent =
    "Monthly net benefit: " +
    net.toFixed(2) +
    " | Period net benefit: " +
    total.toFixed(2) +
    " | ROI: " +
    (cost ? ((total / cost) * 100).toFixed(2) + "%" : "N/A (zero cost)") +
    " | Payback: " +
    (net > 0
      ? (data.setup / net).toFixed(2) + " months"
      : "No positive payback");
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});
calculate();
