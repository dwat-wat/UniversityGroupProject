import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  loggedin  = null;
  currentview = 'login';

  constructor(private cookieService: CookieService, private router: Router) { }

  ngOnInit() {
    if (this.cookieService.get('current-user') != ''){
      this.router.navigate(['/main']);
    }
  }

  onLogin(_loggedin: string){
    this.loggedin = _loggedin;
    console.log(this.loggedin)
    console.log(_loggedin)
    console.log(this.cookieService.get('current-user'))
    this.cookieService.set('current-user', this.loggedin);
    console.log(this.cookieService.get('current-user'))
    this.router.navigate(['/main']);
  }
  
  onClickSignUp(_signup: boolean){
    if(_signup){
      this.currentview = 'signup';
    }
    else{
      this.currentview = 'login';
    }
  }

}
