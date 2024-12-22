const API_BASE_URL = "http://localhost:4000"; //luego process.env

const state = {
  data: {
    fullname: "",
    email: "",
    password: "",
    userId: "",
    emailVerification: "",
    errorMessage: "",
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (const callback of this.listeners) {
      callback();
    }
    console.log("Soy el setState y he cambiado", this.data);
  },

  //Registro de nuevo usuario:

  async signUp() {
    const currentState = this.getState();
    if (currentState.email) {
      try {
        const res = await fetch(API_BASE_URL + "/auth", {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            fullname: currentState.fullname,
            email: currentState.email,
            password: currentState.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          currentState.errorMessage = data.error || "Error desconocido"; // Actualización de mensaje de error
          this.setState(currentState);
          return;
        }
        currentState.userId = data.id;
        currentState.errorMessage = ""; //Vacía errorMessage
        sessionStorage.setItem("user", JSON.stringify(currentState));
        this.setState(currentState);
        console.log(data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
        currentState.errorMessage = "Error en la conexión con el servidor";
        this.setState(currentState);
      }
    }
  },

  async autenticate() {
    const currentState = this.getState();
    if (currentState.email && currentState.password) {
      const res = await fetch(API_BASE_URL + "/auth/token", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: currentState.email,
          password: currentState.password,
        }),
      });
      const data = await res.json();
      console.log(data);
      currentState.token = data.token;
      this.setState(currentState);
    }
  },

  async verifyEmail() {
    const currentState = this.getState();
    if (currentState.email) {
      const res = await fetch(API_BASE_URL + "/verify-email", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: currentState.email }),
      });
      const data = await res.json();
      currentState.emailVerification = data;
      this.setState(currentState);
    }
  },
};

export function initializeApp() {
  const storageUser = sessionStorage.getItem("user");
  if (storageUser) {
    const userData = JSON.parse(storageUser);
    state.setState(userData);
  } else {
    console.log("El usuario no está logueado.");
  }
}

export { state };
