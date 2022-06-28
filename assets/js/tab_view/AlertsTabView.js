import { qs, createElement } from "../utils/utils.js";
import { AlertsHistoryView } from "../view/AlertsHistoryView.js";
import { LatestAlertView } from "../view/LatestAlertView.js";

export class AlertsTabView extends Object {
    #tabAlerts; /* The node of the dedicated Tab for alerts Views  */
    #latestAlertContainer; /* Node containing the latest alerts Views */
    #alertsHistoryContainer; /* Node containing alerts history */

    constructor() {
        super();
        this.#tabAlerts = qs("#tabAlerts");
    }

    /* Adding two HTML nodes which will contains the sub-view*/
    constructTabHTML() {
        this.#latestAlertContainer   = createElement("ul", {id:"latestAlertsContainer"  ,"aria-labelledby":"latestsAlertContainer",  role:"containLastAlerts",    "data-tab":"lastAlertsContainer"    },this.#tabAlerts);
        this.#alertsHistoryContainer = createElement("div", {id:"alertsHistoryContainer","aria-labelledby":"alertsHistoryContainer",role:"containAlertsHistory","data-tab":"alertsHistoryContainer"},this.#tabAlerts);
    }

    /* Loading all sub-views*/
    loadComponentViews() {
        new AlertsHistoryView();
        new LatestAlertView("interieur", this.#latestAlertContainer);
        new LatestAlertView("exterieur", this.#latestAlertContainer);
    }

    /** Load the whole Tab View */
    load() {
        this.constructTabHTML();
        this.loadComponentViews();
    }
}