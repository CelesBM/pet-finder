import { Router } from "@vaadin/router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { state } from "../../state";

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
          <div class="map"></div>
          <p>Hacé clic en el mapa para seleccionar la ubicación donde viste la mascota por última vez.</p>
          <label for="location">UBICACIÓN:</label>
          <input type="text" id="location" class="location" name="location" autocomplete="location" required>
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

        button {
          background-color: #799ab5;
          font-size: 15px;
          height: 40px; 
          width: 250px;
          border-radius: 0.2rem;
          cursor: pointer;
        }

        .button-report {
          margin-top: 30px;
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
    const nameInput = this.querySelector(".name") as HTMLInputElement;
    const locationInput = this.querySelector(".location") as HTMLInputElement;

    buttonReportEl.addEventListener("click", async (e) => {
      e.preventDefault();
      const currentState = state.getState();
      currentState.petName = nameInput.value;
      currentState.petState = "perdido";
      currentState.petLocation = locationInput.value;
      state.setState(currentState);
      await state.createReport();
      // Router.go("/mascota-reportada");
    });

    buttonCancelEl.addEventListener("click", (e) => {
      e.preventDefault();
      // Router.go("/mascotas-perdidas");
    });

    this.initMap();
  }

  initMap() {
    const mapContainer = this.querySelector(".map") as HTMLElement;
    const currentState = state.getState();

    const map = L.map(mapContainer).setView([-34.603851, -58.381775], 13); // Obelisco, Buenos Aires

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    let marker: L.Marker | null = null;

    // Evento para capturar clic en el mapa
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

      console.log("Mapa clickeado. Ubicación actual:", { lat, lng });
    });

    // Centra el mapa en la ubicación del usuario si se permite
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
}

customElements.define("create-report-page", CreateReport);
