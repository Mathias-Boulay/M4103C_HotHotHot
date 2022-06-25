import { qs, createElement, removeElementChilds } from "./../utils/utils.js";
import { getHSLColorMatchingTemperature } from "./../utils/colorUtils.js";
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

            const lastAlertContainer = qs("[data-tab=lastAlertContainer]");
            const latestAlert        = createElement("div",{class:"latestAlert","aria-labelledby":"latestAlert",role:"latestAlert"},lastAlertContainer);
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
                this.#value      = result[0].Valeur;
                this.#timestamp  = result[0].Timestamp;
                captorNameContainer.append("Capteur " + this.#captorName + " :");
                contextContainer.append(AlertsView.obtainAlertContext(this.#captorName, this.#value));
                valueContainer.append(this.#value);
                dateContainer.append(AlertsView.obtainDate(this.#timestamp));
                latestAlert.style.background = getHSLColorMatchingTemperature(this.#value);
            });
        });
    }

    #printInitAlertsHistory(){
        const alertsHistoryContainer = qs("[data-tab=alertsHistoryContainer]");
        receptor.DAO.getAlerts({limit : 1}).then(result => {
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

    #updateAlertsHistory(captorName, value, timestamp){
        this.#printAlertHistoryItem(captorName, value, timestamp);
    }

    #updateLatestAlert(){
        const context    = qs("[data-lastalert=" + this.#captorName + "Context]");
        const value      = qs("[data-lastalert=" + this.#captorName + "Value]");
        const date       = qs("[data-lastalert=" + this.#captorName + "Date]");
        const captorName = qs("[data-lastalert=" + this.#captorName + "CaptorName]");

        removeElementChilds(context);
        removeElementChilds(value);
        removeElementChilds(date);
        removeElementChilds(captorName);

        captorName.append("Capteur " + this.#captorName + " :");
        context.append(this.#context);
        value.append(this.#value + "°C");
        date.append(this.#date);
        context.parentNode.style.background = getHSLColorMatchingTemperature(this.#value);
    }

    #printAlertHistoryItem(captorName, value, timestamp)
    {
        const alertsHistoryUl = qs("[data-list=alertsHistory]");
        const li              = createElement("li", {class:"alertHistoryItem"},alertsHistoryUl, true);
        const liContainer     = createElement("div",{class:"alertHistoryItemContainer","aria-labelledby":"alertHistoryItemContainer",  role:"alertHistoryItemContainer" },li);
        const itemCaptorName  = createElement("div",{class:"alertHistoryItemCaptorName","aria-labelledby":"alertHistoryItemCaptorName",role:"alertHistoryItemCaptorName"},liContainer);
        const itemContext     = createElement("p",  {class:"alertHistoryItemContext",   "aria-labelledby":"alertHistoryItemContext",   role:"alertHistoryItemContext"   },liContainer);
        const itemValue       = createElement("div",{class:"alertHistoryItemValue",     "aria-labelledby":"alertHistoryItemValue",     role:"alertHistoryItemValue"     },liContainer);
        const itemDate        = createElement("div",{class:"alertHistoryItemDate",      "aria-labelledby":"alertHistoryItemDate",      role:"alertHistoryItemDate"      },liContainer);

        itemCaptorName.append("Capteur " + captorName + " :");
        itemContext.append(AlertsView.obtainAlertContext(captorName, value));
        itemValue.append(value + "°C");
        itemDate.append(AlertsView.obtainDate(timestamp));
    }


    static obtainAlertContext(captorName, value){
        
        if (captorName === AlertsView.#captorList[0])
        {
            if (value > 50) return Localization.getText("alert_context_inside_superhot");
            if (value > 22) return Localization.getText("alert_context_inside_hot");
            if (value < 0 ) return Localization.getText("alert_context_inside_supercold");
            if (value < 12) return Localization.getText("alert_context_inside_cold");
        }
        else if(captorName === AlertsView.#captorList[1])
        {
            if(value > 35) return Localization.getText("alert_context_outside_hot",);
            if(value < 0 ) return Localization.getText("alert_context_outside_cold");
        }
        return Localization.getText("alert_context_error");
    }

    static obtainDate(timestamp){
        const date = new Date(timestamp);
        return (date.getHours()+":"+date.getMinutes()+" "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
    }

}