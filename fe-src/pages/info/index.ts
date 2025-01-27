import { Router } from "@vaadin/router";

export class Info extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <header-component></header-component>
    <div class="info-container">
      <div class="info">
        <h1>Cómo funciona Pet Finder?</h1>
        <h5>Con nuestra app vas a poder:</h5>
        <p>✔ Compartir tu ubicación actual para conocer las mascotas perdidas en tu zona.</p>
        <p>✔ Reportar una mascota perdida en tu zona.</p>
        <button class="location">Dar mi ubicación</button>
        <button class="report">Reportar una mascota perdida</button>
      </div>    
    </div>   

    <style>
       .info-container{
       padding: 60px 30px;
       display: flex;
       flex-direction: column;
       justify-content: center;
       align-items: center;
       }

      .info{
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 20px;
      align-items: center;
      }

      h1{
      font-size: 40px;
      margin: 20px 0px;
      text-align: center;
      }

      @media (min-width: 1085px) {
          h1 {
          font-size: 50px;
          }
      }

      h5{
      font-size: 25px;
      text-align: center;
      margin-bottom: 30px;
      }

      @media (min-width: 1085px) {
          h5 {
          font-size: 27px;
          margin-bottom: 25px;
          }
      }

     p{
      font-size: 18px;
      text-align: center;
      margin: 5px 20px;
      }

      @media (min-width: 1085px) {
          p {
          font-size: 27px;
          margin: 15px 20px;
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

      @media (min-width: 1085px) {
          button {
          font-size: 20px;
          height: 50px; 
          width: 400px;
          }
      }
    
     .location{
     margin-top: 20px;
     }

    </style>
       `;

    const locationEl = this.querySelector(".location") as HTMLButtonElement;
    const reportEl = this.querySelector(".report") as HTMLButtonElement;

    locationEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/personal-data");
    });

    reportEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/create-report");
    });
  }
}

customElements.define("info-page", Info);
