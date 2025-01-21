import { Router } from "@vaadin/router";
//import { state } from "../../state";

export class CreateReport extends HTMLElement {
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

    this.innerHTML = `
    <header-component></header-component>
    <div class="report-container">
        <div class="report">
            <h1>Reportar mascota</h1>
            <h3>Ingresá los siguientes datos para poder reportar la mascota.</h3>
        </div > 
        <form class="form">      
            <label for="name">NOMBRE DE MASCOTA:</label>
            <input type="text" id="name" class="name" name="name" autocomplete="name" required>
            <img class="dropzone" src="https://res.cloudinary.com/dkzmrfgus/image/upload/v1715798301/pet-finder/reports/gdiqwa4ttphpeuaarxzw.png" alt="">
            <button class="button-add">Agregar foto</button>
            <img class="map" src="https://png.pngtree.com/png-vector/20190628/ourlarge/pngtree-map-illustration-with-markers-png-image_1519483.jpg" alt="">
            <p>Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.</p>
            <label for="location">UBICACION:</label>
            <input type="text" id="location" class="location" name="location" autocomplete="location" required>
            <button class="button-report">Reportar</button>
            <button class="button-cancel">Cancelar</button>
        </form>
      </div >  

    <style>
      .report-container {
      padding: 60px 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      }

      .report{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      }

      h3{
      color:rgb(68, 101, 128);
      font-size: 20px;
      text-align: center;
      }

         @media (min-width: 768px) {
          h3 {
          font-size: 28px;
          }
         }

      .form{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
      gap: 10px;
      }

         @media (min-width: 768px) {
          .form{
          gap: 20px;
          }
      }

      label{
      font-size: 20px;
      }

        @media (min-width: 768px) {
          label{
          font-size: 22px;
          }
      }

      @media (min-width: 1085px) {
          label{
          font-size: 24px;
          }
      }

      input{
      font-size: 15px;
      height: 40px; 
      width: 260px;
      border-radius: 0.2rem;
      padding: 10px;
      }

    @media (min-width: 500px) {
          input {
          width: 350px;
          }
      }

           @media (min-width: 768px) {
         input {
          width: 500px;
          }
      }

    @media (min-width: 1085px) {
          input {
          font-size: 18px;         
          width: 600px;
          height: 50px; 
          }
      }

      img{
      height: 200px;
      border-radius: 0.2rem;
      }

       @media (min-width: 500px) {
          img {
          height: 230px;
          }
      }

            @media (min-width: 768px) {
           img {
          font-size: 22px;
          }
      }

      button{
      background-color: #799ab5;
      font-size: 15px;
      height: 40px; 
      width: 250px;
      border-radius: 0.2rem;
      cursor: pointer;
      }

         @media (min-width: 500px) {
          button {
          width: 350px;
          }
      }

          @media (min-width: 768px) {
          button {
         font-size: 20px;
          width: 400px;
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
      color:rgb(68, 101, 128);
      font-size: 18px;
      text-align: center;
      }

               @media (min-width: 768px) {
         p {
          font-size: 20px;
          }
      }

      .map{
      width: 250px;
      }

         @media (min-width: 500px) {
          .map {
          width: 350px;
          }
      }

           @media (min-width: 768px) {
          .map {
          width: 400px;
          height: 300px;
          }
      }

      .button-report{
      margin-top: 30px;
      }
    </style>
       `;
  }
}

customElements.define("create-report-page", CreateReport);
