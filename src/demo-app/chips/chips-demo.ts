import {Component} from '@angular/core';

export interface Person {
  name: string;
}

@Component({
  moduleId: module.id,
  selector: 'chips-demo',
  templateUrl: 'chips-demo.html',
  styleUrls: ['chips-demo.scss']
})
export class ChipsDemo {
  color:string = undefined;

  people:Person[] = [
    { name: 'Kara' },
    { name: 'Jeremy' },
    { name: 'Topher' },
    { name: 'Elad' },
    { name: 'Kristiyan' },
    { name: 'Paul' }
  ];
  favorites:Person[] = [];

  alert(message:string): void {
    alert(message);
  }

  add(input:HTMLInputElement):void {
    if (input.value && input.value.trim() != '') {
      this.people.push({ name: input.value.trim() });
      input.value = '';
    }
  }

  remove(person:Person): void {
    var index = this.people.indexOf(person);

    if (index > -1 && index < this.people.length) {
      this.people.splice(index, 1);
    }

    // We should unfavorite them if they are no longer a contributor
    this.unfavorite(person);
  }

  favorite(person:Person): void {
    this.favorites.push(person);
  }

  unfavorite(person:Person): void {
    var index = this.favorites.indexOf(person);

    if (index > -1 && index < this.favorites.length) {
      this.favorites.splice(index, 1);
    }
  }
}