import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title     = 'Vortex';
  selectedPortfolio = '';

  constructor(private router: Router, private cookieService: CookieService){}

  ngOnInit(): void{  
    if(this.user == ''){
      this.router.navigate(['/main']);
    }
    this.selectedPortfolio = this.cookieService.get('current-portfolio')
    // if(usercookie == ''){
    //   this.currentview = 'login';
    // }
    // else{  
    //   console.log('home')
    //   this.loggedin = usercookie;
    //   this.currentview = 'home';
    // }
  }

  get user() { return this.cookieService.get('current-user'); }

  onClickLogout(){
    this.cookieService.delete('current-user');
    // this.loggedin = null;
    // this.currentview = 'login';
  }
}