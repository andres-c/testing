import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchResultsComponent } from "./search-results.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          {
            path: "",
            component: SearchResultsComponent,
            data: { page_type: "", lang: "en" }
          },
          {
            path: "business",
            component: SearchResultsComponent,
            data: { page_type: "business", lang: "en" }
          }
        ]
      },
      {
        path: "fr",
        children: [
          {
            path: "",
            component: SearchResultsComponent,
            data: { page_type: "", lang: "fr" }
          },
          {
            path: "business",
            component: SearchResultsComponent,
            data: { page_type: "business", lang: "fr" }
          }
        ]
      },
    ]
  }
  
];



// const routes: Routes = [
//   {
//     path: "",
//     children: [
//       {
//         path: "",
//         component: SearchResultsComponent,
//         data: { page_type: "", lang: "en" }
//       },
//       {
//         path: "business",
//         component: SearchResultsComponent,
//         data: { page_type: "business", lang: "en" }
//       }
//     ]
//   },
//   {
//     path: "fr",
//     children: [
//       {
//         path: "",
//         component: SearchResultsComponent,
//         data: { page_type: "", lang: "fr" }
//       },
//       {
//         path: "business",
//         component: SearchResultsComponent,
//         data: { page_type: "business", lang: "fr" }
//       }
//     ]
//   }
  
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchResultsRoutingModule {}
