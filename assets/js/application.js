import { qs,qsa } from "./utils/utils.js";

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
                    
                    if(tabHome.classList.contains("active")) {
                    tabHistory.style.removeProperty("left");
                    tabHistory.style.right="0";
                    tabHistory.style.width="0";
                    tabAlerts.style.width="0";
                    // qs(".onglets").style.background= "center no-repeat url('epicLandscape.jpg')";
                    }
                    if(tabHistory.classList.contains("active")) {
                    // qs(".onglets").style.background= "center no-repeat url('sunnyLandscape.jpg')";
                    tabHistory.style.animation="homeTransition .4s forwards ease-in-out";
                    tabAlerts.style.animation="reverse homeTransition .4s forwards ease-in-out";
                    tabAlerts.style.removeProperty("animation");
                    }
                    if(tabAlerts.classList.contains("active")) {
                    tabHistory.style.left="0";
                    tabHistory.style.removeProperty("right");
                    //   qs(".onglets").style.background= "center no-repeat url('epicLandscape.jpg')";
                    // 
                    tabAlerts.style.animation="homeTransition .4s forwards ease-in-out";
                    }
                
                    console.log(tabHistory.style);
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