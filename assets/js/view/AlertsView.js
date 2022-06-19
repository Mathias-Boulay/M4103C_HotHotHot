import { qs, createElement, removeElementChilds } from "./../utils/utils.js";
import {receptor} from "./../Receptor"

export class AlertsView extends Object
{

    static MSG_OUTSIDE_HOT = "Hot Hot Hot !";
    static MSG_OUTSIDE_COLD = "Banquise en vue !";
    static MSG_INSIDE_HOT = "Baissez le chauffage !";
    static MSG_INSIDE_SUPERHOT = "Appelez les pompiers ou arrêtez votre barbecue !";
    static MSG_INSIDE_COLD = "Montez le chauffage ou mettez un gros pull !";
    static MSG_INSIDE_SUPERCOLD = "Canalisations gelées, appelez SOS plombier et mettez un bonnet !";
    static MSG_ERROR = "Erreur, il ne s'agit pas d'une alerte valide";

    #captorName
    #value
    #timestamp
    #context
    #date
    
    constructor(){
        super();
        receptor.addAlertListener(this);
        this.#printInitLatestAlert();
        this.#printInitAlertsHistory();
    }

    #printInitLatestAlert(){
        const lastAlertContainer = qs("[data-tab=lastAlertContainer]");
        const latestAlert        = createElement("div",{id:"latestAlert","aria-labelledby":"latestAlert",role:"latestAlert"},lastAlertContainer);
        const captorName = createElement("div",{id:"latestAlertCaptorName","aria-labelledby":"latestAlertCaptorName",role:"latestAlertCaptorName","data-lastalert":"captorName"},latestAlert);
        const context    = createElement("p",  {id:"latestAlertContext",   "aria-labelledby":"latestAlertContext",   role:"latestAlertContext"   ,"data-lastalert":"context"},latestAlert);
        const value      = createElement("div",{id:"latestAlertValue",     "aria-labelledby":"latestAlertValue",     role:"latestAlertValue"     ,"data-lastalert":"value"},latestAlert);
        const date       = createElement("div",{id:"latestAlertDate",      "aria-labelledby":"latestAlertDate",      role:"latestAlertDate"      ,"data-lastalert":"date"},latestAlert);

        //I will look into another way of selecting the last stored alert instead of taking all the alerts stored and keeping just one
        receptor.DAO.getAlerts().then(result => {
            this.#captorName = result[(result.length - 1)].Nom;
            this.#value      = result[(result.length - 1)].Valeur;
            this.#timestamp  = result[(result.length - 1)].Timestamp;
            captorName.append("Capteur " + this.#captorName + " :");
            context.append(AlertsView.obtainAlertContext(this.#captorName, this.#value));
            value.append(this.#value);
            date.append(AlertsView.obtainDate(this.#timestamp));
            AlertsView.defineAlertColor(latestAlert, AlertsView.getHSLColor(this.#value));
        });
        
    }

    #printInitAlertsHistory(){
        const alertsHistoryContainer = qs("[data-tab=alertsHistoryContainer]");
        receptor.DAO.getAlerts().then(result => {
            createElement("ul", {id:"alertsHistory", "aria-labelledby":"alertsHistory",role:"AlertsHistory","data-list":"alertsHistory"},alertsHistoryContainer);
            for (let i = 0; i < (result.length - 1585); ++i){
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
        const context    = qs("[data-lastalert=context]");
        const value      = qs("[data-lastalert=value]");
        const date       = qs("[data-lastalert=date]");
        const captorName = qs("[data-lastalert=captorName]");

        removeElementChilds(context);
        removeElementChilds(value);
        removeElementChilds(date);
        removeElementChilds(captorName);

        captorName.append("Capteur " + this.#captorName + " :");
        context.append(this.#context);
        value.append(this.#value + "°C");
        date.append(this.#date);
        AlertsView.defineAlertColor(context.parentNode, AlertsView.getHSLColor(this.#value));
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

    static defineAlertColor(element, hslColor){
        element.style.background = hslColor;
    }

    static getHSLColor(value){
        let colorHue = (((value > 22) ? 160 : 260) - 5 * value)
        colorHue     = (colorHue < 0) ? 0 : colorHue;
        return "hsl(" + colorHue + ", 100%, 60%)";
    }

    static obtainAlertContext(captorName, value){
        if(captorName === "exterieur")
        {
            if(value > 35) return AlertsView.MSG_OUTSIDE_HOT;
            if(value < 0 ) return AlertsView.MSG_OUTSIDE_COLD;
        }
        else if (captorName === "interieur")
        {
            if (value > 50) return AlertsView.MSG_INSIDE_SUPERHOT;
            if (value > 22) return AlertsView.MSG_INSIDE_HOT;
            if (value < 0 ) return AlertsView.MSG_INSIDE_SUPERCOLD;
            if (value < 12) return AlertsView.MSG_INSIDE_COLD;
        }
        return AlertsView.MSG_ERROR;
    }

    static obtainDate(timestamp){
        const date = new Date(timestamp);
        return (date.getHours()+":"+date.getMinutes()+" "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
    }

}