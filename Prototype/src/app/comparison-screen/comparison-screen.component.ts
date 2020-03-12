
import { dispatch } from 'rxjs/internal/observable/pairs';
import { interval } from 'rxjs';
import * as Chart from 'chart.js';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BitCoinDataVM } from './bitCoinDataVM';

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

  positionUser1: BitCoinDataVM[] = [];
  positionUser2: BitCoinDataVM[] = [];
  positionUserdata1: number[] = [] ;
  positionUserdata2: number[] = [];
  week: string[] = [];


  ngOnInit() {

  }
  async compare(str: string) {
    document.getElementById("mylinechart").style.display = "block";

    // var str = document.getElementById("text1").textContent;
    // window.alert('Comparing two users results are produced on the graph below '+str);
    let url = 'Https://uokgpwebapi.azurewebsites.net/api/Bitcoin?user=user1';
    let url2 = 'Https://uokgpwebapi.azurewebsites.net/api/Bitcoin?user=' + str;
    await this.http.get<BitCoinDataVM[]>(url, this.httpOptions).subscribe(response => {
      this.positionUser1 = response;
      this.http.get<BitCoinDataVM[]>(url2, this.httpOptions).subscribe(response => {
        this.positionUser2 = response;
        this.bindPosition();
      });
    });
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
            borderColor: '#7c258a',
            backgroundColor: '#7c258a',
            fill: false,
            pointStyle: 'circle',
            radius: 6,
            rotation: 45,
            pointBorderWidth: 2,
          },
          {
            label: 'Total Bitcoin Owned',
            data: this.positionUserdata2,
            borderColor: '#00ffff',
            backgroundColor: '#00ffff',
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


}

