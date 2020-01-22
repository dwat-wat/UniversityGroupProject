import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    if(this.cookieService.get('current-user') == ''){
      this.router.navigate(['/home']);
    }
  }
}
