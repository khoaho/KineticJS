///////////////////////////////////////////////////////////////////////
//  Star
///////////////////////////////////////////////////////////////////////
/**
 * Star constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Star = function(config) {
    config.drawFunc = function() {
        var context = this.getContext();
        context.beginPath();
        context.moveTo(0, 0 - this.outerRadius);

        for(var n = 1; n < this.points * 2; n++) {
            var radius = n % 2 === 0 ? this.outerRadius : this.innerRadius;
            var x = radius * Math.sin(n * Math.PI / this.points);
            var y = -1 * radius * Math.cos(n * Math.PI / this.points);
            context.lineTo(x, y);
        }
        context.closePath();
        this.fillStroke();
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Star methods
 */
Kinetic.Star.prototype = {
    /**
     * set outer radius
     * @param {Number} radius
     */
    setOuterRadius: function(radius) {
        this.outerRadius = radius;
        this.invalidateBoundsLocal();
    },
    /**
     * get outer radius
     */
    getOuterRadius: function() {
        return this.outerRadius;
    },
    /**
     * set inner radius
     * @param {Number} radius
     */
    setInnerRadius: function(radius) {
        this.innerRadius = radius;
    },
    /**
     * get inner radius
     */
    getInnerRadius: function() {
        return this.innerRadius;
    },
    /**
     * calculates the untransformed local bounds for the node
     * @returns {Kinetic.BoundsRect}
     */
    _calcNodeBoundsLocalUntransformed: function()
    {
        var diameter = this.outerRadius * 2;
        return( new Kinetic.BoundsRect(this.x - this.outerRadius, this.y - this.outerRadius, diameter, diameter) );
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Star, Kinetic.Shape);
