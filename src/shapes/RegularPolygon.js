///////////////////////////////////////////////////////////////////////
//  RegularPolygon
///////////////////////////////////////////////////////////////////////
/**
 * RegularPolygon constructor.&nbsp; Examples include triangles, squares, pentagons, hexagons, etc.
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.RegularPolygon = function(config) {
    config.drawFunc = function() {
        var context = this.getContext();
        context.beginPath();
        context.moveTo(0, 0 - this.radius);

        for(var n = 1; n < this.sides; n++) {
            var x = this.radius * Math.sin(n * 2 * Math.PI / this.sides);
            var y = -1 * this.radius * Math.cos(n * 2 * Math.PI / this.sides);
            context.lineTo(x, y);
        }
        context.closePath();
        this.fillStroke();
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * RegularPolygon methods
 */
Kinetic.RegularPolygon.prototype = {
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
     * set number of sides
     * @param {int} sides
     */
    setSides: function(sides) {
        this.sides = sides;
    },
    /**
     * get number of sides
     */
    getSides: function() {
        return this.sides;
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
Kinetic.GlobalObject.extend(Kinetic.RegularPolygon, Kinetic.Shape);
