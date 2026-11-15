const round = (n) => {
  if (!Number.isFinite(n)) throw new Error("Expected a finite number");
  const [coefficient, exponent = "0"] = String(Math.abs(n)).split("e");
  const shifted = Math.round(Number(`${coefficient}e${Number(exponent) + 2}`));
  const [rounded, power = "0"] = String(shifted).split("e");
  return Number(`${rounded}e${Number(power) - 2}`) * Math.sign(n);
};

const format = (value) => round(value).toFixed(2);
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
    format(net) +
    " | Period net benefit: " +
    format(total) +
    " | ROI: " +
    (cost ? format((total / cost) * 100) + "%" : "N/A (zero cost)") +
    " | Payback: " +
    (net > 0 ? format(data.setup / net) + " months" : "No positive payback");
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});
calculate();
