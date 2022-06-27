import {qs, qsa, createElement, addTime} from "../utils/utils.js";
import AggregatedSensorDataView from "../view/AggregatedSensorDataView";

export default class HistoryTabView extends Object {

    #rootView;          /* The root view of the Tab */

    constructor() {
        super();
        this.#rootView = qs("#tabHistory");
    }

    /** Load all necessary children components */
    load(){
        let today = new Date(Date.now());
        new AggregatedSensorDataView(this.#rootView, today);
        new AggregatedSensorDataView(this.#rootView, addTime(today, -1));
        new AggregatedSensorDataView(this.#rootView, addTime(today, -2));
        new AggregatedSensorDataView(this.#rootView, addTime(today, -3));
        new AggregatedSensorDataView(this.#rootView, addTime(today, -4));
        new AggregatedSensorDataView(this.#rootView, addTime(today, -5));
    }

}