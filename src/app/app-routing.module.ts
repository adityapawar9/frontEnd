import { ApplicationConfig, NgModule } from '@angular/core';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from "./admin/admin.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AboutUsComponent } from "./OtherPages/about-us/about-us.component";
import { UserComponent } from "./user/user.component";
import {DummyComponent} from "./dummy/dummy.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {FrontPageComponent} from "./user/front-page/front-page.component";

const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'user', component: UserComponent },
  { path: 'dummy', component: DummyComponent },
  { path: 'contactUs', component: ContactUsComponent },
  { path: 'frontpage', component: FrontPageComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Optional default route
  { path: '**', redirectTo: 'home', pathMatch: 'full' } // Optional wildcard route for 404
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
