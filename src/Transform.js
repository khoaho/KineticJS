/* 
 * Transform class
 *
 * Here's the picture of the transformation
 *
 * -           -
 * | m0  m2 m4 |
 * | m1  m3 m5 |
 * | 0   0  1  |
 * -           -
 * Copyright 2012 Wappworks Studios
 * All rights reserved.
 */

// Based on Transform code by Simon Sarris (www.simonsarris.com)
// Simple class for keeping track of the current transformation matrix

/**
 * @constructor
 * @param {Kinetic.Transform} [src]
 */
Kinetic.Transform = function( src ) {
	if( src instanceof Kinetic.Transform )
		this.m = src.m.slice(0);
	else
		this.reset();
};

var p = Kinetic.Transform.prototype;

/**
 * Clone transform
 * @returns {Kinetic.Transform}
 */
p.clone = function() {
	return( new Kinetic.Transform( this ) );
};

/**
 * Reset the transform to identity
 */
p.reset = function() {
  this.m = [1,0,0,1,0,0];
};

/**
 * Transform multiplication
 * @param {Kinetic.Transform} matrix
 */
p.multiply = function(matrix) {
  var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
  var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

  var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
  var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

  var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
  var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

  this.m[0] = m11;
  this.m[1] = m12;
  this.m[2] = m21;
  this.m[3] = m22;
  this.m[4] = dx;
  this.m[5] = dy;

  return this;
};

/**
 * Inverts the transform
 */
p.invert = function() {
  var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
  var m0 = this.m[3] * d;
  var m1 = -this.m[1] * d;
  var m2 = -this.m[2] * d;
  var m3 = this.m[0] * d;
  var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
  var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
  this.m[0] = m0;
  this.m[1] = m1;
  this.m[2] = m2;
  this.m[3] = m3;
  this.m[4] = m4;
  this.m[5] = m5;

  return this;
};

/**
 * Apply rotation
 * @param {Number} rad  Angle in radians
 */
p.rotate = function(rad) {
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var m11 = this.m[0] * c + this.m[2] * s;
  var m12 = this.m[1] * c + this.m[3] * s;
  var m21 = this.m[0] * -s + this.m[2] * c;
  var m22 = this.m[1] * -s + this.m[3] * c;
  this.m[0] = m11;
  this.m[1] = m12;
  this.m[2] = m21;
  this.m[3] = m22;
  return this;
};

/**
 * Apply translation
 * @param {Number} x
 * @param {Number} y
 */
p.translate = function(x, y) {
  this.m[4] += this.m[0] * x + this.m[2] * y;
  this.m[5] += this.m[1] * x + this.m[3] * y;

  return this;
};

/**
 * Apply scale
 * @param {Number} sx
 * @param {Number} sy
 */
p.scale = function(sx, sy) {
  this.m[0] *= sx;
  this.m[1] *= sx;
  this.m[2] *= sy;
  this.m[3] *= sy;

  return this;
};

/**
 * Transform a point
 * @param {Number} px
 * @param {Number} py
 * @returns {Object} 2D point(x, y)
 */
p.transformPoint = function(px, py) {
  var x = px;
  var y = py;
  px = x * this.m[0] + y * this.m[2] + this.m[4];
  py = x * this.m[1] + y * this.m[3] + this.m[5];
  return { x:px, y:py };
};

/**
 * Returns the translation
 * @returns {Object} 2D point(x, y)
 */
p.getTranslation = function() {
    return { x:this.m[4], y:this.m[5] };
};

/**
 * Determines if the transform has rotation
 * @returns {Boolean} true if it has rotation. false otherwise
 */
p.hasRotation = function() {
    return( this.m[1] != 0 );
};

