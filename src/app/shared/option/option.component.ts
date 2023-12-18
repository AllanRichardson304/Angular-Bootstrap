import { Component, OnInit, Input,Output, EventEmitter, ChangeDetectorRef, AfterContentInit } from '@angular/core';
// import { SelectService } from '../search-dropdown/select.service';
@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit, AfterContentInit {

  @Input() label:string | undefined;
  @Input() value:any;
  @Input() id:any

  isSelected:boolean = false;
  isDisplay:boolean = true;
  isEmpty:boolean = false;

  constructor(
    private cdref:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.cdref.detectChanges();
  }

}
