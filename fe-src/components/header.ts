import { Router } from "@vaadin/router";
import { state } from "../state";

export function initHeader() {
  customElements.define(
    "header-component",
    class extends HTMLElement {
      constructor() {
        super();
        this.render();
      }

      render() {
        const shadow = this.attachShadow({ mode: "open" });
        const divEl = document.createElement("div");
        const currentState = state.getState();
        const loginText = currentState.isLoggedIn
          ? "Cerrar sesión"
          : "Iniciar sesión";

        divEl.innerHTML = `
                <div class="header-container">
            <img class="map-img" src="https://png.pngtree.com/png-clipart/20230916/original/pngtree-google-map-icon-vector-png-image_12256715.png"/>
            <div class="menu-icon">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>  
            <div class="menu">
                <li class="menu-info">Mis datos</li>
                <li class="menu-reports">Mis mascotas reportadas</li>
                <li class="menu-new-report">Reportar mascota</li>
                <li class="menu-login">${loginText}</li>
            </div>    
        </div>
        <div class="overlay">
            <div class="close-button">✖</div>
            <ul class="overlay-menu">
                <li class="menu-info">Mis datos</li>
                <li class="menu-reports">Mis mascotas reportadas</li>
                <li class="menu-new-report">Reportar mascota</li>
                <li class="menu-login">${loginText}</li>
            </ul>
        </div>
        `;

        shadow.appendChild(divEl);

        const style = document.createElement("style");
        style.textContent = `
        .header-container{
        height: 60px;
        background-color: #799ab5; 
        padding: 10px 10px 0px 10px;
        display: flex;
        justify-content: space-between;
        }

        @media (min-width: 450px) {
            .header-container {
            padding: 10px 20px 0px 20px;
            }
        }

        @media (min-width: 768px) {
            .header-container {
             height: 80px;
            }
        }

        img{
        height: 50px;
        width: 50px;
        cursor: pointer;
        }

        @media (min-width: 768px) {
             img{
             height: 70px;
             width: 70px;
        }
        }

        .menu-icon {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 14px;
        width: 30px;
        height: 25px;
        cursor: pointer;
        }

        @media (min-width: 768px) {
            .menu-icon {
            display: none;
            }
        }

        .bar {
        width: 100%;
        height: 5px;
        background-color: #013867;
        }

        .menu{
        color: #013867;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 30px;
        }

        @media (max-width: 768px) {
            .menu {
            display: none;
            }
        }
        
        @media (min-width: 1085px) {
            .menu {
             font-size: 24px;
            }
        }
        
        li{
        list-style-type: none;
        cursor: pointer;
        }

        /* Overlay styles */
        .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 100;
        }

        .overlay.active {
        display: flex;
        }

        .overlay-menu {
        color: white;
        font-size: 24px;
        text-align: center;
        }

        .overlay-menu li {
        margin: 15px 0;
        }

        .close-button {
        position: absolute;
        top: 10px;
        right: 20px;
        color: white;
        font-size: 30px;
        cursor: pointer;
        }
        `;
        shadow.appendChild(style);

        const menuIcon = divEl.querySelector(".menu-icon") as HTMLDivElement;
        const overlayEl = divEl.querySelector(".overlay") as HTMLDivElement;
        const closeButton = divEl.querySelector(
          ".close-button"
        ) as HTMLButtonElement;
        const imgEl = shadow.querySelector(".map-img") as HTMLImageElement;

        divEl.querySelector(".menu-info")?.addEventListener("click", () => {
          Router.go("/personal-data");
        });

        overlayEl.querySelector(".menu-info")?.addEventListener("click", () => {
          Router.go("/personal-data");
          overlayEl.classList.remove("active");
        });

        menuIcon.addEventListener("click", () => {
          overlayEl.classList.add("active");
        });

        closeButton.addEventListener("click", () => {
          overlayEl.classList.remove("active");
        });

        imgEl.addEventListener("click", (e) => {
          e.preventDefault();
          Router.go("/home");
        });
      }
    }
  );
}
