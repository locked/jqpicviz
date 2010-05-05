<?
//error_reporting(E_ALL);
$f = fopen("/tmp/tmp.log","w+");
if( $f ) {
	fwrite( $f, stripslashes( $_POST["data"] ) );
	fclose( $f );
}

switch( $_POST["logtype"] ) {
case "apache_access":
	$cmd = "apache-access2picviz.pl /tmp/tmp.log";
break;
case "syslog":
default:
	$cmd = "syslog2picviz.pl /tmp/tmp.log";
break;
}

$f = popen( "perl ".getcwd()."/$cmd 2>&1", "r" );
//echo "$f " . gettype($f) . "\n";
if( $f ) {
	while( !feof($f) ) {
		$l = fread( $f, 2048 );
		echo $l;
	}
	fclose( $f );
}
?>
