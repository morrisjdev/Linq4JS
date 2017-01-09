Array.prototype.AddRange = function (objects) {
    var that = this;
    objects.ForEach(function (x) {
        that.Add(x);
    });
    return that;
};
//# sourceMappingURL=AddRange.js.map