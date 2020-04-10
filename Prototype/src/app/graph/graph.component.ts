import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as Chart from 'chart.js';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})


export class GraphComponent implements OnInit {

  constructor(private http: HttpClient) { }

  data: any[] = [];
  linegraphdata: any[] = [];
  times: any[] = [];
  
  lineChart: Chart;
  candlestickChart: Chart;

  dateDate: string;
  dateTime: string;
  dateDate2: string;
  dateTime2: string;
  dateFinal: string;

  dateOff = (24*60*60*1000) * 7;

  dateDateOlder: Date;
  dateDateOlderAnother: string;
  dateTimeOlder: string;
  dateDateOlder2: string;
  dateTimeOlder2: string;
  dateFinalOlder: string;

  chartingData: [];

ngOnInit() {

    this.dateDate = new Date().toISOString().slice(0, 10);
    this.dateTime = new Date().toISOString().slice(12, 17);
    this.dateDate2 = this.dateDate.toString() + ".";
    this.dateTime2 = this.dateTime.toString() + "00";
    this.dateFinal = this.dateDate2 + this.dateTime2;

    this.dateDateOlder = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
    this.dateDateOlderAnother = this.dateDateOlder.toISOString().slice(0, 10);
    this.dateTimeOlder = this.dateDateOlder.toISOString().slice(12, 17);
    this.dateDateOlder2 = this.dateDateOlderAnother.toString() + ".";
    this.dateTimeOlder2 = this.dateTimeOlder.toString() + "00";
    this.dateFinalOlder = this.dateDateOlder2 + this.dateTimeOlder2;

    this.getData();
    
   }

   async getData(){
    await this.http.get<any>('https://uokgpvortexwebapi.azurewebsites.net/api/LiveAndHistoricalData/data?currency=btc&before='+this.dateFinalOlder+'&now='+this.dateFinal).subscribe(
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

    });
  }

  theCharts() {
    //var ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    //document.getElementById("mylinechart").style.display = "block";
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
          text: "Bitcoin Value For One Day",
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
