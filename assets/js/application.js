import { qs, qsa, createElement, addGlobalEventListener } from "./utils/utils.js";
import HistoryTabView from "./tab_view/HistoryTabView";
import {AlertsTabView} from "./tab_view/AlertsTabView";
import HomeTabView from "./tab_view/HomeTabView";

/* Classe de création de l'interface d'application */

export class Application extends Object {

    /* Container for TabView */
    #homeTabView;
    #alertTabView;
    #historyTabView;

    #tmpEventClient = 0;
    #prevPosX = 0;
    
    constructor() {
        super();
        this.previousTabPosition = "tabHome";
        this.screenWidth = window.innerWidth;
        window.addEventListener("resize", ()=> {this.screenWidth = window.innerWidth;});
        
    }

    /* Création des éléments HTML */
                                  //        _____________________________________________________________________________________________________________________
    #constructHTML = () => {      //        |   Type    |                        Attributs, Datasets & Inner Texts                        |    Elément Parent   |
                                  //        |_d'Element_|_________________________________________________________________________________|__def:document.body__|
        this.header          = createElement( "header" ,{id             :"header"                                                         }                    );
        this.userName        = createElement(  "span"  ,{id             :"userName"        ,text  :""                                     },        this.header);
        this.connectionState = createElement(  "span"  ,{id             :"connectionState" ,text  :"Connection"                           },        this.header);
        this.fakeOverlay     = createElement(  "div"   ,{id             : "fakeOverlay"                                                   }                    );
        this.fakeConnection  = createElement(  "form"  ,{id             :"fakeConnection"                                                 },  this.fakeOverlay );
        this.fakeLabel       = createElement(  "label" ,{id:"fakeLabel" ,for:"fakeInput"   ,text:"Connection"                             },this.fakeConnection);
        this.fakeInput       = createElement(  "input" ,{id:"fakeInput" ,placeholder:"Nom" ,type:"text"                   ,name:"name"    },this.fakeConnection);
        this.fakeButton      = createElement( "button" ,{id:"fakeButton",type:"submit"                                                    },this.fakeConnection);
        this.linksMenu       = createElement(   "ul"   ,{class          :"linksMenu"                                      ,role :"tablist"},        this.header);
        this.switcher        = createElement(  "span"  ,{id             :"switcher"                                                       },     this.linksMenu);
        this.linkHome        = createElement(   "li"   ,{"data-target"  :"tabHome"         ,class :"active"               ,role :"tab"    },     this.linksMenu);
        const anchorHome     = createElement(   "a"    ,{                                   text  :"Accueil"              ,href :"#"      },      this.linkHome);
        this.linkHistory     = createElement(   "li"   ,{"data-target"  :"tabHistory"                                     ,role :"tab"    },     this.linksMenu);
        const anchorHistory  = createElement(   "a"    ,{                                   text  :"Historique"           ,href :"#"      },   this.linkHistory);
        this.linkAlerts      = createElement(   "li"   ,{"data-target"  :"tabAlerts"                                      ,role :"tab"    },     this.linksMenu);
        const anchorAlerts   = createElement(   "a"    ,{                                   text  :"Alertes"              ,href :"#"      },    this.linkAlerts);
        this.tabsContainer   = createElement(  "div"   ,{class          :"tabsContainer"                                                  }                    );
        this.tabHome         = createElement(  "div"   ,{id:"tabHome"   ,class:"tabContent","aria-labelledby":   "tabHome",role:"tabpanel"}, this.tabsContainer);
        this.tabHistory      = createElement(  "div"   ,{id:"tabHistory",class:"tabContent","aria-labelledby":"tabHistory",role:"tabpanel"}, this.tabsContainer);
        this.tabAlerts       = createElement(  "div"   ,{id:"tabAlerts" ,class:"tabContent","aria-labelledby": "tabAlerts",role:"tabpanel"}, this.tabsContainer);
        this.links           =      qsa     (".linksMenu li");
        this.contents        =      qsa     (".tabContent");

        // Link the tabViews
        this.#homeTabView = new HomeTabView();
        this.#historyTabView = new HistoryTabView();
        this.#alertTabView = new AlertsTabView();
        this.#homeTabView.load()
        this.#historyTabView.load();
        this.#alertTabView.load();
       
       let connected =false;
        this.connectionState.addEventListener("click", () =>{
            if(connected) {
                connected = false;
                this.userName.innerText ="";
                this.connectionState.innerText="Connection";
                return;
            }
                this.fakeOverlay.style.display="flex";
                this.fakeConnection.style.display="flex";
        });
        this.fakeButton.addEventListener("click", () =>{
            if (this.fakeInput.value !== ""){
                connected = true;
                this.userName.innerText = this.fakeInput.value;
                this.connectionState.innerText="Déconnection";
                this.fakeOverlay.style.display="none";
                this.fakeConnection.style.display="none";
            }
            else {
                this.userName.innerText ="";
                connected = false;
                this.connectionState.innerText="Connection";
                this.fakeOverlay.style.display="none";
            }
        });

