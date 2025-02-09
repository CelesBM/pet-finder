import { Router } from "@vaadin/router";
import { state } from "../../state";

export class LostPets extends HTMLElement {
  connectedCallback() {
    const myState = state.getState();
    if (!myState.userId) {
      Router.go("/login");
    } else {
      this.render();
    }
  }
  async render() {
    await state.nearbyPets();
    const currentState = state.getState();
    const arrayPets = currentState.petData;
    this.innerHTML = `
      <header-component></header-component>
       <h1>Mascotas perdidas en tu zona</h1>
      <div class="main-container">
          
  
          ${
            arrayPets.length > 0
              ? arrayPets
                  .map(
                    (pet) => `
                    <div class="pet-container">
                        <img src="${pet.petImgURL}" />
                        <div class="info-pet">
                          <h3>${pet.petName}</h3>
                          <h5>${pet.petLocation}</h5>
                          <div class="data-pet">
                            <button class="report-button" data-id="${pet.id}" data-name="${pet.petName}">Reportar</button>
                          </div>
                        </div>
                    </div>
                  `
                  )
                  .join("")
              : ` 
                  <div class="sin-mascotas">
                    <p>Aún no hay mascotas cerca de tu ubicación</p>
                    <div class="contenedor-img-pet-found">
                      <img class="img-found" src="https://res.cloudinary.com/dkzmrfgus/image/upload/v1713836409/pet-finder/rwo0kjz6nuhaxzwacx4h.png">
                    </div>
                  </div>`
          }
      </div>
  
      <!-- Fondo borroso -->
      <div class="overlay" style="display: none;"></div>
  
      <!-- Formulario -->
      <form class="form" style="display: none;">
        <div class="container">
          <div class="close-container">
            <button type="button" class="close-button">✖</button>
          </div>
          <h3 id="form-title">Reportar información</h3>
          <h5>NOMBRE</h5>
          <input class="name" type="text" name="name" />
          <h5>TELEFONO</h5>
          <input class="phone" type="text" name="phone" />
          <h5>¿DÓNDE LO VISTE?</h5>
          <textarea class="location" name="location" cols="30" rows="10"></textarea>
          <button type="submit" class="send-info">Enviar Información</button>
        </div>
      </form>

    <style>

      header-component {
      position: relative;
      z-index: 10; /* Header visible sobre el desenfoque */
      }

        .main-container {
        padding: 30px;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        gap: 30px;
      }

             @media (min-width: 1085px) {
           .main-container {
          gap: 50px;
          }
        }


   

      .lost-container {
      padding: 30px 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 25px;
      transition: filter 0.3s ease;
      }

      .lost-container.blurred {
      filter: blur(5px);
      }
       
       img{
       height: 120px; 
       border-radius: 0.2rem;
       }

      @media (min-width: 1085px) {
          img {
          height: 200px;
          }
      }

      h1{
      font-size: 25px;
      margin-top: 30px;
      margin-bottom: 10px;
      text-align: center;
      }

      @media (min-width: 768px) {
          h1 {
          font-size: 35px;
          margin-bottom: 30px;
          }
      }

      .pet-container{
      width: 350px;
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      background-color: #013867;
      border-radius: 1rem;
      padding: 20px;
      }

        @media (min-width: 1085px) {
          .pet-container {
          padding: 40px 100px;
          width: 450px;
          height: 500px;
          gap: 30px;
          }
      }

      .info-pet{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      gap: 10px;
      }
    
      h3{
      color: white;
      font-size: 20px;
      text-align: center;
      }

         @media (min-width: 1085px) {
          h3 {
          font-size: 28px;
          }
         }

      h5{
      color: white;
      font-size: 18px;
      text-align: center;
      margin-bottom: 0px;
      }

         @media (min-width: 1085px) {
          h5 {
          font-size: 26px;
          }
        }


      .report-button{
      background-color: #799ab5;
      font-size: 15px;
      font-weight: bold;
      height: 30px; 
      width: 150px;
      border-radius: 0.2rem;
      cursor: pointer;
      }

         @media (min-width: 1085px) {
          .report-button {
          font-size: 20px;
          height: 40px; 
          width: 200px;
          }
        }

      p{
      font-size: 20px;
      text-align: center;
      margin-top: 100px;
      }

       @media (min-width: 1085px) {
          p {
          font-size: 25px;
          }
      }

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4); /* Oscurece un poco el fondo */
        backdrop-filter: blur(8px); /* Aplica el efecto borroso */
        z-index: 50; /* Debajo del formulario */
      }
      
         /* El formulario ahora se mantiene centrado en la pantalla */
      .form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        background-color: #013867;
        border-radius: 1rem;
        padding: 30px;
        display: none;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
      }

       @media (min-width: 768px) {
          .form {
          margin: 50px 20px 0px 20px;
          }
      }

           @media (min-width: 1085px) {
          .form {
          padding: 30px 30px;
          }
      }

      .container{
      display: flex;   
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      }

         .close-button {
        background: none;
        border: none;
        position: absolute;
        top: 5px;
        right: 10px;
        color: white;
        font-size: 20px;
        cursor: pointer;
      }

      input, textarea {
        font-size: 15px;
        padding: 5px;
        width: 250px;
      }

      .send-info {
        background-color: #799ab5;
        font-size: 15px;
        font-weight: bold;
        height: 30px;
        width: 150px;
        border-radius: 0.2rem;
        cursor: pointer;
      }

           @media (min-width: 1085px) {
          input {
          width: 380px;
          }
      }

    

           @media (min-width: 1085px) {
          textarea {
          width: 380px;
          height: 150px;
          }
      }

    

         @media (min-width: 768px) {
          .send-info {
          font-size: 20px;
          height: 40px; 
          width: 200px;
          }
        }

          @media (min-width: 1085px) {
          .send-info {
          font-size: 20px;
          height: 50px; 
          width: 400px;
          }
        }

    </style>
       `;

    // Seleccionamos todos los botones de "Reportar"

    const reportButtons = this.querySelectorAll(".report-button");
    const mainContainerEl = this.querySelector(
      ".main-container"
    ) as HTMLElement;
    const formEl = this.querySelector(".form") as HTMLFormElement;
    const formTitle = this.querySelector("#form-title") as HTMLElement;

    const closeButtonEl = this.querySelector(
      ".close-button"
    ) as HTMLButtonElement;
    const overlayEl = this.querySelector(".overlay") as HTMLElement;

    reportButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const petName = button.getAttribute("data-name"); // Obtenemos el nombre de la mascota
        formTitle.textContent = `Reportar info de ${petName}`; // Cambiamos el título del form
        formEl.style.display = "flex"; // Mostramos el formulario
        overlayEl.style.display = "block"; // Mostramos el fondo borroso
      });
    });

    // Manejo del botón de cierre
    const closeButtons = this.querySelectorAll(".close-button");
    closeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        formEl.style.display = "none"; // Ocultamos el formulario
        overlayEl.style.display = "none"; // Quitamos el fondo borroso
      });
    });
  }
}

customElements.define("lostpets-page", LostPets);
