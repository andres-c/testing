import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SearchResultsRoutingModule } from "./search-results-routing.module";
import { SearchResultsComponent } from "./search-results.component";
import {Ng2FittextModule} from "ng2-fittext";

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
  NzSelectModule,
  NzModalModule,
  NzStatisticModule
} from "ng-zorro-antd";
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SearchResultsComponent],
  imports: [
    CommonModule,
    SearchResultsRoutingModule,
    SharedModule,
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
    NzSelectModule,
    NzModalModule,
    NzStatisticModule,
    NzDividerModule,
    TranslateModule.forChild(),
    Ng2FittextModule
  ]
})
export class SearchResultsModule {}
