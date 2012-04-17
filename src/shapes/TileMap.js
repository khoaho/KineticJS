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
 * @config {Function}           spotClass           The map spot container class. Must be Kinetic.TileMap.Spot or
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
    this.spotClass = Kinetic.TileMap.Spot;
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
     *  Converts a local position to grid position
     *  @param {Number}    posX
     *  @param {Number}    posY
     *
     *  @returns {Object} gridPos
     *
     *  @tilePos {Number} x
     *  @tilePos {Number} y
     */
    localPosToGridPos: function( posX, posY ) {
        var gridPos =
        {
            x: Math.floor( posX / this.spotWidth ),
            y: Math.floor( posY / this.spotHeight )
        };

        return( gridPos );
    },
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

/**
 * Tilemap spot child class constructor
 *
 * @constructor
 * @param {Number}              gridCol             The grid column
 * @param {Number}              gridRow             The grid row
 * @param {Number}              spotIndex           The spot index
 * @param {Kinetic.BoundsRect}  mapBounds           The grid map bounds
 * @param {Kinetic.TileSet}     tileset             The tile set to use
 * @param {Number}              [tileId]            The tile ID.
 */
Kinetic.TileMap.Spot = function( gridCol, gridRow, spotIndex, mapBounds, tileset, tileId  ) {
    this.gridCol        = gridCol;
    this.gridRow        = gridRow;
    this.spotIndex      = spotIndex;
    this.mapBounds      = mapBounds;
    this.tileId         = null;
    this.tileset        = tileset;

    this.tileInfo       = null;
    this.drawPos        = undefined;

    this.setTile( tileId );
};


/*
 * Calculates the map tile spot overlap info
 * @param  {Number}     tileSetTileWidth
 * @param  {Number}     tileSetTileHeight
 * @param  {Number}     spotWidth
 * @param  {Number}     spotHeight
 * @returns {Object} The overlap information is available
 */
Kinetic.TileMap.Spot.getSpotOverlap = function(tileSetTileWidth, tileSetTileHeight, spotWidth, spotHeight) {
    var overlapHorz, overlapTop;

    overlapHorz = Math.ceil( Math.max(0, ( tileSetTileWidth - spotWidth ) * 0.5) / spotWidth );
    overlapTop = Math.ceil( Math.max(0, ( tileSetTileHeight - spotHeight )) / spotHeight );

    return( {
        left: overlapHorz,
        right: overlapHorz,
        top: overlapTop,
        bottom: 0
    } );
};

Kinetic.TileMap.Spot.prototype = {
    /*
     * Set the tile
     * @param {Number}              tileId      The tile ID
     * @param {Kinetic.TileInfo}    [tileInfo]  The tile information to apply. Can be null...
     */
    setTile: function( tileId )
    {
        if( tileId === undefined )
            tileId = null;

        this.tileId = tileId;

        if( tileId !== null )
            this.tileInfo = this.tileset.getTile( tileId );

        this.drawPos = undefined;
    },

    /*
     * Set the tile set
     * @param {Kinetic.TileSet}     tileset           The tile set to use
     */
    setTileset: function( tileset )
    {
        this.tileset = tileset;
        this.setTile( this.tileId );
    },

    /*
     * Draws the tile in the specified context
     * @param {CanvasRenderingContext2D} drawCtx
     */
    draw: function( drawCtx ) {
        var tileInfo = this.tileInfo,
            drawPos,
            width, height;

        if( tileInfo === null )
            return;

        // Time to calculate the deferred draw position?
        if( this.drawPos === undefined ) {
            this.drawPos = {
                x: this.mapBounds.x + ((tileInfo.width - this.mapBounds.width) * -0.5),
                y: this.mapBounds.y - (tileInfo.height - this.mapBounds.height)
            }
        }

        drawPos = this.drawPos;
        width = tileInfo.width;
        height = tileInfo.height;
        drawCtx.drawImage( tileInfo.image, tileInfo.offsetX, tileInfo.offsetY, width, height, drawPos.x, drawPos.y, width, height );
    },

    /*
     * Returns the tile map bounds
     * @returns {Kinetic.BoundsRect}
     */
    getBounds: function()
    {
        return( this.mapBounds );
    },

    /*
     * Returns the grid coords
     * @returns {Object}    grid coordinates {x, y}
     */
    getGridCoords: function()
    {
        return( {x: this.gridCol, y: this.gridRow} );
    },

    /*
     * Returns the spot index
     * @returns {Number}
     */
    getIndex: function()
    {
        return( this.spotIndex );
    }
};
