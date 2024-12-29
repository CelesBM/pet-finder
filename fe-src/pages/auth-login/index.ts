import { Router } from "@vaadin/router";
import { state } from "../../state";

export class AuthLogin extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <header-component></header-component>
    <div class="login-container">
      <img src="https://cdn-icons-png.flaticon.com/512/3636/3636172.png"/>
      <h1>Ingresar</h1>
      <p>Ingresá tus datos para continuar.</p>
      <div class="login">
        <form>
            <label for="email">EMAIL:</label>
            <input type="email" id="email" class="email" name="email" autocomplete="email" required>
             <label for="password">CONTRASEÑA:</label>
            <input type="password" id="password" class="password" name="password" autocomplete="password" required>
            <button type="submit" class="button">Iniciar sesión</button>
        </form>
         <p class="error-message" style="color: red; display: none;"></p>
        <p>Aún no tenes cuenta? <a href="/register">Registrate</a>.</p>
      </div>    
    </div>   

    <style>
       .login-container{
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
       
       img{
       height: 200px; 
       }

      @media (min-width: 1085px) {
          img {
          height: 250px;
          }
      }

      .home-info{
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;
      align-items: center;
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
    const emailEl = this.querySelector(".email") as HTMLInputElement;
    const passwordEl = this.querySelector(".password") as HTMLInputElement;
    const errorMessageEl = this.querySelector(".error-message") as HTMLElement;

    buttonEl.addEventListener("click", async (e) => {
      e.preventDefault();
      const currentState = state.getState();
      currentState.email = emailEl.value;
      currentState.password = passwordEl.value;

      //ACA VA LA LOGICA DEL LOGIN
      /*await state.signUp(); 
      if (currentState.errorMessage) {
        errorMessageEl.textContent = currentState.errorMessage;
        errorMessageEl.style.display = "block";
      } else {
        errorMessageEl.style.display = "none";
        console.log("Cuenta creada con éxito");
        Router.go("/login");
      }*/
    });
  }
}

customElements.define("login-page", AuthLogin);
