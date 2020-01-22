import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component'
import { MainComponent } from './main/main.component'
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
