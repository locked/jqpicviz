<?
//error_reporting(E_ALL);

$f = fopen("/tmp/tmp.log","w+");
if( $f ) {
	fwrite( $f, $_POST["data"] );
	fclose( $f );
}

$f = popen( "perl ".getcwd()."/syslog2picviz.pl /tmp/tmp.log 2>&1", "r" );
//echo "$f " . gettype($f) . "\n";
if( $f ) {
	while( !feof($f) ) {
		$l = fread( $f, 2048 );
		echo $l;
	}
	fclose( $f );
}
?>
