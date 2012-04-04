///////////////////////////////////////////////////////////////////////
//  Container
///////////////////////////////////////////////////////////////////////

/**
 * Container constructor.&nbsp; Containers are used to contain nodes or other containers
 * @constructor
 */
Kinetic.Container = function() {
    this.children = [];
    this.childrenNames = {};
    this.sortFn = null;
};
/*
 * Container methods
 */
Kinetic.Container.prototype = {
    /**
     * get children
     */
    getChildren: function() {
        return this.children;
    },
    /**
     * get child node by name
     * @param {String} name
     */
    getChild: function(name) {
        return this.childrenNames[name];
    },
    /**
     * remove all children
     */
    removeChildren: function() {
        while(this.children.length > 0) {
            this.remove(this.children[0]);
        }
    },
    /**
     * set the sort functionality to use when drawing the children.
     * @param {Function} sortFn     sortFn( node1:Kinetic.Node, node2:Kinetic.Node ):Number. Return -1 if node1 is
     *                              drawn before node2, 0 if no sorting required, 1 if node2 is drawn before node1
     */
    setDrawSortFunction: function( sortFn ) {
        this.sortFn = sortFn;
    },
    /**
     * remove child from container
     * @param {Kinetic.Node} child
     */
    _remove: function(child) {
        if(child.name !== undefined) {
            this.childrenNames[child.name] = undefined;
        }
        child.parent = undefined;
        this.children.splice(child.index, 1);
        this._setChildrenIndices();
    },
    /**
     * draw children
     */
    _drawChildren: function() {
        var children = this._getChildrenDrawList();
        if( typeof(this.sortFn) === "function" )
        {
            children = children.slice();
            children.sort( this.sortFn );
        }

        for(var n = 0; n < children.length; n++) {
            var child = children[n];
            if(child.className === 'Shape') {
                child._draw(child.getLayer(), false);
            } else {
                child._draw();
            }
        }
    },
    /**
     * add node to container
     * @param {Kinetic.Node} child
     */
    _add: function(child) {
        if(child.name) {
            this.childrenNames[child.name] = child;
        }
        child.id = Kinetic.GlobalObject.idCounter++;
        child.index = this.children.length;
        child.parent = this;

        this.children.push(child);
    },
    /**
     * set children indices
     */
    _setChildrenIndices: function() {
        /*
         * if reordering Layers, remove all canvas elements
         * from the container except the buffer and backstage canvases
         * and then readd all the layers
         */
        if(this.className === 'Stage') {
            var canvases = this.content.children;
            var bufferCanvas = canvases[0];
            var backstageCanvas = canvases[1];

            this.content.innerHTML = '';
            this.content.appendChild(bufferCanvas);
            this.content.appendChild(backstageCanvas);
        }

        for(var n = 0; n < this.children.length; n++) {
            this.children[n].index = n;

            if(this.className === 'Stage') {
                this.content.appendChild(this.children[n].canvas);
            }
        }
    },
    /**
     * get the list of children to draw
     */
    _getChildrenDrawList: function() {
        return this.children;
    }
};
