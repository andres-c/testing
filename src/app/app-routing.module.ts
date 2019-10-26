import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  
//English
  {
    path: "",
    pathMatch: "full",
    loadChildren: () =>
      import("./pages/home/home.module").then( 
        m => m.HomeModule
      ),
      data: { page_type: "", lang: "en" }
  },
  {
    path: "business",
    pathMatch: "full",
    loadChildren: () =>
      import("./pages/home/home.module").then(
        m => m.HomeModule
      ),
    data: { page_type: "business", lang: "en" }
  },
  {
    path: "search-results",
    pathMatch: "full",
    loadChildren: () =>
      import("./pages/search-results/search-results.module").then(
        m => m.SearchResultsModule
      ),
    data: { page_type: "", lang: "fr" }
  },
  {
    path: "business/search-results",
    loadChildren: () =>
      import("./pages/search-results/search-results.module").then(
        m => m.SearchResultsModule
      ),
    data: { page_type: "business", lang: "en" }
  },

//French
  {
    path: "fr",
    pathMatch: "full",
    loadChildren: () =>
      import("./pages/home/home.module").then(
        m => m.HomeModule
      ),
    data: { page_type: "", lang: "fr" }
  },
  {
    path: "fr/business",
    pathMatch: "full",
    loadChildren: () =>
      import("./pages/home/home.module").then(
        m => m.HomeModule
      ),
    data: { page_type: "business", lang: "fr" }
  },
  {
    path: "fr/search-results",
    pathMatch: "full",
    loadChildren: () =>
      import("./pages/search-results/search-results.module").then(
        m => m.SearchResultsModule
      ),
    data: { page_type: "", lang: "fr" }
  },
  {
    path: "fr/business/search-results",
    pathMatch: "full",
    loadChildren: () =>
      import("./pages/search-results/search-results.module").then(
        m => m.SearchResultsModule
      ),
    data: { page_type: "business", lang: "fr" }
  },
  {
    path: "**", 
    redirectTo: '/'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
