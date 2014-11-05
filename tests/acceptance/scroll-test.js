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
  expect(2);
  visit("/");
  keyEvent(".select-menu:last-child", "keydown", "z");
  andThen(function () {
    var popup = find("#alphabet + .popup-menu");
    var list = popup.find(".select-menu_list");
    var maxScrollTop = getLayout(list[0]).padding.height - getLayout(popup[0]).height;
    equal(list.scrollTop(), maxScrollTop);
  });

  keyEvent(".select-menu:last-child", "keydown", "a");
  andThen(function () {
    var popup = find("#alphabet + .popup-menu");
    equal(popup.scrollTop(), 0);
  });
});

test("using up and down arrows will focus the element into view", function () {
  expect(15);
  visit("/");

  var UP = 38;
  var DOWN = 40;

  var flushTop = function () {
    var list = find("#alphabet + .popup-menu .select-menu_list");
    equal(list.scrollTop(), 0);
  };
  var offset = function () {
    var list = find("#alphabet + .popup-menu .select-menu_list");
    ok(list.scrollTop() > 0);
  };

  for (var i = 0; i < 7; i++) {
    keyEvent(".select-menu:last-child", "keydown", DOWN);
    andThen(flushTop);
  }

  keyEvent(".select-menu:last-child", "keydown", DOWN);
  andThen(offset);

  for (i = 0; i < 6; i++) {
    keyEvent(".select-menu:last-child", "keydown", UP);
    andThen(offset);
  }

  keyEvent(".select-menu:last-child", "keydown", UP);
  andThen(flushTop);
});
