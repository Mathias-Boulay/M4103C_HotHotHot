import { qs, createElement } from "../utils/utils.js";
import { AlertsView } from "../view/AlertsView.js";

export class AlertsTabView extends Object
{

    constructor()
    {
        super();
        const tabAlerts = qs("#tabAlerts");
        
        this.constructTabHTML = () =>
        {
            this.latestAlertContainer   = createElement("div", {id:"latestAlertContainer"  ,"aria-labelledby":"latestAlertContainer",  role:"containLastAlert",    "data-tab":"lastAlertContainer"    },tabAlerts);
            this.alertsHistoryContainer = createElement("div", {id:"alertsHistoryContainer","aria-labelledby":"alertsHistoryContainer",role:"containAlertsHistory","data-tab":"alertsHistoryContainer"},tabAlerts);
        };

        this.loadComponentViews = () =>
        {
            const alertsView = new AlertsView();
        };

        this.load = () => 
        {
            this.constructTabHTML();
            this.loadComponentViews();
        };
    }
}