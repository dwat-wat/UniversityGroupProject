import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

export class CustomDate{
  constructor(_date: Date){
    this.date = _date;
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.day = this.date.getDate();
    this.shortdate = this.year + '-' + this.month + '-' + this.day;
  }

  date: Date;
  shortdate: string;
  year: number; 
  month: number; 
  day: number;

  getTime(){
    return this.date.toISOString();
  }
}

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


@Component({
  selector: 'app-price-prediction',
  templateUrl: './price-prediction.component.html',
  styleUrls: ['./price-prediction.component.sass']
})
export class PricePredictionComponent implements OnInit {
  data: any[] = [];
  linegraphdata: any[] = [];
  showaboutsection: boolean = false;
  graphview: any[] = [window.innerWidth * 0.8, window.innerHeight*0.6];
  gaugeview: any[] = [window.innerWidth * 0.4, window.innerHeight*0.4];
  colorSchemeGraph = {
    domain: ['#00fe32', '#fe9e00', '#00c4fe', '#6800fe', '#ff00fb']
  };
  colorSchemeGauge = {
    domain: ['#00fe32', '#ff00fb']
  };
  legend = false;
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

  // gauge
  thresholdConfig = {
    '-5': {color: 'red'},
    '-3.5': {color: 'orange'},
    '-1': {color: 'yellow'},
    '1': {color: 'green'},
    '3.5': {color: 'darkgreen'}
    };
  gaugeValue: number = 99
  gaugeText = "Up"
  gaugeType = "semi";
  gaugeConfidence = 0
  gaugeSize = window.innerWidth*0.2
  backgroundColor = '#f2f2f2';


  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  days = 30;
  todate: CustomDate = new CustomDate(new Date());
  fromdate: CustomDate = new CustomDate(new Date(this.todate.date.getTime() - (this.days * 24 * 60 * 60 * 1000)));
  

  constructor(private http: HttpClient, private calendar: NgbCalendar) { }
  
  ngOnInit() {
    this.todate = new CustomDate(new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000)));
    this.fromdate = new CustomDate(new Date(this.todate.date.getTime() - (this.days * 24 * 60 * 60 * 1000)));
  
    this.getData();
  }

  yDoYtoDateString(yDoY: string){
    let year = yDoY.slice(0,2);
    let dayofyear = yDoY.slice(2,5);

    return year + "-" + dayofyear;
  }

  async getData(){
    await this.http.get<any>('https://uokgpwebapi.azurewebsites.net/api/Prediction/data?_currency=BTC&_from='+this.fromdate.date.toISOString()+'&_to='+this.todate.date.toISOString()).subscribe(
      response => {
        this.configureGauge(response[response.length-1], response[response.length-2])
        console.log(response)
        this.data = [];
        this.data.push(new ChartData("Previous", response[response.length-2]["actual"]));
        this.data.push(new ChartData("Predicted", response[response.length-1]["comboV1"]));
                
        this.linegraphdata = []
        this.linegraphdata.push(new linegraphdataChartData("Actual"));
        this.linegraphdata.push(new linegraphdataChartData("RBF"));
        this.linegraphdata.push(new linegraphdataChartData("Linear"));
        this.linegraphdata.push(new linegraphdataChartData("Polynomial"));
        this.linegraphdata.push(new linegraphdataChartData("ComboV1"));

        for(var i = 0; i < this.linegraphdata.length; i++){
          for(var j = 0; j < response.length; j++){
            var d = this.yDoYtoDateString(response[j]["rowKey"]);
            var n = this.linegraphdata[i]["name"];  
            var nm = ''   
            if(n.includes('Combo')){
              nm = n.charAt(0).toLowerCase() + n.slice(1);
            }        
            else{
              nm = n.toLowerCase();
            }      
            
            var v = response[j][nm];
            if(v != 0.0){
              var chd = new ChartData(d, v);
              this.linegraphdata[i]["series"].push(chd);
            }
          }
        }

    });
  }
  configureGauge(r:object, pr:object){
    var threshhold = 3.471284704558981;
    var comboV1 = r["comboV1"]
    var prev = pr["actual"]
    var diff = comboV1 - prev
    var percent = (diff/prev) * 100
    this.gaugeValue = percent
    if(percent >= threshhold){
      this.gaugeText = "Up"
      this.gaugeConfidence = ((percent/(threshhold*2))*100) - 1
    }
    else if(percent > 0){
      this.gaugeText = "Up"
      this.gaugeConfidence = ((percent/(threshhold*2))*100) - 1     
    }
    else if(percent <= -threshhold){
      this.gaugeText = "Down"
      this.gaugeConfidence = -((percent/(threshhold*2))*100) - 1    
    }
    else{      
      this.gaugeText = "Down"
      this.gaugeConfidence = -((percent/(threshhold*2))*100) - 1
    }
    this.gaugeConfidence = +this.gaugeConfidence.toFixed(2)
  }

  onGaugeFormat(e){
    //console.log(this.data);
    // if(this.gaugeValue){
      // var diff = <number>this.data[0].value - <number>this.data[1].value
      // var percent = diff/<number>this.data[0].value
      // return "%"+percent.toFixed();
      return this.gaugeValue + "%"
    // }
    // else{
    //   return "0%"
    // }
    //return "%5"
  }
  async onToDateChange(e){
    console.log(e)
    this.todate = new CustomDate(new Date(e.year, e.month-1, e.day));
    await this.getData();
  }
  async onFromDateChange(e){
    console.log(e)
    this.fromdate = new CustomDate(new Date(e.year, e.month-1, e.day));
    await this.getData();
  }

  onToggleAbout(){
    this.showaboutsection = !this.showaboutsection;
  }

  onDeactivate(e){

  }
  onActivate(e){

  }
  onSelect(e){

  }
}
