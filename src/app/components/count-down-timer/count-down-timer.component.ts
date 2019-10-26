import { Component, OnInit, Input } from "@angular/core";
// import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-count-down-timer",
  templateUrl: "./count-down-timer.component.html",
  styleUrls: ["./count-down-timer.component.scss"]
})
export class CountDownTimerComponent implements OnInit {
  lang3;

  @Input("deadline") deadline;
  days;
  hours;
  minutes;
  seconds;
  constructor(
    // public translate: TranslateService,
  ) {}

  ngOnInit() {
    // this.translate.onLangChange.subscribe(d => {
      // console.log('Lang Test-nextcountd:' + d['lang']);

      if (window.location.pathname.indexOf("fr") > -1) {
        this.lang3 = "fr"; //French
      } else {
        this.lang3 = "en"; 
      }
      console.log('Lang Test:' + this.lang3);
      // this.lang = d["lang"];
      // console.log(this.lang);
    // });
    
    this.timer();
  }
  timer() {
    var deadline = new Date(this.deadline).getTime();
    var x = setInterval(() => {
      var now = new Date().getTime();
      var t = deadline - now;
      this.days = Math.floor(t / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((t % (1000 * 60)) / 1000);

    }, 1000);
  }
}
