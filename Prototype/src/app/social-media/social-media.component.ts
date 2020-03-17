import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

export class RedditRequest {
  startDate: string
  endDate: string
  currency: string
}

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.sass']
})
export class SocialMediaComponent implements OnInit {
  posts : any;
  showaboutsection: boolean = false;
  graphview: any[] = [window.innerWidth * 0.8, window.innerHeight*0.6];
  colorSchemeGraph = {
    domain: ['#00fe32', '#fe9e00', '#00c4fe', '#6800fe', '#ff00fb']
  };
  legend = false;
  legendPosition: string = 'below';
  // line, area
  autoScale = true;
  gradient = true
  showXAxis = true
  showYAxis = true
  showLegend = false
  showXAxisLabel = true
  showYAxisLabel = true
  xAxisLabel = "Date"
  yAxisLabel = "Polarity"
  @Output() socialMedia = new EventEmitter<boolean>();
  multi: any[]; 
  view: any[] = [700, 300];

  startDate = '' 
  endDate = ''
  
  
  

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'   
    })
  };

  public socialMediaForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
     }
    private lineChart: Chart;
  ngOnInit() {
    this.getData();

    this.socialMediaForm = this.formBuilder.group({
      currency: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.socialMediaForm.controls; }

  public async onSubmit() {
    this.submitted = true;
    this.getData()
  }

  public async getData() {
    this.submitted = true;      
    //console.log(this.f.startDate.value + this.f.endDate.value);
    let req = new RedditRequest();
    req.startDate = this.startDate
    req.endDate = this.endDate
    req.currency = "Bitcoin"
    //this.lineChart.data.labels = [req.startDate,req.endDate]
    //await this.http.get<any>("https://uokgpsocialmediaapp.azurewebsites.net/api/HttpTrigger?code=EaVLGEFHg6jys0omI6TKvQ740/FhhJCaHYB3VuV2c72CHPZVh5JBkA==",  this.httpOptions).subscribe(response => {
    await this.http.get<any>("https://uokgpsocialmediaapp.azurewebsites.net/api/HttpTrigger?code=EaVLGEFHg6jys0omI6TKvQ740/FhhJCaHYB3VuV2c72CHPZVh5JBkA==&startDate=2019-02-01&endDate=2019-02-11&currency=bitcoin", this.httpOptions).subscribe(response => {
      console.log(response)
      this.posts = response

    if (response["statusCode"] == 200) {
      console.log(response)
    }
});
}
}

