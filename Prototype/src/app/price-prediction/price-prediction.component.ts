import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class MultiChartData{
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


@Component({
  selector: 'app-price-prediction',
  templateUrl: './price-prediction.component.html',
  styleUrls: ['./price-prediction.component.sass']
})
export class PricePredictionComponent implements OnInit {
  data: any[] = [];
  multi: any[] = [];

  view: any[] = [window.innerWidth * 0.45, window.innerHeight * 0.8];
  colorScheme = {
    domain: ['#fe9e00', '#00fe32', '#00c4fe', '#6800fe']
  };
  legend: string = 'Legend';
  legendPosition: string = 'below';
  // line, area
  autoScale = true;
  gradient = true
  showXAxis = true
  showYAxis = true
  showLegend = true
  showXAxisLabel = true
  showYAxisLabel = true
  xAxisLabel = "Date"
  yAxisLabel = "Price (£)"

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getData();
  }


  async getData(){
    await this.http.get<any>('https://uokgpwebapi.azurewebsites.net/api/Prediction/data?_currency=BTC&_from=01-01-2020&_to=02-01-2020').subscribe(
      response => {
        this.data = [];
        this.data.push(new ChartData("Actual", response[response.length-1]["actual"]));
        this.data.push(new ChartData("RBF", response[response.length-1]["rbf"]));
        this.data.push(new ChartData("Linear", response[response.length-1]["linear"]));
        this.data.push(new ChartData("Polynomial", response[response.length-1]["polynomial"]));
                
        this.multi = []
        this.multi.push(new MultiChartData("Actual"));
        this.multi.push(new MultiChartData("RBF"));
        this.multi.push(new MultiChartData("Linear"));
        this.multi.push(new MultiChartData("Polynomial"));

        for(var i = 0; i < this.multi.length; i++){
          for(var j = 0; j < response.length; j++){
            this.multi[i]["series"].push(new ChartData(response[j]["rowKey"], response[j][this.multi[i]["name"].toLowerCase()]));
          }
        }
    });
  }
  onGaugeFormat(e){
    console.log(e);
    return "£"+e.toFixed();
  }
  onDeactivate(e){

  }
  onActivate(e){

  }
  onSelect(e){

  }
}
