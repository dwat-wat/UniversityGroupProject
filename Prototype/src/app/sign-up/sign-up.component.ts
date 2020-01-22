import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';

export class SignUpRequest {
  region: string
  username: string
  password: string
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {
  @Output() login = new EventEmitter<boolean>();
  @Output() signup = new EventEmitter<boolean>();
  
  public signupForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  signupFailed = false;

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
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.signupForm.controls; }

  public onClickLogin(){
    this.signup.emit(false);
  }

  public async onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }

    console.log(this.f.username.value + this.f.password.value);
    let req = new SignUpRequest();
    req.region = "UK"
    req.username = this.f.username.value
    req.password = this.f.password.value
    
    await this.http.post<any>('https://uokgpwebapi.azurewebsites.net/api/accounts/new', req, this.httpOptions).subscribe(response => {
    console.log(req)
    
    
    if (response["statusCode"] == 201){
        this.login.emit(this.f.username.value);
        console.log(response["statusCode"]);  
      }
      else{
        this.signupFailed = true;
      }
    });
  }

}
