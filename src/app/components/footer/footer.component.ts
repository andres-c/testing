import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  selectedValue;
  pagetype;
  isVisible = false;

  constructor(
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.selectedValue = translate.currentLang;
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe(d => {
      this.selectedValue = d["lang"];
    });

    if (window.location.pathname.indexOf("business") > -1) {
      this.pagetype = "business";
    }
  }
  changeLanguage(value) {
    this.translate.use(value);
    let pg_url = this.router.url;
    


    // Check Business Page
    var pgBiz = false;
    if (pg_url.indexOf("business") > -1) {
      pgBiz = true;
    }
    if (value == "fr") {
      
      if (pgBiz) {
        pg_url = "/fr/business";
      } else {
        pg_url = "/fr";
      }

      document.title = "Points-privilèges";
      document.querySelector("html").setAttribute("lang", "fr"); 

      document.body.scrollTop = 0;
      console.log("fr", pg_url);
      this.router.navigateByUrl(pg_url);
    } else {
     
      if (pgBiz) {
        pg_url = "/business";
      } else {
        pg_url = "";
      }

      document.title = "Membership Rewards";
      document.querySelector("html").setAttribute("lang", "fr");

      console.log("en", pg_url);
      document.body.scrollTop = 0;
      this.router.navigateByUrl(pg_url);
    }
  }

  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }
}
