import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

export class Portfolio{
  PartitionKey : string
  Username : string
  RowKey : string
  Portfolio : string
  GBP : number
  BTC : number
}

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.sass']
})
export class PortfoliosComponent implements OnInit {

  portfolios : Portfolio[]

  constructor(private cookieService: CookieService,
    private http : HttpClient) { }

  ngOnInit(): void {
    this.getPortfolios();
  }

  async getPortfolios(){
    let url = 'https://uokgpwebapi.azurewebsites.net/api/portfolio?username='+ this.cookieService.get('current-user')
    console.log(url)
    await this.http.get<Portfolio[]>(url).subscribe(
      response => {
        console.log(response)
        this.portfolios = response
      });
  }
}
