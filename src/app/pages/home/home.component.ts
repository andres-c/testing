import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductsService } from "src/app/services/products.service";
import Typed from "typed.js";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import * as $ from "jquery";
import { getTodaysWeekNumber } from "src/app/utils";
import { GoogleAnalyticsService } from "src/app/services/google-analytics.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("searchdiv", { static: false }) searchdiv: ElementRef;
  products;
  lang;
  page_type;
  offers = [];
  offer_one;
  offer_five;
  dealsOver;
  selected_filter_text;
  filtered_featured_items;
  selected_weeks_offer_products;
  getWeekNumber;
  weeklyDealsBegun;
  weeklyDealsEnded;
  selected_offer;
  next_week_offer;
  top_five = {
    tag_five: [],
    tag_four: [],
    tag_two: [],
    tag_one: [],
    tag_three: [],
    tags: []
  };
  filters = {
    text_search: "",
    tag: ""
  };

  product_names;
  featued_products = [];
  constructor(
    private productsService: ProductsService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _translateService: TranslateService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    //  this is added as a patch for redirect from vanity url missing the search resultpath
    this._route.queryParams.subscribe(d => {
      if (d["search"]) {
        let path = window.location.pathname + "/search-results/";

        var qPrams = [];
        qPrams["search"] = d.search;
        qPrams["utm_source"] = d.utm_source;
        qPrams["utm_medium"] = d.utm_medium;
        qPrams["utm_campaign"] = d.utm_campaign;

        if (window.location.pathname.indexOf("fr") > -1) {
          switch (qPrams["search"]) {
            case "home": {
              qPrams["search"] = "maison";
              break;
            }
            case "tech": {
              qPrams["search"] = "technologie";
              break;
            }
            case "technophiles": {
              qPrams["search"] = "technologie";
              break;
            }
            case "travel": {
              qPrams["search"] = "voyages";
              break;
            }
          }
        }

        // console.log(d);
        // console.log(qPrams);

        this._router.navigate([path], { queryParams: qPrams });
      }
    });

    // if (window.location.pathname == "/") {
    //   this._route.data.subscribe(d => {
    //     this.lang = d["lang"];
    //     this.page_type = d["page_type"];
    //     //this._translateService.use(this.lang);
    //   });
    // } else {
    //   this._route.parent.data.subscribe(d => {
    //     this.lang = d["lang"];
    //     this.page_type = d["page_type"];
    //     //this._translateService.use(this.lang);
    //   });
    // }

    if (window.location.pathname == "/") {
      this._route.data.subscribe(d => {
        //To correct language translation issues
        if (window.location.pathname.indexOf("fr") == -1) {
          this.lang = d["lang"];
        } else {
          this.lang = "fr"; //French
        }
        this.page_type = d["page_type"];
      });
    } else {
      this._route.parent.data.subscribe(d => {
        //To correct language translation issues
        if (window.location.pathname.indexOf("fr") == -1) {
          this.lang = d["lang"];
        } else {
          this.lang = "fr"; //French
        }
        this.page_type = d["page_type"];
      });
    }

    this.fetchInitialPageLoadData();
  }

  ngOnInit() {
    console.log(this.offers);
    console.log(this.weeklyDealsEnded);
    console.log(this.offer_five);

    if (localStorage.getItem("animation") != "true") {
      let stings =
        window.location.pathname.indexOf("fr") == -1
          ? ["celebrate", "spread cheer", "give joy", ""]
          : [
              "répandez pas le bonheur",
              "célébrez pas",
              "semez pas la joie",
              ""
            ];
      /*
       */
      const options = {
        // tslint:disable-next-line: max-line-length
        strings: stings,
        typeSpeed: 55,
        backSpeed: 55,
        backDelay: 1200,
        showCursor: true,
        cursorChar: "|",
        loop: false
      };

      //    console.log(this._translateService.currentLang, options);

      const typed = new Typed(".typed-element", options);
      this._translateService.onLangChange.subscribe(d => {
        if (window.location.pathname.indexOf("fr") == -1) {
          this.lang = d["lang"];
        } else {
          this.lang = "fr"; //French
        }

        // this.lang = d["lang"];
        this.fetchInitialPageLoadData();
        this.setFilters();
      });
    }
  }
  ngAfterViewInit() {
    // animation code
    if (localStorage.getItem("animation") != "true") {
      $(".search-div").hide();
      let $text = $(".text-white-75"); // Get the images to be cycled.

      var index = 0;

      let $imageEls = $(".toggle-image"); // Get the images to be cycled.

      setInterval(function() {
        // Get the next index.  If at end, restart to the beginning.
        index = index + 1 < $imageEls.length ? index + 1 : 2;
        // Show the next image.
        $imageEls.eq(index).addClass("show");
        // Hide the previous image.
        $imageEls.eq(index - 1).removeClass("show");
      }, 3200);

      setTimeout(function() {
        $(".text-white-75").hide();
      }, 10000);

      setTimeout(function() {
        $(".search-div").fadeIn();
        $(".copy-span").fadeIn();
        $(".search-div").show();
      }, 10000);

      localStorage.setItem("animation", "true");
    } else {
      $(".search-div").css("margin-top", "40px");

      $(".first-image").removeClass("show");
      $(".third-image").addClass("show");
      $(".fourth-image").removeClass("show");
      $(".sixth-image").addClass("show");
    }
  }

  fetchInitialPageLoadData() {
    forkJoin(
      this.productsService.fetchNonFeaturedProducts(this.page_type),
      this.productsService.fetchFeatuedProducts(this.page_type, this.offers),
      this.productsService.fetchAllOffers(),
      this.productsService.nextWeekOffer(getTodaysWeekNumber())
    ).subscribe(d => {
      this.products = d[0];
      this.featued_products = d[1];
      this.offers = d[2];
      this.offer_one = this.offers[0];
      this.offer_five = this.offers[4];

      this.getWeekNumber = getTodaysWeekNumber();
      // let weeklyDealsBegun = getWeekNumber >= this.offer_one.week_number
      // if (this.getWeekNumber > this.offer_five.year_week_number){
      //   return this.weeklyDealsEnded = true;
      // };
      this.weeklyDealsEnded =
        this.getWeekNumber > this.offer_five.year_week_number ||
        this.getWeekNumber < 1;

      console.log(this.getWeekNumber);
      console.log(this.offer_five.year_week_number);
      console.log(this.weeklyDealsEnded);

      // if (!this.weeklyDealsEnded){
      //   this.next_week_offer = d[3][d[3].length - 1];
      // }

    });
  }
  setSelectedFilterText(text) {
    this.selected_filter_text = text.trim();

    //Correct/fix routiing issue:
    let windowPathName = window.location.pathname;
    if (windowPathName.indexOf("/search-results") < -1) {
      windowPathName + "/search-results";
    }

    this._router.navigate([windowPathName], {
      queryParams: { search: this.selected_filter_text }
    });
  }

  product_names_filtered: string[] = [];

  setFilters() {
    this.filters.tag = "";
    this.selected_filter_text = this.filters.text_search.toLowerCase();
    if (this.filters.text_search.trim() === "") {
      this.resetFilters();
    } else {
      this.top_five = this.productsService.fetchTopFilters(
        this.products,
        this.filters.text_search.toLowerCase()
      );
    }
  }

  resetFilters() {
    this.filtered_featured_items = [];
    this.top_five.tag_five = [];
    this.top_five.tag_four = [];
    this.top_five.tag_two = [];
    this.top_five.tag_one = [];
    this.top_five.tag_three = [];
    this.top_five.tags = [];
  }

  findAndSetPriority() {
    let lng = this._translateService.currentLang == "fr" ? "fr" : "";

    if (
      this.selected_filter_text !== undefined &&
      this.selected_filter_text.trim() !== "" &&
      this.selected_filter_text.length > 1

    ) {
      // this._router.navigate(["/search-results"], {
      //   queryParams: { search: this.selected_filter_text }
      // });
      if (window.location.pathname.indexOf("business") > -1) {
        if (lng) {
          this._router.navigate([lng, "business", "search-results"], {
            queryParams: { search: this.selected_filter_text }
          });
        } else {
          this._router.navigate(["business", "search-results"], {
            queryParams: { search: this.selected_filter_text }
          });
        }
      } else {
        if (lng) {
          this._router.navigate([lng, "search-results"], {
            queryParams: { search: this.selected_filter_text }
          });
        } else {
          this._router.navigate(["search-results"], {
            queryParams: { search: this.selected_filter_text }
          });
        }
      }

      document.body.scrollTop = 0;
    }
  }

  getDeadline(date) {
    return new Date(date).getTime();
  }
  /* modal related code */

  isVisible = false;

  showModal(week_number): void {
    this.selected_offer = this.offers.find(i => i.week_number === week_number);
    this.productsService
      .currentWeekOfferProductsByOfferWeekNumber(week_number)
      .subscribe(d => {
        this.selected_weeks_offer_products = d;
      });
    this.isVisible = true;
  }

  handleOk(): void {
    this.selected_weeks_offer_products = [];

    this.isVisible = false;
  }

  handleCancel(): void {
    this.selected_weeks_offer_products = [];
    this.isVisible = false;
  }
  searchByProductCategory(text) {
    // let lng = this._translateService.currentLang == "fr" ? "fr" : "";
    let lng = window.location.pathname.indexOf("fr") !== -1 ? "fr" : "";

    if (window.location.pathname.indexOf("business") > -1) {
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
  }

  viewAllProducts() {
    // let lng = this._translateService.currentLang == "fr" ? "fr" : "";
    // if (lng) {
    //   this._router.navigate(["search-results", lng]);
    // } else {
    //   this._router.navigate(["search-results"]);
    // }

    this.googleAnalyticsService.eventEmitter(
      "clickedButton",
      "clickedviewallproducts",
      "onhomepage"
    );
    let lng = this._translateService.currentLang == "fr" ? "fr" : "";
    if (window.location.pathname.indexOf("business") > -1) {
      if (lng) {
        this._router.navigate([lng, "business", "search-results"], {});
      } else {
        this._router.navigate(["business", "search-results"], {});
      }
    } else {
      if (lng) {
        this._router.navigate([lng, "search-results"], {});
      } else {
        this._router.navigate(["search-results"], {});
      }
    }
    document.body.scrollTop = 0;
  }
}
