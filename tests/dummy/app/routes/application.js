import Ember from "ember";

export default Ember.Route.extend({

  model: function (params) {
    return [{
      id: "choc-chip",
      disabled: params.disabled === "choc-chip",
      name: "Chocolate Chip"
    }, {
      id: "digestive",
      disabled: params.disabled === "digestive",
      name: "Digestive"
    }, {
      id: "oatmeal",
      disabled: params.disabled === "oatmeal",
      name: "Oatmeal Raisin"
    }, {
      id: "pb",
      disabled: params.disabled === "pb",
      name: "Peanut Butter"
    }];
  }

});
