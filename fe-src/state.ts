const API_BASE_URL = "https://pet-finder-icbc.onrender.com";
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
    petData: "",
    petId: "",
    petName: "",
    petImgURL: "",
    petLocation: "",
    petState: "",
    reportName: "",
    reportPhone: "",
    reportAbout: "",
    reportData: "",
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
            email: currentState.email,
            password: currentState.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          currentState.errorMessage = data.error || "Error desconocido";
          this.setState(currentState);
          return;
        }
        currentState.userId = data.id;
        currentState.email = data.email;
        currentState.errorMessage = ""; //vacía errorMessage
        sessionStorage.setItem("user", JSON.stringify(currentState));
        this.setState(currentState);
        //console.log(data);
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
          currentState.errorMessage = data.error || "Error desconocido.";
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
        //console.log("data autenticate", data);
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
      //console.log(data);
      if (!res.ok) {
        currentState.errorMessage = data.error || "Error desconocido";
        this.setState(currentState);
        return;
      }

      currentState.fullname = data.user.fullname || "Nombre no registrado";
      currentState.email = data.user.email || "Email no registrado";
      currentState.localidad = data.user.localidad || "Localidad no registrada";
      currentState.userId = data.user.id || "ID no registrado";
      currentState.userLat = data.user.userLat || null;
      currentState.userLong = data.user.userLong || null;
      sessionStorage.setItem("user", JSON.stringify(currentState));
      this.setState(currentState);
    } catch (error) {
      console.error("Error en el login:", error);
      currentState.errorMessage = "Error en la conexión con el servidor";
      this.setState(currentState);
    }
    //console.log("Estado después de login:", this.getState());
  },

  //Cerrar Sesión:
  SignOut() {
    const currentState = this.getState();
    sessionStorage.removeItem("user");
    currentState.isLoggedIn = false;
    currentState.fullname = "";
    currentState.email = "";
    currentState.localidad = "";
    currentState.userId = "";
    currentState.userLat = "";
    currentState.userLong = "";
    this.setState(currentState);
  },

  //Agregar o modificar datos personales:
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
          userLat: currentState.userLat,
          userLong: currentState.userLong,
        }),
      });
      const data = await response.json();
      //console.log("Data de changePersonalData: ", data);
      this.setState(currentState);
    }
  },

  //Agregar las coordenadas de localidad:
  async setGeoData(query: string) {
    const currentState = this.getState();
    //API de Nominatim para geocodificación:
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
    );
    if (query.trim() !== "") {
      const data = await response.json(); //verifica que la respuesta de Nominatim tenga datos
      if (data && data.length > 0) {
        const { lat, lon } = data[0]; //extrae coordenadas
        //Actualizar estado con coordenadas:
        currentState.userLong = parseFloat(lon);
        currentState.userLat = parseFloat(lat);
        sessionStorage.setItem("user", JSON.stringify(currentState));
        this.setState(currentState);
        //console.log("setgeodata:", currentState);
      } else {
        console.error("No se encontraron resultados para la búsqueda.");
      }
    }
  },

  //Crear un reporte de mascota perdida:
  async createReport() {
    const currentState = this.getState();
    if (currentState.userId) {
      const response = await fetch(API_BASE_URL + "/create-report", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: currentState.userId,
          petName: currentState.petName,
          petState: currentState.petState,
          petImgURL: currentState.petImgURL,
          petLat: currentState.petLat,
          petLong: currentState.petLong,
          petLocation: currentState.petLocation,
        }),
      });
      const data = await response.json();
      //console.log("create report:", data);
    }
  },

  //Obtener los reportes que hizo mi usuario:
  async myReports() {
    const currentState = this.getState();
    if (currentState.userId) {
      const response = await fetch(
        API_BASE_URL + "/pets?userId=" + currentState.userId
      );
      const data = await response.json();
      currentState.petData = data;
      this.setState(currentState);
    }
  },

  //Editar datos de mascota reportada:
  async editReport() {
    const currentState = this.getState();
    if (currentState.petId) {
      const petLat = parseFloat(currentState.petLat); //convertir las coordenadas a números
      const petLong = parseFloat(currentState.petLong); //convertir las coordenadas a números
      const response = await fetch(API_BASE_URL + "/edit-report", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: currentState.petId,
          userId: currentState.userId,
          petName: currentState.petName,
          petState: currentState.petState,
          petImgURL: currentState.petImgURL,
          petLat: petLat, //uso valores numéricos
          petLong: petLong, //uso valores numéricos
          petLocation: currentState.petLocation,
        }),
      });
      const data = await response.json();
      currentState.petData = data;
      this.setState(currentState);
    }
  },

  //Elimino mascota reportada:
  async deleteReport() {
    const currentState = this.getState();
    if (!currentState.petId) {
      console.error("No hay un petId definido en el estado.");
      return;
    }
    const response = await fetch(API_BASE_URL + "/delete-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentState.petId }),
    });
    const data = await response.json();
    //console.log(data);
  },

  //Mascotas cercanas:
  async nearbyPets() {
    const currentState = this.getState();
    if (!currentState.userLat || !currentState.userLong) {
      console.error("Latitud y longitud no definidas.");
      return;
    }
    if (currentState.userId) {
      const response = await fetch(
        API_BASE_URL +
          "/nearby-pets?&lat=" +
          currentState.userLat +
          "&lng=" +
          currentState.userLong
      );
      const data = await response.json();
      //console.log("nearbypets:", data);
      currentState.petData = data;
      this.setState(currentState);
    }
  },

  //reportar mascota
  async reportPet() {
    const currentState = this.getState();
    if (currentState.petId) {
      const response = await fetch(API_BASE_URL + "/report-pet", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: currentState.petId,
          reportName: currentState.reportName,
          reportPhone: currentState.reportPhone,
          reportAbout: currentState.reportAbout,
        }),
      });

      const data = await response.json();
      //console.log("Respuesta del servidor en reportPet:", data);
      currentState.reportData = data;
      this.setState(currentState);
    } else {
      console.error("No hay petId en el estado, no se envía la petición");
    }
  },

  //Envío de email:
  async sendEmail() {
    const currentState = this.getState();
    const response = await fetch(API_BASE_URL + "/send-email", {
      method: "post",
      headers: {
        Authorization: ` bearer ${currentState.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: currentState.reportEmail,
        reportName: currentState.reportName,
        reportPhone: currentState.reportPhone,
        reportAbout: currentState.reportAbout,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al enviar el correo:", errorData);
    } else {
      //console.log("Correo enviado exitosamente");
      const data = await response.json();
      //console.log(data);
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
