import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          {
            path: "",
            component: HomeComponent,
            data: { page_type: "", lang: "en" }
          },
          {
            path: "business",
            component: HomeComponent,
            data: { page_type: "business", lang: "en" }
          }
        ]
      },
      {
        path: "fr",
        children: [
          {
            path: "",
            component: HomeComponent,
            data: { page_type: "", lang: "fr" }
          },
          {
            path: "business",
            component: HomeComponent,
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
//     pathMatch: "full",
//     children: [
//       {
//         path: "",
//         component: HomeComponent,
//         data: { page_type: "", lang: "en" }
//       },
//       {
//         path: "fr",
//         component: HomeComponent,
//         data: { page_type: "", lang: "fr" }
//       },
//       {
//         path: "business",
//         component: HomeComponent,
//         data: { page_type: "business", lang: "en" }
//       },
//       {
//         path: "fr/business",
//         component: HomeComponent,
//         data: { page_type: "business", lang: "fr" }
//       }
//     ]
//   }
// ];

// const routes: Routes = [

//   {
//     path: "",
//     pathMatch: "full",
//     component: HomeComponent,
//     data: { page_type: "", lang: "en" }
//   },
//   {
//     path: "fr",
//     pathMatch: "full",
//     component: HomeComponent,
//     data: { page_type: "", lang: "fr" }
//   },
//   {
//     path: "business",
//     pathMatch: "full",
//     component: HomeComponent,
//     data: { page_type: "business", lang: "en" }
//   },
//   {
//     path: "fr/business",
//     pathMatch: "full",
//     component: HomeComponent,
//     data: { page_type: "business", lang: "fr" }
//   }
  
// ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
