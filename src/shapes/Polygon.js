///////////////////////////////////////////////////////////////////////
//  Polygon
///////////////////////////////////////////////////////////////////////
/**
 * Polygon constructor.&nbsp; Polygons are defined by an array of points
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Polygon = function(config) {
    config.drawFunc = function() {
        var context = this.getContext();
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        for(var n = 1; n < this.points.length; n++) {
            context.lineTo(this.points[n].x, this.points[n].y);
        }
        context.closePath();
        this.fillStroke();
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Polygon methods
 */
Kinetic.Polygon.prototype = {
    /**
     * set points array
     * @param {Array} points
     */
    setPoints: function(points) {
        this.points = points;
        this.invalidateBoundsLocal();
    },
    /**
     * get points array
     */
    getPoints: function() {
        return this.points;
    },
    /**
     * calculates the untransformed local bounds for the node
     * @returns {Kinetic.BoundsRect}
     */
    _calcNodeBoundsLocalUntransformed: function()
    {
        var points = this.points,
            pointsNum = points.length,
            index,
            pointCurr,
            boundsUntransformed;

        if( pointsNum == 0 ) {
            return( new Kinetic.BoundsRect(0, 0, 0, 0) );
        }

        pointCurr = points[0];
        boundsUntransformed = Kinetic.BoundsRect.fromPoint( pointCurr.x, pointCurr.y );
        for( index = 1; index < pointsNum; index++ ) {
            pointCurr = points[index];
            boundsUntransformed.enclosePoint( pointCurr.x, pointCurr.y );
        }

        return( boundsUntransformed );
    }
};

// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Polygon, Kinetic.Shape);
