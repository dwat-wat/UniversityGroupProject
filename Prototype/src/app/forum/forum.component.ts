import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export class Forum {
  timestamp : string
  userName : string
  question : string
  reply : string
}

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.sass']
})

export class ForumComponent implements OnInit {

  reply : Forum[]
  replydata : any[]
  questions : Forum[]
  questiondata : any[]
  selected : Forum
  submittedCreate : boolean = false;

  httpOptions = {
    headers: new HttpHeaders({
      responseType: 'text'
    })
  };

  constructor(private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private http : HttpClient) { }

    public createForumForm: FormGroup;

  ngOnInit(): void {
    this.createForumForm = this.formBuilder.group({
      question: ['', Validators.required],
      reply: ['', Validators.required]
    });
    this.getQuestions();
  }
  
  get f() { 
    return this.createForumForm.controls; 
  }
  
  get user() {
    return this.cookieService.get('current-user');
  }

  async getQuestions(){
    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/forum/data';
    console.log(url)
    await this.http.get<Forum[]>(url).subscribe(
      response => {
        console.log(response)
        this.questions = response
      });
  }

  async getReply(){
    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/forum/data';
    console.log(url)
    await this.http.get<Forum[]>(url).subscribe(
      response => {
        console.log(response)
        this.reply = response
      });
  }

  public async onCreateSubmit() {
    this.submittedCreate = true;

    let req = new Forum();

    req.userName = this.cookieService.get('current-user')
    req.question = this.f.question.value
    req.reply = this.f.reply.value
    req.timestamp = new Date().toISOString()
    
    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/forum/insert';
    
    await this.http.post<any>(url, req, this.httpOptions)
    .subscribe(response => {
      console.log(response);
      console.log(this.selectQuestion(req.question));
      
      if (response["statusCode"] == 200) {
        console.log(req.userName, req.question, req.reply, req.timestamp)
        console.log(response);
      }
      
      this.selectQuestion(req.question)
      this.getQuestions()
    });
  }

  selectQuestion(p){
    console.log(p)
    this.selected = p;
    this.cookieService.set('current-question', p.question)
    console.log(this.cookieService.get('current-question'))

    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/forum/data';

    this.http.get<any>(url, this.httpOptions)
    .subscribe(response => {
      console.log(response)
      this.questiondata = response
    });
  }

  selectReply(p){
    console.log(p)
    this.selected = p;
    this.cookieService.set('current-reply', p.reply)
    console.log(this.cookieService.get('current-reply'))

    let url = 'https://uokgpvortexwebapi.azurewebsites.net/api/forum/data';

    this.http.get<any>(url, this.httpOptions)
    .subscribe(response => {
      console.log(response)
      this.replydata = response
    });
  }
}
