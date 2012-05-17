///////////////////////////////////////////////////////////////////////
//  Image
///////////////////////////////////////////////////////////////////////
/**
 * Image constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 *
 * @config  {Image|Kinetic.TileInfo}    image
 * @config  {Number}                    [width]
 * @config  {Number}                    [height]
 */
Kinetic.Image = function(config) {
    // defaults
    if(config.width === undefined) {
        config.width = config.image.width;
    }
    if(config.height === undefined) {
        config.height = config.image.height;
    }

    config.drawFunc = this._customDraw;

    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Image methods
 */
Kinetic.Image.prototype = {
    /**
     * set image
     * @param {Image|Kinetic.TileInfo} image
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
     * custom draw function
     */
    _customDraw: function() {
        var context = this.getContext(),
            image = this.image;

        context.beginPath();
        context.rect(0, 0, this.width, this.height);
        context.closePath();

        try
        {
            if( image instanceof Kinetic.TileInfo ) {
                context.drawImage(image.image, image.offsetX, image.offsetY, image.width, image.height, 0, 0, this.width, this.height);
                return;
            }

            context.drawImage(this.image, 0, 0, this.width, this.height);
        }
        catch( err )
        {
            // Do nothing here - this is to get around issues with bad/missing images
        }
    },
    /**
     * calculates the untransformed local bounds for the node
     * @returns {Kinetic.BoundsRect}
     */
    _calcNodeBoundsLocalUntransformed: function()
    {
        return( new Kinetic.BoundsRect(0, 0, this.width, this.height) );
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Image, Kinetic.Shape);
Kinetic.Image.base = Kinetic.Shape.prototype;
