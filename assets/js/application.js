import { qs,qsa } from "../utils/utils.js";

class Application{

    constructor(){
        this.buttonHome     = qs("#buttonHome");
        this.buttonHistory  = qs("#buttonHistory");
        this.buttonAlerts   = qs("#buttonAlerts");

        this.tabHome        = qs("#tabHome");
        this.tabHistory     = qs("#tabHistory");
        this.tabAlerts      = qs("#tabAlerts");

        this.liens          = qsa(".tabMenu li");
        this.contenus       = qsa(".tabContenu");

        this.onglets = () => {
            
            const toggle = (targetId) => {
                this.contenus.forEach((element) => {
                    // setTimeout(() => {
                    //   // element.style.display = element.id === targetId ? "flex" : "none";
                    
                    // }, 110);
                    qs(`[data-target="${element.id}"]`).classList[element.id === targetId ? "add" : "remove"]("active");
                    element.classList[element.id === targetId ? "add" : "remove"]("active");
                    element.classList[element.id === targetId ? "remove" : "add"]("unactive");
                    
                    if(this.tabHome.classList.contains("active")) {
                        this.tabHistory.style.removeProperty("left");
                        this.tabHistory.style.right="0";
                        this.tabHistory.style.width="0";
                        this.tabAlerts.style.width="0";
                        // qs(".onglets").style.background= "center no-repeat url('epicLandscape.jpg')";
                    }
                    if(this.tabHistory.classList.contains("active")) {
                        // qs(".onglets").style.background= "center no-repeat url('sunnyLandscape.jpg')";
                        this.tabHistory.style.animation="homeTransition .4s forwards ease-in-out";
                        this.tabAlerts.style.animation="reverse homeTransition .4s forwards ease-in-out";
                        this.tabAlerts.style.removeProperty("animation");
                    }
                    if(this.tabAlerts.classList.contains("active")) {
                        this.tabHistory.style.left="0";
                        this.tabHistory.style.removeProperty("right");
                        //   qs(".onglets").style.background= "center no-repeat url('epicLandscape.jpg')";
                        // 
                        this.tabAlerts.style.animation="homeTransition .4s forwards ease-in-out";
                    }
                
                    console.log(this.tabHistory.style);
                });
            }
        
            this.liens.forEach((lien) => {
                lien.addEventListener("click", () => {
                    toggle(lien.dataset.target);
                });
                if (lien.className.includes("active")) {
                    toggle(lien.dataset.target);
                }
            })
        }
    }
}
const app = new Application();
app.onglets();