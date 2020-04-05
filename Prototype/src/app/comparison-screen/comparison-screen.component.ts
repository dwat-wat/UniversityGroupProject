
import { dispatch } from 'rxjs/internal/observable/pairs';
import { interval } from 'rxjs';
import * as Chart from 'chart.js';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BitCoinDataVM, FinalOutputVM } from './bitCoinDataVM';

@Component({
  selector: 'app-comparison-screen',
  templateUrl: './comparison-screen.component.html',
  styleUrls: ['./comparison-screen.component.sass']
})
export class ComparisonScreenComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient) { }

  lineChart: Chart;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  finalOutputVM1: FinalOutputVM;
  finalOutputVM2: FinalOutputVM;
  positionUser1: BitCoinDataVM[] = [];
  positionUser2: BitCoinDataVM[] = [];
  positionUserdata1: number[] = [] ;
  positionUserdata2: number[] = [];
  week: string[] = [];
  errormessage: string;
  


  ngOnInit() {

  }
  async compare(str: string, startDate: Date, endDate: Date) {
    var sDate = new Date(startDate);

    let twentyWeeksDate = new Date(sDate.getTime() + (7 * 20 *24*60*60*1000));
    if(startDate > endDate){
      this.errormessage = "Please select a valid Start and End Dates";
    }else if(new Date(endDate) > twentyWeeksDate ){
      this.errormessage = "Please select a range of less than 20 weeks";
    }else{
      this.errormessage = null;
    }
    
    if(this.errormessage == null)
    {
      document.getElementById("mylinechart").style.display = "block";

      // var str = document.getElementById("text1").textContent;
      // window.alert('Comparing two users results are produced on the graph below '+str);
      let url = 'https://localhost:44373/api/Bitcoin?user=user1&&startD=' + startDate + '&&endD=' + endDate;
      let url2 = 'https://localhost:44373/api/Bitcoin?user=' + str + '&&startD=' + startDate + '&&endD=' + endDate;
      await this.http.get<FinalOutputVM>(url, this.httpOptions).subscribe(response => {
        this.finalOutputVM1 = response;
        this.positionUser1 = response.finalResults;
        this.http.get<FinalOutputVM>(url2, this.httpOptions).subscribe(response => {
          this.finalOutputVM2 = response;
          this.positionUser2 = response.finalResults;
          this.bindPosition();
        });
      });
    }
    
  }

  bindPosition() {
    if (this.positionUser2.length > this.positionUser1.length) {
      this.positionUser2.forEach( element => {
        this.week.push(element.week);
        this.positionUserdata2.push(element.bitCoinOwned);
      });
      this.positionUser1.forEach( element => {
        this.positionUserdata1.push(element.bitCoinOwned);
      });
    } else {
      this.positionUser1.forEach( element => {
        this.week.push(element.week);
        this.positionUserdata1.push(element.bitCoinOwned);
      });
      this.positionUser2.forEach( element => {
        this.positionUserdata2.push(element.bitCoinOwned);
      });
    }

    this.bindData();
  }

  bindData() {
    this.lineChart = new Chart('lineChart2', {
      type: 'line',
      data: {
        labels: this.week,
        datasets: [
          {
            label: 'Total Bitcoin Owned',
            data: this.positionUserdata1,
            borderColor: '#FF69B4',
            backgroundColor: '#FF69B4',
            fill: false,
            pointStyle: 'circle',
            radius: 6,
            rotation: 45,
            pointBorderWidth: 2,
          },
          {
            label: 'Total Bitcoin Owned',
            data: this.positionUserdata2,
            borderColor: '#0000A0',
            backgroundColor: '#0000A0',
            fill: false,
            pointStyle: 'circle',
            radius: 6,
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
            ticks: {beginAtZero:true},
            display: true
          }],
          yAxes: [{
            ticks: {beginAtZero:true},
            display: true
          }]
        }
      }
    });
  }

  clear()
  {
    document.getElementById("mylinechart").style.display = "hide";
    this.finalOutputVM1= null;
    this.finalOutputVM2 = null;
    this.positionUser1 = [];
    this.positionUser2 = [];
    this.positionUserdata1 = [] ;
    this.positionUserdata2 = [];
    this.week = [];
    this.errormessage = null;
  }


}

