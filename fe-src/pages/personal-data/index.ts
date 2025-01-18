import { Router } from "@vaadin/router";
import { state } from "../../state";

export class PersonalData extends HTMLElement {
  connectedCallback() {
    this.render();
    /*const currentState = state.getState();
    if (!currentState.userId) {
      Router.go("/login");
    }*/
  }
  render() {
    const currentState = state.getState();
    const name = currentState.fullname || "sin datos";
    const localidad = currentState.localidad || "sin datos";
    this.innerHTML = `
    <header-component></header-component>
    <div class="data-container">
      <h1>Mis datos</h1>
      <div class="data">
          <p>Nombre: ${name}</p>
          <p>Localidad: ${localidad}</p>
      </div>    
          <button type="submit" class="button">Modificar datos</button>
      </div>   

    <style>
       .data-container{
       padding: 60px 30px;
       display: flex;
       flex-direction: column;
       justify-content: center;
       align-items: center;
       }

         @media (min-width: 1085px) {
          .login-container{
          padding: 40px 30px;
          }
      }

      h1{
      font-size: 40px;
      margin: 20px 0px 30px 0px;
      }

      @media (min-width: 1085px) {
          h1 {
          font-size: 50px;
          }
      }

      .data{
       margin: 20px;
       padding: 40px 20px;
       border: 4px double rgb(1, 72, 134);
      }

      p{
      font-size: 20px;
      text-align: center;
      margin-bottom: 15px;
      }

      @media (min-width: 1085px) {
          p {
          font-size: 27px;
          margin-bottom: 25px;
          }
      }

      .aclaration{
      font-size: 15px;
      font-style: italic;
      text-align: start;
      margin-bottom: 15px;
      padding: 0px 20px;
      }

      button{
      background-color: #799ab5;
      font-size: 15px;
      height: 40px; 
      width: 250px;
      border-radius: 0.2rem;
      cursor: pointer;
      margin: 15px;
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

    const buttonEl = this.querySelector(".button") as HTMLButtonElement;

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/edit-personal");
    });
  }
}

customElements.define("personaldata-page", PersonalData);
