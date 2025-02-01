import "./router";

import { initHeader } from "./components/header";
import "./pages/home/index";
import "./pages/lost-pets/index";
import "./pages/auth-login/index";
import "./pages/auth-register/index";
import "./pages/info/index";
import "./pages/personal-data/index";
import "./pages/edit-personal-data/index";
import "./pages/create-report/index";
import "./pages/edit-report/index";
import "./pages/my-reports/index";

(function main() {
  initHeader();
})();
