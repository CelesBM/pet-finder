import { Router } from "@vaadin/router";
import { state } from "../../state";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Dropzone from "dropzone";

export class CreateReport extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <header-component></header-component>
      <div class="report-container">
        <div class="report">
          <h1>Reportar mascota</h1>
          <h3>Ingresá los siguientes datos para poder reportar la mascota.</h3>
        </div>
        <form class="form">      
          <label for="name">NOMBRE DE MASCOTA:</label>
          <input type="text" id="name" class="name" name="name" autocomplete="name" required>
          <p>Adjuntar foto</p>
          <img class="dropzone" src="https://res.cloudinary.com/dkzmrfgus/image/upload/v1715798301/pet-finder/reports/gdiqwa4ttphpeuaarxzw.png" alt="">
          <div class="map"></div>
          <p>Hacé clic en el mapa para seleccionar la ubicación donde viste la mascota por última vez o escribí la dirección</p>
          <label for="location">UBICACIÓN:</label>
          <div class="search-container">
            <input type="text" id="location" class="location" name="location" autocomplete="location" required>
            <button type="button" class="button-search">Buscar</button>
          </div>
          <button class="button-report">Reportar</button>
          <button class="button-cancel">Cancelar</button>
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

        h3 {
          color: rgb(68, 101, 128);
          font-size: 20px;
          text-align: center;
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

        input {
          font-size: 15px;
          height: 40px; 
          width: 260px;
          border-radius: 0.2rem;
          padding: 10px;
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

        p {
          color: rgb(68, 101, 128);
          font-size: 18px;
          text-align: center;
        }
      </style>
    `;

    const buttonReportEl = this.querySelector(
      ".button-report"
    ) as HTMLButtonElement;
    const buttonCancelEl = this.querySelector(
      ".button-cancel"
    ) as HTMLButtonElement;
    const buttonSearchEl = this.querySelector(
      ".button-search"
    ) as HTMLButtonElement;
    const nameInput = this.querySelector(".name") as HTMLInputElement;
    const locationInput = this.querySelector(".location") as HTMLInputElement;

    buttonReportEl.addEventListener("click", async (e) => {
      e.preventDefault();
      const currentState = state.getState();
      currentState.petName = nameInput.value;
      currentState.petState = "lost";
      currentState.petLocation = locationInput.value;
      if (currentState.petImgURL) {
        currentState.petImgURL = currentState.petImgURL;
      }

      state.setState(currentState);
      await state.createReport();
      Router.go("/lost-pets");
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
        // Limita el tamaño a 5 MB
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
    if (currentState.mapInstance) {
      return;
    }

    const map = L.map(mapContainer).setView([-34.603851, -58.381775], 13); // Obelisco, Buenos Aires
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    let marker: L.Marker | null = null;
    currentState.mapInstance = map;
    state.setState(currentState);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
      currentState.petLat = lat;
      currentState.petLong = lng;
      state.setState(currentState);
      this.reverseGeocode(lat, lng);
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
        L.marker([latitude, longitude]).addTo(map);
        currentState.petLat = latitude;
        currentState.petLong = longitude;
        state.setState(currentState);
      },
      (error) => {
        console.error("Error obteniendo la ubicación:", error);
      }
    );
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

customElements.define("create-report-page", CreateReport);
