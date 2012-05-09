///////////////////////////////////////////////////////////////////////
//  Tile info
///////////////////////////////////////////////////////////////////////
/**
 * Tile info constructor
 *
 * @constructor
 * @param {Image}   image               The source tile image
 * @param {Number}  offsetX             The tile source start x-offset
 * @param {Number}  offsetY             The tile source start x-offset
 * @param {Number}  width               The tile source width
 * @param {Number}  height              The tile source height
 * @param {Object}  propsCustomSheet    The tile sheet custom properties
 * @param {Object}  propsCustomTile     Custom tile properties
 */
Kinetic.TileInfo = function( image, offsetX, offsetY, width, height, propsCustomSheet, propsCustomTile ) {
    this.image = image;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.width = width;
    this.height = height;
    this.propsCustomSheet = propsCustomSheet;
    this.propsCustomTile = propsCustomTile;
};

Kinetic.TileInfo.prototype =
{
    /**
     * Return a custom property
     *
     * @param {String}    propName
     *
     * @returns {Object}    Returns undefined if it's not defined.
     */
    getCustomProperty: function( propName )
    {
        if( this.propsCustomTile != null )
        {
            if( this.propsCustomTile.hasOwnProperty(propName) )
                return( this.propsCustomTile[propName] );
        }

        if( this.propsCustomSheet != null )
        {
            if( this.propsCustomSheet.hasOwnProperty(propName) )
                return( this.propsCustomSheet[propName] );
        }

        return( undefined );
    }
};