import { Component, OnInit } from "@angular/core";
import { groupBy, orderBy, uniqBy, concat, uniq, chunk } from "lodash";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductsService } from "src/app/services/products.service";
import { forkJoin } from "rxjs";
// import * as $ from "jquery";
import {
  OFFER_ENABLED,
  WEEK_NUMBER_TO_YEAR_WEEK_MAP
} from "../../data/user.data";
import { getTodaysWeekNumber } from "src/app/utils";
import { TranslateService } from "@ngx-translate/core";
import { GoogleAnalyticsService } from "src/app/services/google-analytics.service";

@Component({
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.scss"]
})
export class SearchResultsComponent implements OnInit {
  randomly_selected_one_feature_product;
  deadline;
  order_by;
  products;
  filtered_items;
  selected_filter_text;
  filtered_items_chunk = [];
  // use these variable for page condition
  lang;
  page_type;
  filtered_featured_items;
  random_featured_item;

  onlyfeatureblock;

  this_weeks_offer_products = [];
  offer_enabled = OFFER_ENABLED;
  offer;
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
    private _route: ActivatedRoute,
    private _translateService: TranslateService,
    private _router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    if (window.location.pathname.indexOf("business") > -1) {
      this.page_type = "business";
    }

    this.fetchInitialPageLoadData();
  }

  isMobile = false;
  getIsMobile(): boolean {
    const w = document.documentElement.clientWidth;
    //breakpoint for feature image
    const breakpoint = 550;
    if (w < breakpoint) {
      return true;
    } else {
      return false;
    }
  }
  ngOnInit() {

    // console.log(this.filtered_featured_items);
    // console.log(this.filtered_items);

    
    this.isMobile = this.getIsMobile();
    window.onresize = () => {
      this.isMobile = this.getIsMobile();
    };

    this._route.data.subscribe(d => {
      //To correct language translation issues
      if (window.location.pathname.indexOf("fr") == -1) {
        this.lang = d["lang"];
      } else {
        this.lang = "fr"; //French
      }
      // this.page_type = d["page_type"];
      // console.log(this.page_type)
      //  this._translateService.use(this.lang);
    });
    this._translateService.onLangChange.subscribe(d => {
      //To correct language translation issues
      if (window.location.pathname.indexOf("fr") == -1) {
        this.lang = d["lang"];
      } else {
        this.lang = "fr"; //French
      }

      this.fetchInitialPageLoadData();
      this.setFilters();
      this.findAndSetPriority();
    });
    if (window.location.pathname.indexOf("business") > -1) {
      this.page_type = "business";
    }
  }

  fetchInitialPageLoadData() {
    forkJoin(
      this.productsService.fetchNonFeaturedProducts(this.page_type),
      this.productsService.fetchFeatuedProducts(this.page_type, this.offer),
      this.productsService.fetchCurrentOffer(getTodaysWeekNumber()),
      this.productsService.currentWeekOfferProducts(getTodaysWeekNumber()),
      this.productsService.nextWeekOffer(getTodaysWeekNumber())
    ).subscribe(d => {
      this.products = d[0];
      this.featued_products = d[1];
      this.randomly_selected_one_feature_product = this.featued_products[
        Math.ceil(Math.random() * this.featued_products.length)
      ];

      this._route.queryParams.subscribe(d => {
        this.selected_filter_text = d["search"];
        this.filters.text_search = d["search"];

        // if search is the same as one of our categories: surface category results only;
        let search_by_category_one = d["is_category"];
        if (
          d["search"] == "style" ||
          d["search"] == "home" ||
          d["search"] == "tech" ||
          d["search"] == "travel" ||
          d["search"] == "maison" ||
          d["search"] == "technologie" ||
          d["search"] == "voyages"
        ) {
          search_by_category_one = true;
        }

        if (search_by_category_one) {
          this.setFilters();
          this.findAndSetPriorityCategoryOne();
        } else {
          if (this.filters.text_search) {
            this.setFilters();
            this.findAndSetPriority();
          } else {
            this.viewAllProducts();
          }
          this.getFeatureProduct();
        }
      });
      if (this.offer_enabled) {
        this.offer = d[2] ? d[2][d[2].length - 1] : null;
        this.next_week_offer = d[4][d[4].length - 1];
        this.this_weeks_offer_products = d[3];
        this.deadline = this.offer
          ? new Date(this.offer.start_date).getTime()
          : null;
      }
    });
  }

  viewAllProducts() {
    this.selected_filter_text = "test";
    this.filtered_items_chunk = [];
    this.filtered_items = this.products;
    this.filtered_items_chunk = chunk(this.filtered_items, 6);
    // this.filtered_featured_items = this.productsService.fetchFeatuedProducts();
    this.productsService
      .fetchFeatuedProducts(this.page_type, this.offer)
      .subscribe(d => {
        this.filtered_featured_items = d;
      }); // ???
  }

  //TEST
  getFeatureProduct() {
    this.random_featured_item = this.productsService.fetchFeatuedProducts(
      this.page_type,
      this.offer
    );
    this.productsService
      .fetchFeatuedProducts(this.page_type, this.offer)
      .subscribe(d => {
        let maxNum = 7;
        let minNum = 0;
        let random = Math.floor(Math.random() * (maxNum - minNum) + minNum);

        this.random_featured_item = d[random];
      });
  }
  randomNumber() {
    let maxNum = 8;
    let minNum = 1;
    return Math.floor(Math.random() * (maxNum - minNum) + minNum);
  }

  //filter tag search
  setSelectedFilterText(text) {
    this.selected_filter_text = text.trim();

    //Correct/fix routiing issue: This ensures URI and Query string stay intact and make sense.
    let windowPathName = window.location.pathname;
    if (windowPathName.indexOf("/search-results") < -1) {
      windowPathName + "/search-results";
    }
    this._router.navigate([windowPathName], {
      queryParams: { search: this.selected_filter_text }
    });

    // this.filters.text_search = this.selected_filter_text;
    // this.setFilters();
    // this.findAndSetPriority();
  }

  product_names_filtered: string[] = [];

  getDeadline(date) {
    return new Date(date).getTime();
  }

  setFilters() {
    this.filters.tag = "";
    this.selected_filter_text = this.filters.text_search
      ? this.filters.text_search.toLowerCase()
      : "";
    if (this.filters.text_search && this.filters.text_search.trim() === "") {
      this.resetFilters();
    } else {
      this.top_five = this.productsService.fetchTopFilters(
        this.products,
        this.selected_filter_text
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
    if (
      this.selected_filter_text !== undefined &&
      this.selected_filter_text.trim() !== "" &&
      this.selected_filter_text.length > 1
    ) {
      this.googleAnalyticsService.eventEmitter(
        "usersearch",
        "searchedfor :: " + this.selected_filter_text,
        "onsearchresultpage"
      );
      this.filtered_items = [];
      this.filtered_featured_items = [];

      let results_product_name = [];
      results_product_name = this.productsService.filterWithFuseSettings(
        this.products,
        this.filters.text_search.toLowerCase()
      );

      if (this.filters.text_search.toLowerCase().match(/^[0-9-]+$/) == null) {
        let split_search = null
        split_search = this.selected_filter_text.split(" ");
        // for each word we "watch tv" we check that there is a match for "watch" and "tv" as well as "watch tv"
        for (let k = 0; k < split_search.length; ++k) {
          let separate_word_filter = new RegExp(
            // `\\b${split_search[k].toLowerCase()}\\b`
            // `\\s${split_search[k].toLowerCase()}\\s`
            `^${split_search[k].toLowerCase()}*$\\gm`
          );

          // console.log(split_search[k]);

          let phrase_filter = new RegExp(
            `\\b${this.selected_filter_text.toLowerCase()}\\b`
            // `/^${this.selected_filter_text.toLowerCase()}*$\\gm`

          );

          for (let i = 0; i < results_product_name.length; ++i) {
            // console.log(results_product_name[i].product_name.toLowerCase());

            if (
              !separate_word_filter.test(
                results_product_name[i].product_name.toLowerCase()
              ) &&
              !separate_word_filter.test(
                results_product_name[i].tag_five_miscellaneous
                  .join()
                  .toLowerCase()
              ) &&
              !separate_word_filter.test(
                results_product_name[i].tag_four_business.join().toLowerCase()
              ) &&
              !separate_word_filter.test(
                results_product_name[i].tag_one_category.join().toLowerCase()
              ) &&
              !separate_word_filter.test(
                results_product_name[i].tag_two_primary_brand
                  .join()
                  .toLowerCase()
              ) &&
              !phrase_filter.test(
                results_product_name[i].product_name.toLowerCase()
              ) &&
              !phrase_filter.test(
                results_product_name[i].tag_five_miscellaneous
                  .join()
                  .toLowerCase()
              ) &&
              !phrase_filter.test(
                results_product_name[i].tag_four_business.join().toLowerCase()
              ) &&
              !phrase_filter.test(
                results_product_name[i].tag_one_category.join().toLowerCase()
              ) &&
              !phrase_filter.test(
                results_product_name[i].tag_two_primary_brand
                  .join()
                  .toLowerCase()
              )
            ) {
              if (results_product_name[i].test == null) {
                results_product_name[i].test = "no match";
                // console.log(results_product_name[i].test);
              }
            } else {
              // results_product_name[i].test = "match";
            }
          }
        }

        var b = 0;
        while (b < results_product_name.length) {
          if (results_product_name[b].test == "no match") {
            results_product_name[b].test = null;
            results_product_name.splice(b, 1);
          } else {
            ++b;
          }
        }
      } else {
        results_product_name = this.productsService.filterWithIDFuseSettings(
          this.products,
          this.filters.text_search.toLowerCase()
        );
      }

      this.filtered_items = results_product_name;
      console.log(this.filtered_items);
      this.search();
    }
  }
  findAndSetPriorityCategoryOne() {
    if (
      this.selected_filter_text !== undefined &&
      this.selected_filter_text.trim() !== ""
    ) {
      this.filtered_items = [];
      this.filtered_featured_items = [];

      let results_product_name = [];
      results_product_name = this.productsService.fetchCategoryOneMatchProductsOnly(
        this.filters.text_search.toLowerCase(),
        this.page_type
      );
      this.filtered_items = results_product_name;
      this.filtered_items_chunk = [];
      this.filtered_items_chunk = chunk(this.filtered_items, 6);
      this.filtered_featured_items = this.productsService.fetchCategoryOneMatchFeatureProductsOnly(
        this.featued_products,
        this.selected_filter_text.toLowerCase()
      );
    }
  }

  search() {
    this.filtered_items_chunk = [];
    this.filtered_items_chunk = chunk(this.filtered_items, 6);
    this.mergeFeaturedProductsInBetween();
    this.getFeatureProduct();

    this._router.navigate([window.location.pathname], {
      queryParams: { search: this.selected_filter_text }
    });
  }

  mergeFeaturedProductsInBetween() {
    this.filtered_featured_items = this.productsService.filterWithFuseSettings(
      this.featued_products,
      this.selected_filter_text.toLowerCase()
    );
  }

  isLastOrEvenIndex(index) {
    if (window.location.search != "") {
      if (this.offer_enabled) {
        return index === 1;
      } else {
        return false;
      }
    } else {
      if (this.offer) {
        return index === 1;
      } else {
        return false;
      }
    }
  }

  sortResult() {
    let filtered_featured_items = this.filtered_featured_items.filter(
      i => Object.keys(i).length != 0
    );
    let order_feature_items = orderBy(
      filtered_featured_items,
      ["regular_point_level_number"],
      [this.order_by]
    );
    let complete_feature_itms = [];
    order_feature_items.forEach((i, index) => {
      complete_feature_itms.push(i);
      if (index == 0) {
        complete_feature_itms.push({});
      }
    });
    this.filtered_featured_items = complete_feature_itms;
    this.filtered_items = orderBy(
      this.filtered_items,
      ["regular_point_level_number"],
      [this.order_by]
    );
    this.filtered_items_chunk = chunk(this.filtered_items, 6);
  }

  /* modal related code */

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  isInThisWeeksDeal(week_number) {
    let week_number_yr = WEEK_NUMBER_TO_YEAR_WEEK_MAP[week_number];

    return week_number_yr === getTodaysWeekNumber();
  }
  // searchByProductCategory(text) {
  //   if (window.location.href.indexOf("business") > -1) {
  //     this._router.navigate(
  //       ["search-results", "business"],
  //       { queryParams: { search: text, is_category: true } }
  //     );
  //   } else {
  //     this._router.navigate(
  //       ["search-results"],
  //       { queryParams: { search: text, is_category: true } }
  //     );
  //   }
  // }

  searchByProductCategory(text) {
    // console.log(text);

    // let lng = this._translateService.currentLang == "fr" ? "fr" : "";
    // let lng = (window.location.pathname.indexOf("fr") !== -1) ? "fr" : "";

    // window.location.pathname

    this._router.navigate([window.location.pathname], {
      queryParams: { search: text, is_category: true }
    });

    // if (window.location.pathname.indexOf("business") > -1) {
    //   if (lng) {
    //     this._router.navigate([lng, "business", "search-results"], {
    //       queryParams: { search: text, is_category: true }
    //     });
    //   } else {
    //     this._router.navigate(["business", "search-results"], {
    //       queryParams: { search: text, is_category: true }
    //     });
    //   }
    // } else {
    //   if (lng) {
    //     this._router.navigate([lng, "search-results"], {
    //       queryParams: { search: text, is_category: true }
    //     });
    //   } else {
    //     this._router.navigate(["search-results"], {
    //       queryParams: { search: text, is_category: true }
    //     });
    //   }
    // }
    document.body.scrollTop = 0;
  }
}
