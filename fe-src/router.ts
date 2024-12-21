import { Router } from "@vaadin/router";

window.addEventListener("load", () => {
  const router = new Router(document.querySelector(".root"));

  router.setRoutes([
    { path: "/", component: "home-page" },
    { path: "/home", component: "home-page" },
    { path: "/lost-pets", component: "lostpets-page" },
    { path: "/login", component: "login-page" },
    { path: "/register", component: "register-page" },
    { path: "/info", component: "info-page" },
  ]);
});
