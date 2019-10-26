import { Injectable } from "@angular/core";
import {
  OFFERS,
  WEEK_NUMBER_TO_YEAR_WEEK_MAP,
  OFFERS_FR
} from "../data/user.data";
import { of } from "rxjs";
import * as Fuse from "fuse.js";
import { groupBy, orderBy, concat, uniq, chunk } from "lodash";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { USERS, USERS_FR } from "../data/user.data";
import { getTodaysWeekNumber } from "../utils";
@Injectable({
  providedIn: "root"
})
export class ProductsService {
  constructor(private _translateService: TranslateService) {}
  fuse_search__category_one_only_settings = {
    shouldSort: true,
    tokenize: true,
    threshold: 0.0,
    location: 3,
    distance: 200,
    maxPatternLength: 36,
    minMatchCharLength: 3,
    keys: [
      {
        name: "tag_one_category",
        weight: 0.5
      }
    ]
  };
  fuse_search__id_settings = {
    shouldSort: true,
    tokenize: true,
    threshold: 0.0,
    location: 3,
    distance: 200,
    maxPatternLength: 36,
    minMatchCharLength: 3,
    keys: [
      {
        name: "img_id",
        weight: 0.5
      },
      {
        name: "id",
        weight: 0.5
      }
    ]
  };
  fuse_search_settings = {
    shouldSort: true,
    tokenize: true,
    threshold: 0.0,
    location: 0,
    distance: 0,
    maxPatternLength: 36,
    minMatchCharLength: 3,
    keys: [
      {
        name: "product_name",
        weight: 0.9
      },
      {
        name: "tag_five_miscellaneous",
        weight: 0.7
      },
      {
        name: "tag_four_business",
        weight: 0.5
      },
      {
        name: "tag_two_primary_brand",
        weight: 0.5
      },
      {
        name: "tag_one_category",
        weight: 0.5
      },
      {
        name: "tag_three_associated_brands",
        weight: 0.5
      },
      {
        name: "img_id",
        weight: 0.5
      },
      {
        name: "id",
        weight: 0.5
      }
    ]
  };

  getUsers() {
    // console.log('in users', this._translateService.currentLang);
    // return this._translateService.currentLang === "fr" ? USERS_FR : USERS;
    return window.location.pathname.indexOf("fr") > -1 ? USERS_FR : USERS;
  }

  getOffers() {
    return window.location.pathname.indexOf("fr") > -1 ? OFFERS_FR : OFFERS;
  }

  fetchProductNames() {
    const product_names = [];
    this.getUsers().forEach(i => product_names.push(i.product_name));
    return of(product_names);
  }
  fetchCategoryOneMatchProductsOnly(search_text, page_type) {
    if (page_type == "business") {
      let products = this.getUsers().filter(
        i =>
          (i.featured_product === false || i.id == 11430021) &&
          i.id !== 12500021 &&
          (i.week_number === null ||
            i.week_number ===
              WEEK_NUMBER_TO_YEAR_WEEK_MAP[getTodaysWeekNumber()])
      );

      let fuse = new Fuse(
        products,
        this.fuse_search__category_one_only_settings
      );
      //added space to fix heirarchy
      let result = fuse.search(search_text);
      return result;
    } else {
      let products = this.getUsers().filter(
        i =>
          i.featured_product === false &&
          (i.week_number === null ||
            i.week_number ===
              WEEK_NUMBER_TO_YEAR_WEEK_MAP[getTodaysWeekNumber()])
      );

      let fuse = new Fuse(
        products,
        this.fuse_search__category_one_only_settings
      );
      //added space to fix heirarchy
      let result = fuse.search(search_text);
      return result;
    }
  }
  fetchProducts() {
    return of(
      this.getUsers().filter(
        i =>
          i.featured_product === false &&
          (i.week_number === null ||
            i.week_number ===
              WEEK_NUMBER_TO_YEAR_WEEK_MAP[getTodaysWeekNumber()])
      )
    );
  }
  fetchFeatuedProducts(page_type, offers) {
    if (page_type == "business") {
      let formatted_feature_products = [];
      let feature_products = this.getUsers().filter(
        i =>
          (i.featured_product || i.id == 12500021 || i.id == 13160021) &&
          i.weekly_deal_fp !== "FEATURE PRODUCT (consumer only)" &&
          (i.week_number === null ||
            i.week_number ===
              WEEK_NUMBER_TO_YEAR_WEEK_MAP[getTodaysWeekNumber()])
      );
      for (let i = 0; i < feature_products.length; i++) {
        formatted_feature_products.push(feature_products[i]);
        // if (i == 0) {
        //   formatted_feature_products.push({});
        // }
      }

      //Clean results of empty items
      var filtered = formatted_feature_products.filter(function(el) {
        if (el.img_id && el.img_id !== null) {
          return el != null;
        }
      });

      return of(filtered);
    } else {
      let formatted_feature_products = [];
      let feature_products = this.getUsers().filter(
        i =>
          i.featured_product &&
          (i.week_number === null ||
            i.week_number ===
              WEEK_NUMBER_TO_YEAR_WEEK_MAP[getTodaysWeekNumber()])
      );
      for (let i = 0; i < feature_products.length; i++) {
        formatted_feature_products.push(feature_products[i]);
        // if (i == 0) {
        //   formatted_feature_products.push({});
        // }
      }

      //Clean results of empty items
      var filtered = formatted_feature_products.filter(function(el) {
        if (el.img_id && el.img_id !== null) {
          return el != null;
        }
      });

      return of(filtered);
    }
  }

