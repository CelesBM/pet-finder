import { Router } from "@vaadin/router";
//import { state } from "../../state";

export class LostPets extends HTMLElement {
  connectedCallback() {
    // const myState = state.getState();
    // if (!myState.userId) {
    //   Router.go("/login");
    // } else {
    this.render();
    // }
  }
  render() {
    //  const currentState = state.getState();
    //  const arrayPets = currentState.petData;
    this.innerHTML = `
    <header-component></header-component>

    <div class="main-container">
        <h1>Mascotas perdidas en tu zona</h1>
        <div class="pet-container">
            <img src="" />
            <div class="info-pet">
              <h3>nombre</h3>
              <h5>location</h5>
              <div class="data-pet">
                <button class="report-button">Reportar</button>
              </div>
            </div>
        </div>
    </div>

    <form class="form">
      <div class="container">
        <div class="close-container">
          <button class="close-button">✖</button>
        </div>
      <h3>Reportar info de nombre</h3>
      <h5>NOMBRE</h5>
      <input class="name" type="text" name="name" />
      <h5>TELEFONO</h5>
      <input class="phone" type="text" name="phone" />
      <h5>¿DONDE LO VISTE?</h5>
      <textarea class="location" name="location" id="location" cols="30" rows="10"></textarea>
      <button class="send-info">Enviar Información</button>
      </div>
    </form>

    <style>

      header-component {
      position: relative;
      z-index: 10; /* Header visible sobre el desenfoque */
      }

      .main-container {
      padding: 30px;
      transition: filter 0.3s ease;
      }

      .main-container.blurred {
      filter: blur(5px);
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
       height: 150px; 
       border-radius: 0.2rem;
       }

      @media (min-width: 768px) {
          img {
          height: 200px;
          }
      }

      @media (min-width: 1085px) {
          img {
          height: 250px;
          }
      }

      h1{
      font-size: 25px;
      margin-bottom: 10px;
      text-align: center;
      }

      @media (min-width: 768px) {
          h1 {
          font-size: 35px;
          }
      }

      .pet-container{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      background-color: #013867;
      border-radius: 1rem;
      padding: 20px 50px;
      }

        @media (min-width: 768px) {
          .pet-container {
          padding: 40px 100px;
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

         @media (min-width: 768px) {
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

         @media (min-width: 768px) {
          h5 {
          font-size: 26px;
          }
        }

          @media (min-width: 1085px) {
          h5 {
          font-size: 27px;
          margin-bottom: 25px;
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

         @media (min-width: 768px) {
          .report-button {
          font-size: 20px;
          height: 40px; 
          width: 200px;
          }
        }

          @media (min-width: 1085px) {
          .report-button {
          font-size: 20px;
          height: 50px; 
          width: 400px;
          }
        }

      p{
      font-size: 20px;
      text-align: center;
      margin-top: 100px;
      }

       @media (min-width: 768px) {
          p {
          font-size: 25px;
          }
      }
      
      .form {
      display: none;
      z-index: 20;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
      background-color: #013867;
      border-radius: 1rem;
      padding: 50px 30px;
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

      input{
      font-size: 15px;
      padding: 0px 10px;
      height: 30px; 
      width: 250px;
      }

           @media (min-width: 1085px) {
          input {
          width: 380px;
          }
      }

      textarea{
      font-size: 15px;
      padding: 10px 10px;
      width: 250px;
      }

           @media (min-width: 1085px) {
          textarea {
          width: 380px;
          height: 150px;
          }
      }

      .send-info{
      background-color: #799ab5;
      margin-top: 10px;
      font-size: 15px;
      font-weight: bold;
      height: 30px; 
      width: 150px;
      border-radius: 0.2rem;
      cursor: pointer;
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

    const formEl = this.querySelector(".form") as HTMLFormElement;
    const reportButtonEl = this.querySelector(
      ".report-button"
    ) as HTMLButtonElement;
    const closeButtonEl = this.querySelector(
      ".close-button"
    ) as HTMLButtonElement;
    const mainContainerEl = this.querySelector(
      ".main-container"
    ) as HTMLDivElement;

    formEl.style.display = "none";

    reportButtonEl.addEventListener("click", () => {
      formEl.style.display = "flex";
      mainContainerEl.classList.add("blurred");
    });

    closeButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      formEl.style.display = "none";
      mainContainerEl.classList.remove("blurred");
    });
  }
}

customElements.define("lostpets-page", LostPets);

/*this.innerHTML = `
    <header-component></header-component>
    <div class="lost-container">
      <h1>Mascotas perdidas en tu zona</h1>
       ${
          arrayPets.length > 0
            ? arrayPets
                .map(
                  (pet) =>
                    `
      <div class="pet-container">
        <img src="${pet.petImg}"/>
        <div class="info-pet">
            <h3>${pet.petName}</h3>
            <h5>${pet.petLocation}</h5>
            <div class="data-pet">      
                <button class="report">Reportar</button>
            </div> 
        </div>
      </div>

      <form class="form">
        <div class="container">
          <div class="close-container">
            <button class="close">✖</button>
          </div>
            <h3>Reportar info de ${pet.petName}</h3>
              <h5>NOMBRE</h5>
              <input class="name" type="text" name="name">
              <h5>TELEFONO</h5>
              <input class="phone" type="text" name="phone">
              <h5>¿DONDE LO VISTE?</h5>
              <textarea class="location" name="location" id="location" cols="30" rows="10"></textarea>
              <button class="send-info">Enviar Información</button>
          </div>    
        </form>
      `
                )
                .join("")
            : `
        <div class="none-pets">
          <p>No encontramos mascotas cerca de tu zona.</p>
            </div>
            `
        }
    </div>   

    <style>
      .lost-container{
      padding: 30px 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 25px;
      }
       
       img{
       height: 150px; 
       border-radius: 0.2rem;
       }

      @media (min-width: 768px) {
          img {
          height: 200px;
          }
      }

      @media (min-width: 1085px) {
          img {
          height: 250px;
          }
      }

      h1{
      font-size: 25px;
      margin-bottom: 10px;
      text-align: center;
      }

      @media (min-width: 768px) {
          h1 {
          font-size: 35px;
          }
      }

      .pet-container{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      background-color: #013867;
      border-radius: 1rem;
      padding: 20px 50px;
      }

        @media (min-width: 768px) {
          .pet-container {
          padding: 40px 100px;
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

         @media (min-width: 768px) {
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

         @media (min-width: 768px) {
          h5 {
          font-size: 26px;
          }
        }

          @media (min-width: 1085px) {
          h5 {
          font-size: 27px;
          margin-bottom: 25px;
          }
        }

      button{
      background-color: #799ab5;
      font-size: 15px;
      font-weight: bold;
      height: 30px; 
      width: 150px;
      border-radius: 0.2rem;
      cursor: pointer;
      }

         @media (min-width: 768px) {
          button {
          font-size: 20px;
          height: 40px; 
          width: 200px;
          }
        }

          @media (min-width: 1085px) {
          button {
          font-size: 20px;
          height: 50px; 
          width: 400px;
          }
        }

      p{
      font-size: 20px;
      text-align: center;
      margin-top: 100px;
      }

       @media (min-width: 768px) {
          p {
          font-size: 25px;
          }
      }


    </style>
       `;
*/
