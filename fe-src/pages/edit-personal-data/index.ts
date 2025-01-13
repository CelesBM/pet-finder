import { Router } from "@vaadin/router";
import { state } from "../../state";

export class EditPersonalData extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <header-component></header-component>
    <div class="data-container">
      <h1>Mis datos</h1>
      <p>Complete los datos por favor.</p>
      <div class="personal-data">
        <form>
            <label for="name">NOMBRE:</label>
            <input type="text" id="name" class="name" name="name" autocomplete="name" required>
             <label for="adress">LOCALIDAD:</label>
            <input type="text" id="adress" class="adress" name="adress" autocomplete="adress" required>
            <p class= "aclaration">Debe colocar cuidad y provincia, por ejemplo "Flores, Buenos Aires"</p>
             <p class="error-message" style="color: red; display: none;"></p>
            <button type="submit" class="button">Guardar</button>
        </form>
        <p class="error-message" style="color: red; display: none;"></p>
      </div>    
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
      margin-top: 20px;
      }

      @media (min-width: 1085px) {
          h1 {
          font-size: 50px;
          }
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

      @media (min-width: 1085px) {
          .aclaration {
          font-size: 20px;
          margin-bottom: 25px;
          }
      }

      form{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      }

      label{
      font-size: 20px;
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

    @media (min-width: 1085px) {
          input {
          font-size: 18px;         
          width: 600px;
          height: 50px; 
          }
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

       a{
       color:rgb(68, 101, 128);
       font-style: bold;
       font-size: 20px;
      }


    </style>
       `;

    const buttonEl = this.querySelector(".button") as HTMLButtonElement;
    const nameEl = this.querySelector(".name") as HTMLInputElement;
    const localidadEl = this.querySelector(".adress") as HTMLInputElement;
    const errorMessageEl = this.querySelector(".error-message") as HTMLElement;

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      if (nameEl.value && localidadEl.value !== "") {
        const currentState = state.getState();
        currentState.fullname = nameEl.value;
        currentState.localidad = localidadEl.value;
        state.setState(currentState);
        //await state.setLongLatUser(currentState.localidad);
        //await state.agregarDatos();
        //Router.go("/");
      } else {
        errorMessageEl.textContent = "Por favor, completa todos los campos.";
        errorMessageEl.style.display = "block";
      }
    });
  }
}

customElements.define("edit-personaldata-page", EditPersonalData);
