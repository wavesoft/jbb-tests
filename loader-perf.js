
var BinaryDecoder = require("jbb").BinaryDecoder;
var JBBProfileThree = require("jbb-profile-three");
var fs = require("fs");

/**
 * Read filename to buffer
 */
function readChunk( filename ) {
	// Read into buffer
	var file = fs.readFileSync(filename),
		u8 = new Uint8Array(file);
	// Return buffer
	return u8.buffer;
}

global.Blob = function(url) { }
global.URL = { createObjectURL: function(blob) { } };

// Instantiate a new binary decoder
var binaryLoader = new BinaryDecoder( JBBProfileThree, 'build/bundles' );

// Load bundle blocks
binaryLoader.addByBuffer( readChunk("build/bundles/md2.jbb") );
binaryLoader.load();

