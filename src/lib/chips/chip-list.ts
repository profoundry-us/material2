import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  ModuleWithProviders,
  NgModule,
  QueryList,
  ViewEncapsulation
} from '@angular/core';

import {MdBasicChip, MdChip} from './chip';
import {ChipListKeyManager} from './chip-list-key-manager';

export const MD_CHIP_LIST_COMPONENT_CONFIG: Component = {
  moduleId: module.id,
  selector: 'md-chip-list, [md-chip-list]',
  template: `<div class="md-chip-list-wrapper"><ng-content></ng-content></div>`,
  host: {
    // Properties
    'tabindex': '0',
    'role': 'listbox',

    // Events
    '(focus)': 'focus($event)',
    '(keydown)': 'keydown($event)'
  },
  queries: {
    chips: new ContentChildren(MdBasicChip)
  },
  styleUrls: ['chips.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
};

@Component(MD_CHIP_LIST_COMPONENT_CONFIG)
export class MdChipList {

  private _keyManager: ChipListKeyManager;

  public chips: QueryList<MdBasicChip>;

  constructor(private _elementRef: ElementRef) {
  }

  ngAfterContentInit(): void {
    this._elementRef.nativeElement.classList.add('md-chip-list');

    this._keyManager = new ChipListKeyManager(this.chips).withFocusWrap();
  }


  /********************
   * EVENTS
   ********************/
  focus(event: Event) {
    this._keyManager.focusFirstItem();
  }

  keydown(event: KeyboardEvent) {
    this._keyManager.onKeydown(event);
  }
}

@NgModule({
  imports: [],
  exports: [MdChipList, MdBasicChip, MdChip],
  declarations: [MdChipList, MdBasicChip, MdChip]
})
export class MdChipsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdChipsModule,
      providers: []
    }
  }
}