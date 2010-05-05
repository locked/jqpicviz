/**
 * Copyright (c) 2010 Adam Etienne
 * This software is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly.
 */
function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}


function parseValue( value ) {
	var key = null;
	var val = null;
	var type = null;
	
	//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VALUE CHK:"+value+"<br>");
	var matches = value.match(/\s*(\w+\d*)\s+(\w+\d*)\s*[\[;,\]=\w\d\s]*/i);
	if( matches && matches.length>2 ) {
		//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value matche2:"+matches[1]+" matche2:"+matches[2]+"<br>");
		type = matches[1];
		switch( type ) {
		case "timeline":
		case "enum":
		case "ipv4":
		case "ipv6":
		case "string":
		case "integer":
		break;
		default:
			type = null;
		}
	/*for( p in matches ) {
		param = matches[p];
		if( param && param.length>1 ) {
			type = trim( param ).split(" ");
			$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;PARSE VALUE:"+param+" type:"+type+"<br>");
		}
	}*/
	}
	
	var params = value.split( "=" );
	for( p in params ) {
		param = trim( params[p] );
		if( param.length==0 ) continue;
		if( param.indexOf('"')>-1 )
			param = trim( param.substring( param.indexOf('"')+1, param.lastIndexOf('"') ) );
		else {
			param = trim( param );
			param = param.substring( param.lastIndexOf(' ')+1, param.length );
			param = param.substring( param.lastIndexOf('\[')+1, param.length );
			param = param.substring( param.lastIndexOf('\t')+1, param.length );
		}
		if( p==0 ) key = param;
		else if( p==1 ) val = param;
		if( key=="relative" ) return null;
		if( key!=null && val!=null ) {
			//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VALUE kv:"+key+"=="+val+" type:"+type+"<br>");
			return [key,val,type];
		}
	}
	
	return null;
}

function parseLine( line ) {
	var params = line.split( "," );
	//var matches = line.match(/([a-zA-Z]+[ ]*=[ ]*"[ \d\w_:,.\/\(\)-]+")+[, ;]*/g);
	//var matches = line.match(/\w+\s*\w+\s*\[{0,1}\w+\s*=\s*"[ \d\w_:,.\/\(\)-]*"/g);
	var matches = line.match(/[\w+\s*\w+\s*\[]{0,1}\w+\s*=\s*"[ \d\w_:,@.\/\(\)-?%]*"/g);
	//$("#debug").append("matches:"+matches+"<br>");
	var values = {};
	var count=0;
	
	//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;START parseLine  -- matches:"+matches+"<br>");
	for( p in matches ) {
		param = matches[p];
		//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;PARSE PARAM:"+param+"<br>");
		vals = parseValue( param );
		if( vals!=null && vals!=[] && vals!="" ) {
			//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;ADD key:"+vals[0]+" val:"+vals[1]+" type:"+vals[2]+"<br>");
			values[vals[0]] = vals[1];
			if( vals[2] )
				values['_type'] = vals[2];
			count++;
		}
	}
	if( count>0 )
		return values;
	return null;
}

function parsePgdl(e) {
	var str = e.val();
	var blocs = str.split( "{" );
	var header = [];
	var axes = [];
	var axes_types = [];
	var data = [];
	for( b in blocs ) {
		bloc = blocs[b];
		if( bloc.indexOf('}')>0 ) {
			// Block content
			content = bloc.substring( 0, bloc.indexOf('}') );
			//$("#debug").append("CONTENT: header:"+header+" content:"+content+"<br>");
			var lines = content.split( ";" );
			for( v in lines ) {
				line = lines[v];
				line_values_types = parseLine( line );
				
				if( line_values_types!={} && line_values_types!=null && line_values_types!="" ) {
					if( blocname=="header" ) {
						//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;ADD blocname:"+blocname+":"+line_values.title+"<br>");
						header.push( line_values_types );
					} else if( blocname=="axes" ) {
						//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;ADD blocname:"+blocname+":"+line_values+"<br>");
						axes.push( line_values_types );
					} else if( blocname=="data" ) {
						data.push( line_values_types );
					}
				}
			}
			blocname = trim( bloc.substr( bloc.indexOf('}')+2, 250 ) );
			//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;NEW bn:"+blocname+":"+blocname.lastIndexOf('\r')+"=="+blocname.lastIndexOf('\n')+"<br>");
		} else {
			// Block header
			blocname = trim( bloc );
			/*
			blocname = blocname.substring( blocname.lastIndexOf('\t')+1, blocname.length );
			blocname = blocname.substring( blocname.lastIndexOf('\r')+1, blocname.length );
			blocname = blocname.substring( blocname.lastIndexOf('\n')+1, blocname.length );
			blocname = blocname.substring( blocname.lastIndexOf('\r\n')+1, blocname.length );
			*/
		}
		//var blocs = str.split( "{" );
        }
	//$("#debug").append("header:"+header[0].title+" axes:"+axes[1].label+" data:"+data[0].time+"<br>");
	return {'header':header, 'axes':axes, 'data':data};
}
