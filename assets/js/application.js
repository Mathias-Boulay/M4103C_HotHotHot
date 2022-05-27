import { qs, qsa, createElement } from "./utils/utils.js";

/* Classe de création de l'interface d'application */

export class Application {

    constructor() {
        this.tabPosition = "left";

        /* Création des éléments HTML */
                                      //         ___________________________________________________________________________________________________________________
        this.constructHTML = () => {  //         |Type Elément|                        Attributs, Datasets & Inner Texts                        |  Elément Parent  |
                                      //         |____________|_________________________________________________________________________________(def:document.body)|
            this.header           = createElement( "section" ,{id:"header"                                                                      }                 );
            this.userName         = createElement(   "span"  ,{id:"userName"                     ,text:"Mitchel"                                },          header);
            this.connectionState  = createElement(   "span"  ,{id:"connectionState"              ,text:"Déconnexion"                            },          header);
            this.tileMenu         = createElement(    "ul"   ,{class:"tabMenu"                   ,                               role:"tablist" }                 );
            this.tileHome         = createElement(    "li"   ,{"data-target":"tabHome"           ,class:"active",                role:"tab"     },   this.tileMenu);
            const linkTileHome    = createElement(    "a"    ,{href:"#"                          ,text:"Accueil"                                },   this.tileHome);
            this.tileHistory      = createElement(    "li"   ,{"data-target":"tabHistory"        ,                               role:"tab"     },   this.tileMenu);
            const linkTileHistory = createElement(    "a"    ,{href:"#"                          ,text:"Historique"                             },this.tileHistory);
            this.tileAlerts       = createElement(    "li"   ,{"data-target":"tabAlerts"         ,                               role:"tab"     },   this.tileMenu);
            const linkTileAlerts  = createElement(    "a"    ,{href:"#"                          ,text:"Alertes"                                }, this.tileAlerts);
            this.links            =      qsa     (".tabMenu li"                                                                                                   );
            this.tabs             = createElement(   "div"   ,{class:"tabs"                                                                     }                 );
            this.tabHome          = createElement(   "div"   ,{id:"tabHome",   class:"tabContent","aria-labelledby":   "tabHome",role:"tabpanel"},       this.tabs);
            this.tabHistory       = createElement(   "div"   ,{id:"tabHistory",class:"tabContent","aria-labelledby":"tabHistory",role:"tabpanel"},       this.tabs);
            this.tabAlerts        = createElement(   "div"   ,{id:"tabAlerts", class:"tabContent","aria-labelledby": "tabAlerts",role:"tabpanel"},       this.tabs);
            this.contents         =      qsa     (".tabContent"                                                                                                   );
        }                                      

        /* Comportement des onglets (tabs) */

        this.setTabsBehavior = () => {
            let firstTime = false; // permet de ne pas déclencher l'animation au premier affichage de l'onglet Accueil (Home)
            
            const OPT_TXT = ".4s forwards ease-in-out";
            const L2RI    = "leftToRightIn"  + OPT_TXT;
            const L2RO    = "leftToRightOut" + OPT_TXT;
            const R2LI    = "rightToLeftIn"  + OPT_TXT;
            const R2LO    = "rightToLeftOut" + OPT_TXT;

            const toggle = (targetId) => {
                if (firstTime === false){ firstTime = true; return; }

                this.contents.forEach( (element) => {  
                    qs(`[data-target="${element.id}"]`).classList[element.id === targetId ? "add" : "remove"]("active");
                    element.classList[element.id === targetId ? "add" : "remove"]("active");

                    if(tabHome.classList.contains("active") && firstTime) {
                        if (this.tabPosition !== "right")  tabHistory.style.animation = L2RO;
                        tabAlerts.style.animation       =  L2RO;
                        tabHome.style.animation         =  L2RI;
                        this.tabPosition                = "left";
                    }
                    if(tabHistory.classList.contains("active")) {
                        if (this.tabPosition !== "right") {
                            tabHome.style.animation     =  R2LO;                        
                            tabHistory.style.animation  =  R2LI;
                            return;
                        }
                        tabAlerts.style.animation       =  L2RO;
                        tabHistory.style.animation      =  L2RI;
                        this.tabPosition                = "middle";
                    }
                    if(tabAlerts.classList.contains("active")) {
                        if (this.tabPosition !== "middle") tabHome.style.animation = R2LO;                     
                        tabHistory.style.animation      =  R2LO;                  
                        tabAlerts.style.animation       =  R2LI;                        
                        this.tabPosition                = "right";
                    }
                });
            }
            this.links.forEach( (link) => {
                link.addEventListener( "click", () => { toggle(link.dataset.target); });
                if (link.className.includes("active"))  toggle(link.dataset.target);
            })
        }
        this.create = () => {
            this.constructHTML();
            this.setTabsBehavior();
        }
    }
}

/* Instanciation d'une application */

/* -> * /
 
const app = new Application();
app.create(); 

/**/
