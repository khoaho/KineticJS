///////////////////////////////////////////////////////////////////////
//  Bounding rectangle
///////////////////////////////////////////////////////////////////////
/*
 Constructor
 @param {Number} [x]
 @param {Number} [y]
 @param {Number} [width]
 @param {Number} [height]
 */
Kinetic.BoundsRect = function( x, y, width, height )
{
    if( x === undefined )
        x = 0;
    if( y === undefined )
        y = 0;
    if( width === undefined )
        width = 0;
    if( height === undefined )
        height = 0;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

/*
 Creates a rect object from bounds provided
 @param {Number} left
 @param {Number} top
 @param {Number} right
 @param {Number} bottom
 @returns {Kinetic.Rect}
 */
Kinetic.BoundsRect.fromBounds = function( left, top, right, bottom )
{
    return( new Kinetic.Rect(left, top, right-left, bottom-top) );
};

/*
 Creates a rect object from point provided
 @param {Number} x
 @param {Number} y
 @returns {Kinetic.Rect}
 */
Kinetic.BoundsRect.fromPoint = function( x, y )
{
    return( new Kinetic.Rect(x, y, 0, 0) );
};

Kinetic.BoundsRect.prototype = {
    
    /*
     Returns the top y-coordinate
     @returns {Number}
     */
    getTop: function()
    {
        return( this.y );
    },
    
    /*
     Returns the left x-coordinate
     @returns {Number}
     */
    getLeft: function()
    {
        return( this.x );
    },
    
    /*
     Returns the bottom y-coordinate
     @returns {Number}
     */
    getBottom: function()
    {
        return( this.y + this.height );
    },
    
    /*
     Returns the right x-coordinate
     @returns {Number}
     */
    getRight: function()
    {
        return( this.x + this.width );
    },
    
    /*
     Determines if there's an overlap
     @param {Kinetic.Rect} rect
     @returns {Boolean}  True if it overlaps
     */
    overlaps: function( rect )
    {
        var myRight = this.x + this.width,
            myBottom = this.y + this.height,
            rectRight = rect.x + rect.width,
            rectBottom = rect.y + rect.height;
    
        return( this.x < rectRight  && myRight > rect.x     &&
            this.y < rectBottom && myBottom > rect.y        );
    },
    
    /*
     Encloses the target rect
     @param      {Kinetic.Rect}   rect
     @returns    {Kinetic.Rect}  the current instance
     */
    encloseRect: function( rect )
    {
        var rightMax = Math.max( this.x + this.width, rect.x + rect.width ),
            bottomMax = Math.max( this.y + this.height, rect.y+ rect.height );
    
        this.x = Math.min( this.x, rect.x );
        this.y = Math.min( this.y, rect.y );
        this.width = rightMax - this.x;
        this.height = bottomMax - this.y;
    
        return( this );
    },

    /*
     Encloses the target point
     @param      {Number}   x
     @param      {Number}   y
     @returns    {Kinetic.Rect}  the current instance
     */
    enclosePoint: function( x, y )
    {
        var rightMax = Math.max( this.x + this.width, x ),
            bottomMax = Math.max( this.y + this.height, y );

        this.x = Math.min( this.x, x );
        this.y = Math.min( this.y, y );
        this.width = rightMax - this.x;
        this.height = bottomMax - this.y;

        return( this );
    },

    /*
    Determines if the rects are equal
    @param {Kinetic.Rect} rect
    @returns {Boolean}  True if it's equal
    */
    isEqual: function( rect )
    {
        return( this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height );
    },

    /*
     Applies the transformation to a node bounds
     @param     {Kinetic.Transform} transform
     @returns   {Kinetic.Rect}  the current instance with transformation applied
     */
    transform: function( transform )
    {
        // OPTIMIZATION: For non-rotations or 0 dimension bounds, just transform the start point and we're done...
        if( !transform.hasRotation() || (this.width == 0 && this.height == 0) ) {
            this.width *= transform.m[0];
            this.height *= transform.m[3];

            if( this.x != 0 || this.y != 0 ) {
                var boundsTopLeft = transform.transformPoint( this.x, this.y );
                this.x = boundsTopLeft.x;
                this.y = boundsTopLeft.y;
            }

            return( this );
        }

        // If we get here, it's a full blown calculation
        var origBoundsLeft = this.x;
        var origBoundsTop = this.y;
        var origBoundsRight = this.getRight();
        var origBoundsBottom = this.getBottom();
        var pointTransformed;

        pointTransformed = transform.transformPoint( origBoundsLeft, origBoundsTop );
        this.x = pointTransformed.x;
        this.y = pointTransformed.y;
        this.width = 0;
        this.height = 0;

        pointTransformed = transform.transformPoint( origBoundsRight, origBoundsTop );
        this.enclosePoint( pointTransformed.x, pointTransformed.y );
        pointTransformed = transform.transformPoint( origBoundsRight, origBoundsBottom );
        this.enclosePoint( pointTransformed.x, pointTransformed.y );
        pointTransformed = transform.transformPoint( origBoundsLeft, origBoundsBottom );
        this.enclosePoint( pointTransformed.x, pointTransformed.y );

        return( this );
    },

    /*
     Clones the current rect
     @returns    {Kinetic.Rect}  new instance of a rect..
     */
    clone: function()
    {
        return( new Kinetic.Rect(this.x, this.y, this.width, this.height) );
    }
};