import { Router } from "@vaadin/router";
import { state } from "../../state";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Dropzone from "dropzone";

export class EditReport extends HTMLElement {
  connectedCallback() {
    const myState = state.getState();
    if (!myState.userId) {
      Router.go("/login");
    } else {
      this.render();
    }
  }

  render() {
    const currentState = state.getState();
    const petId = Number(currentState.petId); //convierto a número
    const selected = currentState.petData.find((pet) => pet.id === petId);

    this.innerHTML = `
      <header-component></header-component>
      <div class="report-container">
        <div class="report">
          <h1>Editar reporte</h1>
          <h3>Ingresaste algún dato erróneo? Aquí puedes modificarlo</h3>
        </div>
        <form class="form">      
          <label for="name">NOMBRE DE MASCOTA:</label>
          <input type="text" id="name" class="name" name="name" autocomplete="name" required>
          <p>Modificá la foto de la mascota</p>
          <img class="dropzone" src="https://res.cloudinary.com/dkzmrfgus/image/upload/v1715798301/pet-finder/reports/gdiqwa4ttphpeuaarxzw.png" alt="">
          <div class="map"></div>
          <p>Hacé clic en el mapa para seleccionar la ubicación donde viste la mascota por última vez o escribí la dirección.</p>
          <label for="location">UBICACIÓN:</label>
          <div class="search-container">
            <input type="text" id="location" class="location" name="location" autocomplete="location" required>
            <button type="button" class="button-search">Buscar</button>
          </div>
          <p class="error-message" style="color: red; display: none;"></p>
          <button class="button-save">Guardar cambios</button>
          <button class="button-found">Reportar como encontrado</button>
          <button class="button-delete">Eliminar reporte</button>
        </form>
      </div>  

      <style>
        .report-container {
          padding: 60px 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .report {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        h1 {
          font-size: 40px;
        }

        @media (min-width: 1085px) {
          h1 {
            font-size: 50px;
          }
        }

        h3 {
          color: rgb(68, 101, 128);
          font-size: 20px;
          text-align: center;
        }

        @media (min-width: 1085px) {
          h3 {
            font-size: 27px;
            margin-bottom: 25px;
          }
        }

        .form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
          gap: 20px;
        }

        label {
          font-size: 20px;
        }

        @media (min-width: 1085px) {
          label  {
            font-size: 25px;
          }
        }

        input {
          font-size: 15px;
          height: 40px; 
          width: 260px;
          border-radius: 0.2rem;
          padding: 10px;
        }

        @media (min-width: 1085px) {
          input {
            width: 600px;
            height: 55px;
          }
        }

        @media (min-width: 600px) {
          .name {
            width: 400px;
          }
        }

        @media (min-width: 1085px) {
          .name {
            width: 800px;
            height: 55px;
          }
        }

        .dropzone {
          width: 250px;
          border-radius: 0.2rem;
          cursor: pointer;
        }

        @media (min-width: 600px) {
          .dropzone {
            width: 400px;
          }
        }

        .map {
          width: 100%;
          height: 300px;
          border-radius: 0.2rem;
          margin-bottom: 10px;
        }

        .search-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        button {
          background-color: #799ab5;
          font-size: 15px;
          height: 40px; 
          width: 250px;
          border-radius: 0.2rem;
          cursor: pointer;
        }

        @media (min-width: 1085px) {
          button {
            font-size: 20px;
            width: 300px;
            height: 55px;
          }
        }

        p {
          color: rgb(68, 101, 128);
          font-size: 18px;
          text-align: center;
        }

        @media (min-width: 1085px) {
          p {
            font-size: 22px;
          }
        }

      </style>
    `;

    const nameInput = this.querySelector(".name") as HTMLInputElement;
    const locationInput = this.querySelector(".location") as HTMLInputElement;
    const imgDropzoneEl = this.querySelector(".dropzone") as HTMLImageElement;

    //Para que se autocompleten los datos según el id seleccionado para editar:
    if (selected && nameInput && locationInput && imgDropzoneEl) {
      nameInput.value = selected.petName || "";
      locationInput.value = selected.petLocation || "";
      imgDropzoneEl.src =
        selected.petImgURL ||
        "https://img.freepik.com/vector-gratis/ups-error-404-ilustracion-concepto-robot-roto_114360-5529.jpg";
    }

    this.addEventListeners();
  }

