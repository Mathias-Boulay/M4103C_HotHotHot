import { qs, qsa, createElement, addGlobalEventListener } from "./utils/utils.js";
import HomeTabView from "./tab_view/HomeTabView";
import HistoryTabView from "./tab_view/HistoryTabView";
import {AlertsTabView} from "./tab_view/AlertsTabView";
import {bubbly} from "./bubbly.js";
import { ToastNotification } from "./notification/ToastNotification.js";
import { PushNotification } from "./notification/PushNotification.js";
import {clamp} from "./utils/mathUtils";

export class Application extends Object {

    /* List of tabs and their appropriate buttons  */
    #tabs = [];
    #tabButtons = [];
    #currentTabIndex = 0;

    /* Instances of TabView */
    #homeTabView;
    #alertTabView;
    #historyTabView;
 
    #tmpEventClient = 0;
    #prevPosX = 0;

     /**
     * Creates a new instance of the Application
     * 
     */
    constructor() {
        super();
        this.previousTabPosition = "tabHome";
        this.screenWidth = window.innerWidth;
        window.addEventListener("resize", ()=> {this.screenWidth = window.innerWidth;});
    }

    /*   HTML Elements creation   */
                                  //        _____________________________________________________________________________________________________________________
    #constructHTML = () => {      //        |   Type    |                        Attributs, Datasets & Inner Texts                        |    Elément Parent   |
                                  //        |_d'Element_|_________________________________________________________________________________|__def:document.body__|
        this.header          = createElement( "header" ,{id             :"header"                                                         }                    );
        this.userName        = createElement(  "span"  ,{id             :"userName"        ,text  :""                                     },        this.header);
        this.connectionState = createElement(  "span"  ,{id             :"connectionState" ,text  :"Connection"                           },        this.header);
        this.fakeOverlay     = createElement(  "div"   ,{id             :"fakeOverlay"                                                    }                    );
        this.fakeConnection  = createElement(  "form"  ,{id             :"fakeConnection"                                                 },  this.fakeOverlay );
        this.fakeLabel       = createElement(  "label" ,{id:"fakeLabel" ,for:"fakeInput"   ,text:"Connection"                             },this.fakeConnection);
        this.fakeInput       = createElement(  "input" ,{id:"fakeInput" ,placeholder:"Nom" ,type:"text"                   ,name:"name"    },this.fakeConnection);
        this.fakeButton      = createElement( "button" ,{id:"fakeButton",                   type:"button"                                 },this.fakeConnection);
        this.linksMenu       = createElement(   "ul"   ,{class          :"linksMenu"                                      ,role :"tablist"},        this.header);
        this.switcher        = createElement(  "span"  ,{id             :"switcher"                                                       },     this.linksMenu);
        this.linkHome        = createElement(   "li"   ,{"data-target"  :"tabHome"         ,class :"active"               ,role :"tab"    },     this.linksMenu);
        const anchorHome     = createElement(   "a"    ,{                                   text  :"Accueil"              ,href :"#"      },      this.linkHome);
        this.linkHistory     = createElement(   "li"   ,{"data-target"  :"tabHistory"                                     ,role :"tab"    },     this.linksMenu);
        const anchorHistory  = createElement(   "a"    ,{                                   text  :"Historique"           ,href :"#"      },   this.linkHistory);
        this.linkAlerts      = createElement(   "li"   ,{"data-target"  :"tabAlerts"                                      ,role :"tab"    },     this.linksMenu);
        const anchorAlerts   = createElement(   "a"    ,{                                   text  :"Alertes"              ,href :"#"      },    this.linkAlerts);
        this.tabsContainer   = createElement(  "div"   ,{class          :"tabsContainer"                                                  }                    );
        this.tabHome         = createElement(  "div"   ,{id:"tabHome"   ,class:"everyTab",  "aria-labelledby":   "tabHome",role:"tabpanel"}, this.tabsContainer);
        this.tabHistory      = createElement(  "div"   ,{id:"tabHistory",class:"everyTab",  "aria-labelledby":"tabHistory",role:"tabpanel"}, this.tabsContainer);
        this.tabAlerts       = createElement(  "div"   ,{id:"tabAlerts" ,class:"everyTab",  "aria-labelledby": "tabAlerts",role:"tabpanel"}, this.tabsContainer);
        this.links           =      qsa     (".linksMenu li");
        this.contents        =      qsa     (".everyTab");

