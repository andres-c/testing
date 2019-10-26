import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountDownTimerComponent } from "../components/count-down-timer/count-down-timer.component";
import { PreCountDownComponent } from "../components/pre-count-down/pre-count-down.component";


@NgModule({
  declarations: [CountDownTimerComponent, PreCountDownComponent],
  imports: [CommonModule],
  exports: [CountDownTimerComponent, PreCountDownComponent]
})
export class SharedModule {}
