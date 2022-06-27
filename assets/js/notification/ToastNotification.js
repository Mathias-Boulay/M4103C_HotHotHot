import { qs, createElement, removeElementChilds, sleep } from "./../utils/utils.js";
import { AlertsView } from "./../view/AlertsView.js";
import { receptor } from "./../Receptor";

export class ToastNotification extends Object{

    #captorName;
    #value;
    #timestamp;
    #context;
    #date;

    constructor(){
        super();
        receptor.addAlertListener(this);
        this.initToast();
    }

    initToast(){
        const toastContainer   = createElement("div",{id:"toastContainer","aria-labelledby":"toastContainer",  role:"toastContainer"});
        createElement("div",{id:"toastCaptorName","aria-labelledby":"toastCaptorName",role:"toastCaptorName"},toastContainer);
        createElement("p",  {id:"toastContext",   "aria-labelledby":"toastContext",   role:"toastContext"   },toastContainer);
        createElement("div",{id:"toastValue",     "aria-labelledby":"toastValue",     role:"toastValue"     },toastContainer);
        createElement("div",{id:"toastDate",      "aria-labelledby":"toastDate",      role:"toastDate"      },toastContainer);
    }



    update(sensorData){
        if (qs("[data-target=tabAlerts]").className === "active") return;

        this.#captorName = sensorData.Nom;
        this.#value      = sensorData.Valeur;
        this.#timestamp  = sensorData.Timestamp;
        this.#context    = AlertsView.obtainAlertContext(this.#captorName, this.#value);
        this.#date       = AlertsView.obtainDate(this.#timestamp);
        this.showToast();
    }

    showToast(){
        const elementArray = ["CaptorName", "Context",  "Value", "Date"];
        const contentArray = ["Capteur " + this.#captorName, this.#context, this.#value + "°C", this.#date];

        let i = 0;
        while (i < elementArray.length){
            const element = qs("#toast" + elementArray[i]);
            removeElementChilds(element);
            element.append(contentArray[i]);
            ++i;
        }

        const toastContainer = qs("#toastContainer");
        toastContainer.addEventListener("click", () =>{
            qs("[data-target=tabAlerts]").click();
        })
        toastContainer.className = "toastActive";
        sleep(5000).then(resolve => {
            toastContainer.className = "toastInactive";
        });
    }

}