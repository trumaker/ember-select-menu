import Ember from "ember";
import startApp from "../helpers/start-app";

var App;

module("Acceptance", {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, "destroy");
  }
});

test("no prompt", function () {
  expect(3);
  visit("/");
  andThen(function () {
    equal(find("#favorite").html(), "Chocolate Chip");
  });

  click("#favorite-cookie");
  click("#digestive");

  andThen(function () {
    equal(find("#favorite").html(), "Digestive");
  });

  click("#favorite-cookie");
  click("#pb");

  andThen(function () {
    equal(find("#favorite").html(), "Peanut Butter");
  });
});

test("with prompt", function () {
  expect(3);
  visit("/?prompt=Pick a cookie");
  andThen(function () {
    equal(find("#favorite").html(), "");
  });

  click("#favorite-cookie");
  click("#digestive");

  andThen(function () {
    equal(find("#favorite").html(), "Digestive");
  });

  click("#favorite-cookie");
  click("#pb");

  andThen(function () {
    equal(find("#favorite").html(), "Peanut Butter");
  });
});
