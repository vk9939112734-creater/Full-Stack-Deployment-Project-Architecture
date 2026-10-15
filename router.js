
const routes = ["home", "weather", "about"];

export function initRouter() {
  function navigate() {
    const requested = location.hash.replace("#", "") || "home";
    const target = routes.includes(requested) ? requested : "home";
    const section = document.getElementById(target);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.addEventListener("hashchange", navigate);
  navigate();
}
