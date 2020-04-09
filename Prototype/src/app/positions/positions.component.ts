import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export class PositionsRequest {
  timestamp : string
  userName : string
  currency : string
  quantity : number
  positionType : string
  portfolio : string
}

@Component ({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.sass']
})

export class PositionsComponent implements OnInit {

  data : any;
  positions : any;
  response : any;
  btc : any;
  btcValue2 : any;

  public positionsForm : FormGroup;
  loading = false;
  submitted = false;
  returnUrl : string;

  httpOptions = {
    headers : new HttpHeaders ({
      'Content-Type':  'application/json',
    })
  };

  constructor(private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private cookieService: CookieService,
    private http : HttpClient) { }
    
    ngOnInit() { 
      this.positionsForm = this.formBuilder.group ({
      positionQuantity: ['', Validators.required]
    });
    
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.getPositions();
    console.log(this.cookieService.get('current-portfolio'));
  }
  
  get f() { 
    return this.positionsForm.controls; 
  }

  onBuy() {
    this.submitted = true;
    this.openPosition("BUY");
    this.updateOnBuy();
  }

  onSell() {
    this.submitted = true;
    this.openPosition("SELL");
    this.updateOnSell();
  }

  public async openPosition(positionType : string) {
    this.submitted = true;
    
    let req = new PositionsRequest();

    req.userName = this.cookieService.get('current-user')
    req.currency = "BITCOIN"
    req.quantity = this.f.positionQuantity.value
    req.positionType = positionType
    req.timestamp = new Date().toISOString()
    req.portfolio = this.cookieService.get('current-portfolio')

    
    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/positions/insert';
    
    await this.http.post<any>(url, req, this.httpOptions)
    .subscribe(response => {
      if (response["statusCode"] == 200) {
        console.log(req.userName, req.currency, req.quantity, req.positionType, req.timestamp)
      }
      this.getPositions()
    });
  }
  
  public async getPositions() {
    
    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/positions/portfoliodata?userName=' + this.cookieService.get("current-user") + '&portfolio=' + this.cookieService.get('current-portfolio');

    await this.http.get<any>(url, this.httpOptions)
    .subscribe(response => {
      console.log(response)
      this.positions = response
    });
  }

  // public async getBitcoinData() {
    
  //   let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/cryptodata/data?_currency=btc';

  //   this.http.get<any>(url, this.httpOptions)
  //   .subscribe(response => {
  //     console.log(response)
  //     this.btc = response
  //   });
  // }

  public async updateOnBuy() {
    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/portfolio/get?username=' + this.cookieService.get('current-user') + '&portfolio=' + this.cookieService.get('current-portfolio'); 

    this.http.get<any>(url, this.httpOptions)
    .subscribe(response => {
      console.log(response)

      let btc = this.f.positionQuantity.value
      let url2 = 'https://uokgpvortexwebapi.azurewebsites.net/api/portfolio/update?username=' + this.cookieService.get('current-user') + '&portfolio=' + this.cookieService.get('current-portfolio') + '&gbp=' + (response.gbp - (btc * 7000)) + '&btc=' + (response.btc + btc);
     
      this.http.put<any>(url2, this.httpOptions)
      .subscribe(response => {
        console.log(response)
      });
    });
  }

  public async updateOnSell() {
    let url1 = 'https://uokgpvortexwebapi.azurewebsites.net/api/portfolio/get?username=' + this.cookieService.get('current-user') + '&portfolio=' + this.cookieService.get('current-portfolio');

    this.http.get<any>(url1, this.httpOptions)
    .subscribe(response => {
      console.log(response)

      let btc = this.f.positionQuantity.value
      let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/portfolio/update?username=' + this.cookieService.get('current-user') + '&portfolio=' + this.cookieService.get('current-portfolio') + '&gbp=' + (response.gbp + (btc * 7000)) + '&btc=' + (response.btc - btc);
     
      this.http.put<any>(url, this.httpOptions)
      .subscribe(response => {
        console.log(response)
      });
    });
  }
}



















