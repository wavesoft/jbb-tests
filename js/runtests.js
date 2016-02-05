

// Import the three profile
var profileTable = require("jbb-profile-three");
var profileLoader = require("jbb-profile-three/loader");

// Use BundlesLoader for loading the source bundle
var BundlesLoader = require("jbb/loader");
var BinaryDecoder = require("jbb/decoder");

// Get jquery for UI stuff
var $ = require('jquery');

/**
 * Run test by trying to load the source and the binary
 */
function run_test( bundle, row, callback ) {

	// Instantiate a new bundles loader
	var sourceLoader = new BundlesLoader( profileLoader, 'bundles' );
	// Instantiate a new binary decoder
	var binaryLoader = new BinaryDecoder( profileTable );

	// Run timing tests for source
	var load_source = function( cb ){
		console.time("source["+bundle+"]");
		sourceLoader.add( bundle );
		sourceLoader.load(function() {
			console.timeEnd("source["+bundle+"]");
			cb();
		});
	};

	// Run timing tests for binary
	var load_binary = function( cb ){
		console.time("compact["+bundle+"]");
		binaryLoader.add( 'build/bundles/'+bundle+'.jbb');
		binaryLoader.load(function() {
			console.timeEnd("compact["+bundle+"]");
			cb();
		});
	}

	// Run timing tests for binary
	var load_sparse_binary = function( cb ){
		console.time("sparse["+bundle+"]");
		binaryLoader.add( 'build/bundles/'+bundle+'.jbbp');
		binaryLoader.load(function() {
			console.timeEnd("compact["+bundle+"]");
			cb();
		});
	}

	// Reset rows
	row.find(".v-source").text("Running...");
	row.find(".v-compact").text("Running...");
	row.find(".v-sparse").text("Running...");

	// Run binary first
	var loadStart = Date.now();
	load_source(function() {
		var referenceDelta = Date.now() - loadStart;
		row.find(".v-source").html( referenceDelta + " ms");

		// Wait a sec
		setTimeout(function() {
			// Load source
			var loadStart = Date.now();
			load_binary(function() {
				var loadDelta = Date.now() - loadStart;

				// Calculate delta
				var percent = ((referenceDelta - loadDelta) / referenceDelta) * 100;
				if (percent > 0) {
					row.find(".v-compact").html( loadDelta + ' ms <span class="text-success">( +'+percent.toFixed(2)+' % )</span>');
				} else {
					row.find(".v-compact").html( loadDelta + ' ms <span class="text-danger">( '+percent.toFixed(2)+' % )</span>');
				}

				// Wait a sec
				setTimeout(function() {
					// Load source
					var loadStart = Date.now();
					load_sparse_binary(function() {
						var loadDelta = Date.now() - loadStart;

						// Calculate delta
						var percent = ((referenceDelta - loadDelta) / referenceDelta) * 100;
						if (percent > 0) {
							row.find(".v-sparse").html( loadDelta + ' ms <span class="text-success">( +'+percent.toFixed(2)+' % )</span>');
						} else {
							row.find(".v-sparse").html( loadDelta + ' ms <span class="text-danger">( '+percent.toFixed(2)+' % )</span>');
						}

						// Trigger callback
						callback();

					});
				}, 1000);

			});
		}, 1000);

	});

}

// Bind on click
$(function() {

	$("button#start-tests").click(function() {

		// Chain-run all tests
		run_test("vrml", $("#times-vrml"), function() {
			run_test("animated", $("#times-animated"), function() {
				run_test("heavy", $("#times-heavy"), function() {
					run_test("md2", $("#times-md2"), function() {

					});
				});
			});
		});

	});

});

global.run_test = run_test;
