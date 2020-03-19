import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class Portfolio{
  partitionKey : string
  username : string
  rowKey : string
  portfolio : string
  gbp : number
  btc : number
  start : Date
  startGBP : number
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
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.sass']
})
export class PortfoliosComponent implements OnInit {

  frequency = 60
  portfolios : Portfolio[]
  portfoliodata : any[]
  cryptodata: any[] = [];
  selected : Portfolio
  submittedCreate : boolean = false;
  view: any[] = [1400, 600]
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
  colorSchemeGraph = {
    domain: ['#00fe32', '#fe9e00', '#00c4fe', '#6800fe', '#ff00fb']
  };
  httpOptions = {
    headers: new HttpHeaders({
      responseType: 'text'
    })
  };

  constructor(private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private http : HttpClient) { }

    public createPortfolioForm: FormGroup;

  ngOnInit(): void {
    this.createPortfolioForm = this.formBuilder.group({
      portfolioname: ['', Validators.required],
      amount: ['', Validators.required]
    });
    this.getPortfolios();
  }
  get f() { return this.createPortfolioForm.controls; }

  async getPortfolios(){
    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/portfolio?username='+ this.cookieService.get('current-user')
    console.log(url)
    await this.http.get<Portfolio[]>(url).subscribe(
      response => {
        console.log(response)
        this.portfolios = response
      });
  }

  public async onCreateSubmit() {
    this.submittedCreate = true;

    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/portfolio/new?username='+ this.cookieService.get('current-user') + '&portfolio=' + this.f.portfolioname.value + '&amount=' + this.f.amount.value
    console.log(url)
    await this.http.post<any>(url, null, this.httpOptions).subscribe(
        response => {
          this.getPortfolios()
        }
      );
  }

  selectPortfolio(p){
    console.log(p)
    this.selected = p;
    this.cookieService.set('current-portfolio', p.rowKey)
    console.log(this.cookieService.get('current-portfolio'))

    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/positions/portfoliodata?userName=' + this.cookieService.get("current-user") + "&portfolio=" + p.rowKey;

    this.http.get<any>(url, this.httpOptions)
    .subscribe(response => {
      console.log(response)
      this.portfoliodata = response
    });

    this.getData()
  }

  async getData(){
    let days = 5;
    let todate = new Date();
    let fromdate = new Date(todate.getTime() - (days * 24 * 60 * 60 * 1000));
  
    this.cryptodata = []
    this.cryptodata.push(new linegraphdataChartData("Portfolio: " + this.selected.rowKey));

    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/CryptoData/tofrom?_currency=BTC&_to='+todate.toISOString()+'&_from='+this.selected.start+'&_frequency='+this.frequency;



    await this.http.get<any[][]>(url, this.httpOptions)
    .subscribe(response => {
      console.log(response)

      let i = response.length-1;
      let startGBP = this.selected.startGBP
      let totalGBP = this.selected.startGBP
      let totalBTC = 0

      console.log(this.selected)

      for(let t = 0; t < this.portfoliodata.length-1; t++){
        console.log(this.portfoliodata[t])
        console.log("Transaction: " + t + "\nGBP: " + totalGBP + " BTC: " + totalBTC)
        totalGBP -= (this.portfoliodata[t].quantity * response[i]["close"])
        totalBTC += this.portfoliodata[t].quantity
        console.log("Transaction: " + t + "\nGBP: " + totalGBP + " BTC: " + totalBTC)
        console.log(Date.parse(response[i]["rowKey"]) + ' < ' + Date.parse(this.portfoliodata[t+1].timeStamp))
        console.log(response[i]["rowKey"] + ' < ' + this.portfoliodata[t+1].timeStamp)
        while(Date.parse(response[i]["rowKey"]) < Date.parse(this.portfoliodata[t+1].timeStamp)){
          console.log(Date.parse(response[i]["rowKey"]) + ' < ' + Date.parse(this.portfoliodata[t+1].timeStamp))
          this.cryptodata[0].series.push(
            new ChartData(
              response[i]["rowKey"], 
              (totalGBP + (response[i]["close"] * totalBTC)) + ''))
          i--;
        }
      }
      if(i >= 0){
        totalGBP -= (this.portfoliodata[this.portfoliodata.length - 1].quantity * response[i]["close"])
        totalBTC += this.portfoliodata[this.portfoliodata.length - 1].quantity
        let now = new Date()
        console.log("Transaction: " + (this.portfoliodata.length-1) + "\nGBP: " + totalGBP + " BTC: " + totalBTC)
        while(i >= 0 && Date.parse(response[i]["rowKey"]) < now.valueOf()){
          this.cryptodata[0].series.push(
            new ChartData(
              response[i]["rowKey"], 
              (totalGBP + (response[i]["close"] * totalBTC)) + ''))
          i--;
        }
      }

      console.log(this.cryptodata)
    });
  }


  onSelect(e){

  }
}
