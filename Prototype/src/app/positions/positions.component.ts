import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

export class PositionsRequest {
  timestamp: Date
  userName: string
  currency: string
  quantity: BigInteger
  positionType: string
}

@Component ({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.sass']
})

export class PositionsComponent implements OnInit {

  public positionsForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  httpOptions = {
    headers: new HttpHeaders ({
      'Content-Type':  'application/json',
    })
  };
  
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
    private http: HttpClient) { }
    
    ngOnInit() { 
      this.positionsForm = this.formBuilder.group ({
      buyQuantity: ['', Validators.required],
      sellQuantity: ['', Validators.required]
    });
    
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  get f() { return this.positionsForm.controls; }

  public async onBuy() {
    
    let req = new PositionsRequest();
    //req.timestamp = this.f.timestamp.value
    req.userName = this.f.username.value
    req.currency = "BITCOIN"
    req.quantity = this.f.positionQuantity.value
    req.positionType = this.f.positionType.value
    
    await this.http.post<any>('https://uokgpwebapi.azurewebsites.net/api/positions/insert', req, this.httpOptions).subscribe(response => {
      if (response["statusCode"] == 200) {
        console.log(this.f.username.value, this.f.positionQuantity.value, this.f.positionType.value)
      }
    });
  }
}















