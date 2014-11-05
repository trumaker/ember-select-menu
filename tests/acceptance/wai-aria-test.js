import Ember from "ember";
import startApp from "../helpers/start-app";

var App;

['?blockStyle', ''].forEach(function (qp) {

module("Acceptance: WAI ARIA" + qp, {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, "destroy");
  }
});

test("the select-menu label has the correct attributes", function () {
  expect(6);
  visit("/" + qp);
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
  visit("/?disabled" + qp.replace('?', '&'));
  andThen(function () {
    var label = find("#favorite-cookie");
    equal(label.attr('aria-disabled'), "true");
  });
});

test("the select-menu list has the correct attributes", function () {
  expect(6);
  visit("/" + qp);
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
  visit("/?disabled&prompt=COOKIE" + qp.replace('?', '&'));
  andThen(function () {
    var list = find("ul");
    equal(list.attr('role'), "listbox");
    equal(list.attr('aria-hidden'), "true");
    equal(list.attr('aria-disabled'), "true");
    equal(list.attr('aria-labelledby'), "favorite-cookie");
    equal(list.attr('aria-activedescendant'), null);
  });
});


test("the select-option has the correct attributes", function () {
  expect(10);
  visit("/" + qp);
  andThen(function () {
    var chocolateChip = find("#choc-chip");
    equal(chocolateChip.attr('role'), "option");
    equal(chocolateChip.attr('aria-selected'), "true");
    equal(chocolateChip.attr('aria-disabled'), "false");
    if (qp === "?blockStyle") {
      equal(chocolateChip.attr('aria-label'), null);
    } else {
      equal(chocolateChip.attr('aria-label'), "Chocolate Chip");
    }

    var peanutButter = find("#pb");
    equal(peanutButter.attr('role'), "option");
    equal(peanutButter.attr('aria-selected'), "false");
    equal(peanutButter.attr('aria-disabled'), "false");
    if (qp === "?blockStyle") {
      equal(peanutButter.attr('aria-label'), null);
    } else {
      equal(peanutButter.attr('aria-label'), "Peanut Butter");
    }
  });

  click("#favorite-cookie");
  click("#pb");
  andThen(function () {
    var chocolateChip = find("#choc-chip");
    equal(chocolateChip.attr('aria-selected'), "false");

    var peanutButter = find("#pb");
    equal(peanutButter.attr('aria-selected'), "true");
  });
});

test("the select-option will be marked as disabled if it is", function () {
  expect(2);
  visit("/?disabled=pb" + qp.replace('?', '&'));
  andThen(function () {
    var chocolateChip = find("#choc-chip");
    equal(chocolateChip.attr('aria-disabled'), "false");

    var peanutButter = find("#pb");
    equal(peanutButter.attr('aria-disabled'), "true");
  });
});

});
