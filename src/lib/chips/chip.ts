import {
  // Classes
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Renderer,

  // Functions
  forwardRef
} from '@angular/core';

import {MdFocusable} from '../core/a11y/list-key-manager';

export const MD_BASIC_CHIP_COMPONENT_CONFIG:Component = {
  selector: 'md-basic-chip, [md-basic-chip]',
  template: `<ng-content></ng-content>`,
  host: {
    // Properties
    'tabindex': '-1',
    'role': 'option',

    // Attributes
    '[class.selected]': 'selected',
    '[attr.disabled]': 'disabled',
    '[attr.aria-disabled]': 'isAriaDisabled',

    // Events
    '(click)': 'click($event)',
  },
  inputs: ['disabled', 'selected', 'color'],
  outputs: ['didfocus', 'select', 'deselect', 'remove', 'destroy']
};

@Component(MD_BASIC_CHIP_COMPONENT_CONFIG)
export class MdBasicChip implements MdFocusable, OnDestroy {

  protected _disabled: boolean = false;
  protected _selected: boolean = false;
  protected _color: string = 'primary';

  // Declare outputs
  public didfocus = new EventEmitter();
  public select = new EventEmitter();
  public deselect = new EventEmitter();
  public remove = new EventEmitter();
  public destroy = new EventEmitter();

  constructor(protected _renderer: Renderer, protected _elementRef: ElementRef) {}

  ngAfterContentInit(): void {
    this._updateColor(this._color);
  }

  ngOnDestroy(): void {
    this.destroy.emit({chip: this});
  }

  focus(): void {
    this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus');
    this.didfocus.emit({chip: this});
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;

    if (value) {
      this.select.emit({chip: this});
    } else {
      this.deselect.emit({chip: this});
    }
  }

  toggleSelected(): boolean {
    this.selected = !this.selected;
    return this.selected;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = (value === false || value === undefined) ? null : true;
  }

  get isAriaDisabled(): string {
    return String(this.disabled);
  }

  /** Sets the color of the chip when selected */
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._updateColor(value);
  }

  click(event: Event) {
    // No matter what, we should emit the didfocus event
    this.didfocus.emit({chip: this});

    // Check disabled
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private _updateColor(newColor: string) {
    this._setElementColor(this._color, false);
    this._setElementColor(newColor, true);
    this._color = newColor;
  }

  private _setElementColor(color: string, isAdd: boolean) {
    if (color != null && color != '') {
      this._renderer.setElementClass(this._elementRef.nativeElement, `md-${color}`, isAdd);
    }
  }
}

export const MD_CHIP_COMPONENT_CONFIG:Component = {
  template: MD_BASIC_CHIP_COMPONENT_CONFIG.template,
  host: MD_BASIC_CHIP_COMPONENT_CONFIG.host,
  inputs: MD_BASIC_CHIP_COMPONENT_CONFIG.inputs,
  outputs: MD_BASIC_CHIP_COMPONENT_CONFIG.outputs,

  selector: 'md-chip, [md-chip]',
  providers: [{provide: MdBasicChip, useExisting: forwardRef(() => MdChip)}]
};

@Component(MD_CHIP_COMPONENT_CONFIG)
export class MdChip extends MdBasicChip {

  constructor(protected _renderer: Renderer, protected _elementRef: ElementRef) {
    super(_renderer, _elementRef);
  }

  ngAfterContentInit(): void {
    super.ngAfterContentInit();

    this._elementRef.nativeElement.classList.add('md-chip');
  }

}