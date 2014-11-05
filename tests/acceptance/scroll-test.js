import Ember from "ember";
import { getLayout } from "dom-ruler";
import startApp from "../helpers/start-app";

var App;

module("Acceptance: options scroll into view", {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, "destroy");
  }
});

test("searching for an option will focus it into view", function () {
  expect(1);
  visit("/");
  keyEvent(".select-menu:last-child", "keydown", "z");
  andThen(function () {
    var popup = find("#alphabet + .popup-menu");
    var list = popup.find(".select-menu_list");
    var maxScrollTop = getLayout(list[0]).padding.height - getLayout(popup[0]).height;
    equal(popup.scrollTop(), maxScrollTop);
  });
});
