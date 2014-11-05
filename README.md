# ember-cli {{select-menu}} [![Build Status](https://travis-ci.org/paddle8/ember-select-menu.svg?branch=master)](https://travis-ci.org/paddle8/ember-select-menu)

A simplified interface for custom select widgets. The handlebars is straightforward and easy to read:

```handlebars
<label for="country">Where are you from?</label>
{{#select-menu id="country" prompt="Select a country" value=country search-by="label code"}}
  {{#each countries}}
    {{select-option value=this label=name code=code}}
  {{/each}}
{{/select-menu}}
```

This addon comes with baked in WAI-ARIA support for screen readers, keyboard navigation and keyboard search.


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
