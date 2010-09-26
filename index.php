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
	$("#loadsample").click(function(){
		$("#pgdl").html( $("#sample").html() );
	});
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
	<button id="startupload">Upload Your LOG (syslog, apache, ...)</button>
	</form>
	<button id="loadsample">Load sample data</button>
	<br> or copy-paste your pgdl or log file:
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


	<div id="sample" style="display:none;">
66.249.65.51 - - [19/Sep/2010:04:34:36 -0500] "GET /robots.txt HTTP/1.1" 200 51 "-" "Googlebot-Image/1.0"
66.249.65.51 - - [19/Sep/2010:04:34:40 -0500] "GET /media//img/logo.png HTTP/1.1" 304 - "-" "Googlebot-Image/1.0"
66.249.65.55 - - [19/Sep/2010:06:09:05 -0500] "GET /robots.txt HTTP/1.1" 200 51 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
66.249.65.55 - - [19/Sep/2010:06:09:07 -0500] "GET /zenphoto/index.php?album=image_yves/20041010%2040ans%20jean%20louis&page=5 HTTP/1.1" 301 242 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
67.195.37.168 - - [19/Sep/2010:07:09:01 -0500] "GET /robots.txt HTTP/1.0" 200 51 "-" "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)"
67.195.37.168 - - [19/Sep/2010:14:09:04 +0200] "GET /r5/contact/ HTTP/1.0" 301 192 "-" "Mozilla/5.0 (compatible; Yahoo! Slurp/3.0; http://help.yahoo.com/help/us/ysearch/slurp)"
67.195.37.168 - - [19/Sep/2010:07:09:04 -0500] "GET / HTTP/1.0" 200 4390 "-" "Mozilla/5.0 (compatible; Yahoo! Slurp/3.0; http://help.yahoo.com/help/us/ysearch/slurp)"
67.195.37.168 - - [19/Sep/2010:07:09:09 -0500] "GET /media/css/theme.css HTTP/1.0" 200 5182 "http://locked.myftp.org/" "Mozilla/5.0 (compatible; Yahoo! Slurp/3.0; http://help.yahoo.com/help/us/ysearch/slurp)"
66.249.65.51 - - [19/Sep/2010:10:13:53 -0500] "GET /robots.txt HTTP/1.1" 200 51 "-" "Googlebot-Image/1.0"
66.249.65.51 - - [19/Sep/2010:10:13:56 -0500] "GET /zenphoto/cache/image_celebrities/Helene%20Segara/HeleneSegara51_100_cw85_ch85_thumb.jpg HTTP/1.1" 301 191 "-" "Googlebot-Image/1.0"
208.80.194.32 - - [19/Sep/2010:10:39:04 -0500] "GET / HTTP/1.0" 200 14611 "-" "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; FunWebProducts; 3B 3.4; .NET CLR 1.1.4322)"
119.63.193.55 - - [19/Sep/2010:11:20:16 -0500] "GET / HTTP/1.1" 200 14611 "-" "Baiduspider+(+http://www.baidu.jp/spider/)"
190.120.232.106 - - [19/Sep/2010:14:28:40 -0500] "GET /user/soapCaller.bs HTTP/1.1" 301 20 "-" "Morfeus Fucking Scanner"
207.46.199.201 - - [19/Sep/2010:14:33:36 -0500] "GET /robots.txt HTTP/1.1" 200 25 "-" "msnbot/2.0b (+http://search.msn.com/msnbot.htm)"
66.249.65.51 - - [19/Sep/2010:15:53:47 -0500] "GET /robots.txt HTTP/1.1" 200 51 "-" "Googlebot-Image/1.0"
66.249.65.51 - - [19/Sep/2010:15:53:47 -0500] "GET /zenphoto/cache/image_yves/20041010%2040ans%20jean%20louis/jeanlouis0119_100_cw85_ch85_thumb.jpg HTTP/1.1" 301 191 "-" "Googlebot-Image/1.0"
66.249.65.51 - - [19/Sep/2010:17:44:43 -0500] "GET /robots.txt HTTP/1.1" 200 51 "-" "DoCoMo/2.0 N905i(c100;TB;W24H16) (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)"
	</div>
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