  fetchNonFeaturedProducts(page_type) {
    // return of(this.getUsers().filter(i => !i.featured_product));
    if (page_type == "business") {
      return of(
        this.getUsers().filter(
          i =>
            (!i.featured_product || i.id == 11430021) &&
            i.id !== 12500021 &&
            (i.week_number === null ||
              i.week_number ===
                WEEK_NUMBER_TO_YEAR_WEEK_MAP[getTodaysWeekNumber()])
        )
      );
    } else {
      return of(
        this.getUsers().filter(
          i =>
            !i.featured_product &&
            (i.week_number === null ||
              i.week_number ===
                WEEK_NUMBER_TO_YEAR_WEEK_MAP[getTodaysWeekNumber()])
        )
      );
    }
  }

  fetchAllOffers() {
    const week_number = getTodaysWeekNumber();
    let offer_flagged_with_status: any = this.getOffers().map(i => {
      let item: any = i;
      item.is_next = false;
      // item.is_next_Oposite = true; //couldn't get an ngIf statment to work in the negative
      if (i.year_week_number == week_number) {
        item.active = true;
      } else {
        item.active = false;
      }
      return item;
    });
    let index = offer_flagged_with_status.findIndex((i: any) => i.active);
    if (index < 0) {
      offer_flagged_with_status[0].is_next = true;
    } else {
      if (index !== offer_flagged_with_status.length - 1) {
        offer_flagged_with_status[index + 1].is_next = true;
      }
    }
    return of(offer_flagged_with_status);
  }
  fetchCurrentOffer(week_number) {
    let offers = this.getOffers().filter(
      i => i.year_week_number === week_number
    );
    // if (offers.length == 0) {
    //   offers = this.getOffers().filter(i => i.year_week_number == 42);
    // }
    return of(offers);
  }

  nextWeekOffer(week_number) {
    if (week_number == 49) {
      return of(null);
    } else {
      let next_week_number = week_number + 1;

      let offer = this.getOffers().filter(
        i => i.year_week_number === next_week_number
      );
      return of(offer);
    }
  }
  currentWeekOfferProducts(week_number) {
    let products = this.getUsers().filter(
      i => i.week_number === WEEK_NUMBER_TO_YEAR_WEEK_MAP[week_number]
    );
    if (products.length == 0) {
      products = this.getUsers().filter(i => i.week_number == 1);
    }
    return of(products);
  }
  // meaning 1, 2 ,3 etc..
  currentWeekOfferProductsByOfferWeekNumber(week_number) {
    let products = this.getUsers().filter(i => i.week_number === week_number);
    if (products.length == 0) {
      products = this.getUsers().filter(i => i.week_number == 1);
    }
    return of(products);
  }

  filterWithFuseSettings(products, search_text) {
    let fuse = new Fuse(products, this.fuse_search_settings);
    //added space to fix heirarchy
    let result = fuse.search(search_text);
    return result;
  }
  filterWithIDFuseSettings(products, search_text) {
    search_text.trim()
    let fuse = new Fuse(products, this.fuse_search__id_settings);
    //added space to fix heirarchy
    let result = fuse.search(search_text);
    return result;
  }

  fetchCategoryOneMatchFeatureProductsOnly(products, search_text) {
    let fuse = new Fuse(products, this.fuse_search__category_one_only_settings);
    //added space to fix heirarchy
    let result = fuse.search(search_text);
    let formatted_result = [];
    for (let i = 0; i < result.length; i++) {
      // this is added because a place is taken by offers in the list
      formatted_result.push(result[i]);

      if (i === 0) {
        formatted_result.push({});
      }
    }
    // console.log('test');
    // console.log(formatted_result);

    return formatted_result;
  }

