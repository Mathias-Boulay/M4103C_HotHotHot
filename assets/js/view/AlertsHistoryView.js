/**
 * View dedicated to showing the alerts history
 */
 import { qs, createElement} from "./../utils/utils.js";
 import { getHSLHueMatchingTemperature } from "./../utils/colorUtils.js";
 import { obtainAlertContext, obtainDate } from "./../utils/alertUtils.js";
 import { receptor } from "./../Receptor";
 
 export class AlertsHistoryView extends Object{
     
     #captorName; /* The name of the captor for the previous alert */
     #value; /* The value of the captor for the previous alert */
     #timestamp; /* The timestamp of the captor for the previous alert */
     #context; /* The context of the captor for the previous alert */
     #date; /* The date of the captor for the previous alert */
     
     constructor(){
         super();
         receptor.addAlertListener(this);
 
         this.#captorName = null;
         this.#value      = null;
         this.#context    = null;
         this.#date       = null;
 
         const alertsHistoryContainer = qs("[data-tab=alertsHistoryContainer]");
 
         receptor.DAO.getAlerts({limit : 100}).then(result => {
             createElement("ul", {id:"alertsHistory", "aria-labelledby":"alertsHistory",role:"AlertsHistory","data-list":"alertsHistory"},alertsHistoryContainer);
             for (let i = 0; i < (result.length); ++i){
                 this.#printAlertHistoryItem(result[i].Nom, result[i].Valeur, obtainAlertContext(result[i].Nom, result[i].Valeur), obtainDate(result[i].Timestamp));
             }
         });
         
     }
 
     /** Proxy method called because we are a Receptor listener */
     update(sensorData){
         this.#printAlertHistoryItem(this.#captorName, this.#value, this.#context, this.#date)
 
         this.#captorName = sensorData.Nom;
         this.#value      = sensorData.Valeur;
         this.#timestamp  = sensorData.Timestamp;
         this.#context    = obtainAlertContext(this.#captorName, this.#value);
         this.#date       = obtainDate(this.#timestamp);
     }
 
     /**
      * Add an alert item in the history by taking the previous alert
      * @param {String} captorName The name of the captor for the previous alert
      * @param {Number} value The value of the captor for the previous alert
      * @param {String} context The context of the captor for the previous alert
      * @param {String} date The date of the captor for the previous alert
      */
     #printAlertHistoryItem(captorName, value, context, date){
         if(captorName == null) return;
         const alertsHistoryUl = qs("[data-list=alertsHistory]");
         const li              = createElement("li", {class:"alertHistoryItem"},alertsHistoryUl, true);
         const liContainer     = createElement("div",{class:"alertHistoryItemContainer","aria-labelledby":"alertHistoryItemContainer",  role:"alertHistoryItemContainer" },li);
         const itemDate        = createElement("div",{class:"alertHistoryItemDate",      "aria-labelledby":"alertHistoryItemDate",      role:"alertHistoryItemDate"      },liContainer);
         const itemCaptorName  = createElement("div",{class:"alertHistoryItemCaptorName","aria-labelledby":"alertHistoryItemCaptorName",role:"alertHistoryItemCaptorName"},liContainer);
         const itemContext     = createElement("p",  {class:"alertHistoryItemContext",   "aria-labelledby":"alertHistoryItemContext",   role:"alertHistoryItemContext"   },liContainer);
         const itemValue       = createElement("div",{class:"alertHistoryItemValue",     "aria-labelledby":"alertHistoryItemValue",     role:"alertHistoryItemValue"     },liContainer);
 
         itemDate.append(date);
         itemCaptorName.append(captorName);
         itemContext.append(context);
         itemValue.append(value + "°C");
         const hue = getHSLHueMatchingTemperature(value);
         itemCaptorName.parentNode.style.background = "linear-gradient(175deg, hsla(" + hue + ", 100%, 60%, 0.8) 0%, hsla(" + hue + ", 100%, 70%, 0.8) 50%, hsla(0 , 100%, 100%, 0.8) 100%)";
     } 
}