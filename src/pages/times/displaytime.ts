import { Component, Input } from '@angular/core';

@Component({
  selector: 'display-time',
  template: `<span>{{ formattedtime }}</span>`
})
export class DisplayTimeComponent {
  @Input('time') time: string;
  formattedtime: string;

  ngAfterViewInit() {
    setTimeout(_=> this.formatTime());
  }

  private padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join("0") + number;
  }

  private formatTime() {
    if(this.time !== undefined && this.time != "") {
      let hundredths = parseInt(this.time);
      let seconds = Math.floor(hundredths / 100);
      let minutes = Math.floor(seconds / 60);
      this.formattedtime = minutes+":"+this.padDigits(seconds-minutes*60, 2)+"."+("0"+(hundredths-seconds*100)).substr(-2);
    } else {
      this.formattedtime = "--:--.--";
    }
  }
}
