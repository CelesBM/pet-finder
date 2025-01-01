const API_BASE_URL = "http://localhost:4000"; //luego process.env

const state = {
  data: {
    fullname: "",
    email: "",
    password: "",
    userId: "",
    emailVerification: "",
    errorMessage: "",
    localidad: "",
    userLat: "",
    userLong: "",
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
        currentState.email = data.email;
        currentState.fullname = data.fullname;
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
      try {
        const res = await fetch(API_BASE_URL + "/auth/token", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email: currentState.email,
            password: currentState.password,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          // Si el servidor devuelve un error, asignar el mensaje de error correctamente
          currentState.errorMessage = data.error || "Error desconocido.";
          this.setState(currentState);
          return;
        }

        // Si no hay error, guardar los datos de usuario en el estado
        currentState.userId = data.id;
        currentState.email = data.email;
        currentState.errorMessage = "";
        sessionStorage.setItem("user", JSON.stringify(currentState));
        this.setState(currentState);
        console.log("data autenticate", data);
      } catch (error) {
        console.error("Error en la autenticación:", error);
        currentState.errorMessage = "Error en la conexión con el servidor.";
        this.setState(currentState);
      }
    } else {
      currentState.errorMessage = "Por favor, completa todos los campos.";
      this.setState(currentState);
    }
  },

  async login() {
    const currentState = this.getState();
    try {
      const res = await fetch(API_BASE_URL + "/me", {
        method: "post",
        headers: {
          "content-type": "application/json",
          Authorization: `bearer ${currentState.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        currentState.errorMessage = data.error || "Error desconocido";
        this.setState(currentState);
        return;
      }

      // Verificar datos obtenidos
      currentState.fullname = data.user.fullname || "Nombre no registrado";
      currentState.email = data.user.email || "Email no registrado";
      currentState.localidad = data.user.localidad || "Localidad no registrada";
      currentState.userId = data.user.id || "ID no registrado";
      currentState.userLat = data.user.lat || null;
      currentState.userLong = data.user.long || null;
      sessionStorage.setItem("user", JSON.stringify(currentState));
      this.setState(currentState);
    } catch (error) {
      console.error("Error en el login:", error);
      currentState.errorMessage = "Error en la conexión con el servidor";
      this.setState(currentState);
    }
    console.log("Estado después de login:", this.getState());
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
