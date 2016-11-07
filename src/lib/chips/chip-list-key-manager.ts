import {QueryList} from '@angular/core';
import {ListKeyManager} from '../core/a11y/list-key-manager';
import {SPACE, BACKSPACE, DELETE} from '../core/keyboard/keycodes';
import {MdBasicChip} from './chip';

export class ChipListKeyManager extends ListKeyManager {
  private _subscribed:MdBasicChip[] = [];

  constructor(private _chips: QueryList<MdBasicChip>) {
    super(_chips);

    this.subscribeChips(this._chips);

    this._chips.changes.subscribe((chips: QueryList<MdBasicChip>) => {
      this.subscribeChips(chips);
    });
  }

  onKeydown(event: KeyboardEvent): void {
    let focusedChip: MdBasicChip;

    if (this.isValidIndex(this.focusedItemIndex)) {
      focusedChip = this._chips.toArray()[this.focusedItemIndex];
    }

    // Handle spacebar
    if (event.keyCode === SPACE) {
      focusedChip && focusedChip.toggleSelected();

      event.preventDefault();
      return;
    }

    // Handle delete/backspace
    if (event.keyCode === DELETE || event.keyCode === BACKSPACE) {
      focusedChip && focusedChip.remove.emit({$chip: focusedChip});

      event.preventDefault();
      return;
    }

    super.onKeydown(event);
  }

  protected subscribeChips(chips: QueryList<MdBasicChip>): void {
    chips.forEach((chip: MdBasicChip) => {
      this.addChip(chip);
    });
  }

  protected addChip(chip: MdBasicChip) {
    // If we've already been subscribed to a parent, do nothing
    if (this._subscribed.indexOf(chip) > -1) {
      return;
    }

    // Watch for focus events outside of the keyboard navigation
    chip.didfocus.subscribe(() => {
      let chipIndex: number = this._chips.toArray().indexOf(chip);

      if (this.isValidIndex(chipIndex)) {
        this.setFocus(chipIndex, false);
      }
    });

    // On destroy, remove the item from our list, and check focus
    chip.destroy.subscribe(() => {
      let chipIndex: number = this._chips.toArray().indexOf(chip);

      if (this.isValidIndex(chipIndex)) {
        // Focus the next chip if available
        if (chipIndex < this._chips.length) {
          this.setFocus(chipIndex);
        } else if (chipIndex - 1 >= 0) {
          this.setFocus(chipIndex - 1);
        }
      }

      this._subscribed.splice(this._subscribed.indexOf(chip), 1);
      chip.destroy.unsubscribe();
    });

    this._subscribed.push(chip);
  }

  private isValidIndex(index:number): boolean {
    return index >= 0 && index < this._chips.length;
  }
}
