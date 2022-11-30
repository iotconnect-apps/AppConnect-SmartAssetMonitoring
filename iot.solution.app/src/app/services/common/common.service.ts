import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }


  /**
  * check if string is email then encode it
  * @param value email
  */
  getEncodedValue(value: string) {
    if (!this.isEmptyString(value)) {
      return encodeURIComponent(value);
    } else {
      return value;
    }
  }

  /**
* Check if string is empty or not
* @param obj
*/
  isEmptyString(obj: string) {
    if (obj !== undefined && obj != null && obj != '')
      return false;
    return true;
  }

}
