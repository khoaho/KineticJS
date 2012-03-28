///////////////////////////////////////////////////////////////////////
//  Text
///////////////////////////////////////////////////////////////////////
/**
 * Multi-line text constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.TextMultiline = function(config) {
    /*
     * defaults
     */
    if(config.align === undefined) {
        config.align = "left";
    }
    if(config.verticalAlign === undefined) {
        config.verticalAlign = "top";
    }
    if(config.padding === undefined) {
        config.padding = 0;
    }

    config.drawFunc = function() {
        var context = this.getContext();
        var fontDesc = this.fontSize + "px";
        if( this.fontWeight !== undefined )
            fontDesc = this.fontWeight + " " + fontDesc;
        if( this.fontFamily !== undefined )
            fontDesc += " " + this.fontFamily;

        context.font = fontDesc;
        context.textBaseline = "middle";

        // Break the text into lines if it hasn't been done yet...
        if( this.lines === undefined )
        {
            this.lines = this.text.split( "\n" );
        }

        var linesNum = this.lines.length;
        var lineHeight = this.fontSize;
        var textBlockHeight = lineHeight * linesNum;
        var p = this.padding;
        var y = 0;

        switch (this.verticalAlign) {
            case "middle":
                y = textBlockHeight / -2 - p;
                break;
            case "bottom":
                y = -1 * textBlockHeight - p;
                break;
        }

        if(this.fill !== undefined) {
            context.fillStyle = this.fill;
        }
        if(this.stroke !== undefined || this.strokeWidth !== undefined) {
            // defaults
            if(this.stroke === undefined) {
                this.stroke = "black";
            } else if(this.strokeWidth === undefined) {
                this.strokeWidth = 2;
            }

            context.lineWidth = this.strokeWidth;
            context.strokeStyle = this.stroke;
        }

        for( var lineIndex = 0; lineIndex < linesNum; lineIndex++ )
        {
            this._drawTextLine( context, this.lines[lineIndex], y );
            y += lineHeight;
        }
    };

    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Text methods
 */
Kinetic.TextMultiline.prototype = {
    /**
     * set font family
     * @param {String} fontFamily
     */
    setFontFamily: function(fontFamily) {
        this.fontFamily = fontFamily;
    },
    /**
     * get font family
     */
    getFontFamily: function() {
        return this.fontFamily;
    },
    /**
     * set font size
     * @param {int} fontSize
     */
    setFontSize: function(fontSize) {
        this.fontSize = fontSize;
    },
    /**
     * get font size
     */
    getFontSize: function() {
        return this.fontSize;
    },
    /**
     * set font weight
     * @param {int} fontWeight
     */
    setFontWeight: function(fontWeight) {
        this.fontWeight = fontWeight;
    },
    /**
     * get font weight
     */
    getFontWeight: function() {
        return this.fontWeight;
    },
    /**
     * set padding
     * @param {int} padding
     */
    setPadding: function(padding) {
        this.padding = padding;
    },
    /**
     * get padding
     */
    getPadding: function() {
        return this.padding;
    },
    /**
     * set horizontal align of text
     * @param {String} align align can be "left", "center", or "right"
     */
    setAlign: function(align) {
        this.align = align;
    },
    /**
     * get horizontal align
     */
    getAlign: function() {
        return this.align;
    },
    /**
     * set vertical align of text
     * @param {String} verticalAlign verticalAlign can be "top", "middle", or "bottom"
     */
    setVerticalAlign: function(verticalAlign) {
        this.verticalAlign = verticalAlign;
    },
    /**
     * get vertical align
     */
    getVerticalAlign: function() {
        return this.verticalAlign;
    },
    /**
     * set text
     * @param {String} text
     */
    setText: function(text) {
        this.text = text;
        this.lines = undefined;
    },
    /**
     * get text
     */
    getText: function() {
        return this.text;
    },

    /**
     * draw a line of text
     *
     * @param {CanvasRenderingContext2D} context
     * @param {String} textCurr
     * @param {Number} y
     *
     */
    _drawTextLine: function( context, textCurr, y )
    {
        var metrics = context.measureText(textCurr);
        var textHeight = this.fontSize;
        var textWidth = metrics.width;
        var p = this.padding;
        var x = 0;

        switch (this.align) {
            case "center":
                x = textWidth / -2 - p;
                break;
            case "right":
                x = -1 * textWidth - p;
                break;
        }

        // draw path
        /*
        TODO: Implement detection elsewhere
        if( isDetectMode )
        {
            context.beginPath();
            context.rect(x, y, textWidth + p * 2, textHeight + p * 2);
            context.closePath();
            this.fillStroke();
            return;
        }
        */
        var tx = p + x;
        var ty = textHeight / 2 + p + y;

        // draw text
        if(this.fill !== undefined) {
            context.fillText(textCurr, tx, ty);
        }
        if(this.stroke !== undefined || this.strokeWidth !== undefined) {
            context.strokeText(textCurr, tx, ty);
        }
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.TextMultiline, Kinetic.Shape);