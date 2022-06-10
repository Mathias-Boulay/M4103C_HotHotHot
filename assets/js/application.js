import { qs, qsa, createElement } from "./utils/utils.js";

/* Classe de création de l'interface d'application */

export class Application {

    constructor() {
        this.header;
        this.userName;
        this.connectionState;
        this.linksMenu;  
        this.linkHome;      
        this.linkHistory; 
        this.linkAlerts;   
        this.switcher;    
        this.tabsContainer;         
        this.tabHome;        
        this.tabHistory;     
        this.tabAlerts;

        this.previousTabPosition = "tabHome";

        /* Création des éléments HTML */
                                      //        ___________________________________________________________________________________________________________________
        this.constructHTML = () => {  //        |   Type   |                        Attributs, Datasets & Inner Texts                        |    Elément Parent  |
                                      //        |d'Element_|_________________________________________________________________________________|__def:document.body_|
            this.header          = createElement("section",{id             :"header"                                                         }                   );
            this.userName        = createElement(  "span" ,{id             :"userName"        ,text  :"Mitchel"                              },       this.header);
            this.connectionState = createElement(  "span" ,{id             :"connectionState" ,text  :"Déconnexion"                          },       this.header);
            this.linksMenu       = createElement(   "ul"  ,{class          :"tabMenu"         ,                               role :"tablist"}                   );
            this.switcher        = createElement(  "span" ,{id             :"switcher"        ,                                              },    this.linksMenu);
            this.linkHome        = createElement(   "li"  ,{"data-target"  :"tabHome"         ,class :"active"               ,role :"tab"    },    this.linksMenu);
            const anchorHome     = createElement(   "a"   ,{                                   text  :"Accueil"              ,href :"#"      },     this.linkHome);
            this.linkHistory     = createElement(   "li"  ,{"data-target"  :"tabHistory"                                     ,role :"tab"    },    this.linksMenu);
            const anchorHistory  = createElement(   "a"   ,{                                   text  :"Historique"           ,href :"#"      },  this.linkHistory);
            this.linkAlerts      = createElement(   "li"  ,{"data-target"  :"tabAlerts"                                      ,role :"tab"    },    this.linksMenu);
            const anchorAlerts   = createElement(   "a"   ,{                                   text  :"Alertes"              ,href :"#"      },   this.linkAlerts);
            this.tabsContainer   = createElement(  "div"  ,{class          :"tabsContainer"                                                  }                   );
            this.tabHome         = createElement(  "div"  ,{id:"tabHome"   ,class:"tabContent","aria-labelledby":   "tabHome",role:"tabpanel"},this.tabsContainer);
            this.tabHistory      = createElement(  "div"  ,{id:"tabHistory",class:"tabContent","aria-labelledby":"tabHistory",role:"tabpanel"},this.tabsContainer);
            this.tabAlerts       = createElement(  "div"  ,{id:"tabAlerts" ,class:"tabContent","aria-labelledby": "tabAlerts",role:"tabpanel"},this.tabsContainer);
            this.links           =      qsa     (".tabMenu li");
            this.contents        =      qsa     (".tabContent");
        }                                      

        /* Comportement des onglets */

        this.setTabsBehavior = () => {

            let  firstUse = false; // Permet de ne pas déclencher l'animation au premier affichage de l'onglet Accueil (Home)
            
            const OPT_TXT = ".4s forwards ease-in-out";

            const L2RI    = `leftToRightIn  ${OPT_TXT}`;
            const L2RO    = `leftToRightOut ${OPT_TXT}`;
            const R2LI    = `rightToLeftIn  ${OPT_TXT}`;
            const R2LO    = `rightToLeftOut ${OPT_TXT}`;

            const HOHI    = `homeToHistory  ${OPT_TXT}`;
            const HIAL    = `historyToAlerts${OPT_TXT}`;
            const ALHI    = `alertsToHistory${OPT_TXT}`;
            const HIHO    = `historyToHome  ${OPT_TXT}`;
            const ALHO    = `alertsToHome   ${OPT_TXT}`;
            const HOAL    = `homeToAlerts   ${OPT_TXT}`;

            const toggle  = (targetId) => {
                
                if (firstUse === false) { firstUse = true;switcher.innerText="Accueil"; return; }

                this.contents.forEach(  (element)  => {                      
                    element.classList                                  [element.id === targetId ? "add" : "remove"]("active");
                    qs(`[data-target="${element.id}"]`).classList      [element.id === targetId ? "add" : "remove"]("active");

                    if(tabHome.classList.contains("active") && firstUse) {
                        switch(this.previousTabPosition) {
                            case "tabHistory" : tabHome.style.animation    = L2RI; tabHistory.style.animation          = L2RO; 
                                                switcher.style.animation   = HIHO; switcher.innerText="Accueil"        ;break;
                            case "tabAlerts"  : tabHome.style.animation    = L2RI; tabAlerts.style.animation           = L2RO;
                                                switcher.style.animation   = ALHO; switcher.innerText="Accueil"        ;break;
                        }
                        this.previousTabPosition = "tabHome";
                    }
                    if(tabHistory.classList.contains("active")) {
                        switch(this.previousTabPosition) {
                            case "tabHome"    : tabHistory.style.animation = R2LI; tabHome.style.animation             = R2LO;
                                                switcher.style.animation   = HOHI; switcher.innerText="  Historique  " ;break;
                            case "tabAlerts"  : tabHistory.style.animation = L2RI; tabAlerts.style.animation           = L2RO;
                                                switcher.style.animation   = ALHI; switcher.innerText="  Historique  " ;break;
                        }
                        this.previousTabPosition = "tabHistory";
                    }
                    if(tabAlerts.classList.contains("active")) {
                        switch(this.previousTabPosition) {
                            case "tabHome"    : tabAlerts.style.animation  = R2LI; tabHome.style.animation             = R2LO;
                                                switcher.style.animation   = HOAL; switcher.innerText="Alertes"        ;break;
                            case "tabHistory" : tabAlerts.style.animation  = R2LI; tabHistory.style.animation          = R2LO; 
                                                switcher.style.animation   = HIAL; switcher.innerText="Alertes"        ;break;
                        }
                        this.previousTabPosition = "tabAlerts";
                    }
                })
            }
            this.links.forEach( (link) => {
                link.addEventListener("click", () => { toggle(link.dataset.target); });
                if (link.className.includes("active")) toggle(link.dataset.target);
            })
        };
        this.create = () => {
            this.constructHTML();
            this.setTabsBehavior();
        };
    }
}

/* Instanciation d'une application */

/* -> * /
 
const app = new Application();
app.create();  

/**/