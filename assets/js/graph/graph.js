import { receptor } from "../Receptor";
import { qs,createElement } from "../utils/utils";

export class Graph {

    constructor(parent){
        this.canvas = createElement("canvas",{}, parent);
        this.ctx = this.canvas.getContext('2d');

        this.gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.gradient.addColorStop(0, 'rgba(131,100,180,1)');
        this.gradient.addColorStop(0.6, 'rgba(131,100,180,0.5)');
        this.gradient.addColorStop(1, 'rgba(131,100,180,0)');
        this.gradient2 = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.gradient2.addColorStop(0, 'rgba(253,29,29,1)');
        this.gradient2.addColorStop(0.6, 'rgba(253,29,29,0.5)');
        this.gradient2.addColorStop(1, 'rgba(253,29,29,0)');

        this.screenWidth = window.innerWidth;
        window.addEventListener("resize", ()=> {
            this.gradientupdate();
            this.chart.update();
        });

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
            interaction: {
                mode: 'index',
                intersect: true,
            },
            stacked: false,
            plugins: {
                tooltip:{
                    callbacks: {
                        title: function(tooltipItem, data) {
                            console.log(tooltipItem);

                          return  "Capteur " ;
                        },
                        label: function(tooltipItem, data) {
                          return tooltipItem.label;
                        },
                        afterLabel: function(tooltipItem, data) {
                          return tooltipItem.formattedValue + " °C";
                        }
                      },
                }
            }
        }
        };
        
    }
    
    canvasUpdate

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
        this.gradient.addColorStop(0.6, 'rgba(131,100,180,0.5)');
        this.gradient.addColorStop(1, 'rgba(131,100,180,0)');

        this.gradient2 = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);

        this.gradient2.addColorStop(0, 'rgba(253,29,29,1)');
        this.gradient2.addColorStop(0.6, 'rgba(253,29,29,0.5)');
        this.gradient2.addColorStop(1, 'rgba(253,29,29,0)');
        this.chart.data.datasets[1].backgroundColor = this.gradient2;
        this.chart.data.datasets[0].backgroundColor = this.gradient;
    }
    create(){
        this.chart = new Chart(this.ctx, this.config);
        receptor.addSensorDataListener(this)
        receptor.DAO.getSensorData({filters:["exterieur","interieur"],startTime:Date.parse(new Date(Date.now() - 86400000))}).then((result) => {
            console.log(result);
            this.addData(result);
        });
        this.gradientupdate();
    };

    update(t){
        this.addSingleData(t);
    }

}