// Jauge de profondeur : convertit le défilement en mètres
// et indique la section visible. Aucune dépendance.
(function () {
  const jauge = document.querySelector(".jauge");
  if (!jauge) return;

  const compteur = jauge.querySelector(".compteur span");
  const lieu = jauge.querySelector(".lieu");
  const curseur = jauge.querySelector(".curseur");
  const nav = jauge.querySelector("nav");
  const liens = [...jauge.querySelectorAll('nav a[href^="#"]')];
  const sections = liens.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const PROFONDEUR_MAX = Number(jauge.dataset.profondeur || 1200); // en mètres

  function majProfondeur() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    compteur.textContent = "−" + String(Math.round(ratio * PROFONDEUR_MAX)).padStart(4, "0");
    if (curseur && nav) curseur.style.top = ratio * (nav.clientHeight - 2) + "px";

    // section active = la dernière dont le haut est passé au tiers de l'écran
    let active = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight / 3) active = s;
    liens.forEach((a) => a.removeAttribute("aria-current"));
    if (active) {
      const lien = liens[sections.indexOf(active)];
      lien.setAttribute("aria-current", "true");
      if (lieu) lieu.textContent = lien.textContent;
    } else if (lieu) {
      lieu.textContent = lieu.dataset.surface || "";
    }
  }

  let attente = false;
  addEventListener("scroll", () => {
    if (attente) return;
    attente = true;
    requestAnimationFrame(() => { majProfondeur(); attente = false; });
  }, { passive: true });
  addEventListener("resize", majProfondeur);
  majProfondeur();
})();
