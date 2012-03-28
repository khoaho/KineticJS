///////////////////////////////////////////////////////////////////////
//  Text
///////////////////////////////////////////////////////////////////////
/**
 * Text constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Text = function(config) {
    /*
     * defaults
     */
    if(config.align === undefined) {
        config.align = 'left';
    }
    if(config.verticalAlign === undefined) {
        config.verticalAlign = 'top';
    }
    if(config.padding === undefined) {
        config.padding = 0;
    }

    config.drawFunc = function() {
        var context = this.getContext();
        var fontDesc = "";
        if( this.fontWeight !== undefined )
            fontDesc += this.fontWeight + " ";
        if( this.fontSize !== undefined )
            fontDesc += this.fontSize + "px ";
        if( this.fontFamily !== undefined )
            fontDesc += this.fontFamily;

        context.font = fontDesc;
        context.textBaseline = "middle";
        var metrics = context.measureText(this.text);
        var textHeight = this.fontSize;
        var textWidth = metrics.width;
        var p = this.padding;
        var x = 0;
        var y = 0;

        switch (this.align) {
            case 'center':
                x = textWidth / -2 - p;
                break;
            case 'right':
                x = -1 * textWidth - p;
                break;
        }

        switch (this.verticalAlign) {
            case 'middle':
                y = textHeight / -2 - p;
                break;
            case 'bottom':
                y = -1 * textHeight - p;
                break;
        }

        // draw path
        context.save();
        context.beginPath();
        context.rect(x, y, textWidth + p * 2, textHeight + p * 2);
        context.closePath();
        this.fillStroke();
        context.restore();

        var tx = p + x;
        var ty = textHeight / 2 + p + y;

        // draw text
        if(this.fill !== undefined) {
            context.fillStyle = this.fill;
            context.fillText(this.text, tx, ty);
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
            context.strokeText(this.text, tx, ty);
        }
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Text methods
 */
Kinetic.Text.prototype = {
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
     * @param {String} align align can be 'left', 'center', or 'right'
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
    },
    /**
     * get text
     */
    getText: function() {
        return this.text;
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Text, Kinetic.Shape);
