import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardTechnician } from './guards/auth/auth-guard-technician.service'
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RememberSignInGuard } from './guards/remember-sign-in.guard';
import { AuthGuardCustomerGuard } from './guards/auth/auth-guard-customer.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
//const redirectLoggedInCustomerToHome = () => redirectLoggedInTo(['customer']);
//const redirectLoggedInTechnicianToHome = () => redirectLoggedInTo(['home-page-technician']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'sign-up-customer',
    loadChildren: () => import('./sign-up-customer/sign-up-customer.module').then( m => m.SignUpPageModule),
  },
  {
    path: 'sign-up-technician',
    loadChildren: () => import('./sign-up-technician/sign-up-technician.module').then( m => m.SignUpTechnicianPageModule),
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule),
    //...canActivate(redirectLoggedInCustomerToHome)
    canActivate: [RememberSignInGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./tabs-customer/tabs-customer.module').then( m => m.TabsCustomerPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
    canActivate: [AuthGuardCustomerGuard]
  },
  {
    path: 'technician',
    loadChildren: () => import('./tabs-technician/tabs-technician.module').then( m => m.TabsTechnicianPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
    canActivate: [AuthGuardTechnician]
  }
  // {
  //   path: 'profile-page-customer',
  //   loadChildren: () => import('./tabs-customer/profile-page-customer/profile-page-customer.module').then( m => m.ProfilePageCustomerPageModule)
  // },
  // {
  //   path: 'profile-page-technician',
  //   loadChildren: () => import('./tabs-technician/profile-page-technician/profile-page-technician.module').then( m => m.ProfilePageTechnicianPageModule)
  // },
  // {
  //   path: 'settings-page-customer',
  //   loadChildren: () => import('./tabs-customer/settings-page-customer/settings-page-customer.module').then( m => m.SettingsPageCustomerPageModule)
  // },
  // {
  //   path: 'settings-page-technician',
  //   loadChildren: () => import('./tabs-technician/settings-page-technician/settings-page-technician.module').then( m => m.SettingsPageTechnicianPageModule)
  // },
  // {
  //   path: 'tabs-customer',
  //   loadChildren: () => import('./tabs-customer/tabs-customer.module').then( m => m.TabsCustomerPageModule)
  // },
  // {
  //   path: 'tabs-technician',
  //   loadChildren: () => import('./tabs-technician/tabs-technician.module').then( m => m.TabsTechnicianPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
