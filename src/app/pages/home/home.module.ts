import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NzAutocompleteModule,
  NzGridModule,
  NzButtonModule,
  NzLayoutModule,
  NzCardModule,
  NzFormModule,
  NzInputModule,
  NzRadioModule,
  NzTableModule,
  NzDividerModule,
  NzStatisticModule,
  NzSelectModule,
  NzModalModule
} from "ng-zorro-antd";
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {Ng2FittextModule} from "ng2-fittext";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzAutocompleteModule,
    NzGridModule,
    NzButtonModule,
    NzLayoutModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzTableModule,
    NzDividerModule,
    NzStatisticModule,
    NzModalModule,
    NzSelectModule,
    TranslateModule.forChild(),
    Ng2FittextModule
  ]
})
export class HomeModule {}
