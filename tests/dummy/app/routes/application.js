import Ember from "ember";

export default Ember.Route.extend({

  model: function () {
    return [
      "Chocolate Chip",
      "Digestive",
      "Oatmeal Raisin",
      "Peanut Butter"
    ];
  }

});
