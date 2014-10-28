import Ember from "ember";

var computed = Ember.computed;
var get = Ember.get;

var flatten = function (array) {
  return array.reduce(function (a, b) {
    return a.concat(b);
  });
};

var recursivelyFindByType = function (typeClass, children) {
  var view = children.find(function (view) {
    return typeClass.detectInstance(view);
  });

  if (view) {
    return view;
  }

  var childrenOfChildren = flatten(children.getEach('childViews'));
  if (childrenOfChildren.length === 0) {
    return null;
  }
  return recursivelyFindByType(typeClass, childrenOfChildren);
};

export default function(type) {
  return computed('childViews.[]', function nearestChild() {
    var typeClass = this.container.lookupFactory('component:' + type) ||
                    this.container.lookupFactory('view:' + type);

    return recursivelyFindByType(typeClass, get(this, 'childViews') || []);
  });
}
