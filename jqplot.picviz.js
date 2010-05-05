/**
 * Copyright (c) 2010 Adam Etienne
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * The author would appreciate an email letting him know of any substantial
 * use of jqPlot.  You can reach the author at: chris dot leonello at gmail 
 * dot com or see http://www.jqplot.com/info.php .  This is, of course, 
 * not required.
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 */
    
(function($) {
    // Class: $.jqplot.PicVizRenderer
    // The default line renderer for jqPlot, this class has no options beyond the <Series> class.
    // Draws series as a line.
    $.jqplot.PicVizRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    // called with scope of series.
    $.jqplot.PicVizRenderer.prototype.init = function(options) {
        $.extend(true, this.renderer, options);
        // set the shape renderer options
        var opts = {lineJoin:'round', lineCap:'round', fill:this.fill, isarc:false, strokeStyle:this.color, fillStyle:this.fillColor, lineWidth:this.lineWidth, closePath:this.fill};
        this.renderer.shapeRenderer.init(opts);
    };
    
    // Method: setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.PicVizRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        var pdata = this._prevPlotData;
        this.gridData = [];
        this._prevGridData = [];
        for (var i=0; i<this.data.length; i++) {
            if (data[i] != null) {
                this.gridData.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
            }
            if (pdata[i] != null) {
                this._prevGridData.push([xp.call(this._xaxis, pdata[i][0]), yp.call(this._yaxis, pdata[i][1])]);
            }
        }
    };
    
    // Method: makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // PicVizRenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.PicVizRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gd = [];
        var pgd = [];
        for (var i=0; i<data.length; i++) {
            if (data[i] != null) {
                //$("#debug").append("final:"+data[i][2]+"<br>");
                gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
            }
        }
        return gd;
    };
    

    // called within scope of series.
    $.jqplot.PicVizRenderer.prototype.draw = function(ctx, gd, options) {
        var i;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var fillAndStroke = (opts.fillAndStroke != undefined) ? opts.fillAndStroke : this.fillAndStroke;
        ctx.save();
        if (gd.length) {
            if (showLine) {
		if (shadow) {
		    this.renderer.shadowRenderer.draw(ctx, gd, opts);
		}
		var j=gd[0][0];
		var step = gd[1][0] - gd[0][0];
		var shopt = {fill:false, isarc:false, strokeStyle:'#000000', fillStyle:'#000000', lineWidth:1, closePath:true};
		var miny = 0;
		var maxy = this._plotDimensions.height;
		for (var i=0; i<gd.length; i++) {
			this.renderer.shapeRenderer.draw(ctx, [[j,miny],[j,maxy]], shopt);
			j+=step;
		}
		this.renderer.shapeRenderer.draw(ctx, gd, opts);
            }
        }
        
        ctx.restore();
    };  
    






    $.jqplot.PicVizAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.PicVizAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.PicVizAxisRenderer.prototype.constructor = $.jqplot.PicVizAxisRenderer;
        
    
    // There are no traditional axes on a pie chart.  We just need to provide
    // dummy objects with properties so the plot will render.
    // called with scope of axis object.
    $.jqplot.PicVizAxisRenderer.prototype.init = function(options){
        $.jqplot.LinearAxisRenderer.prototype.init.call(this);
        this.tickRenderer = $.jqplot.PicVizTickRenderer;
        //$.extend(true, this, options);
        /*
        this._dataBounds = {min:0, max:100};
        this.min = 0;
        this.max = 100;
        this.ticks = [];
        this.show = false;
        this.showTicks = false;
        */
        this.numberTicks = 3; //len(this._series);
        this.showMark = false;
    };



    
    $.jqplot.PicVizLegendRenderer = function() {
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.PicVizLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.PicVizLegendRenderer.prototype.constructor = $.jqplot.PicVizLegendRenderer;
    
    // called with context of legend
    $.jqplot.PicVizLegendRenderer.prototype.draw = function() {
this.show = false;
        var legend = this;
        if (this.show) {
            var series = this._series;
            // make a table.  one line label per row.
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            this._elem = $('<table class="jqplot-table-legend" style="'+ss+'"></table>');
        
            var pad = false;
            var s = series[0];
            var colorGenerator = new s.colorGenerator(s.seriesColors);
            if (s.show) {
                var pd = s.data;
                for (var i=0; i<pd.length; i++){
                    var lt = pd[i][0].toString();
                    if (lt) {
                        this.renderer.addrow.call(this, lt, colorGenerator.next(), pad);
                        pad = true;
                    }  
                }
            }
        }        
        return this._elem;

    };
    





    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        data = data || {};
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.axes = options.axes || {};
        options.axes.xaxis = options.axes.xaxis || {};
        options.axes.yaxis = options.axes.yaxis || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a pie series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.PicVizRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.PicVizRenderer) {
                    setopts = true;
                }
            }
        }

        if (setopts) {
            options.axes.xaxis.renderer = $.jqplot.CategoryAxisRenderer;
            options.axes.yaxis.renderer = $.jqplot.LinearAxisRenderer;
            options.axes.yaxis.showTicks = false;
            options.axes.yaxis.numberTicks = 0;
            options.axes.yaxis.min = 0;
            options.axes.yaxis.max = 1000;
            options.legend.renderer = $.jqplot.PicVizLegendRenderer;
            //options.legend.preDraw = true;
        }
    }

    // called with scope of plot
    function postParseOptions(options) {
        var indices = {};
        var minmax = {};
        // Convert string to values and get min/max
        for (var i=0; i<this.series.length; i++) {
            for (var di=0; di<this.series[i].data.length; di++) {
                var v = this.series[i].data[di][1];
                this.series[i].data[di][2] = v;
                if( is_string( v ) ) {
                    //$("#debug").append("before:"+di+" == "+v+"<br>");
                    if( indices[di]==null ) indices[di] = [];
                    var vnotin=true;
                    for( var vi=0; vi<indices[di].length; vi++ ) {
                        vv = indices[di][vi];
                        //$("#debug").append("chk vv:"+vv+" v:"+v+"<br>");
                        if( vv==v ) vnotin=false;
                    }
                    if( vnotin ) {
                        //$("#debug").append("push:"+v+"<br>");
                        indices[di].push( v );
                    }
                    for( var vi=0; vi<indices[di].length; vi++ ) {
                        vv = indices[di][vi];
                        //$("#debug").append("vv:"+vv+"<br>");
                    }
                    this.series[i].data[di][1] = indices[di].length;
                } else {
                    this.series[i].data[di][1] = parseInt(this.series[i].data[di][1]);
		}

                // Update min/max
                if( minmax[di]==null ) minmax[di] = [99999999,0];
                if( this.series[i].data[di][1]<minmax[di][0] ) minmax[di][0] = this.series[i].data[di][1];
                if( this.series[i].data[di][1]>minmax[di][1] ) minmax[di][1] = this.series[i].data[di][1];
                //$("#debug").append("minmax:"+minmax[di][0]+" == "+minmax[di][1]+"<br>");
            }
        }
        for (var i=0; i<this.series.length; i++) {
            // Apply the normalization with min/max values
            for (var di=0; di<this.series[i].data.length; di++) {
                this.series[i].data[di][1] = ((this.series[i].data[di][1]-minmax[di][0])/(minmax[di][1]-minmax[di][0]))*980+10;
            }
            this.series[i].seriesColors = this.seriesColors;
            this.series[i].colorGenerator = this.colorGenerator;
        }
    }


    $.jqplot.PicVizRenderer.prototype.drawShadow = function(ctx, gd, options) {
        // This is a no-op, shadows drawn with lines.
    };
    
    $.jqplot.preInitHooks.push(preInit);
    $.jqplot.postParseOptionsHooks.push(postParseOptions);
    
    $.jqplot.PicVizTickRenderer = function() {
        $.jqplot.AxisTickRenderer.call(this);
    };
    
    $.jqplot.PicVizTickRenderer.prototype = new $.jqplot.AxisTickRenderer();
    $.jqplot.PicVizTickRenderer.prototype.constructor = $.jqplot.PicVizTickRenderer;
    
})(jQuery);

