import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { CategoryComponent } from './admin/management/category/category.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './user/user.component';
import { AngularFireModule } from '@angular/fire/compat';
import { ManagementComponent } from './admin/management/management.component';
import { OrdersComponent } from './admin/management/orders/orders.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ProductComponent } from './admin/management/product/product.component';
import { environment } from '../environments/environment';
import { FrontPageComponent } from './user/front-page/front-page.component';
import { AboutUsComponent } from './OtherPages/about-us/about-us.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    CategoryComponent,
    UserComponent,
    ManagementComponent,
    ProductComponent,
    OrdersComponent,
    FrontPageComponent,
    AboutUsComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    NgbModule,
  ],
  providers: [
    provideHttpClient(withFetch()),  // Configure HttpClient to use fetch
    provideClientHydration()  // Other providers can go here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
