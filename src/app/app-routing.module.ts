import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth-guard.service';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
//const redirectLoggedInCustomerToHome = () => redirectLoggedInTo(['home-page-customer']);
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
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule),
    //...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'sign-up-technician',
    loadChildren: () => import('./sign-up-technician/sign-up-technician.module').then( m => m.SignUpTechnicianPageModule),
    //...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule),
    //...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'home-page-customer',
    loadChildren: () => import('./home-page-customer/home-page-customer.module').then( m => m.HomePagePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'home-page-technician',
    loadChildren: () => import('./home-page-technician/home-page-technician.module').then( m => m.HomePageTechnicianPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
