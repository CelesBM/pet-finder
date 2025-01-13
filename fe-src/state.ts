const API_BASE_URL = "http://localhost:4000"; //luego process.env

const state = {
  data: {
    fullname: "",
    email: "",
    password: "",
    userId: "",
    isLoggedIn: false,
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
            //fullname: currentState.fullname,
            email: currentState.email,
            password: currentState.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          currentState.errorMessage = data.error || "Error desconocido"; //mensaje de error en el frontend según lo que devuelve el back
          this.setState(currentState);
          return;
        }
        currentState.userId = data.id;
        currentState.email = data.email;
        //currentState.fullname = data.fullname;
        currentState.errorMessage = ""; //vacía errorMessage
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

  //Corrobora que el usuario esté registrado y la contraseña sea correcta:
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
          currentState.errorMessage = data.error || "Error desconocido."; //mensaje de error en el frontend según lo que devuelve el back
          this.setState(currentState);
          return;
        }
        currentState.token = data.token;
        currentState.userId = data.id;
        currentState.email = data.email;
        currentState.isLoggedIn = true;
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

  //Función para el login, corroborando token:
  async signIn() {
    const currentState = this.getState();
    if (!currentState.token) {
      console.error("No hay token para autenticar al usuario.");
      currentState.errorMessage =
        "Error de autenticación. Por favor, inicia sesión nuevamente.";
      this.setState(currentState);
      return;
    }
    try {
      const res = await fetch(API_BASE_URL + "/me", {
        method: "post",
        headers: {
          "content-type": "application/json",
          Authorization: `bearer ${currentState.token}`,
        },
      });
      const data = await res.json();
      console.log(data);

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

  async changePersonalData() {
    const currentState = this.getState();
    if (currentState.userId) {
      const response = await fetch(API_BASE_URL + "/update-personal", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullname: currentState.fullname,
          localidad: currentState.localidad,
          userId: currentState.userId,
          lat: currentState.userLat,
          long: currentState.userLong,
        }),
      });
      const data = await response.json();
      console.log("Dara de changePersonalData: ", data);
      //currentState.update = data;
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
