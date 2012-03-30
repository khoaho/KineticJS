///////////////////////////////////////////////////////////////////////
//  Circle
///////////////////////////////////////////////////////////////////////
/**
 * Circle constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Circle = function(config) {
    config.drawFunc = function() {
        var context = this.getContext();
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        this.fillStroke();
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Circle methods
 */
Kinetic.Circle.prototype = {
    /**
     * set radius
     * @param {Number} radius
     */
    setRadius: function(radius) {
        this.radius = radius;
        this.invalidateBoundsLocal();
    },
    /**
     * get radius
     */
    getRadius: function() {
        return this.radius;
    },
    /**
     * calculates the untransformed local bounds for the node
     * @returns {Kinetic.BoundsRect}
     */
    _calcNodeBoundsLocalUntransformed: function()
    {
        var diameter = this.radius * 2;
        return( new Kinetic.BoundsRect(this.x - this.radius, this.y - this.radius, diameter, diameter) );
    }
};

// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Circle, Kinetic.Shape);
