import { qs, qsa, createElement, addGlobalEventListener } from "./utils/utils.js";

/* Classe de création de l'interface d'application */
function c(m){console.log(m)}

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
            this.linksMenu       = createElement(   "ul"  ,{class          :"linksMenu"       ,                               role :"tablist"}                   );
            this.switcher        = createElement(  "span" ,{id             :"switcher"        ,draggable:true,                                              },    this.linksMenu);
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
            this.links           =      qsa     (".linksMenu li");
            this.contents        =      qsa     (".tabContent");
        }                                      

        /* Sliding des onglets */

        // addGlobalEventListener(
        //     "pointerdown",
        //     this.tabHome,
        //     () =>{ 

        //     }
        // );
        this.startup = () => {
            const el =  document;
            el.addEventListener('pointerdown', this.handleStart);
            el.addEventListener('pointerup', this.handleEnd);
            el.addEventListener('pointercancel', this.handleCancel);
            el.addEventListener('pointermove', this.handleMove);
            console.log('Initialisation.');
        } 

        let prevPosX;
        const ongoingTouches = [];
        this.handleStart =(evt) =>{
            evt.preventDefault();
            console.log('pointerdown.');
            const el = qs('.tabContent');

            prevPosX = evt.clientX
          }

        this.handleMove = (evt) =>{
            evt.preventDefault();
            const el = qs('.tabContent');
            if(prevPosX > evt.clientX +100) console.log("beaucoup")
            console.log(prevPosX)
            console.log(evt.clientX)
            console.log(evt)
            c(this.previousTabPosition)
            /*
            if(this.previousTabPosition == "tabHome"){
                if(prevPosX > evt.clientX && evt.pointerType == "touch") 
                qs("[data-target = 'tabHistory']").click()
                if(prevPosX < evt.clientX&& evt.pointerType == "touch")qs("[data-target = 'tabHome']").click()
            }
            else if(this.previousTabPosition == "tabHistory"){
                if(prevPosX > evt.clientX && evt.pointerType == "touch") 
                qs("[data-target = 'tabAlerts']").click()
                if(prevPosX < evt.clientX&& evt.pointerType == "touch")qs("[data-target = 'tabHome']").click()
            }
            else if(this.previousTabPosition == "tabAlerts"){
                if(prevPosX > evt.clientX +100 && evt.pointerType == "touch") 
                qs("[data-target = 'tabAlerts']").click()
                if(prevPosX < evt.clientX +100 && evt.pointerType == "touch")qs("[data-target = 'tabHistory']").click()
            }
            */
        }

          this.handleEnd = (evt) => {
            evt.preventDefault();
            c(this.previousTabPosition)
            if(this.previousTabPosition == "tabHome"){
                if(prevPosX > evt.clientX && evt.pointerType == "mouse") 
                qs("[data-target = 'tabHistory']").click()
                if(prevPosX < evt.clientX&& evt.pointerType == "mouse")qs("[data-target = 'tabHome']").click()
            }
            else if(this.previousTabPosition == "tabHistory"){
                if(prevPosX > evt.clientX && evt.pointerType == "mouse") 
                qs("[data-target = 'tabAlerts']").click()
                if(prevPosX < evt.clientX&& evt.pointerType == "mouse")qs("[data-target = 'tabHome']").click()
            }
            else if(this.previousTabPosition == "tabAlerts"){
                if(prevPosX > evt.clientX +100 && evt.pointerType == "mouse") 
                qs("[data-target = 'tabAlerts']").click()
                if(prevPosX < evt.clientX +100 && evt.pointerType == "mouse")qs("[data-target = 'tabHistory']").click()
            }
            
            console.log('touchend');
            const el =qs('.tabContent');
          }

          this.handleCancel=(evt) =>{
            if(this.previousTabPosition == "tabHome"){
                if(prevPosX > evt.clientX +100 && evt.pointerType == "touch")this.linkHistory.click()
                if(prevPosX < evt.clientX +100 && evt.pointerType == "touch")this.linkHome.click()
            }
            else if(this.previousTabPosition == "tabHistory"){
                if(prevPosX > evt.clientX +100 && evt.pointerType == "touch") this.linkAlerts.click()
                if(prevPosX < evt.clientX +100 && evt.pointerType == "touch")this.linkHome.click()
            }
            else if(this.previousTabPosition == "tabAlerts"){
                if(prevPosX > evt.clientX +100 && evt.pointerType == "touch")this.linkAlerts.click()
                if(prevPosX < evt.clientX +100 && evt.pointerType == "touch")this.linkHistory.click()
            }
            evt.preventDefault();
            console.log('touchcancel.');
          }

          function copyTouch({ identifier, pageX, pageY }) {
            return { identifier, pageX, pageY };
          }

          function ongoingTouchIndexById(idToFind) {
            for (let i = 0; i < ongoingTouches.length; i++) {
              const id = ongoingTouches[i].identifier;
          
              if (id == idToFind) {
                return i;
              }
            }
            return -1;    // non trouvé
          }

        /* Comportement des onglets */

        this.setTabsBehavior = () => {
            let  firstUse = false; // Permet de ne pas déclencher l'animation au premier affichage de l'onglet Accueil (Home)
            
            const OPT_TXT = ".8s forwards ease-in-out";
            const OPT_TXT2 = ".8s forwards ease-in-out";

            const L2RI    = `leftToRightIn  ${OPT_TXT}`;
            const L2RO    = `leftToRightOut ${OPT_TXT}`;
            const R2LI    = `rightToLeftIn  ${OPT_TXT}`;
            const R2LO    = `rightToLeftOut ${OPT_TXT}`;

            const HOHI    = `homeToHistory  ${OPT_TXT2}`;
            const HIAL    = `historyToAlerts${OPT_TXT2}`;
            const ALHI    = `alertsToHistory${OPT_TXT2}`;
            const HIHO    = `historyToHome  ${OPT_TXT2}`;
            const ALHO    = `alertsToHome   ${OPT_TXT2}`;
            const HOAL    = `homeToAlerts   ${OPT_TXT2}`;



/*********************************************************************************************************************************************** */
          
            /*
            let oldX = 0, newX = 0; // for storing X (horizontal) positions
            let element = document.getElementById("switcher"); // The element you want to drag
            let linksMenuWidth = qs(".linksMenu").offsetWidth; // let menuLimit = `${qs("linksMenu").clientX}`;
            let linkHomeWidth = qs("[data-target='tabHome']").offsetWidth; // let menuLimit = `${qs("linksMenu").clientX}`;
            let elementWidth = element.offsetWidth;
            let position;
            // We do the dragging here
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                newX = oldX - e.clientX; // to calculate how much we have moved
                oldX = e.clientX; // store current value to use for next move

                position = parseInt(element.style.left.substr(0,3));

                if(position <0 ) element.style.left = 0;
                else if(position > linksMenuWidth - elementWidth ) {element.style.left=`${linksMenuWidth - elementWidth}px`;}
                else element.style.left = (switcher.offsetLeft - newX-.9) + "px";
                if (position > linkHomeWidth)element.style.left=`${linkHomeWidth}px`;
            //if(position > 30 ) {element.style.left = 0;qs('[data-target="tabHistory"]').click();element.style.left="0%";}
            
            c(qs(".linksMenu").offsetWidth)
           c(position)
          // c(elementWidth)
            c(linkHomeWidth)
        }
        
            
            // we do this so there is not multiple event handlers
            function closeDragElement() {
              document.onmouseup = null;
              document.onmousemove = null;
            }
            
            // when mouse down on element attach mouse move and mouse up for document
            // so that if mouse goes outside element still drags
            function dragMouseDown(e) {
              e = e ?? window.event;
              e.preventDefault();
             
              oldX = e.clientX; // store current value to use for mouse move calculation
              document.onmouseup = closeDragElement;
              document.onmousemove = elementDrag;
            }
            
            element.onmousedown = dragMouseDown;

            function drop(e) {
                e.target.classList.remove('drag-over');
            
                // get the draggable element
                const id = e.dataTransfer.getData('text/plain');
                const draggable = document.getElementById(id);
            
                // add it to the drop target
                e.target.appendChild(draggable);
            
                // display the draggable element
                draggable.classList.remove('hide');
            }

            
/**************************************************************************************************************************** */




            const toggle  = (targetId) => {
                
                if (firstUse === false) { firstUse = true;switcher.innerText="Accueil"; return; }

                this.contents.forEach(  (element)  => {                      
                    element.classList                                  [element.id === targetId ? "add" : "remove"]("active");
                    qs(`[data-target="${element.id}"]`).classList      [element.id === targetId ? "add" : "remove"]("active");

                    if(this.tabHome.classList.contains("active") && firstUse) {
                        switch(this.previousTabPosition) {
                            case "tabHistory" : tabHome.style.animation    = L2RI; tabHistory.style.animation          = L2RO; 
                                                switcher.style.animation   = HIHO; switcher.innerText="Accueil"        ;break;
                            case "tabAlerts"  : tabHome.style.animation    = L2RI; tabAlerts.style.animation           = L2RO;
                                                switcher.style.animation   = ALHO; switcher.innerText="Accueil"        ;break;
                        }
                        this.previousTabPosition = "tabHome";
                    }
                    if(this.tabHistory.classList.contains("active")) {
                        switch(this.previousTabPosition) {
                            case "tabHome"    : tabHistory.style.animation = R2LI; tabHome.style.animation             = R2LO;
                                                switcher.style.animation   = HOHI; switcher.innerText="  Historique  " ;break;
                            case "tabAlerts"  : tabHistory.style.animation = L2RI; tabAlerts.style.animation           = L2RO;
                                                switcher.style.animation   = ALHI; switcher.innerText="  Historique  " ;break;
                        }
                        this.previousTabPosition = "tabHistory";
                    }
                    if(this.tabAlerts.classList.contains("active")) {
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
            this.startup()
        };
    }
}

/* Instanciation d'une application */

/* -> * /
 
const app = new Application();
app.create();  

/**/