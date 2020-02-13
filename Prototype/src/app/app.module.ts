import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { PositionsComponent } from './positions/positions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { GraphComponent } from './graph/graph.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CookieService } from 'ngx-cookie-service';
import { ComparisonScreenComponent } from './comparison-screen/comparison-screen.component';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { PricePredictionComponent } from './price-prediction/price-prediction.component';

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
    PricePredictionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxTwitterTimelineModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