  fetchTopFilters(products, search_text) {
    let top_five = {
      tag_five: [],
      tag_four: [],
      tag_two: [],
      tag_one: [],
      tag_three: [],
      tags: []
    };
    let all_tag_five = [];
    let all_tag_four = [];
    let all_tag_two = [];
    let all_tag_one = [];
    let all_tag_three = [];
    let result = this.filterWithFuseSettings(products, search_text);

    if (result) {
      result.forEach((item: any) => {
        all_tag_five.push(...item.tag_five_miscellaneous);
        all_tag_four.push(...item.tag_four_business);
        all_tag_two.push(...item.tag_two_primary_brand);
        all_tag_one.push(...item.tag_one_category);
        all_tag_three.push(...item.tag_three_associated_brands);
      });
    }
    // top_five.tag_five = this.fetchTopFiveOccurances(all_tag_five, search_text);
    // top_five.tag_four = this.fetchTopFiveOccurances(all_tag_four, search_text);
    // top_five.tag_two = this.fetchTopFiveOccurances(all_tag_two, search_text);
    // top_five.tag_one = this.fetchTopFiveOccurances(all_tag_one, search_text);
    // top_five.tag_three = this.fetchTopFiveOccurances(
    //   all_tag_three,
    //   search_text
    top_five.tag_one = this.fetchTopFiveOccurances(all_tag_one, search_text);
    top_five.tag_five = this.fetchTopFiveOccurances(all_tag_five, search_text);
    top_five.tag_four = this.fetchTopFiveOccurances(all_tag_five, search_text);
    top_five.tag_four.splice(0, 6);
    top_five.tag_two = this.fetchTopFiveOccurances(all_tag_two, search_text);
    top_five.tag_three = this.fetchTopFiveOccurances(
      all_tag_three,
      search_text
    );

    //blank tags
    top_five.tag_three.splice(0, 1);

    let tag_object = [
      {
        type: "tag_one",
        tags: top_five.tag_one
      },
      {
        type: "tag_five",
        tags: top_five.tag_five
      },
      {
        type: "tag_four",
        tags: top_five.tag_four
      },
      {
        type: "tag_two",
        tags: top_five.tag_two
      },
      {
        type: "tag_three",
        tags: top_five.tag_three
      }
    ];

    let tags = uniq(
      concat(
        top_five.tag_five,
        top_five.tag_four,
        top_five.tag_two,
        top_five.tag_one,
        top_five.tag_three
      )
    );

    top_five.tags = tag_object;
    if (
      tag_object[0].tags.indexOf(tag_object[1].tags[0]) > -1 ||
      tag_object[2].tags.indexOf(tag_object[1].tags[0]) > -1 ||
      tag_object[3].tags.indexOf(tag_object[1].tags[0]) > -1 ||
      tag_object[4].tags.indexOf(tag_object[1].tags[0]) > -1
    ) {
      tag_object[1].tags.shift();
    }
    if (
      tag_object[1].tags.indexOf(tag_object[0].tags[0]) > -1 ||
      tag_object[2].tags.indexOf(tag_object[0].tags[0]) > -1 ||
      tag_object[3].tags.indexOf(tag_object[0].tags[0]) > -1 ||
      tag_object[4].tags.indexOf(tag_object[0].tags[0]) > -1
    ) {
      tag_object[0].tags.shift();
    }
    if (
      tag_object[1].tags.indexOf(tag_object[2].tags[0]) > -1 ||
      tag_object[0].tags.indexOf(tag_object[2].tags[0]) > -1 ||
      tag_object[3].tags.indexOf(tag_object[2].tags[0]) > -1 ||
      tag_object[4].tags.indexOf(tag_object[2].tags[0]) > -1
    ) {
      tag_object[2].tags.shift();
    }
    if (
      tag_object[0].tags.indexOf(tag_object[3].tags[0]) > -1 ||
      tag_object[2].tags.indexOf(tag_object[3].tags[0]) > -1 ||
      tag_object[1].tags.indexOf(tag_object[3].tags[0]) > -1 ||
      tag_object[4].tags.indexOf(tag_object[3].tags[0]) > -1
    ) {
      tag_object[3].tags.shift();
    }
    if (
      tag_object[0].tags.indexOf(tag_object[4].tags[0]) > -1 ||
      tag_object[2].tags.indexOf(tag_object[4].tags[0]) > -1 ||
      tag_object[3].tags.indexOf(tag_object[4].tags[0]) > -1 ||
      tag_object[1].tags.indexOf(tag_object[4].tags[0]) > -1
    ) {
      tag_object[4].tags.shift();
    }
    top_five.tags = tag_object;
    console.log(top_five);
    return top_five;
  }

  fetchTopFiveOccurances(data, search_text) {
    let result = groupBy(data);
    let tags = [];
    let m = orderBy(result, "length", ["desc"]);
    m.forEach(i =>
      tags.push(...i.filter(x => x != "" && x !== search_text))
    );
    return uniq(tags);
  }
}
