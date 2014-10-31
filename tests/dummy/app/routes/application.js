import Ember from "ember";

export default Ember.Route.extend({

  model: function () {
    return [{
      id: "choc-chip",
      name: "Chocolate Chip"
    }, {
      id: "digestive",
      name: "Digestive"
    }, {
      id: "oatmeal",
      name: "Oatmeal Raisin"
    }, {
      id: "pb",
      name: "Peanut Butter"
    }];
  }

});
