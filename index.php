<!DOCTYPE html> 
<html lang="en"> 
<head> 
	<meta http-equiv="content-type" content="text/html; charset=utf-8"> 
	<title>PicViz For The Web</title> 
	
	<!--[if IE]><script language="javascript" type="text/javascript" src="../excanvas.js"></script><![endif]--> 
	
	<link rel="stylesheet" type="text/css" href="jqplot/jquery.jqplot.css" /> 
	<link rel="stylesheet" type="text/css" href="all.css" /> 
	
	<!-- BEGIN: load jquery --> 
	<script language="javascript" type="text/javascript" src="jqplot/jquery-1.3.2.min.js"></script> 
	<script language="javascript" type="text/javascript" src="libpgdl.js"></script> 
	<!-- END: load jquery --> 
	
	<!-- BEGIN: load jqplot --> 
	<script language="javascript" type="text/javascript" src="jqplot/jquery.jqplot.js"></script> 
	<script language="javascript" type="text/javascript" src="jqplot/plugins/jqplot.categoryAxisRenderer.js"></script>

	<script type="text/javascript" src="jqplot/plugins/jqplot.dateAxisRenderer.min.js"></script>
	<script type="text/javascript" src="jqplot/plugins/jqplot.canvasTextRenderer.min.js"></script>
	<script type="text/javascript" src="jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js"></script>
	<script type="text/javascript" src="jqplot/plugins/jqplot.highlighter.js"></script>
	<script type="text/javascript" src="jqplot/plugins/jqplot.cursor.min.js"></script>

	<script language="javascript" type="text/javascript" src="jqplot.picviz.js"></script>
	<!-- END: load jqplot --> 

<script type="text/javascript" language="javascript">   
$(document).ready(function(){
	// Do nothing
});


function convertToPgdl( e ) {
	var logtype = $("#logtype").val();
	var data = e.val();
	$.post('convertPgdl.php', {'logtype':logtype, 'data':data}, function(pgdl_txt) {
		$('#pgdl').html(pgdl_txt);
		var pgdl = parsePgdl( $('#pgdl') );
		showLayers( pgdl );
		updatePlot( pgdl );
	});
}


function parseAndUpdatePlot( e ) {
	var pgdl = parsePgdl( e );
	updatePlot( pgdl );
}


function changeLayer( e ) {
	new_cl = [];
	var layers = getLayers( current_pgdl );
	for( l in layers ) {
		current_layer = current_layers[l];
		if( current_layer==e.value ) {
			//$("#debug").append("changeLayer current_layer:"+current_layer+" e.checked:"+e.checked+" e.value:"+e.value+"<br>");
			if( e.checked ) new_cl.push( current_layer );
		} else
			new_cl.push( current_layer );
	}
	current_layers = new_cl;
	updatePlot( current_pgdl );
}


function showLayers( pgdl ) {
	var layers = getLayers( pgdl );
	if( layers ) {
		$("#layers").html('');
		for( l in layers ) {
			//$("#debug").append("---- NEWLINE ---- layer:"+layers[l]+"<br>");
			$("#layers").append( "<input checked onchange='changeLayer(this)' type='checkbox' value='"+layers[l]+"' name='layer_"+layers[l]+"'>"+layers[l] );
		}
	}
}


var current_layers = null;
var current_pgdl = null;
function updatePlot( pgdl ) {
	current_pgdl = pgdl;
	var data = [];
	var layers = getLayers( pgdl );
	if( current_layers==null ) current_layers = layers;
	for( l in pgdl.data ) {
		line = pgdl.data[l];
		var lineplot = [];
		//$("#debug").append("---- NEWLINE ----<br>");
		for( a in pgdl.axes ) {
			vname = pgdl.axes[a]._name;
			v = line[vname];
			var show = false;
			for( la in current_layers ) {
				current_layer = current_layers[la];
				if( (current_layer=="unassociated" && !line.inlayer)
				 || (current_layer!="unassociated" && line.inlayer==current_layer) ) {
					show = true;
					break;
				}
			}
			//$("#debug").append("DATA: a:"+a+" vname:"+vname+" v:"+v+" inlayer:"+line.inlayer+"<br>");
			if( show )
				lineplot.push( v );
		}
		data.push( lineplot );
	}
	var ticks = [];
	var data_types = [];
	for( a in pgdl.axes ) {
		ticks.push( pgdl.axes[a].label );
		data_types.push( pgdl.axes[a]._type );
	}
	//data = [[2,"china",90], [7,"france",120], [8,"china",500], [4,"canada",60], [14,"france",160]];
	
	$.jqplot('chart', data, {
		legend:{show:true},
		seriesDefaults:{renderer:$.jqplot.PicVizRenderer, showLabel:false},
		axes:{xaxis:{ticks:ticks}},
		grid:{drawGridLines:false},
		data_types:data_types,
		highlighter: {yvalues: 2, sizeAdjust: 7.5, formatString:'<div style="display:none;">%s%s</div><table class="jqplot-highlighter"></tr><tr><td></td><td>%s</td></tr></table>'},
		cursor: {zoom:true, show: true, showTooltip:false, clickReset:true}
	}).redraw();
}
</script> 

</head> 
<body>
	<div id="header">PicViz HTML5 Viewer - PicViz For The Web :)</div>
	<div id="content">
	<div id="chart" style="margin-top:20px; margin-left:20px; width:700px; height:400px;"></div> 
	
	Layers: <span id="layers"><span>(will show up at runtime)</span></span>

	<div id="debug"></div>
	<form id="log" enctype="multipart/form-data" action="" method="POST">
	<input type="file" name="logfile" onchange="$('#startupload').click()"/>
	<button id="startupload">Upload Your LOG (syslog, apache, ...)</button>, or copy-paste your pgdl or log file:
	</form>
<?
if( $_FILES ) {
	$target_path = "uploads/";

	$path = $target_path.basename( $_FILES['logfile']['name']); 

	if(move_uploaded_file($_FILES['logfile']['tmp_name'], $path)) {
	    echo "The file ".  basename( $_FILES['logfile']['name']). " has been uploaded:";
            $text = str_replace( ";", ":", implode( "", file($target_path.$_FILES['logfile']['name']) ) );
	} else{
	    echo "There was an error uploading the file, please try again!";
	}
}
?>	<textarea rows="10" cols="80" id="pgdl"><?= $text ?></textarea>
	<br>
	Choose your log format: <select id="logtype">
	<option value="apache_access">apache access</option>
	<option value="syslog">syslog</option>
	</select>
	<br>
	Next step, <button onclick="convertToPgdl($('#pgdl'));">Convert LOG to PGDL and Create Graph</button> (Can take a while and freeze your browser if a lot of data) <button onclick="parseAndUpdatePlot($('#pgdl'));">Create Graph</button>
	</div>
	<div id="footer">Made by Lunatic Systems, based on <a href="http://wallinfire.net/picviz/">picviz</a> - <a href="http://github.com/locked/jqpicviz">Sources here</a></div>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-177177-8");
pageTracker._trackPageview();
} catch(err) {}</script>
</body> 
</html>
