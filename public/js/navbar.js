(function () {
  const header = document.querySelector("header");
  if (!header) return;

  const burger = document.createElement("button");
  burger.className = "burger";
  burger.setAttribute("aria-label", "Toggle menu");
  burger.innerHTML = "<span></span><span></span><span></span>";
  header.appendChild(burger);

  const nav = header.querySelector("nav");

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    nav.classList.toggle("nav-open");
  });

  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      burger.classList.remove("open");
      nav.classList.remove("nav-open");
    }
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      burger.classList.remove("open");
      nav.classList.remove("nav-open");
    });
  });
})();