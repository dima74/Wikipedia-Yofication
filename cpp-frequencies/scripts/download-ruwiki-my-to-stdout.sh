#!/bin/sh -e
cd `dirname $0`/..
scripts/download-pages-articles-bz2-to-stdout.sh | bunzip2 | cmake-build-debug/converter