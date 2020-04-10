import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as Chart from 'chart.js';
import { stringify } from 'querystring';



@Component({
  selector: 'app-HistoricGraph',
  templateUrl: './historicgraph.component.html',
  styleUrls: ['./historicgraph.component.sass']
})

/*
export class linegraphdataChartData{
  constructor(_name: string){
    this.name = _name;
    this.series = [];
  }
  name: string;
  series: ChartData[];
}

export class ChartData{
  constructor(_name: string, _value: string){
    this.name = _name;
    this.value = _value;
  }
  name: string;
  value: string;
}
*/

export class HistoricGraphComponent implements OnInit {

  constructor(private http: HttpClient) { }

  histo1: string;
  histo2: string;
  
  data: number[] = [];
  linegraphdata: number[] = [];
  times: any[] = [];
  
  lineChart: Chart;
  candlestickChart: Chart;

  date1: string;
  date2: string;

  chartLabel: number[] = [];

  theOpen: string;

  public histographchoice : FormGroup;
  loading = false;
  submitted = false;
  returnUrl : string;

  searchvaluesend(histo1, histo2) {
    this.date1 = histo1;
    this.date2 = histo2;
  }

ngOnInit() {}

    //this.date1;
    //this.date2;
  
  /* DatesToString(datey: string){
    let year = datey.slice(0,2);
    let dayofyear = datey.slice(2,5);

    return year + "-" + dayofyear;
  } */



   async getData(Start: string, End: string){
    //document.getElementById("mylinechart").style.display = "block";
    await this.http.get<any>('https://uokgpvortexwebapi.azurewebsites.net/api/LiveAndHistoricalData/data?currency=BTC&before='+Start+'&now='+End).subscribe(
      response => {
        console.log(response)
        this.data = [];
        this.linegraphdata = [];
        this.times = [];
        
       for(var a = 0; a < response.length; a++){
          this.linegraphdata.push(response[a]["open"]);
          this.times.push(response[a]["rowKey"]);
        }
              
        console.log(this.linegraphdata);
        console.log(this.times);
        this.theCharts();
       
       
        //this.linegraphdata.push(response["open"]);
        //response.map(response => { opens: response.open});
        
        //this.theOpen = "open";

        //this.data.push(new ChartData("LiveData", response[response.length-2]["Open"]));
                
        //this.linegraphdata = response.open;
        //this.linegraphdata.push(new linegraphdataChartData("Open"));
        //this.linegraphdata.push(new linegraphdataChartData("High"));
        //this.linegraphdata.push(new linegraphdataChartData("Low"));
        //this.linegraphdata.push(new linegraphdataChartData("Close"));

      /*  for(var i = 0; i < this.linegraphdata.length; i++){
          for(var j = 0; j < response.length; j++){
            var date = this.DatesToString(response[j]["rowKey"]);
            
            var r = response[j];
            if(r != 0.0){
              var chartsdata = new ChartData(date, r);
              this.linegraphdata[i]["Open"].push(chartsdata);
            }
          }
        } */

    });
  }

  theCharts() {
    //var ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    document.getElementById("mylinechart").style.display = "block";
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.times,
        datasets: [
          {
            label: 'Bitcoin Value',
            data: this.linegraphdata,
            borderColor: '#FF69B4',
            backgroundColor: '#FF69B4',
            fill: false,
            pointStyle: 'circle',
            radius: 2,
            rotation: 45,
            pointBorderWidth: 2,
          },
        ]
      },
      options: {
        title: {
          text: "Bitcoin Value",
          display: true
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {beginAtZero:false},
            display: true
          }],
          yAxes: [{
            ticks: {beginAtZero:false},
            display: true
          }]
        }
      }
    });
   }
  

}
