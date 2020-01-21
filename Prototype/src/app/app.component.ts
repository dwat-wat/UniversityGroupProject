import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title     = 'Prototype';
  loggedin  = null;
  signup = false;

  constructor(private cookieService: CookieService){}

  ngOnInit(): void{    
    this.loggedin = this.cookieService.get('current-user')
  }

  onLogin(_loggedin: string){
    console.log(_loggedin)
    this.loggedin = _loggedin;
    this.cookieService.set('current-user', this.loggedin)
  }
  
  onClickSignUp(_signup: boolean){
    this.signup = _signup;
  }
}