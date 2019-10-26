import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as $ from "jquery";
import * as Hammer from "hammerjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  constructor(
    private _translateService: TranslateService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  selectedValue;

  ngOnInit() {
    this._translateService.onLangChange.subscribe(d => {
      this.selectedValue = d["lang"];
    });

    // var myElement = document.querySelector('.overlay-menu a');
    // var hammertime = new Hammer(myElement);
    // hammertime.on('tap', function(ev) {
    //   console.log(ev);
    // });
  }
  handleTap() {
    console.log("tap");
  }
  searchByProductCategory(text) {
    let lng = this._translateService.currentLang == "fr" ? "fr" : "";
    if (window.location.href.indexOf("business") > -1) {
      if (lng) {
        this._router.navigate([lng, "business", "search-results"], {
          queryParams: { search: text, is_category: true }
        });
      } else {
        this._router.navigate(["business", "search-results"], {
          queryParams: { search: text, is_category: true }
        });
      }
    } else {
      if (lng) {
        this._router.navigate([lng, "search-results"], {
          queryParams: { search: text, is_category: true }
        });
      } else {
        this._router.navigate(["search-results"], {
          queryParams: { search: text, is_category: true }
        });
      }
    }
    document.body.scrollTop = 0;

    $(".overlay").removeClass("nav-active");
    $(".toggle-button").removeClass("toggle-active");
  }

  goHome() {
    let lng = this._translateService.currentLang == "fr" ? "fr" : "";
    if (window.location.href.indexOf("business") > -1) {
      if (lng) {
        this._router.navigate(["/", lng, "business"], {});
      } else {
        this._router.navigate(["/", "business"], {});
      }
    } else {
      if (lng) {
        this._router.navigate(["/", lng], {});
      } else {
        this._router.navigate(["/"], {});
      }
    }
    document.body.scrollTop = 0;
  }
}
