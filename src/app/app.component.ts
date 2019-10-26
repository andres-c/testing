import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID, OnInit } from "@angular/core";
import { RouterModule, Routes, Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
declare let ga: Function;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "mr-search-feature";
  selectedValue;

  constructor(public translate: TranslateService, private router: Router) {
    // gtag.pageview();

    this.checkAndRedirect();
    translate.addLangs(["en", "fr"]);
    // translate.setDefaultLang("en");

    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|fr/) ? browserLang : "en");

    // this.selectedValue = translate.currentLang;

    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        ga("set", "page", event.urlAfterRedirects);
        ga("send", "pageview");
      }
    });
        
    // router.events.subscribe((val: any) => {
    //   if (val instanceof NavigationEnd) {
    //     let lang;
    //     if (window.location.pathname.indexOf("fr") > -1) {
    //       lang = "fr";
    //     } else {
    //       lang = "en";
    //     }

    //     // let lang = val ? (val.url.indexOf("fr") > -1 ? "fr" : "en") : "en";
    //     console.log("language is ::", lang);
    //     translate.use(lang);
    //     this.selectedValue = lang;
    //   }

    //   console.log(this);
    //   // window.scroll(0,0);

    // });
    let lang;
    if (window.location.pathname.indexOf("fr") > -1) {
      lang = "fr";
    } else {
      lang = "en";
    }
    translate.use(lang);
    this.selectedValue = lang;
  }

  ngOnInit() {}

  checkAndRedirect() {
    // let path = window.location.pathname;
    // let redirect_urls = ["/canada/holiday2019week1"];
    // const i = redirect_urls.find(i => {
    //   return i.indexOf(path) > -1
    // });
    // if (i) {
    //  // window.open("", "_self");
    // }
  }
}
