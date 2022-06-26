import { qs, createElement, removeElementChilds } from "./../utils/utils.js";
import { getHSLHueMatchingTemperature } from "./../utils/colorUtils.js";
import { receptor } from "./../Receptor";
import Localization from "./../lang/Localization";

export class AlertsView extends Object
{

    static #captorList = ["interieur", "exterieur"];
    #captorName;
    #value;
    #timestamp;
    #context;
    #date;
    
    constructor(){
        super();
        receptor.addAlertListener(this);
        this.#printInitLatestAlerts();
        this.#printInitAlertsHistory();
    }

    #printInitLatestAlerts(){

        AlertsView.#captorList.forEach(captorName => {

            const lastAlertContainer = qs("[data-tab=lastAlertsContainer]");
            const latestAlert        = createElement("li",{class:"latestAlert","aria-labelledby":"latestAlert",role:"latestAlert", "data-lastalert": captorName + "holder"},lastAlertContainer);
            const captorNameContainer= createElement("div",{class:"latestAlertCaptorName","aria-labelledby":"latestAlertCaptorName",role:"latestAlertCaptorName","data-lastalert":captorName + "CaptorName"},latestAlert);
            const contextContainer   = createElement("p",  {class:"latestAlertContext",   "aria-labelledby":"latestAlertContext",   role:"latestAlertContext"   ,"data-lastalert":captorName + "Context"},latestAlert);
            const valueContainer     = createElement("div",{class:"latestAlertValue",     "aria-labelledby":"latestAlertValue",     role:"latestAlertValue"     ,"data-lastalert":captorName + "Value"},latestAlert);
            const dateContainer      = createElement("div",{class:"latestAlertDate",      "aria-labelledby":"latestAlertDate",      role:"latestAlertDate"      ,"data-lastalert":captorName + "Date"},latestAlert);

            const optionsObject = {
                filterType : "whitelist",
                filters : [captorName],
                limit : 1,
                order : "descending"
            };
            receptor.DAO.getAlerts(optionsObject).then(result => {
                this.#captorName = captorName;
                this.#value      = result?.[0]?.Valeur ?? "?";
                this.#timestamp  = result?.[0]?.Timestamp ?? "?";
                captorNameContainer.append("Capteur " + this.#captorName);
                contextContainer.append(AlertsView.obtainAlertContext(this.#captorName, this.#value));
                valueContainer.append(this.#value + "°C");
                dateContainer.append(AlertsView.obtainDate(this.#timestamp));
                const hue = getHSLHueMatchingTemperature(this.#value);
                latestAlert.style.background = "radial-gradient(circle, hsla(" + hue + ", 100%, 60%, 0.8) 0%, hsla(0 , 100%, 70%, 0.8) 100%)";
            });
        });
    }

    #printInitAlertsHistory(){
        const alertsHistoryContainer = qs("[data-tab=alertsHistoryContainer]");
        receptor.DAO.getAlerts({limit : 100}).then(result => {
            createElement("ul", {id:"alertsHistory", "aria-labelledby":"alertsHistory",role:"AlertsHistory","data-list":"alertsHistory"},alertsHistoryContainer);
            for (let i = 0; i < (result.length); ++i){
                this.#printAlertHistoryItem(result[i].Nom, result[i].Valeur, result[i].Timestamp);
            }
        });
    }

    update(sensorData){
        
        this.#updateAlertsHistory(this.#captorName, this.#value, this.#timestamp);

        this.#captorName = sensorData.Nom;
        this.#value      = sensorData.Valeur;
        this.#timestamp  = sensorData.Timestamp;
        this.#context    = AlertsView.obtainAlertContext(this.#captorName, this.#value);
        this.#date       = AlertsView.obtainDate(this.#timestamp);

        this.#updateLatestAlert();
    }

    #updateAlertsHistory(captorName, value, timestamp){this.#printAlertHistoryItem(captorName, value, timestamp);}

    #updateLatestAlert(){
        
        const elementArray = [this.#captorName + "CaptorName", this.#captorName + "Context", this.#captorName + "Value", this.#captorName + "Date"];
        const contentArray = ["Capteur " + this.#captorName, this.#context, this.#value + "°C", this.#date];
        let i = 0;
        
        while (i < elementArray.length){
            const element = qs("[data-lastalert=" + elementArray[i] +"]");
            removeElementChilds(element);
            element.append(contentArray[i]);
            ++i;
        }
        const hue = getHSLHueMatchingTemperature(this.#value);
        qs("[data-lastalert=" + this.#captorName +"holder]").style.background = "radial-gradient(circle, hsla(" + hue + ", 100%, 60%, 0.8) 0%, hsla(0 , 100%, 70%, 0.8) 100%)";
    }

    #printAlertHistoryItem(captorName, value, timestamp){
        const alertsHistoryUl = qs("[data-list=alertsHistory]");
        const li              = createElement("li", {class:"alertHistoryItem"},alertsHistoryUl, true);
        const liContainer     = createElement("div",{class:"alertHistoryItemContainer","aria-labelledby":"alertHistoryItemContainer",  role:"alertHistoryItemContainer" },li);
        const itemDate        = createElement("div",{class:"alertHistoryItemDate",      "aria-labelledby":"alertHistoryItemDate",      role:"alertHistoryItemDate"      },liContainer);
        const itemCaptorName  = createElement("div",{class:"alertHistoryItemCaptorName","aria-labelledby":"alertHistoryItemCaptorName",role:"alertHistoryItemCaptorName"},liContainer);
        const itemContext     = createElement("p",  {class:"alertHistoryItemContext",   "aria-labelledby":"alertHistoryItemContext",   role:"alertHistoryItemContext"   },liContainer);
        const itemValue       = createElement("div",{class:"alertHistoryItemValue",     "aria-labelledby":"alertHistoryItemValue",     role:"alertHistoryItemValue"     },liContainer);

        itemDate.append(AlertsView.obtainDate(timestamp));
        itemCaptorName.append(captorName);
        itemContext.append(AlertsView.obtainAlertContext(captorName, value));
        itemValue.append(value + "°C");
        const hue = getHSLHueMatchingTemperature(value);
        itemCaptorName.parentNode.style.background = "linear-gradient(175deg, hsla(" + hue + ", 100%, 60%, 0.8) 0%, hsla(" + hue + ", 100%, 70%, 0.8) 50%, hsla(0 , 100%, 100%, 0.8) 100%)";
    }


    static obtainAlertContext(captorName, value){
        
        if (captorName === AlertsView.#captorList[0]){
            if (value > 50) return Localization.getText("alert_context_inside_superhot");
            if (value > 22) return Localization.getText("alert_context_inside_hot");
            if (value < 0 ) return Localization.getText("alert_context_inside_supercold");
            if (value < 12) return Localization.getText("alert_context_inside_cold");
        }
        else if(captorName === AlertsView.#captorList[1]){
            if(value > 35) return Localization.getText("alert_context_outside_hot",);
            if(value < 0 ) return Localization.getText("alert_context_outside_cold");
        }
        return Localization.getText("alert_context_error");
    }

    static obtainDate(timestamp){
        if (timestamp === "?") return "?";
        const date = new Date(timestamp);
        return (date.getHours()+":"+date.getMinutes()+" "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
    }
}