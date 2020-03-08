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
}

@Component ({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.sass']
})

export class PositionsComponent implements OnInit {

  //data : any;
  positions : any;

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
  }
  
  get f() { return this.positionsForm.controls; }

  onBuy() {
    this.submitted = true;
    this.openPosition("BUY");
    this.getPositions();
    console.log(this.cookieService.get("current-user/"));
    //console.log(this.getPosition);
  }

  // onClose() {
  //   this.submitted = true;
  //   console.log(this.cookieService.get("current-user/"));
    
  // }

  onSell() {
    this.submitted = true;
    this.openPosition("SELL");
    this.getPositions();
    //console.log(this.getPosition);
  }

  public async openPosition(positionType : string) {
    this.submitted = true;
    
    let req = new PositionsRequest();

    req.userName = this.cookieService.get('current-user')
    req.currency = "BITCOIN"
    req.quantity = this.f.positionQuantity.value
    req.positionType = positionType
    req.timestamp = new Date().toISOString()
    
    let url = 'https://uokgpwebapi.azurewebsites.net/api/positions/insert';
    
    await this.http.post<any>(url, req, this.httpOptions).subscribe(response => {
      if (response["statusCode"] == 200) {
        console.log(req.userName, req.currency, req.quantity, req.positionType, req.timestamp)
      }
    });
  }

  public async getPositions() {
    
    //let url = 'https://uokgpwebapi.azurewebsites.net/api/positions/data?userName=' + this.cookieService.get("current-user/") + "&currency=BITCOIN";
    let url = 'https://uokgpwebapi.azurewebsites.net/api/positions/data?userName=user1&currency=BITCOIN'

    this.http.get<any>(url, this.httpOptions)
    .subscribe(response => {
      console.log(response)
      this.positions = response

    });
  }
}







