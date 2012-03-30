///////////////////////////////////////////////////////////////////////
//  Simple culling layer
///////////////////////////////////////////////////////////////////////
/**
 * Simple culling layer constructor.  The layer will cull objects when
 * drawing based on their bounding boxes
 * @constructor
 * @augments Kinetic.Layer
 * @param {Object} config
 */
Kinetic.LayerCullSimple = function(config) {
    // call super constructors
    Kinetic.Layer.apply(this, arguments);
};
/*
 * Layer methods
 */
Kinetic.LayerCullSimple.prototype = {
    /**
     * get the list of children to draw
     */
    _getChildrenDrawList: function() {
        var children = Kinetic.Layer.prototype._getChildrenDrawList.apply(this),
            childrenNum = children.length,
            viewToLocalTransform,
            localViewBounds,
            drawList,
            childIndex,
            childCurr;

        if( childrenNum <= 0 )
            return( children );

        // Return the view bounds in local space
        viewToLocalTransform = this.getTransformView().invert();
        localViewBounds = this._getNodeBoundsUntransformed().transform( viewToLocalTransform );

        // Run through the list of children and return only the ones who are in the local view bounds...
        drawList = new Array();
        for( childIndex = 0; childIndex < childrenNum; childIndex++ )
        {
            childCurr = children[childIndex];
            if( localViewBounds.overlaps(childCurr.getBoundsLocal()) )
                drawList.push( childCurr );
        }

        return( childCurr );
    }
};
// Extend Layer
Kinetic.GlobalObject.extend(Kinetic.LayerCullSimple, Kinetic.Layer);
