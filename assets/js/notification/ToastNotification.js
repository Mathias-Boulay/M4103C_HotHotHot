/**
 * Class aimed at showing a toast when an alert is received if the user isn't already on AlertsTabView
 */
 import { qs, createElement, removeElementChilds, sleep } from "./../utils/utils.js";
 import { obtainAlertContext, obtainDate } from "./../utils/alertUtils.js";
 import { receptor } from "./../Receptor";
 import Localization from "./../lang/Localization";
 
 export class ToastNotification extends Object{
 
     constructor(){
         super();
         receptor.addAlertListener(this);
 
         const toastContainer   = createElement("div",{id:"toastContainer","aria-labelledby":"toastContainer",  role:"toastContainer"});
         createElement("div",{id:"toastCaptorName","aria-labelledby":"toastCaptorName",role:"toastCaptorName"},toastContainer);
         createElement("p",  {id:"toastContext",   "aria-labelledby":"toastContext",   role:"toastContext"   },toastContainer);
         createElement("div",{id:"toastValue",     "aria-labelledby":"toastValue",     role:"toastValue"     },toastContainer);
         createElement("div",{id:"toastDate",      "aria-labelledby":"toastDate",      role:"toastDate"      },toastContainer);
         
     }
 
     /** Proxy method called because we are a Receptor listener */
     update(sensorData){
         if(qs("#tabAlerts").className.split(" ").includes("middle")) return; /* To check whether or not the user is on AlertsTabView */
 
         this.showToast(sensorData.Nom, obtainAlertContext(sensorData.Nom, sensorData.Valeur), sensorData.Valeur, obtainDate(sensorData.Timestamp));
     }
 
     /**
      * Display the toast containing the alert data
      * @param captorName Name of the captor linked to the alert
      * @param context Context of the alert
      * @param value Value of the alert
      * @param date Date of the alert
      */
     showToast(captorName, context, value, date){
         const elementArray = ["CaptorName", "Context",  "Value", "Date"];
         const contentArray = [Localization.getText("sensor") + captorName, context, value + "°C", date];
 
         let i = 0;
         while (i < elementArray.length){
             const element = qs("#toast" + elementArray[i]);
             removeElementChilds(element);
             element.append(contentArray[i]);
             ++i;
         }
 
         const toastContainer = qs("#toastContainer");
         toastContainer.addEventListener("click", () =>{qs("[data-target=tabAlerts]").click();})
         toastContainer.className = "toastActive";
         sleep(5000).then(resolve => {toastContainer.className = "toastInactive";}); 
         /* Let enough time to the toast so it can complete his animation*/
     }
}