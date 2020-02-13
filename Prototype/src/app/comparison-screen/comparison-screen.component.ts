import { Component, OnInit } from '@angular/core';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { interval } from 'rxjs';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-comparison-screen',
  templateUrl: './comparison-screen.component.html',
  styleUrls: ['./comparison-screen.component.sass']
})
export class ComparisonScreenComponent implements OnInit {

  constructor() { }

  lineChart: Chart;

  ngOnInit() {this.lineChart = new Chart('lineChart2', {
    type: 'line', 
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
      datasets: [
        {
          label: 'Bitcoin Purchased',
          data: [200, ,550, ,400, ,600, ],
          borderColor: '#7c258a',
          backgroundColor: '#7c258a',
          fill: false,
          pointStyle: 'circle',
          radius: 10,
          rotation: 45,
          pointBorderWidth: 3,
        
        },
        
        { 
          label: 'Bitcoin Sold',
          data: [ ,350, ,700, ,300, ,845],
          borderColor: '#7c258a',
          backgroundColor: '#7c258a',
          fill: false,
          pointStyle: 'crossRot',
          radius: 10,
          pointBorderWidth: 6,
        
        },

        {
          label: 'Bitcoin Value',
          data: [200,350,550,700,400,300,600,845],
          borderColor: '#7c258a',
          fill: false,
          pointStyle: 'cross',
          radius: 0,
          pointBorderWidth: 0,
        
        },

        //n1n1n1//

        {
          label: 'Bitcoin Purchased',
          data: [300, ,650, ,500, ,800, ],
          borderColor: '#00ffff',
          backgroundColor: '#00ffff',
          fill: false,
          pointStyle: 'circle',
          radius: 10,
          rotation: 45,
          pointBorderWidth: 3,
        
        },
        
        { 
          label: 'Bitcoin Sold',
          data: [ ,400, ,750, ,400, ,945],
          borderColor: '#00ffff',
          backgroundColor: '#00ffff',
          fill: false,
          pointStyle: 'crossRot',
          radius: 10,
          pointBorderWidth: 6,
        
        },

        {
          label: 'Bitcoin Value',
          data: [300,400,650,750,500,400,800,945],
          borderColor: '#00ffff',
          fill: false,
          pointStyle: 'cross',
          radius: 0,
          pointBorderWidth: 0,
        
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

    
  }
    
  compare(){

    document.getElementById("mylinechart").style.display = "block";

    var str = document.getElementById("text1").nodeValue;
    window.alert('Comparing two users results are produced on the graph below '+str);

    



  }
   

  


}

