import { Router } from "@vaadin/router";

export class Home extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <header-component></header-component>
    <div class="home-container">
      <img src="https://cdn-icons-png.flaticon.com/512/3636/3636172.png"/>
      <div class="home-info">
        <h1>Pet Finder App</h1>
        <h5>Encontrá y reportá mascotas perdidas cerca de tu ubicación.</h5>
        <button class="location">Dar mi ubicación</button>
        <button class="instructions">Cómo funciona Pet Finder?</button>
        <div class="login">
          <a class="go-login" href="#">Iniciar sesión</a>
          <a class="go-register"href="#">Registrarse</a>
        </div>
      </div>    
    </div>   

    <style>
       .home-container{
       padding: 60px 30px;
       display: flex;
       flex-direction: column;
       justify-content: center;
       align-items: center;
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

      h5{
      font-size: 20px;
      text-align: center;
      margin-bottom: 40px;
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
    
    .login{
    display: flex;
    gap: 25px;
    }

    a{
    text-decoration: none;
    color:rgb(68, 101, 128);
    font-style: bold;
    font-size: 18px;
    }
    </style>
       `;

    const loginEl = this.querySelector(".go-login") as HTMLElement;
    loginEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/login");
    });
    const registerEl = this.querySelector(".go-register") as HTMLElement;
    registerEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/register");
    });
    const instructionsEl = this.querySelector(".instructions") as HTMLElement;
    instructionsEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/info");
    });
  }
}

customElements.define("home-page", Home);
