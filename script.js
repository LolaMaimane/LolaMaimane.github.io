const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  links.classList.remove("open");
  toggle.setAttribute("aria-expanded", false);
}));

// Terminal typing intro
const lines = [
  { cmd: "whoami", out: "lola_maimane — IT Technician @ GZ Industries" },
  { cmd: "cat focus.txt", out: "blue team by day → red team in training" },
  { cmd: "nmap -sn 10.0.0.0/24 --reason", out: "Host discovery complete. Curiosity: up." },
  { cmd: "echo $NEXT_ROLE", out: "SOC Analyst | Penetration Tester" },
];
const typed = document.getElementById("typed");

function render(html) { typed.innerHTML = html; }

async function typeIntro() {
  let html = "";
  if (reduceMotion) {
    lines.forEach(l => html += `<span class="c">$</span> ${l.cmd}\n<span class="o">${l.out}</span>\n`);
    return render(html);
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));
  for (const l of lines) {
    html += `<span class="c">$</span> `;
    for (const ch of l.cmd) {
      html += ch;
      render(html + `<span class="c">▌</span>`);
      await wait(45);
    }
    await wait(250);
    html += `\n<span class="o">${l.out}</span>\n`;
    render(html + `<span class="c">$</span> <span class="c">▌</span>`);
    await wait(500);
  }
}
typeIntro();

// Animated counters
function countUp(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const start = performance.now();
  const duration = 1400;
  const step = now => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Scroll reveal + counters
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    if (e.target.dataset.count) countUp(e.target);
    else e.target.classList.add("visible");
    observer.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal, [data-count]").forEach(el => observer.observe(el));

// Contact form → opens email client
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target.elements;
  const subject = encodeURIComponent(`Portfolio message from ${f.name.value}`);
  const body = encodeURIComponent(`${f.message.value}\n\n— ${f.name.value} (${f.email.value})`);
  window.location.href = `mailto:maimanelola@gmail.com?subject=${subject}&body=${body}`;
});

document.getElementById("year").textContent = new Date().getFullYear();
