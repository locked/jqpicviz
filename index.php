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
function is_string(v) {
	return parseInt(v)==v?false:true;
}

  
$(document).ready(function(){
/*
    data = [[2,"china",90], [7,"france",120], [8,"china",500], [4,"canada",60], [14,"france",160]];

    $.jqplot('chart', data, {
      legend:{show:true},
      seriesDefaults:{renderer:$.jqplot.PicVizRenderer, showLabel:false},
      axes:{xaxis:{ticks:["distance","country","size"]}},
      grid:{drawGridLines:false},
      highlighter: {yvalues: 2, sizeAdjust: 7.5, formatString:'<table class="jqplot-highlighter"><tr><td></td><td>%s</td></tr><tr><td></td><td>%s</td></tr><tr><td></td><td>%s</td></tr></table>'},
      cursor: {show: false}
    });
*/
});

function convertToPgdl( e ) {
	var logtype = $("#logtype").val();
	//$("#debug").append("logtype:"+logtype+"<br>");
	var data = e.val();
	$.post('convertPgdl.php', {'logtype':logtype, 'data':data}, function(pgdl) {
		$('#pgdl').html(pgdl);
	});
}

function updatePlot( e ) {
	var pgdl = parsePgdl( e );
	var data = [];
	for( l in pgdl.data ) {
		line = pgdl.data[l];
		var lineplot = [];
		//$("#debug").append("---- NEWLINE ----<br>");
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
		grid:{drawGridLines:false},
		highlighter: {yvalues: 2, sizeAdjust: 7.5, formatString:'<div style="display:none;">%s%s</div><table class="jqplot-highlighter"></tr><tr><td></td><td>%s</td></tr></table>'},
		cursor: {show: false}
	}).redraw();
}
</script> 

</head> 
<body>
	<div id="header">PGDL HTML5 Viewer - PicViz For The Web :)</div>
	<div id="content">
	<div id="chart" style="margin-top:20px; margin-left:20px; width:700px; height:400px;"></div> 
	<div id="debug"></div>
	<form id="log" enctype="multipart/form-data" action="" method="POST">
	<input type="file" name="logfile"/>
	<button>Upload Your LOG (syslog, user.log, ...)</button>, or copy-paste your pgdl or log file:
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
	<option value="syslog">syslog</option>
	<option value="apache_access">apache access</option>
	</select>
	<br>
	Next step, <button onclick="convertToPgdl($('#pgdl'))">Convert from LOG to PGDL</button>, then 
	<button onclick="updatePlot($('#pgdl'))">Create Graph From PGDL</button> (Can take a while and freeze your browser if a lot of data)
	</div>
	<div id="footer">Made by Lunatic Systems, based on <a href="http://wallinfire.net/picviz/">picviz</a> - <a href="http://github.com/locked/jqpicviz">Sources here</a></div>
</body> 
</html>
