#!/usr/bin/perl

$highest = 0;

print "header {\n";
print "    title = \"Syslog picviz analysis\";\n";
print "}\n";

print "axes {\n";
print "    timeline time [label=\"Time\"];\n"; # Time
print "    ipv4   ip [label=\"IP\"];\n"; # IP Source
print "    enum   useragent [label=\"User Agent\"];\n"; # User Agent
print "    enum  proto [label=\"Protocol\"];\n"; # Proto
print "    enum  request [label=\"Request\",relative=\"true\"];\n"; # Request type
print "    string   url [label=\"Log\", relative=\"true\"];\n"; # SRC
print "    integer respcode [label=\"Code\"];\n";
print "    integer size [label=\"Size\"];\n";
print "}\n";

print "data {\n";

while ($line = <>) {

        $line =~ s/\\/\\\\/g;
        $line =~ s/\"/\\"/g; # We escape our quotes
        $line =~ s/&//g;
        $line =~ s/<//g;
        $line =~ s/>//g;

# 192.168.3.198 - - [01/Nov/2008:11:07:59 +0100] "GET /picviz/browser/trunk/distribs/mandriva/picviz.spec?rev=203 HTTP/1.1" 200 4056 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
#        $line =~ m/(\d+.\d+.\d+.\d+) \-.*\- \[\d+\/\w+\/\d+:(\d+:\d+):\d+.*\] \\\"(\w+)(.*)/;
        $line =~ m/(\d+.\d+.\d+.\d+) \-.*\- \[\d+\/\w+\/\d+:(\d+:\d+):\d+.*\] \\\"(\w+) (\S+) (\S+)\\\" (\d+) (\d+) \\\"(\S+)\\\" \\\"(.*)\\\"/;

  $ip = $1;
  $time=$2;
  $request=$3;
  $url=$4;
  $proto=$5;
  $respcode=$6;
  $size=$7;
  $useragent=$9;

	if ($size > $highest) {
	    $highest = $size;
	}

        if ($1=="") {
        } else {
	    if ($useragent =~ m/.*bot.*/) {
	      print "    time=\"$time\", ip=\"$ip\", useragent=\"$useragent\", proto=\"$proto\", request=\"$request\", url=\"$url\", respcode=\"$respcode\", size=\"$size\" [inlayer=\"bot\"];\n";
	    } else {
	      print "    time=\"$time\", ip=\"$ip\", useragent=\"$useragent\", proto=\"$proto\", request=\"$request\", url=\"$url\", respcode=\"$respcode\", size=\"$size\" ;\n";
	    }
        }
}

print "}\n";

print $highest;