        // hide the fake connection modal while clicking out of it
        this.fakeOverlay.addEventListener("click", (e) => {
            const eT = e.target;
            if(eT != this.fakeConnection && eT != this.fakeInput && eT != this.fakeLabel){
                this.fakeOverlay.style.display="none";
                this.fakeInput.value = "";
            }             
        })     
    }

    /* Comportement des onglets */

    #setTabsBehavior = () => {
        let  firstUse = false; // Permet de ne pas déclencher l'animation au premier affichage de l'onglet Accueil (Home)

        const OPT_TXT = ".7s forwards ease-in-out";
        const OPT_TXT2 = ".7s forwards ease-in-out";

        const L2RI    = `leftToRightIn   ${OPT_TXT}`;
        const L2RO    = `leftToRightOut  ${OPT_TXT}`;
        const R2LI    = `rightToLeftIn   ${OPT_TXT}`;
        const R2LO    = `rightToLeftOut  ${OPT_TXT}`;

        const HOHI    = `homeToHistory  ${OPT_TXT2}`;
        const HIAL    = `historyToAlerts${OPT_TXT2}`;
        const ALHI    = `alertsToHistory${OPT_TXT2}`;
        const HIHO    = `historyToHome  ${OPT_TXT2}`;
        const ALHO    = `alertsToHome   ${OPT_TXT2}`;
        const HOAL    = `homeToAlerts   ${OPT_TXT2}`;

        const toggle  = (targetId) => {
            if (firstUse === false) { firstUse = true; switcher.innerText="Accueil"; return; }

            this.contents.forEach(  (element)  => {
                element.classList                                  [element.id === targetId ? "add" : "remove"]("active");
                qs(`[data-target="${element.id}"]`).classList      [element.id === targetId ? "add" : "remove"]("active");

                if(this.tabHome.classList.contains("active") && firstUse) {
                    switch(this.previousTabPosition) {
                        case "tabHistory" : this.tabHome.style.animation = L2RI; this.tabHistory.style.animation = L2RO;
                            this.switcher.style.animation = HIHO; this.switcher.innerText="Accueil"; break;
                        case "tabAlerts"  : this. tabHome.style.animation = L2RI;this. tabAlerts.style.animation = L2RO;
                            this. switcher.style.animation = ALHO; this.switcher.innerText="Accueil"; break;
                    }
                    this.previousTabPosition = "tabHome";
                }
                if(this.tabHistory.classList.contains("active")) {
                    switch(this.previousTabPosition) {
                        case "tabHome" : this.tabHistory.style.animation = R2LI; this.tabHome.style.animation = R2LO;
                            this.switcher.style.animation = HOHI; this.switcher.innerText="  Historique  "; break;
                        case "tabAlerts" : this.tabHistory.style.animation = L2RI; this.tabAlerts.style.animation = L2RO;
                            this.switcher.style.animation = ALHI; this.switcher.innerText="  Historique  "; break;
                    }
                    this.previousTabPosition = "tabHistory";
                }
                if(this.tabAlerts.classList.contains("active")) {
                    switch(this.previousTabPosition) {
                        case "tabHome" : this.tabAlerts.style.animation  = R2LI; this.tabHome.style.animation = R2LO;
                            this.switcher.style.animation = HOAL; this.switcher.innerText="Alertes"; break;
                        case "tabHistory" : this.tabAlerts.style.animation  = R2LI; this.tabHistory.style.animation = R2LO;
                            this.switcher.style.animation = HIAL; this.switcher.innerText="Alertes"; break;
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

    #startup() {
        const d =  document;
        d.addEventListener("pointerdown", this.#handleStart.bind(this));
        d.addEventListener("pointerup", this.#handleEnd.bind(this));
        d.addEventListener("pointercancel", this.#handleCancel.bind(this));
        d.addEventListener("pointermove", this.#handleMove.bind(this));
    }

    #handleStart(evt){
        // evt.preventDefault();
        this.#prevPosX = evt.clientX
    }


    #handleMove(evt) {
        evt.preventDefault();
        this.#tmpEventClient=evt.clientX
    }

    #handleEnd(evt) {
        evt.preventDefault();
       // let screenPortionToMove = this.screenWidth * 1 / 10;
        let diffPos = this.#prevPosX - evt.clientX;
        if(this.previousTabPosition == "tabHome"){
            if(diffPos > 0 && evt.pointerType == "mouse")  this.linkHistory.click()
        }
        else if(this.previousTabPosition == "tabHistory"){
            if(diffPos > 0 && evt.pointerType == "mouse") this.linkAlerts.click()
            if(diffPos  < 0 && evt.pointerType == "mouse")this.linkHome.click()
        }
        else if(this.previousTabPosition == "tabAlerts"){
            if(diffPos > 0 && evt.pointerType == "mouse") this.linkAlerts.click()
            if(diffPos  < 0 && evt.pointerType == "mouse")this.linkHistory.click()
        }
    }

    #handleCancel(evt) {
        let diffPos = this.#tmpEventClient - this.#prevPosX;

        if(this.previousTabPosition == "tabHome" && diffPos < -8.5 && evt.pointerType == "touch") this.linkHistory.click();
        else if(this.previousTabPosition == "tabHistory"){
            if(diffPos < -8.5 && evt.pointerType == "touch") this.linkAlerts.click();
            else if(diffPos > 8.5 && evt.pointerType == "touch") this.linkHome.click();
        }
        else if(this.previousTabPosition == "tabAlerts" && diffPos > 8.5 && evt.pointerType == "touch")this.linkHistory.click();

        evt.preventDefault();
    }
    
    create() {
        this.#constructHTML();
        this.#setTabsBehavior();
        this.#startup()
    };
}