<!DOCTYPE html> 
<html lang="en"> 
	<head> 
		<meta http-equiv="content-type" content="text/html; charset=utf-8"> 
		<title>Test 3</title> 
		
		<!--[if IE]><script language="javascript" type="text/javascript" src="../excanvas.js"></script><![endif]--> 
		  
		<link rel="stylesheet" type="text/css" href="jqplot/jquery.jqplot.css" /> 
		
		<!-- BEGIN: load jquery --> 
		<script language="javascript" type="text/javascript" src="jqplot/jquery-1.3.2.min.js"></script> 
		<script language="javascript" type="text/javascript" src="libpgdl.js"></script> 
		<!-- END: load jquery --> 
		
		<!-- BEGIN: load jqplot --> 
		<script language="javascript" type="text/javascript" src="jqplot/jquery.jqplot.js"></script> 
		<script language="javascript" type="text/javascript" src="jqplot/plugins/jqplot.categoryAxisRenderer.js"></script>
		<script language="javascript" type="text/javascript" src="jqplot.picviz.js"></script>
		<!-- END: load jqplot --> 
 
	<script type="text/javascript" language="javascript"> 
function is_string(v) {
	return parseInt(v)==v?false:true;
        //return (typeof( v ) == 'string');
}


	  
	$(document).ready(function(){
	    data = [[2,14,9], [7,2,12], [8,5,1], [4,40,6]];
	    data = [[2,"china",90], [7,"france",120], [8,"china",500], [4,"canada",60], [14,"france",160]];
	    //data2 = [[["distance",2],["price",14],["size",9]], [["distance",7],["price",2],["size",12]], [["distance",8],["price",5],["size",1]]];

	    $.jqplot('chart', data, {
	      legend:{show:true},
	      seriesDefaults:{renderer:$.jqplot.PicVizRenderer, showLabel:false},
	      axes:{xaxis:{ticks:["distance","country","size"]}},
	      grid:{drawGridLines:false}
	    });

	});
function updatePlot( e ) {
	var pgdl = parsePgdl( e );
	var data = [];
	for( l in pgdl.data ) {
		line = pgdl.data[l];
		var lineplot = [];
		for( d in line ) {
			v = line[d];
			lineplot.push( v );
			//$("#debug").append("DATA:"+d+":"+v+"<br>");
		}
		data.push( lineplot );
	}
	var ticks = [];
	for( a in pgdl.axes ) {
		ticks.push( pgdl.axes[a].label );
	}
	//data = [[2,"china",90], [7,"france",120], [8,"china",500], [4,"canada",60], [14,"france",160]];

	$.jqplot('chart', data, {
		legend:{show:true},
		seriesDefaults:{renderer:$.jqplot.PicVizRenderer, showLabel:false},
		axes:{xaxis:{ticks:ticks}},
		grid:{drawGridLines:false}
	}).redraw();
}
	</script> 
 
	</head> 
	<body> 
    <div id="chart" style="margin-top:20px; margin-left:20px; width:600px; height:440px;"></div> 
    <div id="debug"></div> 
 <textarea rows="10" cols="50" id="pgdl">

 header {
# Warning! fake data, this graph is here just to show some features and vocabulary.
	title="Finding a cheap appartment";
    logo = "logo.png";
    logo.x = "10";
    logo.y = "20";
	height="500";
}
axes {
	char distance [label="Distance"];
	b12 price [label="Price"];
	char size [label="Size"];	
}
data {
    distance="0", price="4080", size="200" [color="red"];
    distance="0", price="4000", size="190" [color="red"];
    distance="1", price="4100", size="250" [color="red"];
    distance="1", price="3800", size="180" [color="red"];
    distance="1", price="2000", size="35" [color="red"];
    distance="2", price="3900", size="200" [color="red"];
    distance="2", price="3900", size="200" [color="red"];
    distance="2", price="3900", size="200" [color="red"];
    distance="2", price="4000", size="255" [color="red"];
    distance="2", price="2000", size="140" [color="red"];
    distance="3", price="3000", size="100" [color="red"];
    distance="3", price="3400", size="150" [color="red"];
    distance="4", price="4100", size="250" [color="red"];
    distance="5", price="3900", size="200" [color="red"];
    distance="5", price="3450", size="180" [color="red"];
    distance="106", price="2000", size="90" [color="blue"];
    distance="108", price="700", size="30" [color="blue"];
    distance="110", price="1000", size="40" [color="blue"];
    distance="110", price="1500", size="55" [color="blue"];
    distance="110", price="600", size="20" [color="blue"];
    distance="110", price="1000", size="60" [color="blue"];
    distance="110", price="3900", size="200" [color="blue"];
    distance="110", price="1000", size="40" [color="blue"];
    distance="110", price="1000", size="80" [color="blue"];
    distance="112", price="950", size="35" [color="blue"];
    distance="112", price="1200", size="42" [color="blue"];
    distance="113", price="4000", size="255" [color="blue"];
    distance="114", price="1300", size="120" [color="blue"];
    distance="118", price="1900", size="180" [color="blue"];
    distance="119", price="730", size="50" [color="blue"];
    distance="221", price="1000", size="100" [color="green"];
    distance="224", price="3000", size="255" [color="green"];
    distance="225", price="300", size="20" [color="green"];
    distance="227", price="200", size="15" [color="green"];
    distance="232", price="2000", size="140" [color="green"];
    distance="234", price="1000", size="120" [color="green"];
    distance="235", price="600", size="70" [color="green"];
    distance="236", price="500", size="50" [color="green"];
    distance="238", price="300", size="30" [color="green"];
    distance="238", price="400", size="30" [color="green"];
    distance="242", price="600", size="80" [color="green"];
    distance="242", price="650", size="75" [color="green"];
    distance="244", price="460", size="50" [color="green"];
    distance="5", price="500", size="60" [color="green"];

}
 </textarea>
<button onclick="updatePlot($('#pgdl'))">Parse</button>
	</body> 
</html>
