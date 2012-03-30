///////////////////////////////////////////////////////////////////////
//  Image
///////////////////////////////////////////////////////////////////////
/**
 * Image constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Image = function(config) {
    // defaults
    if(config.width === undefined) {
        config.width = config.image.width;
    }
    if(config.height === undefined) {
        config.height = config.image.height;
    }

    config.drawFunc = function() {
        var context = this.getContext();
        context.beginPath();
        context.rect(0, 0, this.width, this.height);
        context.closePath();
        context.drawImage(this.image, 0, 0, this.width, this.height);
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Image methods
 */
Kinetic.Image.prototype = {
    /**
     * set image
     * @param {Image} image
     */
    setImage: function(image) {
        this.image = image;
    },
    /**
     * get image
     */
    getImage: function() {
        return this.image;
    },
    /**
     * set width
     * @param {Number} width
     */
    setWidth: function(width) {
        this.width = width;
        this.invalidateBoundsLocal();
    },
    /**
     * get width
     */
    getWidth: function() {
        return this.width;
    },
    /**
     * set height
     * @param {Number} height
     */
    setHeight: function(height) {
        this.height = height;
        this.invalidateBoundsLocal();
    },
    /**
     * get height
     */
    getHeight: function() {
        return this.height;
    },
    /**
     * set width and height
     * @param {Number} width
     * @param {Number} height
     */
    setSize: function(width, height) {
        this.width = width;
        this.height = height;
        this.invalidateBoundsLocal();
    },
    /**
     * calculates the untransformed local bounds for the node
     * @returns {Kinetic.BoundsRect}
     */
    _calcNodeBoundsLocalUntransformed: function()
    {
        if( this.width == null || this.height == null )
            return( Kinetic.Image.base._calcNodeBoundsLocalUntransformed.apply(this) );

        return( new Kinetic.BoundsRect(0, 0, this.width, this.height) );
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Image, Kinetic.Shape);
Kinetic.Image.base = Kinetic.Shape.prototype;
