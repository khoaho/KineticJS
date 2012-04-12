///////////////////////////////////////////////////////////////////////
//  Tile set
///////////////////////////////////////////////////////////////////////
/**
 * Tileset constructor
 *
 * NOTE: The tileset configuration information is compatible with Tiled tileset definition
 * @constructor
 * @param {Object|Object[]}  [config]      Spritesheet(s) configuration. See addSpriteSheet() for configuration format.
 */
Kinetic.TileSet = function( config ) {
    this.images = new Array();
    this.tiles = new Array();
    this.tileWidthMax = 0;
    this.tileHeightMax = 0;

    if( config !== undefined )
    {
        if( config instanceof Array ) {
            this.addSpriteSheets( config );
        } else {
            this.addSpriteSheet( config );
        }
    }
};

Kinetic.TileSet.prototype = {

    /*
     * Adds multiple sprite sheets to the tileset
     * @param {Object[]} config         See addSpriteSheet() for the configuration definition
     */
    addSpriteSheets: function( config ) {
        var spriteSheetsNum = config.length,
            index;

        for( index = 0; index < spriteSheetsNum; index++ ) {
            this.addSpriteSheet( config[index] );
        }
    },

    /*
     * Adds a sprite sheet to the tileset
     * @param {Object} config
     *
     * @config {Number}         firstgid            Tile ID start
     * @config {String|Image}   image               Image or image URL to use
     * @config {Number}         imagewidth          Image width
     * @config {Number}         imageheight         Image height
     * @config {Number}         tilewidth           Tile width
     * @config {Number}         tileheight          Tile height
     * @config {Number}         [tilesnum]          Number of tiles in the spritesheet
     * @config {Object}         [tileproperties]    Tile properties map with the key being each tile's index
     */
    addSpriteSheet: function( config )
    {
        var imageRes,
            tilesPerRow, tilesPerCol,
            tilesNum,
            tilePropsMap,
            tileIdCurr,
            tileProps,
            indexX, indexY, tileIndex,
            texCurrX, texCurrY;

        // Add the texture to the list (if applicable)...
        if( config.image instanceof Image ) {
            imageRes = config.image;
        } else {
            imageRes = new Image();
            imageRes.src = config.image;
        }

        this.images.push( imageRes );
        this.tileWidthMax = Math.max( this.tileWidthMax, config.tilewidth );
        this.tileHeightMax = Math.max( this.tileHeightMax, config.tileheight );

        // TODO: Add support for margin and spacing information
        tilesPerRow = Math.floor( config.imagewidth / config.tilewidth );
        tilesPerCol = Math.floor( config.imageheight / config.tileheight );
        tilesNum = tilesPerRow * tilesPerCol;
        if( config.tilesnum !== undefined ) {
            tilesNum = Math.min( tilesNum, config.tilesnum );
        }

        // When processing tiles, go left to right, then top to bottom...
        tilePropsMap = config.tileproperties;
        tileIdCurr = config.firstgid;
        tileIndex = 0;
        texCurrY = 0;
        for( indexY = 0; indexY < tilesPerCol; indexY++ )
        {
            texCurrX = 0;

            if( tileIndex >= tilesNum )
                break;

            for( indexX = 0; indexX < tilesPerRow; indexX++ )
            {
                if( tileIndex >= tilesNum )
                    break;

                tileProps = null;
                if( tilePropsMap != null )
                {
                    if( tilePropsMap.hasOwnProperty(tileIndex) )
                        tileProps = tilePropsMap[tileIndex];
                }
                this.tiles[ tileIdCurr ] = new Kinetic.TileInfo( imageRes, texCurrX, texCurrY, config.tilewidth, config.tileheight, tileProps );
                tileIdCurr++;

                texCurrX += config.tilewidth;
                tileIndex++;
            }

            texCurrY += config.tileheight;
        }
    },

    /*
     * Returns the requested tile info
     * @param {Number} tileId
     * @returns {Kinetic.TileInfo}  The requested tile. null otherwise
     */
    getTile: function( tileId ) {
        var tileCurr = this.tiles[ tileId ];
        if( !(tileCurr instanceof Kinetic.TileInfo) )
            return( null );

        return( tileCurr );
    },

    /*
     * Returns the list of images
     * @returns {Image[]}
     */
    getImages: function() {
        return( this.images );
    },

    /*
     * Returns the maximum tile size
     * @returns {Object}  The maximum tile size {x, y}
     */
    getTileSizeMax: function() {
        return { x: this.tileWidthMax, y: this.tileHeightMax };
    }
};
