import Ember from "ember";
import {
  moduleForComponent,
  test
} from 'ember-qunit';

var get = Ember.get;
var set = Ember.set;
var RSVP = Ember.RSVP;
var next = Ember.run.next;
var later = Ember.run.later;
var run = Ember.run;

var mock = function () {
  return {
    activate: function () {
      this.isActive = true;
    },
    deactivate: function () {
      this.isActive = false;
    }
  };
};

var type = function (component, text) {
  text.split('').forEach(function (chr) {
    keyDown(component, chr.charCodeAt(0));
  });
};

var defaultPrevented = false;
var keyDown = function (component, keyCode) {
  defaultPrevented = false;
  component.keyDown({ which: keyCode, preventDefault: function () { defaultPrevented = true; } });
};

moduleForComponent('select-menu', 'SelectMenuComponent', {});

test('it unwraps promises', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: mock()
  });

  var deferred = RSVP.defer();
  run(function () {
    set(component, 'options', [{
      value: "Chocolate Chip Walnut"
    }, {
      value: "Oatmeal Raisin Cookie"
    }, {
      value: "Dark Chocolate Chocolate Chip"
    }, {
      value: "Dark Chocolate Peanut Butter Chip"
    }]);

    set(component, 'value', deferred.promise);
  });

  equal(get(component, 'value'), deferred.promise);
  deferred.resolve("Dark Chocolate Chocolate Chip");

  stop();
  deferred.promise.then(function () {
    equal(get(component, 'value'), "Dark Chocolate Chocolate Chip");
    start();
  });
});

test('it selects the first option if the promise resolves to null', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: mock()
  });

  var deferred = RSVP.defer();
  run(function () {
    set(component, 'options', [{
      value: "Chocolate Chip Walnut"
    }, {
      value: "Oatmeal Raisin Cookie"
    }, {
      value: "Dark Chocolate Chocolate Chip"
    }, {
      value: "Dark Chocolate Peanut Butter Chip"
    }]);

    set(component, 'value', deferred.promise);
  });
  equal(get(component, 'value'), deferred.promise);
  deferred.resolve(null);

  stop();
  deferred.promise.then(function () {
    var d = RSVP.defer();
    next(d, 'resolve');
    return d.promise;
  }).then(function () {
    equal(get(component, 'value'), "Chocolate Chip Walnut");
    start();
  });
});

test('it selects nothing if the promise resolves to null and there is a prompt', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: mock()
  });
  var deferred = RSVP.defer();
  run(function () {
    set(component, 'options', [{
      value: "Chocolate Chip Walnut"
    }, {
      value: "Oatmeal Raisin Cookie"
    }, {
      value: "Dark Chocolate Chocolate Chip"
    }, {
      value: "Dark Chocolate Peanut Butter Chip"
    }]);

    set(component, 'value', deferred.promise);
  });

  equal(get(component, 'value'), deferred.promise);
  deferred.resolve(null);

  stop();
  deferred.promise.then(function () {
    var d = RSVP.defer();
    set(component, 'prompt', "'ELLO");
    next(d, 'resolve');
    return d.promise;
  }).then(function () {
    equal(get(component, 'value'), null);
    start();
  });
});


test('it allows selection through typing', function() {
  expect(1);

  // creates the component instance
  var component = this.subject({
    popup: mock()
  });
  run(function () {
    set(component, 'searchBy', ['value']);
    set(component, 'options', [{
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
  });
  type(component, 'Oat');

  equal(get(component, 'value'), "Oatmeal Raisin Cookie");
});

test('it continues from the current match when searching', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: mock()
  });
  run(function () {
    set(component, 'searchBy', ['value']);
    set(component, 'options', [{
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
  });

  type(component, 'Dark Chocolate ');
  equal(get(component, 'value'), "Dark Chocolate Chocolate Chip");
  type(component, 'P');
  equal(get(component, 'value'), "Dark Chocolate Peanut Butter Chip");
});


test('it searches case insensitively', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: mock()
  });
  run(function () {
    set(component, 'searchBy', ['value']);
    set(component, 'options', [{
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
  });

  type(component, 'dARK ChOCOLATE ch');
  ok(defaultPrevented);
  equal(get(component, 'value'), "Dark Chocolate Chocolate Chip");
});

test('it handles backspaces', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: mock()
  });
  run(function () {
    set(component, 'searchBy', ['value']);
    set(component, 'options', [{
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
  });

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
    popup: mock()
  });
  run(function () {
    set(component, 'searchBy', ['value']);
    set(component, 'options', [{
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
  });

  type(component, 'dark');
  equal(get(component, 'value'), "Dark Chocolate Chocolate Chip");

  stop();
  later(function() {
    type(component, 'choc');
    equal(get(component, 'value'), "Chocolate Chip Walnut");
    start();
  }, 800);
});

test('it toggles whether the menu is active using spacebar', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    popup: mock()
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
    popup: mock()
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
    popup: mock()
  });
  run(function () {
    set(component, 'options', [{
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
  });

  var UP = 38;
  var DOWN = 40;

  stop();
  later(function () {
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

test('it has an API for searching custom fields', function() {
  expect(3);

  // creates the component instance
  var component = this.subject({
    popup: mock()
  });
  run(function () {
    set(component, 'options', [{
      value: "A",
      search: "Q",
      disabled: false
    }, {
      value: "B",
      search: "X",
      disabled: false
    }, {
      value: "C",
      search: "Y",
      disabled: false
    }, {
      value: "D",
      search: "Z",
      disabled: false
    }]);
    set(component, 'searchBy', "search");
  });

  deepEqual(get(component, 'searchBy'), ['search']);

  type(component, 'Z');
  equal(get(component, 'value'), "D");
  component.resetSearch();

  type(component, 'X');
  equal(get(component, 'value'), "B");
});
