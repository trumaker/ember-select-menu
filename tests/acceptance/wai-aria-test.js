import Ember from "ember";
import startApp from "../helpers/start-app";

var App;

module("Acceptance - WAI ARIA", {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, "destroy");
  }
});

test("the select-menu label has the correct attributes", function () {
  expect(6);
  visit("/");
  andThen(function () {
    var label = find("#favorite-cookie");
    equal(label.attr('role'), "button");
    equal(label.attr('aria-haspopup'), "true");
    equal(label.attr('aria-disabled'), "false");
    equal(label.attr('aria-expanded'), "false");
    equal(label.attr('aria-owns'), find("ul").attr('id'));
  });

  click("#favorite-cookie");
  andThen(function () {
    var label = find("#favorite-cookie");
    equal(label.attr('aria-expanded'), "true");
  });
});

test("the select-menu label has the correct attributes when disabled", function () {
  expect(1);
  visit("/?disabled=true");
  andThen(function () {
    var label = find("#favorite-cookie");
    equal(label.attr('aria-disabled'), "true");
  });
});

test("the select-menu list has the correct attributes", function () {
  expect(6);
  visit("/");
  andThen(function () {
    var list = find("ul");
    equal(list.attr('role'), "listbox");
    equal(list.attr('aria-hidden'), "true");
    equal(list.attr('aria-disabled'), "false");
    equal(list.attr('aria-labelledby'), "favorite-cookie");
    equal(list.attr('aria-activedescendant'), "choc-chip");
  });

  click("#favorite-cookie");
  andThen(function () {
    var list = find("ul");
    equal(list.attr('aria-hidden'), "false");
  });
});

test("the select-menu list has the correct attributes when disabled", function () {
  expect(5);
  visit("/?disabled=true&prompt=COOKIE");
  andThen(function () {
    var list = find("ul");
    equal(list.attr('role'), "listbox");
    equal(list.attr('aria-hidden'), "true");
    equal(list.attr('aria-disabled'), "true");
    equal(list.attr('aria-labelledby'), "favorite-cookie");
    equal(list.attr('aria-activedescendant'), null);
  });
});


test("the select-menu option has the correct attributes", function () {
  expect(8);
  visit("/");
  andThen(function () {
    var chocolateChip = find("#choc-chip");
    equal(chocolateChip.attr('role'), "option");
    equal(chocolateChip.attr('aria-selected'), "true");

    var peanutButter = find("#pb");
    equal(peanutButter.attr('role'), "option");
    equal(peanutButter.attr('aria-selected'), "false");
  });

  click("#favorite-cookie");
  click("#pb");
  andThen(function () {
    var chocolateChip = find("#choc-chip");
    equal(chocolateChip.attr('role'), "option");
    equal(chocolateChip.attr('aria-selected'), "false");

    var peanutButter = find("#pb");
    equal(peanutButter.attr('role'), "option");
    equal(peanutButter.attr('aria-selected'), "true");
  });
});
