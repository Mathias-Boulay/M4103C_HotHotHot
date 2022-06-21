import { receptor } from "../Receptor";
import { qs, qsa,createElement } from "../utils/utils";

export class Graph {

    constructor(parent){
        this.canvas = createElement("canvas",{},qs(parent));
        console.log((qsa(parent)));
        this.ctx = this.canvas.getContext('2d');
        this.gradient = this.ctx.createLinearGradient(0, 0, 0, 450);
        this.gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)');
        this.gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
        this.gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        this.data = {
        labels: [],
        datasets: [
            {
                type: 'line',
                label: 'exterieur',
                data: [],
                borderColor: '#ffe0b2',
                fill: "start",
                pointRadius: 0,
                tension: 0.5,
                },
            {
            type: 'line',
            label: 'interieur',
            data: [],
            borderColor: '#ff9800',
            fill: "start",
            pointRadius: 0,
            tension: 0.5,
            }
            
        ]
        };
        this.config = {
        type: 'line',
        data: this.data,
        options: {
            spanGaps: true,
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {}
        }
        };
        
    }
    
    searchDatasetID (nomLabel, dataset) {
        for (let i=0; i < dataset.length; i++) {
            if (dataset[i].label === nomLabel) {
                return i;
            }
        }
    }

    addDateInLabel(date){
        let labels = this.chart.data.labels;
        let temp = date;
        for (let i=0; i < labels.length; i++) {
            if(date === labels[i]){
                return i;
            }
            else if (date < labels[i]){
                (this.chart.data.labels).splice(i,0,temp)
                return i;
            }
        }
        (this.chart.data.labels).push(temp);
        return labels.length -1;
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            minutes = d.getMinutes(),
            secondes = d.getSeconds(),
            ms = d.getMilliseconds();

        return [minutes,secondes,ms].join('-');
    }

    addData(dataArray){
        dataArray.forEach(date => {
            let tempDate = this.formatDate(date.Timestamp);
            if(!(this.chart.data.labels).includes(tempDate)){
                (this.chart.data.labels).push(tempDate);
                console.log(tempDate);
            }
            this.chart.data.datasets.forEach(dataset => {
                if(dataset.label === date.Nom){
                    dataset.data.push(date.Valeur);
                    console.log(date.Valeur);
                }
                else if(this.chart.data.labels.label != dataset.data.length){
                    dataset.data.push(null);
                    console.log("null");
                }
            });
            
        });
        console.log(this.chart.data.datasets);
        console.log(this.data.labels);
        this.chart.update();
        }
    create(){
        this.chart = new Chart(this.ctx, this.config);
        // receptor.DAO.getSensorData({filters:"interieur", limit:10}).then((result) => {
        //     this.addData(result,"interieur");
        // });
        // receptor.DAO.getSensorData({filters:"exterieur", limit:10}).then((result) => {
        //     this.addData(result,"exterieur");
        // });
        receptor.DAO.getSensorData({filters:["exterieur","interieur"]}).then((result) => {
            this.addData(result);
        });
        receptor.addSensorDataListener(this)
    }

    dateConvertor(date){

    }
}
