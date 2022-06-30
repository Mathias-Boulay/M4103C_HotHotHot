import { receptor } from "../Receptor";
import {qs, createElement, getStartOfDay} from "../utils/utils";

export class Graph {

    constructor(parent){
        this.canvas = createElement("canvas",{}, parent);
        this.ctx = this.canvas.getContext('2d');

        this.gradient2 = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.gradient2.addColorStop(0, 'rgba(131,100,180,1)');
        this.gradient2.addColorStop(0.6, 'rgba(131,100,180,0)');
        this.gradient2.addColorStop(1, 'rgba(131,100,180,0)');
        this.gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.gradient.addColorStop(0, 'rgba(253,29,29,1)');
        this.gradient.addColorStop(0.6, 'rgba(253,29,29,0)');
        this.gradient.addColorStop(1, 'rgba(253,29,29,0)');

        this.screenWidth = window.innerWidth;
        window.addEventListener("resize", ()=> {
            this.gradientupdate();
            this.chart.update();
        });

        this.tableCreate();

        this.data = {
        labels: [],
        datasets: [
            {
                type: 'line',
                label: 'exterieur',
                data: [],
                borderColor: 'rgba(131,100,180,1)',
                backgroundColor : this.gradient,
                fill: "start",
                pointRadius: 0,
                tension: 0.5,
                },
            {
            type: 'line',
            label: 'interieur',
            data: [],
            borderColor: 'rgba(253,29,29,1)',
            backgroundColor : this.gradient2,
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
                responsive:true,
                maintainAspectRatio: false,
                stacked: false,
                scales: {
                    x :{
                        grid:{
                            display:false
                        },
                        ticks:{
                            display: false
                        }
                    },
                    y :{
                        grid:{
                            drawBorder:false
                        },
                        ticks:{
                            color: "#ffffff"
                        }
                    }
                },
                plugins: {
                    title: {
                        display: false,
                        text: 'Chart.js Line Chart - External Tooltips'
                      },
                      tooltip: {
                        enabled: false,
                        position: 'nearest',
                      }
                }
            }
        };
    }
    

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            minutes = d.getMinutes(),
            secondes = d.getSeconds(),
            ms = d.getMilliseconds();
        return [year,month,day,minutes,secondes].join('-');
    }

    addData(dataArray){
        dataArray.forEach(date => {
            let tempDate = this.formatDate(date.Timestamp);
            if(!(this.chart.data.labels).includes(tempDate)){
                (this.chart.data.labels).push(tempDate);
            }
            this.chart.data.datasets.forEach(dataset => {
                if(dataset.label === date.Nom){
                    dataset.data.push(date.Valeur);
                }
                else if(this.chart.data.labels.label != dataset.data.length){
                    dataset.data.push(null);
                }
            });
        });
        this.chart.update();
        }
    
        addSingleData(date){
            let tempDate = this.formatDate(date.Timestamp);
            if(!(this.chart.data.labels).includes(tempDate)){
                (this.chart.data.labels).push(tempDate);
            }
            this.chart.data.datasets.forEach(dataset => {
                if(dataset.label === date.Nom){
                    dataset.data.push(date.Valeur);
                }
                else if(this.chart.data.labels.label != dataset.data.length){
                    dataset.data.push(null);
                }
            });
            this.chart.update();
        }

    gradientupdate(){
        this.gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.gradient.addColorStop(0, 'rgba(131,100,180,1)');
        this.gradient.addColorStop(0.6, 'rgba(131,100,180,0)');
        this.gradient.addColorStop(1, 'rgba(131,100,180,0)');

        this.gradient2 = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);

        this.gradient2.addColorStop(0, 'rgba(253,29,29,1)');
        this.gradient2.addColorStop(0.6, 'rgba(253,29,29,0)');
        this.gradient2.addColorStop(1, 'rgba(253,29,29,0)');
        this.chart.data.datasets[1].backgroundColor = this.gradient2;
        this.chart.data.datasets[0].backgroundColor = this.gradient;
    }

    create(){
        this.chart = new Chart(this.ctx, this.config);
        receptor.addSensorDataListener(this)
        receptor.DAO.getSensorData({filters:["exterieur","interieur"],startTime: getStartOfDay(Date.now()).getTime()}).then((result) => {
            this.addData(result);
        });
        this.gradientupdate();
    };

    update(t){
        this.addSingleData(t);
        this.addDataTable(t);
    }

    tableCreate(){
        this.table = createElement("table",{}, this.canvas);
        createElement("Caption",{text:"Table des températures en direct"}, this.table);

        this.tableHeader = createElement("tr",{}, this.table);
        createElement("th",{scope:"col",text:"Date"}, this.tableHeader);
        createElement("th",{scope:"col",text:"Capteur Interne"}, this.tableHeader);
        createElement("th",{scope:"col",text:"Capteur Externe"}, this.tableHeader);
    }

    addDataTable(data){

        let dataDate = new Date(data.Timestamp).toGMTString();

        if(this.dataTemp){
            console.log(this.dataTemp)
            this.tempDataRow = createElement("tr",{}, this.table);
            createElement("span",{text:dataDate}, this.tempDataRow);
            if(this.dataTemp[0] === "interieur"){
                this.interieur = this.dataTemp[1];
                this.externe = data.Valeur;
            }
            else{
                this.interieur= data.Valeur;
                this.externe = this.dataTemp[1];
            }
            createElement("span",{text: this.interieur}, this.tempDataRow);
            createElement("span",{text: this.externe}, this.tempDataRow);

            delete(this.dataTemp);
        }else{
            this.dataTemp = [data.Nom,data.Valeur];
        }
    }   
}   