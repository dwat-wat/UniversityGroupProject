import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-prediction',
  templateUrl: './price-prediction.component.html',
  styleUrls: ['./price-prediction.component.sass']
})
export class PricePredictionComponent implements OnInit {
  gaugeType = "semi";
  gaugeValue = 28.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "km/hr";
  constructor() { }

  ngOnInit() {
  }

}
