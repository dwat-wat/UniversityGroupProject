import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'PrototypeAdministration';
  gaugeType = "semi";
  gaugeValue = 28.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "km/hr";

  constructor(private cookieService: CookieService, private router: Router, private httpClient: HttpClient) { }

  ngOnInit() {
    if (this.cookieService.get('current-user') != ''){
      this.router.navigate(['/main']);
    }
  }

  get user() {
    return this.cookieService.get('current-user')
  }

  onLogin(_loggedin: string){
    this.cookieService.set('current-user', _loggedin);
    this.router.navigate(['/main']);
  }
}
