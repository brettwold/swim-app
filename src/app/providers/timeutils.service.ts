import { Injectable }     from '@angular/core';

@Injectable()
export class TimeUtils {

  public getHundredthsFromString(timeStr) {
    let tenths :number = 0;

    if(timeStr.indexOf(':') > -1) {
      let remain = timeStr.split(':');
      tenths += this.round(Number(remain[0]) * 60 * 100, 0);
      timeStr = remain[1];
    }
    tenths += this.round(Number(timeStr) * 100, 0);
    return tenths;
  }

  private round(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0)
      return Math.round(value);

    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
      return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
  }
}
