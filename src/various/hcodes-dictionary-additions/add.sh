#!/bin/zsh -e
cd `dirname $0`

#rm -rf temp
mkdir -p temp
cd temp

#wget https://raw.githubusercontent.com/e2yo/eyo-kernel/master/tools/packer.js
wget https://raw.githubusercontent.com/e2yo/eyo-kernel/master/dictionary/safe.txt -O safe0.txt
node ../depack.js safe0.txt safe0.unpacked.txt

echo '' >>safe0.unpacked.txt
cat safe0.unpacked.txt ../additions.txt >>safe.unpacked.txt
rm safe0.txt safe0.unpacked.txt
sort -u -o safe.unpacked.txt safe.unpacked.txt
echo "const Packer = require('./packer'); new Packer('safe.unpacked.txt', 'safe.txt');" | node
rm safe.unpacked.txt #rm safe.unpacked.txt packer.js
