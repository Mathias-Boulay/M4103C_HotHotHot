import { qs, createElement } from "../utils/utils.js";
import { AlertsView } from "../view/AlertsView.js";

export class AlertsTabView extends Object {
    tabAlerts;
    latestAlertContainer;
    alertsHistoryContainer;

    constructor() {
        super();
        this.tabAlerts = qs("#tabAlerts");
    }

    constructTabHTML() {
        this.latestAlertContainer   = createElement("ul", {id:"latestAlertsContainer"  ,"aria-labelledby":"latestsAlertContainer",  role:"containLastAlerts",    "data-tab":"lastAlertsContainer"    },this.tabAlerts);
        this.alertsHistoryContainer = createElement("div", {id:"alertsHistoryContainer","aria-labelledby":"alertsHistoryContainer",role:"containAlertsHistory","data-tab":"alertsHistoryContainer"},this.tabAlerts);
    }

    loadComponentViews() {
        new AlertsView();
    }

    /** Load all necessary children components */
    load() {
        this.constructTabHTML();
        this.loadComponentViews();
    }
}