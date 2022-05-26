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

        this.tabPosition = "left";

        this.onglets = () => {
            
            const toggle = (targetId) => {
                this.contenus.forEach((element) => {
 
                    qs(`[data-target="${element.id}"]`).classList[element.id === targetId ? "add" : "remove"]("active");
                    element.classList[element.id === targetId ? "add" : "remove"]("active");
                    element.classList[element.id === targetId ? "remove" : "add"]("unactive");
                    
                    if(tabHome.classList.contains("active")) {
                        if (this.tabPosition === "right"){
                            tabAlerts.style.animation="leftToRightOut .4s forwards ease-in-out";
                        }
                        else tabHistory.style.animation="leftToRightOut .4s forwards ease-in-out";
                        this.tabPosition = "left";
                        tabHome.style.animation="leftToRightIn .4s forwards ease-in-out";
                    }
                    if(tabHistory.classList.contains("active")) {
                        if (this.tabPosition === "right"){
                            tabAlerts.style.animation="leftToRightOut .4s forwards ease-in-out";
                            tabHistory.style.animation="leftToRightIn .4s forwards ease-in-out";
                        }
                        else {
                            tabHome.style.animation="rightToLeftOut .4s forwards ease-in-out";                        
                            tabHistory.style.animation="rightToLeftIn .4s forwards ease-in-out";
                        }
                        this.tabPosition = "middle";
                    }
                    if(tabAlerts.classList.contains("active")) {
                        if (this.tabPosition === "middle"){
                            tabHistory.style.animation="rightToLeftOut .4s forwards ease-in-out";
                        }
                        else tabHome.style.animation="rightToLeftOut .4s forwards ease-in-out";
                        this.tabPosition = "right";
                        tabAlerts.style.animation="rightToLeftIn .4s forwards ease-in-out";
                    }
                });
            }
            console.log("tabHome",tabHome.style);
            console.log("tabHistory",tabHistory.style);
            console.log("tabAlerts",tabAlerts.style);
            
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