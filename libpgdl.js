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
	var params = value.split( "=" );
	var key = null;
	var val = null;
	//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VALUE:"+value+"<br>");
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
	}
	//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VALUE kv:"+key+"=="+val+"<br>");
	if( key!=null && val!=null ) {
		return [key,val];
	}
	return null;
}

function parseLine( line ) {
	var params = line.split( "," );
	var matches = line.match(/([a-zA-Z]+="[ \d\w_:,.\/\(\)-]+")+[, ;]*/g);
	//$("#debug").append("matches:"+matches);
	var values = {};
	var count=0;
	/*
	for( p in params ) {
		param = params[p];
		vals = parseValue( param );
		if( vals!=null && vals!=[] && vals!="" ) {
			//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;ADD PARAM:"+vals+"<br>");
			values[vals[0]] = vals[1];
			count++;
		}
	}
	*/
	
	for( p in matches ) {
		param = matches[p];
		//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;PARSE PARAM:"+param+"<br>");
		vals = parseValue( param );
		if( vals!=null && vals!=[] && vals!="" ) {
			//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;ADD PARAM:"+vals[1]+"<br>");
			values[vals[0]] = vals[1];
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
				line_values = parseLine( line );
				if( line_values!={} && line_values!=null && line_values!="" ) {
					if( blocname=="header" ) {
						//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;ADD blocname:"+blocname+":"+line_values.title+"<br>");
						header.push( line_values );
					} else if( blocname=="axes" ) {
						//$("#debug").append("&nbsp;&nbsp;&nbsp;&nbsp;ADD blocname:"+blocname+":"+line_values+"<br>");
						axes.push( line_values );
					} else if( blocname=="data" ) {
						data.push( line_values );
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
