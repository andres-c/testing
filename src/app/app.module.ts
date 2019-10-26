import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  NgZorroAntdModule,
  NZ_I18N,
  en_US,
  NzLayoutModule,
  NzMenuModule,
  NzSelectModule
} from "ng-zorro-antd";
import { FormsModule,  ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { GtagModule } from 'angular-gtag';
import { GoogleAnalyticsService } from './services/google-analytics.service';

export function HttpLoaderFactory(http: HttpClient) {
return new TranslateHttpLoader(http, '/assets/i18n/');
}
// export function HttpLoaderFactory(httpClient: HttpClient) {
//   return new TranslateHttpLoader(httpClient);
// }
registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzMenuModule,
    NzSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // GtagModule.forRoot({ trackingId: 'UA-108482123-1', trackPageviews: true })
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, GoogleAnalyticsService ],
  bootstrap: [AppComponent]
})
export class AppModule {}
