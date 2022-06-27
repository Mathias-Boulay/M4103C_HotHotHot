import { qs, createElement, removeElementChilds } from "./../utils/utils.js";
import { getHSLHueMatchingTemperature } from "./../utils/colorUtils.js";
import { obtainAlertContext, obtainDate } from "./../utils/alertUtils.js";
import { receptor } from "./../Receptor";

export class LatestAlertView extends Object{

    #captorName;
    #parent;
    
    constructor(captorName, parent){
        super();

        this.#parent = parent;
        this.#captorName = captorName;

        receptor.addAlertListener(this, this.#captorName);
        this.#printInitLatestAlerts();
    }

    #printInitLatestAlerts(){

        const latestAlert        = createElement("li",{class:"latestAlert","aria-labelledby":"latestAlert",role:"latestAlert", "data-lastalert": this.#captorName + "holder"},this.#parent);
        const captorNameContainer= createElement("div",{class:"latestAlertCaptorName","aria-labelledby":"latestAlertCaptorName",role:"latestAlertCaptorName","data-lastalert":this.#captorName + "CaptorName"},latestAlert);
        const contextContainer   = createElement("p",  {class:"latestAlertContext",   "aria-labelledby":"latestAlertContext",   role:"latestAlertContext"   ,"data-lastalert":this.#captorName + "Context"},latestAlert);
        const valueContainer     = createElement("div",{class:"latestAlertValue",     "aria-labelledby":"latestAlertValue",     role:"latestAlertValue"     ,"data-lastalert":this.#captorName + "Value"},latestAlert);
        const dateContainer      = createElement("div",{class:"latestAlertDate",      "aria-labelledby":"latestAlertDate",      role:"latestAlertDate"      ,"data-lastalert":this.#captorName + "Date"},latestAlert);

        const optionsObject = {
            filterType : "whitelist",
            filters : [this.#captorName],
            limit : 1,
            order : "descending"
        };

        receptor.DAO.getAlerts(optionsObject).then(result => {
            const value      = result?.[0]?.Valeur ?? "?";
            const timestamp  = result?.[0]?.Timestamp ?? "?";
            captorNameContainer.append("Capteur " + this.#captorName);
            contextContainer.append(obtainAlertContext(this.#captorName, value));
            valueContainer.append(value + "°C");
            dateContainer.append(obtainDate(timestamp));
            const hue = getHSLHueMatchingTemperature(value);
            latestAlert.style.background = "radial-gradient(circle, hsla(" + hue + ", 100%, 60%, 0.8) 0%, hsla(0 , 100%, 70%, 0.8) 100%)";
        });
    }


    update(sensorData){
        this.#updateLatestAlert(sensorData.Valeur, obtainAlertContext(this.#captorName, sensorData.Valeur), obtainDate(sensorData.Timestamp));
    }

    #updateLatestAlert(value, context, date){
        const elementArray = [this.#captorName + "CaptorName", this.#captorName + "Context", this.#captorName + "Value", this.#captorName + "Date"];
        const contentArray = ["Capteur " + this.#captorName, context, value + "°C", date];
        let i = 0;
        
        while (i < elementArray.length){
            const element = qs("[data-lastalert=" + elementArray[i] +"]");
            removeElementChilds(element);
            element.append(contentArray[i]);
            ++i;
        }
        const hue = getHSLHueMatchingTemperature(value);
        qs("[data-lastalert=" + this.#captorName +"holder]").style.background = "radial-gradient(circle, hsla(" + hue + ", 100%, 60%, 0.8) 0%, hsla(0 , 100%, 70%, 0.8) 100%)";
    }
}