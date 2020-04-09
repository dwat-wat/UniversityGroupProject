import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

export class barChartData{
  constructor(_name: string){
    this.name = _name;
    this.series = [];
  }
  name: string;
  series: ChartData[];
}

export class ChartData{
  constructor(_name: string, _value: string){
    this.name = _name;
    this.value = _value;
  }
  name: string;
  value: string;
}

export class CustomDate{
  constructor(_date: Date){
    this.date = _date;
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.day = this.date.getDate();
    this.shortdate = this.year + '-' + this.month + '-' + this.day;
  }

  date: Date;
  shortdate: string;
  year: number; 
  month: number; 
  day: number;

  getTime(){
    return this.date.toISOString();
  }
}

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.sass']
})
export class SocialMediaComponent implements OnInit {
  posts : any;
  bargraphdata: any[] = [];
  showaboutsection: boolean = false;
  graphview: any[] = [window.innerWidth * 0.8, window.innerHeight*0.6];
  colorSchemeGraph = {
    domain: ['#00fe32', '#fe9e00', '#00c4fe', '#6800fe', '#ff00fb']
  };
  legend = false;
  legendPosition: string = 'below';
  // line, area
  gradient = true
  showXAxis = true
  showYAxis = true
  showLegend = false
  showXAxisLabel = true
  showYAxisLabel = true
  fromdate: CustomDate = new CustomDate(new Date());
  todate: CustomDate = new CustomDate(new Date());
  xAxisLabel = "Date"
  yAxisLabel = "Polarity"
  @Output() socialMedia = new EventEmitter<boolean>();
  multi: any[]; 
  view: any[] = [700, 300];
  startDate: CustomDate = new CustomDate(new Date());
  endDate: CustomDate = new CustomDate(new Date());
  modelTo: NgbDateStruct;
  modelFrom: NgbDateStruct;
  
  

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
    private calendar: NgbCalendar,
    private http: HttpClient) {
     }
    private lineChart: Chart;


    async onFromDateChange(e){
      console.log(e)
      this.fromdate = new CustomDate(new Date(e.year, e.month, e.day));
      this.todate = new CustomDate(new Date(this.fromdate.date.getTime() + (7 * 24 * 60 * 60 * 1000)));
      console.log(this.fromdate)
      console.log(this.todate)
      //await this.getData();
    }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.todate = new CustomDate(new Date(new Date().getTime()));
    this.fromdate = new CustomDate(new Date(this.todate.date.getTime() - (7 * 24 * 60 * 60 * 1000)));
    this.getData();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.socialMediaForm.controls; }

  public async onSubmit() {
    this.submitted = true;
    this.getData()
  }

  onToggleAbout(){
    this.showaboutsection = !this.showaboutsection;
  }
  
  public async getData() {
    this.submitted = true;  
    this.bargraphdata = [];    
    //console.log(this.f.startDate.value + this.f.endDate.value);
    this.bargraphdata.push(new barChartData("Polarity"));
    
    await this.http.get<any>("https://uokgpsocialmediaapp.azurewebsites.net/api/HttpTrigger?code=EaVLGEFHg6jys0omI6TKvQ740/FhhJCaHYB3VuV2c72CHPZVh5JBkA==&startDate=" + this.fromdate.shortdate + "&endDate=" + this.todate.shortdate + "&currency=bitcoin", this.httpOptions).subscribe(response => {
      console.log(response)
      this.posts = response
      for(var j = 0; j < response.length; j++){
        var d = (response[j]["Date"]);
        var v = (response[j]["Polarity"]);
        console.log(d)
        console.log(v)
        var chd = new ChartData(d, v);
        this.bargraphdata[0]["series"].push(chd);
      }
    if (response["statusCode"] == 200) {
      console.log(response)
    }
});
}
}

