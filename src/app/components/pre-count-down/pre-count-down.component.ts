import { Component, OnInit, Input } from '@angular/core';
// import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-pre-count-down',
  templateUrl: './pre-count-down.component.html',
  styleUrls: ['./pre-count-down.component.scss']
})
export class PreCountDownComponent implements OnInit {
  lang2;

  @Input("deadline") deadline;
  days;
  hours;
  minutes;
  seconds;
  constructor(
    // public translate: TranslateService,
  ) {
    
  }

  ngOnInit() {
    // this.translate.onLangChange.subscribe(d => {
      // // console.log('Lang Test-precountd:' + d['lang']);
      // //To correct language translation issues
      if (window.location.pathname.indexOf("fr") > -1) {
        this.lang2 = "fr"; //French
      } else {
        this.lang2 = "en";
      }
      // this.lang2 = d["lang"];
      console.log(this.lang2);
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
