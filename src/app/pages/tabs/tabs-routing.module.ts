import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'user-profile',
        loadChildren: () => import('../user-profile/user-profile.module').then(m => m.UserProfilePageModule)
      },
      {
        path: 'tabs1/restaurants-topics',
        loadChildren: () => import('../restaurants-topics/restaurants-topics.module').then(m => m.RestaurantsTopicsPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tabs2/list-result',
        loadChildren: () => import('../list-result/list-result.module').then(m => m.ListResultPageModule)
      },
      {
        path: 'tabs2/restaurant-details',
        loadChildren: () => import('../restaurant-details/restaurant-details.module').then(m => m.RestaurantDetailsPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: 'booking-system',
        loadChildren: () => import('../booking-system/booking-system.module').then(m => m.BookingSystemPageModule)
      },
      {
        path: 'booking-system/booking-details',
        loadChildren: () => import('../booking-details/booking-details.module').then(m => m.BookingDetailsPageModule)
      },
      {
        path: 'booking-system/booking-create',
        loadChildren: () => import('../booking-create/booking-create.module').then(m => m.BookingCreatePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
