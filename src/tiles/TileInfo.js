///////////////////////////////////////////////////////////////////////
//  Tile info
///////////////////////////////////////////////////////////////////////
/**
 * Tile info constructor
 *
 * @constructor
 * @param {Image}   image           The source tile image
 * @param {Number}  offsetX         The tile source start x-offset
 * @param {Number}  offsetY         The tile source start x-offset
 * @param {Number}  width           The tile source width
 * @param {Number}  height          The tile source height
 */
Kinetic.TileInfo = function( image, offsetX, offsetY, width, height ) {
    this.image = image;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.width = width;
    this.height = height;
};