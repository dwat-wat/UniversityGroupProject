import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component'
import { MainComponent } from './main/main.component'
import { HomeComponent } from './home/home.component';
import { PricePredictionComponent } from './price-prediction/price-prediction.component'
import { ComparisonScreenComponent } from './comparison-screen/comparison-screen.component'
import { SocialMediaComponent } from './social-media/social-media.component'
import { ForumComponent } from './forum/forum.component'
import { HistoryComponent } from './history/history.component'
import { ChatSystemComponent } from './chat-system/chat-system.component'
import { HistoricGraphComponent } from './Historic Graph/historicgraph.component'
import { GraphComponent } from './graph/graph.component'

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
    path: 'priceprediction',
    component: PricePredictionComponent
  },
  {
    path: 'socialmedia',
    component: SocialMediaComponent
  },
  {
    path: 'compare',
    component: ComparisonScreenComponent
  },
  {
    path: 'forum',
    component: ForumComponent
  },
  {
    path: 'live',
    component: ChatSystemComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'historicgraph',
    component: HistoricGraphComponent
  },
  {
    path: 'graph',
    component: GraphComponent
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
