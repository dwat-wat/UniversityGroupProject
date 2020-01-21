import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { PositionsComponent } from './positions/positions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { GraphComponent } from './graph/graph.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CookieService } from 'ngx-cookie-service';
import { ComparisonScreenComponent } from './comparison-screen/comparison-screen.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SocialMediaComponent,
    PositionsComponent,
    GraphComponent,
    SignUpComponent,
    ComparisonScreenComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxTwitterTimelineModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
