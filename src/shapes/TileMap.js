///////////////////////////////////////////////////////////////////////
//  Tile map render
///////////////////////////////////////////////////////////////////////
/**
 * Tilemap constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 *
 * @config {Number}             gridColumns         Number of grid columns
 * @config {Number}             gridRows            Number of grid rows
 * @config {Number}             spotWidth           Grid spot width
 * @config {Number}             spotHeight          Grid spot height
 * @config {Number}             x                   Draw x-position
 * @config {Number}             y                   Draw y-position
 * @config {Kinetic.TileSet}    tileSet             The tile set
 * @config {Number[]}           spotData            Array of tile IDs for each spot
 * @config {Function}           spotClass           The map spot container class. Must be Kinetic.TileMapSpot or
 *                                                  a derivation of it.
 */
Kinetic.TileMap = function( config ) {
    // defaults
    this.gridColumns = 0;
    this.gridRows = 0;
    this.spotWidth = 0;
    this.spotHeight = 0;
    this.tileSet = new Kinetic.TileSet();
    this.spotData = null;
    this.spotClass = Kinetic.TileMapSpot;
    this.x = 0;
    this.y = 0;

    config.drawFunc = this._customDraw;

    // call super constructor
    Kinetic.Shape.call(this, config);

    // Calculated members
    this.bounds = new Kinetic.BoundsRect( 0, 0, this.gridColumns * this.spotWidth, this.gridRows * this.spotHeight );
    this.spots = null;

    this._initSpots();
};

Kinetic.TileMap.prototype = {
    /*
     *  Returns a spot by coordinate
     *  @param {Number}    gridX
     *  @param {Number}    gridY
     */
    getSpotByCoord: function( gridX, gridY ) {
        if( gridX < 0 || gridX >= this.gridColumns )
            return null;
        if( gridY < 0 || gridY >= this.gridRows )
            return null;

        return( this.spots[gridX + (gridY*this.gridColumns)] );
    },
    /*
     *  Returns a spot by index
     *  @param {Number}    spotIndex
     */
    getSpotByIndex: function( spotIndex ) {
        if( spotIndex < 0 || spotIndex >= this.spots.length )
            return null;

        return( this.spots[spotIndex] );
    },
    /*
     *  Custom draw
     *  @param {Boolean}    isForDetection
     */
    _customDraw: function( isForDetection ) {
        var canvas, drawCtx,
            mapBounds,
            transform,
            spotWidth, spotHeight, setTileSizeMax,
            viewportBounds,
            viewportLocalTopLeft,
            viewportLocalBottomRight,
            overlap,
            spotStartX, spotStartY,
            spotStopX, spotStopY,
            spots,
            spotLeftIndex,
            spotX, spotY, spotIndex;

        drawCtx = this.getContext();

        if( isForDetection )
        {
            mapBounds = this.bounds;
            drawCtx.beginPath();
            drawCtx.rect( mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height );
            drawCtx.closePath();
            return;
        }

        canvas = this.getCanvas();

        // Get the canvas extents in local space...
        transform = this.getTransformView();
        transform.invert();
        viewportBounds = new Kinetic.BoundsRect( 0, 0, canvas.width, canvas.height );
        viewportBounds.transform( transform );
        viewportLocalTopLeft = { x: viewportBounds.x, y: viewportBounds.y };
        viewportLocalBottomRight  = { x: viewportBounds.getRight(), y: viewportBounds.getBottom() };

        spotWidth = this.spotWidth;
        spotHeight = this.spotHeight;
        setTileSizeMax = this.tileSet.getTileSizeMax();

        // Determine the tile overlap...
        overlap = this.spotClass.getSpotOverlap( setTileSizeMax.x, setTileSizeMax.y, spotWidth, spotHeight );

        // Convert the canvas extents into tile viewport space tile coordinates and take into consideration overlaps
        spotStartX = Math.max( 0, Math.floor(viewportLocalTopLeft.x /  spotWidth) - overlap.left );
        spotStartY = Math.max( 0, Math.floor(viewportLocalTopLeft.y /  spotHeight) - overlap.top );
        spotStopX = Math.min( this.gridColumns - 1, Math.floor(viewportLocalBottomRight.x /  spotWidth) + overlap.right );
        spotStopY = Math.min( this.gridRows - 1, Math.floor(viewportLocalBottomRight.y /  spotHeight) + overlap.bottom );

        // Draw the tiles from left to right, top to bottom
        spots = this.spots;
        spotLeftIndex = spotStartX + (spotStartY * this.gridColumns);
        for( spotY = spotStartY; spotY <= spotStopY; spotY++ )
        {
            for( spotX = spotStartX; spotX <= spotStopX; spotX++ )
            {
                spotIndex = spotLeftIndex + ( spotX - spotStartX );
                spots[spotIndex].draw( drawCtx );
            }

            // Next line of tiles...
            spotLeftIndex += this.gridColumns;
        }
        return true;
    },

    /*
     *  Initializes the spots
     */
    _initSpots: function() {
        var spotDataNum = this.spotData !== null ? this.spotData.length : 0,
            spotIndex,
            mapX, mapY,
            spotX, spotY,
            tileIdCurr,
            spotCurr;

        this.spots = new Array();

        spotDataNum = Math.min( spotDataNum, this.gridColumns * this.gridRows );
        spotIndex = 0;
        mapX = 0;
        mapY = 0;
        for( spotY = 0; spotY < this.gridRows; spotY++ ) {
            mapX = 0;

            for( spotX = 0; spotX < this.gridColumns; spotX++ ) {
                // Create the node
                tileIdCurr = spotIndex < spotDataNum ? this.spotData[spotIndex] : null;
                spotCurr = new this.spotClass( spotX, spotY, spotIndex, new Kinetic.BoundsRect(mapX, mapY, this.spotWidth, this.spotHeight), this.tileSet, tileIdCurr );
                this.spots.push( spotCurr );

                mapX += this.spotWidth;
                spotIndex++;
            }

            mapY += this.spotHeight;
        }
    },

    /**
     * calculates the untransformed local bounds for the node
     * @returns {Kinetic.BoundsRect}
     */
    _calcNodeBoundsLocalUntransformed: function() {
        return( this.bounds );
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.TileMap, Kinetic.Shape);
