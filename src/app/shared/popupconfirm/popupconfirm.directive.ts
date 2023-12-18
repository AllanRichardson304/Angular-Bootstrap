import { Directive, Input, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appPopupconfirm]'
})
export class PopupconfirmDirective {

  popupElement = document.createElement('div');

  @Input() popupTitle: any = null;
  @Input() popupMessage: any = null;
  @Input() eventType: any = 'click';
  @Output() onConfirm: EventEmitter<any> = new EventEmitter();
  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  constructor(private element: ElementRef) {
  }

  hide() {
    this.popupElement.classList.remove('popup--active');
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.eventType == 'mouseover') {
      this.createSubElement()
      this.popupElement.classList.add('popup--active');
    }
  }
  @HostListener('click') onClick() {
     if (this.eventType == 'click' && !Array.from(this.popupElement.classList).some((e:any) => e === 'popup--active')) {
      document.querySelectorAll(".popup--active").forEach(el => el.classList.remove('popup--active'));
      if (this.popupElement.hasChildNodes()) {
        while(this.popupElement.firstChild){
          this.popupElement.firstChild.remove()
        }
      }
      this.popupElement.classList.add('popup--active');
      this.createSubElement();
    }else{
      this.popupElement.classList.remove('popup--active')
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    // this.hide()
  }

  ngOnInit() {
    this.popupElement.className = 'popup';
    this.element.nativeElement.appendChild(this.popupElement);
    // this.element.nativeElement.classList.add('popup-container');
  }

  createSubElement() {
    if (this.popupTitle != null) {
      let titleElement = document.createElement('h1')
      titleElement.innerHTML = this.popupTitle;
      this.popupElement.appendChild(titleElement);
    }
    if (this.popupMessage != null) {
      let messageElement = document.createElement('p')
      messageElement.innerHTML = this.popupMessage
      this.popupElement.appendChild(messageElement)
    }
    let btnDiv = document.createElement('div');

    let cancelBtnElement = document.createElement('button');
    cancelBtnElement.classList.add('cancel')
    cancelBtnElement.innerHTML = "Cancel";
    btnDiv.appendChild(cancelBtnElement)
    this.popupElement.appendChild(btnDiv);
    
    cancelBtnElement.addEventListener('click',()=>{
      //  this.hide()
    })

    let confirmBtnElement = document.createElement('button');
    confirmBtnElement.classList.add('submit')
    confirmBtnElement.innerHTML = "Submit";
    btnDiv.appendChild(confirmBtnElement)
    this.popupElement.appendChild(btnDiv)

    confirmBtnElement.addEventListener('click',()=>{
      this.onConfirm.emit();
    })
  }

}
