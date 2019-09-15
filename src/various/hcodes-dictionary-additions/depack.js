const fs = require('fs');
const Packer = require('./temp/packer');

const [packedFilename, unpackedFilename] = process.argv.slice(2);

const packer = Object.create(Packer.prototype);
const wordsPacked = fs.readFileSync(packedFilename, 'utf-8');
const words = packer.depack(wordsPacked);
fs.writeFileSync(unpackedFilename, words.join('\n'));
