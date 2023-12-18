import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {


  @Input() min: any = 0;
  @Input() max: any = 0;
  @Input() slideValue:any = 0;
   @Input() stepSize: any = 1;
  @Output() values: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    var parent:any = document.querySelectorAll(".range-slider");
    if (!parent) return;

    if(parent){
      parent.forEach((elm:any) => {
        let rangeS: any = elm.querySelectorAll("input[type=range]");
        rangeS.forEach((element:any) => {
          element.oninput = () => {
            var slide1 = parseFloat(rangeS[0].value)
            this.values.emit({
              slideValue: slide1,
            })
          }
        });
      });
    }

  }

}
