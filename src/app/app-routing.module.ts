import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'list-result',
    loadChildren: () => import('./pages/list-result/list-result.module').then( m => m.ListResultPageModule)
  },
  {
    path: 'restaurant-details',
    loadChildren: () => import('./pages/restaurant-details/restaurant-details.module').then( m => m.RestaurantDetailsPageModule)
  },
  {
    path: 'restaurants-topics',
    loadChildren: () => import('./pages/restaurants-topics/restaurants-topics.module').then( m => m.RestaurantsTopicsPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./pages/tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'booking-details',
    loadChildren: () => import('./pages/booking-details/booking-details.module').then( m => m.BookingDetailsPageModule)
  },
  {
    path: 'booking-create',
    loadChildren: () => import('./pages/booking-create/booking-create.module').then( m => m.BookingCreatePageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./pages/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'booking-system',
    loadChildren: () => import('./pages/booking-system/booking-system.module').then( m => m.BookingSystemPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'restaurant-booking',
    loadChildren: () => import('./pages/restaurant-booking/restaurant-booking.module').then( m => m.RestaurantBookingPageModule)
  },
  {
    path: 'resetpassword',
    loadChildren: () => import('./pages/resetpassword/resetpassword.module').then( m => m.ResetpasswordPageModule)
  },
  {
    path: 'register-business',
    loadChildren: () => import('./pages/register-business/register-business.module').then( m => m.RegisterBusinessPageModule)
  }
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
