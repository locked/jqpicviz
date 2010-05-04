<!DOCTYPE html> 
<html lang="en"> 
	<head> 
		<meta http-equiv="content-type" content="text/html; charset=utf-8"> 
		<title>Test 3</title> 
		
		<!--[if IE]><script language="javascript" type="text/javascript" src="../excanvas.js"></script><![endif]--> 
		  
		<link rel="stylesheet" type="text/css" href="jqplot/jquery.jqplot.css" /> 
		
		<!-- BEGIN: load jquery --> 
		<script language="javascript" type="text/javascript" src="jqplot/jquery-1.3.2.min.js"></script> 
		<!-- END: load jquery --> 
		
		<!-- BEGIN: load jqplot --> 
		<script language="javascript" type="text/javascript" src="jqplot/jquery.jqplot.js"></script> 
		<script language="javascript" type="text/javascript" src="jqplot/plugins/jqplot.categoryAxisRenderer.js"></script>
		<script language="javascript" type="text/javascript" src="jqplot.picviz.js"></script>
		<!-- END: load jqplot --> 
 
	<script type="text/javascript" language="javascript"> 
	  
	$(document).ready(function(){
    data = [[2,14,9], [7,2,12], [8,5,1], [4,40,6]];
    //data2 = [[["distance",2],["price",14],["size",9]], [["distance",7],["price",2],["size",12]], [["distance",8],["price",5],["size",1]]];

    $.jqplot('chart', data, {
      legend:{show:true},
      seriesDefaults:{renderer:$.jqplot.PicVizRenderer, showLabel:false},
      axes:{xaxis:{ticks:["distance","price","size"]}},
      grid:{drawGridLines:false}
    });
});
 
	</script> 
 
	</head> 
	<body> 
    <div id="chart" style="margin-top:20px; margin-left:20px; width:400px; height:240px;"></div> 
 
	</body> 
</html>
