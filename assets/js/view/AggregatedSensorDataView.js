/**
 * View aimed at displaying the min, max and average data of the day
 */
import {createElement, getEndOfDay, getStartOfDay} from "../utils/utils";
import Receptor, {receptor} from "../Receptor";
import Localization from "../lang/Localization";

export default class AggregatedSensorDataView extends Object {
    #rootView;      /* The view root used to display all children */
    #tableBody;

    /**
     * @param parent The parent HTMLElement, to be attached to
     * @param date A date from which data will be gathered
     * @param sensorNames An array of all sensorNames to get
     */
    constructor(parent, date, sensorNames=Receptor.ALL_SENSORS) {
        super();

        receptor.DAO.getSensorData({
            filters: sensorNames,
            startTime: getStartOfDay(date).getTime(),
            endTime: getEndOfDay(date).getTime()
        }).then((results) => this.#createRowChildren(AggregatedSensorDataView.#aggregateData(results)));


        /* Table header */
        this.#rootView = createElement("table", {class: "dailyTable"}, parent);
        let tableHead = createElement("thead", {}, this.#rootView);
        let tableHeadRow = createElement("tr", {}, tableHead);
        createElement("td", {colspan: 4, text: getStartOfDay(date).toDateString()}, tableHeadRow);

        let tableDescription = createElement("tr", {}, tableHead);
        createElement("td", {text: Localization.getText("history_name")}, tableDescription);
        createElement("td", {text: Localization.getText("history_minimum")}, tableDescription);
        createElement("td", {text: Localization.getText("history_maximum")}, tableDescription);
        createElement("td", {text: Localization.getText("history_average")}, tableDescription);


        /* And the body base */
        this.#tableBody = createElement("tbody", {}, this.#rootView);
    }

    /**
     * Aggregate the data to make it usable for displaying purposes
     * @param results An array of SensorData of all sensors we're listening to.
     * @return an object with the following structure: {
     *     'sensorName':{
     *         max: {Number} The maximum value
     *         min: {Number} The minimum value
     *         average: {Number} The average value
     *         entryCount: {Number} How many entries are processed for this sensor
     *         sensorType: {String} The type of sensor. Eg "Thermique"
     *     }
     * }
     * Note that it may have N number of sensors.
     */
    static #aggregateData(results){
        let aggregatedData = {};
        for(let result of results){
            // Create the object for the given sensor, if needed
            if(aggregatedData[result.Nom] === undefined){
                aggregatedData[result.Nom] = {max : -9999, min : 9999, average : 0, entryCount : 0}
            }

            aggregatedData[result.Nom].max = Math.max(aggregatedData[result.Nom].max, result.Valeur);
            aggregatedData[result.Nom].min = Math.min(aggregatedData[result.Nom].min, result.Valeur);
            aggregatedData[result.Nom].average += result.Valeur;
            aggregatedData[result.Nom].entryCount += 1;
        }
        // Once we get gathered all the data, compute the average if possible, else put default values
        for(let key of Object.keys(aggregatedData)){
            if(aggregatedData[key].entryCount === 0){
                aggregatedData[key] = { max : 0, min : 0, average : 0, entryCount : 0};
            }else{
                aggregatedData[key].average /= aggregatedData[key].entryCount;
                aggregatedData[key].average = aggregatedData[key].average.toFixed(1);
            }
        }
        return aggregatedData
    }

    /**
     * Create all row children in the table, from the aggregated data
     * @param aggregatedData Data on each sensor following the structure cited in #aggregate
     */
    #createRowChildren(aggregatedData){
        for(let key of Object.keys(aggregatedData)){
            let currentData = aggregatedData[key];

            let tableRow = createElement("tr", {text: key}, this.#tableBody);
            createElement("td", {text: currentData.min}, tableRow);
            createElement("td", {text: currentData.max}, tableRow);
            createElement("td", {text: currentData.average}, tableRow);
        }
    }






}