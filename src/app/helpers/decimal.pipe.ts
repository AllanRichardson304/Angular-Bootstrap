
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'coinDecimal',
    pure: true
})
export class CoinDecimalPipe implements PipeTransform {

    transform(value: any, type: any): any {
        if (value && type) {
            if (type == 'BTC') {
                return value == 0 ? value : this.getFlooredFixed(value,8)
            }
            else if(type == 'USDT'){
                return value == 0 ? value : this.getFlooredFixed(value,2)
            } 
            else if(type == '6'){
                return value == 0 ? value : this.getFlooredFixed(value,6)
            }
            else{
                return this.getFlooredFixed(value,8)
            }
        }
    }

    getFlooredFixed(str:any,val:any) {
        // return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
        str = str.toString();
        str = str.includes('.') ?  str.slice(0, (str.indexOf(".")) + val + 1) : str; 
        return str;
      }
}



@Pipe({
    name: 'precisionDecimal',
    pure: true
})
export class PrecisionDecimalPipe implements PipeTransform {

    transform(value: any, type: any): any {
         return this.getFlooredFixed(value,type);
    }

    getFlooredFixed(v:any,d:any) {
        return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
        // str = str.toString();
        // str = str.slice(0, (str.indexOf(".")) + ((+val) +1)); 
        // return str;
      }
}