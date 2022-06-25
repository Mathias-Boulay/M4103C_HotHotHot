import { qs, qsa, createElement } from "../utils/utils.js";
import RealTimeSensorDataView from "../view/RealTimeSensorDataView";
import {Graph} from "../graph/graph";

export default class HomeTabView extends Object {
    #rootView;                      /* The root view of the Tab */
    #realTimesensorDataContainer;    /* Container for realTimeSensorDataView */
    #graphContainer;                /* Container for Graph */

    constructor() {
        super();
        this.#rootView = qs("#tabHome");
    }


    /** Load all necessary children components */
    load(){
        this.#realTimesensorDataContainer = createElement("div", {class:"realTimeSensorDataContainer"}, this.#rootView);
        this.#graphContainer = createElement("div", {class: "graphLimit"},qs("#tabHome"));
        new RealTimeSensorDataView(this.#realTimesensorDataContainer, "interieur");
        new RealTimeSensorDataView(this.#realTimesensorDataContainer, "exterieur");
        new Graph(this.#graphContainer).create();
    }



}