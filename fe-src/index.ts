import "./router";

import { initHeader } from "./components/header";
import "./pages/home/index";
import "./pages/lost-pets/index";
import "./pages/auth-login/index";
import "./pages/auth-register/index";
import "./pages/info/index";

(function main() {
  initHeader();
})();
