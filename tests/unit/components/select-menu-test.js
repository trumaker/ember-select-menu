import Ember from "ember";
import {
  moduleForComponent,
  test
} from 'ember-qunit';

var get = Ember.get;
var defaultPrevented = false;
var type = function (component, text) {
  text.split('').forEach(function (chr) {
    keyDown(component, chr.charCodeAt(0));
  });
};

var keyDown = function (component, keyCode) {
  defaultPrevented = false;
  component.keyDown({ which: keyCode, preventDefault: function () { defaultPrevented = true; } });
};

moduleForComponent('select-menu', 'SelectMenuComponent', {});

test('it allows selection through typing', function() {
  expect(1);

  // creates the component instance
  var component = this.subject({
    popup: {}
  });
  component.set('options', [{
    value: "Chocolate Chip Walnut",
    disabled: false
  }, {
    value: "Oatmeal Raisin Cookie",
    disabled: false
  }, {
    value: "Dark Chocolate Chocolate Chip",
    disabled: false
  }, {
    value: "Dark Chocolate Peanut Butter Chip",
    disabled: false
  }]);
  type(component, 'Oat');

  equal(get(component, 'value'), "Oatmeal Raisin Cookie");
});

test('it continues from the current match when searching', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: {}
  });
  component.set('options', [{
    value: "Chocolate Chip Walnut",
    disabled: false
  }, {
    value: "Oatmeal Raisin Cookie",
    disabled: false
  }, {
    value: "Dark Chocolate Chocolate Chip",
    disabled: false
  }, {
    value: "Dark Chocolate Peanut Butter Chip",
    disabled: false
  }]);
  type(component, 'Dark Chocolate ');
  equal(get(component, 'value'), "Dark Chocolate Chocolate Chip");
  type(component, 'P');
  equal(get(component, 'value'), "Dark Chocolate Peanut Butter Chip");
});


test('it searches case insensitively', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: {}
  });
  component.set('options', [{
    value: "Chocolate Chip Walnut",
    disabled: false
  }, {
    value: "Oatmeal Raisin Cookie",
    disabled: false
  }, {
    value: "Dark Chocolate Chocolate Chip",
    disabled: false
  }, {
    value: "Dark Chocolate Peanut Butter Chip",
    disabled: false
  }]);
  type(component, 'dARK ChOCOLATE ch');
  ok(defaultPrevented);
  equal(get(component, 'value'), "Dark Chocolate Chocolate Chip");
});

test('it handles backspaces', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: {}
  });
  component.set('options', [{
    value: "Chocolate Chip Walnut",
    disabled: false
  }, {
    value: "Oatmeal Raisin Cookie",
    disabled: false
  }, {
    value: "Dark Chocolate Chocolate Chip",
    disabled: false
  }, {
    value: "Dark Chocolate Peanut Butter Chip",
    disabled: false
  }]);
  type(component, 'dark chocolate ch');
  keyDown(component, 8);
  keyDown(component, 8);
  equal(get(component, 'value'), "Dark Chocolate Chocolate Chip");
  type(component, 'p');
  equal(get(component, 'value'), "Dark Chocolate Peanut Butter Chip");
});

test('it resets the search string after 750ms', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: {}
  });
  component.set('options', [{
    value: "Chocolate Chip Walnut",
    disabled: false
  }, {
    value: "Oatmeal Raisin Cookie",
    disabled: false
  }, {
    value: "Dark Chocolate Chocolate Chip",
    disabled: false
  }, {
    value: "Dark Chocolate Peanut Butter Chip",
    disabled: false
  }]);
  type(component, 'dark');
  equal(get(component, 'value'), "Dark Chocolate Chocolate Chip");

  stop();
  setTimeout(function() {
    type(component, 'choc');
    equal(get(component, 'value'), "Chocolate Chip Walnut");
    start();
  }, 800);
});

test('it toggles whether the menu is active using spacebar', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: {}
  });
  type(component, ' ');
  ok(get(component, 'isActive'));
  type(component, ' ');
  ok(!get(component, 'isActive'));
});

test('it allows tabs to pass through', function() {
  expect(3);

  // creates the component instance
  var component = this.subject({
    popup: {}
  });
  type(component, ' ');
  ok(get(component, 'isActive'));
  keyDown(component, 9);
  ok(!get(component, 'isActive'));
  ok(!defaultPrevented);
});

test('it allows selection using up and down arrows', function() {
  expect(8);

  // creates the component instance
  var component = this.subject({
    popup: {}
  });
  component.set('options', [{
    value: "A",
    disabled: false
  }, {
    value: "B",
    disabled: false
  }, {
    value: "C",
    disabled: false
  }, {
    value: "D",
    disabled: false
  }]);

  var UP = 38;
  var DOWN = 40;

  stop();
  setTimeout(function () {
    keyDown(component, DOWN);
    equal(get(component, 'value'), "A");
    ok(get(component, 'isActive'));

    keyDown(component, UP);
    ok(get(component, 'value'), "A");

    keyDown(component, DOWN);
    ok(get(component, 'value'), "B");

    keyDown(component, DOWN);
    ok(get(component, 'value'), "C");

    keyDown(component, DOWN);
    ok(get(component, 'value'), "D");

    keyDown(component, DOWN);
    ok(get(component, 'value'), "D");

    keyDown(component, UP);
    keyDown(component, UP);
    keyDown(component, UP);
    keyDown(component, UP);
    keyDown(component, UP);
    keyDown(component, UP);
    ok(get(component, 'value'), "A");
    start();
  });
});
