import { Router } from "@vaadin/router";

export class LostPets extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <header-component></header-component>
    <div class="lost-container">
      <h1>Mascotas perdidas cerca</h1>
      <div class="pet-container">
        <img src="https://i.pinimg.com/474x/7c/a3/dd/7ca3ddacc2a5a3f8833ec3c7f3991d29.jpg"/>
        <div class="info-pet">
            <h3>Nombre</h3>
            <h5>Localidad, Provincia</h5>
            <div class="data-pet"> 
                
                <button class="report">Reportar</button>
            </div> 
        </div>
      </div>
      <div class="pet-container">
        <img src="https://i.pinimg.com/474x/7c/a3/dd/7ca3ddacc2a5a3f8833ec3c7f3991d29.jpg"/>
        <div class="info-pet">
            <h3>Nombre</h3>
            <div class="data-pet"> 
                <h5>Localidad, Provincia</h5>
                <button class="report">Reportar</button>
            </div> 
        </div>
      </div>
      <div class="pet-container">
        <img src="https://i.pinimg.com/474x/7c/a3/dd/7ca3ddacc2a5a3f8833ec3c7f3991d29.jpg"/>
        <div class="info-pet">
            <h3>Nombre</h3>
            <h5>Localidad, Provincia</h5>
            <button class="report">Reportar</button>
           
        </div>
      </div>            
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

    </style>
       `;
  }
}

customElements.define("lostpets-page", LostPets);
