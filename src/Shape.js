///////////////////////////////////////////////////////////////////////
//  Shape
///////////////////////////////////////////////////////////////////////
/**
 * Shape constructor.  Shapes are used to objectify drawing bits of a KineticJS
 * application
 * @constructor
 * @augments Kinetic.Node
 * @param {Object} config
 */
Kinetic.Shape = function(config) {
    this.className = 'Shape';

    // defaults
    if(config.stroke !== undefined || config.strokeWidth !== undefined) {
        if(config.stroke === undefined) {
            config.stroke = "black";
        } else if(config.strokeWidth === undefined) {
            config.strokeWidth = 2;
        }
    }

    // required
    this.drawFunc = config.drawFunc;

    // call super constructor
    Kinetic.Node.apply(this, [config]);
};
/*
 * Shape methods
 */
Kinetic.Shape.prototype = {
    /**
     * isPointInShape
     */
    isPointInShape: function(backstageLayer,pos){
        var backstageLayerContext = backstageLayer.getContext();
        this._draw(backstageLayer, true);
        return backstageLayerContext.isPointInPath(pos.x,pos.y);
    },
    /**
     * get layer context where the shape is being drawn.  When
     * the shape is being rendered, .getContext() returns the context of the
     * user created layer that contains the shape.  When the event detection
     * engine is determining whether or not an event has occured on that shape,
     * .getContext() returns the context of the invisible backstage layer.
     */
    getContext: function() {
        return this.tempLayer.getContext();
    },
    /**
     * get shape temp layer canvas
     */
    getCanvas: function() {
        return this.tempLayer.getCanvas();
    },
    /**
     * helper method to fill and stroke a shape based on its
     * fill, stroke, and strokeWidth properties
     */
    fillStroke: function() {
        var context = this.getContext();

        if(this.fill !== undefined) {
            context.fillStyle = this.fill;
            context.fill();
        }
        if(this.stroke !== undefined) {
            context.lineWidth = this.strokeWidth === undefined ? 1 : this.strokeWidth;
            context.strokeStyle = this.stroke;
            context.stroke();
        }
    },
    /**
     * set fill which can be a color, gradient object,
     * or pattern object
     * @param {String|CanvasGradient|CanvasPattern} fill
     */
    setFill: function(fill) {
        this.fill = fill;
    },
    /**
     * get fill
     */
    getFill: function() {
        return this.fill;
    },
    /**
     * set stroke color
     * @param {String} stroke
     */
    setStroke: function(stroke) {
        this.stroke = stroke;
    },
    /**
     * get stroke color
     */
    getStroke: function() {
        return this.stroke;
    },
    /**
     * set stroke width
     * @param {Number} strokeWidth
     */
    setStrokeWidth: function(strokeWidth) {
        this.strokeWidth = strokeWidth;
    },
    /**
     * get stroke width
     */
    getStrokeWidth: function() {
        return this.strokeWidth;
    },
    /**
     * set composite mode
     * @param {String} compositeMode
     */
    setCompositeMode: function(compositeMode) {
        this.compositeMode = compositeMode;
    },
    /**
     * get composite mode
     */
    getCompositeMode: function() {
        return this.compositeMode;
    },
    /**
     * get the transform
     * @returns {Kinetic.Transform}
     */
    getTransform: function()
    {
        var transform = new Kinetic.Transform();
        this._applyTransform( transform );

        return( transform );
    },
    /**
     * draw shape
     * @param {Kinetic.Layer} layer Layer that the shape will be drawn on
     * @param {Boolean} isForDetection  True if the draw is for point detection
     */
    _draw: function(layer, isForDetection) {
        if(this.visible) {
            var context = layer.getContext();
            context.save();

            this._applyTransform( context );

            if( this.compositeMode !== undefined ) {
                context.globalCompositeOperation = this.compositeMode;
            }

            context.globalAlpha = this.getAbsoluteAlpha();

            this.tempLayer = layer;
            this.drawFunc.call(this, isForDetection);

            context.restore();
        }
    },

    /**
     * Calculate the transform
     * @param {CanvasContext|Kinetic.Transform} transform
     */
    _applyTransform: function( transform ) {
        var family = [];
        var stage = null;
        family.unshift(this);
        var parent = this.parent;
        while (parent !== null) {
            if( parent.className !== "Stage" ) {
                family.unshift(parent);
                parent = parent.parent;
            } else {
                // When we reach the stage, we stop...
                stage = parent;
                break;
            }
        }

        if(stage) {
            var stageViewPos = stage.viewPos;
            if( stageViewPos !== null ) {
                transform.translate( -stageViewPos.x, -stageViewPos.y );
            }

            var stageScale = stage.scale;
            if( stageScale !== null ) {
                transform.scale(stageScale.x, stageScale.y);
            }
        }

        // apply children transforms
        for (var n = 0; n < family.length; n++) {
            var obj = family[n];

            // Transformations are applied right to left (i.e. last transform is applied first)...
            if (obj.x !== 0 || obj.y !== 0) {
                transform.translate(obj.x, obj.y);
            }
            if (obj.centerOffset.x !== 0 || obj.centerOffset.y !== 0) {
                transform.translate(obj.centerOffset.x, obj.centerOffset.y);
            }
            if (obj.scale.x !== 1 || obj.scale.y !== 1) {
                transform.scale(obj.scale.x, obj.scale.y);
            }
            if (obj.rotation !== 0) {
                transform.rotate(obj.rotation);
            }
            if (obj.centerOffset.x !== 0 || obj.centerOffset.y !== 0) {
                transform.translate(-1 * obj.centerOffset.x, -1 * obj.centerOffset.y);
            }
        }

        return( transform );
    }
};

// extend Node
Kinetic.GlobalObject.extend(Kinetic.Shape, Kinetic.Node);