        // Put all tabs and their associated button in a list, for scalability
        this.#tabs = [this.tabHome, this.tabHistory, this.tabAlerts];
        this.#tabButtons = [this.linkHome, this.linkHistory, this.linkAlerts];

        // Put the links slightly on top of the switcher
        for(let tab of this.#tabButtons){
            tab.style.zIndex = '1';
        }

        // Link the tabViews
        this.#homeTabView = new HomeTabView();
        this.#historyTabView = new HistoryTabView();
        this.#alertTabView = new AlertsTabView();
        this.#homeTabView.load();
        this.#historyTabView.load();
        this.#alertTabView.load();

        new PushNotification();
        new ToastNotification();
       
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

    /**
     * Set the tabs behavior
     */
    #setTabsBehavior = () => {
        const toggle = (targetIndex, skipAnimation=false, forceToggle=false) => {
            if(targetIndex === this.#currentTabIndex && !forceToggle) return;


            // Remove all class transitions, then apply the appropriate one
            for(let index in this.#tabs){
                let currentTab = this.#tabs[index];

                // Compute animation settings
                let addedClass = index < targetIndex ? "left" : index > targetIndex ? "right" : "middle"
                let currentBounds = currentTab.getBoundingClientRect();
                let destination = addedClass === "left" ? - window.innerWidth : addedClass === "right" ? window.innerWidth : 0;

                // Then we update the class holding transform properties
                currentTab.style.transitionDuration = !skipAnimation * ((0.3 * Math.abs(currentBounds.x - destination)) / window.innerWidth) + "s";
                currentTab.classList.remove("left", "middle", "right");
                currentTab.classList.add(addedClass);
                currentTab.style.zIndex = '0';
            }

            // Put priority on the two main animating tabs
            this.#tabs[this.#currentTabIndex].style.zIndex = '2';
            this.#tabs[targetIndex].style.zIndex = '3';


            // button transition, we need to be direction aware
            let containerBounds = this.linksMenu.getBoundingClientRect();
            let targetBounds = this.#tabButtons[targetIndex].getBoundingClientRect();
            this.switcher.style.right =  containerBounds.right - targetBounds.right + 'px';
            this.switcher.style.left = targetBounds.x - containerBounds.x + 'px';



            this.#currentTabIndex = targetIndex;
        }
        // Bind button click to their respective tabs
        for(let index in this.#tabButtons){
            this.#tabButtons[index].addEventListener("click", () => toggle(index));
        }
        toggle(0, true, true);
    };

    /**
     * Set screen swaping behaviors (#startup, #handleStart, #handleMove, #handleEnd, #handleCancel)
     */
    #startup() {
        const d =  document;
        d.addEventListener("pointerdown"  , this.#handleStart.bind(this));
        d.addEventListener("pointerup"    , this.#handleEnd.bind(this));
        d.addEventListener("pointercancel", this.#handleCancel.bind(this));
        d.addEventListener("pointermove"  , this.#handleMove.bind(this));
        bubbly();
    }
    #handleStart(evt){
        this.#prevPosX = evt.clientX;
    }
    #handleMove(evt) {
        evt.preventDefault();
        this.#tmpEventClient=evt.clientX;
    }
    #handleEnd(evt) {
        evt.preventDefault();
        let diffPos = this.#prevPosX - evt.clientX;
        if(evt.pointerType === "mouse"){
            if(diffPos > 0) this.#tabButtons[clamp(this.#currentTabIndex + 1, 0, this.#tabButtons.length-1)].click();
            if(diffPos < 0) this.#tabButtons[clamp(this.#currentTabIndex - 1, 0, this.#tabButtons.length-1)].click();
        }
    }
    #handleCancel(evt) {
        let diffPos = this.#tmpEventClient - this.#prevPosX;
        if(evt.pointerType === "touch"){
            if(diffPos < -8.5) this.#tabButtons[clamp(this.#currentTabIndex + 1, 0, this.#tabButtons.length-1)].click();
            if(diffPos > 8.5) this.#tabButtons[clamp(this.#currentTabIndex - 1, 0, this.#tabButtons.length-1)].click();
        }

        evt.preventDefault();
    }

    /**
     * Creates the application
     *
     */
    create() {
        this.#constructHTML();
        this.#setTabsBehavior();
        this.#startup();
    };
}