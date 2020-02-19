import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export class PositionsRequest {
  timestamp : string
  userName : string
  currency : string
  quantity : BigInteger
  positionType : string
}

@Component ({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.sass']
})

export class PositionsComponent implements OnInit {

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
    private router : Router, 
    private http : HttpClient,
    private cookieService: CookieService) { }
    
    ngOnInit() { 
      this.positionsForm = this.formBuilder.group ({
      positionQuantity: ['', Validators.required]
    });
    
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  get f() { return this.positionsForm.controls; }

  onBuy() {
    this.submitted = true;
    this.openPosition("BUY");
  }

  onSell() {
    this.submitted = true;
    this.openPosition("SELL");
  }

  public async openPosition(positionType : string) {
    this.submitted = true;
    
    let req = new PositionsRequest();
    //req.timestamp = this.f.timestamp.value

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

    let url = 'https://uokgpwebapi.azurewebsites.net/api/positions/data/' + this.cookieService.get('current-user') + '/BITCOIN';

    //return this.http.get<any>(url);

    

    /* await this.http.get<any>(url, this.httpOptions).subscribe(response => {
      if (response["statusCode"] == 200) {
        console.log(response)
        //this.data.push

      }
    }); */
  }
}





