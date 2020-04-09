import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})

export class HistoryComponent implements OnInit {

  data : any;
  positions : any;
  response : any;

  httpOptions = {
    headers : new HttpHeaders ({
      'Content-Type':  'application/json',
    })
  };

  constructor(private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private cookieService: CookieService,
    private http : HttpClient) { }
    
    ngOnInit() : void {
      this.getPositions();
      console.log(this.getPositions());
      console.log(this.cookieService.get("current-user"));
    }

    public async getPositions() {
    
      let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/positions/portfoliodata?userName=' + this.cookieService.get("current-user") + '&portfolio=' + this.cookieService.get('current-portfolio');
  
      this.http.get<any>(url, this.httpOptions)
      .subscribe(response => {
        console.log(response)
        this.positions = response
      });
    }
}
