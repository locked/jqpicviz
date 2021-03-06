/**
 * Copyright (c) 2010 Adam Etienne
 * jqPlot picviz plugin is currently available for use in all personal or commercial projects 
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
                gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
            }
        }
        return gd;
    };
    

    // called within scope of series.
    $.jqplot.PicVizRenderer.prototype.draw = function(ctx, gd, options) {
        //var i;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var fillAndStroke = (opts.fillAndStroke != undefined) ? opts.fillAndStroke : this.fillAndStroke;
        ctx.save();
        if (gd.length) {
            if (showLine) {
		/*
                Shadow is for dush. Plus it is slow and sometime seams buggy
                if (shadow) {
		    this.renderer.shadowRenderer.draw(ctx, gd, opts);
		}*/
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
        this.show = false;  // Disable the legend
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
        //options.shadow = false;
        if (setopts) {
            options.axes.xaxis.renderer = $.jqplot.CategoryAxisRenderer;
            options.axes.yaxis.renderer = $.jqplot.LinearAxisRenderer;
            options.axes.yaxis.showTicks = true; //false;
            options.axes.yaxis.numberTicks = 2; //0;
            options.axes.yaxis.min = 0;
            options.axes.yaxis.max = 1000;
            options.legend.renderer = $.jqplot.PicVizLegendRenderer;
        }
    }

function type_of_axes( type ) {
	switch( type ) {
	case "timeline":
		return "time";
	break;
	case "enum":
	case "ipv4":
	case "ipv6":
	case "string":
		return "string";
	break;
	case "integer":
		return "integer";
	break;
	default:
		return "string";
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
		//$("#debug").append( "postParseOptions VAL:"+v+"<br>" );
                if( type_of_axes( options.data_types[di] )=="string" ) {
                    // String values, we use an 'indices' array to get the value
                    if( indices[di]==null ) indices[di] = [];
                    var vnotin=true;
                    for( var vi=0; vi<indices[di].length; vi++ ) {
                        vv = indices[di][vi];
                        if( vv==v ) {
                            vnotin=false;
                            this.series[i].data[di][1] = vi+1;            // The value is known, use the indice
                        }
                    }
                    if( vnotin ) {
                        indices[di].push( v );
                        this.series[i].data[di][1] = indices[di].length;  // The value is new, increment
                    }
                    for( var vi=0; vi<indices[di].length; vi++ ) {
                        vv = indices[di][vi];
                    }
                } else if( type_of_axes( options.data_types[di] )=="time" ) {
                    // Time values: convert it to unixtime to have the scale
                    t = new Date(v);
                    this.series[i].data[di][1] = Math.floor(parseInt(t.getTime())/1000);
                } else {
                    // Integer
                    this.series[i].data[di][1] = parseInt(this.series[i].data[di][1]);
		}

                // Update min/max
                if( minmax[di]==null ) minmax[di] = [Number.MAX_VALUE,0];
                if( this.series[i].data[di][1]<minmax[di][0] ) minmax[di][0] = this.series[i].data[di][1];
                if( this.series[i].data[di][1]>minmax[di][1] ) minmax[di][1] = this.series[i].data[di][1];
                //if( type_of_axes( options.data_types[di] )=="time" )
                //    $("#debug").append("minmax:"+minmax[di][0]+" == "+minmax[di][1]+"<br>");
            }
        }
        for (var i=0; i<this.series.length; i++) {
            // Apply the normalization with min/max values
            for (var di=0; di<this.series[i].data.length; di++) {
                var v = this.series[i].data[di][1];
                if( type_of_axes( options.data_types[di] )=="string" ) {
                    // Loop for the indice
                    for( var ii=0; ii<indices[di].length; ii++ )
                        if( indices[di][ii]==this.series[i].data[di][2] ) break;
                    this.series[i].data[di][1] = (1000/(indices[di].length+1))*(ii+1);
                } else {
                    // Normalize the value
                    var div = minmax[di][1]-minmax[di][0];
                    div = div==0?div=1:div;
                    this.series[i].data[di][1] = ((this.series[i].data[di][1]-minmax[di][0])/(div))*980+10;
                }
                //$("#debug").append("oldv:"+v+" newv:"+this.series[i].data[di][1]+"minmax:"+minmax[di][0]+" == "+minmax[di][1]+"<br>");
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

