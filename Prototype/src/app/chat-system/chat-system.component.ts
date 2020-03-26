import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export class ChatSystemRequest {
  timestamp : string
  userName : string
  history : string
}

@Component({
  selector: 'app-chat-system',
  templateUrl: './chat-system.component.html',
  styleUrls: ['./chat-system.component.sass']
})

export class ChatSystemComponent implements OnInit {

  data : any;
  response : any;
  message : any;
  
  // add(messages : string) {
  //   this.message.push(messages);
  // }
  
  public chatSystemForm : FormGroup;
  loading = false;
  submitted = false;
  returnUrl : string;

  httpOptions = {
    headers : new HttpHeaders ({
      'Content-Type':  'application/json',
    })
  };

  constructor(private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private cookieService: CookieService,
    private http : HttpClient) { }
    
    ngOnInit() { 
      this.chatSystemForm = this.formBuilder.group ({
      sendMessage: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.getMessage();
  }

  get f() { 
    return this.chatSystemForm.controls; 
  }

  get user() {
    return this.cookieService.get('current-user');
  }

  onSend() {
    this.submitted = true;
    this.sendMessage();
    this.getMessage();
    //console.log(this.sendMessage());
  }

  public async sendMessage() {
    this.submitted = true;
    
    let req = new ChatSystemRequest();

    req.userName = this.cookieService.get('current-user')
    req.history = this.f.sendMessage.value
    req.timestamp = new Date().toISOString()
    
    let url = 'https://uokgpwebapi.azurewebsites.net/api/chatsystem/insert';
    
    await this.http.post<any>(url, req, this.httpOptions)
    .subscribe(response => {
      if (response["statusCode"] == 200) {
        console.log(req.userName, req.history, req.timestamp)
        console.log(response);
      }
    });
  }

  public async getMessage() {
    
    let url = 'https://uokgpwebapi.azurewebsites.net/api/chatsystem/data?history=' + this.f.sendMessage.value;

    this.http.get<any>(url, this.httpOptions)
    .subscribe(response => {
      console.log(response)
      this.message = this.f.sendMessage.value
      console.log(this.f.sendMessage.value)
    });
  }
}
