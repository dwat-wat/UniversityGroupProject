import { Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title     = 'Prototype';
  loggedin  = null;

  onLogin(_loggedin: boolean){
    this.loggedin = _loggedin;
  }
}