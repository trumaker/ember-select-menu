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
  visit("/");
  andThen(function () {
    equal(find("#favorite").html(), "Chocolate Chip");
  });

  click("#favorite-cookie");
  click("li:contains('Digestive')");

  andThen(function () {
    equal(find("#favorite").html(), "Digestive");
  });

  click("#favorite-cookie");
  click("li:contains('Peanut Butter')");

  andThen(function () {
    equal(find("#favorite").html(), "Peanut Butter");
  });
});

test("with prompt", function () {
  visit("/?prompt=Pick a cookie");
  andThen(function () {
    equal(find("#favorite").html(), "");
  });

  click("#favorite-cookie");
  click("li:contains('Digestive')");

  andThen(function () {
    equal(find("#favorite").html(), "Digestive");
  });

  click("#favorite-cookie");
  click("li:contains('Peanut Butter')");

  andThen(function () {
    equal(find("#favorite").html(), "Peanut Butter");
  });
});
