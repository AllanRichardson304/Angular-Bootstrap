import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopytxt]'
})
export class CopytxtDirective {

  @Input() copyText:any = ''

  constructor(private el: ElementRef) { }

  @HostListener('click', ['$event'])
  onClick(event: any) {
    navigator.clipboard.writeText(this.copyText)
  }

}
