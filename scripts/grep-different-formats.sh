#!/bin/sh -e
grep -o "^\s*==\s*Литература\s*==\s*$" ruwiki-my.txt | sort | uniq -c | sort -nr