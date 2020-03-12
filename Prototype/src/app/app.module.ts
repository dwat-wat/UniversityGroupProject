import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { PositionsComponent } from './positions/positions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGaugeModule } from 'ngx-gauge';

import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { GraphComponent } from './graph/graph.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CookieService } from 'ngx-cookie-service';
import { ComparisonScreenComponent } from './comparison-screen/comparison-screen.component';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { PricePredictionComponent } from './price-prediction/price-prediction.component';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChatSystemComponent } from './chat-system/chat-system.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SocialMediaComponent,
    PositionsComponent,
    GraphComponent,
    SignUpComponent,
    ComparisonScreenComponent,
    AccountComponent,
    HomeComponent,
    MainComponent,
    PricePredictionComponent,
    PortfoliosComponent,
    ChatSystemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxTwitterTimelineModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    NgxGaugeModule,
    ScrollingModule
  ],
  providers: [CookieService, MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
