import Ember from "ember";
import startApp from "../helpers/start-app";

var App;

['?blockStyle', ''].forEach(function (qp) {

module("Acceptance: <label>" + qp, {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, "destroy");
  }
});

test("clicking on the label will open the menu", function () {
  expect(1);
  visit("/" + qp);
  click("label[for='favorite-cookie']");
  andThen(function () {
    var label = find("#favorite-cookie");
    equal(label.attr('aria-expanded'), "true");
  });
});

test("hovering over the label will trigger a hover class on the select-menu label", function () {
  expect(2);
  visit("/" + qp);
  triggerEvent("label[for='favorite-cookie']", "mouseenter");
  andThen(function () {
    var label = find("#favorite-cookie");
    ok(label.hasClass('hover'));
  });

  triggerEvent("label[for='favorite-cookie']", "mouseleave");
  andThen(function () {
    var label = find("#favorite-cookie");
    ok(!label.hasClass('hover'));
  });
});

});
