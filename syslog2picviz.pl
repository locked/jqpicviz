#!/usr/bin/perl
#
# For python folks: show me the equivalent code for this
#

print "header {\n";
print "    title = \"Syslog picviz analysis\";\n";
print "}\n";

print "axes {\n";
print "    timeline t [label=\"Time\"];\n"; # Time
print "    enum   m [label=\"Machine\"];\n"; # Machine
print "    enum   a [label=\"Application\"];\n"; # Application
print "    string   l [label=\"Log\",relative=\"true\"];\n"; # Log
print "}\n";

print "data {\n";

while ($line = <>) {

	$line =~ s/\\/\\\\/g;
        $line =~ s/\"/\\"/g; # We escape our quotes
        $line =~ s/&//g; # We escape our quotes
        $line =~ s/<//g; # We escape our quotes
        $line =~ s/>//g; # We escape our quotes
	$line =~ m/\w+  ?\d+ (\d+:\d+):\d+ ([\w-.]+) (\S+) (.*)/;

        $t=$1;
        $m=$2;
        $a=$3;
        $l=$4;

        if ($l =~ m/.*[sS]eg.*[fF]ault.*/) {
                print "    t=\"$t\",m=\"$m\",a=\"$a\",l=\"$l\" [color=\"red\"];\n";
        } else {
                        print "    t=\"$t\",m=\"$m\",a=\"$a\",l=\"$l\";\n";
        }
}

print "}\n";


