import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateAgo',
    pure: false,
})
export class DateAgoPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (value) {
            let seconds;
            if (args == 'timestamp') {
                seconds = Math.floor(
                    (+new Date() - +new Date(new Date(value))) / 1000
                );
            } else {
                seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            }

            if (seconds < 29) return 'Just now';
            const intervals:any = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                min: 60,
                sec: 1,
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return counter + ' ' + i + ' ago';
                    } else {
                        return counter + ' ' + i + 's ago';
                       
                    }
            }
        }
        return value;
    }
}

@Pipe({
    name: 'headerdateAgo',
    pure: false,
})
export class HeaderDateAgoPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (value) {
            let seconds;
            if (args == 'timestamp') {
                seconds = Math.floor(
                    (+new Date() - +new Date(new Date(value))) / 1000
                );
            } else {
                seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            }

            if (seconds < 29) return 'Just now';
            const intervals:any = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                min: 60,
                sec: 1,
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return counter + ' ' + i + ' ago';
                    } else {
                        return 'Less than a minute ago';
                    }
            }
        }
        return value;
    }
}


@Pipe({
    name: 'detaildateAgo'
})

export class DetailDateAgo implements PipeTransform{

    transform(value: any, update:any) {
        let distance;
        let created = new Date(value).getTime();
        let updated = new Date(update).getTime();
        distance =  updated - created ;
          // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        let result;
        switch(true){
            case (days > 0) :
                result =  days + "d " + hours + "hr " + minutes + "m " ;
                break;
            case (days <= 0 && hours > 0) :
                result =  hours + "hr " + minutes + "m";
                break;
            case (hours <= 0 && minutes > 0) :
                result = minutes + "m " ;
                break;
            default:
                result = seconds + 'sec';
        }
        return result;
    }

}