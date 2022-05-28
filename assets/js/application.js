import { qs, qsa, createElement } from "./utils/utils.js";

/* Classe de création de l'interface d'application */

export class Application {

    constructor() {

        this.tabPosition = "tabHome";

        /* Création des éléments HTML */
                                      //        _________________________________________________________________________________________________________________
        this.constructHTML = () => {  //        |   Type   |                        Attributs, Datasets & Inner Texts                        |  Elément Parent  |
                                      //        |d'Element_|_________________________________________________________________________________|_def:document.body|
            this.header          = createElement("section",{id             :"header"                                                         }                 );
            this.userName        = createElement(  "span" ,{id             :"userName"        ,text :"Mitchel"                               },          header);
            this.connectionState = createElement(  "span" ,{id             :"connectionState" ,text :"Déconnexion"                           },          header);
            this.linksMenu       = createElement(   "ul"  ,{class          :"tabMenu"         ,                               role:"tablist" }                 );
            this.linkHome        = createElement(   "li"  ,{"data-target"  :"tabHome"         ,class:"active",                role:"tab"     },  this.linksMenu);
            const anchorHome     = createElement(   "a"   ,{href           :"#"               ,text :"Accueil"                               },   this.linkHome);
            this.linkHistory     = createElement(   "li"  ,{"data-target"  :"tabHistory"      ,                               role:"tab"     },  this.linksMenu);
            const anchorHistory  = createElement(   "a"   ,{href           :"#"               ,text :"Historique"                            },this.linkHistory);
            this.linkAlerts      = createElement(   "li"  ,{"data-target"  :"tabAlerts"       ,                               role:"tab"     },  this.linksMenu);
            const anchorAlerts   = createElement(   "a"   ,{href           :"#"               ,text :"Alertes"                               }, this.linkAlerts);
            this.tabs            = createElement(  "div"  ,{class          :"tabs"                                                           }                 );
            this.tabHome         = createElement(  "div"  ,{id:"tabHome"   ,class:"tabContent","aria-labelledby":   "tabHome",role:"tabpanel"},       this.tabs);
            this.tabHistory      = createElement(  "div"  ,{id:"tabHistory",class:"tabContent","aria-labelledby":"tabHistory",role:"tabpanel"},       this.tabs);
            this.tabAlerts       = createElement(  "div"  ,{id:"tabAlerts" ,class:"tabContent","aria-labelledby": "tabAlerts",role:"tabpanel"},       this.tabs);
            
            this.links           =      qsa     (".tabMenu li");
            this.contents        =      qsa     (".tabContent");
        }                                      

        /* Comportement des onglets */

        this.setTabsBehavior = () => {

            let firstUse = false; // Permet de ne pas déclencher l'animation au premier affichage de l'onglet Accueil (Home)
            
            const OPT_TXT = ".4s forwards ease-in-out";
            const L2RI    = `leftToRightIn ${OPT_TXT}`;
            const L2RO    = `leftToRightOut${OPT_TXT}`;
            const R2LI    = `rightToLeftIn ${OPT_TXT}`;
            const R2LO    = `rightToLeftOut${OPT_TXT}`;

            const toggle = (targetId) => {
                
                if (firstUse === false) { firstUse = true; return; }

                this.contents.forEach( (element) => {                      
                    element.classList                                 [element.id === targetId ? "add" : "remove"]("active");
                    qs(`[data-target="${element.id}"]`).classList     [element.id === targetId ? "add" : "remove"]("active");

                    if(tabHome.classList.contains("active") && firstUse) {
                        switch(this.tabPosition) {
                            case "tabHistory"  : tabHome.style.animation    = L2RI; tabHistory.style.animation = L2RO; break;
                            case "tabAlerts"   : tabHome.style.animation    = L2RI; tabAlerts.style.animation  = L2RO; break;
                        }
                        this.tabPosition = "tabHome";
                    }
                    if(tabHistory.classList.contains("active")) {
                        switch(this.tabPosition) {
                            case "tabHome"     : tabHistory.style.animation = R2LI; tabHome.style.animation    = R2LO; break;
                            case "tabAlerts"   : tabHistory.style.animation = L2RI; tabAlerts.style.animation  = L2RO; break;
                        }
                        this.tabPosition = "tabHistory";
                    }
                    if(tabAlerts.classList.contains("active")) {
                        switch(this.tabPosition) {
                            case "tabHome"     : tabAlerts.style.animation  = R2LI; tabHome.style.animation    = R2LO; break;
                            case "tabHistory"  : tabAlerts.style.animation  = R2LI; tabHistory.style.animation = R2LO; break;
                        }
                        this.tabPosition = "tabAlerts";
                    }
                });
            }
            this.links.forEach( (link) => {
                link.addEventListener("click", () => { toggle(link.dataset.target); });
                if (link.className.includes("active")) toggle(link.dataset.target);
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