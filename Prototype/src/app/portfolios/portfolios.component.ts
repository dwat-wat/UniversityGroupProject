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
}

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.sass']
})
export class PortfoliosComponent implements OnInit {

  portfolios : Portfolio[]
  selected : Portfolio
  submittedCreate : boolean = false;

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
    let url = 'https://uokgpwebapi.azurewebsites.net/api/portfolio?username='+ this.cookieService.get('current-user')
    console.log(url)
    await this.http.get<Portfolio[]>(url).subscribe(
      response => {
        console.log(response)
        this.portfolios = response
      });
  }

  public async onCreateSubmit() {
    this.submittedCreate = true;

    let url = 'https://uokgpwebapi.azurewebsites.net/api/portfolio/new?username='+ this.cookieService.get('current-user') + '&portfolio=' + this.f.portfolioname.value + '&amount=' + this.f.amount.value
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
  }
}