  addEventListeners() {
    const buttonReportEl = this.querySelector(
      ".button-save"
    ) as HTMLButtonElement;
    const buttonCancelEl = this.querySelector(
      ".button-delete"
    ) as HTMLButtonElement;
    const buttonSearchEl = this.querySelector(
      ".button-search"
    ) as HTMLButtonElement;
    const nameInput = this.querySelector(".name") as HTMLInputElement;
    const locationInput = this.querySelector(".location") as HTMLInputElement;
    const errorMessageEl = this.querySelector(".error-message") as HTMLElement;

    buttonReportEl.addEventListener("click", async (e) => {
      e.preventDefault();
      const currentState = state.getState();

      if (!nameInput.value || !locationInput.value) {
        errorMessageEl.textContent = "Por favor, completa todos los campos.";
        errorMessageEl.style.display = "block";
        return;
      }

      currentState.petName = nameInput.value;
      currentState.petLocation = locationInput.value;
      state.setState(currentState);

      try {
        await state.editReport();
        Router.go("/my-reports");
      } catch (error) {
        console.error("Error al actualizar el reporte:", error);
      }
    });

    buttonCancelEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/lost-pets");
    });

    buttonSearchEl.addEventListener("click", (e) => {
      e.preventDefault();
      const query = locationInput.value.trim();
      if (query) {
        this.searchLocation(query);
      }
    });

    this.useDropzone();
    this.initMap();
  }

  useDropzone() {
    const imgDropzoneEl = this.querySelector(".dropzone") as HTMLImageElement;
    let imgURL;
    const myDropzone = new Dropzone(".dropzone", {
      url: "/falsa",
      autoProcessQueue: false,
    });

    myDropzone.on("thumbnail", function (file) {
      if (file.size > 5000000) {
        //Limita el tamaño a 5 MB
        alert(
          "El archivo es demasiado grande. El tamaño máximo permitido es 5 MB."
        );
        myDropzone.removeFile(file);
      } else {
        const imgText = file.dataURL;
        const currentState = state.getState();
        imgURL = imgText;
        imgDropzoneEl.src = imgURL;
        currentState.petImgURL = imgURL;
        state.setState(currentState);
      }
    });

    myDropzone.on("addedfile", function () {
      myDropzone.processQueue();
    });
  }

  initMap() {
    const mapContainer = this.querySelector(".map") as HTMLElement;
    const currentState = state.getState();
    // Si ya existe una instancia del mapa, se remueve:
    if (currentState.mapInstance) {
      currentState.mapInstance.remove();
    }
    //Inicializar el mapa centrado en Buenos Aires por defecto
    const map = L.map(mapContainer).setView([-34.603851, -58.381775], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
    let marker: L.Marker | null = null;
    currentState.mapInstance = map;
    // Si existen coordenadas en el estado, las usamos para posicionar el marcador:
    if (
      currentState.petLat !== undefined &&
      currentState.petLong !== undefined
    ) {
      const lat = parseFloat(currentState.petLat);
      const lng = parseFloat(currentState.petLong);

      if (!isNaN(lat) && !isNaN(lng)) {
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 13);
      } else {
        console.error(
          "Coordenadas no válidas:",
          currentState.petLat,
          currentState.petLong
        );
      }
    } else {
      console.error("No hay coordenadas disponibles en el estado.");
    }

    //Manejar clics en el mapa para actualizar la ubicación:
    map.on("click", (e) => {
      if (!isNaN(e.latlng.lat) && !isNaN(e.latlng.lng)) {
        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          marker = L.marker(e.latlng).addTo(map);
        }

        //Guardar nueva ubicación en el estado:
        const currentState = state.getState();
        currentState.petLat = parseFloat(e.latlng.lat.toString()); //número
        currentState.petLong = parseFloat(e.latlng.lng.toString()); //número
        state.setState(currentState);

        console.log(
          "Nueva ubicación guardada:",
          currentState.petLat,
          currentState.petLong
        );
      } else {
        console.error("Ubicación inválida seleccionada:", e.latlng);
      }
    });
  }

  reverseGeocode(lat: number, lon: number) {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const location = data?.address?.road
          ? `${data.address.road}, ${data.address.city}, ${data.address.country}`
          : "Ubicación desconocida";
        const locationInput = this.querySelector(
          ".location"
        ) as HTMLInputElement;
        locationInput.value = location;
        const currentState = state.getState();
        currentState.petLocation = location;
        state.setState(currentState);
      })
      .catch((error) => {
        console.error("Error en la geocodificación inversa:", error);
      });
  }

  searchLocation(query: string) {
    const currentState = state.getState();
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          if (currentState.mapInstance) {
            currentState.mapInstance.setView([lat, lon], 15);
            L.marker([lat, lon]).addTo(currentState.mapInstance);
            currentState.petLat = parseFloat(lat);
            currentState.petLong = parseFloat(lon);
            state.setState(currentState);
            this.reverseGeocode(lat, lon);
          }
        } else {
          console.error("No se encontraron resultados para la búsqueda.");
        }
      })
      .catch((error) => {
        console.error("Error en la búsqueda de ubicación:", error);
      });
  }
}

customElements.define("edit-report-page", EditReport);
