///////////////////////////////////////////////////////////////////////
//  TileMapSpot
///////////////////////////////////////////////////////////////////////
/**
 * Tilemap spot info constructor
 *
 * @constructor
 * @param {Number}              gridCol             The grid column
 * @param {Number}              gridRow             The grid row
 * @param {Number}              spotIndex           The spot index
 * @param {Kinetic.BoundsRect}  mapBounds           The grid map bounds
 * @param {Kinetic.TileSet}     tileset             The tile set to use
 * @param {Number}              [tileId]            The tile ID.
 */
Kinetic.TileMapSpot = function( gridCol, gridRow, spotIndex, mapBounds, tileset, tileId  ) {
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
Kinetic.TileMapSpot.getSpotOverlap = function(tileSetTileWidth, tileSetTileHeight, spotWidth, spotHeight) {
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

Kinetic.TileMapSpot.prototype = {
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