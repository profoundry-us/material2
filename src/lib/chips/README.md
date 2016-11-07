# md-chip-list

`md-chip-list` provides a horizontal display of (optionally) selectable, addable, and removable,
items and an input to create additional ones (again; optional). You can read more about chips
in the [Material Design spec](https://material.google.com/components/chips.html).

## Requirements

1. Show a static list of chips with proper styling
2. Show a dynamic list of chips with an Input
3. Show a dynamic list of chips with an Input/Autocomplete, or a Select

#### Additional Requirements

1. A Chips' Autocomplete or Select should not show items for an existing chip

## Usage

### Static Chips

Static chips can be used to inform a user about a list of existing, unmodifiable, items.

##### static-chips-1.html
```html
<md-chip-list>
  <md-chip>Baseball</md-chip>
  <md-chip>Basketball</md-chip>
  <md-chip>Football</md-chip>
</md-chip-list>
```

Alternatively, you can apply the chip styling to an existing element and this will handle focus and
selection events.

##### static-chips-2.html

```html
<div md-chip-list class="my-tags">
  <button md-chip *ngFor="let tag of tags" (select)="tagSelected(tag)">
    {{tag.name}}
  </button>
</div>
```

### Dynamic Chips

If you want any of the dynamic functionality supplied by chips, you may utilize the `md-chip-input`
component (and associated `(chipAdded)` event) in tandem with the `(remove)` event of the `md-chip`
component.

##### dynamic-chips-1.html

The most basic version simply utilizes the `(chipAdded)` event to push the requested chip onto
the list. This event handles the keyboard interaction and would also work in tandem with the
`[chip-separators]` option that allows user-defined separator keys (like `,` or `;`).

```html
<md-chip-list class="my-tags" #chips="mdChips">
  <md-chip *ngFor="let tag of tags" (remove)="tags.remove($chip)">
    {{tag.name}}
  </md-chip>
</md-chip-list>

<input type="email" placeholder="New email..."
       md-chip-input="chips" (chipAdded)="tags.push($chip)" />
```


##### autocomplete-chips.html

If you would like to help users by providing some filtering of predefined, options,
you can simply apply the `md-autocomplete`.

```html
<md-chip-list>
  <md-chip md-prefix *ngFor="let tag of tags" (remove)="tags.remove(tag)">
    {{tag.name}}
  </md-chip>
</md-chip-list>

<input type="text" placeholder="New tag..."
       [md-autocomplete-input-for]="autocomplete" />

<md-autocomplete #autocomplete="mdAutocomplete">
  <button md-autocomplete-item *ngFor="let suggestion of suggestions"
          (click)="tags.add(suggestion.name)">
    {{suggestion.name}}
  </button>
</md-autocomplete>
```

_**Note:** Notice how this `(remove)` utilizes the `tag` of the `*ngFor` rather than the
`$chip` variable. For chips which are more complex than strings, this may be desirable._

##### select-chips.html

Finally, you could use an `md-select` instead of an `md-autocomplete` if you do not wish
the user to be able to create new/unknown chips.

```html
<md-chip-list>
  <md-chip md-prefix *ngFor="let favorite of favoriteFoods"
           (remove)="favoriteFoods.remove(favorite)">
    {{favorite.name}}
  </md-chip>
</md-chip-list>

<md-select placeholder="Food">
  <md-option *ngFor="let food of foods" (select)="favoriteFoods.add(food)">
    {{ food.viewValue }}
  </md-option>
</md-select>
```

## Templates

Obviously, these kinds of complex controls may be a bit burdensome for many developers,
so I propose we add some "high-level" template components which can be used to make
development easier and more in-line with what most users are expecting, while still
providing full flexibility for users who want a more custom component.

##### md-static-chips

The most basic example would be static chips bound to a list of elements which provides
the `chip-text` expression allowing the component to render the chip without requiring
a template.

```html
<md-static-chips [ngModel]="myChips" chip-text="$chip.name">
</md-static-chips>
```

##### md-dynamic-chips

There are two common variations of the dynamic chips:

1. Chips with just an input
2. Chips with an input associated with an autocomplete

Both are listed below.

*only the input*
```html
<md-dynamic-chips [(ngModel)]="myChips" chip-text="$chip.name">
</md-dynamic-chips>
```

*with an autocomplete*
```html
<md-dynamic-chips [(ngModel)]="myChips" chip-text="$chip.name"
  [suggestions]="mySuggestions" suggestion-text="$suggestion.name"
  max-chips="5">
</md-dynamic-chips>
```

There are two methods for providing the suggestions:

1. `[suggestions]="mySuggestions"` - In this mode, the suggestions are bound to an array
   or list and the filtering is handled by the `md-dynamic-chips` component. 
2. `[suggestions]="getSuggestions($query)"` - In this mode, the suggestions are filtered
   by user-provided code and can immediately return with the value, or it can return a
   promise for evaluation at a later time.

The various behaviors could be also be controlled using the `capabilities` option.

```html
<md-dynamic-chips [(ngModel)]="myChips" chip-text="$chip.name"
  capabilities="create,remove,edit">
</md-dynamic-chips>
```

In this way, you can easily customize which behaviors are allowed at any given time.

_**Note:** We should also support the `ng-disabled`/`disabled` parameter which turns off all
capabilities._

##### md-contact-chips

Finally, we would offer a simple component for the common case of the Contact Chips which
appears multiple times in the spec.

```html
<md-contact-chips [(ngModel)]="selectedContacts" [contacts]="matchingContacts"
  [chipInfo]="getInfo($chip)" placeholder="Find friends..." required>
</md-contact-chips>
```

The `getInfo($chip)` method should return an object with `name`, `email` and `image` properties
to be utilized by the contact chips during rendering. If not provided, the default would simply be

```js
{
  name: $chip.name,
  email: $chip.email,
  image: $chip.image
}
````

Similar to the `md-dynamic-chips` and the suggestions, the developer could also supply
`[contacts]="getContacts($query)"` to asynchronously search for the contacts, or to have
more control over the filtered list.
