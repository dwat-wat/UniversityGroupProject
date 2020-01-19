import { Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title     = 'Prototype';
  loggedin  = false;

  onLogin(_loggedin: boolean){
    console.log("onlogin")
    this.loggedin = _loggedin;
  }
}
