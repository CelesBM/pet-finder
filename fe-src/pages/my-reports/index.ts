import { Router } from "@vaadin/router";
import { state } from "../../state";

export class MyReports extends HTMLElement {
  connectedCallback() {
    const myState = state.getState();
    if (!myState.userId) {
      Router.go("/login");
    } else {
      this.render();
    }
  }
  async render() {
    await state.myReports();
    const currentState = state.getState();
    const petsArray = currentState.petData;
    let content = "";

    if (petsArray) {
      petsArray.forEach((pet) => {
        content += `

        <div class="pet-container">
            <img src="${pet.petImgURL}" />
            <div class="info-pet">
              <h3>${pet.petName}</h3>
              <h5>${pet.petLocation}</h5>
            </div>
              <div class="button-container">
                <button class="edit-button">Editar</button>
                <button class="delete-button">Eliminar</button>
              </div>
        </div>
    `;
      });
    } else {
      content += `
      <div class="none-container">
      <img src="https://vetmarketportal.com.ar/uploads/noticias/2/20220117102858_perro_en_cama.jpg" class="none-img" />
      <p>Usted no ha reportado mascotas aún.</p>
      <button class="report-button">Reportar mascota</button>
      </div>
      `;
    }

    this.innerHTML = `
    <header-component></header-component>
    <h1>Mis reportes</h1>
    <div class="container">
        ${content}
    </div>
    <style>

      header-component {
      position: relative;
      z-index: 10; /* Header visible sobre el desenfoque */
      }

      .container {
      padding: 30px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
      align-items: center;
      gap: 15px;
      }

        @media (min-width: 1085px) {
          .container {
          gap: 60px;
          }
      }

      .none-container{
       display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      gap: 40px;
      }

      .none-img{
      width: 300px;
      border-radius: 0.2rem;
      }

            @media (min-width: 768px) {
            .none-img{
            width: 600px;
      }
        }

      p{
      color: rgb(68, 101, 128);
      font-size: 18px;
      text-align: center;
      }

             @media (min-width: 768px) {
           p {
               font-size: 20px;
            }
        }


      .pet-container{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      gap: 5px;
      background-color: #013867;
      border-radius: 1rem;
      padding: 20px 50px;
      width: 250px;
      }

        @media (min-width: 768px) {
          .pet-container {
          padding: 40px 100px;
          width: 400px;
          }
      }

      img{
       width: 100%;
       border-radius: 0.2rem;
       }

      .info-pet{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      gap: 5px;
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
          width: 180px;
          }
        }

          @media (min-width: 1085px) {
          .report-button {
          font-size: 20px;
          height: 50px; 
          width: 400px;
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
          }
      }

      .button-container{
      display: flex;
      gap: 10px;
      margin-top: 10px;
      }

      button{
      background-color: #799ab5;
      font-size: 15px;
      font-weight: bold;
      height: 30px; 
      width: 100px;
      border-radius: 0.2rem;
      cursor: pointer;
      }

         @media (min-width: 768px) {
          button {
          font-size: 20px;
          height: 40px; 
          width: 150px;
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
          width: 250px;
          }
        }

    </style>
       `;

    const editButtonEl = this.querySelector(
      ".edit-button"
    ) as HTMLButtonElement;
    const deleteButtonEl = this.querySelector(
      ".delete-button"
    ) as HTMLButtonElement;
    const reportButtonEl = this.querySelector(
      ".report-button"
    ) as HTMLButtonElement;

    reportButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/create-report");
    });
  }
}

customElements.define("myreports-page", MyReports);
