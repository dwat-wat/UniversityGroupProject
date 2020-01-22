import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {

  constructor(private cookieService: CookieService) { }

  ngOnInit() {
    console.log('account');
  }

  get user(){
    return this.cookieService.get('current-user');
  }
}
