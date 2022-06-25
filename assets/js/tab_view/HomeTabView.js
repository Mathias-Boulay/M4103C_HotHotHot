import { qs, qsa, createElement } from "../utils/utils.js";
import RealTimeSensorDataView from "../view/RealTimeSensorDataView";
import {Graph} from "../graph/graph";

export default class HomeTabView extends Object {
    #rootView;                      /* The root view of the Tab */
    #realTimesensorDataContainer    /* Container for realTimeSensorDataView */

    constructor() {
        super();
        this.#rootView = qs("#tabHome");
    }


    /** Load all necessary children components */
    load(){
        this.#realTimesensorDataContainer = createElement("div", {class:"realTimeSensorDataContainer"}, this.#rootView);
        new RealTimeSensorDataView(this.#realTimesensorDataContainer, "interieur");
        new RealTimeSensorDataView(this.#realTimesensorDataContainer, "exterieur");
        new Graph("#tabHome").create();
    }



}