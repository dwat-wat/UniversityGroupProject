import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';

export class LoginRequest {
  region: string
  username: string
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  @Output() login = new EventEmitter<any>();
  @Output() signup = new EventEmitter();
  
  public loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  loginFailed = false;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.loginForm.controls; }

  public onClickSignUp(){
    this.signup.emit(true);
  }

  public async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    // console.log(this.f.username.value + this.f.password.value);
    let req = new LoginRequest();
    req.region = "UK"
    req.username = this.f.username.value
    req.password = this.f.password.value
    
    await this.http.post<any>('https://uokgpvortexwebapi.azurewebsites.net/api/accounts/login', req, this.httpOptions).subscribe(async response => {
      if (response["statusCode"] == 200){
        await this.http.get('https://uokgpvortexwebapi.azurewebsites.net/api/accounts/details?region=UK&username=' + req.username).subscribe(response2 =>{
          console.log(response2)
          this.login.emit(response2);
        })
      }
      else{
        console.log("failed login: ")
        console.log(response)
        this.loginFailed = true;
        console.log(this.loginFailed)
      }
    });

    
    // if (this.loginForm.valid) {
      
    // }
  }
}
