import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title     = 'Prototype';
  loggedin  = true;
  
    lineChart: Chart;
    candlestickChart: Chart;

  ngOnInit() {

      this.lineChart = new Chart('lineChart', {
        type: 'line', 
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: 'Bitcoin Value',
              data: [220, 345, 990, 1492, 1720, 1177, 1313, 1999, 2011, 2466, 1922, 1500],
              borderColor: '#ffcc00',
              fill: false,
            }
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

      this.candlestickChart = new Chart('candlestickChart', {
        type: 'candlestick',
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: 'Bitcoin Value',
              data: [220, 345, 990, 1492, 1720, 1177, 1313, 1999, 2011, 2466, 1922, 1500],
              borderColor: '#ffcc11',
              fill: false,
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
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
