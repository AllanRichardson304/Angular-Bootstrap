import { Component, OnInit, Input, Output, EventEmitter, ContentChildren, QueryList, AfterViewInit, ChangeDetectorRef, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgModel } from '@angular/forms';
const UI_SELECT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line: no-use-before-declare */
  useExisting: forwardRef(() => SearchDropdownComponent),
  multi: true
};
@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss'],
  providers: [UI_SELECT_CONTROL_VALUE_ACCESSOR],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class SearchDropdownComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  dropdownClicked = true;
  @Input() selectPlaceholder: any = 'Select';
  tempSelectedValue: any;
  previousSelectedValue: any;
  @Output() selectedValueChange: EventEmitter<any> = new EventEmitter();
  @Input() isSearch: boolean = false;
  @Input() disable: boolean = false;
  dataLength: any = 0;

  constructor(
    private cdref: ChangeDetectorRef,
    private _eref: ElementRef
  ) { }

  ngOnInit(): void {
  }

  onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) // or some similar check
      this.dropdownClicked = this.dropdownClicked && false;
  }


  ngAfterViewInit(): void {
    this.dropdownClicked = !this.dropdownClicked;
    this.cdref.detectChanges();
  }

  isEmpty: boolean = false;
  searchResult(event: any) {
    if (!this.disable) {
      this.dropdownClicked = true;
    }
    let doc = this._eref.nativeElement.childNodes[0];
    let optionList = doc.getElementsByTagName('app-option')

    if (this.isSearch && event.target.value.length > 0) {
      Array.from(optionList).forEach((element: any) => {
        if (element.children[0].value.toString().toLowerCase().includes(event.target.value.toString().toLowerCase())) {
          element.hidden = false;
        }
        if (!element.children[0].value.toString().toLowerCase().includes(event.target.value.toString().toLowerCase())) {
          element.hidden = true;
        }
      });
    }
    else {
      Array.from(optionList).forEach((element: any) => {
        element.hidden = false;
      });
    }
    let searchData: any = Array.from(optionList).length > 0 && Array.from(optionList).filter((e: any) => e.hidden == false);
    this.dataLength = Array.from(optionList).length;
    this.isEmpty = searchData != null && searchData.length > 0 ? false : true;
  }

  // Implement control value accessor

  public get value() {
    return this.tempSelectedValue;
  }

  @Input() set selectedValue(v: any) {
    this.tempSelectedValue = v;
    if(v){
      this.touched(this.tempSelectedValue);
    }
    this.changed(this.tempSelectedValue);
    // this.selectedValueChange.emit(this.tempSelectedValue);
    this.cdref.detectChanges();
  }

  changed = (_: any) => { };

  touched = (_: any) => { };

  selectedLabel: any;
  public async writeValue(obj: any) {
    let doc = await this._eref.nativeElement.childNodes[0];
    let optionList = await doc.getElementsByTagName('app-option');
    this.dataLength =  Array.from(optionList).length;
    let selectedData: any;
    if (obj) {
      this.tempSelectedValue = obj;
      if (optionList && Array.from(optionList).some((t: any) => t.children[0].value == this.tempSelectedValue)) {
        optionList && Array.from(optionList).forEach((element: any) => {
          if (element.children[0].value == this.tempSelectedValue) {
            selectedData = element;
          }
        });
        this.selectedValue = this.tempSelectedValue;
        this.tempSelectedValue = this.tempSelectedValue;
        this.previousSelectedValue = this.tempSelectedValue;
        this.selectedLabel = selectedData.childNodes[0].innerHTML;
        this.dropdownClicked = false
      }
    }else{
      this.selectedValue = null;
      this.tempSelectedValue = null;
      this.previousSelectedValue = this.tempSelectedValue;
      this.selectedLabel = null;
    }
  }

  public registerOnChange(fn: any) {
    this.changed = fn;
  }

  public registerOnTouched(fn: any) {
    this.touched = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    //
  }

  inputFocus() {
    if (!this.disable) {
      this.dropdownClicked = this.isSearch && this.dropdownClicked ? this.dropdownClicked : !this.dropdownClicked
    }
    this.isEmpty = false;
    let doc = this._eref.nativeElement.childNodes[0];
    let inputData: any = document.getElementById('searchinput');
    if (inputData) {
      inputData.value = '';
    }
    let optionList = doc.getElementsByTagName('app-option')
    this.dataLength = Array.from(optionList).length;
    Array.from(optionList).map((t: any) => t.hidden = false)
    Array.from(optionList).forEach((element: any) => {
      element.addEventListener('click', (event: any) => {
        event.stopImmediatePropagation()
        this.selectedValue = event.target.value;
        this.tempSelectedValue = event.target.value;
        this.previousSelectedValue = event.target.value;
        this.selectedLabel = event.target.innerHTML;
        this.dropdownClicked = false;
        this.cdref.detectChanges();
      });
    });
  }
}
