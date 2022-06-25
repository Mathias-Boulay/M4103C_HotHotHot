import { qs, qsa, createElement } from "../utils/utils.js";

export default class HistoryTabView extends Object {

    #rootView;          /* The root view of the Tab */

    constructor() {
        super();
        this.#rootView = qs("#tabHistory");
    }

    /** Load all necessary children components */
    load(){
        // TODO add children ?
    }

}