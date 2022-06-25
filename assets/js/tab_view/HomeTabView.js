import { qs, qsa, createElement } from "../utils/utils.js";

export default class HomeTabView extends Object {
    #rootView;          /* The root view of the Tab */

    constructor() {
        super();
        this.#rootView = qs("#tabHome");
    }
}